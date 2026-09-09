# Conversion, media and discoverability implementation plan

> Execute in the existing isolated worktree, with independent bounded tasks and review. Preserve the staged cleanup and cinematic archive. Do not promote production, buy advertising, change DNS or send test emails without the relevant concrete authorization.

**Goal:** Measure every meaningful visitor journey while increasing qualified conversions. Report driving-community applications, marketplace waitlist requests and partnership inquiries separately, alongside CTA, content, garage and video engagement; the owner requested coverage of all journeys.

**Architecture:** Keep Next.js and the existing Supabase/Resend backend. Add one consent-aware PostHog integration, reuse existing event call sites, and keep preview indexing/admin isolation independent from explicitly enabled live forms. Media is generated in Higgsfield, reviewed before delivery, and encoded outside the runtime. No new animation framework.

## Findings and decisions

- This worktree already belongs to `exotiq-ai/DriveExotiq-NewGen`. The current production branch's application endpoint stores `de_applications`; this branch already has server-only email helpers and validated application/waitlist/booking/sponsor endpoints. Reuse these; do not restore the older public send-email endpoint.
- Local previews remain write-free. The isolated hosted review explicitly enables live forms, with server credentials in Netlify and existing schema verified. Never call a write-free preview success a captured lead.
- Plausible reporting is preserved. Consent-aware PostHog project 592681 is configured, including page depth, form funnels, media engagement, heatmaps and masked replay. Verified delivery and release evidence are recorded in `docs/conversion-qa.md`.
- The current car is a Porsche 911 GT3 RS. Preserve that model, render Oak Green Metallic (not casually substitute the different Neo paint) with bronze wheels and a restrained camera pullback.
- McLaren stays planted on the floor. The camera orbits; garage seams and floor show parallax. Restore the earlier traveling architectural light effect. Doors open with glass, mirror and roof sections attached; no car turntable illusion.
- Ship the corrected time-based hero first. Scroll scrubbing is a follow-on experiment: seek-friendly rendition or image sequence, short scroll range, no scroll hijack, immediate CTA access, reduced-motion still, and physical iOS validation. Success is better qualified conversion, not more animation engagement.
- Remove redundant numbered sections and block micro-headings on the homepage/drives/roadbook. Keep meaningful category/status pills in garage and journal, real headings, form labels, geographic captions and necessary preview/event disclosures.

## Workstream 1 — Visual flow and media

Files: `app/drives/page.tsx`, `app/tour/page.tsx`, `components/home/{HomeExperience,HomeFounder,HomeInvitation,HomeGarage,HomeLoop}.tsx`, `garage-data.ts`, `home.css`; encoder and versioned public media.

1. Remove redundant label markup instead of leaving CSS-hidden text/empty spacers. Preserve semantic h1/h2 structure and garage/journal categories. Check all breakpoints and keyboard navigation.
2. Generate a camera-orbit McLaren proof from the accepted Gulf-blue identity and earlier lighting reference. Reject tire sliding, spinning body, mismatched door anatomy or implausible garage movement. Preserve current hero as fallback.
3. Generate a full-car Oak Green Metallic GT3 RS still, bronze factory-style wheels, safe margins. Review body, wing, wheels and color before motion. Reuse the existing scroll-driven optical pullback on this high-resolution still; keep the entire car visible. This avoids another video download and preserves geometry.
4. Reuse poster-first/visibility/consent-independent reduced-motion playback safeguards. Use the optimized Porsche still with the existing reduced-motion/Save Data-aware garage treatment; no additional Porsche video download. Keep meaningful static fallback and accessible motion control.
5. Compare all encoded assets to accepted masters, verify dimensions/size/fast-start, and rerun mobile/WebKit media regressions. Keep old versions for rollback.

## Workstream 2 — Real forms and reliable lead handling

Files: `lib/preview.ts`, existing four public API endpoints/forms, preview notice, environment documentation and focused tests.

1. Audit upstream schema and existing runtime config using read-only metadata; never print secrets or retrieve lead records for this audit. Check exact columns with zero-row queries.
2. Separate `isFormPreview` from indexing/admin preview status. Default preview remains write-free. An explicit live-form flag can enable real submissions without making the review host indexable or enabling admin routes.
3. Keep schema validation, honeypot, consent fields and server-side service credentials. Return success only after the lead is stored. Missing config/database failure must give recoverable form errors and preserve entered values.
4. Verify Resend sender/domain and admin destination; do not silently claim delivery if missing. A saved lead and email delivery are separate states. Plan durable retries/outbox and idempotency for notification reliability; do not recreate an unauthenticated mail relay.
5. Test mocked database/email paths, preview zero-side-effects, live-form-on-preview behavior, malformed payloads and provider failures. Live smoke submission must use a controlled test identity with an explicit notification destination; do not email existing customers/admins as an incidental test.
6. Configure only the necessary variables on the existing review site after provider/schema checks. Preserve noindex/admin isolation. Production cutover stays a separate release.

## Workstream 3 — Measurement and conversion

Files: `lib/analytics.ts`, `components/AnalyticsListener.tsx`, cookie consent helpers, a small PostHog loader/provider, `.env.example`, analytics tests.

- Obtain the intended PostHog project key and region; no guessed project or credentials. Load its SDK after analytics consent and initial page work, never on admin routes. Use memory/opt-out before consent; revocation stops capture/replay and clears identifying persistence.
- Capture explicit CTA, form-start, validation-error category, stored-success, submission-failure, garage selection and actual page depth. Never send names, emails, phone numbers, free-text intros, form payloads or raw sensitive query strings.
- Enable heatmaps with supported autocapture/pageleave settings. Mask form inputs and sensitive page text in replay; do not record API bodies/console payloads. Keep preview traffic separated from production.
- Configure funnels per acquisition channel and device: landing → relevant CTA → form start → persisted submission. Report completion rate, validation abandonment, submission error rate, qualified-lead rate and later attended-drive/booking outcomes. Deduplicate success; distinguish preview exercises from real leads.
- Dashboards: acquisition, form friction, mobile versus desktop, content-to-application, media engagement versus conversion. Review weekly; fix obvious friction before A/B testing. Low traffic calls for qualitative replay review and large changes, not underpowered significance claims.
- Preserve useful Plausible reporting during migration; prevent double initialization/events. Avoid adding Clarity/Hotjar alongside PostHog without a demonstrated gap.
- Cloudflare Web Analytics/RUM is optional for field Core Web Vitals if existing DNS/account access supports it. Current hosting is Netlify; don't change DNS/proxy routing merely to add tracking. Add uptime and API-error alerts with actual destinations once account access is known.

## Workstream 4 — SEO and answer-engine discoverability

Files: metadata, `app/robots.ts`, `app/sitemap.ts`, dynamic `/llms.txt`, canonical/structured-data helpers and verified editorial content.

1. Keep review host `noindex` and disallow crawling. Public launch must use one canonical HTTPS domain, correct redirects, production metadata, reachable sitemap and crawlable essential assets. Test deployed responses, not just source configuration.
2. Fix crawler-specific rules that currently allow `/admin` and `/api` by overriding the wildcard restrictions. Search crawlers inherit the same public-only scope. Distinguish search retrieval from model training; do not indiscriminately grant every training bot access as an SEO tactic.
3. Serve truthful environment-aware `llms.txt`: absolute canonical links and concise organization/page summaries. Current static file permanently calls the site a preview, even in a production build. Never include private/admin/API records. Treat it as optional documentation, not a ranking promise.
4. Audit one descriptive title, description, H1 and canonical per indexable page. Preserve proper status codes and internal links. Add accurate Organization/WebSite/BreadcrumbList/Article structured data where supported by visible content. Do not invent review stars, event dates, inventory availability, addresses or rental offers.
5. Publish a small set of genuinely useful pages: how invitation drives work, actual cities served, owner/enthusiast eligibility, what happens after applying, upcoming confirmed gatherings, and original road stories with author/date/source context. Avoid cloned city doorway pages and unsupported claims.
6. Register/verify Google Search Console and Bing Webmaster Tools, submit production sitemap, monitor indexing/canonicals and actual queries. Add IndexNow only where supported and useful, not as a substitute for content quality.
7. For AI discovery: accessible HTML answers, clear entity/brand relationships (Drive Exotiq versus future exotiq.rent), original evidence and consistent external profiles. Measure identifiable AI referral sessions and qualified conversions; direct/dark traffic is incomplete evidence. No guaranteed LLM mentions or rankings.

## Workstream 5 — SEM and landing-page experiments

Planning only; no campaigns or spend are authorized yet.

- Start with one geographically relevant high-intent campaign linked to a matching, truthful landing page. Keep community invitations, partnership inquiries and future rentals in separate campaigns; do not buy rental-booking intent for unavailable inventory.
- Agree target geography, monthly cap, cost-per-qualified-lead threshold and follow-up capacity before activation. Use exact/phrase intent initially, review real search terms and negatives, and avoid competitor/trademark assumptions.
- Define UTMs and ad-platform conversion IDs. Send confirmed persisted lead events only with required consent; no raw contact details in browser events. Import qualified/offline outcomes once CRM ownership and deduplication are defined.
- Establish a baseline before changing media, CTA and form length simultaneously. Prioritize headline clarity, invitation expectations, trust/real imagery and reduced form friction. Judge camera/scroll experiments by completion rate and performance.

## Acceptance and release

Build/typecheck/lint, focused unit tests, full Chromium/mobile/WebKit E2E, consent/request interception, form preview/live isolation, semantic/visual checks, missing-media fallback and selected-rendition checks. Compare performance with the established 1.06 s mobile/0.288 s desktop lab baseline and record candidate differences. Keep field RUM separate from lab claims.

Deliver updated isolated preview plus QA evidence and an honest access checklist. No claim that PostHog collects, emails deliver, or Google indexes until observed. Physical devices, ad spend, DNS and production promotion are separate release decisions.

## Source references (checked September 8, 2026)

- [Existing backend repository](https://github.com/exotiq-ai/DriveExotiq-NewGen)
- [PostHog Next.js](https://posthog.com/docs/libraries/next-js), [heatmaps](https://posthog.com/docs/toolbar/heatmaps), [replay privacy](https://posthog.com/docs/session-replay/privacy)
- [Google AI-search optimization guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [robots guidance](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Cloudflare RUM](https://developers.cloudflare.com/web-analytics/about/)
- [Porsche Oak Green Metallic reference](https://newsroom.porsche.com/en/products/porsche-classic-carrera-gt-sports-supercars-reconstruction-custom-order-16953.html) — color reference only, not GT3 RS geometry.

## Launch sequence and ownership

| Timing | Deliverable | Acceptance |
|---|---|---|
| Review release | Corrected hero, green Porsche, calmer sections, form integration, consent-aware measurement | Browser QA, stored test lead, provider delivery status, received PostHog events |
| Before production cutover | Verify titles/canonicals/structured data; truthful availability; privacy/provider disclosures; real sitemap dates; Search Console and Bing ownership | Production-domain checklist, no preview URL in index, approved content and legal review |
| First two weeks | Baseline all conversion funnels by device/channel; inspect consented drop-offs; fix mobile friction | Stored leads reconciled with backend, documented biggest abandonment point |
| Weeks 2–4 | Publish driving-guide and community answers based on real locations/events, link from relevant stories | Useful original pages, valid crawl/index status, qualified inquiry tracking |
| After baseline | Test hero scroll interaction or CTA/form changes one at a time; launch one bounded SEM campaign after geography/budget approval | Cost per qualified lead and completion rate, with performance guardrails |

### Search intent and page mapping

| Page | Intent to serve | Main conversion | Content requirement |
|---|---|---|---|
| `/` | Drive Exotiq brand and driving community | Relevant next step | Clear offering, actual availability and credibility |
| `/drives` | Join local enthusiast drives / Cars & Coffee | Drive invitation | Confirmed operating area, who can join, process, real FAQ |
| `/marketplace` | Upcoming exotic-car marketplace | Waitlist | Honest launch status and requests; no false booking inventory |
| `/sponsor` | Automotive event/community partnerships | Partnership inquiry | Real audience, deliverables and substantiated examples |
| `/tour` and `/blog/*` | Road stories, routes and ownership knowledge | Relevant drive/garage CTA | Original experience, authorship, dates, useful images and internal links |

Do not create thin city doorway pages. Add a local page only when the service or community is active there and unique information can be provided. Do not reset sitemap `lastModified` on every build; use genuine editorial change dates or omit it. Existing broad policy text mentions future platform features; reconcile it with the actual launch offering before production promotion.

### Measurement operation

Use PostHog US project **592681**, explicitly enabled on the review with `environment=preview`. Production dashboards must filter `environment=production`; QA dashboards filter preview. Project replay is consent-gated in the client, with 30-day provider retention, masked content and no console/network bodies. Keep success status `stored` separate from `preview`; video progress measures reached playback position, not proof of uninterrupted attention. Consent refusal is expected and means these funnels are a sample, so reconcile totals with stored leads.

Cloudflare RUM does not require moving Netlify hosting or changing DNS. Add its public beacon only if field-vitals measurement provides a demonstrated gap and the intended Cloudflare account/site token is available. No new subscription or overlapping replay tool is required today.
