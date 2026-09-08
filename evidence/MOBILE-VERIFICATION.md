# Astra mobile release verification

Implemented on the isolated `codex/astra-awwwards` branch, 8 September 2026. The approved specification is [ASTRA-MOBILE-PLAN.md](../ASTRA-MOBILE-PLAN.md). No new dependencies, media or generative-service spending were needed.

## Result

Compact layouts remove decorative microcopy and use readable body text, actions and source captions. All three garage studies keep their selection and keyboard behavior, with image and details in normal flow. Drives introduces the invitation before its photograph; the application starts at the form, preserves its disclosure/consent and uses one H1. Mobile menu/footer links and header tap targets are enlarged. Desktop garage choreography remains intact.

The first application name field measures y=453–506px at 320×568, 360×800 and 390×844, compared with approximately y=1,142px in the earlier 390px audit. Compact application visits do not fetch hidden desktop artwork. The native desktop picture remains available on larger screens.

## Local verification

| Check | Result |
| --- | --- |
| Final Next.js production build | Passed, including type and lint checks; existing admin/legacy warnings remain |
| Preview service tests | 24 passed |
| Final full browser run | 116 passed, 7 intentional skips, no errors, exit 0; one worker |
| Preview HTTP checks | 20 passed |
| Production dependency audit | 0 vulnerabilities |
| Garage layout/failure review | 28 states, no detected overflow, clipped details or escaped text |
| Independent source review | No remaining source-level finding in the reviewed scope |

The first browser run exposed an overbroad new assertion: after visiting `/drives`, Chromium recorded a zero-byte cached preload lookup for the same artwork on `/apply`. Raw application HTML and its live head contain no image preload. The journey now checks zero additional transfer, and a separate fresh-context case verifies zero image requests in each browser project. A second run passed every assertion but had worker-shutdown errors; the final single-worker run completed cleanly. Original reports and traces are preserved separately.

Phone, tablet and short-landscape inspection covered 320, 360, 390, 430, 768, 844 and 932px widths, with 600/601, 767/768 and 900/901 boundary checks. A 1440px desktop comparison was also reviewed. Browser profiles cover desktop Chrome, mobile Chrome and mobile WebKit. Synthetic 200% root-font stress exercised rem-based content/actions; fixed-pixel display headings and physical-phone text/keyboard settings are not certified by that test. Reflow was separately checked at 320 CSS pixels.

A reproduced 68px hero-copy shift during hydration was fixed by reserving the video control's natural layout size while it is unavailable. The unavailable control stays hidden, disabled and outside accessible navigation. Anchor arrival now uses the document's header-plus-12px spacing consistently across the compact/desktop boundary.

## Performance and deployment

Sequential Lighthouse 13.4.1 measurements on the local production server:

| Mobile page | Performance | Accessibility | Best practices | LCP | CLS | TBT | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Homepage | 96 | 100 | 100 | 2.789s | 0.000127 | 13.5ms | 2,023,361B |
| Application | 97 | 100 | 100 | 2.563s | 0 | 12.5ms | 353,002B |

Both reports have no run warnings. The application request list contains no desktop hero artwork. Homepage performance retains the earlier V2 local score of 96; small timing differences are normal lab variation. These are local lab checks, not hosted or field performance/ conversion measurements. SEO scores are 69/54 respectively; this isolated preview deliberately blocks indexing. Forms do not save data or send emails/texts.

Hosted publication and verification are the remaining release step.

Detailed task-local evidence is preserved outside the application checkout at `../evidence/mobile-release/`, including layout notes, browser reports, original failures, network probes and build logs. Screenshots are under `output/playwright/mobile-release/`. Previous V2 evidence remains intact.
