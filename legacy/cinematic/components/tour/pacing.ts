import { BEATS } from './data';

/**
 * THE single source of truth for roadbook pacing (owner bug 2026-07-07: the
 * city windows were widened for longer holds, which let neighbouring cities
 * overlap at full opacity — Denver and Dallas stacked on screen. CityBeat and
 * Odometer previously each carried their own copies of these constants and
 * drifted; now both import from here).
 *
 * Model: the drive [DRIVE_START, DRIVE_END] divides into one EXCLUSIVE slot
 * per city. Within a slot: fade in over the first 15%, hold for 62%, fade out
 * by 92% — the final 8% is a beat of empty road before the next city enters.
 * Windows cannot intersect by construction, so no two cities can ever be on
 * stage together, at any scroll speed.
 *
 * The odometer interpolates cumulative route miles PIECEWISE across the same
 * slots, so the counter rolls up to each city's cumulative mileage exactly as
 * that city's slot completes — the number and the name always agree.
 */
// NOTE: these operate in DRIVE space (RoadbookStage already remaps raw scroll
// [0.08, 0.92] → drive [0, 1]), so margins here stack on that outer window.
// 0.04 ≈ one viewport of pure rolling road after the hero before Denver.
export const DRIVE_START = 0.04;
export const DRIVE_END = 0.93;

const SPAN = DRIVE_END - DRIVE_START;
const SLOT = SPAN / BEATS.length;

/** Exclusive opacity window for city `index`: [start, fullAt, holdUntil, gone]. */
export function cityWindow(index: number) {
  const s = DRIVE_START + index * SLOT;
  return {
    start: s,
    fullAt: s + SLOT * 0.15,
    holdUntil: s + SLOT * 0.77,
    gone: s + SLOT * 0.92,
    // y-travel anchors (the words drift up through the slot)
    slotStart: s,
    slotEnd: s + SLOT,
  };
}

/** Which city owns drive-progress `p` (for the HUD leg/name). */
export function cityIndexAt(p: number) {
  const i = Math.floor((p - DRIVE_START) / SLOT);
  return Math.min(BEATS.length - 1, Math.max(0, i));
}

/**
 * Cumulative odometer miles at drive-progress `p`: piecewise-linear from the
 * previous city's cumulative miles to this city's, completing at the slot end.
 * Leg distances vary wildly (Denver→Dallas 785mi vs Palm Beach→Ft Lauderdale
 * 45mi) — a linear total would put the wrong number next to every city.
 */
export function milesAt(p: number) {
  if (p <= DRIVE_START) return 0;
  const last = BEATS[BEATS.length - 1].mi;
  if (p >= DRIVE_END) return last;
  const i = cityIndexAt(p);
  const from = i === 0 ? 0 : BEATS[i - 1].mi;
  const to = BEATS[i].mi;
  const t = (p - (DRIVE_START + i * SLOT)) / SLOT;
  return Math.round(from + Math.min(1, Math.max(0, t)) * (to - from));
}
