'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Site-wide smooth/inertia scroll (the buttery, weighted feel of the
 * award references). Drives a single rAF loop; fully disabled under
 * prefers-reduced-motion so the native scroll stays crisp and accessible.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    // Exposed handle: the experience's keyboard beat-navigation rides it (and
    // scripted walkthroughs — Lenis otherwise fights window.scrollTo).
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
