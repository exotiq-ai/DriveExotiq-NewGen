# Code cleanup QA — September 8, 2026

Compared against pre-cleanup commit `f1a8a37`. Validation was performed locally against an optimized production build running in preview mode at `http://127.0.0.1:4317`. No hosted deployment or media generation was performed.

## Result

| Check | Result |
| --- | --- |
| Production build | Passed |
| TypeScript | Passed |
| ESLint | Passed with three pre-existing admin warnings; the admin back-to-site link error was fixed |
| Service tests | 24 passed, zero failures |
| HTTP/API checks | 20 passed, including preview form validation, provider isolation and disabled admin routes |
| Final complete browser run | 116 passed, seven intentional skips, zero failures; exit 0 in 1.9 minutes |
| Browsers | Playwright-managed Chromium desktop/mobile and WebKit mobile |
| Visual comparisons | Five routes at 390px and 1440px; ten matching page dimensions, maximum 0.001% pixel variation with a 12/255 channel threshold |
| Preserved cinematic components/data | All 30 moved files match their recorded SHA-256 values |
| Renamed public media | All 22 files match their original Git blob hashes |
| Active imports | No imports into the legacy archive or removed motion/iframe dependencies |
| Live-source naming | Zero Astra references in app/components/lib and public text; old URL alias and deployment identifiers retained |
| Staged diff whitespace | Passed |

The browser suite exercises navigation, all public/legal/story routes, form success and failure, preview disclosures, redirects, missing pages, keyboard/focus behavior, garage selection and scroll reversal, reduced motion, Save-Data, movie loading and errors, modal cleanup, compact layouts and first-field visibility. The seven skips are intentional project-specific desktop/mobile cases.

## Delivered CSS

These are initial-document stylesheet bytes, measured on direct route entry. Gzip values are deterministic local compression measurements, not claims about a particular CDN response. Client navigation may retain already-loaded CSS in the browser cache.

| Route | Before bytes | After bytes | Reduction | After gzip |
| --- | ---: | ---: | ---: | ---: |
| Home | 124,041 | 92,523 | 25.4% | 19,435 |
| Apply / Privacy | 124,041 | 45,138 | 63.6% | 10,236 |
| Drives / Tour | 124,041 | 62,201 | 49.9% | 14,166 |

Active source is expanded into readable formatting, so source-line count increases even though unnecessary styles, installed dependencies and delivered CSS decrease. The old cinematic sources are intentionally preserved, not counted as deleted functionality.

## Runner findings and limits

Two initial multi-project runs stalled after the desktop assertions. A diagnostic desktop run completed with 40 passes and one skip. Browser diagnostics also recorded activity from the installed system Chrome updater. The final configuration uses managed Chromium, one worker, a five-minute suite limit, and ignored output directories. The subsequent complete run passed and exited normally. No production behavior was weakened to make the tests pass.

Old duplicate generated files such as `.next/types/routes.d 2.ts` appeared during verification and caused a TypeScript conflict. They were removed from generated output; the source types were not suppressed or loosened. Their origin was not established. The subsequent type check passed.

Three inherited admin warnings remain: mount-effect dependencies in the admin application/Instagram screens and an unoptimized Instagram admin image. Admin access remains disabled in preview. Physical-device behavior, hosted CDN performance and the future higher-resolution media have not been certified by this cleanup run.

## Artifacts and reproduction

- `output/playwright/e2e/report/index.html`: final browser report.
- `output/playwright/e2e/results/.last-run.json`: passed, no failed test IDs.
- `output/playwright/cleanup/before-*.png`, `after-*.png` and `after.json`: visual comparisons and CSS measurements. Comparison captures use reduced motion; lower-page lazy images are separately exercised by page-integrity tests.
- `output/playwright/cleanup/home-loaded-desktop.png`: full homepage after scrolling all visible images into view and decoding them.
- `output/playwright/cleanup/{build,unit,e2e}.log`: final command output.
- `legacy/cinematic/preservation.json`: original locations and checksums; see its adjacent README to restore the old experience.

Use the current root README's commands to reproduce. The full browser report and screenshots are intentionally ignored by Git; this concise result record is tracked. The next media phase is specified in `docs/plans/2026-09-08-media-resolution.md`.
