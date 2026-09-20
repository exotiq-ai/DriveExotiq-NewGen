# Production photo delivery repair

Published September 20, 2026 at 16:28:47 UTC to `https://driveexotiq.com`.

## Cause

Production deployment `6aa348612e95e74f2ca255f2` reported **No redirect rules processed** and `plugin_state: none`. Its standalone upload preserved static files but omitted the Next adapter's image-CDN rewrite.

Requests to `/_next/image?url=%2Fmedia%2Fs8-alpine-drive.webp&w=1920&q=75` reached the server function and returned HTTP 400, `The requested resource isn't a valid image.` Both the original `/media/s8-alpine-drive.webp` and the equivalent `/.netlify/images` request returned HTTP 200 with valid WebP content. The same optimizer failure occurred on the direct Netlify hostname, ruling out Cloudflare as the cause.

The read-only image audit reproduced 63 failed image URLs, including responsive variants, across the 15 sitemap pages. Only 17 of 80 URLs passed. The browser also showed the founder photo's broken-image placeholder and zero decoded width for all three optimized homepage photos.

## Repair

- Preserve the exact Next image URL/query rewrite to Netlify Image CDN in source-controlled `netlify.toml`, so local image delivery does not depend solely on generated configuration.
- Build and upload together with Netlify CLI 27.5.2 and the existing production context; retain adapter-generated routing, headers, functions and assets.
- Add `npm run test:images -- URL`, a read-only check of every image URL and responsive candidate emitted by the sitemap pages. Run against a production-mode draft before publishing, then against the live origin.
- Document this release workflow in the README.

The rewrite follows the [Netlify Next adapter's image configuration](https://github.com/netlify/next-runtime/blob/main/src/build/image-cdn.ts). [Netlify Image CDN](https://docs.netlify.com/build/image-cdn/overview/) handles the image transformations.

## Verification

- All 90 existing unit tests passed; TypeScript and production build passed. Lint passed with the three existing admin-page warnings.
- Draft deployment `6ab0093696f1425e16d585e2` processed three redirect rules without errors and passed **80/80 image URLs across 15 pages**.
- Published that exact verified draft using Netlify's restore/publish API; confirmed it is the site's published deployment.
- Repeated the audit at `https://driveexotiq.com`: **80/80 passed**.
- Live desktop browser: previously broken founder, road and Telluride photos decoded successfully; founder photograph visually confirmed; no broken loaded images. Responsive image candidates were checked over HTTP. The attached browser did not apply its phone viewport override, so this is not a phone-layout or physical-device certification.
- No form submissions, lead records or emails were created.

Read-only audit output is retained locally in `output/image-delivery/{before,draft,live}.log`. The previous production deployment remains available in Netlify history.
