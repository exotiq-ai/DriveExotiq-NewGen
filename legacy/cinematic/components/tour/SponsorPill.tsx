'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Persistent sponsor pill — /tour design push F5. A fixed bottom-right Link
 * (z-30: above the page and the sticky stage, under the z-50 Header AND the
 * z-40 mobile nav sheet, whose own Gulf CTA must never share a viewport with
 * this one) that keeps the sponsor path one interaction away from any scroll
 * depth. It server-renders hidden-but-present (the <a>
 * is in the HTML for crawlers), fades in once the hero has scrolled away, and
 * suppresses itself from the finale CTA section onward so the ask is never
 * doubled in a viewport. This pill is the scrolled page's one Gulf action.
 */
export default function SponsorPill() {
  const [pastHero, setPastHero] = useState(false);
  const [nearFinale, setNearFinale] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('tour-hero');
    const finale = document.getElementById('tour-finale-section');
    if (!hero || !finale) return;

    const heroIO = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting));
    // Suppressed while the finale is on screen AND once it has been passed —
    // below it sit the footer CTAs, which own their own Gulf.
    const finaleIO = new IntersectionObserver(
      ([e]) => setNearFinale(e.isIntersecting || e.boundingClientRect.top < 0),
      { rootMargin: '0px 0px -15% 0px' }
    );
    heroIO.observe(hero);
    finaleIO.observe(finale);
    return () => {
      heroIO.disconnect();
      finaleIO.disconnect();
    };
  }, []);

  const visible = pastHero && !nearFinale;

  return (
    <Link
      href="/sponsor"
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? undefined : -1}
      className={`fixed bottom-5 right-5 z-30 inline-flex min-h-[48px] items-center rounded-sm bg-gulf px-5 py-3 text-[15px] font-semibold text-on-gulf transition-opacity duration-250 ease-de hover:bg-gulf-2 md:bottom-8 md:right-8 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      Sponsor the wrap
    </Link>
  );
}
