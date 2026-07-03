'use client';

import { useEffect, useRef } from 'react';
import { MotionValue, useMotionValueEvent } from 'framer-motion';
import { ODO_TARGET, BEATS } from './data';

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
    const miles = Math.round(clamped * ODO_TARGET);
    if (odoRef.current) {
      odoRef.current.textContent = String(miles).padStart(4, '0');
    }
    const idx = Math.min(
      BEATS.length - 1,
      Math.max(0, Math.round(clamped * (BEATS.length - 1)))
    );
    const beat = BEATS[idx];
    if (legRef.current) legRef.current.textContent = `LEG ${beat.leg}/10`;
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
          LEG 1/10
        </span>
        <span className="h-px w-4 bg-line-2" />
        <span ref={cityRef} className="font-serif italic text-ink-2">
          Denver
        </span>
      </div>
    </div>
  );
}
