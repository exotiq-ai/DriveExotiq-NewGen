# GA4 activation and remaining measurement work

## Current state

GA4 is activated on production with Measurement ID `G-V2GD0849VP`. Final deployment: `6aa348612e95e74f2ca255f2` on September 10, 2026 (US Eastern). The secret is saved only in ignored local integration configuration and Netlify production functions. Public bundles were scanned and contained no secret.

Verified account: Exotiq / DriveExotiq.com, property `553725728`, DriveExotiq stream `15756784604`. Enhanced Measurement is disabled on that stream. `generate_lead` is a key event counted once per event with no default monetary value. Event-scoped custom dimension `Form name` maps to `form_name`.

Live GA4 Realtime showed `Drive Exotiq /cookies`, proving receipt of a production website pageview. Linktree has the same Measurement ID saved and UI-validated; separate Linktree event receipt remains unverified. The property's other exotiq.ai stream also has traffic and must not be counted as website QA evidence.

On September 11, the user confirmed their email flow worked and authorized QA emails. Their browser was found with analytics consent off and no Google tag; no lead was visible in Realtime or the September 10–11 lead report at inspection. The previous withdrawal test had left analytics off, which is a likely explanation, not proof of historical consent at submission.

One additional clearly labeled `QA — GA4 verification` application was submitted to the live site using the approved hello@exotiq.ai address, analytics consent enabled and SMS permissions off. The thank-you page appeared. GA4 Realtime then showed exactly one `generate_lead`, one corresponding key event, and parameter drilldown `form_name = apply` with count one. This verifies deployed server conversion receipt for that controlled submission. The original email receipt is user-confirmed; receipt of the additional QA emails was not independently checked.

## Implementation

- Load the Google tag after initial page work, only on the production domain following analytics consent; never on preview/admin/API pages.
- Manually emit sanitized page_view and form_start events. Automatic Enhanced Measurement must be disabled on this stream before activation to avoid duplicate events and uncontrolled URL/form capture.
- Obtain existing Google client/session IDs with gtag get. Missing/blocked IDs skip conversion tracking; never create a synthetic visitor to bypass blocking.
- Send generate_lead only from successful fresh writes in applications, waitlist and sponsor-inquiries. Existing duplicate waitlist records return before the event. No events for bots, validation failures, database failures or preview exercises.
- The retired booking flow is unchanged. No purchase/revenue events are fabricated.
- Server payloads contain bounded form/campaign categories, client/session IDs and denied Google advertising permissions. No contact details, introductions, IP forwarding, lead database IDs or arbitrary queries.
- One best-effort Measurement Protocol request, bounded to 1.5 seconds, with no automatic retry. Failed measurement cannot fail a saved lead. This is not durable exactly-once delivery; legitimate repeat applications can create new records/events. The database remains the source of truth.
- Browser withdrawal sets Google's disable flag. Existing Google cookies can be removed through browser settings. Cookies are configured for 90 days with cookie updates disabled; policy copy describes this.
- Campaign tags preserve Linktree source labels. This does not claim continuous visitor identity across Linktree and independent operator/investor sites. Existing PostHog remains separate.

## Activation and follow-up checklist

1. Sign into Google Analytics and verify the web stream containing `G-V2GD0849VP`. Confirm property ownership, timezone and intended use of the same stream for Linktree and Drive Exotiq.
2. Disable Enhanced Measurement on that stream. Configure generate_lead as a key event and form_name as an event-scoped custom dimension; optionally add approved campaign dimensions if useful. Use event counts for lead totals, not session counts.
3. Place the stream's Measurement Protocol secret in ignored `website/.env.integrations.local` as `GA4_API_SECRET`, or configure it directly on Netlify site `driveexotiq-newgen` for production functions. Preserve 0600 permissions on local secrets.
4. Configure `NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-V2GD0849VP` for production builds/runtime and GA4_API_SECRET server-only. Leave preview contexts blank. The server also requires GA4_SERVER_ENABLED=true, scoped only to production functions; Netlify CONTEXT is not guaranteed at function runtime.
5. Validate actual generated payloads with Google's debug endpoint. A successful collect HTTP response is not proof of processed events or credential validity.
6. Build/deploy, test pre-consent exclusion, granted pageview/navigation, revoke exclusion and sanitized payloads. With separately authorized QA submission, verify exactly one generate_lead event and correct form/source in GA reports. Do not count a preview or debug validation request as a production lead.
7. Verify Linktree receipt separately in GA. Establish an internal/developer traffic exclusion with a test-first filter before reporting business performance.

## Verification in this change

- Four initial failing tests became green after implementation.
- Protocol/runtime tests exercise consent, host/preview/private path restrictions, safe campaign fields, pageview deduplication, withdrawal during script loading and provider failures.
- Actual route modules tested with mocked database/email/Google boundaries: all three forms, consent refusal, honeypot, invalid data, database failure, duplicate waitlist and Google outage.
- 90 tests passed and TypeScript passed. A clean Netlify production build passed in 37 seconds, including function and edge packaging.
- The actual generated Measurement Protocol payload passed Google's debug endpoint with HTTP 200 and zero validation messages. This endpoint does not ingest events or authenticate a completed production lead.
- Production Cookie Settings works. Rejecting optional cookies prevented the Google script from loading; analytics-only consent loaded the exact Measurement ID without Meta Pixel. Withdrawal and reload were exercised separately.
- Realtime confirmed production `Drive Exotiq /cookies` (one view), `Drive Exotiq /apply` (two deliberate visits) and two `form_start` events after the two form-focus exercises. No forms were submitted or emails sent during that initial September 10 check; the September 11 controlled submission is recorded above.
- Fixed the server gate to use explicit production-functions-only `GA4_SERVER_ENABLED=true`, rather than relying on Netlify CONTEXT being available in deployed functions. Regression tests reproduced and cover this issue.

## Deployment notes

Generated Netlify folders contained duplicate directory trees that stalled recursive cleanup. They were moved outside the repository into `.ga4-netlify-stale-v1-20260910` and `.ga4-netlify-generated-backup-20260910` under the workspace parent; a fresh generated tree built normally. Avoid blindly traversing these backups.

The first separate no-build upload used `.next`, causing public chunk 404s. The final upload explicitly used `--dir .netlify/static`, preserving the adapter-prepared public paths. The previously missing layout chunk returned HTTP 200 and browser hydration/consent controls worked after correction. Future split build/upload commands must deploy adapter public output; do not publish raw `.next` with a standalone no-build upload. A Netlify cache purge also removed stale HTML referencing older chunks. The incorrect first deployment was deleted after the corrected production release was verified.

## Other outstanding account work

- Meta on Linktree: Pixel ID saved, missing Conversions API token. Website Meta integration already exists separately; Events Manager receipt/diagnostics still need verification.
- Search Console and Bing Webmaster Tools: account ownership, sitemap submission and indexing inspection remain unverified in this session. Missing DNS verification alone is not evidence that ownership is absent.
- PostHog: existing heatmap/replay and conversion dashboard configuration remains in place; check real visitor samples and replay playback before using data to make conversion claims.
- Cloudflare: earlier audit recorded successful RUM and Web Vitals collection. No new Cloudflare product or DNS change is required for GA4. Reassess mobile field metrics after meaningful traffic accumulates.
- Google Ads linking/importing key events should happen before paid campaigns; no ad spend, campaign creation or bid changes are included here.

References: [Google tag get API](https://developers.google.com/tag-platform/gtagjs/reference#get), [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference), [Google tag configuration](https://developers.google.com/analytics/devguides/collection/ga4/reference/config).
