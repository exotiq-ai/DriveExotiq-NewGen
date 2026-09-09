# Conversion release QA — 2026-09-08

## Implemented

- Removed decorative numbered section labels and redundant block microheadings; useful garage and journal categories remain.
- New v3 McLaren hero: stationary car, camera movement, traveling garage light and opening doors. Eight-second H.264 delivery: 2,709,721 bytes landscape, 1,397,643 portrait1080, 1,242,123 portrait720. Topaz-upscaled 3840×2160 master remains outside the website. Previous v2 and original cinematic assets preserved.
- Oak Green Metallic/bronze Porsche still uses the existing optical pullback and whole-car containment, without another video download.
- Four validated API routes reuse the existing Supabase/Resend backend. Explicit live form mode is independent of preview indexing/admin isolation. Thank-you copy reflects actual form mode.
- Consent-aware PostHog: pageviews, actual page depth, fixed CTAs, garage selection, form starts/errors/stored success, video play/progress/complete/replay/failure. Inputs/text masked; API bodies and console logs excluded; no persistent person profiles.
- Crawler rules restrict private paths consistently. Dynamic llms.txt describes live/preview forms truthfully with canonical public links. Full SEO/SEM/answer-engine roadmap is in `docs/plans/2026-09-08-conversion-master-plan.md`.

## Verified locally

- Production build, typecheck and lint gate passed (existing admin warnings remain).
- 67 unit tests passed after the SDK-required token fix.
- Full Chromium desktop/mobile and WebKit E2E: 137 passed, 7 intentional skips. A garage collapse/scroll race found in the first pass was fixed; the specific failure passed 10 repeats and the garage suite passed 16 with 2 expected skips.
- 20 local HTTP boundary checks passed, including preview write-free forms and blocked admin APIs.
- Actual eight-second playback inspected at desktop, 320px, 390px and WebKit: no JS/media errors or horizontal overflow; complete car/doors visible; final frame held with explicit replay.
- Three-run cold lab medians: mobile LCP 1.140 s versus previous 1.060 s (+7.5%); desktop 0.296 s versus 0.288 s (+2.8%). CLS approximately 0.000127 mobile / 0.000006 desktop. Same throttle setup; local lab observations, not field/physical-device results.
- Real PostHog SDK event and replay POSTs returned 200. Zero requests before consent. Preview-tagged Form Start and interaction events captured, with QA input names absent from decoded payloads. No new interactions or replay snapshots after revocation. One batch captured before revocation transmitted afterward; no claim of retroactive queue withdrawal.

## Service configuration and release verification

- Supabase: all four table column sets verified by zero-row reads; no customer lead records used for schema audit. Existing production-matching credentials configured only on the isolated review site.
- Resend: user-supplied credential configured as a Netlify secret; mail.driveexotiq.com domain verified. User explicitly authorized one clearly marked QA application, with both applicant/admin email addressed to hello@exotiq.ai. The single successful QA application and both delivered notification results are recorded below.
- PostHog US project 592681: public token verified against project settings. Heatmaps and replay enabled. Project masking set to Total privacy; console and network capture disabled; 30-day replay retention retained. Preview is explicitly tagged separately from production.
- Only the existing `astra-review` alias is a release target. No production promotion, advertising campaign, spending change or DNS change.

## Remaining practical limits

- Physical iPhone/Android devices and field conversion outcomes are not certified by desktop browser emulation.
- Email helpers preserve a stored lead even if email fails. Durable retries/outbox and reconciliation are follow-on reliability work in the master plan.
- All meaningful rendered journeys are instrumented; the dormant booking API has no active public booking form. Consent refusal means browser analytics is a sample; reconcile lead totals against Supabase.
- Search Console/Bing ownership, content publishing, campaign budget/geography and production-domain launch gates remain roadmap work. llms.txt does not guarantee rankings or model citations.

## Final hosted verification

- Review URL: https://astra-review--driveexotiq-astra.netlify.app/ — deploy `6aa08362ec8bb33ff601a9ff`.
- Live QA exposed a Netlify context mismatch: CLI preview build settings do not determine the runtime context of an alias deploy. The alias runs as `branch-deploy`, branch `astra-review`. Server credentials now also have the exact `branch:astra-review` scope. Failed attempts stored no rows; reads verified absence before retrying. No application-code change was needed.
- One successful browser submission returned HTTP 201 and reached `/thank-you?interest=drives`. Exactly one matching test lead exists: `9c1a4c6a-d9be-46ca-8bd2-eac0146210bf`, marked `QA REVIEW 2026-09-08 FINAL`, created 2026-09-08 21:52:31 UTC. Both SMS opt-ins are false.
- Resend reports **delivered** for applicant email `fde0ec91-118c-468a-881c-523f6a475b58` and admin email `4f81fbe6-a069-4213-a398-376233a4978d`, both to the explicitly approved hello@exotiq.ai. This verifies provider delivery, not inbox reading.
- Hosted Chromium desktop/mobile and WebKit checks: 17 passed, 1 expected skip. Final deployment additionally passed 12 read-only HTTP checks for pages, preview robots, blocked admin routes, media ranges and one-year immutable caching. Hero landscape is 2,709,721 bytes; final corrected Porsche is 264,692 bytes.
- PostHog dashboard: https://us.posthog.com/project/592681/dashboard/2077534 . Application, waitlist and partnership started-to-stored funnels are saved. Default `environment=production` excludes QA; production charts intentionally have no new production traffic before promotion. Heatmaps, replay and preview-tagged event ingestion were verified separately. Unsupported raw-referrer, geolocation and repeat-visitor template charts were removed.
- Evidence: `output/playwright/conversion/live-qa.log`, `live-qa.png`, `live-provider-verification.json`, `hosted-focused.log`, `hosted-readonly.json`, and `analytics-probe-confirmation.json`.
