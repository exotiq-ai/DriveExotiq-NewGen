'use client';

import { useEffect, useRef } from 'react';
import { MotionValue, useMotionValueEvent } from 'framer-motion';
import { BEATS } from './data';
import { cityIndexAt, milesAt } from './pacing';

// One-way route distance semantics live in pacing.ts: the odometer ends at
// Miami's cumulative mile (≈2,500), consistent with the per-leg sum. The
// ~5,000-mile round-trip figure lives in the finale, labelled as such.

interface OdometerProps {
  /** Drive progress 0→1 across the pinned stage. */
  progress: MotionValue<number>;
}

/**
 * Persistent HUD — odometer (tabular-nums, Bricolage) + "LEG n/10 · miles".
 * Decorative: the real, crawlable mile/leg copy lives in the server sections,
 * so this whole island is aria-hidden. Updates imperatively from the scroll
 * MotionValue to avoid re-rendering React on every frame.
 */
export default function Odometer({ progress }: OdometerProps) {
  const odoRef = useRef<HTMLSpanElement>(null);
  const legRef = useRef<HTMLSpanElement>(null);
  const cityRef = useRef<HTMLSpanElement>(null);

  const render = (p: number) => {
    const clamped = p < 0 ? 0 : p > 1 ? 1 : p;
    // Miles + leg + city all derive from components/tour/pacing.ts — the same
    // exclusive slots that drive the CityBeat windows. The counter interpolates
    // cumulative route miles piecewise per slot, so it rolls up to each city's
    // real cumulative mileage exactly as that city holds the stage, and the
    // HUD can never announce a city that isn't on screen.
    if (odoRef.current) {
      odoRef.current.textContent = String(milesAt(clamped)).padStart(4, '0');
    }
    const beat = BEATS[cityIndexAt(clamped)];
    if (legRef.current) legRef.current.textContent = `leg ${beat.leg}/10`;
    if (cityRef.current) cityRef.current.textContent = beat.name;
  };

  useMotionValueEvent(progress, 'change', render);

  // Paint the initial frame once on mount.
  useEffect(() => {
    render(progress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none"
    >
      <div className="text-[10px] tracking-[0.18em] text-ink-3">odometer</div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span
          ref={odoRef}
          className="font-display text-[clamp(2rem,4.4vw,2.9rem)] font-semibold leading-none tabular-nums text-ink"
        >
          0000
        </span>
        <span className="text-[12px] text-ink-2">mi</span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[12px] text-ink-2">
        <span ref={legRef} className="tabular-nums tracking-[0.04em] text-gulf">
          leg 1/10
        </span>
        <span className="h-px w-4 bg-line-2" />
        <span ref={cityRef} className="font-serif italic text-ink-2">
          Denver
        </span>
      </div>
    </div>
  );
}
