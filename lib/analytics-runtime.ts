import type { PostHog, PostHogConfig, CaptureResult } from "posthog-js";
import { analyticsAdminPath, analyticsEvents, analyticsPath, safeAnalyticsProps } from "@/lib/analytics-privacy";
import { createCampaignAttribution } from "@/lib/analytics-attribution";

type Config = { key: string; host: string; environment: "production" | "preview" };
type State = { consent: boolean; ready: boolean; pathname: string; origin: string; search?: string; referrer?: string };
type Client = Pick<PostHog, "init" | "capture" | "set_config" | "opt_in_capturing" | "opt_out_capturing" | "reset" | "startSessionRecording" | "stopSessionRecording">;

function acquisitionChannel(state: State) {
  const medium = new URLSearchParams(state.search).get("utm_medium")?.toLowerCase();
  if (["cpc", "ppc", "paid", "paid_social"].includes(medium || "")) return "paid";
  if (medium === "email") return "email";
  if (["social", "organic_social"].includes(medium || "")) return "social";
  if (medium === "referral") return "referral";
  if (medium === "qr") return "qr";
  try {
    const referrer = new URL(state.referrer || "");
    if (referrer.origin === state.origin) return "internal";
    if (/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com)$/.test(referrer.hostname)) return "search";
    if (/(^|\.)(facebook\.com|instagram\.com|linkedin\.com|t\.co)$/.test(referrer.hostname)) return "social";
    return "referral";
  } catch { return "direct"; }
}

export function analyticsConfig(input: { preview: boolean; production: boolean; key?: string; previewKey?: string; region?: string }): Config | null {
  const key = input.preview ? input.previewKey : input.key;
  if (!key || !/^phc_[A-Za-z0-9_-]+$/.test(key) || (!input.preview && !input.production)) return null;
  if (input.region !== "us" && input.region !== "eu") return null;
  return { key, host: `https://${input.region}.i.posthog.com`, environment: input.preview ? "preview" : "production" };
}

/** Owns one SDK instance. Loading itself is behind consent and initial-page work. */
export function createAnalyticsRuntime(config: Config | null, state: () => State, load: () => Promise<Client> = async () => (await import("posthog-js")).default) {
  let client: Client | undefined;
  let pending: Promise<void> | undefined;
  let active = false;
  let lastPage: string | undefined;
  let loadFailed = false;
  let channel = "direct";
  const campaign = createCampaignAttribution();
  const eligible = () => Boolean(config && state().ready && state().consent && !analyticsAdminPath(state().pathname));
  const safeUrl = (raw: string) => {
    try {
      const url = new URL(raw, state().origin);
      return url.origin === state().origin ? `${url.origin}${analyticsPath(url.pathname)}` : "";
    } catch { return ""; }
  };
  const beforeSend = (event: CaptureResult | null): CaptureResult | null => {
    if (!event || !active || !eligible()) return null;
    if (!analyticsEvents.has(event.event) && !["$pageview", "$pageleave", "$autocapture", "$$heatmap", "$snapshot"].includes(event.event)) return null;
    const raw = event.properties || {};
    const currentUrl = typeof raw.$current_url === "string" && safeUrl(raw.$current_url) || `${state().origin}${analyticsPath(state().pathname)}`;
    const properties: Record<string, unknown> = {
      ...safeAnalyticsProps(raw), ...campaign.properties(), environment: config!.environment, acquisition_channel: channel,
      // Required SDK ingestion metadata, sourced from config rather than event input.
      token: config!.key,
      $process_person_profile: false,
      $current_url: currentUrl,
      $pathname: new URL(currentUrl).pathname,
    };
    // Keep only known SDK metadata and anonymous SDK-generated IDs, not $set/person data.
    for (const key of ["$browser", "$browser_version", "$os", "$os_version", "$device_type", "$lib", "$lib_version", "$event_type"]) {
      if (typeof raw[key] === "string" && /^[a-zA-Z0-9 ._-]{1,60}$/.test(raw[key])) properties[key] = raw[key];
    }
    for (const key of ["distinct_id", "$device_id", "$session_id", "$window_id", "$pageview_id"]) {
      if (typeof raw[key] === "string" && /^[a-f0-9-]{16,64}$/i.test(raw[key])) properties[key] = raw[key];
    }
    for (const [key, value] of Object.entries(raw)) {
      if (/^\$(viewport|screen|prev_pageview|time|session_duration)/.test(key) && typeof value === "number" && Number.isFinite(value)) properties[key] = value;
    }
    if (event.event === "$autocapture" && Array.isArray(raw.$elements)) {
      properties.$elements = raw.$elements.map((el: Record<string, unknown>) => ({
        tag_name: typeof el.tag_name === "string" && /^[a-z0-9-]+$/.test(el.tag_name) ? el.tag_name : "",
        nth_child: typeof el.nth_child === "number" ? el.nth_child : 0,
        nth_of_type: typeof el.nth_of_type === "number" ? el.nth_of_type : 0,
      }));
    }
    if (raw.$heatmap_data && typeof raw.$heatmap_data === "object") {
      properties.$heatmap_data = Object.fromEntries(Object.entries(raw.$heatmap_data).flatMap(([url, points]) => {
        const clean = safeUrl(url);
        if (!clean || !Array.isArray(points)) return [];
        return [[clean, points.filter(point => point !== null && typeof point === "object" && !Array.isArray(point)).map(point => Object.fromEntries(Object.entries(point).filter(([key, value]) =>
          (["x", "y"].includes(key) && typeof value === "number" && Number.isFinite(value)) ||
          (key === "target_fixed" && typeof value === "boolean") ||
          (key === "type" && ["click", "mousemove", "scroll", "deadclick", "rageclick"].includes(String(value))),
        )))]];
      }));
    }
    // rrweb payloads have their own strict masks and URL/network filter below.
    if (event.event === "$snapshot") {
      for (const key of ["$snapshot_data", "$snapshot_bytes"]) if (raw[key] !== undefined) properties[key] = raw[key];
    }
    return { ...event, properties };
  };

  const options: Partial<PostHogConfig> = {
    api_host: config?.host,
    defaults: "2026-08-30",
    capture_pageview: false,
    capture_pageleave: true,
    capture_heatmaps: true,
    autocapture: { dom_event_allowlist: ["click"], element_allowlist: ["a", "button"], capture_copied_text: false },
    mask_all_text: true,
    mask_all_element_attributes: true,
    persistence: "memory",
    disable_persistence: true,
    opt_out_capturing_by_default: true,
    opt_out_persistence_by_default: true,
    cross_subdomain_cookie: false,
    person_profiles: "never",
    ip: false,
    save_referrer: false,
    store_google: false,
    disable_capture_url_hashes: true,
    get_current_url: safeUrl,
    disable_surveys: true,
    capture_exceptions: false,
    capture_performance: false,
    capture_dead_clicks: false,
    enable_recording_console_log: false,
    disable_session_recording: true,
    advanced_disable_feature_flags: true,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "*",
      maskAllElementAttributes: true,
      blockSelector: "input[type=hidden], input[type=file], iframe, canvas, .ph-no-capture",
      recordCrossOriginIframes: false,
      recordBody: false,
      recordHeaders: false,
      streamNetworkBody: false,
      captureJsonLd: false,
      captureCanvas: { recordCanvas: false },
      maskCapturedNetworkRequestFn: (request) => {
        // Replay's own URL metadata calls this with only {name}; discard all network entries.
        if (!eligible() || Object.keys(request).some(key => key !== "name")) return null;
        const name = safeUrl(request.name || "");
        return name ? { ...request, name } : null;
      },
    },
    before_send: beforeSend,
  };

  const stop = () => {
    if (!active || !client) return;
    active = false;
    lastPage = undefined;
    client.set_config({ capture_heatmaps: false, autocapture: false, capture_pageleave: false });
    client.stopSessionRecording();
    client.opt_out_capturing();
    client.reset(true);
    client.opt_out_capturing();
  };
  const page = () => {
    const path = analyticsPath(state().pathname);
    if (state().pathname !== lastPage) {
      lastPage = state().pathname;
      client?.capture("$pageview", { $current_url: `${state().origin}${path}` });
    }
  };
  return {
    async sync() {
      if (!eligible()) {
        if (!state().consent) campaign.clear();
        stop(); return;
      }
      const tags = campaign.capture(state().search);
      if (loadFailed) return;
      if (!client) {
        if (!pending) pending = (async () => {
          try {
            const sdk = await load();
            if (!eligible()) return;
            client = sdk;
            sdk.init(config!.key, options);
          } catch { loadFailed = true; }
          finally { pending = undefined; }
        })();
        await pending;
      }
      if (!eligible() || !client) return;
      if (!active) {
        channel = acquisitionChannel({ ...state(), search: tags.utm_medium ? new URLSearchParams(tags).toString() : state().search });
        active = true;
        client.set_config({ capture_heatmaps: true, autocapture: options.autocapture, capture_pageleave: true });
        client.opt_in_capturing({ captureEventName: false });
        client.startSessionRecording();
      }
      page();
    },
    capture(event: string, props?: Record<string, string | number>) {
      if (active && eligible() && analyticsEvents.has(event)) client?.capture(event, safeAnalyticsProps(props));
    },
    stop,
  };
}
