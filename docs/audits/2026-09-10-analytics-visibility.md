# Analytics and visibility audit — September 10, 2026

## Decision

The site has working event collection, heatmap data and Cloudflare performance data. It is not yet ready for dependable paid-acquisition measurement. Prioritize replay verification, Meta setup, campaign attribution and search-account verification. Do not add overlapping trackers merely to increase tool count.

Read-only production audit. No live lead submissions, emails, subscription purchases, tracker installations or deployments were made. The isolated browser check generated some ordinary analytics requests; the reported measurement window ends before that check. Evidence is stored locally under `output/analytics-audit/` and `.playwright-cli/` (ignored by Git).

## Findings

| Area | Evidence | Assessment |
| --- | --- | --- |
| PostHog events | 37 production pageviews across 8 anonymous session IDs, 16 CTA events, 9 garage selections, 1 Form Start, 0 Signup events since launch | Collecting; very small sample, potentially including internal/launch QA. Zero tracked signups does not establish zero database leads. |
| Heatmaps | 213 points: 173 mouse movements, 37 clicks, 3 dead clicks. Homepage 82; marketplace 39; journal detail group 36; drives 29; apply 11; journal index 9; tour 7 | Data exists in PostHog's separate `heatmaps` table. Absence of `$$heatmap` in ordinary event queries is not evidence of failure. Too little data to justify layout changes from heatmaps alone. |
| Session replay | Project enabled, 30-day retention, inputs/text masked. Recorder script loads after consent. Aggregate replay table has no postlaunch production recordings; its only indexed row predates launch. Recording-list API returns 403 for missing `session_recording:read` | Unverified, priority investigation. A loaded recorder or HTTP 200 on ingestion does not establish a playable recording. No claim that replay is working end to end. |
| Cloudflare | 286 RUM page-load records; 223 Web Vitals records; live beacon POST returned 204 | Collecting. These are measurement counts, not verified unique human visitors. SPA navigation is intentionally excluded (`spa:false`). |
| Plausible | Live event requests return 202. Stats API returns 402: site locked due to missing active subscription | Reporting blocked. Existing weekly digest depends on this API and cannot retrieve current metrics. No digest email was triggered during audit. |
| Meta Pixel / Conversions API | No integration found in app/backend sources. No Meta script or `window.fbq` observed in live browser. No Meta domain-verification TXT found | Not installed. Existing Pixel/dataset ID or Events Manager access needed before implementation. |
| Search foundations | 15 sitemap pages all return 200, self-canonical URLs, titles, descriptions, social images, no noindex. robots.txt and llms.txt respond successfully | Technical basics pass; actual search indexing and impressions remain unverified. |
| Search/AI crawler access | robots.txt allows Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot and Claude-User on homepage | Robots permission verified, not actual crawler delivery or inclusion in search/LLM answers. |
| Search Console/Bing ownership | No Google-verification TXT found; account reports not accessed | Unknown. Absence of TXT does not rule out another verification method. |

Metrics window: September 9, 2026 00:15 UTC (September 8, 8:15 p.m. EDT launch) through September 10, 2026 20:40 UTC, approximately. PostHog queries ran immediately afterward and returned only September 9 production events; the audit's automated browser is subject to SDK bot filtering.

## Performance

Cloudflare p75: LCP **1.659 seconds**, INP **40 milliseconds**, CLS **0**. API schema descriptions verified that LCP/INP query values are microseconds; converted here for readability. These are encouraging early aggregates, not a mature mobile-specific performance certification. Metrics may have different eligible sample sizes and include internal traffic.

Source: [Cloudflare Core Web Vitals](https://developers.cloudflare.com/web-analytics/data-metrics/core-web-vitals/). Live API evidence: `cf-vitals.json`, `cf-unit-schema.json`.

## Measurement gaps in the implementation

1. **Consent limits the sample.** PostHog starts after consent. On the homepage the prompt waits for scroll intent: 0.6 viewport on desktop, 2 viewports on mobile. Early hero behavior and people leaving before consent are absent from PostHog. Cloudflare/Plausible and PostHog counts must not be divided to claim a consent rate; definitions and filtering differ.
2. **Anonymous identity resets.** PostHog uses memory-only persistence. Full page loads can create new session/visitor identities. Returning-visitor, cross-session attribution and unique-person claims are not dependable.
3. **Journal pages are collapsed.** `analyticsPath` converts every article to `/blog/detail`, which is not an actual article URL. This loses per-article performance and makes article heatmap overlays ambiguous. Safely allowlist published article slugs while continuing to strip query/hash/private paths.
4. **Campaign attribution is coarse.** PostHog retains only a category such as paid/social/search/direct/internal. In this sample, 34 pageviews are direct and 3 internal. There are no campaign, creative or placement dimensions. Preserve controlled campaign identifiers without storing arbitrary URL query text or personal information.
5. **CTA placement is missing.** Multiple CTAs to the same destination are indistinguishable. Add explicit static placements (header, hero, garage, footer) to compare contribution to form starts and stored submissions.
6. **Client conversions are a sample.** Forms emit Signup only after successful storage, but browser blocking/consent can hide events. Reconcile aggregate stored leads with analytics; do not equate a thank-you pageview with a conversion. No production database lead-count audit was performed here.
7. **Error visibility is partial.** Custom video/submission failures exist; general JavaScript exception capture is disabled. Consider a carefully scrubbed error channel instead of broad network/body logging.
8. **Replay usefulness needs inspection.** Project settings mask text and block images; client settings also apply masks. Inspect an actual playable session before claiming media/garage problems can be diagnosed from replay. Keep form contents masked.

## Recommended execution order

### 1. Repair reporting confidence

- Add `session_recording:read` to the existing project-restricted PostHog administration key, or inspect the recording list in an authorized account session. Diagnose why postlaunch recordings are absent before changing recording configuration.
- Reproduce in a normal browser with consent and harmless clicks; verify a playable, correctly masked recording. Clearly label or exclude QA activity.
- Choose whether to reactivate Plausible or retire it and replace its digest with PostHog/Cloudflare reporting. A paid subscription change requires the owner's choice. Avoid sending misleading empty weekly reports when the upstream API fails.
- Keep the existing [conversion dashboard](https://us.posthog.com/project/592681/dashboard/2077534); add data-quality context instead of creating duplicates.

### 2. Establish paid conversion measurement

- Use the existing Meta Pixel/dataset if one exists; do not create an unrequested duplicate.
- Add a distinct marketing-consent category; existing analytics consent does not describe advertising tracking. Load Meta only following that choice and update disclosures.
- Track PageView and a Lead event after confirmed stored submission, categorized as community application, rental waitlist or partnership inquiry. No Purchase/revenue claims while rentals are unavailable.
- Verify events in Meta Events Manager, including browser/server deduplication if Conversions API is later added. CAPI needs separate server credentials and an explicit event/consent design; never expose its access token in frontend code.
- Add campaign and CTA-placement identifiers, then use consistent tagged links for social, email and ads. Avoid collecting arbitrary query values or form text.

### 3. Establish search visibility reporting

- Verify access to Google Search Console and Bing Webmaster Tools, submit the sitemap and inspect homepage, marketplace, drives and a journal article.
- Monitor impressions, queries, indexed pages and crawl failures. Technical indexability alone is not proof of indexing or ranking. [Google's Search Console workflow](https://developers.google.com/search/docs/monitor-debug/search-console-start).
- Preserve distinct journal article paths in analytics. Compare landing pages with CTA/form conversion, not just total traffic.
- Keep llms.txt factual and current; it is not a guarantee of LLM inclusion. Continue publishing useful, accurate community and rental-marketplace content.

### 4. Interpret behavior after more data arrives

- Review homepage, garage/marketplace and apply flows separately on mobile/desktop.
- Heatmap coordinates on the pinned, changing garage scene need replay/selected-car context; a single static screenshot may show the wrong car state.
- Use aggregate traffic for reach, consented PostHog for behavior, and stored leads for actual business outcomes.
- Only add Google Ads/GA4 conversion integrations when those channels need them; GTM is optional, not a prerequisite. No ad campaigns or budgets were changed.

## Sources and reproducibility

- PostHog project 592681: query API, project settings and existing dashboard; no raw personal lead fields fetched.
- Cloudflare account/site APIs, GraphQL RUM and field descriptions; DNS TXT inspection.
- [Cloudflare data collection](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/).
- [Plausible Stats API](https://plausible.io/docs/stats-api): historical reporting API distinguished from live event acceptance.
- Browser confirmed no PostHog network resources before consent, PostHog config/recorder resources after consent, no Meta Pixel, Plausible event 202 and Cloudflare beacon 204. Headless bot filtering means this browser check does not prove new PostHog event ingestion.
- No production code/configuration was changed as part of this audit.
