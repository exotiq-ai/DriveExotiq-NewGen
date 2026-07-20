// The film's chapter map (final design push, Phase E): wayfinding data for the
// desktop chapter rail, the mobile current-chapter label, and the FilmMenu
// chapter list. GROUPING ONLY — frames.ts stays the single source of film
// order and beat identity; every index here derives from FRAMES at module
// load, so a beat cut or reorder can never strand a hardcoded index (SB-14b's
// cut is exactly the failure mode this guards against). Titles follow the
// locked voice: short, sentence case, no Gulf language — chapters are places,
// not actions.

import { FRAMES } from './frames';

export interface Chapter {
  /** Sentence-case chapter title (rail label, menu item, mobile chrome). */
  title: string;
  /** FRAMES index of the chapter's first beat — the rail tick + jump target. */
  first: number;
  /** FRAMES index of the chapter's last beat (inclusive). */
  last: number;
}

/**
 * Beat-id grouping, in film order. Ids that leave frames.ts drop out of their
 * chapter silently (the cut-beat doctrine: scenes leave, the map survives);
 * a chapter whose beats are all cut disappears with them.
 */
const GROUPS: { title: string; ids: string[] }[] = [
  { title: 'Cold open', ids: ['SB-01'] },
  { title: 'The door', ids: ['SB-02', 'SB-02b'] },
  { title: 'The fleet', ids: ['SB-04', 'SB-05', 'SB-06', 'SB-07', 'SB-08'] },
  { title: 'The drive-out', ids: ['SB-09', 'SB-10', 'SB-11b', 'SB-14c', 'SB-08b'] },
  { title: 'The drives', ids: ['SB-12', 'SB-14', 'SB-15'] },
  { title: 'The founder’s car', ids: ['SB-11', 'SB-13', 'SB-16', 'SB-18'] },
  { title: 'The tour & the ask', ids: ['SB-17', 'SB-19', 'SB-19b', 'SB-20'] },
];

export const CHAPTERS: Chapter[] = GROUPS
  .map(({ title, ids }) => {
    const ks = ids
      .map((id) => FRAMES.findIndex((f) => f.id === id))
      .filter((k) => k >= 0);
    return ks.length ? { title, first: Math.min(...ks), last: Math.max(...ks) } : null;
  })
  .filter((c): c is Chapter => c !== null);

/**
 * Chapter index owning beat k: the last chapter whose first beat is ≤ k.
 * Beats that predate the first chapter (can't happen today) clamp to 0, and
 * any future beat not yet listed in GROUPS inherits the chapter it scrolls
 * out of — the map degrades gracefully instead of throwing.
 */
export function chapterAt(beatIndex: number): number {
  let c = 0;
  for (let i = 1; i < CHAPTERS.length; i++) {
    if (CHAPTERS[i].first <= beatIndex) c = i;
  }
  return c;
}
