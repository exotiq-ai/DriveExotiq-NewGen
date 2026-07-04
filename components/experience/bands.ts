'use client';

// Weighted band math for the pinned stage (reviewed change — 3-lens adversarial
// pass 2026-07-04; numeric sim in the session scratchpad proved weight-1
// equivalence to machine precision and stop monotonicity for both tables).
//
// A beat's copy block is weight·100svh tall (CSS: .beat-h in globals.css), so
// the column is TOTAL viewports and stage progress spans TOTAL−1 viewports of
// scroll. Every band position derives from the cumulative weight prefix; with
// all weights at 1 this reduces exactly to the old k/(N−1) math.
//
// Two tables: scrub-capable viewports (SCRUB_MQ) use `weight`; coarse pointers
// use `mobileWeight ?? weight` — their scrub beats fall back to play-once
// video, which finishes in wall-clock time and can't fill a long band.

import { useEffect, useState } from 'react';
import { FRAMES } from './frames';

/**
 * The scrub-capability query. MUST stay in sync with useCanScrub in
 * LivingLayer.tsx and the .beat-h media query in globals.css — CSS lays out
 * the block heights, this module computes the matching progress math.
 */
export const SCRUB_MQ = '(min-width: 1024px) and (pointer: fine)';

const N = FRAMES.length;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export interface Bands {
  /** Σ weights — the copy column height in viewports. */
  total: number;
  /** One viewport of scroll, in stage-progress units: 1/(total−1). */
  unit: number;
  /** Band k in progress units — plate k owns [start[k], end[k]] (copy-block edges crossing viewport center). */
  start: number[];
  end: number[];
  /** Copy-anchor position of beat k, in scroll-viewport units from the stage top (keyboard nav / ticks). */
  anchorVh: number[];
  /** Effective per-beat weight and clamped copy anchor (Copy block CSS vars). */
  weight: number[];
  copyAt: number[];
}

function compute(pick: (f: (typeof FRAMES)[number]) => number): Bands {
  const weight = FRAMES.map((f) => pick(f));
  const prefix: number[] = [];
  let acc = 0;
  for (const w of weight) { prefix.push(acc); acc += w; }
  const total = acc;
  const unit = 1 / (total - 1);
  const start = FRAMES.map((_, k) => (prefix[k] - 0.5) * unit);
  const end = FRAMES.map((_, k) => (prefix[k] + weight[k] - 0.5) * unit);
  // Clamp so the 100svh anchor window stays inside the block (weight 1 ⇒ 0.5).
  const copyAt = FRAMES.map((f, k) => clamp(f.copyAt ?? 0.5, 0.5 / weight[k], 1 - 0.5 / weight[k]));
  const anchorVh = FRAMES.map((_, k) => prefix[k] + copyAt[k] * weight[k] - 0.5);
  return { total, unit, start, end, anchorVh, weight, copyAt };
}

export const FINE_BANDS = compute((f) => f.weight ?? 1);
export const COARSE_BANDS = compute((f) => f.mobileWeight ?? f.weight ?? 1);

/** Band index containing stage progress v — the plate whose copy block owns the viewport center. */
export function bandAt(v: number, b: Bands): number {
  let i = 0;
  while (i < N - 1 && v >= b.end[i]) i++;
  return i;
}

/** Same containment in scroll-viewport units (keyboard nav measures the stage directly). */
export function bandAtVh(scrolledVh: number, b: Bands): number {
  return bandAt(scrolledVh * b.unit, b);
}

/**
 * The active weight table. Initialized synchronously from matchMedia on the
 * first client render (SSR falls back to coarse) so a restored mid-page scroll
 * paints with the same table CSS used for the block heights — a post-paint
 * flip here would commit one frame of wrong plate opacities (the same class of
 * bug as the iOS scroll-restoration active-index sync).
 */
export function useBands(): Bands {
  const [fine, setFine] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(SCRUB_MQ).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(SCRUB_MQ);
    const sync = () => setFine(mq.matches);
    sync();
    // Belt and suspenders beyond the MQ change event: a tab that hydrates
    // hidden/zero-sized (restored session, background prerender) can evaluate
    // the query wrong AND miss the change event — resync when the viewport or
    // visibility actually materializes, or the JS math desyncs from the CSS
    // block heights.
    mq.addEventListener('change', sync);
    window.addEventListener('resize', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      mq.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);
  return fine ? FINE_BANDS : COARSE_BANDS;
}
