'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import CinematicStage from './CinematicStage';
import { FRAMES } from './frames';
import { OVERLAYS } from './living';
import { FINE_BANDS, useBands, bandAtVh, type Bands } from './bands';

const N = FRAMES.length;

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

/**
 * Chrome bow-out bands around each accent beat. Ramps are constant in SCROLL
 * distance (0.15 viewports, same reasoning as the plate dissolves) — on a
 * weighted accent band (SB-11) the chrome stays out for the whole band but
 * fades at the film's one tempo. All-weights-1 reduces to the shipped
 * (k∓0.45)/(k∓0.3) stops exactly.
 */
function chromeFadeStops(b: Bands): { stops: number[]; values: number[] } {
  const stops: number[] = [0];
  const values: number[] = [1];
  for (const k of ACCENT_BEATS) {
    const a = b.start[k] + 0.05 * b.unit;
    const rIn = b.start[k] + 0.2 * b.unit;
    const rOut = b.end[k] - 0.2 * b.unit;
    const d = b.end[k] - 0.05 * b.unit;
    if (a > stops[stops.length - 1]) { stops.push(a); values.push(1); }
    if (rIn > stops[stops.length - 1]) { stops.push(rIn); values.push(0); }
    if (rOut < 1) { stops.push(Math.max(rOut, stops[stops.length - 1] + 1e-4)); values.push(0); }
    if (d < 1) { stops.push(Math.max(d, stops[stops.length - 1] + 1e-4)); values.push(1); }
  }
  // The last accent beat is the finale — hold 0 through the end of the stage.
  if (values[values.length - 1] === 1) { stops.push(1); values.push(1); }
  return { stops, values };
}

/**
 * All progress-driven chrome (header fade, hairline, scroll cue) lives here,
 * KEYED by the active weight table in the parent: framer's useTransform
 * captures its stop arrays, so a breakpoint flip remounts this shell to
 * rebuild the choreography against the new band geometry.
 */
function StageChrome({ progress, bands, jumpTo }: { progress: MotionValue<number>; bands: Bands; jumpTo: (k: number) => void }) {
  const CHROME = useMemo(() => chromeFadeStops(bands), [bands]);
  const chromeOpacity = useTransform(progress, CHROME.stops, CHROME.values);
  const chromeEvents = useTransform(chromeOpacity, (o) => (o < 0.2 ? ('none' as const) : ('auto' as const)));
  const progressScale = useTransform(progress, [0, 1], [0, 1]);
  const cueOpacity = useTransform(progress, [0, 0.8 * bands.end[0]], [1, 0]);

  // The chrome's Gulf button follows the film's audience (visitor audit: a
  // stranger stared at "Sponsor the wrap" for 20 beats before the film
  // explained the wrap). Movement I: the renter ask is primary. From the
  // SB-18 pivot on: the sponsor ask takes the Gulf. Cross-faded on the same
  // stage progress that drives everything else.
  const pivotK = FRAMES.findIndex((f) => f.id === 'SB-18');
  const pivotAt = bands.start[Math.max(0, pivotK)];
  const renterNavOpacity = useTransform(progress, [pivotAt - 0.15 * bands.unit, pivotAt + 0.15 * bands.unit], [1, 0]);
  const sponsorNavOpacity = useTransform(progress, [pivotAt - 0.15 * bands.unit, pivotAt + 0.15 * bands.unit], [0, 1]);
  const renterNavEvents = useTransform(renterNavOpacity, (o) => (o < 0.5 ? ('none' as const) : ('auto' as const)));
  const sponsorNavEvents = useTransform(sponsorNavOpacity, (o) => (o < 0.5 ? ('none' as const) : ('auto' as const)));

  // Act ticks on the hairline (audit item: skip-to-the-ask): the pivot and the
  // finale, clickable. Quiet by design — 1px marks that brighten on hover; the
  // returning sponsor shouldn't need 30 viewports of scroll to reach the ask.
  // Mount-gated: tick positions depend on the weight table, which the server
  // can't know — React skips style-attribute diffing during hydration, so an
  // SSR-positioned tick would silently keep the wrong table's offset forever.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const TICKS = FRAMES
    .map((f, i) => ({ f, i }))
    .filter(({ f }) => f.id === 'SB-18' || f.id === 'SB-20')
    .map(({ f, i }) => ({
      i,
      at: (bands.anchorVh[i] / (bands.total - 1)) * 100,
      label: f.id === 'SB-18' ? 'Skip to the tour' : 'Skip to the ask',
    }));

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50"
        style={{ opacity: chromeOpacity, pointerEvents: chromeEvents }}
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
          <div className="relative">
            {/* Movement-I nav: the renter ask holds the Gulf. */}
            <motion.nav
              className="flex items-center gap-2"
              style={{ opacity: renterNavOpacity, pointerEvents: renterNavEvents }}
            >
              <Link
                href="/sponsor"
                className="hidden rounded-sm border border-line-2 px-4 py-2 text-xs font-semibold text-ink transition-colors duration-250 ease-de hover:border-ink-3 sm:inline-block"
              >
                Sponsor the wrap
              </Link>
              <Link
                href="/apply"
                className="rounded-sm bg-gulf px-4 py-2 text-xs font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
              >
                Get on the list
              </Link>
            </motion.nav>
            {/* Movement-II nav: the sponsor ask takes over at the pivot. */}
            <motion.nav
              className="absolute inset-y-0 right-0 flex items-center gap-2"
              style={{ opacity: sponsorNavOpacity, pointerEvents: sponsorNavEvents }}
            >
              <Link
                href="/apply"
                className="hidden rounded-sm border border-line-2 px-4 py-2 text-xs font-semibold text-ink transition-colors duration-250 ease-de hover:border-ink-3 sm:inline-block"
              >
                Get on the list
              </Link>
              <Link
                href="/sponsor"
                className="rounded-sm bg-gulf px-4 py-2 text-xs font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
              >
                Sponsor the wrap
              </Link>
            </motion.nav>
          </div>
        </div>
      </motion.header>

      {/* The film's progress instrument — 1px Gulf hairline riding the top edge
          (spec §3.5: counts as the header's accent moment, not an extra one). */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-gulf"
        style={{ scaleX: progressScale }}
      />
      {/* Act ticks: generous hit areas, hairline-quiet marks. Desktop-only —
          on phones the SB-20 tick half-clips at the right edge and a 1px mark
          is a poor touch affordance; mobile skip lives in the end card. */}
      <div className="fixed inset-x-0 top-0 z-[61] hidden sm:block">
        {mounted && TICKS.map((t) => (
          <button
            key={t.i}
            type="button"
            aria-label={t.label}
            title={t.label}
            onClick={() => jumpTo(t.i)}
            className="group absolute -top-1 h-6 w-6 -translate-x-1/2 cursor-pointer"
            style={{ left: `${t.at}%` }}
          >
            <span className="absolute left-1/2 top-1 block h-2 w-px -translate-x-1/2 bg-gulf opacity-50 transition-opacity duration-250 ease-de group-hover:opacity-100 group-focus-visible:opacity-100" />
          </button>
        ))}
      </div>

      {/* Quiet scroll cue over the cold open only. */}
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
    </>
  );
}

/** Static header for the reduced-motion path — no choreography, always visible. */
function StaticChrome() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(7,7,8,.85), transparent)' }}
      />
      <div className="relative mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" className="font-display text-sm font-bold tracking-tight-exotiq text-ink">
          Drive Exotiq
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/apply"
            className="hidden rounded-sm border border-line-2 px-4 py-2 text-xs font-semibold text-ink transition-colors duration-250 ease-de hover:border-ink-3 sm:inline-block"
          >
            Get on the list
          </Link>
          <Link
            href="/sponsor"
            className="rounded-sm bg-gulf px-4 py-2 text-xs font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
          >
            Sponsor the wrap
          </Link>
        </nav>
      </div>
    </header>
  );
}

/**
 * The scroll experience: persistent chrome (wordmark + audience CTAs, the
 * sponsor ask as the single Gulf action), a 1px Gulf progress hairline, a
 * quiet scroll cue on the cold open, the pinned film, and an end-card so the
 * scroll never dead-ends. Lenis smooth-scroll is global; keyboard input steps
 * beat-by-beat through the film.
 */
export default function ExperienceScroll() {
  const reduce = useReducedMotion();
  const bands = useBands();
  const stageRef = useRef<HTMLDivElement>(null);
  // All chrome choreography is scoped to the STAGE's progress, not the
  // document's — the end-card below can grow without desynchronizing it.
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end end'] });

  // Glide to a beat's copy anchor. Measured viewport unit (svh-true):
  // innerHeight diverges from svh when mobile toolbars collapse, and the
  // drift would now scale by ~30 bands. Distance-scaled duration: jumps span
  // 1–2.4+ viewports; a fixed duration would fast-forward the long ones and
  // crawl the short ones.
  const jumpTo = useCallback((k: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const stageTop = stage.getBoundingClientRect().top + window.scrollY;
    const unit = stage.offsetHeight / bands.total;
    const y = stageTop + bands.anchorVh[k] * unit;
    const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, o?: object) => void } }).lenis;
    const dvp = Math.abs(y - window.scrollY) / unit;
    const duration = Math.min(1.6, Math.max(0.9, 0.55 * dvp + 0.5));
    if (lenis) lenis.scrollTo(y, { duration });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  }, [bands]);

  // Keyboard: step the film beat-by-beat (Lenis smooths wheel only; raw key
  // jumps snap through the dissolves). Space/PageDown/↓ next, PageUp/↑ prev.
  // Current beat comes from band OWNERSHIP (the plate on screen), never
  // nearest-anchor — on weighted bands the post-deadZone money-frame hold
  // sits past the anchor midpoint and nearest-anchor would skip the next
  // beat from exactly where viewers rest (3-lens review consensus).
  useEffect(() => {
    // Reduced motion renders the unweighted StaticStage — leave the keys to
    // the browser's native scrolling instead of hijacking with film geometry.
    if (reduce) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const stage = stageRef.current;
      if (!stage) return;
      const keys = [' ', 'PageDown', 'ArrowDown', 'PageUp', 'ArrowUp', 'Home', 'End'];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      const stageTop = stage.getBoundingClientRect().top + window.scrollY;
      const unit = stage.offsetHeight / bands.total;
      const beat = bandAtVh((window.scrollY - stageTop) / unit, bands);
      const dir = e.key === 'PageUp' || e.key === 'ArrowUp' || (e.key === ' ' && e.shiftKey) ? -1 : 1;
      const target =
        e.key === 'Home' ? 0
        : e.key === 'End' ? N - 1
        : Math.min(N - 1, Math.max(0, beat + dir));
      jumpTo(target);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reduce, bands, jumpTo]);

  return (
    <>
      {reduce ? (
        <StaticChrome />
      ) : (
        <StageChrome key={bands === FINE_BANDS ? 'f' : 'c'} progress={scrollYProgress} bands={bands} jumpTo={jumpTo} />
      )}

      <div ref={stageRef}>
        <CinematicStage />
      </div>

      {/* End-card: the scroll must never dead-end after the ask. The four
          pillars are the film's crawlable layer — REAL on-page H2s carry the
          keyword freight (visible text outranks any sr-only prose); every
          pillar link is ghost so the card's single Gulf CTA keeps the
          one-accent law. */}
      <section id="experience-end" className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-content px-6 py-16 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-2xl font-bold tracking-tight-exotiq text-ink md:text-3xl">
              Rent. Drive. Gather. Partner.
            </h2>
            <Link
              href="/apply"
              className="w-fit rounded-sm bg-gulf px-6 py-3 text-sm font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
            >
              Get on the list
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'Rent',
                copy: 'The exotiq.rent marketplace — McLaren, Porsche, Lamborghini, Rolls-Royce, and the rest of the dream garage. Coming soon.',
                cta: 'Join the waitlist', href: '/marketplace',
              },
              {
                name: 'Drive',
                copy: 'Curated, invite-only drives. The last Sunday of every month, at sunrise.',
                cta: 'Request your invite', href: '/apply',
              },
              {
                name: 'Gather',
                copy: 'A monthly Cars & Coffee worth parking at — the cars and the people who actually drive them.',
                cta: 'Enter the drives', href: '/drives',
              },
              {
                name: 'Partner',
                copy: 'We partner with events and brands that get it. Bring us yours.',
                cta: 'Partner with us', href: '/sponsor?interest=partnership',
              },
            ].map((p) => (
              <div key={p.name} className="flex flex-col gap-3 bg-canvas p-6">
                <h3 className="text-[11px] font-semibold tracking-[0.08em] text-ink-2">{p.name}</h3>
                <p className="text-sm leading-relaxed text-ink-2">{p.copy}</p>
                <Link href={p.href} className="mt-auto w-fit text-xs font-semibold text-ink transition-colors hover:text-gulf">
                  {p.cta} →
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-display text-sm font-bold tracking-tight-exotiq text-ink">Drive Exotiq</p>
              <p className="mt-1 text-xs text-ink-3">An Exotiq Inc. brand — the community front door to the exotiq.rent marketplace.</p>
            </div>
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-2">
              <Link href="/drives" className="transition-colors hover:text-ink">The drives</Link>
              <Link href="/tour" className="transition-colors hover:text-ink">The tour</Link>
              <Link href="/sponsor" className="transition-colors hover:text-ink">Sponsor</Link>
              <Link href="/blog" className="transition-colors hover:text-ink">Stories</Link>
              <span className="text-ink-3">© {new Date().getFullYear()} Exotiq Inc.</span>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
