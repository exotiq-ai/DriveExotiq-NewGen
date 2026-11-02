# Astra production recovery

## Incident and immediate recovery

On November 1, 2026, PR #1 merged PostHog changes into `newgen-main` at 20:46:11 UTC (3:46:11 PM EST), producing `9db6a10bc827e5adcaddcf5513e8012844d7fd7c`. Netlify still treated that branch as production, even though Astra had been published manually from `codex/astra-awwwards`. The analytics PR did not replace the homepage; its base branch already contained the older motion-scroll experience.

Netlify built that stale source and published deploy `6ae7a515caa77120eb54b20b` at 20:48:23.791 UTC (3:48:23 PM EST). The source of truth and the manually published site had diverged.

The verified September 20 Astra deploy, `6ab0093696f1425e16d585e2`, was restored at **2026-11-02 00:02:02.538 UTC / November 1, 7:02:02 PM EST**, then locked against automatic replacement. The live homepage returned “The road is calling.” No source history was rewritten.

## Release repair

- Base the release on Astra commit `7d5e58b1417bc4df9c96c371583f7b7b95a57593`, preserving its mobile experience, films, car interactions and image-CDN routing.
- Retain Astra's existing single PostHog lifecycle and the existing production project key. Apply the new analytics PR's production-host restriction, Global Privacy Control/Do Not Track handling, anonymous collection policy, and disabled replay/autocapture. Preserve Astra's stricter memory-only identity and sanitized named events, plus existing GA4 and Meta hooks. Do not install a second tracker.
- Use `production-astra` for both GitHub's default branch and Netlify's production branch. Protect it with required pull requests and the `Verify Astra` check, including administrators, and prohibit force pushes and deletion. Keep `main` and `newgen-main` intact.
- Validate the rendered Astra homepage before every build. Production builds additionally require the release branch, exact production site ID, canonical URL, production site mode and live form mode. The guard has no bypass flag; restoring an existing verified deploy remains the emergency recovery mechanism.
- Verify a Git-connected production build while the restored deployment is locked. Promote only the verified immutable deploy, then resume automatic publishing from the protected release branch.
- Update Next and its ESLint configuration to 15.5.28, sharp to 0.35.5, and compatible DOMPurify/source-map-js patches. The remaining production Zod advisory concerns oversized collection validation; current request schemas are fixed objects/scalars, with no array/set/map validation path. A breaking Zod migration is outside this recovery.

## Verification and operating evidence

Unit tests cover source identity, wrong branch/site/context rejection, analytics privacy signals, consent races, payload sanitization and event deduplication. Browser tests use the real PostHog SDK with all analytics traffic intercepted and production-origin requests forwarded exclusively to localhost. They report the production key by fingerprint and never send test events to PostHog. Browser traces remain local and are not committed.

Production HTTP checks cover 15 indexed pages, canonical URLs, robots metadata, redirects, invalid form requests and unauthenticated admin requests. Successful form journeys use mocked responses; no test leads or emails are created. Desktop/mobile interaction tests cover films, garage selection, scroll behavior, keyboard focus and reduced-motion fallbacks. Deployment checks request every emitted image size on the immutable candidate and live site to detect adapter routing failures.

Local machine evidence, including build/test logs and sanitized deployment/protection API responses, is stored outside this checkout at `../evidence/2026-11-01-production-recovery/`. GitHub Actions and Netlify deployment records provide the release commit, build result and publish timestamps. See README for the release sequence.
