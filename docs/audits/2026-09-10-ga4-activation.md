# GA4 activation and remaining measurement work

## Current state

Linktree has Measurement ID `G-V2GD0849VP` saved and UI-validated. This does not prove event receipt. The website GA4 extension is prepared but remains disabled because `NEXT_PUBLIC_GA4_MEASUREMENT_ID` is blank. No production deploy was made for this extension.

The Google Analytics browser is at sign-in. `GA4_API_SECRET` was not present in the authorized local integration file when checked. Do not expose this secret through NEXT_PUBLIC variables, source control, command output or chat.

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

## Activation steps

1. Sign into Google Analytics and verify the web stream containing `G-V2GD0849VP`. Confirm property ownership, timezone and intended use of the same stream for Linktree and Drive Exotiq.
2. Disable Enhanced Measurement on that stream. Configure generate_lead as a key event and form_name as an event-scoped custom dimension; optionally add approved campaign dimensions if useful. Use event counts for lead totals, not session counts.
3. Place the stream's Measurement Protocol secret in ignored `website/.env.integrations.local` as `GA4_API_SECRET`, or configure it directly on Netlify site `driveexotiq-newgen` for production functions. Preserve 0600 permissions on local secrets.
4. Configure `NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-V2GD0849VP` for production builds/runtime and GA4_API_SECRET server-only. Leave preview contexts blank. The server also requires Netlify CONTEXT=production.
5. Validate actual generated payloads with Google's debug endpoint. A successful collect HTTP response is not proof of processed events or credential validity.
6. Build/deploy, test pre-consent exclusion, granted pageview/navigation, revoke exclusion and sanitized payloads. With separately authorized QA submission, verify exactly one generate_lead event and correct form/source in GA reports. Do not count a preview or debug validation request as a production lead.
7. Verify Linktree receipt separately in GA. Establish an internal/developer traffic exclusion with a test-first filter before reporting business performance.

## Verification in this change

- Four initial failing tests became green after implementation.
- Protocol/runtime tests exercise consent, host/preview/private path restrictions, safe campaign fields, pageview deduplication, withdrawal during script loading and provider failures.
- Actual route modules tested with mocked database/email/Google boundaries: all three forms, consent refusal, honeypot, invalid data, database failure, duplicate waitlist and Google outage.
- 90 tests passed and TypeScript passed. The local Next production build succeeded; no live Google delivery or production E2E receipt is claimed.

## Other outstanding account work

- Meta on Linktree: Pixel ID saved, missing Conversions API token. Website Meta integration already exists separately; Events Manager receipt/diagnostics still need verification.
- Search Console and Bing Webmaster Tools: account ownership, sitemap submission and indexing inspection remain unverified in this session. Missing DNS verification alone is not evidence that ownership is absent.
- PostHog: existing heatmap/replay and conversion dashboard configuration remains in place; check real visitor samples and replay playback before using data to make conversion claims.
- Cloudflare: earlier audit recorded successful RUM and Web Vitals collection. No new Cloudflare product or DNS change is required for GA4. Reassess mobile field metrics after meaningful traffic accumulates.
- Google Ads linking/importing key events should happen before paid campaigns; no ad spend, campaign creation or bid changes are included here.

References: [Google tag get API](https://developers.google.com/tag-platform/gtagjs/reference#get), [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference), [Google tag configuration](https://developers.google.com/analytics/devguides/collection/ga4/reference/config).
