'use client';

import Link from 'next/link';
import CinematicStage from './CinematicStage';

/**
 * The scroll experience: a persistent chrome (wordmark + the two audience CTAs,
 * with the sponsor ask as the single Gulf action) over the sequence of frames.
 * Lenis smooth-scroll is provided globally by the root layout.
 */
export default function ExperienceScroll() {
  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
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
      </header>

      <CinematicStage />
    </>
  );
}
