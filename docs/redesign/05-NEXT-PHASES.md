# 05 — The Push to Award Level: Phases 3 & 4

> **State as of 2026-07-03 evening.** Phases 0–2 of the living-scenes roadmap are complete: the pipeline exists end-to-end (generate → QA → encode → R2 → registry), and **all 24 beats are living** — 13 video loops, 4 scroll-scrubs, 1 real-footage play-once, 2 reuse beats, the SVG gauge sweep, the SB-07b lamp-breath, the SB-17 odometer, and treatment exit moves on SB-13/14/15. SB-10/SB-11 were re-rendered to authentic McLaren cabin plates (owner note: originals read AI-lame) and their loops regenerated. Media ships from R2 (media.driveexotiq.com, byte-range verified); posters stay on Netlify. Generation spend to date: ~$70 of the ~$300–450 envelope. Everything is uncommitted on `newgen-main` pending owner review.
>
> **The ultimate goal:** an Awwwards SOTD / FWA-caliber scroll film — every beat breathing, one continuous grade, bulletproof on every device tier — submitted, with analytics proving it converts better than the still version.

---

## Phase 3 — Depth, dimension, and the real-asset upgrade

The film moves; now it gains *physical depth* and swaps generation for reality wherever reality exists (§1.5c override map).

1. **2.5D depth-parallax tier — DESCOPED 2026-07-03.** The tier was designed for still-first beats; with all 24 beats now living video, its value collapsed while its cost stayed (transformers/onnx build dep + OGL runtime + iOS shader QA). Revisit only if a still-first beat returns (e.g. real-macro swaps or a stills-led gallery section). The founder frame it targeted is better served today by its real-footage play-once.
2. **Real-asset swaps (§1.5c).** SB-07 icons card → real 458 (`Sam and Gregory (Mobile)-11/-13`), regraded autumn→noir, Kling loop regenerated from it. SB-16 macro alternates from the real detail library (DSC02037 grille / DSC02052 wheel / TF-14 V8T). SB-11's real S8 start-button macro (roller master ~25–27s, 4K) graded as a Movement II detail insert candidate. Evaluate the **water-crossing splash (TF-32…-47)** as the owner-taste new beat.
3. **4K master pass on weak plates.** Nano Banana Pro (direct key, working) re-renders at `resolution:'4K'` for any plate that reads soft under the ken-burns at 1440p+ — candidates: SB-04, SB-07 (if kept generated), SB-14. Regenerate affected loops (cheap, ~$0.90 each). Magnific Precision on the real photos; Topaz on car-dominant plates.
4. **Grade-consistency pass — DONE 2026-07-03.** GRADE-SHEET.jpg (grade-sheet.mjs) reviewed: Acts I–V + finale read as one film; sb-17/sb-18 (real-S8 daylight) were the outliers and received a gentle encode-level noir seat (sat 0.82, warm highlights, soft crush) without touching their documentary truth. Re-run the sheet after any regeneration.
5. **1080p hero-loop upgrade via direct Kling — ROUTE LIVE 2026-07-03.** `generate-videos.mjs --via kling-direct` (kling-v3 pro) delivers true 1920×1080 where OpenRouter caps at 720p; SB-05 upgraded, SB-10/SB-11 in flight. Remaining 720p Kling loops (SB-04/06/07/14/16/17/18) can be re-taken the same way as credits allow — darkest plates benefit least, prioritize lighter/detail-forward ones.

**Exit criteria:** every plate either living video, depth-parallax still, or code motion; founder frame has dimension; §1.5c map fully applied or consciously declined per beat; grade drift ≤ subtle across any adjacent pair; all new media on R2.

## Phase 4 — Hardening, measurement, submission

1. **Device-lab ship-gate matrix** (the hard gates, now on real hardware): iPhone incl. Low Power Mode (poster fallback must engage silently), low-end Android, Firefox scrub (webm twins), Safari desktop, reduced-motion, Save-Data, no-JS crawl of the spine + verbatim AEO anchor.
2. **Perf budgets in CI.** Lighthouse gates: LCP ≤ current still baseline, CLS 0, INP green; total desktop transfer target ≤25MB/full scroll (currently ~45MB worst case — tighten sb-19b/sb-02-scrub encodes or ladder them), mobile ≤10MB (currently ~10MB ✓). `next build` runs in CI only — never against a live dev server (see gotchas memory).
3. **Finale choreography (SB-20) — DONE 2026-07-03** except the optional 10s idle fade: locked-off plate (no ken-burns), vignette settle 0.35→0.5 across the band, CTA row rises a staggered beat after the jewel line, persistent chrome fades out over the final band so SB-20's Gulf CTA is the one accent.
4. **Taste pass with the owner.** Motion contact sheet review of all 24 selected takes (swap any pick in minutes — encode + upload is ~2 commands). Known taste flags: SB-02 interior brightness at full lift, SB-13 formation surge, SB-19b daylight jump (intentional grammar per treatment).
5. **Measurement + submission.** Scroll-depth per act + CTA conversion analytics (rollback trigger per beat: flip its manifest entry back to still). Award capture: 4K screen recording of the full journey, case-study copy, Awwwards + FWA submissions.

**Exit criteria:** all gates green on hardware; budgets enforced; analytics live; submissions filed.

## Deferred from the 2026-07-04 design audit — ALL SHIPPED 2026-07-04 PM (commits 1e8f139/8aebf63)

- **Weighted beat pacing — DONE.** 3-lens adversarial review reshaped the design: weights live in `bands.ts` as TWO tables (scrub-capable: SB-02/08/09 ×2, SB-11 ×1.5, SB-18 ×1.5, SB-19 ×2.5, SB-19b ×2 = 30.5 viewports; coarse pointers: scrubs stay ×1 — their play-once fallback can't fill a band). Fade widths constant in scroll distance; keyboard = band ownership (never nearest-anchor); block heights in CSS media queries; ticks mount-gated (React skips style-attr diffing at hydration).
- **Act ticks / skip-to-the-ask — DONE** (hairline ticks at SB-18 + SB-20, lenis glide).
- **Copy polish — finale dedupe DONE** ("The route is set. The wrap isn't."). The three off-voice lines folded into the 07 footage/copy proposal for the owner pass.
- **JSON-LD — DONE** (WebPage + hero-loop VideoObject).
- **SB-02→SB-03 bloom assist — DONE** (screen-blend swell peaking on the cut).

## Real-footage swap — EXECUTED 2026-07-04 PM (commit e5b3374, owner-approved)

All 7 beats from **07-REAL-FOOTAGE-PROPOSAL.md** went real at $0 gen spend (SB-07 as a still-only beat; SB-14 saved from the cut — its real clip genuinely moves). SB-07b cut (23 beats), ask merged into SB-08b. The 06 words layer landed the same push with 3-lens review amendments (see the annotation block atop 06-COPY-SEO-PLAN.md). Owner taste items still open: S8 appears 3× in Movement I before its SB-18 reveal; SB-08b still plates the McLaren while the real drive beats star the 458; SB-15's wet-dirt FPV positioning.

Encode-tightening data (Phase 4 §2): sb-19-scrub CRF22 = 11M→8.3M (SSIM .993, ready); sb-02-scrub already at its floor; sb-19b must be re-cut from its 4K master. Apply after the footage decision — several of these assets may be replaced anyway.

## Standing constraints (unchanged, non-negotiable)

Poster-first everywhere · crawlable spine + verbatim AEO anchor · one Gulf accent per viewport · banned-word list · no invented specs · commit only when the owner asks · Netlify never serves video.

## Open items for the owner

- **Wrap design:** the IMSA livery is still the sanctioned placeholder — when the real design lands, SB-19's prep frame + takes regenerate (~$10, one command).
- **Water-crossing beat:** in or out (taste call).
- **Audio: DONE 2026-07-04 at $0** — the REAL ignition bark (24-bit location audio off the roller master) ships on SB-11 with a "Hear it start" tap-to-unmute; the film stays silent by default.
