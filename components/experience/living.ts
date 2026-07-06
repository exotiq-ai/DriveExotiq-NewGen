// Living-media registry — which beats have a living layer and how it behaves.
// The stage is poster-first by construction: every plate always renders its
// graded still (the LCP / reduced-motion / Save-Data / Low-Power / slow-network
// path); a living layer is pure progressive enhancement that crossfades in over
// it once ready. Populate entries only after their encodes exist in
// public/videos/experience (encode-web.mjs). Source of truth for generation:
// docs/redesign/storyboard/beats-manifest.json.

export type LivingMedia =
  | {
      kind: 'loop';
      src: string;
      /** 720p variant served under 768px viewports. */
      mobileSrc?: string;
      poster?: string;
      /** Steady playback rate (SB-08b ships SB-05's loop at 0.7). */
      playbackRate?: number;
      /** Coast-down: [plateProgressStart, plateProgressEnd, minRate] (SB-16). */
      coastDown?: [number, number, number];
    }
  | {
      kind: 'play-once';
      src: string;
      mobileSrc?: string;
      poster?: string;
      /** Plate-local progress that triggers play (default 0.15). */
      playAt?: number;
      /** Rewind when progress falls back below this (default 0.02). */
      resetBelow?: number;
      /**
       * The encode carries an audio track and the beat offers a tap-to-unmute
       * (SB-11's real ignition bark). Playback always STARTS muted; sound only
       * on the user's gesture, re-muted the moment the beat leaves the stage.
       */
      sound?: boolean;
    }
  | {
      kind: 'scrub';
      /** All-intra H.264 baseline -g 2 encode. */
      src: string;
      /** VP9 -g 2 twin for Firefox. */
      webmSrc?: string;
      /** Normal-GOP encode for the mobile play-once fallback. */
      mobileSrc?: string;
      poster?: string;
      /** Scrub maps plate progress [a,b] -> [0,duration]; rests outside. */
      deadZone?: [number, number];
      /**
       * Code light-wipe that renders instantly under the video (still-first)
       * and IS the reveal on non-scrub devices (SB-19: zero video bytes on
       * mobile by design).
       */
      wipe?: { darkSrc: string; litSrc: string; completeAt?: number };
    }
  | {
      /** SB-19 light-wipe: masked lit still sweeps over the dark still. */
      kind: 'wipe';
      darkSrc: string;
      litSrc: string;
      /** Reveal completes at this plate progress so the money frame holds. */
      completeAt?: number;
    };

/** Per-beat instrument/code overlays rendered above the media layer. */
export type Overlay = 'gauge' | 'lamp';

/**
 * Treatment-specified exit moves, applied to the outgoing plate over the last
 * stretch of its band (composes with the ken-burns wrapper): SB-13 crane-away,
 * SB-14 drone dive, SB-15 whip-into-detail (origin = front wheel).
 */
export const EXITS: Record<string, { from: number; scale?: number; y?: string; origin?: string }> = {
  // NOTE: any `y` displacement must stay under the ken-burns overscan at its
  // trigger point (~1.15 scale = ~7% overhang) — under the opaque-underneath
  // crossfade the outgoing plate holds full opacity while transformed, so an
  // uncovered translate would expose the canvas at the viewport edge.
  'SB-13': { from: 0.85, scale: 1.02, y: '-4%' },
  'SB-14': { from: 0.78, scale: 1.14, y: '-3%' },
  'SB-15': { from: 0.82, scale: 1.22, origin: '30% 72%' },
};

/**
 * Per-boundary fade-band width scalars, keyed by the OUTGOING plate id.
 * 1 = the standard dissolve width; <1 compresses toward a film cut, >1
 * lingers. Centered on the band boundary so reverse scroll stays symmetric.
 * Treatment-mandated entries only — the rest is later art direction.
 */
export const FADES: Record<string, number> = {
  // "cut — not dissolve" into the founder frame, and the money frame must
  // HOLD past p=0.85 while its copy resolves (handoff SB-19 transition).
  'SB-19': 0.5,
};

/**
 * Film-print unifier for the REAL-footage beats (owner note: the jump from the
 * graded AI film world to clean 4K digital reads as a different movie). Keeps
 * the documentary legibility — the car stays clean — but seats the shots in
 * the same print: a warm soft-light wash, 35mm-style grain (the AI plates have
 * it baked in; real digital footage lacks it), and a touch more vignette.
 */
export const GRADE: Record<string, { wash?: number; grain?: number; vignette?: number }> = {
  'SB-17': { wash: 0.10, grain: 0.02, vignette: 0.12 },
  'SB-18': { wash: 0.10, grain: 0.02, vignette: 0.12 },
  'SB-19b': { wash: 0.14, grain: 0.03, vignette: 0.16 },
  // 2026-07-04 real-footage swaps: these clips are dusk-noir graded at encode
  // (SSIM-matched to the sb-19b recipe) but still lack the AI plates' baked
  // grain — a light print seat welds them in. SB-11's interior is already
  // near-black: grain only, no extra vignette.
  'SB-07': { wash: 0.06, grain: 0.02, vignette: 0.08 },
  'SB-08b': { wash: 0.06, grain: 0.02, vignette: 0.08 },
  'SB-11': { grain: 0.02 },
  'SB-12': { wash: 0.06, grain: 0.02, vignette: 0.08 },
  'SB-13': { wash: 0.06, grain: 0.02, vignette: 0.08 },
  // SB-13b drive-away: same print-seat as SB-13 (its dusk-noir grade is baked
  // at encode; the light wash/grain/vignette welds it into the film print).
  'SB-13b': { wash: 0.06, grain: 0.02, vignette: 0.08 },
  'SB-14': { wash: 0.06, grain: 0.02, vignette: 0.08 },
  'SB-14b': { wash: 0.06, grain: 0.02, vignette: 0.10 },
  'SB-15': { wash: 0.06, grain: 0.02, vignette: 0.08 },
  'SB-16': { wash: 0.06, grain: 0.02, vignette: 0.08 },
};

/**
 * Video delivery base. Dev serves from /public; production serves from
 * Cloudflare R2 (zero egress, byte-range verified 2026-07-03) via
 * media.driveexotiq.com — set NEXT_PUBLIC_MEDIA_BASE=https://media.driveexotiq.com/videos
 * in the Netlify environment. Posters stay on Netlify: they are the LCP path.
 */
import MEDIA_VERSIONS from './media-versions.json';

const vid = (file: string) => {
  const p = `/videos/experience/${file}`;
  const v = (MEDIA_VERSIONS as Record<string, string>)[p];
  return `${process.env.NEXT_PUBLIC_MEDIA_BASE ?? '/videos/experience'}/${file}${v ? `?v=${v}` : ''}`;
};

/** Poster/still delivery with the same content-version cache busting. */
const pos = (path: string) => {
  const v = (MEDIA_VERSIONS as Record<string, string>)[path];
  return `${path}${v ? `?v=${v}` : ''}`;
};

export const LIVING: Record<string, LivingMedia> = {
  // Populated per phase as encodes land — a beat without an entry = today's still, unchanged.

  // Phase 1 — SB-01: the room breathes (Kling t2, seam SSIM 0.986).
  'SB-01': {
    kind: 'loop',
    src: vid('sb-01.mp4'),
    mobileSrc: vid('sb-01.720.mp4'),
    poster: pos('/images/experience/poster/sb-01.jpg'),
  },

  // Phase 1 — SB-02: the sectional door rises under the visitor's scroll
  // (Veo v2-t2, full lift at 2× — the scroll owns pacing; mobile plays once).
  'SB-02': {
    kind: 'scrub',
    src: vid('sb-02-scrub.mp4'),
    webmSrc: vid('sb-02-scrub.webm'),
    mobileSrc: vid('sb-02.mp4'),
    poster: pos('/images/experience/poster/sb-02.jpg'), // frame 0 = door-closed slit
    deadZone: [0.12, 0.88],
  },

  // Phase 1 — SB-05: the 720S portrait breathes (Kling t2).
  'SB-05': {
    kind: 'loop',
    src: vid('sb-05.mp4'),
    mobileSrc: vid('sb-05.720.mp4'),
    poster: pos('/images/experience/poster/sb-05.jpg'),
  },

  // SB-08b REAL: the rain-beaded pair at the lakeside (Telluride 143.5–147.5,
  // slow pan) — the possession beat gets its own plate (owner: re-showing
  // SB-05's portrait here read as a repeat, not a decision).
  'SB-08b': {
    kind: 'loop',
    src: vid('sb-08b.mp4'),
    mobileSrc: vid('sb-08b.720.mp4'),
    poster: pos('/images/experience/poster/sb-08b.jpg'),
  },

  // Phase 1 — SB-08: "Choose your car." — the Huracán creeps toward you under
  // your own scroll (Veo t1, trim 1.0–4.5s, all-intra).
  'SB-08': {
    kind: 'scrub',
    src: vid('sb-08-scrub.mp4'),
    webmSrc: vid('sb-08-scrub.webm'),
    mobileSrc: vid('sb-08.mp4'),
    poster: pos('/images/experience/poster/sb-08.jpg'),
    deadZone: [0.15, 0.85],
  },

  // Phase 1 — SB-09: the dihedral door under the visitor's finger (Kling t1,
  // door-closed -> door-up, all-intra scrub + VP9 twin; mobile plays once).
  'SB-09': {
    kind: 'scrub',
    src: vid('sb-09-scrub.mp4'),
    webmSrc: vid('sb-09-scrub.webm'),
    mobileSrc: vid('sb-09.mp4'),
    poster: pos('/images/experience/poster/sb-09.jpg'), // frame 0 = door closed (scrub start)
    deadZone: [0.15, 0.85],
  },

  // Phase 1v2 — SB-10: a held breath at dawn in the authentic 720S cabin
  // (Nano Banana Pro re-render + Kling v2-t1, seam 0.965).
  'SB-10': {
    kind: 'loop',
    src: vid('sb-10.mp4'),
    mobileSrc: vid('sb-10.720.mp4'),
    poster: pos('/images/experience/poster/sb-10.jpg'),
  },

  // SB-11 REAL: the S8 start-button press (Roller 24.9–30.4s) — plays once as
  // the band enters, the cluster wakes, the V8 barks at ~3s and settles to
  // idle. The encode carries the REAL audio (24-bit location sound, loudness-
  // normalized); "Hear it start" unmutes and replays on tap.
  // Silent (owner 2026-07-06): the unmute is stripped because the master's
  // audio carries the videographer's music, not clean engine sound. Plays
  // muted like any other beat. TODO: re-encode sb-11 without the audio track,
  // and re-add an opt-in tap-to-"hear it start" once a clean startup recording
  // exists (the encode still carries the old audio track, just never unmuted).
  'SB-11': {
    kind: 'play-once',
    src: vid('sb-11.mp4'),
    mobileSrc: vid('sb-11.720.mp4'),
    poster: pos('/images/experience/poster/sb-11.jpg'),
  },

  // Phase 2 — SB-03: the threshold rush (Hailuo t2, baked seam).
  'SB-03': {
    kind: 'loop',
    src: vid('sb-03.mp4'),
    mobileSrc: vid('sb-03.720.mp4'),
    poster: pos('/images/experience/poster/sb-03.jpg'),
  },

  // Phase 2 — SB-04: the fleet aisle inhales (Kling t1).
  'SB-04': {
    kind: 'loop',
    src: vid('sb-04.mp4'),
    mobileSrc: vid('sb-04.720.mp4'),
    poster: pos('/images/experience/poster/sb-04.jpg'),
  },

  // Phase 2 — SB-06: the GT3 RS cooling down, taillight ember (Kling t2).
  'SB-06': {
    kind: 'loop',
    src: vid('sb-06.mp4'),
    mobileSrc: vid('sb-06.720.mp4'),
    poster: pos('/images/experience/poster/sb-06.jpg'),
  },

  // SB-07 is still-only since the real-458 swap (locked-off macro — the plate
  // + ken-burns carry it; zero video bytes by design).

  // Phase 2 — SB-11b: the first movement of the film — the car creeps out of
  // the garage (Veo v2-t1 from the authentic cabin frame; plays once, holds).
  'SB-11b': {
    kind: 'play-once',
    src: vid('sb-11b.mp4'),
    mobileSrc: vid('sb-11b.720.mp4'),
    poster: pos('/images/experience/poster/sb-11b.jpg'),
  },

  // SB-12 REAL: the aspen-road aerial. Traveling shot → PLAY-ONCE (owner
  // caught the class bug: xfade loop-seams double-expose a moving camera, and
  // the poster handoff ghosts the same way — near-static sources loop,
  // traveling shots play once and hold their composed last frame).
  'SB-12': {
    kind: 'play-once',
    src: vid('sb-12.mp4'),
    mobileSrc: vid('sb-12.720.mp4'),
    poster: pos('/images/experience/poster/sb-12.jpg'),
  },

  // SB-14 REAL: two cars in convoy on the high-country curve — directional,
  // play-once and hold.
  'SB-14': {
    kind: 'play-once',
    src: vid('sb-14.mp4'),
    mobileSrc: vid('sb-14.720.mp4'),
    poster: pos('/images/experience/poster/sb-14.jpg'),
  },

  // SB-16 REAL: the rolling wheel at baked half-speed — directional (a
  // reversed wheel spins backward), so play-once; the motion-blurred hold
  // frame reads as a long exposure. The old coastDown ramp retired with the
  // loop (the 0.5× bake IS the coast-down now).
  'SB-16': {
    kind: 'play-once',
    src: vid('sb-16.mp4'),
    mobileSrc: vid('sb-16.720.mp4'),
    poster: pos('/images/experience/poster/sb-16.jpg'),
  },

  // Phase 2 — SB-17: the route beat, landscape breathing at journey scale (Kling t1).
  'SB-17': {
    kind: 'loop',
    src: vid('sb-17.mp4'),
    mobileSrc: vid('sb-17.720.mp4'),
    poster: pos('/images/experience/poster/sb-17.jpg'),
  },

  // Phase 2 — SB-18: THE PIVOT — the real S8 a statue, only the world breathes (Kling t1).
  'SB-18': {
    kind: 'loop',
    src: vid('sb-18.mp4'),
    mobileSrc: vid('sb-18.720.mp4'),
    poster: pos('/images/experience/poster/sb-18.jpg'),
  },

  // SB-13 REAL: the S8 alone on the alpine pass — directional motion (the car
  // approaches), so play-once; a loop reversal would drive it backward.
  'SB-13': {
    kind: 'play-once',
    src: vid('sb-13.mp4'),
    mobileSrc: vid('sb-13.720.mp4'),
    poster: pos('/images/experience/poster/sb-13.jpg'),
  },

  // SB-13b REAL: the S8 drives away down the dusk mountain road (Roller
  // 64.0–68.8s, lifted dusk-noir grade). Directional → play-once, holds the
  // receding car on its last frame.
  'SB-13b': {
    kind: 'play-once',
    src: vid('sb-13b.mp4'),
    mobileSrc: vid('sb-13b.720.mp4'),
    poster: pos('/images/experience/poster/sb-13b.jpg'),
  },

  // SB-14c: the re-added coastal-cliff aerial (AI Kling loop, SB-14-t1 — the
  // McLaren's original coast take). Formation-locked, seamless loop. Reuses the
  // coast-aerial poster (frame-0 match); AI plate so no GRADE print-seat.
  'SB-14c': {
    kind: 'loop',
    src: vid('sb-14c.mp4'),
    mobileSrc: vid('sb-14c.720.mp4'),
    poster: pos('/images/experience/poster/coast-aerial.jpg'),
  },

  // Phase 1 — SB-15: "This could be you." — road-level chase at golden hour
  // (Veo t1, first=last with a baked 0.5s seam under the streaming world).
  'SB-15': {
    kind: 'loop',
    src: vid('sb-15.mp4'),
    mobileSrc: vid('sb-15.720.mp4'),
    poster: pos('/images/experience/poster/sb-15.jpg'),
  },

  // SB-20: the bookend — the identical SB-01 loop, the film returning home.
  'SB-20': {
    kind: 'loop',
    src: vid('sb-01.mp4'),
    mobileSrc: vid('sb-01.720.mp4'),
    poster: pos('/images/experience/poster/sb-01.jpg'),
  },

  // Phase 1 — SB-19b: the REAL get-in (S8 Roller master 16.2–24.5s, dusk-noir
  // regrade). Nothing generative touches the founder frame (§ SB-19b treatment).
  'SB-19b': {
    kind: 'play-once',
    src: vid('sb-19b.mp4'),
    mobileSrc: vid('sb-19b.720.mp4'),
    poster: pos('/images/experience/poster/sb-19b.jpg'),
  },

  // Phase 1 — SB-19: the livery light-wipe reveal. Desktop scrubs the Veo take
  // (t4, trimmed 1.0–5.2s, all-intra); the code wipe renders instantly beneath
  // it and IS the reveal on mobile/coarse pointers (zero video bytes there).
  'SB-19': {
    kind: 'scrub',
    src: vid('sb-19-scrub.mp4'),
    webmSrc: vid('sb-19-scrub.webm'),
    poster: pos('/images/experience/poster/sb-19.jpg'),
    deadZone: [0.08, 0.85], // reveal completes at 85% — the money frame holds
    wipe: {
      darkSrc: pos('/images/experience/poster/wrap-dark.webp'),
      litSrc: pos('/images/experience/poster/wrap-photoreal.webp'),
      completeAt: 0.85,
    },
  },
};

export const OVERLAYS: Record<string, Overlay> = {
  // (SB-11's gauge overlay retired 2026-07-04 with the real-footage swap: the
  // REAL cluster wakes on camera — a synthetic tach on top of documentary
  // footage undercut the honesty the swap bought, and the scroll-scrubbed
  // sweep desynced from the time-based play-once press. GaugeSweep stays in
  // the codebase for future instrument moments.)
  // (SB-07b and its lamp overlay were cut 2026-07-04 — the ask moved to SB-08b.)
};
