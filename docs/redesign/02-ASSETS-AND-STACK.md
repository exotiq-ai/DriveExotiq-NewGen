# ASSETS-&-STACK.md — driveexotiq.com

> What **you (Gregory)** need to prepare so the build can ship. This is the supply-side companion to BUILD-SPEC.md.
> Every shot, account, and key is tagged **who-provides** and a **gate status**:
>
> - 🔴 **BLOCKER** — the build (or that page) cannot ship correctly without it.
> - 🟡 **NICE-TO-HAVE** — meaningfully better, but launch survives without it.
> - 🟢 **PLACEHOLDER-OK** — I can ship with a graded stand-in / stock / synthetic and swap later with zero rework.
>
> *An Exotiq Inc. brand. Built for the people who actually drive the car.*

---

## 0. The one thing to know first: the single grade

Everything visual is unified by **one color grade (one LUT)**. This is the cohesion contract — not five looks, one film. When you (or a photographer) prep stills/video, target this so I'm not fighting mismatched footage:

| Grade attribute | Target |
|---|---|
| Mood | Cinematic **warm-black**, pre-dawn → dawn. Deep shadows that stay *detailed*, not crushed-flat. |
| Black point | Lift toward `#0B0B0C` (the page bg) so cars float out of the page, not sit on a box. |
| Highlights | Warm, controlled, **never blown**. Quiet-luxury, not Instagram-HDR. |
| The one color | A single cool **gulf-blue (`#6CBDE6`)** accent in-frame where natural (a light, a reflection, sky) — but the *brand* gulf accent is added in code, so don't force it. |
| Grain | I add 5% film grain globally in code. **Shoot clean**; don't bake grain in. |
| What to avoid | Teal-orange overgrade, heavy vignettes baked in, color casts that fight warm-black, gaudy saturation. |

**Deliverable format for all stills:** highest-res RAW/JPEG you have, *plus* a flat/neutral export if possible. I do the final grade in code/Next-Image so every frame matches. If you can only give me one version, give me the **highest-resolution, least-processed** one.

**Two hero plates already in repo** (`docs/concepts/r8.jpg` 2.5MB, `docs/concepts/s8.jpg` 16MB) — these are the R8-dawn and S8-dusk threads. I'll regrade them. They unblock the entire Phase-1 signature scene, so **the wow can ship before you shoot anything new.**

---

## 1. Photography shot list

### Conventions
- **All hero/OG/Event stills: ≥1920px on the long edge** (OG needs 1200×630 crop; Event/JSON-LD image wants ≥1920). When in doubt, shoot bigger.
- Aspect ratios I need are listed per shot. **16:9** = full-bleed scenes; **4:3** = room/card frames; **1:1** = portraits/logos/avatars; **3:2** = editorial/blog. Shoot wide enough that I can crop to several.
- "Count" = distinct usable frames I need, not total clicks.

### 1.1 The two hero cars (the spine — R8 dawn, S8 dusk)

| ID | Subject | Art direction | Ratios | Count | Who | Gate |
|---|---|---|---|---|---|---|
| `ASSET-R8-DAWN` | The R8 silhouette resolving from black, single low light pool | Pre-dawn, car emerging from dark, 3/4 front, one cool rim light | 16:9 + 4:3 | 1 hero (have placeholder) | Gregory | 🟢 (repo plate works; reshoot = 🟡) |
| `ASSET-S8-DUSK` | The 2017 Audi S8 (heritage livery, sleeper) at dusk, the wrappable car | Warm dusk, 3/4 front + profile, "moving billboard" feel | 16:9 + profile 16:9 | 2 | Gregory | 🟢 (repo plate works; clean profile = 🔴 for /sponsor) |
| `SP-WRAP-CANVAS` | S8 **clean side profile, blank/neutral wrap** for the wrap-canvas reveal | Flat, even light, full profile, plenty of body negative space for mock liveries | 16:9 + profile | 1 (both sides ideal) | Gregory | 🔴 for /sponsor (this *is* the sponsor pitch) |

> **Why `SP-WRAP-CANVAS` is a blocker:** the /sponsor signature moment is "your livery on this car." Without a clean, evenly-lit profile of the actual S8 I cannot show the wrap opportunity convincingly. A graded version of the existing `s8.jpg` can placeholder it, but a purpose-shot clean profile is the single most valuable new photo you can give me.

### 1.2 HOME — "The Garage" rooms (one graded frame per room)

| ID | Room / Scene | Subject + art direction | Ratios | Count | Who | Gate |
|---|---|---|---|---|---|---|
| `ASSET-H1-CNC` | SCENE-H1 The Drives | Cars & Coffee dawn frame — cars + people, golden first light | 16:9 + 4:3 | 1 | Gregory | 🟡 (stock/past-event placeholder OK) |
| `ASSET-H2-S8` | SCENE-H2 The Tour | S8 with route line drawing across floor (I draw the line in code) | 16:9 | 1 | Gregory | 🟢 (reuse S8 plate) |
| `ASSET-H3-PEOPLE` | SCENE-H3 Community | Founders/enthusiasts/sponsors at a drive | 16:9 + 4:3 | 1 | Gregory | 🟡 (placeholder OK) |
| `ASSET-H4-KEYS` | SCENE-H4 Marketplace | "Keys out of the glovebox" — single quiet detail shot, dim | 4:3 + 1:1 | 1 | Gregory | 🟢 (easy detail shot or stock) |
| `ASSET-H5-S8-LIT` | SCENE-H5 Sponsor | S8 under full light, the loudest/most finished frame | 16:9 | 1 | Gregory | 🟡 (reuse S8 plate; hero reshoot = best ROI) |

### 1.3 THE TOUR — `/tour` (S8 + the 10 markets)

The /tour Phase-1 signature works with the **two-plate cross-dissolve** (R8 dawn → S8 dusk). Per-city plates make it richer but are explicitly **placeholder-able**.

| ID | Subject | Art direction | Ratios | Count | Who | Gate |
|---|---|---|---|---|---|---|
| `ASSET-TOUR-DAWN` / `-DUSK` | The cross-dissolve pair (S8 pre-dawn idle → S8 dusk) | Sunrise cold-open → dusk finale; same framing so they morph cleanly | 16:9 | 2 | Gregory | 🟢 (repo plates work) |
| `T-CITY-{1..10}` | One plate per market | A signature, *graded-to-match* frame per city (skyline detail, road, or landmark). **Avoid generic stock postcards** — a moody warm-black road-out-of-the-city beats a touristy landmark | 16:9 (≥1920) | 0–10 | Gregory / I source | 🟢 (I can ship with stylized SVG + type only; real plates are pure upside) |
| `ASSET-TOUR-DRIVING` | Optional driving plate (forward POV / windshield) | Forward motion, dawn road | 16:9 | 1 | Gregory | 🟡 (enables nicer windshield push; Phase-3 WebGL wants it) |

**The 10 markets** (confirm node count per Open Decision §10.5): Denver, Dallas/Ft Worth, Austin, Houston, New Orleans, Tampa/St Pete, Orlando, Palm Beach, Ft Lauderdale, Miami.

### 1.4 THE DRIVES + Cars & Coffee — `/drives`

| ID | Subject | Art direction | Ratios | Count | Who | Gate |
|---|---|---|---|---|---|---|
| `DR-HERO` | "Last Sunday, sunrise" rollout | Cars lined at dawn, empty roads, first light | 16:9 (≥1920) | 1–2 | Gregory | 🟡 (placeholder OK, but real = much stronger conversion) |
| `DR-CNC` | The curated Cars & Coffee after-event | People + cars + coffee, warm, candid-but-composed | 4:3 + 16:9 | 2–3 | Gregory | 🟡 |
| `EVT-RECAP-{n}` | Per past-event recap images (backfill) | 3–6 frames per past drive for the events index | 4:3 + 1:1 | 3–6 / event | Gregory | 🟡 (Phase 2; needed to "backfill past events" credibly) |

### 1.5 Community portraits — `/community`

| ID | Subject | Art direction | Ratios | Count | Who | Gate |
|---|---|---|---|---|---|---|
| `CM-PORTRAIT` | Founders, named enthusiasts, sponsors | Consistent **portrait** treatment: warm-black bg, single soft key, same crop. Shoot them all the same session if possible so the grid is cohesive | 1:1 + 4:5 | 4–12 | Gregory | 🟡 (grid can launch with fewer; mismatched lighting hurts more than missing people) |
| `CM-ECO-LOGOS` | Wordmarks: Drive Exotiq, exotiq.rent, exotiq.ai | Vector/SVG preferred for the ecosystem diagram | SVG / 1:1 PNG | 3 | Gregory | 🔴 for /community (diagram needs the three marks) |

### 1.6 Marketplace — `/marketplace`

| ID | Subject | Art direction | Ratios | Count | Who | Gate |
|---|---|---|---|---|---|---|
| `MK-HERO` | "Coming soon" held-breath frame | Single restrained detail (keys, badge, glovebox) on warm-black. Deliberately the quietest image on the site | 4:3 + 16:9 | 1 | Gregory | 🟢 (reuse H4-KEYS or a detail shot) |
| `MK-RENT-WORDMARK` | exotiq.rent wordmark resolving from black | Vector preferred | SVG | 1 | Gregory | 🟡 (can typeset from brand font if no logo yet) |

### 1.7 Sponsor proof — `/sponsor`

| ID | Subject | Art direction | Ratios | Count | Who | Gate |
|---|---|---|---|---|---|---|
| `SP-PROOF-PHOTO` | Past-drive attendance / crowd / cars proof | Real, dated, credible. Show scale (cars + people) | 16:9 + 4:3 | 4–8 | Gregory | 🔴 *if claiming attendance* — proof must back the numbers (see §3 sponsor data) |
| `SP-SPONSOR-LOGOS` | Existing sponsor / partner logos | Mono / SVG, on warm-black | SVG / PNG | as available | Gregory | 🟡 |
| `SP-WRAP-MOCKUP` | S8 with mock livery applied | Optional render showing a wrap in place | 16:9 | 1–2 | Gregory / designer | 🟡 (I can fake a simple overlay on `SP-WRAP-CANVAS`) |

### 1.8 Blog / Stories — `/blog`, `/blog/[slug]`

| ID | Subject | Art direction | Ratios | Count | Who | Gate |
|---|---|---|---|---|---|---|
| `BLOG-FEATURE` | Featured-story masthead image | 16:9, editorial, matches grade | 16:9 (≥1920) | 1 / featured | Gregory / per-post | 🟢 (per-article, reuse tour/drive frames at launch) |
| `BLOG-CARD` | Per-article card / hero | 3:2 editorial | 3:2 | 1 / post | per-post | 🟢 |

---

## 2. Video shot list

> **Reality check:** the repo already has `hero-desktop/mobile.mp4+webm`, `booking-hero-*`, and Telluride clips in `public/videos/`, plus an `optimize-video.sh`. **Video is NOT a launch blocker** — the signature scenes are scroll-scrubbed *stills*, not video. Treat all video below as 🟡/🟢 enrichment. If you give me one good ambient loop, I'll use it; otherwise the graded stills carry the film.

| ID | Use | Length | Resolution / encode | Audio | Poster frame | Mobile encode | Gate |
|---|---|---|---|---|---|---|---|
| `VID-HERO-LOOP` | HOME ambient cold-open backdrop (behind the R8 reveal) | 6–12s seamless loop | 1920×1080 H.264 **mp4 + webm**; target <6MB desktop | **No audio** (muted autoplay) | Yes — 1 still (= the LCP image) | <1MB 720p variant | 🟡 |
| `VID-TOUR-BROLL` | /tour driving b-roll (optional behind windshield beats) | 10–20s segments | 1920×1080, mp4+webm | No | Yes | 720p light | 🟢 (stills cross-dissolve is the default) |
| `VID-DRIVE-CNC` | /drives + /community texture loop | 8–15s | 1920×1080, mp4+webm | No (or optional muted) | Yes | 720p light | 🟢 |
| `VID-SPONSOR-S8` | /sponsor S8 reveal / rotate | 4–8s | 1920×1080, mp4+webm | No | Yes | 720p light | 🟡 (great-to-have for the wrap-canvas rotate) |

**Encoding rules I'll enforce** (you can hand me raw and I optimize, or follow the existing `optimize-video.sh`):
- Always **mp4 (H.264) + webm (VP9)**, muted, `playsinline`, `loop`, `preload="none"` off-hero.
- Every video ships with a **poster still** that is the LCP image (no layout shift, works with reduced-motion which disables autoplay).
- Hard budget: desktop loop <6MB, mobile <1.5MB. Anything heavier I'll re-encode or reject.

---

## 3. Accounts / keys / tech

| Item | What it's for | Who provides | Gate | Notes |
|---|---|---|---|---|
| **Airtable base** (Events) | The AI-agent-updatable events source of truth (build-time fetch + ISR) | **Gregory creates base; I define schema** | 🔴 for /drives + HOME next-drive teaser | Schema: `Event(name, date, city, status[upcoming/past/rsvp-open], rsvp-url, recap, images)`. I can scaffold it via the Airtable MCP if you grant access. |
| **`AIRTABLE_TOKEN`** (+ `AIRTABLE_BASE_ID`) | Read access for the build | **Gregory** (personal access token, read-only scope) | 🔴 (with base above) | Falls back to static if missing, so it won't block a *first* deploy — but /drives is hollow without it. |
| **Netlify build hook** | Lets an Airtable automation / agent trigger a rebuild when events change | **Gregory enables; I wire** | 🟡 | ISR `revalidate` covers most cases; the hook is for instant updates. |
| **Supabase project confirm** | Forms (apply / sponsor / waitlist) → `de_` tables → admin → Resend | **Gregory confirms ownership; already wired** | 🔴 confirm-only | Repo points at project `mlfzduuclgdscdlztzdi`. I need: this is the live project, anon key, service role key, and that `de_` tables exist. **The `.env.local.example` in the repo has a malformed/partial anon key — I need the clean current keys.** |
| **`RESEND_API_KEY`** + verified sender domain | Confirmation + admin notification emails | **Gregory** | 🔴 for forms to email (forms still save to DB without it) | Verify the `driveexotiq.com` domain in Resend for deliverability. |
| **`ADMIN_PASSWORD`** | `/admin` review dashboard | **Gregory** | 🟡 | Set a strong value in Netlify env. |
| **Domain + Netlify access** | Deploy target | **Gregory grants me collaborator/access OR sets env vars himself** | 🔴 to deploy | I can build/PR without it; I need access (or you applying env vars) to actually ship live. |
| **Social handles** (IG / YouTube / TikTok / X) | Footer links + JSON-LD `sameAs` (SEO/AEO authority) | **Gregory** | 🟡 | Give me the exact URLs. `sameAs` materially helps brand search. |
| **Font licensing** | Bricolage Grotesque, Schibsted Grotesk, Spectral | **I confirm — no action needed** | 🟢 RESOLVED | All three are **open-source (OFL)** and self-hosting is permitted. Already in repo. Nothing to buy. |
| **Map provider vs SVG route** | The /tour roadbook rail + /sponsor media-value map | **My recommendation** | 🟢 RESOLVED | **Use a stylized SVG route — no map key, no API cost, on-brand, fully controllable.** A real map (Mapbox/Google) would need a key, add cost, and fight the warm-black grade. Recommendation: **SVG.** |
| **Analytics** | Measure the funnel | **Gregory picks** | 🟡 | Recommend **Plausible** (privacy-friendly, lightweight, no cookie banner, matches quiet-luxury) over GA4. Either works; give me the site ID / measurement ID. |
| **Sponsor deck PDF + real numbers** | The /sponsor media-value map + tiers + proof | **Gregory** | 🔴 for /sponsor credibility | I need *defensible* figures: past-drive attendance, # markets, projected impressions/reach per market, tour dates, asking tiers/price ranges. **Do not let me invent reach numbers** — sponsors will scrutinize them. Placeholder text can ship the layout; real numbers gate the *pitch*. |
| **exotiq.rent / exotiq.ai live URLs** | Links + JSON-LD `subOrganization`/`memberOf` | **Gregory** | 🟡 | Confirm live URLs (or "coming soon" stubs). Needed for the ecosystem diagram links and the Organization schema. |
| **`og-image.png` / favicons** | Social + browser | **Done — in repo** | 🟢 RESOLVED | Already present in `public/`. |

---

## 4. What I (Claude Code) handle vs what I need from you

### I will handle (no input needed)
- All code: components, scenes, the /tour scrub engine, HOME garage rooms, forms wiring, JSON-LD, `llms.txt`/`agents.txt`, sitemap.
- The **single color grade applied in code** so every still/video matches — you give me the highest-res source, I make it cohesive.
- Regrading the two existing hero plates (`r8.jpg`, `s8.jpg`) into the brand look.
- All video optimization (mp4+webm, poster frames, mobile encodes, budgets).
- The **SVG route** for /tour + /sponsor (no map key, no cost).
- Airtable **schema scaffolding** (if you grant MCP/base access) and the build-time fetch + ISR + static fallback.
- Stylized/synthetic placeholders for every 🟢 asset so the site looks finished while you shoot real ones.

### I need from you
- 🔴 **Clean current Supabase keys** (the repo example is malformed) + confirm the live project.
- 🔴 **Resend API key** + verified `driveexotiq.com` sender domain (for form emails).
- 🔴 **Netlify access or you-apply-the-env-vars** (to actually deploy).
- 🔴 **`SP-WRAP-CANVAS`** (clean S8 profile) + **defensible sponsor numbers** (to make /sponsor real, not hollow).
- 🔴 **The three ecosystem wordmarks** (Drive Exotiq, exotiq.rent, exotiq.ai) for /community.
- 🟡 Airtable base + read token (gates a *real* /drives, not the first deploy).
- 🟡 Social handles, analytics choice, exotiq.rent/.ai URLs, community portraits, real event/proof photos.

---

## 5. Minimal set to UNBLOCK a first live build

This is the smallest bundle that gets a **real, impressive site live** — the SOTD-class signature plus working conversion — using existing plates as the wow and deferring the rest:

| # | You give me | Why it's in the minimal set |
|---|---|---|
| 1 | **Clean Supabase keys + project confirm** | Forms (apply funnel) work — the conversion spine. |
| 2 | **Resend API key + verified domain** | Form submissions actually email you/applicants. |
| 3 | **Netlify env-var access (or apply them yourself)** | Lets the site deploy live. |
| 4 | **"Go" to use the two repo hero plates** (`r8.jpg`, `s8.jpg`) | Unblocks the entire /tour + HOME signature wow with zero new shooting. |
| 5 | **The three ecosystem wordmarks** *(or "typeset them for now")* | /community diagram + Organization JSON-LD. |
| 6 | **A "placeholder sponsor numbers OK to ship behind a 'draft' note?" yes/no** | Lets /sponsor layout go live without me inventing reach figures. |

**Everything else** — per-city plates, video loops, community portraits, the Airtable events feed, real proof photos, the clean wrap-canvas profile — can land **after** first deploy with **zero rework**, because I'll build every one of those behind a graded placeholder that swaps 1:1.

**Bottom line:** items 1–3 are the only true hard blockers to *deploying*. Items 4–6 are the only ones needed for the site to look *finished and credible* on day one. Photography and video, beyond the two existing plates, are **upgrades, not gates.**

---

### Resolve-these-now decisions that affect what you prep (from BUILD-SPEC §10)
1. **Gold accent on/off** for launch? (Affects nothing you shoot; one toggle.)
2. **10 nodes or 9** on the route? (Palm Beach + Ft Lauderdale combined or separate — affects per-city plate count.)
3. **HOME room order** — Sponsor last (current) confirmed?
4. **R8→S8 continuity** — OK that dawn-R8 and dusk-S8 read as one car's journey? (Affects whether you ever want a single-car reshoot.)

*Built for the people who actually drive the car. An Exotiq Inc. brand.*