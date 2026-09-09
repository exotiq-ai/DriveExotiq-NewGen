# Media upgrade QA — September 8, 2026

Status: implementation, automated QA and isolated preview deployment complete. Physical-device validation remains unperformed.

## Implemented

- Gulf racing blue McLaren 720S stills and reference-driven garage motion generated in Higgsfield. Seedance 2.5 motion is 1080p; Topaz produces upscaled 2160p archival masters. No claim of native 4K video or manufacturer-certified geometry.
- The landscape sequence visibly rotates the car and moves reflections while the near-side roof-inclusive door opens. The first landscape take was rejected for weak motion; both independent portrait takes were rejected (cropped car, then missing rotation and both doors opening). Mobile uses deterministic reframing of the accepted landscape sequence into a dark 9:16 canvas.
- S8 and Telluride deliveries rebuilt from original camera footage, with the road film’s existing ten-shot edit and score retained.
- Versioned responsive H.264 delivery, AVIF/WebP posters, poster decode/paint gating, reduced-motion/Save-Data suppression, visibility pausing, explicit replay and permanent failure fallback.
- Old cinematic sources and previous media retained for restoration. Masters, source references, rejected generations and screenshots stay outside deployed media or in ignored QA output.

## Verified so far

Production build and TypeScript checks pass. Unit tests: 28 passed. Preview HTTP boundaries: 20 passed. Final complete local browser suite: **131 passed, 7 intentional skips** across desktop/mobile Chromium and mobile WebKit. The skipped cases are viewport-specific cases exercised in another project, not suppressed failures. Hosted media/film checks: **31 passed, 2 intentional skips**. The hosted preview also passes all **20 HTTP boundary checks**, using an exact-origin-restricted QA copy of the local-only script; the tracked localhost guard remains intact.

All nine final delivery videos pass full FFmpeg decoding, H.264/24 fps inspection and fast-start container checks. Autoplay clips have no audio; the explicit road film retains AAC audio.

| Delivery | Dimensions | Duration | Bytes |
| --- | --- | --- | --- |
| Landscape hero | 1920 × 1080 | 8 s | 2,703,972 |
| Portrait hero | 1080 × 1920 | 8 s | 1,409,777 |
| Portrait economical | 720 × 1280 | 8 s | 1,257,441 |
| S8 desktop | 1920 × 1080 | 8 s | 2,776,930 |
| S8 mobile | 1280 × 720 | 8 s | 1,284,451 |
| Telluride desktop | 1920 × 1080 | 4.458 s | 1,585,550 |
| Telluride mobile | 1280 × 720 | 4.458 s | 646,652 |
| Road film desktop | 1920 × 1080 | 39.958 s | 12,656,468 |
| Road film economical | 1280 × 720 | 39.958 s | 7,120,080 |

All responsive poster files are below 102 KB; the largest portrait poster is 36,086 bytes. The social preview is 43,892 bytes and the high-detail McLaren card is 79,202 bytes. Posters match video opening frames.

## Performance method

Three fresh Chromium contexts per viewport, cache disabled, measured before and after against a production build on localhost. Mobile: 390 × 844, DPR 3, 100 ms latency, 250 KB/s download, 4× CPU throttle. Desktop: 1440 × 1000, DPR 1, 20 ms latency, 1.25 MB/s download. Each capture waits six seconds after load and records LCP, CLS and image/video resource timing.

| Metric | Cleanup baseline | Final media |
| --- | --- | --- |
| Mobile median LCP | 756 ms | 1,060 ms |
| Desktop median LCP | 288 ms | 288 ms |
| Mobile CLS | 0.0001275 | 0.0001275 |
| Desktop CLS | 0.0000113 | 0.0000113 |

The nominal 10% mobile LCP regression gate is not met, but a controlled framing experiment explains the difference: the old `cover` framing excludes the viewport-filling image from the measured candidate, whereas `contain` measures the now-visible complete image. With identical new assets/network settings and only `object-fit: cover` restored, LCP is 740 ms with a text candidate; final framing records `.home-hero-image` at 1,060 ms. This control is a single diagnostic run, not another three-run benchmark.

The median mobile poster download actually finishes earlier: 1,028.5 ms versus 1,406.2 ms, about 27% sooner; transfer falls from 43,556 to 23,964 bytes including protocol accounting. Keep the complete car/door visible rather than restore clipping to improve the metric. Both final LCP medians meet the 2.5-second target, CLS is unchanged, and each run fetches only its selected poster and hero rendition. These controlled local measurements do not establish field CDN performance or INP.

## Reproduction and limits

Use the README commands for build, unit, HTTP and Playwright checks. `scripts/encode-media.mjs --camera`, `--hero` and `--posters` rebuild the corresponding assets from the documented local originals and accepted masters. The poster mode requires explicit video-matched opening-frame PNGs. Use `--portrait-master` before `--hero --posters` to reconstruct the safe portrait canvas from the accepted landscape master. Detailed evidence is in ignored `output/playwright/media-upgrade/`; generation provenance is outside the app in `../assets/media-upgrade/manifest.json`.

Physical iPhone/Android hardware is unavailable in this environment. Browser emulation and WebKit are tested; hardware playback and production promotion remain separate checks. Existing admin lint warnings are recorded in `cleanup-qa.md`.

## Released preview

[Review preview](https://astra-review--driveexotiq-astra.netlify.app), deploy `6aa072de556bd224dfba323e`. Production was not promoted. All 27 versioned media assets return HTTP 200 with matching byte sizes and one-year immutable cache headers; a video byte-range request returns 206 and the exact requested 64 bytes. Hosted playback at desktop, 320 px, 390 px and mobile WebKit reaches the held final frame without page/network errors or horizontal overflow.

The hosted check caught overlapping cache rules; the general media rule now precedes the versioned rule. One cache-only redeploy build failed with no useful diagnostic beyond a Browserslist warning. A direct production build and the subsequent fully logged Netlify build passed; the final deployed headers and playback were reverified. The warning was not treated as the established cause.

Generation used 327 Higgsfield credits including reviewed/rejected alternatives. Original references, masters, prompts, job IDs, file hashes and rejection reasons are retained in the external media manifest. Application changes are staged locally; no new commit, push or production promotion was performed.
