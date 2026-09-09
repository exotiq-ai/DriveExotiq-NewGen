// Existing cookieless Plausible reporting is preserved. PostHog is separately
// enabled only after analytics consent, configuration and initial-page work.

import { isPreview } from '@/lib/preview';
import { analyticsAdminPath, analyticsEvents, safeAnalyticsProps } from '@/lib/analytics-privacy';
import { createAnalyticsRuntime, analyticsConfig } from '@/lib/analytics-runtime';
import { getConsentPreferences } from '@/lib/cookie-consent';

let ready = false;
const config = analyticsConfig({
  preview: isPreview,
  production: process.env.NODE_ENV === 'production',
  key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  previewKey: process.env.NEXT_PUBLIC_POSTHOG_PREVIEW_KEY,
  region: process.env.NEXT_PUBLIC_POSTHOG_REGION,
});
export const analyticsEnabled = config !== null;
const posthog = createAnalyticsRuntime(config, () => ({
  ready,
  consent: typeof window !== 'undefined' && getConsentPreferences()?.analytics === true,
  pathname: typeof window === 'undefined' ? '/admin' : window.location.pathname,
  origin: typeof window === 'undefined' ? '' : window.location.origin,
  search: typeof window === 'undefined' ? '' : window.location.search,
  referrer: typeof document === 'undefined' ? '' : document.referrer,
}));

export function syncAnalytics(initialWorkFinished = false) {
  if (initialWorkFinished) ready = true;
  return posthog.sync();
}

export function stopAnalytics() {
  ready = false;
  posthog.stop();
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

/** Public call sites pass bounded event categories; unknown data is dropped. */
export function track(event: string, props?: Record<string, string | number>) {
  if (typeof window === 'undefined' || analyticsAdminPath(window.location.pathname) || !analyticsEvents.has(event)) return;
  const safe = safeAnalyticsProps(props);
  if (!isPreview) window.plausible?.(event, props ? { props: safe } : undefined);
  posthog.capture(event, safe);
}
