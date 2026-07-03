'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Frame } from './frames';

/**
 * CinematicFrame — one full-viewport beat of the scroll spine.
 * Full-bleed media carries a subtle scroll-linked parallax; the copy resolves
 * into focus on arrival (lift + de-blur). Fully reduced-motion safe: no parallax,
 * no blur — a clean static frame. Gulf is reserved for the CTA only.
 */
export default function CinematicFrame({ frame, priority }: { frame: Frame; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.4, once: true });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // base scale > 1 gives margin so the parallax translate never reveals an edge
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.08, 1.12]);

  const resolved = reduce || inView;
  const alignClass =
    frame.align === 'center' ? 'items-center text-center'
    : frame.align === 'right' ? 'items-end text-right'
    : 'items-start text-left';
  const justify =
    frame.align === 'center' ? 'justify-center'
    : frame.align === 'right' ? 'justify-end'
    : 'justify-start';
  const hasCopy = frame.kicker || frame.headline || frame.jewel || frame.body || frame.cta;

  return (
    <section
      ref={ref}
      aria-label={frame.aria || frame.headline || frame.jewel || frame.id}
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-canvas"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 will-change-transform"
        style={reduce ? undefined : { y, scale }}
      >
        <Image src={frame.media} alt="" fill sizes="100vw" priority={priority} className="object-cover" />
        <span
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 42%, transparent 34%, rgba(11,11,12,.5) 82%), linear-gradient(180deg, rgba(11,11,12,.55), transparent 26%, transparent 54%, rgba(11,11,12,.85))',
          }}
        />
      </motion.div>

      {hasCopy && (
        <div className="relative z-[2] mx-auto w-full max-w-content px-6 md:px-8">
          <motion.div
            className={cn('flex w-full flex-col', alignClass)}
            initial={false}
            animate={
              reduce
                ? undefined
                : { opacity: resolved ? 1 : 0, y: resolved ? 0 : 26, filter: resolved ? 'blur(0px)' : 'blur(8px)' }
            }
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {frame.kicker && (
              <span className="mb-5 text-[11px] uppercase tracking-[0.2em] text-ink-3">{frame.kicker}</span>
            )}
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
                  <Link
                    href={frame.ctaHref || '#'}
                    className="rounded-sm bg-gulf px-6 py-3 text-sm font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
                  >
                    {frame.cta}
                  </Link>
                )}
                {frame.secondaryCta && (
                  <Link
                    href={frame.secondaryCtaHref || '#'}
                    className="rounded-sm border border-line-2 px-6 py-3 text-sm font-semibold text-ink transition-colors duration-250 ease-de hover:border-ink-3"
                  >
                    {frame.secondaryCta}
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}
