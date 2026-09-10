"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { analyticsEnabled } from "@/lib/analytics";
import { isPreview } from "@/lib/preview";
import {
  hasConsented,
  shouldPromptConsent,
  acceptAll,
  rejectNonEssential,
  setConsentPreferences,
  getConsentPreferences,
} from "@/lib/cookie-consent";

/**
 * Mobile presentation gate — same audience query as the film's coarse path
 * (useNoTextBlur in CinematicStage): narrow OR coarse pointer. Lazy init so
 * the first client render already knows (SSR renders nothing here anyway —
 * `visible` only ever turns on client-side).
 */
const MOBILE_MQ = "(max-width: 767px), (pointer: coarse)";
function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MOBILE_MQ).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return mobile;
}

/**
 * Consent bar on the design system: surface + hairline, 2px corners, sentence
 * case, exactly one Gulf action (Accept all). No pills, no glow — the bar must
 * be able to sit over the film without breaking its grammar. On /experience it
 * waits for scroll intent so the cold open is never interrupted; on mobile the
 * film gets a slim single-line bar held back ~2 viewports (owner bug
 * 2026-07-08: the full card covered the bottom quarter of the film during the
 * cold open + door beats). Presentation only — consent logic is identical.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  // The film is the home page — hold the consent bar until scroll intent there.
  const onFilm = pathname === "/";
  // Slim film bar: mobile viewports on the film only. Desktop film and every
  // other page keep the exact legacy card.
  const slim = onFilm && isMobile;

  useEffect(() => {
    if (!shouldPromptConsent(isPreview, analyticsEnabled, hasConsented())) return;
    if (!onFilm) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
    // On the film: appear only once the visitor has committed to scrolling.
    // Desktop keeps the 0.6-viewport intent threshold; mobile holds until ~2
    // viewports so the cold open + door beats play undisturbed. The query is
    // read per-event (not closed over) so a mid-session viewport change can't
    // strand a stale threshold.
    const onScroll = () => {
      const threshold = window.matchMedia(MOBILE_MQ).matches
        ? window.innerHeight * 2
        : window.innerHeight * 0.6;
      if (window.scrollY > threshold) {
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onFilm]);

  useEffect(() => {
    const handleReopen = () => {
      const prefs = getConsentPreferences();
      if (prefs) {
        setFunctional(prefs.functional);
        setAnalytics(prefs.analytics);
        setMarketing(prefs.marketing === true);
      }
      setExpanded(true);
      setVisible(true);
    };
    window.addEventListener("open-cookie-settings", handleReopen);
    return () =>
      window.removeEventListener("open-cookie-settings", handleReopen);
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
    setConsentPreferences({ functional, analytics, marketing });
    dismiss();
  };

  if (!visible) return null;

  const Toggle = ({
    on,
    onClick,
    label,
  }: {
    on: boolean;
    onClick: () => void;
    label: string;
  }) => (
    <button
      onClick={onClick}
      aria-pressed={on}
      aria-label={label}
      className={`relative h-4 w-9 rounded-sm border transition-colors ${on ? "border-ink-3 bg-surface-2" : "border-line-2 bg-transparent"}`}
    >
      <span
        className={`absolute top-0.5 h-2.5 w-3 rounded-sm transition-all ${on ? "right-0.5 bg-ink" : "left-0.5 bg-ink-3"}`}
      />
    </button>
  );

  // Preferences panel — one markup for both presentations (identical consent
  // controls). The slim film bar adds Reject all here: the bar itself only has
  // room for Accept + Manage, and dropping one-tap reject entirely would
  // change consent parity, not just presentation. Slim opens upward, so the
  // hairline sits under the panel instead of over it.
  const preferences = expanded && (
    <div
      className={`space-y-4 px-5 py-4 ${slim ? "border-b" : "border-t"} border-line`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink">Strictly necessary</p>
          <p className="text-xs text-ink-3">Remembers your cookie choices.</p>
        </div>
        <span className="text-xs text-ink-3">Always on</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink">Functional</p>
          <p className="text-xs text-ink-3">
            No optional functional storage is currently used.
          </p>
        </div>
        <Toggle
          on={functional}
          onClick={() => setFunctional(!functional)}
          label="Functional cookies"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink">Analytics</p>
          <p className="text-xs text-ink-3">
            Page views, clicks, heatmaps and masked session replay.
          </p>
        </div>
        <Toggle
          on={analytics}
          onClick={() => setAnalytics(!analytics)}
          label="Analytics cookies"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink">Marketing</p>
          <p className="text-xs text-ink-3">
            Meta Pixel measures ad performance and may support personalized ads.
          </p>
        </div>
        <Toggle on={marketing} onClick={() => setMarketing(!marketing)} label="Marketing cookies" />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        {slim && (
          <button
            onClick={handleRejectAll}
            className="rounded-sm border border-line-2 px-4 py-1.5 text-xs text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
          >
            Reject all
          </button>
        )}
        <button
          onClick={handleSavePreferences}
          className="rounded-sm border border-line-2 px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-ink-3"
        >
          Save preferences
        </button>
      </div>
    </div>
  );

  if (slim) {
    // The film's mobile bar: one line, one short sentence (it doubles as the
    // /cookies disclosure link), compact Manage + Accept. ~58px tall — the
    // film keeps its bottom quarter.
    return (
      <div
        role="dialog"
        aria-label="Cookie consent"
        className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up"
      >
        <div className="mx-auto max-w-2xl px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <div className="overflow-hidden rounded-sm border border-line bg-surface">
            {preferences}
            <div className="flex items-center gap-2 px-3 py-2">
              <Link
                href="/cookies"
                className="min-w-0 flex-1 truncate text-xs text-ink-2 underline decoration-line-2 underline-offset-2 transition-colors hover:decoration-ink-3"
              >
                Analytics & marketing cookies.
              </Link>
              <button
                onClick={() => setExpanded(!expanded)}
                className="min-h-[40px] flex-shrink-0 rounded-sm border border-line-2 px-3 text-xs text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
              >
                Manage
              </button>
              <button
                onClick={handleAcceptAll}
                className="min-h-[40px] flex-shrink-0 rounded-sm bg-gulf px-4 text-xs font-semibold text-on-gulf transition-colors hover:bg-gulf-2"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up"
    >
      <div className="mx-auto max-w-2xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="overflow-hidden rounded-sm border border-line bg-surface">
          <div className="flex flex-col items-start gap-3 px-5 py-4 sm:flex-row sm:items-center">
            <p className="flex-1 text-sm leading-relaxed text-ink-2">
              We use cookies for analytics and marketing.{" "}
              <Link
                href="/cookies"
                className="text-ink underline decoration-line-2 underline-offset-2 transition-colors hover:decoration-ink-3"
              >
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

          {preferences}
        </div>
      </div>
    </div>
  );
}
