# McLaren hero and video resolution implementation plan

> **Implementation:** Use the executing-plans workflow to complete the tasks in order, retaining the acceptance checks below.

**Status:** Implemented and deployed to the isolated review preview. Local and hosted automated QA are complete; see `docs/media-qa.md` for measured results, accepted deviations and the remaining physical-device limitation. Generation provenance is retained outside the deployable application at `../assets/media-upgrade/manifest.json` (relative to `website/`).

**Goal:** Create an exceptionally detailed Gulf racing blue McLaren 720S hero with moving garage light, a slow vehicle rotation and a mechanically convincing opening door; improve every published video's resolution without making the initial page wait for video.

**Architecture:** Produce high-quality masters in Higgsfield and from the original camera files, then publish a small responsive set of pre-encoded delivery files. Preserve the existing poster-first experience, optional motion, native scrolling, film controls and preview-service boundaries. The preserved cinematic implementation stays in `legacy/cinematic/`.

**Tech stack:** Existing Next.js 15.5.25/React application, Higgsfield CLI, FFmpeg, Sharp and Playwright. No new client animation framework or video streaming service is needed for these short clips.

**Spec:** The owner's September 8 request: retain the old cinematic experience, use Higgsfield, render an exact McLaren 720S in Gulf racing blue with extreme detail, moving garage lighting, car rotation and door opening; increase all video resolutions while preserving quick loading. Proposed defaults below make that request executable.

## Execution decisions — September 8

- Higgsfield’s live Seedance 2.5 interface exposes up to 1080p. Use its reference-driven motion followed by a reviewed Topaz 2160p enhancement; label these as upscaled 4K masters. Do not claim native 4K generation.
- The first landscape motion take lacked sufficient rotation and traveling reflections. The second constrained take passed independent visual review. The accepted take rotates toward side profile while the near-side roof-inclusive door rises.
- Generate posters from the accepted videos’ opening frames to prevent a garage/background jump. Retain the higher-detail original still for the McLaren garage card.
- Deliver a full 9:16 portrait canvas with `object-fit: contain` on phones. Two independently generated portrait motions failed review: one clipped the car, the other opened both doors and lost rotation. Reframe the accepted landscape master into a dark portrait canvas, with a safe 4:3 garage crop that retains the entire car and raised door. The originally proposed 4:5 full-height crop would cut through the car.
- Use a small H.264 delivery set: 1080p desktop, 720p conservative mobile, and 1080p portrait when network information supports it. Optional AV1 and 1440p are deferred; no 4K autoplay is shipped.
- Keep original camera footage authentic: re-encode S8 from native 4K and Telluride from native 1080p, preserving the road film’s ten-shot edit and score.
- Visual reference review establishes consistency, not manufacturer-certified geometry. Physical iPhone/Android validation remains a separate manual check.

## 1. Measured starting point

Paths in this document are relative to `website/` unless otherwise stated. Inspect the source image/clip, not only its filename, when implementing.

| Current delivery asset under `public/media/` | Actual resolution | Duration | Bytes |
| --- | --- | --- | --- |
| `hero-garage.webp` | 1672 × 941 | Still | 50,960 |
| `hero-garage-mobile.webp` | 720 × 900 | Still | 43,256 |
| `hero-garage-loop.mp4` | 1920 × 1080 | 12 s | 3,751,813 |
| `hero-garage-mobile-loop.mp4` | 720 × 900 | 12 s | 1,537,222 |
| `s8-alpine-loop.mp4` | 1280 × 720 | 8 s | 3,961,354 |
| `s8-alpine-loop-mobile.mp4` | 854 × 480 | 8 s | 1,310,003 |
| `telluride-pair-loop.mp4` | 1280 × 720 | 4.458 s | 1,092,758 |
| `telluride-pair-mobile-loop.mp4` | 768 × 432 | 4.458 s | 407,814 |
| `film-roadbook.mp4` | 1280 × 720 | 39.958 s | 4,893,173 |

The original generated hero at `../assets/generated/hero-garage-v1.png` is also only 1672 × 941. Simply exporting that image with a larger pixel count cannot recover exact vehicle detail.

Verified local camera originals:

- `/Users/g.r./Documents/EXOTIQ/driveexotiqweb/docs/redesign/storyboard/refs/video/S8 Roller Video.mov`: **3840 × 2160**, 29.97 fps, 77.444 s. Read-only source, about 4.54 GB.
- `/Users/g.r./Documents/EXOTIQ/driveexotiqweb/docs/redesign/storyboard/refs/video/R8 and 458 drone Telluride Colorado.mp4`: **1920 × 1080**, 29.97 fps, 156.657 s. Read-only source, about 373 MB.
- `../tooling/prepare-real-v2.py` records the ten road-film shots and source in/out times. `../assets/real/v2/manifest.json` records the actual edit intervals. Preserve the existing score from `../assets/generated/roadbook-score-v2.m4a` when rebuilding the finished film.

The S8 footage can be re-encoded from native 4K. Telluride's real ceiling is native 1080p unless a separately reviewed upscale improves the result. Avoid reconstructing the new masters from the current 432p/480p web copies.

## 2. Lock the car and shot before generation

**Proposed vehicle:** Road-going McLaren 720S Coupe, Gulf racing blue body, matching reference-approved wheels and interior, original bodywork. Use the same identity in the hero and McLaren garage card. Begin with blue paint; do not add an unsolicited racing number, sponsor decals, GT3 body kit or giant fixed rear wing.

**Proposed composition:** Keep the architectural garage and left-side headline space. Place the car in the right two-thirds, with the visible door able to open without entering the headline or leaving the frame. The camera stays fixed; the vehicle turns on a subtle flush turntable through roughly 35–45 degrees. A separate portrait composition keeps the whole car and raised door visible on phones.

**Reference set:** Before submitting a job, assemble owned or appropriately licensed photographs of one consistent 720S trim: front three-quarter, side, rear three-quarter, door closed, door open, headlight/air intake and wheel detail. Keep the existing garage image as a composition reference only. Prepare a labeled reference sheet and retain the original images for close inspection. Use a neutral-light Gulf paint reference rather than treating the website's blue CSS token as an automotive paint specification.

**Acceptance checklist:** Compare the actual generated image to those references for headlight housing and intake shape, nose and splitter, double-skin door surfaces, roof aperture, glass and pillars, mirrors, rear light/exhaust layout when visible, wheel design/spoke count, tires, brake placement, wheelbase/proportions and panel continuity. The Coupe's dihedral doors include the roof cut; a generic scissor-door animation is insufficient.

McLaren's [720S overview](https://cars.mclaren.com/en/super-series/720s) documents its deep-set headlight/intake arrangement and glazed upper structure. Its [features and options brochure](https://www.mclarentampabay.com/static/dealer-18342/Brochures/McLaren_720S_Features_Options_2021_STG4.pdf) supplies model/door reference material. Gulf's [720S design series](https://www.gulfoilltd.com/gulf-mclaren-unstoppable-series) is a primary color/design reference.

**Accuracy boundary:** A high-resolution AI render is not proof of exact geometry. Reject inconsistent bodywork or hinge motion. If two constrained motion attempts still deform the car, use a verified 720S mesh and door rig to render the geometry, then use Higgsfield for controlled visual treatment. Do not publish a plausible-looking different McLaren as an exact 720S.

## 3. Tasks and acceptance gates

### Task 1 — Prepare reference-accurate 4K stills in Higgsfield

**Working files:** `../assets/media-upgrade/references/`, `../assets/media-upgrade/masters/`, and a single `../assets/media-upgrade/manifest.json` recording sources, prompts, model/settings, job IDs, credits, output dimensions and acceptance notes. Keep masters outside `public/` and Git.

- [x] Prepare and inspect official Gulf color/vehicle photography and manufacturer door/roof reference material. Original references remain internal.
- [x] Generate the first landscape candidate with `nano_banana_pro`, `resolution=4k`, `aspect_ratio=16:9`. Select by geometry and usable composition before texture or dramatic lighting.
- [x] Evaluate closed/open landscape keyframes and independent portrait candidates. Reject changed garage geometry and unsafe motion; use the accepted landscape motion for deterministic mobile reframing.
- [x] Inspect full-resolution stills and motion contact sheets for visible headlamp, body, wheel, glass, roof and door consistency. Label unresolved fine-detail and hidden-geometry uncertainty; do not certify manufacturer-exact geometry.
- [x] If reference adherence is poor, compare one `gpt_image_2` 4K/high-quality candidate through Higgsfield, using the same references and acceptance checklist.

**Still prompt:**

> Photoreal automotive campaign photograph of the exact reference McLaren 720S Coupe, its manufacturer-correct proportions, deep headlight air-intake housings, roof, glazing, double-skin doors, mirrors, wheels, brakes and body panel lines preserved. Gulf racing blue paint matched to the provided neutral-light reference. Minimal architectural concrete garage, clean polished floor with restrained reflection, one large moving-light source represented as a controlled overhead strip. Fixed front three-quarter camera; complete vehicle with room above the visible door. Reserve the left third for the existing headline. Extreme real material detail: layered automotive clearcoat, crisp optical elements, accurate tire texture, metal brake hardware, restrained carbon fiber. Natural photographic contrast and sharp car details, with readable shadow information. No extra body kit, no altered wheel design, no text overlay, no invented racing decals, no exaggerated bloom. Match the supplied vehicle references for identity; use the supplied garage only for composition.

### Task 2 — Animate the light, rotation and door

**Primary model after owner steering:** Higgsfield `seedance_2_5`, reference mode, high bitrate, generated audio disabled. The live interface exposes up to 1080p. Review an eight-second 1080p geometry proof before using Topaz to produce an explicitly upscaled 2160p master. Seedance 2.0 remains an alternative with a 4K output mode. Normalize start/end frames and anatomy references to 1920×1080 before video submission; the first unnormalized 2.5 job failed immediately and was refunded. A normalized retry was accepted for processing.

| Time | Proposed action |
| --- | --- |
| 0–2 s | Car holds the opening pose. A broad light band travels over the blue paint, revealing the roof and shoulder. |
| 2–4 s | The car begins the slow turntable rotation; the garage and camera remain fixed. |
| 4–7 s | While rotation continues, the visible dihedral door opens in a continuous, reference-correct arc. Panel gaps and glass stay attached to the door; the interior is stable. |
| 7–8 s | Settle into the approved open-door pose and let the reflection finish moving. |

- [x] Use the accepted start still, side-pose guidance and manufacturer door reference. The accepted motion uses no fixed end frame after the first end-frame-constrained attempt lacked rotation.
- [x] Review overview contact sheets and all 96 consecutive frames of the 3–7 second opening interval, then inspect compressed deliveries at playback speed and in the site.
- [x] Reject morphing, wobbling badges/spokes, sliding tires, intersecting panels, changes of model and shifting garage geometry.
- [x] Produce the 3840 × 2160 Topaz landscape master and a deterministic 2160 × 3840 portrait canvas. A safe 2880 × 2160 landscape crop is scaled to 2160 × 1620, feathered and placed at y=1200 on a dark canvas; the entire car and raised door remain visible.
- [x] Play the reveal once, then hold the final frame with a replay control. Avoid reversing the door movement to manufacture a looping clip. If ongoing ambient motion is wanted, create a separate matched light-only idle loop and crossfade only where pose, lighting and exposure agree.

**Motion prompt:**

> Preserve the exact reference Gulf racing blue McLaren 720S Coupe and the fixed architectural garage. Single continuous locked-camera shot. A large soft strip of light travels smoothly over the vehicle. The car itself rotates slowly about its vertical center on a flush turntable through approximately forty degrees, without driving forward or spinning its wheels. During the rotation the visible 720S dihedral door opens slowly along the manufacturer's actual hinge path, including its roof section, exactly matching the reference end frame. Keep the door skin, window, mirror, hinge, roof cutout and interior coherent throughout. Maintain identical wheels, optics, paint, panel lines and proportions. Natural changing reflections follow the physical light and vehicle motion. End with the car and open door held still. No camera orbit, body morphing, rubbery surfaces, detached glass, redesigned headlights, moving architecture, text, music or people.

### Task 3 — Rebuild all seven video deliveries from better masters

**Files to implement:** `scripts/encode-media.mjs` for repeatable FFmpeg calls/metadata checks; `public/media/` for versioned delivery assets only. Adapt the existing editorial recipe instead of changing its shot choices or documentary content.

| Delivery | Proposed default | Higher-quality option / source |
| --- | --- | --- |
| Hero desktop | 1920 × 1080 | 2560 × 1440 for large displays when decoding/network conditions permit; new 4K Higgsfield master |
| Hero mobile | 1080 × 1920 portrait | Reviewed landscape motion in a portrait canvas; smaller 720 × 1280 fallback |
| S8 desktop | 1920 × 1080 | 2560 × 1440 optional; native 4K camera source |
| S8 mobile | 1280 × 720 | Art-directed crop if needed to keep the car readable; native 4K source |
| Telluride desktop | 1920 × 1080 | Native 1080p source; only use a reviewed enhancement if it visibly improves detail |
| Telluride mobile | 1280 × 720 | Native 1080p source; retain the full R8/Ferrari composition |
| Road film on explicit play | 1920 × 1080 | Rebuild all ten shots from camera originals, preserve score and timing; 720p economical fallback |

- [x] Re-extract S8 51–59 seconds and Telluride 58–62.5 seconds from their camera originals.
- [x] Rebuild the ten-shot road film using the existing source intervals and actual edit durations. Use native 1080p as its default because the Telluride shots are 1080p. Keep archive footage authentic.
- [x] Retain direct native-source camera encodes. No documentary Topaz enhancement or frame interpolation was needed or performed.
- [x] Encode H.264/yuv420p with two-pass slow encoding and fast-start metadata. Optional AV1 is deferred. Keep 24 fps cadence and preserve audio only for the explicit road film.
- [x] Inspect fast movement, tree detail, paint gradients and dark garage areas at intended display sizes. Choose by visible quality at a constrained bitrate, not resolution labels alone.

Reproduction from `website/`: `node scripts/encode-media.mjs --camera`, then `--portrait-master --hero --posters` once the accepted landscape master and matched opening poster exist. Inspect generated files and budgets before publication.

### Task 4 — Deliver the extra detail without eager video downloads

**Files:** `components/home/HomeExperience.tsx`, `HomeLoop.tsx`, `HomeFilm.tsx`, `garage-data.ts`, `home.css`; `app/page.tsx`, `app/layout.tsx`; a small `lib/media.ts` rendition map and `netlify.toml` caching rules.

- [x] Prebuild AVIF and WebP posters. Desktop widths: 960, 1440, 1920, 2560 and 3200. Portrait widths: 540, 720 and 1080. Verify actual dimensions rather than trusting a model's "4K" label.
- [x] Use an art-directed `<picture>` with correct `srcset`/`sizes`, eager/high-priority hero loading and stable dimensions. The first page render must show a sharp poster even if JavaScript or video fails.
- [x] Keep all video source URLs absent from initial HTML. Start optional hero motion after its poster is decoded and painted; load other films only near visibility or after explicit user playback.
- [x] Select one rendition per player, capped at 1080p. Use 720p for conservative mobile/slow-network playback; defer optional 1440p. Never select 4K autoplay from device pixel ratio.
- [x] Preserve reduced-motion/Save-Data suppression, offscreen/tab-hidden pausing, explicit pause/replay, the modal's background-video pause event, Escape/focus restoration and the permanent poster fallback after media failure.
- [x] Use permanent poster fallback after H.264 failure. No speculative quality downloads, AV1 fallback path or retry loop is shipped.
- [x] Update the McLaren garage image, alt text and social preview to match the accepted blue car. Keep URLs versioned so existing cached media can coexist during deployment. Preserve the current URL compatibility redirect.

**Delivery budgets to validate, not promises:**

| Item | Target |
| --- | --- |
| Mobile hero poster | ≤180 KB preferred; ≤250 KB hard review threshold |
| Desktop hero poster | ≤350 KB preferred; ≤500 KB hard review threshold |
| Eight-second mobile hero motion | ≤1.5 MB preferred; ≤2 MB hard review threshold |
| Eight-second desktop 1080p hero | ≤3 MB preferred; ≤4 MB hard review threshold |
| S8 eight-second loop | ≤1.5 MB mobile / ≤3 MB desktop preferred |
| Telluride 4.5-second loop | ≤0.8 MB mobile / ≤1.8 MB desktop preferred |
| 1080p road film | Approximately 8–14 MB, downloaded only after playback request |
| Initial optional-video bytes | 0 until the poster is ready and motion is eligible; 0 on initial Save-Data/reduced-motion entry |

A crisp still can carry the most detail while video uses a conservative rendition. Google documents the poster/preload/visibility approach in [lazy-loading video](https://web.dev/articles/lazy-loading-video). Refer to [FFmpeg's encoder documentation](https://ffmpeg.org/ffmpeg-codecs.html) and the [Next.js Image reference](https://nextjs.org/docs/app/api-reference/components/image) while implementing against the installed Next.js version.

### Task 5 — Prove quality, accuracy and loading behavior

**Tests to extend:** `tests/browser/media.spec.ts`, `film-viewer.spec.ts`, `garage-scroll.spec.ts`, `quality.spec.ts`; add focused unit coverage for rendition selection in `tests/media-selection.test.mjs` when `lib/media.ts` is introduced.

- [x] Unit cases cover missing network information, responsive H.264 selection, slow connections and explicit film quality. Browser cases cover permanent failure and reduced-motion/Save-Data suppression; no unused AV1 path is tested.
- [x] Browser cases: desktop/mobile/WebKit request only the chosen source; hidden/offscreen players pause; the film remains unloaded until opened; failure keeps the poster and CTA usable; modal close releases playback; replay does not break focus or page scrolling.
- [x] Capture the closed, rotating, opening and fully open door frames on desktop and portrait. Compare model identity, geometry, lighting and framing to accepted references. Any incorrect 720S anatomy blocks publication even if the performance tests pass.
- [x] Measure cold-cache mobile and desktop loading three times with the same throttling and use medians. Target LCP ≤2.5 s, CLS ≤0.1 and no more than 10% LCP regression from the cleanup build. Assess interaction latency in browser tests; field INP cannot be certified from a local run. **Result:** mobile LCP 1.06 s and desktop 0.288 s; the nominal relative mobile gate changes candidate with complete-image framing. The controlled comparison and faster poster download are documented in `docs/media-qa.md`.
- [x] Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:http -- http://127.0.0.1:4317`, and `npm run test:e2e` against the new production build. Repeat relevant network/media checks on the hosted preview after deployment.
- [ ] Verify on a physical iPhone and Android device for decoding, heating, bandwidth and door framing; emulation alone cannot establish these.

## 4. Live Higgsfield estimates

Read-only model/schema and cost queries were performed on September 8, 2026 using `../tooling/higgsfield/hf` 1.1.24. No references were uploaded and no jobs were submitted during planning. These text-only estimates must be checked again with the exact reference-bound job before execution.

| Job | Verified quote |
| --- | --- |
| Nano Banana Pro 4K, 16:9 still | 4 credits |
| GPT Image 2 4K/high, 16:9 still | 11 credits |
| Seedance 2.0 standard, high bitrate, 8 s, 1080p, 16:9, no audio | 72 credits |
| Seedance 2.0 standard, high bitrate, 8 s, 4K, 16:9, no audio | 176 credits |
| Seedance 2.0 standard, high bitrate, 8 s, 4K, 9:16, no audio | 176 credits |
| Topaz video enhancement | Requires an actual clip and a separate quote; no price inferred |

An initial four-still set plus one 1080p motion test and two 4K compositions totals **440 credits** at these quotes, before revisions or upscales. More keyframes, reference adjustments and failed takes can increase that amount. Credits are not converted to dollars here. Production jobs should be sequential, with quality inspection between attempts; do not batch speculative 4K variations or change subscription/refill settings.

## 5. Release order

1. Accept reference accuracy and the closed/open-door stills.
2. Accept the 1080p motion proof, then create the 4K landscape and portrait masters.
3. Rebuild the native-source road videos and encode every responsive delivery.
4. Integrate posters, source selection and bounded fallback behavior.
5. Complete visual, browser and performance checks. Record unavailable physical-device checks explicitly and retain them as a production-release requirement.
6. Publish the existing isolated preview with versioned assets, verify it remotely, and retain the previous delivery set for rollback. Production promotion remains a separate release decision.
