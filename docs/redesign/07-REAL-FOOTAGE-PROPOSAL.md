# 07 — Cut the AI, use the real film: footage-swap + copy proposal

> **Status: AWAITING OWNER APPROVAL (2026-07-04).** Nothing here is executed.
> Full shot logs: `docs/redesign/storyboard/FOOTAGE-SURVEY.md`
> (per-clip in/out timecodes, quality notes, contact sheets).

## What the survey found

Two real assets carry everything (the other two "unmapped" files were byte-dupes):

- **S8 Roller master** (4K pro roller, 77s) — 9 usable clips including a real
  start-button press macro, an alpine-pass hero tracking shot, and a
  natural-dusk static wide that is the most "already noir" frame in the library.
- **Telluride R8+458 reel** (1080p drone/FPV, autumn, 157s) — 11 usable clips
  including a real Ferrari Cavallino nose macro, two-car lakeside beauties,
  and FPV chases with real energy.

## The proposal: 7 beats go real

| Beat | Now | Becomes | Cost effect |
|---|---|---|---|
| SB-11 ignition | AI cabin loop | Real thumb pressing the real red-ringed starter, cluster waking (Roller 24.6–28.5s) | kills a planned generation |
| SB-07 icons | AI Lambo+Ferrari loop | Real 458 Cavallino badge macro (Telluride 11.5–15.5s) | kills a planned generation |
| SB-16 detail macro | AI wheel loop | Real 4K wheel macro at 0.5×, speed-ramped into the pivot coast-down (Roller 4.3–6.9s) | kills a planned generation |
| SB-13 "This is the drive." | AI mountain loop (flagged PROVISIONAL, redo queued) | Real alpine-pass tracking shot (Roller 48.3–59.8s) | retires the queued Hailuo redo |
| SB-12 "The road opens." | AI open-road loop | Top-down aspen aerial, regraded to ember dusk (Telluride 15.5–19.5s) | retires re-gen budget |
| SB-15 "This could be you." | AI coastline loop | Real FPV chase of the owners' cars (Telluride 47–57s) | retires re-gen budget |
| SB-14 coast aerial | AI coast loop | Real high-country aerial (Telluride 147.5–153s) — **only if** the kicker changes | retires re-gen budget |

Everything else stays AI for hard reasons: no garage footage exists
(SB-01/02/03/04/11b), the copy names marques we have no footage of
(SB-05 McLaren / SB-06 GT3 RS / SB-08 Huracán), no dihedral doors (SB-09),
and the wrap doesn't physically exist yet (SB-19).

## Copy: what improves, what must change

The voice holds or gets *stronger* on five of seven — real footage makes the
existing lines truer:

- **SB-11 "Push to start"** — lands perfectly on a real press.
- **SB-13 "This is the drive."** / **SB-12 "The road opens."** — unchanged.
- **SB-15 "This could be you."** — lands harder: it literally was them.
- **SB-07** — body reorders to **"Ferrari. Lamborghini."** (lead with what's
  on screen; the real prancing horse carries the line).
- **SB-14** — the one casualty: kicker **"The coast" → "The high country."**
  (footage is alpine lake country, and the tour route is Denver→Miami through
  mountains first — the line is arguably *more* honest). Decline this and
  SB-14 stays AI.
- **SB-16** — aria only: "The wheel, up close, slowing."

One taste flag: the SB-13 hero shot shows the Audi grille readable, which
soft-spoils the S8's Movement-II reveal. Two anonymous-silhouette alternates
(59.9–64.3s / 64.4–68.3s) avoid it; or accept the foreshadow deliberately.

## Cost picture

- **All seven swaps: $0 in generation spend.** Encode + regrade only (the
  dusk-noir ffmpeg recipe is proven on SB-19b), ~2 commands per beat, plus
  R2 upload + `gen-media-versions.mjs`.
- Kills ~$3–5 of earmarked direct generations (SB-07/11/16 re-takes) and the
  larger tail of iterative re-takes on the weak drive beats (SB-13 redo was
  already queued; SB-12/14/15 were on the 1080p re-take list) — realistically
  **$15–25 of planned/likely spend avoided**.
- Remaining AI budget then concentrates where AI is irreplaceable: the garage
  world and the named-marque beats — with re-takes at true 1080p via direct
  Kling (~$0.90/loop) only where plates read soft.

## Execution plan on approval (one session)

1. Cut + regrade the 7 clips (ffmpeg, dusk-noir recipe; highlight pull on the
   458 nose; sky crush on FPV).
2. Encode ladders (`encode-web.mjs` per beat), regenerate posters + blur
   placeholders, `gen-media-versions.mjs` (cache-bust rule), R2 upload.
3. frames.ts copy edits (SB-07 body, SB-14 kicker, SB-16 aria).
4. Grade-sheet re-run (grade drift check across all adjacent pairs), live
   verify on staging, motion contact sheet rebuilt for review.

## Decisions needed

1. **Go/no-go per beat** (or approve all 7).
2. **SB-14**: accept "The high country." or keep the beat AI.
3. **SB-13**: hero shot with readable grille (foreshadow) vs anonymous silhouette alternate.
