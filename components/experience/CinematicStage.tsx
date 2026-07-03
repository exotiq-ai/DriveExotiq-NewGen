'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { FRAMES, type Frame } from './frames';

const N = FRAMES.length;
// Copy block k is viewport-centered at progress k/(N-1) — media bands must use
// the same denominator or the two drift apart down the page.
const D = 1 / (N - 1);

/** The copy for one beat — resolves into focus (lift + de-blur) when centered. */
function Copy({ frame }: { frame: Frame }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
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
          animate={reduce ? undefined : { opacity: show ? 1 : 0, y: show ? 0 : 30, filter: show ? 'blur(0px)' : 'blur(6px)' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          {frame.kicker && <span className="mb-5 text-[11px] uppercase tracking-[0.2em] text-ink-3">{frame.kicker}</span>}
          {frame.headline && (
            <h2 className="max-w-[16ch] font-display text-4xl font-bold leading-[1.03] tracking-tight-exotiq text-ink md:text-6xl">
              {frame.headline}
            </h2>
          )}
          {frame.jewel && <p className="mt-4 font-serif text-2xl italic text-ink-2 md:text-3xl">{frame.jewel}</p>}
          {frame.body && <p className="mt-4 max-w-prose text-base text-ink-2 md:text-lg">{frame.body}</p>}
          {(frame.cta || frame.secondaryCta) && (
            <div className={cn('mt-8 flex flex-wrap gap-3', justify)}>
              {frame.cta && (
                <Link href={frame.ctaHref || '#'} className="rounded-sm bg-gulf px-6 py-3 text-sm font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2">
                  {frame.cta}
                </Link>
              )}
              {frame.secondaryCta && (
                <Link href={frame.secondaryCtaHref || '#'} className="rounded-sm border border-line-2 px-6 py-3 text-sm font-semibold text-ink transition-colors duration-250 ease-de hover:border-ink-3">
                  {frame.secondaryCta}
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/** One cross-fading, slowly-zooming media plate in the pinned stage. */
function Plate({ frame, index, progress, priority }: { frame: Frame; index: number; progress: MotionValue<number>; priority?: boolean }) {
  // Plate k is fully opaque around its copy's center (k*D), cross-fading over
  // the half-viewport on either side. First/last plates hold at the edges.
  const stops =
    index === 0 ? [0, 0.35 * D, 0.6 * D]
    : index === N - 1 ? [1 - 0.6 * D, 1 - 0.35 * D, 1]
    : [(index - 0.5) * D, (index - 0.15) * D, (index + 0.15) * D, (index + 0.5) * D];
  const values = index === 0 ? [1, 1, 0] : index === N - 1 ? [0, 1, 1] : [0, 1, 1, 0];
  const opacity = useTransform(progress, stops, values);
  const scale = useTransform(progress, [Math.max(0, (index - 0.6) * D), Math.min(1, (index + 0.6) * D)], [1.06, 1.16]);

  return (
    <motion.div className="absolute inset-0 will-change-[opacity]" style={{ opacity }}>
      <motion.div className="absolute inset-0 will-change-transform" style={{ scale }}>
        <Image src={frame.media} alt="" fill sizes="100vw" priority={priority} className="object-cover" />
      </motion.div>
    </motion.div>
  );
}

/** Pinned full-viewport media layer: all plates stacked, cross-fading on scroll. */
function StageMedia({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-canvas">
      {FRAMES.map((f, i) => (
        <Plate key={f.id} frame={f} index={i} progress={progress} priority={i === 0} />
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
