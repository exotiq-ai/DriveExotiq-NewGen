# BUILD-SPEC.md — driveexotiq.com

> The definitive experience specification for the driveexotiq.com redesign.
> This is the document everything else references. Copy docs, asset lists, and component tickets all plug into the slots marked `⟦FILL⟧` and the IDs defined here.
>
> Drive Exotiq is an **Exotiq Inc. brand** — the community/culture **front door** to **exotiq.rent** (exotic-car rental marketplace, *coming soon*).
> Tagline: **"Built for the people who actually drive the car."**

---

## 0. How to read this document

- **`⟦FILL: …⟧`** = a copy or asset slot. The next two docs (COPY.md, ASSETS.md) enumerate these by their IDs.
- **`SCENE-XX`** = a named scroll scene on a page. Use these IDs in tickets and copy.
- **`CMP-XX`** = a reusable component in the inventory (§6).
- Token names (`gulf`, `ink-2`, `line`, `--de-bg`) are the **live** CSS vars / Tailwind classes already in the repo (`app/globals.css`, `tailwind.config.ts`). **Never re-declare hex** — use the class.
- "Already done" items are marked **[built]**. Everything else is to-build.

---

## 1. North Star

**One-line experience promise:**
> *Scroll the car out of the dark and down the road — and you understand the whole world of Drive Exotiq in one continuous, cinematic gesture.*

**North star.** driveexotiq.com is not a set of pages; it is **one cinematic drive** that begins in a private garage (HOME) and runs down a 5,000-mile road (THE TOUR), passing through the community, the sponsorship, and the marketplace as rooms and waypoints along the way. The site must feel like a film with chapters, unified by a single light, a single typographic voice, and a single telemetry instrument — never five different looks.

**Audience priority (every decision serves this order):**
1. **SPONSORS** — the #1 conversion audience. The wrap/tour/drive pitch must be tangible and reachable from anywhere.
2. **Enthusiasts / founders** — the community core; the people who actually drive.
3. **Cold QR-code walk-ups** — must understand the site in *three seconds* without instruction.

**The business jobs the experience must do, in order:**
- Make a sponsor feel the wrap opportunity (one car, ten markets, 5,000 miles) and inquire.
- Make an enthusiast want on the invite list for the monthly sunrise drives.
- Tee up the exotiq.rent waitlist without overselling a product that's still coming.
- Win design recognition (SOTD-class) so the brand reads as quiet-luxury and serious.

---

## 2. The Cohesive Design Language

### 2.1 Tokens (LOCKED — already live as CSS vars) [built]

| Role | Token / class | Value (dark default) |
|---|---|---|
| Page bg | `canvas` / `--de-bg` | `#0B0B0C` |
| BG step | `canvas-2` / `--de-bg-2` | `#101012` |
| Surface | `surface` / `--de-surface` | `#161618` |
| Surface raised | `surface-2` / `--de-surface-2` | `#1F1F23` |
| Hairline | `line` / `--de-line` | `#28282C` |
| Hairline strong | `line-2` / `--de-line-2` | `#3A3A40` |
| Text primary | `ink` | `#F3F1EC` |
| Text secondary | `ink-2` | `#ABA8A1` |
| Text tertiary | `ink-3` | `#6F6D67` |
| Metal | `metal` | `#C9C6BD` |
| **GULF BLUE (THE action/live color)** | `gulf` | `#6CBDE6` |
| Gulf hover | `gulf-2` | `#8ED0F0` |
| On-gulf (text on fill) | `on-gulf` | `#08222E` |
| Gold (jewelry accent, optional) | `gold` / `jewel` when `[data-variant="gold"]` | `#C8A24E` |
| Papaya (errors/flags ONLY) | `papaya` | `#FF5A1F` |

- A **light theme** exists via `[data-theme="light"]`; a **gold jewelry variant** via `[data-variant="gold"]` (flips the `jewel` slot metal→gold). Gulf stays the action color in **all** variants.
- The `jewel` token is the "precious accent" slot — metal by default. Gregory's gold fondness lives here, toggleable, without ever stealing gulf's action job. **Open decision in §10.**

### 2.2 Type (LOCKED — self-hosted, wired) [built]

- **Bricolage Grotesque** (`font-display`) — display headlines, odometer, city names, big numerals.
- **Spectral** 400/500 + italics (`font-serif`) — the **serif voice**: italic roadbook lines, index numerals (`.idx` "01/02"), pull-quotes, the emotional register.
- **Schibsted Grotesk** (`font-sans`) — all UI, body, labels, telemetry readouts.
- Type scale classes live in `globals.css` (`.text-hero` … `.text-caption`). **Reuse them.**

### 2.3 The Non-Negotiable Rules (obey exactly)

1. **2px corners.** No pills, ever (`borderRadius.DEFAULT = 2px`).
2. **Hairline depth, NEVER glow.** Depth = 1px lines + surface steps, not shadows or blooms. The legacy `hover:shadow-gulf-blue/30` glow classes in `globals.css` are **deprecated — do not use on new work** (§8 ship gate flags them for removal).
3. **One accent moment per screen.** Exactly one gulf element earns attention per viewport. Centurion restraint.
4. **No uppercase kicker labels.** Kickers are sentence-case or the Spectral italic `.idx` numeral. (Legacy `.text-caption` uppercase utility is **not** for new kickers.)
5. **Generous space.** `py-section` rhythm (clamp 4.5rem→9rem). Air is luxury.
6. **Motion is transform/opacity only.** One global lerp, smoothstep easing, 60fps target. Never animate layout/color in scroll loops.

### 2.4 HOW the five concepts unify into ONE system

The concept panel (`docs/concepts/`) ranked **journey (92)** as primary, then folded the others in. The redesign treats them not as five looks but as **five layers of one language**:

| Concept | Its job in the unified system | Where it lives |
|---|---|---|
| **GARAGE** | **Spatial architecture for HOME.** Scroll moves you *through* a dark private collection; each "room" is a pillar that previews itself and routes to its page. This is the **navigation model.** | `/` (HOME) |
| **JOURNEY** | **The spine.** Scroll = miles; the page *is* the Denver→Miami drive. The signature long-scroll. | `/tour` |
| **SUNRISE** | **The mood/light layer everywhere.** Cinematic pre-dawn→dawn grade, low radial gulf "breath," 5% film grain. Every scene shares this light. Also the *cold-open* of both HOME and `/tour`. | Global atmosphere |
| **KINETIC** | **Type discipline everywhere.** Mask-up reveals, scroll-scrubbed Bricolage + Spectral italic, print-object rigor on every headline and city name. | Global type behavior |
| **MACHINE** | **The telemetry module** (`CMP-TEL`) wherever a car stars — gauges, leg miles, HP/sound stat, odometer. Gearhead credibility inside any scene. | Reusable module |

**The cohesion thesis:** HOME's rooms and `/tour`'s miles are the **same camera** moving through the **same light** (Sunrise), reading the **same type** (Kinetic), past the **same instrument** (Machine telemetry), toward the **same one accent color** (Gulf). A user can't tell where the "homepage style" ends and the "tour style" begins — because there is only one style.

### 2.5 The cohesion enforcement rules (the glue)

- **One light.** Every full-bleed scene uses the Sunrise grade: deep `canvas` base, a single low radial gulf-soft glow that "breathes" (opacity 0.04→0.10), 5% SVG grain overlay (`aria-hidden`). No scene invents its own background treatment.
- **One instrument.** Any car-led scene shows the telemetry module (`CMP-TEL`) in the same corner, same Schibsted readout style, same tabular-nums. Odometer style is identical on HOME's arrival and `/tour`.
- **One accent law.** Gulf appears exactly once per viewport as the live/action element. Passed/active states flip hairline→gulf. Nothing else is gulf.
- **One reveal grammar.** All entrances are the Kinetic mask-up or the `Reveal` fade-up (§3.4). No bespoke animations per page.
- **One car continuity.** The R8 (dawn) → S8 (dusk) is the visual thread: the R8 appears at HOME arrival and `/tour` cold-open; the S8 (the actual wrappable tour car) is the payoff at `/tour` finale and the `/sponsor` hero.

---

## 3. Global Interaction Grammar

### 3.1 Smooth scroll (Lenis) [dep installed]

- A **client `<SmoothScrollProvider>`** wraps page content (mounted in a client layout segment; **root `app/layout.tsx` stays a Server Component**). Lenis `@1.3` drives one rAF loop.
- Lenis exposes a single shared **scroll-progress value per scene**; all scrubbed animation reads from it. No competing scroll listeners.
- **Lerp factor 0.12** globally for the weighted, cinematic feel. Smoothstep `t*t*(3-2t)` on every scrubbed transform.

### 3.2 The "rooms" navigation model (the core mental model)

- **HOME is the navigator.** Scrolling HOME = walking through rooms; each room *is* a pillar and routes to that pillar's full page (§4). This replaces a conventional hero+nav-menu model as the primary wayfinding.
- A **persistent thin header** (`CMP-HDR`) still exists for direct access: wordmark left; on the right a quiet text nav — *The Drives · The Tour · Community · Marketplace · Stories* — plus the single gulf action **"Get on the list."** The header is hairline-bordered, translucent over `canvas`, and the only persistent gulf moment.
- **Room → page contract:** each room on HOME previews a pillar and ends in a routing affordance ("Enter →") that links to the full pillar page. The full page opens on its own signature moment, not a generic hero — so entering a room feels like *continuing the same drive*, not loading a new site.

### 3.3 Scene / section transitions

- **Scenes** are full-viewport units that pin and scrub (HOME rooms, `/tour` beats). Between scenes, the camera **cross-dissolves** (opacity) or the new scene **rises from below** — never a hard cut, never a slide carousel.
- Pinned scenes use scroll distance as time: content fades up from below → holds center → continues upward (the Kinetic mask discipline), so words and cars travel past each other.
- **Section** (non-pinned editorial blocks, e.g. blog, sponsor tiers) use the `Section` primitive [built] for `py-section` rhythm and the 1180px container.

### 3.4 The reveal system [built — `Reveal.tsx`]

- `Reveal` (IntersectionObserver client island): starts `opacity:0 / translateY(20–24px)`, settles **once** at ~15% into viewport. `delay` prop staggers child sequences (60–90ms increments).
- The base `.reveal` / `.is-visible` CSS is in `globals.css`. **Use this for all editorial entrances.** Scrubbed scenes use the Lenis progress value instead.

### 3.5 Scroll progress

- **Global:** a 1px gulf progress hairline can ride the top edge (subtle; counts as the header's accent moment, not an extra one).
- **`/tour` specific:** a persistent **leg/odometer meter** (gulf) tells the user the long scroll is intentional — "LEG 04 / 10 · 1,920 mi." Build it in from day one.

### 3.6 Custom cursor

- **Minimal, optional.** A small `metal` dot that grows to a hairline ring over interactive elements; on car scenes it can show a tiny "drive →" affordance. **Desktop + fine-pointer only**, disabled on touch and under reduced-motion. **Open decision in §10** (ship without it in Phase 1; it is jewelry, not function).

### 3.7 Reduced motion + accessibility

- `prefers-reduced-motion: reduce` is **already wired** in `globals.css` (collapses animation/transition durations, snaps reveals to a 200ms opacity fade).
- Under reduced motion: **snap Lenis lerp to 1** (clean instant scrub, no easing drift), **disable pinning** where possible (content stacks normally), **no parallax, no cursor.** **Never gate content** — all copy/headings remain in the DOM.
- Focus: global `*:focus-visible` gulf outline [built]; all interactive scenes must be keyboard-reachable and skippable (skip-to-content link; pinned scenes do not trap focus).
- Decorative SVG/grain/glow layers are `aria-hidden`.

### 3.8 How cohesion is enforced across pages (the contract)

1. Every page imports the **same** `SmoothScrollProvider`, token CSS, type, header, footer.
2. Every car-led scene uses `CMP-TEL`. Every editorial entrance uses `Reveal`. Every full-bleed scene uses the Sunrise atmosphere layer (`CMP-ATM`).
3. **One accent per viewport** is reviewed on every PR (ship gate §8).
4. No page is `'use client'` at the page level — motion is always a client island over server-rendered semantic HTML (crawlability contract §7).

---

## 4. THE HOME — "The Garage"

**Primary job:** orient all three audiences in three seconds, wow them, and route each to the right pillar. HOME both *wows* (a private-collection film) and *functions as the site's navigation* (rooms = pages).

**Experience:** scroll descends through a dark private collection. A low light pool tracks down with you; each room ignites as you arrive, previews one pillar, and offers entry. The R8 sits in the first pool of light; the camera releases it onto the road as you leave.

**Signature moment:** the **arrival** — pure dark, a single car silhouette resolving out of black as the light pool blooms, the wordmark and promise masking up over it. (Sunrise cold-open + Garage spatial light.)

### Scene-by-scene

**SCENE-H0 — Arrival (the cold-open).**
- Full black → low radial gulf "breath" blooms → the **R8 silhouette** resolves under a single light pool (R8 dawn still `docs/concepts/r8.jpg`, graded).
- Type masks up: wordmark **Drive Exotiq**, then the promise line.
- One gulf affordance: a quiet scroll cue ("⟦FILL: H0-CUE⟧", e.g. "Walk the garage ↓").
- Copy slots: `⟦FILL: H0-WORDMARK-LOCKUP⟧`, `⟦FILL: H0-PROMISE⟧` (the tagline or a sharper variant), `⟦FILL: H0-SUB⟧` (one line: "An Exotiq Inc. brand. The front door to exotiq.rent.").
- Telemetry: a faint odometer reading `000000` waiting (`CMP-TEL`, idle state).

**SCENE-H1 — Room: THE DRIVES (community core, first because it's the heart).**
- The room lights on a Cars-&-Coffee dawn frame. Preview: invite-only **monthly sunrise drives**, last Sunday morning, followed by curated Cars & Coffee.
- The one line: `⟦FILL: H1-LINE⟧` (e.g. "Last Sunday of the month. Before the city wakes.").
- Mini-proof: next-drive teaser pulled from the Airtable events feed (date + city, gulf "live" dot if RSVP open). Falls back to static if feed empty.
- Routes to **/drives** via "Enter the drives →".

**SCENE-H2 — Room: THE TOUR.**
- The room reveals the **S8** (the wrappable car) and a hint of the route line drawing across the floor.
- The one line: `⟦FILL: H2-LINE⟧` (e.g. "One car. Denver to Miami. Ten markets. 5,000 miles.").
- Telemetry teaser: odometer ticks toward 4,980; a 3-node mini route-rail.
- Routes to **/tour** via "Ride the tour →" — entering continues directly into `/tour`'s cold-open (camera continuity).

**SCENE-H3 — Room: THE COMMUNITY (the people + ecosystem).**
- Faces, founders, sponsors at a drive. The room frames Drive Exotiq inside the Exotiq ecosystem.
- The one line: `⟦FILL: H3-LINE⟧` (e.g. "Built for the people who actually drive the car.").
- A whisper of the ecosystem diagram (Drive Exotiq → exotiq.rent → exotiq.ai).
- Routes to **/community**.

**SCENE-H4 — Room: THE MARKETPLACE (exotiq.rent teaser).**
- Dim, "coming soon." A single keys-out-of-the-glovebox image. Deliberately the quietest room (it's a teaser, not a product).
- The one line: `⟦FILL: H4-LINE⟧` (e.g. "The keys are coming out of the glovebox.").
- Routes to **/marketplace** via "Join the waitlist →".

**SCENE-H5 — Room: THE SPONSOR (placed last as the conversion crescendo).**
- The S8 returns under full light; the route line resolves into ten gulf nodes. This is the loudest, most finished room — the #1 audience gets the strongest moment.
- The one line: `⟦FILL: H5-LINE⟧` (e.g. "Your livery on this car. Down this line. Through ten cities.").
- Routes to **/sponsor** via the page's primary gulf CTA "See the wrap opportunity →".

**SCENE-H6 — The close / CTA.**
- The light pool widens to the garage door opening; the R8 releases onto the road (visual hand-off to the journey).
- **One** gulf CTA: **"Get on the list"** → the apply funnel (§5.8). Secondary ghost link to Stories.
- Footer follows (`CMP-FTR`).
- Copy: `⟦FILL: H6-CLOSER⟧`, `⟦FILL: H6-CTA-LABEL⟧`.

**JSON-LD (HOME):** `Organization` (Drive Exotiq, `memberOf` → exotiq.ai, `subOrganization` → exotiq.rent) + `WebSite` (+ `SearchAction` if search ships) + `BreadcrumbList`.

---

## 5. The Pillar Pages

Each pillar opens on its own **signature moment** (not a generic hero) so entering a HOME room feels continuous.

### 5.1 `/tour` — THE JOURNEY (the showpiece)

**Primary job:** make the wrap opportunity *tangible* (sponsor #1) while thrilling enthusiasts and being legible to a cold walk-up.
**Experience:** scroll = miles. The page **is** the Denver→Miami drive. Odometer climbs, the roadbook route draws, the car pushes forward, sky drifts dawn→dusk, ten cities arrive as gulf nodes, ending on "Sponsor the wrap."
**Signature moment:** the pinned **windshield stage** — forward image push + cross-dissolve, SVG roadbook rail with a `getPointAtLength` car dot, ten nodes flipping hairline→gulf as passed, odometer 000000→4,980, subtle RGB-interpolated sky drift, low gulf glow breath, 5% grain.

**Scenes / sections (all server-rendered as real `<section>` with `<h2>` city names + leg copy; a client `<RoadbookStage>` only animates what's already in the DOM):**
- **SCENE-T0 — Pre-dawn idle (first ~8%, Sunrise cold-open):** the S8 idling in the dark; first light breaks as Denver arrives.
- **SCENE-T1…T10 — Ten city beats** (Denver, Dallas/Ft Worth, Austin, Houston, New Orleans, Tampa/St Pete, Orlando, Palm Beach, Ft Lauderdale, Miami). Each beat: city name masks up, leg copy holds center, telemetry payload (`CMP-TEL`: leg miles, cumulative odometer, one S8 stat). Copy slots `⟦FILL: T-CITY-{n}-NAME / -DEK / -LEG-MI / -NOTE⟧`.
- **SCENE-T-FINALE — Miami / the wrap (last ~10%):** S8 at dusk, full route lit gold-of-arrival, **one gulf CTA "Sponsor the wrap"** → `/sponsor`. Secondary: "Get on the list."
- **Persistent:** leg/odometer meter (§3.5).
- **`/tour/[city]`** (Phase 2): crawlable, deep-linkable per-city pages with the machine telemetry detail; add the ten paths to `app/sitemap.ts` (already anticipated in its comment).

**Primary CTA:** "Sponsor the wrap" (→ /sponsor). **JSON-LD:** `Event` / `EventSeries` for the tour, `ItemList` of the ten city legs, `BreadcrumbList`.

### 5.2 `/drives` — THE DRIVES (community core)

**Primary job:** convert enthusiasts onto the **invite list** and surface the events calendar; keep + backfill past events.
**Experience:** a sunrise field — the page opens at dawn on a Cars & Coffee, then becomes the living calendar of monthly drives.
**Signature moment:** the **"last Sunday, sunrise"** beat — a clock/odometer of dawn, the next drive resolving as a live gulf node on a monthly cadence rail.

**Sections:**
- Signature dawn hero — what a drive *is*: invite-only, last Sunday morning, sunrise rollout → curated Cars & Coffee. `⟦FILL: DR-HERO-*⟧`.
- **Next drive** card (live gulf "RSVP open" state if Airtable says so) — `CMP-EVT`.
- **Events index** — upcoming + past (backfilled), filterable by city. Each is a crawlable `Event` card. `CMP-EVT-LIST`.
- **How an invite works** — the path from "get on the list" to a confirmed seat. `⟦FILL: DR-INVITE-*⟧`.
- **Cars & Coffee** — the curated after-event. `⟦FILL: DR-CNC-*⟧`.
- Close: **RSVP / request invite** → apply funnel (§5.8) carrying drive context.

**Primary CTA:** "Request your invite." **JSON-LD:** `EventSeries` (the monthly drive) + per-event `Event` (with `location`, `startDate`, `eventStatus`), `FAQPage` for the invite Q&A.

### 5.3 `/community` — THE COMMUNITY

**Primary job:** tell the people-and-story; situate Drive Exotiq in the Exotiq ecosystem; warm everyone toward the list.
**Experience:** portraits and dawn-field warmth; the brand's "why."
**Signature moment:** the **ecosystem diagram** animating into place: **Drive Exotiq → exotiq.rent → exotiq.ai** (community → marketplace → intelligence), drawn with hairlines and one gulf live-node.

**Sections:**
- Story / origin — `⟦FILL: CM-STORY-*⟧` (the "keys out of the glovebox" founding belief).
- The people — founders, enthusiasts, sponsors (portrait grid, `CMP-PORTRAIT`).
- **Ecosystem diagram** (`CMP-ECO`) — the three-brand relationship; "an Exotiq Inc. brand."
- The values / what we are not (quiet-luxury, actually-driven). `⟦FILL: CM-VALUES⟧`.
- Close: "Get on the list."

**Primary CTA:** "Get on the list." **JSON-LD:** `Organization` (full, with `memberOf` exotiq.ai + `subOrganization` exotiq.rent), `AboutPage`, `Person` for named founders (optional).

### 5.4 `/sponsor` — SPONSOR (the conversion surface)

**Primary job:** convert the #1 audience. This page must be the most persuasive, most concrete surface on the site.
**Experience:** the route reframed as a **media-value map** — the same roadbook rail from `/tour`, now annotated with markets × reach. The S8 is the asset on offer.
**Signature moment:** the **media-value map** — the ten-city rail with each node expanding to show market reach / audience / activation surface, the S8 rotating to show the blank wrap canvas (`⟦FILL: SP-WRAP-CANVAS asset⟧`).

**Sections:**
- **The opportunity** — one car, ten markets, summer→fall 2026, seeking a wrap sponsor. `⟦FILL: SP-OPP-*⟧`.
- **The asset** — the S8 (2017 Audi S8, heritage racing livery, sleeper) as a moving billboard; the blank-canvas wrap view. `⟦FILL: SP-ASSET-*⟧`.
- **The route as media-value map** (`CMP-MVM`) — markets, estimated reach, drive activations. `⟦FILL: SP-MVM-DATA⟧`.
- **Tiers** — Title/Wrap, Tour, Drive sponsorship (`CMP-TIERS`). `⟦FILL: SP-TIER-{1..3}-*⟧`.
- **Proof** — past drives, attendance, founder/sponsor logos, photography. `⟦FILL: SP-PROOF-*⟧`.
- **Inquiry form** (`CMP-FORM-SPONSOR`) → `/api/booking-leads` pattern (reuse) → Supabase → admin → Resend. Fields: name, company, email, phone, sponsorship interest (tier), budget range, message.

**Primary CTA:** "Start a sponsorship conversation" (form submit, gulf). **JSON-LD:** `Offer` / `Service` for sponsorship, `Event`/`EventSeries` reference to the tour, `BreadcrumbList`.

### 5.5 `/marketplace` — exotiq.rent teaser + waitlist

**Primary job:** build the exotiq.rent waitlist; tease, don't oversell (coming soon).
**Experience:** the quietest, most restrained page — a held breath before launch.
**Signature moment:** a **single "coming soon" reveal** — the exotiq.rent wordmark resolving from black with one line and one gulf waitlist field. No fake product UI.

**Sections:**
- Teaser hero — what exotiq.rent will be (peer-to-peer exotic rental, the curated marketplace). `⟦FILL: MK-HERO-*⟧`.
- "What's coming" — 3 quiet promises, hairline list. `⟦FILL: MK-PROMISES⟧`.
- **Waitlist form** (`CMP-FORM-WAITLIST`) → `/api/booking-leads` pattern. Fields: email (+ optional city, car interest).
- Note on the relationship: Drive Exotiq is the front door; exotiq.rent is the marketplace; intentionally siloed from existing Phoenix/Wheelbase booking.

**Primary CTA:** "Join the waitlist." **JSON-LD:** `WebPage` + `Organization` (exotiq.rent as subOrganization), optional `Service` (status: coming soon).

### 5.6 `/blog` — STORIES (index)

**Primary job:** SEO + AI-search (AEO) authority; warm cold traffic toward the list.
**Experience:** editorial, calm, Spectral-voiced. Sunrise mood, no theatrics — readability first.
**Signature moment:** a **featured story** masthead with the Kinetic mask-up title; below, a clean hairline-separated index.

**Sections:** featured story; category/tag filter (Drives, Tour, Cars, Community); paginated card grid (`CMP-STORY-CARD`). `⟦FILL: BLOG-INDEX-INTRO⟧`.
**Primary CTA:** read → article; secondary "Get on the list."
**JSON-LD:** `Blog` + `ItemList` of `BlogPosting`.

### 5.7 `/blog/[slug]` — STORIES (article)

**Experience:** long-form reading template; Spectral body voice, generous measure (`max-w-prose` 72ch), pull-quotes, one gulf inline accent max per screen.
**Sections:** title + dek + meta (author, date, read time); hero image; prose; related stories; end-CTA "Get on the list."
**Content source:** **Open decision §10** — MDX in-repo vs Airtable/CMS. Spec assumes MDX or Airtable-backed with build-time fetch + ISR.
**JSON-LD:** `BlogPosting` (headline, datePublished, author, image, articleBody) + `BreadcrumbList` + `FAQPage` where an article has a Q&A block (AEO).

### 5.8 The "Get on the list" / apply funnel [backend built]

**Primary job:** the single conversion spine for enthusiasts; the destination of most secondary CTAs.
**Experience:** `ApplicationForm` → `/api/applications` → Supabase (`de_applications`) → `/admin` review → Resend email. **All wired and live.**
- Surface as **/apply** (and as an inline drawer where context matters — e.g. RSVP from `/drives` pre-fills city + drive). 
- Fields (existing schema): full name, email, phone, current city, city of interest, brief intro, optional invite code, SMS consents.
- Reduced-motion + a11y: standard accessible form; gulf submit is the page's one accent.
- Copy: `⟦FILL: APPLY-HEAD / -SUB / -SUCCESS / -FIELD-HELP⟧`.
**JSON-LD:** none required (transactional); ensure `/thank-you` exists [built] with confirmation copy `⟦FILL: THANKYOU-*⟧`.

---

## 6. Component & Scene Inventory

**Primitives [built]:** `Section`, `Reveal`, `Button` (gulf primary / secondary / outline / ghost), `Emblem`, `Logo`, `Input`, `Textarea`, `Card`, `Badge`.

**To build (reusable):**
- `CMP-PROVIDER` — `SmoothScrollProvider` (Lenis, client layout segment).
- `CMP-ATM` — Sunrise atmosphere layer (radial gulf breath + 5% grain, `aria-hidden`). Drop into any full-bleed scene.
- `CMP-TEL` — **Machine telemetry module** (odometer tabular-nums, gauge, leg miles, one stat). Configurable per scene (idle / climbing / static).
- `CMP-ROADBOOK` — SVG route rail: `strokeDashoffset` draw, `getPointAtLength` car dot, N nodes flipping hairline→gulf. Used on HOME (mini), `/tour` (full), `/sponsor` (annotated as MVM).
- `CMP-MASKUP` — Kinetic mask-up text reveal (scrub or on-enter).
- `CMP-ROOM` — HOME room scene wrapper (pin, light-pool, preview slot, "Enter →" route affordance).
- `CMP-EVT` / `CMP-EVT-LIST` — event card + index (Airtable-backed, live gulf "RSVP open" state).
- `CMP-ECO` — ecosystem diagram (Drive Exotiq → exotiq.rent → exotiq.ai).
- `CMP-MVM` — media-value map (route rail + expandable market nodes).
- `CMP-TIERS` — sponsorship tier table (2px corners, hairline).
- `CMP-PORTRAIT` — community portrait grid.
- `CMP-STORY-CARD` — blog index card.
- `CMP-FORM-SPONSOR`, `CMP-FORM-WAITLIST` — forms on the `/api/booking-leads` pattern.
- `CMP-HDR` / `CMP-FTR` — rebranded header (rooms nav + one gulf "Get on the list") / footer.
- `CMP-PROGRESS` — global 1px gulf scroll hairline.
- `CMP-CURSOR` — optional custom cursor (desktop/fine-pointer only). *Phase-gated.*

**Scenes:** `SCENE-H0…H6` (HOME), `SCENE-T0…T-FINALE` (tour), plus the signature moment per pillar page (§5).

---

## 7. Tech Architecture

- **Framework:** Next.js 14 App Router on **Netlify** (SPA-redirect already removed). `metadataBase` + positioning metadata [built].
- **Crawlability contract (hard rule):** semantic HTML + JSON-LD live in **Server Components**; motion is **client-island overlays**. **Never make a whole page `'use client'`.** Every scene's content (headings, copy, city names, event data) is server-rendered; the client stage only animates it.
- **Motion stack:** `framer-motion@12` + `lenis@1.3` [installed]. `useScroll`/`useTransform` + manual lerp (0.12) for scrubbed scenes; `IntersectionObserver` (`Reveal`) for editorial entrances. Optional GSAP ScrollTrigger is a *possible* add for the `/tour` pin reliability — **open decision §10**; default is zero-new-dep Framer path.
- **Events pipeline (AI-agent-updatable):** **Airtable** as the events source of truth. Build-time fetch + **ISR** (`revalidate`) so Claude Cowork / an agent can edit Airtable and the site updates without a deploy. `/drives` and HOME's next-drive teaser read this. Schema: Event(name, date, city, status[upcoming/past/rsvp-open], rsvp-url, recap, images). Falls back to static if the fetch fails (never blocks render).
- **Forms / data:** **Supabase** (`de_` tables). `/api/applications` (apply funnel) + Resend + `/admin` [built]. `/api/booking-leads` pattern **reused** for sponsor inquiry + waitlist. Phoenix/Wheelbase booking stays **siloed**.
- **SEO / JSON-LD / AEO:** per-page JSON-LD as listed in §4–5 (`Organization` w/ `memberOf`→exotiq.ai + `subOrganization`→exotiq.rent; `Event`/`EventSeries`; `FAQPage`; `BlogPosting`; `BreadcrumbList`). `app/robots.ts`, `app/sitemap.ts`, `not-found.tsx` [built]. Add **`llms.txt` / `agents.txt`** at the root for AI-search discoverability.
- **Performance:** `next/image` with priority + blur placeholders for hero stills; preload both R8/S8 plates before the `/tour` cross-dissolve; `will-change: transform`; cap image scale range (1.06→1.22). One rAF loop. 60fps @ 1440×900.

---

## 8. The Ship Gate (cohesion + crawlability + a11y + performance)

A page may not ship until **all** pass:

**Cohesion**
- [ ] Uses the shared provider, tokens, type, `CMP-HDR`/`CMP-FTR`.
- [ ] **Exactly one gulf accent per viewport.**
- [ ] All car scenes use `CMP-TEL`; all full-bleed scenes use `CMP-ATM`; all entrances use `Reveal` or `CMP-MASKUP`.
- [ ] 2px corners everywhere; **zero glow** (legacy `hover:shadow-gulf-blue/*` classes removed from new work); no pills; no uppercase kicker labels.

**Crawlability**
- [ ] Page is a Server Component; all copy/headings/city/event data in DOM without JS.
- [ ] Correct JSON-LD present and valid.
- [ ] In sitemap; canonical set.

**Accessibility**
- [ ] Reduced-motion path verified (no pin trap, content intact, cursor off).
- [ ] Keyboard reachable; skip link; gulf focus rings; decorative layers `aria-hidden`.
- [ ] Color contrast AA (gulf on canvas, ink-2 on surface checked).

**Performance**
- [ ] 60fps on the signature scene at 1440×900; LCP image prioritized; CLS ≈ 0.
- [ ] Mobile: scale clamped, per-beat scroll shortened, stacked fallback under small viewports.

---

## 9. Build Phases

**Already done [built]:** design tokens as CSS vars (dark + light + gold variant) and 3 self-hosted fonts; `Section`/`Reveal`/`Button`/`Emblem`/`Logo`/form primitives; `robots.ts`, `sitemap.ts`, `not-found.tsx`; `metadataBase` + positioning metadata; Netlify SPA-redirect removed; `framer-motion@12` + `lenis@1.3` installed; Supabase `de_` tables; `/api/applications` + Resend + `/admin` apply funnel; `/api/booking-leads` pattern; concept prototypes in `docs/concepts/`.

**Phase 1 — The spine + the wow (ships the SOTD-class signature):**
1. `CMP-PROVIDER`, `CMP-ATM`, `CMP-TEL`, `CMP-ROADBOOK`, `CMP-MASKUP`, rebranded `CMP-HDR`/`CMP-FTR`.
2. **`/tour` Phase-1** (the showpiece): pinned windshield stage, ten server-rendered city beats, Sunrise cold-open, persistent meter, finale → `/sponsor`.
3. **HOME "Garage"** rooms (`SCENE-H0…H6`) with routing to pillars.
4. `/sponsor` (conversion) with `CMP-MVM`, `CMP-TIERS`, `CMP-FORM-SPONSOR`.
5. Apply funnel surfaced at `/apply`; org/website JSON-LD; `llms.txt`/`agents.txt`.

**Phase 2 — Audience depth:**
6. Airtable events pipeline + `/drives` (`CMP-EVT`/`CMP-EVT-LIST`) + RSVP/invite flow; backfill past events.
7. `/community` + `CMP-ECO`; `/marketplace` waitlist (`CMP-FORM-WAITLIST`).
8. `/blog` + `/blog/[slug]` + launch articles; per-city `/tour/[city]` pages + sitemap entries.

**Phase 3 — Optional upgrades:**
9. WebGL forward-displaced road plane for `/tour` (eliminates the two-photo cross-dissolve risk; gated behind a GPU-cheap fallback to the proven Phase-1 path).
10. `CMP-CURSOR`; deeper telemetry per city.

---

## 10. Open Decisions + Where Copy & Assets Plug In

### Open decisions (resolve before/during Phase 1)
1. **Gold jewelry accent** — ship metal-default (`[data-variant]` off) or enable gold for launch? (Gregory is fond of gold; gulf stays action color either way.)
2. **Custom cursor** — ship or defer? (Spec defaults: defer to Phase 3.)
3. **`/tour` scrub engine** — Framer + manual lerp (zero new dep, default) vs add GSAP ScrollTrigger for pin reliability.
4. **Blog content source** — MDX in-repo vs Airtable/CMS with ISR.
5. **City scope on `/tour`** — ten markets list shows nine cities with combined "Palm Beach & Ft Lauderdale"; confirm whether that's 10 nodes or 9. (Spec treats as ten beats; confirm node count.)
6. **HOME room order** — spec puts Sponsor last as the crescendo; confirm vs Drives-last.
7. **R8→S8 continuity** — confirm the covert dawn-R8 / dusk-S8 thread reads as one car's journey, not two cars.

### Where copy plugs in (COPY.md enumerates these IDs)
- HOME: `H0-WORDMARK-LOCKUP`, `H0-PROMISE`, `H0-SUB`, `H0-CUE`, `H1-LINE`, `H2-LINE`, `H3-LINE`, `H4-LINE`, `H5-LINE`, `H6-CLOSER`, `H6-CTA-LABEL`.
- `/tour`: `T0-INTRO`, `T-CITY-{1..10}-NAME/-DEK/-LEG-MI/-NOTE`, `T-FINALE-HEAD/-CTA`.
- `/drives`: `DR-HERO-*`, `DR-INVITE-*`, `DR-CNC-*`, event recap copy (Airtable).
- `/community`: `CM-STORY-*`, `CM-VALUES`, ecosystem labels.
- `/sponsor`: `SP-OPP-*`, `SP-ASSET-*`, `SP-MVM-DATA`, `SP-TIER-{1..3}-*`, `SP-PROOF-*`, form labels.
- `/marketplace`: `MK-HERO-*`, `MK-PROMISES`, waitlist labels.
- `/blog`: `BLOG-INDEX-INTRO`, per-article front-matter, FAQ blocks.
- Apply: `APPLY-HEAD/-SUB/-SUCCESS/-FIELD-HELP`, `THANKYOU-*`.

### Where assets plug in (ASSETS.md enumerates these IDs)
- **Stills (priority):** `ASSET-R8-DAWN` (`docs/concepts/r8.jpg`, regrade), `ASSET-S8-DUSK` (`docs/concepts/s8.jpg`, regrade), `SP-WRAP-CANVAS` (S8 blank-wrap render).
- **HOME rooms:** one graded frame per room (`ASSET-H1-CNC`, `ASSET-H2-S8`, `ASSET-H3-PEOPLE`, `ASSET-H4-KEYS`, `ASSET-H5-S8-LIT`).
- **`/tour`:** per-city plate or the two-plate cross-dissolve set; optional driving plate / WebGL road texture (Phase 3).
- **`/community`:** founder/sponsor portraits, ecosystem logos (Drive Exotiq, exotiq.rent, exotiq.ai).
- **`/sponsor`:** S8 wrap mockups, past-drive proof photography, sponsor logos.
- **Global:** wordmark/emblem [built], OG image [built], favicons [built], 5% grain texture, llms.txt/agents.txt content.

---

*Built for the people who actually drive the car. An Exotiq Inc. brand.*
