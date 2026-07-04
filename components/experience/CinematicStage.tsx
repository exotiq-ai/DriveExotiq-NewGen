'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { FRAMES, type Frame } from './frames';
import { LIVING, OVERLAYS, EXITS, FADES } from './living';
import LivingLayer from './LivingLayer';
import GaugeSweep from './GaugeSweep';
import LampBreath from './LampBreath';
import Odometer from './Odometer';

const N = FRAMES.length;
// Copy block k is viewport-centered at progress k/(N-1) — media bands must use
// the same denominator or the two drift apart down the page.
const D = 1 / (N - 1);

/**
 * The copy for one beat — resolves into focus (lift + de-blur) when centered.
 * The de-blur is desktop-only: animating filter on text forces per-frame
 * re-rasterization during iOS momentum scroll (review finding), so coarse
 * pointers get the same lift with opacity only.
 */
function useNoTextBlur() {
  const [noBlur, setNoBlur] = useState(false);
  useEffect(() => {
    setNoBlur(window.matchMedia('(max-width: 767px), (pointer: coarse)').matches);
  }, []);
  return noBlur;
}

function Copy({ frame }: { frame: Frame }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const noBlur = useNoTextBlur();
  const inView = useInView(ref, { amount: 0.55 });
  const show = reduce || inView;

  const alignItems =
    frame.align === 'center' ? 'items-center text-center'
    : frame.align === 'right' ? 'items-end text-right'
    : 'items-start text-left';
  const justify =
    frame.align === 'center' ? 'justify-center'
    : frame.align === 'right' ? 'justify-end'
    : 'justify-start';

  const has = frame.kicker || frame.headline || frame.jewel || frame.body || frame.cta || frame.secondaryCta;
  if (!has) return <div className="h-[100svh]" aria-hidden="true" />;

  return (
    <div className="flex h-[100svh] items-center">
      <div className="mx-auto w-full max-w-content px-6 md:px-8">
        <motion.div
          ref={ref}
          className={cn('flex w-full flex-col', alignItems)}
          initial={false}
          animate={
            reduce
              ? undefined
              : noBlur
                ? { opacity: show ? 1 : 0, y: show ? 0 : 30 }
                : { opacity: show ? 1 : 0, y: show ? 0 : 30, filter: show ? 'blur(0px)' : 'blur(6px)' }
          }
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          {frame.kicker && <span className="mb-5 text-[11px] uppercase tracking-[0.2em] text-ink-3">{frame.kicker}</span>}
          {frame.headline && (
            <h2 className="max-w-[16ch] font-display text-4xl font-bold leading-[1.03] tracking-tight-exotiq text-ink md:text-6xl">
              {frame.headline}
            </h2>
          )}
          {frame.jewel && <p className="mt-4 font-serif text-2xl italic text-ink-2 md:text-3xl">{frame.jewel}</p>}
          {frame.body && (
            <p className="mt-4 max-w-prose text-base text-ink-2 md:text-lg">
              {frame.odometerTarget && frame.body.includes('{n}')
                ? frame.body.split('{n}').flatMap((part, i, arr) =>
                    i < arr.length - 1 ? [part, <Odometer key={i} to={frame.odometerTarget!} />] : [part])
                : frame.body}
            </p>
          )}
          {(frame.cta || frame.secondaryCta) && (
            // The finale's ask arrives as film: the CTA row rises a beat after
            // the jewel line, each button staggered (SB-20 only; elsewhere the
            // row resolves with the block).
            <motion.div
              className={cn('mt-8 flex flex-wrap gap-3', justify)}
              initial={false}
              animate={
                reduce || frame.id !== 'SB-20'
                  ? undefined
                  : noBlur
                    ? { opacity: show ? 1 : 0, y: show ? 0 : 24 }
                    : { opacity: show ? 1 : 0, y: show ? 0 : 24, filter: show ? 'blur(0px)' : 'blur(6px)' }
              }
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {frame.cta && (
                <Link href={frame.ctaHref || '#'} className="rounded-sm bg-gulf px-6 py-3 text-sm font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2">
                  {frame.cta}
                </Link>
              )}
              {frame.secondaryCta && (
                <motion.span
                  initial={false}
                  animate={reduce || frame.id !== 'SB-20' ? undefined : { opacity: show ? 1 : 0, y: show ? 0 : 24 }}
                  transition={{ duration: 0.7, delay: 0.47, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={frame.secondaryCtaHref || '#'} className="rounded-sm border border-line-2 px-6 py-3 text-sm font-semibold text-ink transition-colors duration-250 ease-de hover:border-ink-3">
                    {frame.secondaryCta}
                  </Link>
                </motion.span>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/** One cross-fading, slowly-zooming media plate in the pinned stage. */
function Plate({ frame, index, progress, priority, active }: { frame: Frame; index: number; progress: MotionValue<number>; priority?: boolean; active: number }) {
  // Opaque-underneath crossfade: the incoming plate fades in OVER a still
  // fully-opaque outgoing plate (later sibling paints above — keep DOM order,
  // never add z-index), and the outgoing drops to 0 only once provably
  // covered. True film dissolve: no canvas/vignette dip at any boundary, in
  // either scroll direction. Per-boundary width via FADES (keyed by the
  // OUTGOING plate id), centered on the boundary (k±0.5)·D so reverse scroll
  // stays symmetric. The fade-in completes at plate-local p≈0.15 — the scrub
  // deadZones (living.ts) start there so scrubbing begins only once the plate
  // is fully visible; retune both together.
  const HALF = 0.15;
  const sIn = FADES[FRAMES[index - 1]?.id ?? ''] ?? 1;
  const sOut = FADES[frame.id] ?? 1;
  const inStart = (index - 0.5 - HALF * sIn) * D;
  const inEnd = (index - 0.5 + HALF * sIn) * D;
  const nextOpaque = (index + 0.5 + HALF * sOut) * D; // the plate above is at opacity 1
  const outStart = nextOpaque + 0.03 * D;
  const outEnd = outStart + 0.12 * D;
  const stops =
    index === 0 ? [0, outStart, outEnd]
    : index === N - 1 ? [inStart, inEnd, 1]
    : [inStart, inEnd, outStart, outEnd];
  const values = index === 0 ? [1, 1, 0] : index === N - 1 ? [0, 1, 1] : [0, 1, 1, 0];
  const opacity = useTransform(progress, stops, values);

  // Once covered, the plate's video decodes invisibly — pause it (resumes the
  // moment upward scroll uncovers it, just before the reveal).
  const [covered, setCovered] = useState(index !== 0);
  useMotionValueEvent(progress, 'change', (v) => {
    const c = v > nextOpaque || v < inStart;
    setCovered((cur) => (cur === c ? cur : c));
  });
  // SB-20 is locked-off (the finale holds its breath) — no ken-burns.
  const finale = frame.id === 'SB-20';
  const scale = useTransform(
    progress,
    [Math.max(0, (index - 0.6) * D), Math.min(1, (index + 0.6) * D)],
    finale ? [1, 1] : [1.06, 1.16],
  );
  // Plate-local progress: 0 at band entry, 1 at band exit (same N-1 math).
  const p = useTransform(progress, [(index - 0.5) * D, (index + 0.5) * D], [0, 1]);

  // Treatment exit moves (crane-away / dive / whip) over the band's final
  // stretch — on the outer wrapper so they compose with the ken-burns.
  const exit = EXITS[frame.id];
  const exitScale = useTransform(p, [exit?.from ?? 2, 1], [1, exit?.scale ?? 1]);
  const exitY = useTransform(p, [exit?.from ?? 2, 1], ['0%', exit?.y ?? '0%']);

  const living = LIVING[frame.id];
  const overlay = OVERLAYS[frame.id];
  const dist = Math.abs(index - active);

  // GPU promotion only for the working set (incoming/active/outgoing) — a
  // permanently promoted 24-plate stack pins ~48 viewport-sized compositor
  // buffers and blows the iOS Safari tile budget. Stills stay mounted for all
  // plates (teleports/fast flicks must never land on an unpainted layer).
  const promote = dist <= 1;

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity, scale: exitScale, y: exitY, transformOrigin: exit?.origin, willChange: promote ? 'opacity, transform' : undefined }}
    >
      <motion.div className="absolute inset-0" style={{ scale, willChange: promote ? 'transform' : undefined }}>
        <Image src={frame.media} alt="" fill sizes="100vw" priority={priority} className="object-cover" />
        {/* Living layer: poster-first enhancement, mounted ±2 bands (buffer), playing ±1 while uncovered. */}
        {living && dist <= 2 && <LivingLayer cfg={living} p={p} near={dist <= 1 && !covered} />}
      </motion.div>
      {/* Instrument/code overlays sit outside the ken-burns wrapper — razor-sharp, no zoom. */}
      {overlay === 'gauge' && dist <= 1 && <GaugeSweep p={p} />}
      {overlay === 'lamp' && dist <= 1 && <LampBreath />}
      {/* Finale vignette settle — the theater lights coming down. */}
      {finale && <FinaleVignette p={p} />}
    </motion.div>
  );
}

function FinaleVignette({ p }: { p: MotionValue<number> }) {
  const vignette = useTransform(p, [0.5, 1], [0.35, 0.5]);
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: vignette,
        background: 'radial-gradient(120% 95% at 50% 45%, transparent 35%, rgba(7,7,8,1) 100%)',
      }}
    />
  );
}

/** Pinned full-viewport media layer: all plates stacked, cross-fading on scroll. */
function StageMedia({ progress }: { progress: MotionValue<number> }) {
  // Active plate index — drives windowed mounting of living layers only; the
  // cross-dissolve itself stays purely motion-value-driven.
  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, 'change', (v) => {
    const i = Math.round(v / D);
    setActive((cur) => (cur === i ? cur : i));
  });
  // 'change' never fires for a restored scroll position — sync before paint
  // (iOS Safari restores scroll aggressively; a post-paint sync would commit
  // one frame with the wrong working set promoted).
  useLayoutEffect(() => {
    setActive(Math.round(progress.get() / D));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-canvas">
      {FRAMES.map((f, i) => (
        <Plate key={f.id} frame={f} index={i} progress={progress} priority={i === 0} active={active} />
      ))}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 42%, transparent 40%, rgba(11,11,12,.5) 85%), linear-gradient(180deg, rgba(11,11,12,.5), transparent 22%, transparent 60%, rgba(11,11,12,.85))',
        }}
      />
    </div>
  );
}

/** Reduced-motion / no-JS friendly: plain stacked static beats, no pinning or cross-fade. */
function StaticStage() {
  return (
    <div>
      {FRAMES.map((f) => (
        <section key={f.id} className="relative flex min-h-[100svh] items-center overflow-hidden bg-canvas">
          <Image src={f.media} alt="" fill sizes="100vw" className="object-cover opacity-90" />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(11,11,12,.5), transparent 26%, transparent 56%, rgba(11,11,12,.85))' }}
          />
          <div className="relative z-[2] w-full">
            <Copy frame={f} />
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * The cinematic scroll stage — one pinned viewport that cross-dissolves and
 * slow-zooms through every beat as you scroll (the "one continuous camera"
 * feel), with copy resolving in over the top. Fully reduced-motion safe.
 */
export default function CinematicStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  if (reduce) return <StaticStage />;

  return (
    <section ref={ref} className="relative">
      <StageMedia progress={scrollYProgress} />
      <div className="relative z-10 -mt-[100svh]">
        {FRAMES.map((f) => (
          <Copy key={f.id} frame={f} />
        ))}
      </div>
    </section>
  );
}
