# 09 — SHIPPABLE TODO

> State as of 2026-07-06. Site is live + verified on staging
> (driveexotiq-newgen.netlify.app). This is the punch list to ship, plus the
> fully-specified film-reorder build. Nothing here needs AI generation — every
> clip is on disk.

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

## B. Film reorder — approved build (the flagship; do as a focused pass)

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

---

## E. Make-it-shippable checklist (site-wide)

**Content / copy**
- [ ] More Stories posts: writing chat's finished `.md` → `content/blog/` (renders automatically).
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
