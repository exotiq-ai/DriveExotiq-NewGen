'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import CinematicStage from './CinematicStage';
import { FRAMES } from './frames';
import { OVERLAYS } from './living';

const N = FRAMES.length;
const D = 1 / (N - 1);

/**
 * Beats whose in-frame Gulf accent owns the viewport — the chrome's Gulf CTA
 * bows out over their bands so the one-accent law holds everywhere (the same
 * courtesy the finale always had, generalized and computed from FRAMES so new
 * beats can't silently desynchronize it). The progress hairline stays: the
 * spec sanctions it as the header's accent moment, not an extra one.
 */
const ACCENT_BEATS = FRAMES
  .map((f, i) => ({ f, i }))
  .filter(({ f }) => f.cta || OVERLAYS[f.id] === 'gauge')
  .map(({ i }) => i);

function chromeFadeStops(): { stops: number[]; values: number[] } {
  const stops: number[] = [0];
  const values: number[] = [1];
  for (const k of ACCENT_BEATS) {
    const a = (k - 0.45) * D;
    const b = (k - 0.3) * D;
    const c = (k + 0.3) * D;
    const d = (k + 0.45) * D;
    if (a > stops[stops.length - 1]) { stops.push(a); values.push(1); }
    if (b > stops[stops.length - 1]) { stops.push(b); values.push(0); }
    if (c < 1) { stops.push(Math.max(c, stops[stops.length - 1] + 1e-4)); values.push(0); }
    if (d < 1) { stops.push(Math.max(d, stops[stops.length - 1] + 1e-4)); values.push(1); }
  }
  // The last accent beat is the finale — hold 0 through the end of the stage.
  if (values[values.length - 1] === 1) { stops.push(1); values.push(1); }
  return { stops, values };
}
const CHROME_FADE = chromeFadeStops();

/**
 * The scroll experience: persistent chrome (wordmark + audience CTAs, the
 * sponsor ask as the single Gulf action), a 1px Gulf progress hairline, a
 * quiet scroll cue on the cold open, the pinned film, and an end-card so the
 * scroll never dead-ends. Lenis smooth-scroll is global; keyboard input steps
 * beat-by-beat through the film.
 */
export default function ExperienceScroll() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  // All chrome choreography is scoped to the STAGE's progress, not the
  // document's — the end-card below can grow without desynchronizing it.
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end end'] });
  const chromeOpacity = useTransform(scrollYProgress, CHROME_FADE.stops, CHROME_FADE.values);
  const chromeEvents = useTransform(chromeOpacity, (o) => (o < 0.2 ? ('none' as const) : ('auto' as const)));
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.4 * D], [1, 0]);

  // Keyboard: step the film beat-by-beat (Lenis smooths wheel only; raw key
  // jumps snap through the dissolves). Space/PageDown/↓ next, PageUp/↑ prev.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const stage = stageRef.current;
      if (!stage) return;
      const keys = [' ', 'PageDown', 'ArrowDown', 'PageUp', 'ArrowUp', 'Home', 'End'];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      const stageTop = stage.getBoundingClientRect().top + window.scrollY;
      const beat = Math.round((window.scrollY - stageTop) / window.innerHeight);
      const dir = e.key === 'PageUp' || e.key === 'ArrowUp' || (e.key === ' ' && e.shiftKey) ? -1 : 1;
      const target =
        e.key === 'Home' ? 0
        : e.key === 'End' ? N - 1
        : Math.min(N - 1, Math.max(0, beat + dir));
      const y = stageTop + target * window.innerHeight;
      const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, o?: object) => void } }).lenis;
      if (lenis) lenis.scrollTo(y, { duration: 1.1 });
      else window.scrollTo({ top: y, behavior: 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50"
        style={reduce ? undefined : { opacity: chromeOpacity, pointerEvents: chromeEvents }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(7,7,8,.85), transparent)' }}
        />
        <div className="pointer-events-auto relative mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-8">
          <Link href="/" className="font-display text-sm font-bold tracking-tight-exotiq text-ink">
            Drive Exotiq
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/apply"
              className="hidden rounded-sm border border-line-2 px-4 py-2 text-xs font-semibold text-ink transition-colors duration-250 ease-de hover:border-ink-3 sm:inline-block"
            >
              Join the waitlist
            </Link>
            <Link
              href="/sponsor"
              className="rounded-sm bg-gulf px-4 py-2 text-xs font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
            >
              Sponsor the wrap
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* The film's progress instrument — 1px Gulf hairline riding the top edge
          (spec §3.5: counts as the header's accent moment, not an extra one). */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-gulf"
          style={{ scaleX: progressScale }}
        />
      )}

      <div ref={stageRef}>
        <CinematicStage />
      </div>

      {/* Quiet scroll cue over the cold open only. */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-8 left-1/2 z-40 -translate-x-1/2"
          style={{ opacity: cueOpacity }}
        >
          <motion.div
            className="flex flex-col items-center gap-3"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
          >
            <span className="text-[11px] tracking-[0.08em] text-ink-2">Scroll</span>
            <span className="block h-8 w-px bg-ink-3" />
          </motion.div>
        </motion.div>
      )}

      {/* End-card: the scroll must never dead-end after the ask. */}
      <section id="experience-end" className="border-t border-line bg-canvas">
        <div className="mx-auto flex max-w-content flex-col gap-6 px-6 py-14 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="font-display text-sm font-bold tracking-tight-exotiq text-ink">Drive Exotiq</p>
            <p className="mt-1 text-xs text-ink-3">An Exotiq Inc. brand — the community front door to the exotiq.rent marketplace.</p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-2">
            <Link href="/" className="transition-colors hover:text-ink">Home</Link>
            <Link href="/tour" className="transition-colors hover:text-ink">The tour</Link>
            <Link href="/sponsor" className="transition-colors hover:text-ink">Sponsor</Link>
            <Link href="/apply" className="transition-colors hover:text-ink">Apply</Link>
            <span className="text-ink-3">© {new Date().getFullYear()} Exotiq Inc.</span>
          </nav>
        </div>
      </section>
    </>
  );
}
