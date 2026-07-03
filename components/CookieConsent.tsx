'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  hasConsented,
  acceptAll,
  rejectNonEssential,
  setConsentPreferences,
  getConsentPreferences,
} from '@/lib/cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasConsented()) setVisible(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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

  const handleAcceptAll = () => {
    acceptAll();
    dismiss();
  };

  const handleRejectAll = () => {
    rejectNonEssential();
    dismiss();
  };

  const handleSavePreferences = () => {
    setConsentPreferences({ functional, analytics });
    dismiss();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up"
    >
      <div className="mx-auto max-w-2xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="rounded-xl bg-jet-grey/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden">
          {/* Compact bar */}
          <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <p className="text-sm text-metallic-silver leading-relaxed flex-1">
              We use cookies to improve your experience.{' '}
              <Link
                href="/cookies"
                className="text-gulf-blue underline hover:text-gulf-blue/80"
              >
                Learn more
              </Link>
            </p>
            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setExpanded(!expanded)}
                className="px-3 py-1.5 text-xs text-metallic-silver hover:text-pure-white border border-metallic-silver/20 rounded-lg transition-colors"
              >
                Manage
              </button>
              <button
                onClick={handleRejectAll}
                className="px-3 py-1.5 text-xs text-metallic-silver hover:text-pure-white border border-metallic-silver/20 rounded-lg transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-1.5 text-xs font-medium text-deep-black bg-gulf-blue hover:bg-gulf-blue/90 rounded-lg transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>

          {/* Expanded preferences panel */}
          {expanded && (
            <div className="border-t border-white/5 px-5 py-4 space-y-4">
              {/* Strictly Necessary — always on */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-pure-white">
                    Strictly Necessary
                  </p>
                  <p className="text-xs text-metallic-silver/60">
                    Session, security, payments. Always active.
                  </p>
                </div>
                <div className="w-10 h-5 bg-gulf-blue/30 rounded-full relative cursor-not-allowed">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-gulf-blue rounded-full" />
                </div>
              </div>

              {/* Functional */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-pure-white">
                    Functional
                  </p>
                  <p className="text-xs text-metallic-silver/60">
                    Search preferences, recently viewed vehicles.
                  </p>
                </div>
                <button
                  onClick={() => setFunctional(!functional)}
                  aria-pressed={functional}
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    functional ? 'bg-gulf-blue/30' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                      functional
                        ? 'right-0.5 bg-gulf-blue'
                        : 'left-0.5 bg-metallic-silver/50'
                    }`}
                  />
                </button>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-pure-white">
                    Analytics
                  </p>
                  <p className="text-xs text-metallic-silver/60">
                    Page views, search analytics, performance.
                  </p>
                </div>
                <button
                  onClick={() => setAnalytics(!analytics)}
                  aria-pressed={analytics}
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    analytics ? 'bg-gulf-blue/30' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                      analytics
                        ? 'right-0.5 bg-gulf-blue'
                        : 'left-0.5 bg-metallic-silver/50'
                    }`}
                  />
                </button>
              </div>

              {/* Save button */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-1.5 text-xs font-medium text-deep-black bg-gulf-blue hover:bg-gulf-blue/90 rounded-lg transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
