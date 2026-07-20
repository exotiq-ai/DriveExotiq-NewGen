# 13 — FULL SEAM AUDIT (Phase D, content half)

**Date:** 2026-07-20 · **Branch:** `newgen-main` · **Scope:** every consecutive beat boundary in the
current `components/experience/frames.ts` order — 24 beats, **23 boundaries** (SB-14b cut 2026-07-20;
SB-10 re-plated to `cockpit-door-closed.png` = SB-11b's frame 0).

**Generation attempt (SB-14c seam-pin regen):** see [§5](#5--sb-14c-regeneration-attempt) — result recorded there.

**Method — real pixels, not manifest claims.** For every boundary the *actual last displayed frame*
of the outgoing beat (scrub/play-once encode last frame via `ffmpeg -sseof -0.25`; loop = arbitrary
cycling frame; still = the frames.ts plate) was extracted and compared against the *first displayed
frame* of the incoming beat (scrub = encode frame 0; play-once/loop/still = the plate still the
stage shows at the boundary — play-once doesn't fire until `playAt≈0.15` into its band). SSIM
computed at 960×540. All frames, side-by-side comparisons (`cmp-*.jpg`) and contact sheets
(`sheet-A/B.jpg`) live in **`renders/seam-audit/`** (gitignored).

Code-side fixes already shipped and assumed live in the classification: `SEAMS` zoom-continuity
flags (SB-02, SB-10, SB-19), scrub snap-to-final in `LivingLayer.tsx`, per-boundary `FADES`
(SB-19: 0.5, SB-02: 0.35, SB-10: 0.35), `EXITS` bloom (SB-14).

## 1 · Verdict counts

| Verdict | Count | Boundaries |
|---|---|---|
| **matched-frame** | 2 | SB-02→SB-02b, SB-10→SB-11b |
| **assisted** (EXITS / SEAMS+FADES cut) | 2 | SB-14→SB-15, SB-19→SB-19b |
| **plain dissolve OK** | 17 | everything else |
| **NEEDS WORK** | 2 | SB-09→SB-10, SB-11b→SB-14c |

Counts reflect the audit-time state. **SB-11b→SB-14c was fixed this same session** (re-render with
pinned first frame, §4–6; post-fix SSIM 0.97 → effectively matched-frame). Remaining open seam:
**SB-09→SB-10** only.

## 2 · The 23 boundaries

Out-frame = what the outgoing beat actually holds at the boundary. In-frame = what the incoming
beat first shows. SSIM from the real extracted pixels (identical-render seams land ≈0.9+, the
residual being encode grade/grain; unrelated compositions land ≤0.4).

| # | Boundary | Out-frame (real) | In-frame (real) | SSIM | Verdict | Fix (NEEDS WORK only) |
|---|---|---|---|---|---|---|
| 1 | SB-01 → SB-02 | loop, arbitrary frame (covered car, atmosphere-only — closes on frame 0, verified 0.91) | scrub f0: closed industrial door, light blade | 0.39 | plain dissolve OK | — |
| 2 | **SB-02 → SB-02b** | scrub end: door fully open (snap-to-final pins it) | scrub f0: same Plate B render | **0.97** | **matched-frame** (SEAMS + FADES 0.35) | — |
| 3 | SB-02b → SB-04 | scrub end: walk-in settled in corridor | fleet aisle plate / loop | 0.37 | plain dissolve OK — axis-matched: both one-point-perspective warm corridors, dissolve reads as "deeper in" | — |
| 4 | SB-04 → SB-05 | loop, arbitrary (aisle inhale) | 720S portrait plate | 0.48 | plain dissolve OK | — |
| 5 | SB-05 → SB-06 | loop, arbitrary (720S) | GT3 RS plate | 0.57 | plain dissolve OK | — |
| 6 | SB-06 → SB-07 | loop, arbitrary (GT3 RS ember) | 458 macro still (still-only beat) | 0.22 | plain dissolve OK | — |
| 7 | SB-07 → SB-08 | 458 still | scrub f0 (choose lineup) | 0.30 | plain dissolve OK | — |
| 8 | SB-08 → SB-09 | scrub end: Huracán head-on, headlights lit | scrub f0: dark 720S, door closed | 0.40 | plain dissolve OK — subject switch (chosen car) is a deliberate cut; dark-void-to-dark-void carries it | — |
| 9 | **SB-09 → SB-10** | scrub end: 720S dihedral door **UP**, exterior | still: cockpit interior, door **CLOSED** | **0.22** | **NEEDS WORK** — implied continuity (you get in) with zero frame relationship, plus a logic jump (door up outside → seated with door closed) | Content re-render, plan queue #2: settle-in bridge clip, `frameImages.first` pinned to sb-09-scrub's true last frame, `last` = `cockpit-door-closed.png` (SB-10's manifest still carries a full generation recipe). Interim cheap assist: EXITS bloom on SB-09 + FADES tighten |
| 10 | **SB-10 → SB-11b** | still: `cockpit-door-closed.png` | scrub f0: same dash render (warm-graded encode) | **0.92** | **matched-frame** (SEAMS + FADES 0.35) | — |
| 11 | **SB-11b → SB-14c** | scrub end: rolled out onto **bright daylight flats**, hands on wheel | plate `open-road.png` / video f0: **dusk canyon** POV, different dash, no visible hands | **0.29 / 0.22** | **NEEDS WORK** — the plan's named seam; POV-to-POV continuity intended, nothing matches (lighting, terrain, dash framing) | Content re-render with `frameImages.first` pinned to sb-11b's true last frame — **DONE this session (§4–6): new encode's frame 0 vs the scrub's held frame = SSIM 0.97**, matched-frame league; follow-ups in §6 |
| 12 | SB-14c → SB-08b | play-once end: dusk canyon windscreen | real-footage plate: R8 + 458 in aspens | 0.22 | plain dissolve OK — designed chapter break: AI storyline ends from the driver's seat, ask lands on the first real frame (manifest replateNote) | — |
| 13 | SB-08b → SB-12 | loop, arbitrary (real pair) | real road plate | 0.14 | plain dissolve OK (real-footage montage grammar) | — |
| 14 | SB-12 → SB-14 | play-once end (real road) | high-country aerial plate | 0.13 | plain dissolve OK (montage) | — |
| 15 | **SB-14 → SB-15** | play-once end: aerial convoy | chase-cam plate, same white car / location family | 0.30 | **assisted** — EXITS bloom on SB-14 (`from 0.78, scale 1.14, y −3%`) swallows the cut | — |
| 16 | SB-15 → SB-11 | loop, arbitrary (chase) | ignition macro plate | 0.18 | plain dissolve OK | — |
| 17 | SB-11 → SB-13 | play-once end (ignition) | drive plate | 0.30 | plain dissolve OK | — |
| 18 | SB-13 → SB-16 | play-once end (drive) | wheel macro plate | 0.20 | plain dissolve OK | — |
| 19 | SB-16 → SB-18 | play-once end: wheel settled (0.5× coast-down bake) | S8 pivot plate | 0.13 | plain dissolve OK — the S8 reveal is a deliberate cut | — |
| 20 | SB-18 → SB-17 | loop, arbitrary (S8 pivot) | S-curve vista plate | 0.10 | plain dissolve OK | — |
| 21 | SB-17 → SB-19 | loop, arbitrary (vista) | scrub f0: livery money frame | 0.23 | plain dissolve OK | — |
| 22 | **SB-19 → SB-19b** | scrub end: livery S8 profile, dusk | real founder get-in plate, day | 0.29 | **assisted** — treatment-mandated film cut: SEAMS zoom-continuity + FADES 0.5 ("cut — not dissolve"); compositions differ **by design** | — |
| 23 | SB-19b → SB-20 | play-once end: real S8 at the picket fence, day | cold-open plate (bookend, `finale` flag) | 0.14 | plain dissolve OK — the bookend return to black is the intended full-stop | — |

## 3 · Manifest-vs-pixels findings (the SB-14c class of bug)

Checked declared `frameImages` claims against the shipped encodes' real frames:

1. **SB-14c has NO generation recipe at all** — the entry is a re-plate (reused `SB-12-t1-hailuo-2.3.mp4`)
   with no `videoModel`, no `prompt`, no `frameImages` (until this session's pin). Consequence:
   `generate-videos.mjs --only SB-14c` exits **"No runnable beats matched"** — the by-the-book route
   cannot regenerate this beat without adding recipe fields to the manifest (out of this session's
   allowed scope). See §5.
2. **SB-10's manifest entry lags the runtime truth**: it still declares `still`/`frameImages` =
   `cockpit-pov-v2.png` (status `replated-still`), while `frames.ts` ships `cockpit-door-closed.png`
   since the 2026-07-20 re-plate. The seam itself is verified matched (0.92) because frames.ts is
   what renders; the manifest fields were left untouched per scope but should be updated when SB-10
   is next touched.
3. **SB-09's declared `last: door-up.png` overstates the encode**: real last frame vs `door-up.png`
   = SSIM **0.70** (Kling last-frame adherence drift). Not the hard contradiction the old SB-14c bug
   was, but the declared pin is soft — relevant when boundary #9's bridge clip pins to "SB-09's end":
   pin to the *encode's extracted last frame*, not to `door-up.png`.
4. Intra-beat poster/video drifts (not seam bugs, noted in passing): SB-08 scrub f0 vs `choose.png`
   = 0.72; SB-19 scrub f0 vs `wrap-photoreal.png` = 0.65 (intentional — the scrub *reveals* the
   livery from the dark wrap prep frame); SB-01 loop closure verified healthy (last≈first, 0.91).

## 4 · SB-11b → SB-14c re-render prep (done this session)

- True final frame of `public/videos/experience/sb-11b-scrub.mp4` extracted to
  **`renders/seam-audit/sb-11b-lastframe.png`** (1600×900, `ffmpeg -sseof -0.25`).
- `docs/redesign/storyboard/beats-manifest.json` SB-14c: `frameImages.first` set to
  `renders/seam-audit/sb-11b-lastframe.png` + `rerenderNote` added. **No other manifest field
  modified.** Caveat recorded in the note: the value is repo-root-relative, unlike other beats'
  stills-dir bare filenames — `frameDataUrl()` resolves bare names against `stillsDir` only, so a
  future run must pass the frame as an absolute path or copy it into `stillsDir` first.

## 5 · SB-14c regeneration attempt

- **Established path:** `node docs/redesign/storyboard/generate-videos.mjs --only SB-14c --takes 1
  --via kling-direct --dry` → exit 1, `No runnable beats matched.` (finding §3.1: the re-plate entry
  has no `videoModel`, and adding one was out of scope).
- **Actual attempt:** one-off driver (scratchpad, not committed) mirroring `runKlingJob()`
  byte-for-byte — same `api-singapore.klingai.com/v1/videos/image2video` endpoint, same
  `KLING_API_KEY` from `.env.local`, same 16:9 crop/1568px frame payload, `kling-v3` pro 5s,
  first frame = the §4 pin; prompt = SB-12's house-style recipe with the first-frame description
  corrected to match the pinned roll-out frame (SB-12's original text described the old
  `open-road.png` canyon and would have fought the supplied image), ending composed near the old
  frame-0 composition so boundary #12 keeps its character; negatives = SB-12's minus `no hands`
  (the pinned frame has hands on the wheel) plus the hand-QA set.
- **Result: SUCCESS.** Submit accepted (no 1102/credits rejection), task `908275696073187332`,
  ~2.5 min render. Take: `docs/redesign/storyboard/renders/SB-14c/SB-14c-t1-kling-v3-kdirect-seampin.mp4`
  — 1920×1080, 5.04 s, 24 fps, 4.5 MB. Ledger entry appended to `renders/cost-ledger.json`
  (prepaid Kling credits, cost 0 USD-metered).

## 6 · Post-generation QA + encode (done this session)

- **First-frame QA vs the pin:** take frame 0 vs `sb-11b-lastframe.png` = **SSIM 0.976** — dash,
  hands, mirror and horizon all hold (`renders/seam-audit/qa-sb14c-take.jpg`: pin | take f0 | take
  last). **PASS**, no composition drift.
- **Arc QA:** the take ends with dark ridgelines closed in and a warm low-sun glow at the vanishing
  point — near the old frame-0 canyon character, so boundary #12 (SB-14c→SB-08b, the designed
  chapter break) keeps its read.
- **Encode (established path):** `encode-web.mjs --beat SB-14c --in renders/SB-14c/SB-14c-t1-kling-v3-kdirect-seampin.mp4`
  → `sb-14c.mp4` (1080p, 2.3 MB) + `sb-14c.720.mp4` + posters `sb-14c.{avif,webp,jpg}` (frame 0 =
  the pin). `gen-media-versions.mjs` re-run (237 files). Encoded frame 0 vs pin: **0.975**.
- **Boundary #11 after the fix:** sb-11b-scrub's real held end frame vs the NEW sb-14c encode's
  frame 0 = **SSIM 0.970** (`cmp-11-sb11b-sb14c-FIXED.jpg`) — same league as the verified
  SB-02→SB-02b matched cut (0.97). **NOT uploaded to R2, NOT committed** — working tree carries:
  `beats-manifest.json`, `media-versions.json`, `sb-14c.mp4/.720.mp4`, `sb-14c.{avif,webp,jpg}`
  posters, `cost-ledger.json`, this doc.

**Follow-ups (out of this session's scope, in priority order):**
1. `living.ts`: add `'SB-11b': true` to `SEAMS` and `'SB-11b': 0.35` to `FADES` — the boundary is
   now a same-frame cut and should get the SB-02/SB-10 zoom-continuity + tight-dissolve treatment
   (source files were frozen this session).
2. Re-plate SB-14c's still (`frames.ts` media + poster path currently `open-road.png`) to the
   pinned frame so the LCP/reduced-motion fallback matches the new video frame 0; the manifest
   `still`/`replateNote` fields then need the same update, and `selectedTake` should be updated to
   the new take.
3. Boundary #9 (SB-09→SB-10) content bridge — the remaining NEEDS WORK seam (§2 row 9): pin its
   first frame to sb-09-scrub's *extracted* last frame (not `door-up.png`, see §3.3).
4. Teach `generate-videos.mjs` `frameDataUrl()` repo-root-relative paths (or copy the pin into
   `stillsDir`) so the SB-14c recipe is runnable by the book; give SB-14c real `videoModel`/`prompt`
   fields (the one-off driver's adapted prompt is reproduced in the session log and can be lifted
   verbatim).
