// PostHog product analytics for driveexotiq.com — consent-gated, anonymous, lazy.
//
// The rules, in order:
//  1. Nothing loads until the visitor accepts analytics cookies in the consent
//     bar (lib/cookie-consent). Reject or revoke → capturing stops and PostHog's
//     cookie + local storage are cleared. Global Privacy Control and Do Not Track
//     count as a refusal regardless of the bar.
//  2. Production host only (driveexotiq.com / www), so deploy previews and local
//     builds never pollute the project. NEXT_PUBLIC_POSTHOG_HOSTS overrides the
//     list (comma-separated) for a one-off check.
//  3. Anonymous by policy: person_profiles 'never' (no identify, no profile),
//     autocapture off, no session recording, no surveys. What is captured:
//     $pageview / $pageleave and the named events lib/analytics.ts already fires
//     (CTA, Film Depth, Signup) — the same props Plausible gets, nothing more.
//  4. The library is imported on demand: a visitor who never consents never
//     downloads it.
//
// Same PostHog project as the renter marketplace (book.exotiq.rent), so one
// dashboard sees marketing traffic beside booking traffic. Identity is NOT
// stitched across the two domains (both sites are anonymous by policy), so
// funnels are per site; cross-domain attribution is a separate decision.
import { getConsentPreferences } from '@/lib/cookie-consent';

type PostHogClient = typeof import('posthog-js').default;

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const REGION = process.env.NEXT_PUBLIC_POSTHOG_REGION === 'eu' ? 'eu' : 'us';
const API_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || `https://${REGION}.i.posthog.com`;
const UI_HOST = `https://${REGION}.posthog.com`;
const PRODUCTION_HOSTS = (process.env.NEXT_PUBLIC_POSTHOG_HOSTS || 'driveexotiq.com,www.driveexotiq.com')
  .split(',')
  .map((h) => h.trim())
  .filter(Boolean);

let client: PostHogClient | null = null;
let loading: Promise<PostHogClient> | null = null;

/** True only when every gate is open: key set, production host, no GPC/DNT, analytics consent. */
export function analyticsAllowed(): boolean {
  if (typeof window === 'undefined' || !KEY) return false;
  if (!PRODUCTION_HOSTS.includes(window.location.hostname)) return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.globalPrivacyControl === true) return false;
  if (nav.doNotTrack === '1') return false;
  return getConsentPreferences()?.analytics === true;
}

/**
 * Load the library (once) and start capturing. Resolves to the client, or null
 * when a gate is closed — including when consent was withdrawn while the
 * library was still downloading.
 */
export async function startPostHog(): Promise<PostHogClient | null> {
  if (!analyticsAllowed()) return null;
  if (!loading) {
    loading = import('posthog-js').then(({ default: posthog }) => {
      posthog.init(KEY as string, {
        api_host: API_HOST,
        ui_host: UI_HOST,
        person_profiles: 'never',
        autocapture: false,
        capture_pageview: false, // PostHogAnalytics fires $pageview per App Router navigation
        capture_pageleave: true,
        disable_session_recording: true,
        disable_surveys: true,
        respect_dnt: true,
        persistence: 'localStorage+cookie',
        cross_subdomain_cookie: false,
        secure_cookie: true,
        cookie_expiration: 365,
      });
      client = posthog;
      return posthog;
    });
  }
  const posthog = await loading;
  if (!analyticsAllowed()) {
    // Consent changed while the library was downloading: honour the new answer.
    posthog.opt_out_capturing();
    return null;
  }
  if (posthog.has_opted_out_capturing()) posthog.opt_in_capturing({ captureEventName: null });
  return posthog;
}

/**
 * Stop capturing and forget the visitor. opt_out_capturing() stops sending and
 * remembers the refusal (one localStorage flag); it does not remove the data
 * PostHog already stored, so the cookie and the localStorage entry are cleared
 * here explicitly — withdrawing consent must leave nothing behind.
 */
export function stopPostHog(): void {
  if (!client || client.has_opted_out_capturing()) return;
  client.opt_out_capturing();
  client.persistence?.clear();
  client.sessionPersistence?.clear();
}

function capturing(): PostHogClient | null {
  return client && !client.has_opted_out_capturing() ? client : null;
}

export function capturePageview(): void {
  capturing()?.capture('$pageview');
}

/** Mirror of lib/analytics.ts `track`: no-op until the visitor has consented. */
export function captureEvent(event: string, properties?: Record<string, string | number>): void {
  capturing()?.capture(event, properties);
}
