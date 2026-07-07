'use client';

import { MotionValue, motion, useTransform } from 'framer-motion';
import type { CityBeat as CityBeatData } from './data';

interface CityBeatProps {
  beat: CityBeatData;
  index: number;
  total: number;
  /** Drive progress 0→1 across the pinned stage. */
  progress: MotionValue<number>;
}

/**
 * One decorative city beat that travels past the car: fade-up → hold → continue
 * up as drive progress crosses this stop's window. Purely visual (aria-hidden);
 * the readable copy is server-rendered in the page's <section> list.
 */
export default function CityBeat({ beat, index, total, progress }: CityBeatProps) {
  // Beat centers compress into drive [0.09, 0.88] (2026-07-06 fix: the raw
  // [0,1] spread put Denver at full opacity under the old intro overlay and
  // kept Miami on stage into the finale; the margins clear both ends. The
  // stage intro was cut 2026-07-07, so Denver now enters a touch earlier.)
  const raw = total > 1 ? index / (total - 1) : 0;
  const center = 0.09 + raw * 0.79;
  // Half-width of this beat's window; slight overlap reads as continuous travel.
  const half = total > 1 ? (1 / (total - 1)) * 0.68 : 0.5;

  // Owner pacing note 2026-07-07: cities and mileage should HOLD, not flash.
  // The plateau widened from 18% to 45% of the window (with the taller 1300vh
  // track, each city now rests on screen ~2.4x longer than it did), and the
  // vertical travel eased so the hold reads as a stop, not a drive-by.
  const start = center - half;
  const inEnd = center - half * 0.45;
  const outStart = center + half * 0.45;
  const end = center + half;

  const opacity = useTransform(
    progress,
    [start, inEnd, outStart, end],
    [0, 1, 1, 0]
  );
  // Words rise as they pass the car: come up from below, drift up and out.
  const y = useTransform(progress, [start, end], [48, -48]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity, y }}
      className="pointer-events-none absolute left-0 top-1/2 max-w-[34rem] -translate-y-1/2 will-change-transform"
    >
      <div className="flex items-center gap-3 text-[12px] tracking-[0.04em] text-gulf">
        <span className="h-px w-6 bg-gulf" />
        <span className="tabular-nums">
          leg {beat.leg} / {total}
        </span>
        {beat.tag && <span className="text-ink-3">· {beat.tag}</span>}
      </div>

      <div className="mt-3 font-display text-[clamp(2.6rem,6.4vw,5rem)] font-semibold leading-[0.94] tracking-tightest text-ink">
        {beat.name}
      </div>

      <p className="mt-4 max-w-[26ch] font-serif text-[clamp(1.05rem,1.8vw,1.35rem)] italic leading-snug text-ink-2">
        {beat.dek}
      </p>

      <div className="mt-5 text-[12px] tracking-[0.1em] text-ink-3">
        {beat.legMi}
      </div>
    </motion.div>
  );
}
