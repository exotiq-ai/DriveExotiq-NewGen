# Second-pass verification

This iteration builds on first-release commit `41e3e0a8616170378c2bdbbe8bf9392cfb8fd925` in the independent Astra worktree. Its specification is `ASTRA-V2-PLAN.md`.

## Delivered behavior

- A native-scroll garage presents three camera studies, moving and dissolving the existing opaque car renderings. It is not a real-time 3D model or a generated turntable. Existing tab and keyboard selection remain available.
- The extended pinned sequence activates only on large, sufficiently tall screens with a fine pointer. Smaller screens, reduced motion, Save-Data and failed images receive a compact readable garage. Scroll handlers and animation frames are scoped and cleaned up.
- Five chapter links follow the real document sections. The opening image drifts gently, manifesto typography develops as it enters view, and the road scene opens from an editorial frame. Native scroll and immediate navigation remain available.
- Original Telluride footage appears in the page, and a 39.96-second edited road film loads only after an explicit request. The dialog has native playback controls, a scene description, failure fallback, Escape dismissal and focus restoration. Background films pause while it is open; full-film playback pauses when the document is hidden and releases its source on close.
- Gregory and his own S8 receive a substantial founder chapter. The invitation explains the next steps and pending drive schedule. A compact journal removes repeated images and shortens the approach to the invitation.

## Checks before publication

- Production build passed with Next 15.5.25, including TypeScript and lint validation. Homepage First Load JS: **119 KB**, approximately 3 KB above the first release. Existing warnings remain in admin and inactive legacy components; no new lint errors.
- Full production-browser suite: **113 passed, 7 intentional skips**, across desktop Chrome, mobile Chrome and mobile WebKit; exit 0 in 48.6 seconds, with zero unexpected or flaky results. New cases cover scroll reversal/release, manual selection and focus, compact/error/data/motion paths, film lifecycle and direct chapter navigation.
- Preview service tests: **24 passed**. Local preview HTTP checks: **20 passed**.
- Fresh production dependency audit: **zero vulnerabilities**.
- Final sequential local Lighthouse checks: mobile **96 performance / 100 accessibility / 100 best practices**; desktop **100 / 100 / 100**. Mobile simulated LCP 2.718 s and TBT 13 ms; desktop LCP 0.659 s and TBT 0 ms. CLS was approximately 0.000113 and 0.000020 respectively. These are local lab results, not hosted or field measurements; preview noindex keeps SEO at 69.
- The final performance pass verifies that neither the longer film nor its raw dialog poster is requested during initial navigation. Initial mobile transfer measured 2,010,618 bytes. Two initial low-contrast journal labels were corrected to 5.20:1, and the final accessibility audit passes.
- Independent source review found no remaining blocking issue. Two film-review findings were addressed: pause on hidden document and equivalent visual scene description.
- Desktop, mobile, tablet and short landscape compositions were inspected. Car holds, paired-car footage, founder imagery and the film viewer were reviewed directly; no viewport overflow was found in the executed checks.

Full logs, JSON/HTML browser reports, source/timecode manifests, screenshots and performance results are retained outside the publish directory in `../evidence/v2/` and `../evidence/media/`. The parent `BUILD-STATUS.md` and `../evidence/v2/VERIFICATION.md` contain the complete release record.

## Published release

- Application commit: `ccf50e0bd21e0a1f72229d6e9238b194fb678a9e`, pushed only to `codex/astra-awwwards`.
- Preview: https://astra-review--driveexotiq-astra.netlify.app
- Netlify site: `f499ad01-b775-4c7d-901f-98f879c83d94`; deploy: `6a9f81daa8f14078f5b3b076`. Deployment used the Next.js adapter and the existing preview alias.
- Hosted HTTP checks: **20 passed**, including all four public-form preview contracts and blocked admin methods.
- Hosted browser coverage: **all 113 executed cases passed across the full run and targeted recheck; 7 intentional skips**. This was not a clean uninterrupted full run: the complete run recorded 102 passes and 11 failures; its 11-case recheck passed with exit 0 in 26.1 seconds. Two failures explicitly reported `ERR_NETWORK_CHANGED`; inspected WebKit evidence showed incomplete bootstrap-script downloads. Host versus CDN cause is unproven.
- A separate earlier canceled run revealed a non-polling film assertion reading the source about 3.5 ms before queued dialog cleanup completed. The assertion now waits for source/poster removal, paused playback and restored scrolling. **Nine repeated hosted checks passed**, three per browser profile, exit 0 in 57.8 seconds.
- The final test/evidence update changes only this record, the plan and that timing assertion. It does not change deployed application code or assets. Main, the production domain and Claude's checkout remain untouched.

The full run, targeted recheck, canceled diagnostics and repeated film checks are retained separately under `../evidence/v2/browser/`. `final-summary.json` maps the 11 rechecked cases to the full run and records evidence hashes. No earlier failed or canceled invocation is represented as a clean pass.

## Media and limits

The six selected additions total **6,869,641 bytes**, including the 4,893,173-byte film that is fetched only on request. The full public directory is 20,643,668 bytes; that directory size is not the initial page transfer.

The founder photograph and road films come from the supplied archive. The Ferrari bonnet study derives from an existing AI studio restaging and is used as campaign imagery. Exact source paths, timecodes and delivery hashes remain in the project media records.

One optional Sonilo instrumental score consumed **2.5 existing prepaid Higgsfield credits** with **$0 new cash spend**. It passed technical audio checks, but this runtime cannot audition audio. The candidate and separately scored film are retained outside the website; the published edit remains silent.

Firefox remains unavailable because its downloaded runtime fails before navigation on this Mac. No physical-phone testing, field performance, conversion uplift or award recognition is claimed. Preview forms continue to disclose that nothing is stored or sent; production providers, analytics and admin remain disabled.
