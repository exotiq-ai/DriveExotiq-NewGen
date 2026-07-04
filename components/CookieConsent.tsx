'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  hasConsented,
  acceptAll,
  rejectNonEssential,
  setConsentPreferences,
  getConsentPreferences,
} from '@/lib/cookie-consent';

/**
 * Consent bar on the design system: surface + hairline, 2px corners, sentence
 * case, exactly one Gulf action (Accept all). No pills, no glow — the bar must
 * be able to sit over the film without breaking its grammar. On /experience it
 * waits for scroll intent so the cold open is never interrupted.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const pathname = usePathname();
  const onFilm = pathname?.startsWith('/experience');

  useEffect(() => {
    if (hasConsented()) return;
    if (!onFilm) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
    // On the film: appear only once the visitor has committed to scrolling.
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        setVisible(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onFilm]);

  useEffect(() => {
    const handleReopen = () => {
      const prefs = getConsentPreferences();
      if (prefs) {
        setFunctional(prefs.functional);
        setAnalytics(prefs.analytics);
      }
      setExpanded(true);
      setVisible(true);
    };
    window.addEventListener('open-cookie-settings', handleReopen);
    return () => window.removeEventListener('open-cookie-settings', handleReopen);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    setExpanded(false);
  }, []);

  const handleAcceptAll = () => { acceptAll(); dismiss(); };
  const handleRejectAll = () => { rejectNonEssential(); dismiss(); };
  const handleSavePreferences = () => { setConsentPreferences({ functional, analytics }); dismiss(); };

  if (!visible) return null;

  const Toggle = ({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) => (
    <button
      onClick={onClick}
      aria-pressed={on}
      aria-label={label}
      className={`relative h-4 w-9 rounded-sm border transition-colors ${on ? 'border-ink-3 bg-surface-2' : 'border-line-2 bg-transparent'}`}
    >
      <span
        className={`absolute top-0.5 h-2.5 w-3 rounded-sm transition-all ${on ? 'right-0.5 bg-ink' : 'left-0.5 bg-ink-3'}`}
      />
    </button>
  );

  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
      <div className="mx-auto max-w-2xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="overflow-hidden rounded-sm border border-line bg-surface">
          <div className="flex flex-col items-start gap-3 px-5 py-4 sm:flex-row sm:items-center">
            <p className="flex-1 text-sm leading-relaxed text-ink-2">
              We use cookies to improve your experience.{' '}
              <Link href="/cookies" className="text-ink underline decoration-line-2 underline-offset-2 transition-colors hover:decoration-ink-3">
                Learn more
              </Link>
            </p>
            <div className="flex w-full flex-shrink-0 items-center gap-2 sm:w-auto">
              <button
                onClick={() => setExpanded(!expanded)}
                className="rounded-sm border border-line-2 px-3 py-1.5 text-xs text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
              >
                Manage
              </button>
              <button
                onClick={handleRejectAll}
                className="rounded-sm border border-line-2 px-3 py-1.5 text-xs text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
              >
                Reject all
              </button>
              <button
                onClick={handleAcceptAll}
                className="rounded-sm bg-gulf px-4 py-1.5 text-xs font-semibold text-on-gulf transition-colors hover:bg-gulf-2"
              >
                Accept all
              </button>
            </div>
          </div>

          {expanded && (
            <div className="space-y-4 border-t border-line px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">Strictly necessary</p>
                  <p className="text-xs text-ink-3">Session, security, payments.</p>
                </div>
                <span className="text-xs text-ink-3">Always on</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">Functional</p>
                  <p className="text-xs text-ink-3">Search preferences, recently viewed vehicles.</p>
                </div>
                <Toggle on={functional} onClick={() => setFunctional(!functional)} label="Functional cookies" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">Analytics</p>
                  <p className="text-xs text-ink-3">Page views, search analytics, performance.</p>
                </div>
                <Toggle on={analytics} onClick={() => setAnalytics(!analytics)} label="Analytics cookies" />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSavePreferences}
                  className="rounded-sm border border-line-2 px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-ink-3"
                >
                  Save preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
