# Drive Exotiq

The Astra Next.js website for driving invitations, road stories and the upcoming rental marketplace. Local and preview builds default to isolated forms; the dedicated production context serves the live site.

## Develop

Use Node.js 22, run `npm ci`, and create `.env.local`:

```dotenv
NEXT_PUBLIC_SITE_MODE=preview
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:4317
```

```sh
npm run dev -- --hostname 127.0.0.1 --port 4317
```

## Project layout

- `app/`: routes, global base styles and shared site/editorial styles.
- `components/home/`: current homepage, garage, films and homepage-only CSS.
- `components/layout/`, `components/forms/`, `components/ui/`: shared components.
- `public/media/`: optimized assets delivered to visitors.
- `legacy/cinematic/`: preserved original cinematic experience and restoration instructions; excluded from the active build.
- `docs/archive/build-notes/`: historical build diaries and setup notes. Their dates, deployment records and original paths describe past builds; use this README for current commands.
- `tests/`: service isolation and browser end-to-end coverage.
- `output/playwright/`: ignored local QA captures.

## Verify

Stop the development server before building so it cannot modify `.next` during verification. Build and run the preview with the environment above:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run start -- --hostname 127.0.0.1 --port 4317
```

In another terminal:

```sh
npm run test:http -- http://127.0.0.1:4317
npm run test:e2e
```

Browser tests use Playwright-managed Chromium for desktop/mobile and WebKit for mobile Safari coverage. Install them with `npx playwright install chromium webkit` if missing. The managed Chromium keeps tests independent of the system Chrome updater. Set `E2E_BASE_URL` to test another preview, and `E2E_FIREFOX=1` to include an installed Playwright Firefox browser. Browser emulation does not replace checks on physical phones.

## Media

Versioned delivery files live in `public/media/v2/`; original masters and generation references stay outside this application. `scripts/encode-media.mjs` rebuilds camera videos (`--camera`), the portrait canvas (`--portrait-master`), hero deliveries (`--hero`) and responsive images (`--posters`). See [the media plan](docs/plans/2026-09-08-media-resolution.md) for sources and [media QA](docs/media-qa.md) for measured results.

## Preview deployment

The feature branch, preview project name and review URL retain their historical identifiers. `netlify.toml` defaults to preview mode and explicitly overrides production. Old `/astra/...` media URLs redirect to `/media/...`.

The preview project is `driveexotiq-astra`, site ID `f499ad01-b775-4c7d-901f-98f879c83d94`; its review alias is `astra-review`. Deployment is a separate operation from local verification. Do not promote this preview configuration to the production site unchanged.

## Production releases

The release branch is `production-astra`, based on the verified Astra experience. GitHub's default branch and Netlify's production branch must both use that branch. `main` and `newgen-main` are not production release sources. Feature work can continue independently, including in other agents' checkouts.

Require the stable GitHub check **Verify Astra** on pull requests into `production-astra`, prohibit force pushes and deletion, and apply the restrictions to administrators. The workflow runs source validation, lint, TypeScript, unit tests and a preview build without production secrets. Configure required status checks only after GitHub has produced the first successful run. A dedicated release branch prevents unrelated pushes to `main` from replacing a manually published Astra deployment.

`npm run build` runs `scripts/verify-deployment-source.mjs` before Next.js. The guard validates the actual homepage's deliberate `data-site-experience="astra"` marker through rendered local JSX imports, so component renames are supported and a disconnected file or comment cannot certify another homepage. For `CONTEXT=production`, it also requires:

- Site `a9dc6785-ca82-407f-8899-edc4ebf23fd0`; conflicting `SITE_ID` and `NETLIFY_SITE_ID` values are rejected.
- `BRANCH=production-astra`; an attached Git checkout must agree. Detached provider checkouts use the provider's branch identity.
- `NEXT_PUBLIC_SITE_MODE=production`, `NEXT_PUBLIC_SITE_URL=https://driveexotiq.com` and `NEXT_PUBLIC_FORM_MODE=live`.

Automatic Netlify builds must provide a recognized context. Other Netlify contexts retain preview mode. Local builds without a Netlify context, including production-mode QA, validate the Astra source without requiring a deployment identity. There is no skip/bypass environment variable. The guard is an accidental-deployment control; it cannot prevent an administrator deliberately changing the guard or directly publishing other prebuilt artifacts. Branch protection, exact project targeting and the production lock provide the other controls.

### Build, verify and publish

Production is `driveexotiq-newgen` (`a9dc6785-ca82-407f-8899-edc4ebf23fd0`), serving `https://driveexotiq.com`. Keep the published deploy locked while promoting a release. Merge the verified pull request into `production-astra`, then let the Git-connected Netlify build use that branch and its production context. Confirm its site ID, branch, commit SHA, successful build and source marker before using its immutable deploy URL for verification. The lock permits builds while preventing automatic publication.

```sh
npm run test:images -- https://DEPLOY-ID--driveexotiq-newgen.netlify.app
```

During recovery, publish only that verified deployment through Netlify, then run `npm run test:images -- https://driveexotiq.com` and the production analytics checks. The image check is read-only: it loads every sitemap page and requests every emitted image size, including images below the fold; it never submits forms. Once the branch/default alignment, required checks and verified candidate are confirmed, remove the temporary recovery lock. Routine releases then publish automatically only from the protected `production-astra` branch after its pull-request checks pass.

Direct CLI production builds must satisfy the same branch, site and context contract; a local CLI does not necessarily supply the provider's `BRANCH` value. They are not the documented routine release path. Do not disable the guard or upload already-built artifacts to work around a rejected deployment.

Avoid standalone `--no-build` uploads: selecting `.netlify/static` preserves files but can lose adapter-generated routing. The explicit `/_next/image` rewrite in `netlify.toml` also preserves local photo delivery when generated redirects are absent. Local Next.js checks alone cannot verify Netlify routing.

### Recovery and settings changes

For an incident, restore an already verified production deploy with Netlify `restoreSiteDeploy({site_id, deploy_id})`, then pin it with `lockDeploy({deploy_id})`. Both IDs must belong to the production project above. This atomic rollback does not rebuild source and does not require disabling the guard. Keep the restored deploy locked while repairing and verifying the release branch; automatic builds can continue without becoming the published site.

Change only the intended Netlify settings: use a minimal `updateSite` patch with `body.repo.repo_branch`, then read back `build_settings.repo_branch` and the other repository settings. The API can accept `body.build_settings.repo_branch` without changing the production branch; verification of the readback is essential. Change branch-deploy allowlists separately with `body.build_settings.allowed_branches`. Never send a whole site response back as the update body. Environment variables use their dedicated API; `updateEnvVar` replaces all contextual values, whereas `setEnvVarValue` changes one value. Avoid broad `env:import` operations that overwrite production/preview contexts. Preserve PostHog, forms and other existing secrets without printing them.
