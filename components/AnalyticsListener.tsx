'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics';

/**
 * Site-wide analytics wiring, zero markup. Two jobs:
 *
 * 1. CTA clicks by delegation: any anchor into the conversion funnels
 *    (/apply, /sponsor, /marketplace, /tour, /drives) fires a `CTA` event with
 *    the href + its visible label. Delegation means no per-component edits and
 *    new CTAs are tracked automatically.
 *
 * 2. Film depth on the homepage: fires `Film Depth` once per load at each
 *    scroll quartile (25/50/75/100). With ~34 viewports of film, quartiles map
 *    roughly onto the acts — enough to see where visitors fall out.
 *
 * Plausible is cookieless and the events carry no personal data, so none of
 * this is gated behind the cookie banner.
 */
export default function AnalyticsListener() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const a = t.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!/^\/(apply|sponsor|marketplace|tour|drives)(\?|$|\/)/.test(href)) return;
      track('CTA', { href, label: (a.textContent || '').trim().slice(0, 60) });
    };
    document.addEventListener('click', onClick, { capture: true, passive: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  useEffect(() => {
    if (pathname !== '/') return;
    const fired = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      for (const q of [25, 50, 75, 100]) {
        if (pct >= q && !fired.has(q)) {
          fired.add(q);
          track('Film Depth', { depth: q });
        }
      }
      if (fired.size === 4) window.removeEventListener('scroll', onScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  return null;
}
