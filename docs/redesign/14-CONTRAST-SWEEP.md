# 14 — Contrast sweep (Phase C)

**Date:** 2026-07-20 · **Scope:** every copy-bearing beat in `components/experience/frames.ts` (19 of 24 beats carry copy) · **Question:** does #F3F1EC ink pass WCAG contrast over the brightest frame each beat can put under its copy, through the feathered copy plate?

**Result: 19/19 PASS. No new `brightPlate` flags needed; none added. `frames.ts` untouched.** The one beat that genuinely needs the bright plate — SB-07 — already carries the flag (and the sweep confirms the flag is load-bearing: 4.41:1 without it, 7.90:1 with it).

---

## Verdict table

Ratios are WCAG contrast of #F3F1EC (L = 0.8802) against the zone background composited under the plate **core** (α 0.55 standard / 0.72 bright, #0B0B0C), reported at the zone's **mean** and **p90** luminance of the brightest sample. Gate = p90 ratio ≥ target (4.5 body-tier copy, 3.0 display-only). Raw L = linear WCAG luminance of the unplated zone.

| Beat | Align | Tier (target) | n | Brightest sample | Raw L mean / p90 | Std core mean / p90 | Bright core mean / p90 | Verdict | Flag action |
|---|---|---|---|---|---|---|---|---|---|
| SB-01 | center | body (4.5) | 11 | cold-open-v2.png | 0.005 / 0.012 | 17.3 / 16.5 | 17.4 / 16.9 | PASS | none |
| SB-02 | center | display (3.0) | 11 | sb-02-scrub @75% | 0.046 / 0.149 | 14.6 / 10.7 | 16.0 / 13.5 | PASS | none |
| SB-04 | center | body (4.5) | 11 | sb-04 @35% | 0.087 / 0.233 | 12.9 / 9.0 | 15.0 / 12.2 | PASS | none |
| SB-05 | left | body (4.5) | 11 | sb-05 @65% | 0.042 / 0.095 | 15.0 / 12.2 | 16.2 / 14.4 | PASS | none |
| SB-06 | right | body (4.5) | 11 | porsche-gt3rs.png | 0.007 / 0.006 | 17.3 / 17.1 | 17.4 / 17.2 | PASS | none |
| SB-07 | left | body (4.5) | 1 | icons-458-v2.png | 0.299 / **0.826** | 8.3 / **4.41** | 12.0 / 7.90 | PASS-with-bright-flag-needed | **keep** (already set; load-bearing) |
| SB-08 | center | display (3.0) | 11 | sb-08-scrub @95% | 0.152 / 0.769 | 11.3 / 4.64 | 14.2 / 8.17 | PASS | none |
| SB-09 | right | display (3.0) | 11 | sb-09-scrub @55% | 0.035 / 0.106 | 15.6 / 11.8 | 16.6 / 14.2 | PASS | none |
| SB-10 | center | display (3.0) | 1 | cockpit-door-closed.png | 0.057 / 0.116 | 14.2 / 11.6 | 15.8 / 14.0 | PASS | none |
| SB-08b | left | body (4.5) | 11 | pair-real.jpg | 0.016 / 0.025 | 16.4 / 15.5 | 16.9 / 16.3 | PASS | keep (see finding 2) |
| SB-12 | center | display (3.0) | 11 | sb-12 @95% | 0.095 / 0.192 | 12.4 / 9.7 | 14.6 / 12.8 | PASS | none |
| SB-14 | center | body (4.5) | 11 | sb-14 @55% | 0.086 / 0.307 | 12.9 / 7.89 | 15.0 / 11.4 | PASS | keep (see finding 2) |
| SB-15 | right | display (3.0) | 11 | chase-real.jpg | 0.162 / 0.531 | 10.9 / 5.86 | 13.8 / 9.49 | PASS | none |
| SB-13 | left | body (4.5) | 11 | drive-real.jpg | 0.149 / 0.338 | 10.8 / 7.51 | 13.6 / 11.0 | PASS | none |
| SB-18 | center | body (4.5) | 11 | s8-pivot.jpg | 0.180 / 0.638 | 10.3 / **5.23** | 13.4 / 8.83 | PASS | none (margin note, finding 3) |
| SB-17 | left | body (4.5) | 11 | scurve-real.jpg | 0.043 / 0.098 | 14.6 / 12.1 | 15.9 / 14.3 | PASS | none |
| SB-19 | center | body (4.5) | 13 | sb-19-scrub @65% | 0.118 / 0.407 | 12.0 / 6.84 | 14.5 / 10.5 | PASS | none |
| SB-19b | left | body (4.5) | 11 | gregory-getin.jpg | **0.414** / 0.660 | 6.84 / **5.12** | 10.5 / 8.72 | PASS | none (margin note, finding 3) |
| SB-20 | center | body (4.5) | 11 | cold-open-v2.png (sb-01 loop) | 0.005 / 0.012 | 17.3 / 16.5 | 17.4 / 16.9 | PASS | none |

Wordless beats (no copy, no plate): SB-02b, SB-11b, SB-14c, SB-11, SB-16 — out of scope.

**Flags added: none. Flags removed: none. `frames.ts` unchanged** (no edit → no tsc run required). Current flag set stays SB-07, SB-08b, SB-14.

---

## Method

**Media sampled per beat.** The `frames.ts` still plate always; if `living.ts` has an entry, the desktop encode (`src`) additionally at 10 evenly spaced timestamps (5%, 15%, … 95% of duration — videos change brightness across the band, and pinned copy can sit over any of it). SB-19 also sampled its code-wipe stills (`wrap-dark.webp`, `wrap-photoreal.webp`) since the wipe IS the reveal on coarse pointers. 149 zone samples total. The **brightest sample** = max raw p90 zone luminance across a beat's samples; all ratios in the table are computed on that sample (worst case governs — `copyAt` positions like SB-19's 0.78 are covered by the broad sampling rather than modeled).

**Text zone.** Copy docks at ~25svh (the pin) and the block runs to roughly mid-frame: y 25–55% of frame height. Horizontal band by `align`: left x 8–45%, center 27–73%, right 55–92%. Zone cropped with ffmpeg (`crop` by fraction, decoded to raw RGB24, scaled to 320 px wide), stats in Python.

**Compositing model (browser-accurate).** CSS composites alpha in **gamma-encoded sRGB per channel**: `c_out = c_bg·(1−α) + c_plate·α` with plate #0B0B0C, *then* the result is linearized (IEC 61966-2-1) and WCAG luminance / contrast computed. This is what the browser actually renders — e.g. 50%-alpha black over white paints #808080, whose luminance is 0.216, not the 0.5 a linear-luminance blend predicts. The task brief's shorthand `L_eff = L_bg·(1−α) + L_canvas·α` blends *luminances* linearly, which substantially understates the plate's darkening on bright plates; see the appendix for the cross-check. Reference values: L(#F3F1EC) = 0.8802, L(#0B0B0C) = 0.0034, ink on bare canvas = 17.4:1.

**Statistics.** Per-pixel composited luminance over the zone; mean and p90 (p90 = the level only the brightest 10% of zone pixels exceed — the "bright patch under a glyph" case). The gate is the p90 ratio: body tier (any kicker / chip / body / CTA label present) ≥ 4.5:1, display-only beats (headline/jewel only: SB-02, SB-08, SB-09, SB-10, SB-12, SB-15) ≥ 3:1.

**Not modeled (all conservative or negligible):** the `copy-block` text-shadow (0 1px 16px rgba(0,0,0,0.5)) adds local darkening behind every glyph — pure margin on top of these numbers; ken-burns (1.06–1.16) slightly crops the sampled zone; `GRADE` wash/vignette on the real-footage beats (wash ≤ 0.14 soft-light lifts mids, vignette darkens edges — net small, both directions); portrait-native encodes not sampled (the zone geometry above is the landscape/desktop worst case; portrait plates are recompositions — a mobile sweep would be its own pass).

---

## Findings

1. **SB-07's bright flag is load-bearing.** The 458 restage puts near-white bodywork through the left text zone (raw p90 0.826 — the brightest copy zone in the film). Standard core = 4.41:1, a hair under the 4.5 body target; bright core = 7.90:1. The existing `brightPlate: true` is correct and must stay.
2. **SB-08b and SB-14 pass at the standard plate under their current media** (15.5:1 and 7.9:1 p90 — SB-08b's pair-real plate and loop are near-black in the left zone). Their flags date from the 2026-07-06 zone measurements, before the current plate swaps. Removal was out of this sweep's scope (add-only mandate) and costs nothing to keep — the bright pool only deepens the ground. Owner may retire them at leisure.
3. **Feather-margin note (no action).** Core alpha (0.55) holds through the pool's 30%-radius stop (α 0.50); at the 55%-radius stop it falls to α 0.36 (bright: 0.48). Measured at the tightest beats' brightest samples: SB-18 = 4.51 at α 0.50 / 3.07 at α 0.36; SB-19b = 4.41 at α 0.50 / 2.99 at α 0.36; SB-07 (bright) = 3.54 at α 0.48. So body copy stays ≥ 4.5 through the 30% stop everywhere, and only the outer feather dips toward the 3:1 display floor — territory the shrink-wrapped block's padding keeps text out of, with the text-shadow as unmodeled margin. **If a future layout pushes small text toward the pool edge**, the measured fix is to lift the 55% stop: 0.36 → 0.50 raises the worst beat (SB-19b) from 2.99 → 4.41; 0.36 → 0.55 gives 5.12. Same shape, one stop deeper — do not touch the core or the 85%+ tail (the edgeless feather doctrine).

No beat fails even at the standard plate core, so no plate-curve change is required now.

---

## Appendix — linear-luminance cross-check

For the record, the shorthand model `L_eff = L_raw_p90·(1−α) + 0.0034·α` (blending luminances instead of gamma channels) would report: SB-07 2.19 std / 3.28 bright, SB-18 2.75 / 4.03, SB-19b 2.68 / 3.94, SB-08 2.34 / 3.47, SB-19 3.97 / 5.63 — i.e. three "FAILs" and two new flags. Those numbers do not describe anything the browser paints: CSS alpha compositing is per-channel on gamma-encoded sRGB (the #808080 test above), which the canonical table reflects. Recorded so a future sweep doesn't re-litigate the model choice.

## Reproduction

`python3 contrast_sweep.py` (session scratchpad; ffmpeg/ffprobe + stdlib only) → `contrast_results.json`. Beat→media map is inlined in the script from `frames.ts` + `living.ts` as of `newgen-main` @ 928684b.
