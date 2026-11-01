// Custom-event helper. Plausible's script tag lives in app/layout.tsx
// (production only) and is cookieless; PostHog (lib/posthog.ts) only captures
// once the visitor has accepted analytics cookies. Both no-op safely
// everywhere else, so call sites never need their own guards.
import { captureEvent } from '@/lib/posthog';

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

/** Fire a custom event to Plausible (production) and PostHog (consented). */
export function track(event: string, props?: Record<string, string | number>) {
  if (typeof window === 'undefined') return;
  window.plausible?.(event, props ? { props } : undefined);
  captureEvent(event, props);
}
