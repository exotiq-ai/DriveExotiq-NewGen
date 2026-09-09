'use client';

import { MotionValue, motion, useTransform } from 'framer-motion';
import type { CityBeat as CityBeatData } from './data';
import { cityWindow } from './pacing';

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
  // EXCLUSIVE slot windows from components/tour/pacing.ts — the single source
  // of truth shared with the Odometer (owner bug 2026-07-07: overlapping
  // windows stacked Denver and Dallas at full opacity; per-component pacing
  // constants had drifted). One city on stage at a time, by construction:
  // fade in 15% of the slot, hold to 77%, gone by 92%, then a breath of empty
  // road before the next city enters.
  const w = cityWindow(index);

  const opacity = useTransform(
    progress,
    [w.start, w.fullAt, w.holdUntil, w.gone],
    [0, 1, 1, 0]
  );
  // Words rise as they pass the car: come up from below, drift up and out.
  const y = useTransform(progress, [w.slotStart, w.slotEnd], [40, -40]);

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
