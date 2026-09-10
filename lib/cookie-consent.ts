export type CookieCategory = 'functional' | 'analytics' | 'marketing';

export interface CookiePreferences {
  functional: boolean;
  analytics: boolean;
  marketing?: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'driveexotiq_cookie_consent';

export function getConsentPreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const prefs = JSON.parse(stored);
    if (!prefs || typeof prefs.functional !== 'boolean' || typeof prefs.analytics !== 'boolean' || typeof prefs.timestamp !== 'string') return null;
    return { ...prefs, marketing: prefs.marketing === true } as CookiePreferences;
  } catch {
    return null;
  }
}

export function setConsentPreferences(prefs: Omit<CookiePreferences, 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  const full: CookiePreferences = {
    ...prefs,
    marketing: prefs.marketing === true,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
  window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: full }));
}

export function acceptAll(): void {
  setConsentPreferences({ functional: true, analytics: true, marketing: true });
}

export function rejectNonEssential(): void {
  setConsentPreferences({ functional: false, analytics: false, marketing: false });
}

export function hasConsented(): boolean {
  return getConsentPreferences() !== null;
}

export function clearConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: null }));
}

/** Configured preview builds need the same consent opportunity as production. */
export function shouldPromptConsent(preview: boolean, analyticsEnabled: boolean, consented: boolean) {
  return !consented && (!preview || analyticsEnabled);
}
