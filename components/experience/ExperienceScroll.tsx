'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import CinematicStage from './CinematicStage';

/**
 * The scroll experience: a persistent chrome (wordmark + the two audience CTAs,
 * with the sponsor ask as the single Gulf action) over the sequence of frames.
 * Lenis smooth-scroll is provided globally by the root layout.
 *
 * The chrome bows out over the finale band — SB-20's in-frame CTAs take the
 * one-Gulf-accent baton (the persistent buttons are redundant there anyway).
 */
export default function ExperienceScroll() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const chromeOpacity = useTransform(scrollYProgress, [0.965, 0.985], [1, 0]);
  const chromeEvents = useTransform(chromeOpacity, (o) => (o < 0.2 ? ('none' as const) : ('auto' as const)));

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
              Reserve an exotic
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

      <CinematicStage />
    </>
  );
}
