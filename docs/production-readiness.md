# Production readiness — September 8, 2026

## Configuration completed

- Netlify CLI updated the **production context** on `driveexotiq-newgen` (`a9dc6785-ca82-407f-8899-edc4ebf23fd0`): site mode production, canonical origin `https://driveexotiq.com`, live forms, PostHog US region and the supplied public project token.
- `netlify.toml` now separates production from preview/branch contexts. Production explicitly overrides the safe preview default. Review deploys must continue using `--context deploy-preview`; an alias name alone does not select a build context.
- No production deployment or DNS cutover occurred. Existing production deploy `6a628078af147a00085c1073` remains the rollback reference. Existing production Supabase/Resend secret scopes were retained.
- Production PostHog tracking needs no new public token. Dashboard/settings API administration requires a private personal API key restricted to project 592681. Existing dashboard 2077534 and heatmap/replay settings remain configured; no duplicate dashboards were created.

## SEO and current offering

- Sitemap uses actual existing public pages, with no invented build-time modification dates.
- Public pages retain self-canonical production URLs, titles/descriptions and valid JSON-LD; private routes are excluded from sitemap/robots. Admin documents now explicitly use noindex, as does the thank-you page.
- Privacy/cookies/terms and consent-panel labels describe applications, waitlist and partnership inquiries. Unsupported live booking/payment/account/search/AI claims were removed. Marketplace is explicitly upcoming. This is a factual product-copy reconciliation, not a legal opinion.

## Verification

- Production build passed; 69 unit tests passed.
- 35 local production HTTP checks passed across 15 indexed pages, including metadata, sitemap, robots, llms, redirects, unauthorized admin API methods and invalid form inputs.
- Production browser interface suite covers application, waitlist and partnership success across desktop Chromium, Pixel Chromium and iPhone WebKit: nine mocked journeys, no new leads or emails.
- Production experience/consent E2E: 17 passed, one expected desktop-only skip.
- Phone review: Pixel emulation autoplay, navigation, Porsche containment, validation and no overflow passed. iPhone WebKit used the static fallback until Play film was tapped; playback then advanced successfully. Reduced-motion fallback passed.
- iOS 26 iPhone 17 Pro simulator screenshots were inspected. Simulator interaction was limited by Computer Use permissions. No physical phones were connected; emulation/simulator results do not certify physical iOS/Android behavior.
- The previously approved live application remains the only successful real QA submission, with both provider emails delivered; see `conversion-qa.md`.

Evidence is under `output/playwright/launch/`. Re-run local production checks with `node scripts/verify-production.mjs` and `node scripts/verify-production-browser.mjs` against a production-mode Next server on port 4318. The HTTP script accepts only localhost; browser form responses are intercepted and analytics traffic blocked.

## Access-dependent follow-up

- **PostHog API configured:** key labeled `Drive Exotiq site administration` is restricted to project 592681, with dashboard:write, insight:write, project:write and query:read scopes. Stored only in ignored owner-readable `.env.integrations.local`; never a public frontend variable. API reads verified project settings and dashboard 2077534. An aggregate query verified received preview pageviews, clicks, garage, form and video events; no personal lead values were queried.
- **Cloudflare API configured:** account b05e923f165be70b59bb0d2a7daf66c7, Web Analytics site fb177148d82c400e85dd53b9407f7a84 created for driveexotiq.com, auto-install false. Public beacon token configured on Netlify production. Manual module beacon uses lazyOnload and spa:false for document-load metrics; only actual HTTPS production hostnames are allowed and private entry paths are excluded. No DNS/proxy changes, R2 bucket operations or S3 credential storage. Field collection begins after production deployment, not on the preview.
- **Private admin UI:** production has no configured `ADMIN_PASSWORD`; unauthenticated requests fail closed. Lead notifications and Supabase access are independent of this dashboard; configure a strong server-only admin credential if the private UI is required.
- Search Console/Bing ownership and indexing submission remain account-dependent launch tasks. No ad spend or campaign changes were made.

Sources: [Netlify contexts](https://docs.netlify.com/build/configure-builds/file-based-configuration/), [PostHog API authentication](https://posthog.com/docs/api), [Cloudflare Web Analytics API permissions](https://developers.cloudflare.com/api/resources/rum/subresources/site_info/methods/create/).

## Updated review release

Deployment `6aa09834440120311ed4ba54` is live at https://astra-review--driveexotiq-astra.netlify.app/ with the SEO/policy updates. Seven hosted checks confirm preview noindex, empty preview sitemap, blocked admin and updated policies. Production remains on its previous deployment.

## API and Cloudflare integration verification

- Production build and 73 unit tests passed, including four Cloudflare runtime tests.
- Browser integration verified exactly one module beacon on simulated HTTPS production; zero on admin, review and localhost. Provider script was mocked, with zero external telemetry POSTs during this test. This verifies loading behavior, not live Cloudflare field data.
- API GETs verified Cloudflare site settings and PostHog dashboard/settings. PostHog heatmaps/replay enabled, 30-day retention, all text/inputs masked and console capture off. Preview aggregate event ingestion confirmed.
- Evidence: `output/playwright/launch/cloudflare-browser.json`, `cloudflare-rum-verified.json`, `posthog-settings-api.json`, `posthog-dashboard-api.json`, `posthog-ingestion-api.json` and `integrations-unit.log`.

API integration review deploy: `6aa09fb8fe1b94260b7ab5cd`. Hosted homepage/policy checks passed: preview remains noindex, Cloudflare beacon absent, updated disclosures present. Production cutover remains unperformed.

## Production launch — September 8, 2026

The user authorized committing and launching the release. Release commit `c504ef1` was deployed using explicit `--prod --context production` to the existing `driveexotiq-newgen` site.

- Live URL: https://driveexotiq.com
- Production deploy: `6aa0a50544012081edd4baa0`
- Rollback deploy: `6a628078af147a00085c1073`
- Fresh unit suite: 73 passed. Netlify production build passed.
- Live checks passed for all 15 public sitemap pages, production canonicals/indexability, robots search-crawler access, llms, new hero/Porsche assets and Cloudflare production bootstrap.
- Nine hosted form interface journeys passed across desktop Chromium, Pixel Chromium and iPhone WebKit, with all form POSTs intercepted. No new leads or emails were created. An initial WebKit run reported two transient prefetch access errors during navigation; a complete rerun passed with zero page errors.
- Cloudflare adds managed training-bot restrictions to robots.txt; Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User and PerplexityBot retain homepage access.
- Evidence: `output/playwright/launch/production-deploy.log`, `live-http.json`, `live-production-browser.json`, `live-browser.log`.

Earlier statements above that production was unchanged describe prelaunch checkpoints. Physical-device certification, Search Console/Bing ownership submission, optional admin password setup, and confirmation of accumulated Cloudflare field data remain follow-up work.
