# Supporting editorial pages

Implemented in `/Users/g.r./Documents/EXOTIQ/DriveExotiq-Astra/website` on `codex/astra-awwwards`.

## Owned files

- `app/astra-pages.css`: scoped `ed-*` editorial layout system, charcoal/ivory contrast, large display type, serif accents, responsive layouts at 680px/1000px, focus-visible treatment, 44px+ links and controls, reduced-motion overrides.
- `app/drives/page.tsx`: actual alpine photograph, first-light invitation, next date pending, proposed last-Sunday cadence, paper invitation steps, lakeside editorial section, accessible native FAQ disclosures with matching structured data.
- `app/tour/page.tsx`: completed Denver-to-Miami journey, endpoint typography, real archive photographs and accurate captions, roadbook and city-guide links. Removed old generated tour hero, unsupported stop timeline, odometer, wrap solicitation and future itinerary.
- `app/marketplace/page.tsx`: split photographic coming-soon introduction; clearly states booking is unavailable and pictured cars are not confirmed inventory; existing WaitlistForm and force-dynamic preserved.
- `app/sponsor/page.tsx`: brand partnerships, no completed-tour inventory offer, three editorial avenues and retained SponsorInquiryForm / normalizeSponsorTier / force-dynamic contract.
- `app/blog/page.tsx`: existing posts, featured sleeper article and ordered city-story rows.
- `app/blog/[slug]/page.tsx`: existing loader, static params, not-found handling, Open Graph/Twitter and BlogPosting metadata preserved; large headline, accurately captioned archive image, warm-paper reading area, ReadingRail and return links.
- `content/blog/the-car-sleeper-thesis.md`, `tour-denver.md`, `tour-miami.md`: limited corrections described below.

## Content corrections

- Sleeper article: removed “wrap is still open,” ten-market/five-thousand-mile claims and prospective livery pitch. Replaced with confirmed completed-trip context and roadbook link. Preserved the substantive car essay and named build details.
- Denver: changed title to “Denver: where the road begins.” Removed specific external event schedules, prospective southbound-tour statement, and obsolete four-tier wrap sales ending. Preserved city/road discussion; closing now points to pending next-drive details and brand introductions.
- Miami: changed title to “Miami: a different kind of arrival.” Removed exact trip-mileage statement, current event dates/frequency and attendance claims, summer-to-fall schedule, and wrap sales ending. Preserved automotive-cultural discussion. Did not invent actual event attendance or completed intermediate stops.

## Asset evidence

Viewed the actual files with view_image before use: `s8-alpine-drive.webp`, `s8-desert-vista.webp`, `r8-ferrari-telluride.webp`, `ferrari-r8-lakeside.webp`, and `r8-rain-detail.webp`. Provenance inspected in `../assets/manifest.json`. All represent real supplied photography/footage, not generated visual content. Root will copy these to `public/astra/` and import `app/astra-pages.css`.

The Miami article's R8 detail caption specifically identifies Telluride, avoiding presentation as Miami trip evidence. Tour images are called driving archive imagery rather than a chronological trip record.

## Validation

- `npx tsc --noEmit` — exit 0.
- `npx next lint --file app/drives/page.tsx --file app/tour/page.tsx --file app/marketplace/page.tsx --file app/sponsor/page.tsx --file app/blog/page.tsx --file 'app/blog/[slug]/page.tsx'` — no ESLint warnings or errors.
- Scoped text search for obsolete wrap-opening, canvas-opening, 5,000/five-thousand-mile, ten-market, and summer-to-fall claims — none in implemented pages/articles.
- No build, commits, deployment, package modifications, or agent delegation performed. Root owns integrated browser verification and form notice behavior.

## Integration checks still with root

Import `./astra-pages.css` in layout, copy real image assets into `/astra/`, and visually check all six routes at 390/768/1440 after common Header/Footer and global styles land. Forms are deliberately mounted against existing components so the root's preview guard notices appear unchanged. Shared controls should continue to use light foreground on the dark form sections.

## Integrated browser QA — 2026-09-07

Used the Playwright CLI in isolated `editorial` session against `http://127.0.0.1:4317`, after root imported the editorial stylesheet and copied assets. Updated all six route-template `<main>` IDs to `main-content`, matching the shared skip link.

Desktop (1440 × 1000) and mobile (390 × 1000) checks passed for all eight paths: `/drives`, `/tour`, `/marketplace`, `/sponsor`, `/blog`, and all three real articles. Each returned HTTP 200, rendered exactly one H1 and the correct skip target, and had no broken fragment anchors. A second pass scrolled real image elements into view and decoded them before screenshot capture: every image loaded, and no visible content/control element exceeded viewport bounds. Full document scroll width matched viewport width on all 16 route/width combinations.

Every unique internal link found in supporting-page main content returned HTTP 200: `/apply?interest=drives`, `/blog`, all three article paths, `/tour`, `/`, and `/sponsor`. This was read-only GET verification; forms were not submitted.

Visually inspected full-page desktop/mobile screenshots for all six templates, including paper article body layout, type wrapping, image crops, mobile form stacking, FAQ layout, and CTA spacing. No page-specific visual repairs were required beyond the skip-target correction. Early full-page captures occurred before below-fold lazy images entered the viewport; final screenshots were recaptured after scrolling. Journal hero also has a separate viewport-detail screenshot showing its fully rendered image.

Evidence:

- `output/playwright/editorial-audit.json` — machine-readable 16-layout image/overflow results and internal link statuses.
- `output/playwright/editorial-audit.log` — CLI audit output.
- `output/playwright/editorial-{route}-1440.png` and `editorial-{route}-390.png` — full-page screenshots; article slashes replaced by hyphens.
- `output/playwright/editorial-blog-hero-detail.png` — journal hero viewport detail.

No browser console errors occurred during route QA. Development warnings included the homepage image parent position during initial root styling and an LCP heuristic warning for the normally below-fold lakeside image after test scrolling; neither indicated a missing or broken asset. Header, footer and form components remained root-owned.

## Next 15 route-prop compatibility

Converted only the three framework route-prop consumers found under `app/`:

- `app/apply/page.tsx`: async page, Promise-typed `searchParams`, awaited `query`; preserves default drives interest, normalized value, title-wrap redirect, current visual design and ApplicationForm.
- `app/sponsor/page.tsx`: async page, Promise-typed `searchParams`, awaited `query`; preserves normalized sponsor tier and current form/layout.
- `app/blog/[slug]/page.tsx`: async page and async `generateMetadata`, Promise-typed `params`, awaits slug before lookup; metadata now returns `Promise<Metadata>`. Static params generation and article rendering remain the same.

Repo search found no other framework route-prop consumers. The `searchParams` local in `app/api/admin/instagram/route.ts` comes from `new URL(request.url)` and remains synchronous by design.

`npx tsc --noEmit` passed after these changes. Installed Next was still 14.2.33 at that check; root/dependency owner will perform Next 15 installation and final generated-route-type/build validation. No dependency files or build output were changed by this task.
