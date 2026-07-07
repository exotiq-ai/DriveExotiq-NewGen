// Plausible custom-event helper. The script tag lives in app/layout.tsx
// (production only); this no-ops safely everywhere else, so call sites never
// need their own guards.

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

/** Fire a Plausible custom event (silently no-ops outside production). */
export function track(event: string, props?: Record<string, string | number>) {
  if (typeof window === 'undefined') return;
  window.plausible?.(event, props ? { props } : undefined);
}
