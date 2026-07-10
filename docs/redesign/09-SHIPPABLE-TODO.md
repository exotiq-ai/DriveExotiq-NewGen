# 09 — SHIPPABLE TODO

> State as of 2026-07-09. Site is live + verified on staging
> (driveexotiq-newgen.netlify.app). This is the punch list to ship, plus the
> fully-specified film-reorder build. Nothing here needs AI generation — every
> clip is on disk.
>
> **Copy pass:** the full copywriting + journey audit now lives in
> `10-COPY-AND-JOURNEY-AUDIT.md` — hand that doc to the copywriter; its §7 is
> the prioritized punch list (SB-08 "Choose your car" reframe, the film Menu
> affordance, /tour naming, /apply sponsor-lane fix, etc.).

---

## A. Video review — the drops in `public/videos/` (DONE reviewing)

All four raw drops are now gitignored (`public/videos/*.{mov,mp4,webm}` top-level)
so they can't bloat the repo or break the Netlify deploy, and renamed
`SOURCE-*` for clarity. **Masters stay local; only finished encodes go to R2.**

| File (renamed) | What it is | Verdict | Use |
|---|---|---|---|
| `SOURCE-s8-tortilla-hero-18s.mp4` | Real founder S8 at Tortilla Flats — dirt drive, **water-crossing splash**, canyon-scale wide. 1080p, daytime. | **Keep — new & great** | **/tour hero** (dramatic real S8 in motion). Grade toward dusk for brand cohesion. |
| `SOURCE-s8-tortilla-long-89s.mp4` | Longer cut of the same Tortilla shoot. 720p. | Keep as source | Pull alternate segments if the 18s doesn't have the shot. |
| `SOURCE-telluride-adamkiss-master-156s.mp4` | The Telluride autumn shoot (R8+458, aspen aerials). | **Already mined** | Source for SB-08b/12/13/14/15/16. Don't re-encode. |
| `SOURCE-s8-roller-4k-master-77s.mov` | 4K S8 Telluride roller. Byte-dupe of `refs/video/S8 Roller Video.mov`. | Dupe | Source for SB-11/13/17/19b **and the new S8 drive-away cut**. |

**R2 discipline:** the reorder adds only **3 new encodes** to R2 (coastal-McLaren,
S8 drive-away, tour hero). Everything else already exists.

---

## ✅ DONE (2026-07-06) — film reorder + tour hero shipped

The film reorder (§B) and tour hero (§C) below are **built, adversarially
reviewed, and live on staging** (commits 6fa50d1 + 746eb39). The 26-beat film
groups the McLaren drive-out (…roll out → coastal-McLaren SB-14c) and the S8
storyline (ignition → high country → S8 drive-away SB-13b → wheel), silent
throughout. The review caught + fixed: SB-14c loop→play-once (traveling-shot
rule), two stale EXIT transforms (SB-13 crane / SB-15 whip) retired for their
new neighbours, and SB-13b's aria de-named so the S8 plant survives to SB-18.
The /tour hero is the real S8 in the Tortilla Flats canyon, muted, behind a
legibility scrim. The §B/§C detail below is kept for reference.

Remaining film cleanup (minor, non-blocking): re-encode `sb-11.mp4` without its
(now-unused) audio track; optionally delete the dormant tap-to-unmute code in
CinematicStage; add a clean tap-to-"hear it start" once a clean startup
recording exists.

### Post-reorder owner passes (2026-07-07 → 09) — also DONE
- **SB-13b (S8 drive-away) cut** from the film per the copy audit's pacing rec
  (two silent plant beats → one); encodes remain on disk if it ever returns.
- **SB-08b relocated** after the coastal beat (fleet dream ends on the
  conversion ask before the real-footage act); SB-03 renamed SB-02b.
- **/tour hero: video → still** (owner 2026-07-07) — two videos on one page
  competed; the roadbook windshield is the page's single moving picture and the
  still buys LCP. §C below is superseded.
- Portrait-native mobile encodes for hero beats; touch scrub; QA/E2E pass;
  email v2 (brand-domain confirmations); Plausible events layer + weekly digest.
- Sleeper post build-sheet pass + `mentions:` → BlogPosting JSON-LD brand
  entities (Milltek, KyleTunedIt, Dyno Spectrum, Pirelli, CETE, Audi).
- **2026-07-09 session catch:** an uncommitted WIP had swapped SB-14c's bytes
  from the approved coastal-McLaren aerial to a cockpit-POV canyon run, with
  manifest hashes baked from the WIP file. Restored the coastal bytes, fixed
  the manifest, parked the POV clip at `renders/candidates/pov-canyon-run-5.9s.mp4`
  (owner call — see §D).

## B. Film reorder — approved build (SHIPPED — see above)

Approved order (see frames.ts). Two new beats marked ✦. The reorder re-tunes the
crossfade/grade between each new neighbour pair, so it must be verified on the
full scroll and adversarially reviewed (like the crossfade change).

**New FRAMES order:**
1. Cold open + fleet: SB-01 · 02 · 03 · 04 · 05 McLaren · 06 Porsche · 07 458 · 08 Choose · 08b R8+458 "first keys"
2. McLaren drive-out (grouped): SB-09 doors up · 10 settle in · 11b roll out · **✦ SB-14c coastal McLaren**
3. Real footage → drives: SB-12 road opens · 14 convoy · 14b Cars & Coffee
4. The turn: SB-15 "This could be you."
5. S8 storyline (grouped, silent): SB-11 ignition *(strip unmute)* · 13 high country · **✦ SB-13b S8 drive-away** · 16 wheel
6. Pivot → tour → sponsor: SB-18 · 17 · 19 · 19b · 20

**Steps:**
1. **Coastal-McLaren beat (✦ SB-14c).** Source is already on disk & AI-graded — just encode:
   - Add a beat to `beats-manifest.json` (`id: SB-14c`, treatment `loop`, still `coast-aerial.png`).
   - `node docs/redesign/storyboard/encode-web.mjs --beat SB-14c --in renders/SB-14/SB-14-t1-kling-v3.0-pro.mp4`
     → writes `public/videos/experience/sb-14c.mp4` + `.720.mp4` + poster.
   - Add the `Frame` to `frames.ts` (McLaren block) + wire in `living.ts` LIVING registry (loop tier). Poster `coast-aerial` already exists.
2. **S8 drive-away beat (✦ SB-13b).** Cut a ~6–8s "driving away through the turns" segment from the roller (dusk portion, ~55–70s), keep grade consistent with SB-13:
   - `encode-web.mjs --beat SB-13b --in "public/videos/SOURCE-s8-roller-4k-master-77s.mov" --trim <ss>:<dur> --crf 20` (find the cleanest away-shot with a couple of frame grabs first).
   - Add Frame + living.ts (play-once, hold on last frame — it's directional motion, per the traveling-shot rule).
3. **Strip the ignition unmute.** In `frames.ts` SB-11, remove the `sound: 'Hear it start'` field (current master has the videographer's music baked in; ship silent until a clean startup recording exists — see §D).
4. **Reorder** the `FRAMES` array to the sequence above. Re-check `bands.ts` weights + the per-boundary FADES map for the new neighbours (SB-11b→SB-14c, SB-14c→SB-12, SB-15→SB-11, SB-13→SB-13b, SB-13b→SB-16).
5. `node docs/redesign/storyboard/gen-media-versions.mjs` → regenerate `public/media-versions.json`.
6. `node docs/redesign/storyboard/upload-r2.mjs` → push only the new `sb-14c*`, `sb-13b*` encodes.
7. `next build`, verify the full scroll on staging (DOM opacity probes + zoom captures — full-frame screenshots crush the noir blacks), adversarial multi-lens review, commit, push.

---

## C. Tour hero video

- Source: `public/videos/SOURCE-s8-tortilla-hero-18s.mp4` (the water-crossing + canyon).
- Cut ~8–10s, apply the established grade recipe (`renders/real/` recipe:
  `eq=saturation=0.50:gamma=0.84:brightness=-0.08:contrast=1.06` + colorbalance +
  curves + vignette) for brand cohesion, encode a loop ladder, upload to R2 under
  e.g. `videos/tour-hero.mp4`.
- Wire as a full-bleed muted `<video>` behind the /tour intro with a strong
  `copy-scrim` so the refined intro copy is fully legible. Refine the intro
  headline to tell the story tighter. Silent (owner call).
- Resolve the mileage while in there (see §D).

---

## D. Owner inputs (none block shipping the current site)

- [ ] **Plausible:** create the site in the Plausible dashboard for `driveexotiq.com`
      (+ the newgen domain). Script is already wired (prod-only).
- [ ] **Sponsor reach numbers** per market → currently ships "Inquire" (fine).
- [ ] **Tour mileage:** real one-way total if the tour ends in Miami; else "4,980
      round trip" stays.
- [ ] **Community gallery:** provide event photos to build a /drives gallery, or
      leave deferred (recommended — ships without it).
- [ ] **Clean startup audio** for the optional tap-to-"hear it start" on the S8
      ignition (roadmap; film is silent by default).
- [ ] **sameAs** — YouTube added (`@driveexotiq`); confirm the handle is right.
- [ ] **POV canyon clip** (`renders/candidates/pov-canyon-run-5.9s.mp4`, 5.9s
      windshield-POV dusk run): found as an uncommitted swap over SB-14c. Where
      (if anywhere) do you want it — it can't replace the coastal McLaren beat
      without breaking the approved storyboard + aria.
- [ ] **Two new livery renders** in `public/images/cars/` ("Livery Hanger 1
      tall facing right", "RS6 GT Heritage livery Tortilla flats front 45°"):
      untracked, unwired. Natural homes: /sponsor asset section ("Your livery
      goes here") or the sleeper post hero. Say where and they get wired +
      optimized (PNG → AVIF/WebP; currently 2.4/2.9 MB).

---

## E. Make-it-shippable checklist (site-wide)

**Content / copy**
- [x] ~~More Stories posts~~ — 3 live (`the-car-sleeper-thesis`, `tour-denver`,
      `tour-miami`); more from the writing chat drop straight into `content/blog/`.
- [ ] Work `10-COPY-AND-JOURNEY-AUDIT.md` §7 punch list (blockers: SB-04
      coming-soon weight, SB-08 reframe, film Menu affordance, /tour AEO anchor).
- [ ] Sponsor route map is a v1 — swap for a literal US-map style if the owner's reference differs.

**Perf / hygiene**
- [ ] Confirm the 4.2GB / 356MB masters are OUT of the deploy (they are — untracked + gitignored).
- [ ] Remove dead `booking-hero-*.{mp4,webm}` and possibly `hero-*.{mp4,webm}` from `public/videos/` (booking page is killed; old garage hero is gone) — repo slimming.
- [ ] Lighthouse budgets + a real-device pass (mobile 375px, dark, sunlight legibility).
- [ ] Legacy tailwind palette purge (`tailwind.config.ts` + `globals.css` @apply) — only after admin + `Badge`/`Card` migrate off it.

**Already shipped & verified (for reference)**
- ✅ /apply + /thank-you funnel (film tokens, interest select, hardened email path)
- ✅ /sponsor (real page + form + route map)
- ✅ Atomic home swap (film → /, 301s, header/footer rebuild, dead-code purge)
- ✅ /marketplace (product screenshot in frame + waitlist), /drives (FAQ JSON-LD), /community fold, Stories shell + 3 posts
- ✅ Legal reskin, title sweep, /tour leg-casing + odometer basis
- ✅ Dedicated Supabase project + Netlify env cutover (prod untouched)
- ✅ Analytics (Plausible), YouTube schema

---

*The only thing between here and "ship the marketing site" is §D owner inputs
(none blocking) and §E hygiene. The film reorder (§B) + tour hero (§C) are the
craft polish — fully specified above, no generation needed.*
