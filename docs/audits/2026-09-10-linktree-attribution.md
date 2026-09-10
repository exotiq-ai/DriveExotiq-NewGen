# Linktree attribution and profile refinement

## Profile

- Existing `linktr.ee/driveexotiq` address preserved.
- Centered `exotiq` title and official white/Gulf exotiq mark published.
- Subscribe disabled. Three audience routes and Instagram icon remain.
- Pixel ID `2007025476584382` entered. Linktree explicitly requires a valid Facebook Conversions API access token; setup is not operationally verified until that token is supplied and events are checked. No token was invented or copied from an unrelated integration.
- Google Measurement ID absent in the inspected local and production configuration and Linktree settings; awaiting the owner.

## Website attribution

Only fixed, approved values for `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content` are retained. Unknown values, duplicate parameters and arbitrary query strings are dropped. Add future campaign labels to the explicit allowlist before publishing a campaign.

After analytics consent, the last explicitly tagged visit is retained in tab-scoped session storage for up to 30 minutes. Untagged navigation preserves it; analytics refusal/revocation clears it. The stored object contains campaign categories and expiry, never a visitor identifier or form content. Privacy and cookie disclosures describe this storage.

All consented PostHog events, including Form Start and API-confirmed Signup, receive those categories. Production conversion charts require `Signup.status=stored`; the local preview uses `preview` and does not count as a stored lead. This change does not add campaign fields to lead database rows or connect a person's identity to PostHog.

Current link convention: `utm_source=linktree&utm_medium=referral&utm_campaign=profile_hub&utm_content=drivers|operators|investors`. The shared Linktree entry does not distinguish business cards from Instagram. Do not relabel every visit as QR traffic.

## Existing PostHog dashboard extended

Dashboard: https://us.posthog.com/project/592681/dashboard/2077534

- Community: insight 11788820 (`klNpFUik`)
- Marketplace: insight 11788821 (`wwWZUesX`)
- Partnerships: insight 11788822 (`2sxwcIsu`)

Each ordered funnel is Linktree-tagged website pageview → matching form start → stored submission, production-only, with a 30-minute window. The website's anonymous identifier stays in memory: attribution labels survive a reload, but funnel identity does not connect hard reloads, separate browsers, or other domains. These are consented samples, not total leads or unique people. No historical campaign attribution is backfilled. Operator/investor destinations are linked correctly but their independent application analytics were not changed.

## Verification

- New attribution regressions first failed (5 expected failures), then passed after implementation.
- 82 unit tests passed; TypeScript passed after moving stale generated duplicate `.next/types/* 2.ts` files out of the build directory.
- Browser: tagged homepage → analytics-only consent → application → preview thank-you. No lead stored and no email/text sent.
- PostHog query verified preview `$pageview`, CTA, Form Start and Signup events carrying `linktree / profile_hub / drivers`; Signup had `status=preview`.
- Public Linktree visually verified with official exotiq avatar and no Subscribe button.
- API reads verified all three new insights saved on the existing dashboard.

- Netlify production build passed with production robots output allowing public pages and excluding admin/API routes.

- Production deployment succeeded: `6aa33b5c072c9bd121bea3a9` on `driveexotiq-newgen` (`https://driveexotiq.com`).
- Live browser check of `/cookies` confirmed the new campaign storage disclosure and storage table on the public production domain.
- Implementation commit: `ff2266e`, pushed to `codex/astra-awwwards`.

Outstanding external setup: Linktree Meta Conversions API token and Google Measurement ID. The existing website Meta integration is separate from the incomplete Linktree integration.
