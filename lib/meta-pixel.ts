import { isPreview } from '@/lib/preview';
import { getConsentPreferences } from '@/lib/cookie-consent';
import { createMetaPixelRuntime, type PixelCommand } from '@/lib/meta-pixel-runtime';

type Fbq = PixelCommand & { callMethod?: PixelCommand; queue: unknown[][]; push: PixelCommand; loaded: boolean; version: string };
declare global { interface Window { fbq?: Fbq; _fbq?: Fbq } }

function loadPixel(): Promise<PixelCommand> {
  return new Promise((resolve, reject) => {
    if (window.fbq?.callMethod) { resolve(window.fbq); return; }
    if (!window.fbq) {
      const command = function (...args: unknown[]) {
        if (command.callMethod) command.callMethod(...args);
        else command.queue.push(args);
      } as Fbq;
      command.queue = []; command.push = command; command.loaded = true; command.version = '2.0';
      window.fbq = command; window._fbq = command;
    }
    const script = document.createElement('script');
    script.id = 'driveexotiq-meta-pixel';
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    // No init or queued events until load completes and runtime rechecks consent.
    script.onload = () => resolve(window.fbq!);
    script.onerror = () => { script.remove(); reject(new Error('Meta Pixel unavailable')); };
    document.head.appendChild(script);
  });
}

const runtime = createMetaPixelRuntime(process.env.NEXT_PUBLIC_META_PIXEL_ID, () => ({
  production: process.env.NODE_ENV === 'production', preview: isPreview,
  consent: typeof window !== 'undefined' && getConsentPreferences()?.marketing === true,
  privacySignal: typeof navigator !== 'undefined' && (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true,
  origin: typeof window === 'undefined' ? '' : window.location.origin,
  pathname: typeof window === 'undefined' ? '/admin' : window.location.pathname,
}), loadPixel);
export const syncMetaPixel = runtime.sync;
export const stopMetaPixel = runtime.stop;
export const trackMetaLead = runtime.lead;
