# Drive Exotiq

Next.js website for driving invitations, road stories and the upcoming rental marketplace. This checkout currently runs as an isolated preview: forms validate input but do not save records or send messages.

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

The existing branch, remote site name and review URL retain their historical identifier so cleanup does not disconnect the deployment. `netlify.toml` sets preview mode. Old `/astra/...` media URLs redirect to `/media/...`.

The preview project is `driveexotiq-astra`, site ID `f499ad01-b775-4c7d-901f-98f879c83d94`; its review alias is `astra-review`. Deployment is a separate operation from local verification. Do not promote this preview configuration to the production site unchanged.
