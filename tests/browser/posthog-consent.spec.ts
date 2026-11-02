import { test, expect, type Page, type BrowserContext } from "playwright/test";
import { gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";

// Opt in only against a separately built production-mode LOCAL server. The
// browser sees the production origin, but this harness never fetches that host.
const localURL = process.env.POSTHOG_E2E_LOCAL_URL;
const productionOrigin = "https://driveexotiq.com";
const consentKey = "driveexotiq_cookie_consent";
type Event = { event: string; properties: Record<string, unknown> };
type Harness = { events: Event[]; requests: string[]; configLoads: string[]; failures: string[]; tokenFingerprints: string[] };

test.describe("PostHog consent lifecycle with isolated real SDK", () => {
  test.skip(!localURL, "Set POSTHOG_E2E_LOCAL_URL to a local production-mode build with a PostHog test key.");
  test.setTimeout(45000);
  test.use({ serviceWorkers: "block", contextOptions: { reducedMotion: "reduce" } });

  async function isolate(context: BrowserContext, options: {
    origin?: string; consent?: boolean; signal?: "gpc" | "dnt";
  } = {}): Promise<Harness> {
    const upstream = new URL(localURL!);
    expect(["127.0.0.1", "localhost", "[::1]"]).toContain(upstream.hostname);
    const origin = options.origin || productionOrigin;
    const result: Harness = { events: [], requests: [], configLoads: [], failures: [], tokenFingerprints: [] };
    await context.addInitScript(({ key, consent, signal }) => {
      // The real SDK intentionally drops all automated-browser events. Treat
      // this isolated context as a visitor so consent delivery is exercised;
      // the network firewall below still prevents any real analytics traffic.
      Object.defineProperty(navigator, "webdriver", { configurable: true, get: () => false });
      Object.defineProperty(navigator, "userAgentData", { configurable: true, get: () => undefined });
      if (signal === "gpc") Object.defineProperty(navigator, "globalPrivacyControl", { configurable: true, get: () => true });
      if (signal === "dnt") Object.defineProperty(navigator, "doNotTrack", { configurable: true, get: () => "1" });
      if (consent) localStorage.setItem(key, JSON.stringify({ functional: false, analytics: true, marketing: false, timestamp: new Date().toISOString() }));
      else localStorage.removeItem(key);
    }, { key: consentKey, consent: options.consent, signal: options.signal });
    await context.route("**/*", async route => {
      const request = route.request();
      const url = new URL(request.url());
      if (/(^|\.)posthog\.com$/.test(url.hostname)) {
        const safePath = url.pathname.replace(/phc_[A-Za-z0-9_-]+/g, "[public-project-key]");
        result.requests.push(safePath);
        if (/\/array\/[^/]+\/config(?:\.js)?$/.test(url.pathname)) {
          result.configLoads.push(safePath);
          const token = decodeURIComponent(url.pathname.split("/")[2]);
          const config = { supportedCompression: [] };
          if (url.pathname.endsWith(".js")) {
            await route.fulfill({ contentType: "application/javascript", body: `window._POSTHOG_REMOTE_CONFIG=window._POSTHOG_REMOTE_CONFIG||{};window._POSTHOG_REMOTE_CONFIG[${JSON.stringify(token)}]={config:${JSON.stringify(config)}};` });
          } else await route.fulfill({ json: config });
          return;
        }
        if (/\/(?:e|i\/v\d+\/e)\/?$/.test(url.pathname)) {
          try {
            let body = request.postDataBuffer();
            let value: unknown;
            if (body?.[0] === 0x1f && body[1] === 0x8b) body = gunzipSync(body);
            const raw = body?.toString("utf8") || "";
            if (/^\s*[\[{]/.test(raw)) value = JSON.parse(raw);
            else {
              const encoded = new URLSearchParams(raw).get("data") || url.searchParams.get("data");
              if (!encoded) throw new Error("No event payload");
              value = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
            }
            const events = Array.isArray(value) ? value
              : value && typeof value === "object" && "batch" in value && Array.isArray(value.batch) ? value.batch
              : [value];
            for (const event of events) {
              if (!event || typeof event !== "object" || typeof event.event !== "string") throw new Error(`Malformed event payload: ${JSON.stringify(event && typeof event === "object" ? Object.keys(event) : typeof event)}`);
              result.events.push(event as Event);
              if (typeof event.properties?.token === "string") {
                const fingerprint = createHash("sha256").update(event.properties.token).digest("hex").slice(0, 12);
                if (!result.tokenFingerprints.includes(fingerprint)) result.tokenFingerprints.push(fingerprint);
              }
            }
          } catch (error) { result.failures.push(`Could not inspect ${url.pathname}: ${String(error)}`); }
          await route.fulfill({ json: { status: 1 } });
          return;
        }
        // Unexpected replay/extension/ingestion endpoints fail the assertion;
        // they are never allowed to reach PostHog.
        result.failures.push(`Unexpected PostHog request: ${safePath}`);
        await route.abort("blockedbyclient");
        return;
      }
      if (url.origin === origin) {
        if (!["GET", "HEAD"].includes(request.method()) || url.pathname.startsWith("/api/")) {
          result.failures.push(`Blocked application side effect: ${request.method()} ${url.pathname}`);
          await route.fulfill({ status: 503, json: { error: "Test harness forbids provider and form requests" } });
          return;
        }
        const target = new URL(url.pathname + url.search, upstream);
        // No redirect may escape this localhost fetch. Browser redirects are
        // intercepted again by this handler before any network operation.
        const response = await route.fetch({ url: target.href, headers: { ...request.headers(), host: upstream.host }, maxRedirects: 0 });
        await route.fulfill({ response });
        return;
      }
      // Block GA, Meta, Cloudflare beacons, remote media and all other external
      // origins. This includes accidental links to the real production host.
      await route.abort("blockedbyclient");
    });
    return result;
  }

  async function consentAnalytics(page: Page, enabled = true) {
    const dialog = page.getByRole("dialog", { name: "Cookie consent" });
    if (!await dialog.isVisible()) await page.getByRole("button", { name: "Cookie Settings", exact: true }).click();
    const toggle = dialog.getByRole("button", { name: "Analytics cookies", exact: true });
    if (!await toggle.isVisible()) await dialog.getByRole("button", { name: "Manage", exact: true }).click();
    if ((await toggle.getAttribute("aria-pressed") === "true") !== enabled) await toggle.click();
    await dialog.getByRole("button", { name: "Save preferences", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).analytics, consentKey)).toBe(enabled);
  }

  function views(result: Harness) { return result.events.filter(event => event.event === "$pageview"); }
  async function settle(page: Page) {
    // Negative assertions must span the application's load/idle gate and the
    // SDK's normal ~3s batching window, rather than pass before timers fire.
    await page.waitForLoadState("load");
    await page.waitForTimeout(4000);
  }
  function assertSafe(result: Harness) {
    expect(result.failures).toEqual([]);
    const allowed = new Set(["$pageview", "$pageleave", "CTA", "Signup", "Form Start", "Validation Error", "Submission Failure", "Garage Selection", "Page Depth", "Film Depth", "Video Play", "Video Progress", "Video Complete", "Video Replay", "Video Failure"]);
    expect(result.events.filter(event => !allowed.has(event.event)).map(event => event.event)).toEqual([]);
    if (result.events.length > 0) {
      expect(result.tokenFingerprints).toHaveLength(1);
      if (process.env.POSTHOG_E2E_KEY_FINGERPRINT) expect(result.tokenFingerprints[0]).toBe(process.env.POSTHOG_E2E_KEY_FINGERPRINT);
      console.log(`Captured PostHog project fingerprint: ${result.tokenFingerprints[0]}`);
    }
    for (const event of result.events) {
      expect(event.properties.$set).toBeUndefined();
      expect(event.properties.$set_once).toBeUndefined();
      expect(event.properties.$snapshot_data).toBeUndefined();
      expect(event.properties.$heatmap_data).toBeUndefined();
      expect(String(event.properties.$current_url)).not.toContain("private-fixture");
    }
  }

  test("no SDK traffic before consent, including form focus and public navigation", async ({ page, context }) => {
    const result = await isolate(context);
    await page.goto(`${productionOrigin}/apply`);
    await expect(page.getByRole("dialog", { name: "Cookie consent" })).toBeVisible();
    await page.locator('input[name="email"]').focus();
    await page.locator('footer a[href="/marketplace"]').click();
    await expect(page).toHaveURL(`${productionOrigin}/marketplace`);
    await settle(page);
    expect(result.requests).toEqual([]);
    assertSafe(result);
  });

  test("consent starts one SDK lifecycle, preserves named events and deduplicates pageviews", async ({ page, context }) => {
    const result = await isolate(context);
    await page.goto(`${productionOrigin}/apply?email=private-fixture#private-fixture`);
    await consentAnalytics(page);
    await expect.poll(() => views(result).length, { timeout: 15000 }).toBe(1);
    await page.locator('input[name="email"]').fill("private-fixture@example.com");
    await page.locator('footer a[href="/marketplace"]').click();
    await expect(page).toHaveURL(`${productionOrigin}/marketplace`);
    await expect.poll(() => views(result).length, { timeout: 15000 }).toBe(2);
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("cookie-consent-changed"));
      window.dispatchEvent(new Event("storage"));
    });
    await settle(page);
    expect(views(result).map(event => event.properties.$pathname)).toEqual(["/apply", "/marketplace"]);
    expect(new Set(views(result).map(event => event.properties.distinct_id)).size).toBe(1);
    expect(typeof views(result)[0].properties.distinct_id).toBe("string");
    expect(result.configLoads).toHaveLength(1);
    expect(result.events.some(event => event.event === "Form Start" && event.properties.form === "apply")).toBe(true);
    expect(result.events.some(event => event.event === "CTA" && event.properties.href === "/marketplace")).toBe(true);
    expect(JSON.stringify(result.events)).not.toContain("private-fixture");
    const storage = await page.evaluate(() => [...Object.keys(localStorage), ...Object.keys(sessionStorage)]);
    expect(storage.filter(key => /^(ph_|posthog)/i.test(key))).toEqual([]);
    expect((await context.cookies()).filter(cookie => /^(ph_|posthog)/i.test(cookie.name))).toEqual([]);
    assertSafe(result);
  });

  test("revocation stops collection and a later grant resumes without reinitializing", async ({ page, context }) => {
    const result = await isolate(context);
    await page.goto(`${productionOrigin}/apply`);
    await consentAnalytics(page);
    await expect.poll(() => views(result).length, { timeout: 15000 }).toBe(1);
    await consentAnalytics(page, false);
    const count = result.events.length;
    await page.locator('footer a[href="/marketplace"]').click();
    await expect(page).toHaveURL(`${productionOrigin}/marketplace`);
    await page.locator('input[name="email"]').focus();
    await settle(page);
    expect(result.events.length).toBe(count);
    await consentAnalytics(page);
    await expect.poll(() => views(result).length, { timeout: 15000 }).toBe(2);
    expect(views(result)[1].properties.$pathname).toBe("/marketplace");
    expect(result.configLoads).toHaveLength(1);
    assertSafe(result);
  });

  for (const signal of ["gpc", "dnt"] as const) {
    test(`${signal.toUpperCase()} overrides stored and newly granted analytics consent`, async ({ page, context }) => {
      const result = await isolate(context, { consent: true, signal });
      await page.goto(`${productionOrigin}/apply`);
      await consentAnalytics(page, false);
      await consentAnalytics(page, true);
      await page.locator('input[name="email"]').focus();
      await settle(page);
      expect(result.requests).toEqual([]);
      assertSafe(result);
    });
  }

  test("production config refuses a nonproduction origin even with consent", async ({ page, context }) => {
    const origin = "https://not-production.invalid";
    const result = await isolate(context, { origin, consent: true });
    await page.goto(`${origin}/apply`);
    await page.locator('input[name="email"]').focus();
    await settle(page);
    expect(result.requests).toEqual([]);
    assertSafe(result);
  });
});
