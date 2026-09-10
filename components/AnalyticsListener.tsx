"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { syncGa4, stopGa4 } from "@/lib/ga4";
import { syncMetaPixel, stopMetaPixel } from "@/lib/meta-pixel";
import { track, syncAnalytics, stopAnalytics } from "@/lib/analytics";

/** Consent-aware PostHog lifecycle, safe CTA delegation and actual page depth. */
export default function AnalyticsListener() {
  const pathname = usePathname();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let idle: number | undefined;
    const sync = () => { void syncAnalytics(); void syncMetaPixel(); void syncGa4(); };
    const afterLoad = () => {
      if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(() => { void syncAnalytics(true); void syncMetaPixel(); void syncGa4(true); }, { timeout: 3000 });
      } else {
        timer = setTimeout(() => { void syncAnalytics(true); void syncMetaPixel(); void syncGa4(true); }, 1000);
      }
    };
    window.addEventListener("cookie-consent-changed", sync);
    window.addEventListener("storage", sync);
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
    return () => {
      window.removeEventListener("cookie-consent-changed", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("load", afterLoad);
      if (timer !== undefined) clearTimeout(timer);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      stopAnalytics();
      stopMetaPixel();
      stopGa4();
    };
  }, []);

  useEffect(() => { void syncAnalytics(); void syncMetaPixel(); void syncGa4(); }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const a = t.closest("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const externalActions: Record<string, string> = {
        "https://www.instagram.com/driveexotiq": "instagram",
        "https://www.youtube.com/@driveexotiq": "youtube",
        "#the-community": "community",
      };
      if (externalActions[href]) {
        track("CTA", { action: externalActions[href] });
        return;
      }
      if (!/^\/(apply|sponsor|marketplace|tour|drives)(\?|$|\/)/.test(href))
        return;
      track("CTA", { href });
    };
    document.addEventListener("click", onClick, {
      capture: true,
      passive: true,
    });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    const fired = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      for (const q of [25, 50, 75, 100]) {
        if (pct >= q && !fired.has(q)) {
          fired.add(q);
          // Preserve the homepage depth event used by the conversion dashboard.
          track(pathname === "/" ? "Film Depth" : "Page Depth", { depth: q });
        }
      }
      if (fired.size === 4) window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
