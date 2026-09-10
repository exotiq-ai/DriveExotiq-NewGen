import { isPreview } from '@/lib/preview';
import { getConsentPreferences } from '@/lib/cookie-consent';
import { createGa4Runtime, type GoogleCommand } from '@/lib/ga4-runtime';

declare global { interface Window { dataLayer?: unknown[]; gtag?: GoogleCommand } }
const id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const disable = (value: boolean) => {
  if (typeof window !== 'undefined' && id) (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = value;
};
function load(): Promise<GoogleCommand> {
  return new Promise((resolve, reject) => {
    window.dataLayer ||= [];
    window.gtag ||= function () { window.dataLayer!.push(arguments); };
    disable(true); // No events until load finishes and consent is rechecked.
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    script.onload = () => resolve(window.gtag!);
    script.onerror = () => { script.remove(); reject(new Error('GA4 unavailable')); };
    document.head.appendChild(script);
  });
}
let ready = false;
const runtime = createGa4Runtime(id, () => ({
  production: ready && process.env.NODE_ENV === 'production', preview: isPreview,
  consent: typeof window !== 'undefined' && getConsentPreferences()?.analytics === true,
  origin: typeof window === 'undefined' ? '' : window.location.origin,
  pathname: typeof window === 'undefined' ? '/admin' : window.location.pathname,
  search: typeof window === 'undefined' ? '' : window.location.search,
}), load, disable);
export function syncGa4(initialWorkFinished = false) {
  if (initialWorkFinished) ready = true;
  return runtime.sync();
}
export function stopGa4() { ready = false; runtime.stop(); }
export const ga4FormContext = runtime.context;

export const trackGa4FormStart = runtime.formStart;
