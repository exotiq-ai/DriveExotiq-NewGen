# Drive Exotiq / Astra

An independent design build from production commit `2e0ad94738ae9e441b284b2d462d358d1dd88a0d`, on branch `codex/astra-awwwards`.

## Creative direction

The road is calling. A silver McLaren in an architectural light study opens into a warm, human motoring journal: real alpine driving, a keyboard-accessible garage, the completed Denver–Miami roadbook, and invitations to the driving community. Bricolage Grotesque, Schibsted Grotesk and Spectral are self-hosted. Native scrolling and static content remain complete when motion is unavailable.

The opening is generated campaign imagery. Road, founder and archive photographs come from the existing Drive Exotiq source collection. Archive captions distinguish those locations from verified tour endpoints; exact dates, route stops, mileage, rental availability and future event dates are not invented. The marketplace remains coming soon.

## Isolation and preview

- Independent clone and worktree: no Git object store, index, branch or configuration shared with Claude’s checkout.
- Commit/push hooks allow only `codex/astra-awwwards`. No main/newgen-main changes.
- Dedicated Netlify project `driveexotiq-astra`, ID `f499ad01-b775-4c7d-901f-98f879c83d94`.
- Intended draft alias: `https://astra-review--driveexotiq-astra.netlify.app`.
- No Git auto-deploy connection, custom domain or production deployment.
- `NEXT_PUBLIC_SITE_MODE=preview` disables persistence, email, SMS, production analytics and admin access; forms disclose this and validate real input. Robots and response headers prevent indexing.
- Netlify configuration deliberately sets preview mode for this branch. Production integration requires a separate reviewed change; it is outside this build.

## Local development

Use Node 22. Run `npm ci`, create an ignored `.env.local` containing `NEXT_PUBLIC_SITE_MODE=preview` and `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:4317`, then `npm run dev -- --hostname 127.0.0.1 --port 4317`.

For verification, stop the dev server before building. Run `npm run lint`, `npm run build`, `node --test tests/preview-services.test.mjs tests/preview-production.test.mjs`, then start the built server and run `npx playwright test`. Browser tests default to installed Google Chrome and use `ASTRA_TEST_URL` to target a deployed preview. `node tests/preview-http-smoke.mjs URL` checks HTTP/API preview boundaries.

Deployment must target the explicit project above with `netlify deploy --build --context deploy-preview --site f499ad01-b775-4c7d-901f-98f879c83d94 --alias astra-review`. Never use a production flag. Use the exact URL returned by Netlify as the deployed result.

## Assets and evidence

Large unused legacy media was moved outside the publish tree into the independent project’s `assets/legacy-public-archive`; originals remain recoverable through baseline Git history. Optimized selected media lives in `public/astra`. Render masters, the editable procedural Blender environment, source manifest, generation prompts and prepaid-credit ledger live in the sibling project `assets/` and `evidence/` directories and are not published.

One Higgsfield Seedance generation consumed 54 existing prepaid credits, leaving 2,956. No Higgsfield top-up or cash purchase was made. The approved ceiling is $100 new cash spend. Platform-provided image generation is tracked separately from Higgsfield credits.

See the final verification record and component reports under `evidence/`. Local browser captures are ignored by Git; the master plan and full media evidence are in the parent DriveExotiq-Astra folder.

## Framework maintenance

This preview upgrades the pinned Next14.2.33 baseline to Next15.5.25 and updates the affected server/image/mail dependency chain. The scoped PostCSS override addresses Next’s bundled version. Async route parameters were migrated, and file tracing is constrained to this independent worktree. `npm audit --omit=dev` reports zero vulnerabilities on the final installed lockfile.

The default browser suite covers desktop/mobile Chrome and mobile WebKit. Firefox is available with `ASTRA_FIREFOX=1 npx playwright test --project firefox`; its downloaded 151 binary currently fails on this Mac before page navigation (`Couldn't load XPCOM`). This is recorded as unavailable coverage, not a browser compatibility pass. Automated WebKit emulation does not replace a physical iPhone test.
