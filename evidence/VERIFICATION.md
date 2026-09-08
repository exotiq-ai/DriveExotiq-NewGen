# Astra release verification

Verified on the isolated `codex/astra-awwwards` worktree, based on production commit `2e0ad94738ae9e441b284b2d462d358d1dd88a0d`.

## Build and behavior

- Production build: passes with Next 15.5.25 and React 18.3.1; includes TypeScript and lint validation. Inherited warnings remain in admin and inactive legacy components; no new lint errors.
- Production dependency audit: zero reported vulnerabilities.
- Preview service suite: 24 passed, covering real request handlers, validation, no persistence/email, disabled admin, crawler headers, scheduled digest suppression, and unchanged behavior when preview mode is absent.
- Built-server HTTP smoke: 20 passed, including valid/invalid public form requests, all admin methods, metadata, static assets and 404 behavior.
- Full browser suite: 84 passed, 3 intentional viewport-specific skips. Desktop/mobile Chrome and mobile WebKit cover all 15 public content/legal routes, image loading, one H1, skip targets, no viewport overflow, form success/failure/validation, preserved interest, no production analytics, menu/focus, keyboard garage selection, reduced motion, Save-Data, failed-video posters, redirects and narrow/tablet/landscape layouts.
- The dedicated video regression starts playback before injecting an error; it verifies restoration of the poster and no stale/revived playback controls.
- Push guard tested: blocks main and newgen-main; permits only the matching Astra branch.

## Performance and visual review

Local Lighthouse 13.4.1 measurements were taken sequentially against the production build with no competing browser test workload. Original and refined runs remain in the parent `evidence/performance` directory. Accessibility and best-practices scored 100 on every measured page; CLS was 0. Mobile LCP remains above the proposed 2.5 second target in this simulated lab; these are not field Core Web Vitals or physical-device results.

The final photo path uses responsive WebP. A fresh 750px desert image request returns HTTP 200 in 285ms and 74KB, versus the 667KB source. Initial AVIF-negotiated HTTP requests stalled, although direct Sharp transforms were healthy; the deeper request/cache cause was not established. Switching negotiation to WebP fixed the reproduced browser failure. The completed regression suite verifies actual image delivery.

Desktop, 390px mobile and 768px tablet screenshots were inspected. Additional 360/430/1024px and short 844×390 landscape layouts passed automated integrity/navigation checks. An earlier blank photo in a full-page capture was rechecked in direct and settled production viewport captures; it renders correctly.

## Limits and deployment record

- Firefox's downloaded runtime fails before opening a page with `Couldn't load XPCOM`, including direct execution outside the sandbox. It remains an optional test project; no Firefox compatibility pass is claimed.
- Physical iPhone/Android devices and field performance data were unavailable.
- Forms are explicitly labeled previews. No real provider end-to-end test or live signup claim is made.
- Preview noindex/nofollow intentionally lowers Lighthouse SEO scores. Next 15 streams the dynamic apply description after the initial head; the description exists in the full response.
- Only verified tour endpoints and captioned archive material are published; unverified stops, dates and mileage are omitted. The marketplace is coming soon.
- This branch targets only Netlify project `f499ad01-b775-4c7d-901f-98f879c83d94` with draft alias `astra-review`. The returned deployment ID/URL and post-deploy smoke results are recorded in the parent BUILD-STATUS.md after publication, without modifying this verified source commit.
