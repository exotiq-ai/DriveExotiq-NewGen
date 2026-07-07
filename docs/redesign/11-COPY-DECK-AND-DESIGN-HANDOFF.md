# 11 · Copy Deck & Design Handoff (Claude Code build sheet)

> **Who this is for:** Claude Code, taking the wheel on implementation. This doc carries the *final copy* and the *exact design intent* for every change coming out of audit `10-COPY-AND-JOURNEY-AUDIT.md`. Copy is decided; design is specified against the real token system.
>
> **How to read it:** §0 lists what the build already fixed (do NOT redo). §1 is the rulebook (voice, the new em-dash policy, the three laws, the design tokens, the CTA library). §2 is the short list of taste forks for Gregory to confirm. §3 is the film beat deck. §4 is the film chrome + the one new component (the Menu). §5 is every page. §6 is the site-wide em-dash cleanup map. §7 collects the net-new UI specs. §8 is the build order. §9 is the master copy map (the single index).
>
> **Source of truth:** the local `driveexotiqweb` repo (this is ahead of both audit #10 and staging). Quote current copy from `components/experience/frames.ts`, `components/experience/ExperienceScroll.tsx`, `components/layout/Header.tsx`, `app/*/page.tsx`, `lib/interest.ts`.
>
> **Quote style:** the codebase uses curly apostrophes (`’`) and HTML entities (`&rsquo;`, `&amp;`) inside JSX. Match the existing style of the file you're editing. The *words* below are law; the glyph encoding follows the file.

---

## 0. Status delta since audit #10 (already resolved, do NOT redo)

The build moved ahead of the audit. These punch-list items are already done in the repo; leave them:

| Audit item | Status in repo | Evidence |
|---|---|---|
| #18/#19: /blog is empty, don't route leads to it | **Superseded.** `/blog` now renders 3 real posts + a `[slug]` route. | `content/blog/{the-car-sleeper-thesis,tour-denver,tour-miami}.md`; `app/blog/[slug]/page.tsx`; `lib/blog.ts` loads any titled `.md`. "Read the stories" is no longer a dead end, but see §5.4 for the better renter routing. |
| #20: confirm `· Drive Exotiq` title suffix | **Done.** | `app/layout.tsx` → `title.template: "%s · Drive Exotiq"`. Every page uses a short `title` and inherits the suffix. |
| /apply AEO anchor present + "coming soon" | **Done.** | `app/apply/page.tsx` renders `Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace, coming soon.` (The hero *sub* still needs the coming-soon clause; see §5.3.) |
| SB-15 relocation (`This could be you.` before the S8 plant) | **Likely already correct; verify only.** | In `frames.ts` order, `SB-15` sits directly after `SB-14b` (Cars & Coffee) and immediately before the S8 block (`SB-11`). That is exactly the audit's target position. No move needed unless the render disagrees. |
| SB-04 body already names the marketplace + "soon" | **Partial.** Body reads `The marketplace opens soon — exotiq.rent.` The *weight* promotion (kicker + a coming-soon chip) is still to do; see §3 SB-04. |

**Build delta 2026-07-06 (post-deck, owner-directed):** Act I rebuilt (SB-02 industrial door onto the corridor, NEW silent SB-02b walk-in, SB-03 CUT); SB-08b moved after the McLaren storyline (AI content closes storyline one, then the film goes real); SB-14c re-plated from the rejected coast aerial to the original SB-12-t1 windscreen dawn run. The §3 beat tables in this doc are updated in place; read every order-sensitive instruction against the current `frames.ts`.

Everything else in audit #10 still applies against the code.

---

## 1. The rules of the build

### 1.1 Voice (condensed from `01-COPY-BRIEF.md §1`)
State, don't sell. Periods, not exclamation points. Short declaratives, concrete nouns, one idea per line. Enthusiast-credible specifics with real numbers and model years. Quiet luxury: the most expensive thing on the page is the white space. Sentence-case kickers (never uppercase). One Spectral-italic "jewel" line per scene, used sparingly. **Gulf is for actions only.** One primary CTA per viewport.

**Banned:** *unforgettable, epic, revolution, game-changing, unlock, elevate, curated experience (as filler), insane, ROI-speak, exclusivity-as-bragging, multiple exclamation points, ALL CAPS for emphasis, emoji.*

### 1.2 Em-dash policy, NEW (Gregory's call: use sparingly, only when absolutely necessary)
The old house style leaned on em dashes (`—`) as its signature pause. **That changes.** For all copy in this deck the em dash is retired in favor of:

- **A period** for a hard stop or dramatic beat: the most on-voice replacement. `livery, sleeper — real presence` → `livery, a sleeper. Real presence.`
- **A colon** for a reveal or a list. `opens soon — exotiq.rent` → `the marketplace: exotiq.rent`.
- **A comma** for a light aside. `rolls through — and when it opens` → `rolls through, and when it opens`.
- **A middot (`·`)** only in meta titles / kicker chips where a separator glyph is wanted (`Sponsor the wrap · Denver→Miami tour`).

Target: **zero em dashes in visible prose.** Every current instance is enumerated with its replacement in §6. (Note: `→` arrows in `Denver→Miami` and hyphens in `Denver-to-Miami` / `invite-only` are NOT em dashes. Leave them.)

### 1.3 The three laws (non-negotiable, per page)
1. **AEO anchor.** The sentence `Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace` (an approved variant keeping the three entities + "front door" is fine, and `, coming soon.` is the approved tail) must be **server-rendered at least once on every page.** The only page still missing it is `/tour` (§5.2).
2. **One accent per viewport.** Gulf (`--de-gulf #6CBDE6`) is reserved for the single primary action in view. Navigation is not an action, so the new Menu control (§4) carries **no** Gulf.
3. **Canonical facts, never re-invent.** `2017 Audi S8` (with the year, never "built"); `~5,000 miles` in prose, `4,980 miles round trip` only in the exact stat line (keep both: the round number headlines, the precise number footnotes); `10 markets`; `last Sunday of every month`; `Denver → Miami`; `summer into fall 2026`. Film heroes / canonical marque short-list: **McLaren, Porsche, Ferrari** (Ferrari is a film hero and must never be dropped from marque lists).

### 1.4 Design tokens: the real system (`tailwind.config.ts` + `globals.css`)
Use these names, not raw hex. Dark is default; a light theme flips via `[data-theme="light"]`.

**Color (dark):**
`canvas #0B0B0C` · `canvas-2 #101012` · `surface #161618` · `surface-2 #1F1F23` · `line #28282C` · `line-2 #3A3A40` · `ink #F3F1EC` · `ink-2 #ABA8A1` · `ink-3 #6F6D67` · `metal #C9C6BD` · `gulf #6CBDE6` / `gulf-2 #8ED0F0` (hover) / `gulf-soft rgba(108,189,230,.12)` · `on-gulf #08222E` (text on Gulf) · `papaya #FF5A1F` · `gold #C8A24E` · `jewel = metal` by default (flips to gold under `[data-variant="gold"]`).

**Type:** `font-display` = Bricolage Grotesque (headlines/wordmark), `font-sans` = Schibsted Grotesk (UI/body), `font-serif` = Spectral (the italic jewel lines). Tracking: `tracking-tight-exotiq -0.02em`, `tracking-tightest -0.03em`.

**Form:** radius `2px` (`rounded-sm`), `4px` (`rounded-md`). Corners are tight, never pill. Depth is **hairline, never glow** (`border-line`, no drop shadows on the brand). Max width `content 1180px`. Section rhythm `spacing.section = clamp(4.5rem, 11vh, 9rem)`. Motion: `ease-de = cubic-bezier(.2,.7,.2,1)`, durations `250 / 400 / 600ms`.

### 1.5 CTA library (canonical labels, pull from here, don't reinvent)
`Get on the list` → /apply · `Sponsor the wrap` → /sponsor · `See the wrap opportunity` → /sponsor · `Start a sponsorship conversation` → sponsor form · `Ride the tour` → /tour · `Enter the drives` → /drives · `Request your invite` → /apply?interest=drives · `Join the waitlist` → /marketplace · `Read the story` → /blog/[slug] · `Read the stories` → /blog. Secondary (ghost) default = `Get on the list`, unless the primary already is.

---

## 2. Taste forks: confirm before build (defaults are locked; alternates in italics)

Each fork below ships the **Recommended** line unless Gregory strikes it. All are on-voice; the alternate is a real second choice, not a strawman.

| Fork | Recommended (ships) | Alternate |
|---|---|---|
| **SB-08** rename | `Which one's yours?` | *`Pick your first.`* |
| **SB-18** pivot headline | `This one's the founder's.` (echoes SB-08b `This one's yours.`) | *`Meet the founder's car.`* |
| **SB-11** register flag (new jewel) | `Not one of the three.` (ties to the 01/02/03 fleet) | *`One car, off on its own.`* |
| **SB-17** value bridge (new jewel) | `A billboard that drives.` (pre-echoes the /sponsor asset line) | *body add: `One car, seen the whole way.`* |
| **SB-20** plain gloss (new body) | `Get on the list to drive. Sponsor the wrap for the tour.` | *`Rent and drive, or wrap the car for the tour.`* |
| **Cut one silent S8 beat** | Cut **SB-13b** (taillights receding); keep SB-16 (wheel slowing → decel into the pivot) | *Cut SB-16, keep SB-13b* |
| **End-card Partner pillar** | `We partner with events and brands that get it.` (CTA carries the ask) | *`Bring us your event.`* |
| **Canonical marque short-list** | `McLaren, Porsche, Ferrari` everywhere it appears short | *`McLaren, Porsche, Ferrari, Lamborghini`* |

## 3. The film: full beat deck (`components/experience/frames.ts`)

Order matches the `FRAMES` array. `[k]` kicker · `[H]` headline · `[j]` jewel (Spectral italic) · `[b]` body · `[aria]` accessible-only. Movement I = renter arc; **PIVOT**; Movement II = sponsor arc.

### 3.1 Beats that change (with design notes)

**SB-04 · Movement I · the fleet reveal · 🔴 BLOCKER FIX**
- **Now:** `[k]` The fleet · `[H]` Every one of them, driven. · `[b]` The marketplace opens soon — exotiq.rent.
- **Final:** `[k]` The fleet · `[H]` Every one of them, driven. · `[chip]` **Opening soon** (new) · `[b]` exotiq.rent. The marketplace built for people who actually drive.
- **Why:** the film's single worst misread. Today the only "coming soon" cue is one body line on a fast beat, so the fleet reads as a live rental catalog. Promote it to first-class *visual* weight.
- **Design:** add a small eyebrow **chip** `Opening soon` at the fleet reveal (spec §7.1): `metal`/`ink-2` text, `line` hairline border, **no Gulf** (not an action). The chip is the loud cue; the body names the entity and adds one line of voice (echoes the /marketplace sub). *Alternate if you'd rather not add UI: fold it into the kicker (`The fleet, opening soon`) and keep the body as `exotiq.rent. The marketplace, coming soon.`*

**SB-08 · Movement I · the choice · 🔴 BLOCKER FIX**
- **Now:** `[H]` Choose your car.
- **Final:** `[H]` Which one's yours?  *(fork §2; alt `Pick your first.`)*
- **Why:** "Choose your car." is a buy-now imperative before anything is bookable; SB-08b walks it back at the real-footage threshold (since 2026-07-06 it sits after the McLaren storyline, so the drive-out enacts the choice before the ask lands). The rhetorical present-tense daydream keeps the choose→possession logic and drops the false promise. SB-08b's `This one's yours.` still answers it cleanly, four beats later and over real cars.
- **Design:** copy-only. Beat weight stays `2`.

**SB-11 · Movement I · the S8 plant (ignition) · 🟠 MAJOR (make the pivot land)**
- **Now:** `[k]` Push to start · `[aria]` Push to start — the real V8 wakes
- **Final:** `[k]` Push to start · `[j]` Not one of the three. (new; fork §2) · `[aria]` Push to start. The real V8 wakes.
- **Why:** the four silent S8 beats read as "a fourth fleet car" to a cold viewer, so the SB-18 reveal misfires ("wait, which car?"). The new jewel flags a different register: this is one lone car, set apart from the numbered 01/02/03 fleet, so its recurrence registers.
- **Design:** jewel renders in Spectral italic (the beat's one jewel; it currently has none, so no conflict). No other change.

**SB-13b · Movement I · taillights receding · 🟡 CUT**
- **Now:** `[aria]` Taillights receding down the dusk mountain road
- **Final:** **remove the beat.** *(fork §2; alt = cut SB-16 instead)*
- **Why:** four silent S8 beats is a long trough right where a cold viewer decides whether to keep scrolling. Cutting SB-13b keeps ignition → drive → wheel-slowing → pivot, so the deceleration (SB-16) leads straight into the reveal.

**SB-18 · PIVOT · the reveal · 🟠 MAJOR (the most load-bearing line in the film)**
- **Now:** `[k]` One more thing · `[H]` The drive is the product. · `[j]` The story goes further. · `[b]` The 2017 Audi S8 you kept seeing — the founder's own car, driven every mile.
- **Final:** `[k]` One more thing · `[H]` This one's the founder's. (fork §2) · `[j]` The story goes further. · `[b]` The 2017 Audi S8 you kept seeing. The founder's own car, driven every mile.
- **Why:** `The drive is the product.` is a slogan, not information. A cold viewer reads only the headline and learns nothing concrete. The reveal must live in the headline. `This one's the founder's.` echoes SB-08b's `This one's yours.` (renter's *yours* → founder's *founder's*). Test passed: after the headline alone, the viewer knows a specific thing happened.
- **Note:** `The drive is the product.` is cut. If you love it, it can return as a quiet secondary jewel, but recommend cutting: one headline, one jewel, one body. Beat weight stays `1.5`.

**SB-17 · Movement II · the tour opens · 🟠 MAJOR (bridge renter → sponsor)**
- **Now:** `[k]` The tour · `[H]` One car. Denver to Miami. · `[b]` Ten markets. {n} miles. Summer to fall 2026. `(odometer → 5,000)` · secondary CTA `See the tour plan` → /tour
- **Final:** `[k]` The tour · `[H]` One car. Denver to Miami. · `[j]` A billboard that drives. (new; fork §2) · `[b]` Ten markets. {n} miles. Summer to fall 2026. · secondary CTA `See the tour plan` → /tour
- **Why:** this is the first sponsor-arc beat, and SB-19 asks for money before a renter-minded viewer knows why a sponsorship matters. The new jewel reframes the tour as an advertising asset (it pre-echoes the /sponsor line `The car is a billboard that drives.`) so the livery ask lands as the obvious payoff.
- **Design:** Spectral-italic jewel, one per beat. `{n}` odometer behavior unchanged (counts to 5,000).

**SB-19 · Movement II · the money shot · 🟠 MAJOR (mark the audience shift)**
- **Now:** `[H]` Your livery on this car. · `[j]` Down this line, through ten cities.
- **Final:** `[k]` The sponsorship (new) · `[H]` Your livery on this car. · `[j]` Down this line, through ten cities.
- **Why:** the ask lands before a cold viewer registers they've been recategorized from renter to sponsor. A sentence-case kicker makes the shift explicit.
- **Design:** kicker only; no Gulf. Beat weight/`copyAt` unchanged.

**SB-19b · Movement II · the founder · 🟡 em-dash cleanup**
- **Now:** `[k]` Gregory — founder · `[H]` The garage door is open. · `[j]` The road starts here.
- **Final:** `[k]` Gregory, founder · (headline + jewel unchanged)

**SB-20 · finale · two ways in · 🟡 add plain gloss**
- **Now:** `[k]` Two ways in · `[H]` The keys, or the canvas. · CTA `Sponsor the wrap` → /sponsor · secondary `Get on the list` → /apply
- **Final:** add `[b]` Get on the list to drive. Sponsor the wrap for the tour. *(fork §2).* Kicker, headline, and both CTAs unchanged.
- **Why:** the two doors are distinguished by metaphor only; a skimmer can't tell which ask is theirs. The gloss maps each metaphor to its door (keys→list→drive, canvas→wrap→tour) without killing the poetry.
- **Design:** body sits between headline and the CTA pair. One Gulf CTA only (`Sponsor the wrap` primary); secondary stays ghost.

### 3.2 Beats that stay (verbatim, do not touch)

| ID | Copy (verbatim) | Note |
|---|---|---|
| SB-01 | `[H]` Drive Exotiq · `[j]` Built for the people who actually drive the car. · `[b]` Exotic rentals, invite-only drives, and a Denver-to-Miami tour. | Cold open. Keep. |
| SB-02 | `[H]` The door is open. | Keep. Re-plated 2026-07-06: straight-on industrial door, centered copy, opens onto the corridor. |
| SB-02b | `[aria]` Walking through the open door and down the corridor into the garage | NEW 2026-07-06: the walk-in scrub. Silent by design: invitation (SB-02) → acceptance (the walk) → arrival (SB-04). |
| SB-03 | — | CUT 2026-07-06 (Act I redesign): SB-02b absorbed the corridor; the aria retired with it. |
| SB-05 | `[k]` 01 · `[H]` McLaren 720S · `[b]` Twin-turbo V8 behind your shoulders. The one that rewards the driver, not the parking lot. | Keep. |
| SB-06 | `[k]` 02 · `[H]` Porsche 911 GT3 RS · `[j]` The canyon carver. · `[b]` GT3 is Porsche's motorsport bloodline, naturally aspirated in every generation. RS is that bloodline, concentrated. | Keep. |
| SB-07 | `[k]` 03 · `[H]` Ferrari 458 · `[b]` The last naturally aspirated Ferrari V8. | Keep. Ferrari is a canonical hero; see marque list §1.3. |
| SB-09 | `[H]` Doors up. | Keep. |
| SB-10 | `[j]` Settle in. | Keep. |
| SB-11b | `[aria]` The nose eases out of the garage | Keep. |
| SB-14c | `[aria]` The dawn run through the windscreen, down the open canyon road | Re-plated 2026-07-06 (owner): the coast aerial is out; the original SB-12-t1 windscreen POV closes the AI storyline from the driver's seat. |
| SB-08b | `[H]` First keys to the fleet. · `[j]` This one's yours. · `[b]` First booking windows when exotiq.rent opens. · CTA `Get on the list` → /apply | Keep, MOVED after the McLaren storyline (owner 2026-07-06): still answers SB-08's `Which one's yours?`, now from the first real-footage frame. The AI dream cuts to the real pair as the film says `This one's yours.` |
| SB-12 | `[H]` The road opens. | Keep. Post-move it opens the drives world (the membership road), not the McLaren's run. |
| SB-14 | `[k]` The drives · `[b]` Invite-only, the last Sunday of every month. Sunrise in Colorado's high country, then Cars & Coffee. | Keep. The film's geography + cadence anchor. |
| SB-14b | `[j]` No stanchions. No judging. | Keep. Pays off SB-14. |
| SB-15 | `[j]` This could be you. | Keep. Already sits after SB-14b, before the S8 block (audit §3 position); verify only. |
| SB-13 | `[k]` The high country · `[j]` This is the drive. | Keep. Benefits from the SB-11 register flag. |
| SB-16 | `[aria]` The wheel, up close, slowing | Keep (survivor of the §2 cut). The decel into the pivot. |

## 4. Film chrome & navigation (`components/experience/ExperienceScroll.tsx`)

### 4.1 The Menu affordance · 🔴 BLOCKER (highest-leverage structural fix)

**The problem:** the home film is the only page with no global Header. Its top chrome exposes only the wordmark (links to `/`, i.e. itself) plus two CTAs. To reach `/drives`, `/tour`, `/marketplace`, `/blog`, or `/sponsor` a visitor must scroll the entire ~30-viewport film to the end-card, where **Marketplace isn't even listed.** This strands the highest-value segment: the returning visitor who already knows the film and just wants the next drive date. On mobile there is effectively zero skip affordance.

**The fix:** add one quiet, persistent, mobile-first **`Menu`** control to the film chrome that opens a sheet with the canonical destination set.

**Copy + IA:**
- Trigger label: **`Menu`** (a text label, not a hamburger, better fit for the quiet aesthetic).
- Sheet destinations, in canonical order (reused verbatim so the three nav surfaces finally agree):
  **The Drives** (`/drives`) · **The Tour** (`/tour`) · **Marketplace** (`/marketplace`) · **Stories** (`/blog`) · **Sponsor** (`/sponsor`)
- Then the one Gulf CTA inside the sheet: **`Get on the list`** (`/apply`).

**Design spec:**
- **Placement:** left cluster, immediately after the wordmark → chrome reads `[Drive Exotiq · Menu] ................ [ghost CTA (sm+) · Gulf CTA]`. Menu balances the single Gulf CTA on the right, and this satisfies the audit's "tab order right after the wordmark." *(If you prefer it literally top-right, drop it just left of the CTA cluster instead; either is fine, left-after-wordmark is the recommendation.)*
- **Trigger styling:** `font-sans text-xs font-semibold text-ink-2 hover:text-ink transition-colors duration-250 ease-de`. **No Gulf, no border.** Navigation is not an action, so the one-accent-per-viewport law is preserved. `aria-expanded`, `aria-controls="film-menu-sheet"`, `aria-label="Menu"`.
- **Must render on mobile:** do NOT gate behind `sm:`. This is the whole point: the current mobile chrome has no nav at all.
- **Persistence:** the Menu trigger lives in the **persistent left cluster with the wordmark.** It does NOT participate in the renter↔sponsor nav cross-fade at the pivot (that fade is for the CTA cluster only). It fades with the chrome over accent beats like the rest of the header (acceptable: the returning-visitor pain point is at entry, where chrome is fully visible). Render it in **all three chrome states**: `StageChrome` renter path, `StageChrome` sponsor path, and `StaticChrome` (reduced-motion).
- **The sheet:** reuse the `Header.tsx` mobile-sheet treatment exactly so the two front doors are visually identical:
  - Overlay: `fixed inset-0 z-[80] bg-canvas transition-opacity duration-400 ease-de`; `pointer-events-auto opacity-100` when open, `pointer-events-none opacity-0` when closed. `z-[80]` sits above the film's hairline (`z-[60]`) and act ticks (`z-[61]`).
  - Body scroll lock while open (`document.body.style.overflow = 'hidden'`), same effect Header already uses.
  - Inner layout: `flex h-full flex-col justify-center px-8 pb-16`.
  - Nav links: `block py-3 font-display text-[30px] font-bold tracking-tight-exotiq text-ink transition-transform duration-250 hover:translate-x-1`. Each `onClick` closes the sheet.
  - CTA: `mt-10 inline-flex items-center justify-center rounded-sm bg-gulf px-6 py-3.5 font-semibold text-on-gulf` → `/apply`. (Inside the opaque sheet this is the only accent in view, so the one-accent law holds.)
  - Close: a `Close` text button (or `×`) top-right of the sheet at `text-ink-2 hover:text-ink`; also closes on `Esc` and on any nav-link tap.
- **Shared source of truth (do this, don't copy-paste):** export the `NAV` array from `Header.tsx` (or lift it to `lib/nav.ts`) and consume it in **both** the Header and this film Menu sheet, so the canonical list can never desync again. Reorder the Header `NAV` to the canonical order above (Marketplace before Stories).
- **Keep** the existing `sr-only` "Skip the film" link for keyboard/AT users; it's no longer the general skip solution once Menu ships. Ensure the visible Menu trigger is in the tab order right after the wordmark.
- The desktop **act ticks** (1px "Skip to the tour / the ask" marks on the hairline) can stay as a power-user in-film chapter jump. They are not the nav solution. Optionally surface `Jump to the tour` / `Jump to the ask` inside the Menu sheet so that behavior gets a discoverable, labeled home.

### 4.2 End-card fixes (`ExperienceScroll.tsx`, the `#experience-end` section)

**Footer nav · 🟠 add Marketplace + fix casing.**
- **Now:** `The drives · The tour · Sponsor · Stories` (Marketplace missing; lowercase casing diverges from the Header).
- **Final:** `The Drives · The Tour · Marketplace · Stories · Sponsor` (canonical order + casing; matches Header + the new Menu sheet). Keep the `© {year} Exotiq Inc.` span.

**Rent pillar · 🟠 add Ferrari + em-dash cleanup.**
- **Now:** `The exotiq.rent marketplace — McLaren, Porsche, Lamborghini, Rolls-Royce, and the rest of the dream garage. Coming soon.`
- **Final:** `The exotiq.rent marketplace: McLaren, Porsche, Ferrari, Lamborghini, Rolls-Royce, and the rest of the dream garage. Coming soon.` (Ferrari is a film hero and must appear; colon replaces the em dash.)

**Gather pillar · 🟡 em-dash cleanup.**
- **Now:** `A monthly Cars & Coffee worth parking at — the cars and the people who actually drive them.`
- **Final:** `A monthly Cars & Coffee worth parking at. The cars and the people who actually drive them.`

**Partner pillar · 🟡 tighten the sell-y imperative.**
- **Now:** `We partner with events and brands that get it. Bring us yours.`
- **Final:** `We partner with events and brands that get it.` *(fork §2; alt `Bring us your event.`)* Let the `Partner with us →` CTA carry the ask.

**Footer brand line · 🟡 em-dash cleanup (this line is also an AEO anchor variant, keep the entities).**
- **Now:** `An Exotiq Inc. brand — the community front door to the exotiq.rent marketplace.`
- **Final:** `An Exotiq Inc. brand. The community front door to the exotiq.rent marketplace.`

**No change:** end-card H2 `Rent. Drive. Gather. Partner.` and its Gulf CTA `Get on the list` stay.

## 5. Page decks

Convention: **Now** = verbatim current copy, **Final** = ship this. Title/OG constructions use a colon (`:`) or middot (`·`) in place of the em dash (title context); prose uses a period or comma per §1.2.

### 5.1 Home meta (`app/page.tsx`, `app/layout.tsx`) · 🟠 marque list + em-dash

- **`app/page.tsx` `DESCRIPTION`** Now: `Exotic car rentals coming soon at exotiq.rent — McLaren, Porsche, Lamborghini. Invite-only drives, monthly Cars & Coffee, and the Denver→Miami tour.`
  **Final:** `Exotic car rentals coming soon at exotiq.rent: McLaren, Porsche, Ferrari. Invite-only drives, monthly Cars & Coffee, and the Denver→Miami tour.` (colon; **Lamborghini → Ferrari** to match the canonical hero list §1.3; still ≤155 ch).
- **OG / Twitter / JSON-LD `name` / sr-only `<h1>`** (the lowercase tagline, 4 spots) Now: `Drive Exotiq — built for the people who actually drive the car`
  **Final:** `Drive Exotiq: built for the people who actually drive the car`
- **`app/page.tsx` OG image `alt`** Now: `The wrapped S8 at dusk — the Drive Exotiq tour` → **Final:** `The wrapped S8 at dusk, the Drive Exotiq tour`
- **`app/layout.tsx` default `title`** Now: `Drive Exotiq — Built for People Who Drive the Car` → **Final:** `Drive Exotiq: Built for People Who Drive the Car`
- **`app/layout.tsx` OG + Twitter titles**: same em dash → colon as above.
- **sr-only spine join** (`app/page.tsx`, `.join(' — ')`), optional: change to `.join('. ')` or `.join(' · ')` for AT/crawler prose. Low priority (see §6).

### 5.2 `/tour` · 🔴🟠 FIX FIRST (weakest page vs. the brief)

Four fixes, then em-dash cleanup:

1. **Rename the entity (The Journey → The Tour).**
   - Meta title (`title:`) Now `The Journey — Denver to Miami` → **Final `The Exotic Tour: Denver to Miami`** (layout appends `· Drive Exotiq`).
   - Hero kicker Now `The Journey · Denver → Miami · summer–fall 2026` → **Final `The tour · Denver → Miami · summer–fall 2026`**. (The `→` arrow and the en-dash in `summer–fall` are correct. Leave them.)
   - *Optional:* update the `THE JOURNEY — /tour` JSDoc comment for consistency (not user-facing).
2. **Restore the canonical car (drop "built", add the year).**
   - Meta description Now `...One built Audi S8, ten markets, ~5,000 miles — Drive Exotiq's Denver-to-Miami exotic tour, summer into fall 2026. The wrap is still yours to claim.` → **Final `...One 2017 Audi S8, ten markets, ~5,000 miles. Drive Exotiq's Denver-to-Miami exotic tour, summer into fall 2026. The wrap is still yours to claim.`**
   - Hero sub Now `One built Audi S8, ten markets, ~5,000 miles — the Denver-to-Miami exotic tour, summer into fall 2026. The wrap is still yours to claim.` → **Final `One 2017 Audi S8, ten markets, ~5,000 miles. The Denver-to-Miami exotic tour, summer into fall 2026. The wrap is still yours to claim.`**
3. **Finale headline, restore the number.** Now `Ten cities. Thousands of miles. One blank canvas.` → **Final `5,000 miles. Ten cities. One blank canvas.`** (matches the sponsor H1 and the copy-brief seed). **Leave the footer stat `4,980 miles round trip · 10 markets · one car` exactly as-is.** The round number headlines, the exact number footnotes (§1.3).
4. **Add the AEO anchor (currently missing, non-negotiable).** Under the finale sub `This is the car. This is the route. The wrap is still yours to claim.`, add a server-rendered line:
   **`Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace, coming soon.`**
   **Design:** quiet `text-ink-3 text-[15px] leading-relaxed`, centered, max-width ~`54ch`, sitting between the finale sub and the CTA row (or just above the stat line). It is copy, not a CTA, so no Gulf.
5. **Hero jewel (optional).** Now `a long way south, the long way.` → **Final `The long way south, on purpose.`** (resolves on first read; low priority; the H1 carries the meaning).

### 5.3 `/apply` (`app/apply/page.tsx` + `lib/interest.ts`) · 🟠 fix the sponsor dead-end

**`lib/interest.ts`: remove the sponsor option from the consumer select.**
- **Now** `APPLY_INTEREST_OPTIONS` includes `{ value: 'title-wrap', label: 'Sponsor the wrap (Title/Wrap · Tour · Drive)' }`.
- **Final:** the select shows four options (em-dash cleaned on the first):
  - `{ value: 'access', label: 'Rent, first keys to the fleet' }`
  - `{ value: 'drives', label: 'The drives and Cars & Coffee' }`
  - `{ value: 'partnership', label: 'Event partnership' }`
  - `{ value: 'other', label: 'Something else' }`
- **Keep** the `INTEREST_VALUES` enum, `INTEREST_LABEL` map, and `normalizeApplyInterest()` intact. `title-wrap`/`tour`/`drive` are still valid inbound values from `/sponsor` deep-links and the admin triage subject. Only the **select** loses the sponsor lane.
- **Guard the controlled select (design/logic):** since a sponsor value can still arrive via `?interest=sponsor`, add a server redirect at the top of `ApplyPage`: if `normalizeApplyInterest(searchParams?.interest)` resolves to a sponsor tier (`title-wrap`/`tour`/`drive`), `redirect('/sponsor')`. This routes sponsor intent to the right form and prevents the select from receiving a value with no matching option. (Belt-and-suspenders: in `ApplicationForm`, fall the select back to `access` if the value isn't in `APPLY_INTEREST_OPTIONS`.)

**`app/apply/page.tsx`: the sponsor nudge + coming-soon clause.**
- **Add a redirect nudge** near the form: **`Sponsoring the wrap? Start here.`** where `Start here` links to `/sponsor`. Spec in §7.3 (quiet `text-[13px] text-ink-3`, link `text-ink hover:text-gulf`). Place it directly under the interest select, or in the "What happens next" rail.
- **Hero sub** Now `One list for the drives, the tour, and the marketplace. We review every name and keep it small — no noise, no spam.` → **Final `One list for the drives, the tour, and the exotiq.rent marketplace (opening soon). We review every name and keep it small. No noise, no spam.`**
- **Kicker** Now `One list — drives, tour, and the marketplace` → **Final `One list for drives, tour, and the marketplace`**
- **STEP 3 body** Now `You get word before anyone else when the tour rolls through — and when exotiq.rent opens.` → **Final `You get word before anyone else when the tour rolls through, and when exotiq.rent opens.`**
- **Keep** the AEO anchor line already present (`...exotic-car marketplace, coming soon.`).

### 5.4 `/thank-you` (`app/thank-you/page.tsx`) · 🟡 make leads feel received; route off the dead page

Note: `/blog` is now live (3 posts), so `Read the stories` is a valid **secondary** everywhere. The swaps below just make the **primary** the most relevant substantive step per branch.

- **Sponsor branch** (`title-wrap` / `tour` / `drive` / `partnership`):
  - Now: head `Got it.` · body `Thanks for the interest in the wrap. We'll be in touch within a couple of days — this is a small operation, and a real person reads every note.` · primary `See the wrap opportunity`→/sponsor · secondary `Ride the tour`→/tour.
  - **Final:** head `Got it.` · body **`We've got your note. A real person reads every one, and we'll be in touch within a couple of days. This is a small operation.`** · **primary `Ride the tour`→/tour** · **secondary `See the wrap opportunity`→/sponsor.** *(Lead feels received, not sent to "start over.")*
- **`drives` branch:** keep head/body. **Swap CTAs → primary `Enter the drives`→/drives · secondary `Read the stories`→/blog.**
- **`access` branch:** body Now `...gets the keys to exotiq.rent — and when a drive rolls through your city.` → **Final `...gets the keys to exotiq.rent, and when a drive rolls through your city.`** **Swap CTAs → primary `What's coming`→/marketplace · secondary `Read the stories`→/blog.**
- **`default` branch:** body Now `...When a drive fits your city — or the tour rolls through — you'll be among the first to know.` → **Final `...When a drive fits your city, or the tour rolls through, you'll be among the first to know.`** **Swap CTAs → primary `Enter the drives`→/drives · secondary `Read the stories`→/blog.**
- **Design:** no layout change. The branch objects just change `body`, `primary`, `secondary`. One Gulf primary + one ghost secondary (existing pattern).

### 5.5 `/sponsor` (`app/sponsor/page.tsx`) · ✅ KEEP (em-dash cleanup only)

This is the model page: on-voice, canonical facts, AEO anchor present, uses `2017 Audi S8` correctly. No wording or structure changes. Punctuation only:
- Meta title: `Sponsor the wrap — Denver→Miami tour` → **`Sponsor the wrap · Denver→Miami tour`**
- Hero sub: `...best car markets — and the wrap on the car is still available.` → **`...best car markets, and the wrap on the car is still available.`**
- AEO paragraph: `...people who care about it — at drives, Cars & Coffee meets, and across 5,000 miles of public road.` → **`...people who care about it: at drives, Cars & Coffee meets, and across 5,000 miles of public road.`**
- Asset body: `A 2017 Audi S8 in heritage racing livery — a sleeper with real presence.` → **`A 2017 Audi S8 in heritage racing livery, a sleeper with real presence.`**
- Route body: `Every stop is an audience — a sunrise rollout into a curated Cars & Coffee.` → **`Every stop is an audience. A sunrise rollout into a curated Cars & Coffee.`**
- Form body: `We'll come back fast — this is a small operation.` → **`We'll come back fast. This is a small operation.`**

### 5.6 `/drives` (`app/drives/page.tsx`) · ✅ KEEP (em-dash cleanup only)

Healthy page: clean, canonical facts, AEO anchor + FAQ schema present. Use its phrasing as the canonical way to describe the drives elsewhere. Punctuation only:
- Meta title: `The Drives — invite-only sunrise drives` → **`The Drives · invite-only sunrise drives`**
- Step 1 body: `One name at a time. We review every one — this stays small on purpose.` → **`One name at a time. We review every one. This stays small on purpose.`**
- Step 3 body: `The last Sunday of the month, before the city wakes — ending somewhere worth parking.` → **`The last Sunday of the month, before the city wakes, ending somewhere worth parking.`**
- Hero sub: `Invite-only sunrise drives on the last Sunday of every month — a rollout before the city wakes, ending in a curated Cars & Coffee.` → **`Invite-only sunrise drives on the last Sunday of every month. A rollout before the city wakes, ending in a curated Cars & Coffee.`**
- Next-drive body: `Get on the list to hear first — invites go out a few days ahead of each sunrise.` → **`Get on the list to hear first. Invites go out a few days ahead of each sunrise.`**

### 5.7 `/marketplace` (`app/marketplace/page.tsx`) · ✅ KEEP (em-dash cleanup only)

The clearest coming-soon explainer on the site. The real fix is navigational (the Menu now links to it, §4.1). Punctuation only:
- Meta title: `exotiq.rent — Coming soon` → **`exotiq.rent · Coming soon`**
- Sub: `...it opens onto — coming soon.` → **`...it opens onto. Coming soon.`**
- Waitlist footnote: `...Separate from any existing booking — this is the new thing, built fresh.` → **`...Separate from any existing booking. This is the new thing, built fresh.`**
- Image alt: `A preview of the exotiq.rent marketplace — the exotic-car rental grid` → **`A preview of the exotiq.rent marketplace, the exotic-car rental grid`**

### 5.8 `/blog` (`app/blog/page.tsx`) · ✅ KEEP (now live; em-dash cleanup only)

Three posts render; the `[slug]` route exists; empty-state copy stays as a graceful fallback. Punctuation only:
- Meta title: `Stories — the drives, the tour & the cars` → **`Stories · the drives, the tour, and the cars`** (also `&` → `and`)
- Meta description: `Stories from Drive Exotiq — the sunrise drives, the Denver→Miami tour, the cars, and the community front door to exotiq.rent.` → **`Stories from Drive Exotiq: the sunrise drives, the Denver→Miami tour, the cars, and the community front door to exotiq.rent.`**
- Card CTA `Read the story →`: keep (CTA-library compliant).

## 6. Em-dash cleanup map (site-wide, every user-facing instance)

Complete inventory of visible `—` in copy. Most are specified in §3–5; the three at the bottom aren't referenced elsewhere, so their fix is inline here. Comments (`//`, `/* */`, JSDoc) contain em dashes too. **Ignore those, they aren't user-facing.**

| File | Instances | Replacement pattern | Specified in |
|---|---|---|---|
| `components/experience/frames.ts` | 4 (SB-04 body, SB-11 aria, SB-18 body, SB-19b kicker) | period / comma | §3.1 |
| `components/experience/ExperienceScroll.tsx` | 3 (Rent pillar, Gather pillar, footer brand line) | colon / period | §4.2 |
| `app/page.tsx` | 7 (DESCRIPTION, 4× tagline title, OG alt, sr-only join) | colon / comma; join optional | §5.1 |
| `app/layout.tsx` | 3 (default title, OG title, Twitter title) | colon | §5.1 |
| `app/tour/page.tsx` | 3 (title, description, hero sub) | period (folded into the §5.2 rewrites) | §5.2 |
| `app/apply/page.tsx` + `lib/interest.ts` | 4 (kicker, hero sub, step-3 body, select label) | "for" / period / comma | §5.3 |
| `app/thank-you/page.tsx` | 3 (sponsor, access, default bodies) | comma / period | §5.4 |
| `app/sponsor/page.tsx` | 6 | colon / comma / period | §5.5 |
| `app/drives/page.tsx` | 5 | period / comma / middot | §5.6 |
| `app/marketplace/page.tsx` | 4 | period / comma / middot | §5.7 |
| `app/blog/page.tsx` | 2 | colon / middot | §5.8 |

**Not referenced elsewhere (fix inline):**
- `app/dmca/page.tsx`: `entity="Exotiq Inc. — a Delaware C-Corporation"` → **`entity="Exotiq Inc., a Delaware C-Corporation"`** (legal page; low priority).
- `components/sponsor/RouteMap.tsx`: `aria-label="...ten markets from Denver to Miami — Denver, Dallas..."` → **`...ten markets from Denver to Miami: Denver, Dallas...`** (aria only; low priority).
- `components/tour/data.ts` — the only `—` is in a code comment. **No change.**

**Guardrail for Claude Code:** do a visual pass, not a blind find-and-replace. Replace only inside JSX text and string literals that render to the user; never touch comments, and never touch the en-dash range `summer–fall` or the `→` in `Denver→Miami`.

---

## 7. Net-new UI specs (the pieces that aren't just text)

The Menu component is fully specified in §4.1. Two smaller net-new elements:

### 7.1 The "Opening soon" chip (SB-04)
Purpose: give SB-04's coming-soon first-class *visual* weight (the audit's core ask) without another line of body copy.
- **Element:** a small eyebrow chip. Text `Opening soon`.
- **Style:** `inline-flex items-center rounded-sm border border-line px-2.5 py-1 text-[11px] tracking-[0.08em] text-ink-2`. Background transparent (or `surface`). **No Gulf, no glow.** It is a status, not an action.
- **Deliberately different from the page eyebrow:** page heroes use a `h-px w-8 bg-gulf` hairline + label as their kicker rule. The **film** reserves Gulf for its CTA choreography (the chrome bows out over accent beats), so the chip stays Gulf-free to avoid disturbing that accounting. Keep it `line`/`ink-2`.
- **Placement:** in the SB-04 copy block (which is `align: 'center'`), centered directly above the kicker/headline.
- **Motion:** inherits the beat's copy reveal; no separate animation. Reduced-motion: static, always visible.

### 7.2 The Menu control + sheet
Fully specified in **§4.1**. Summary for the build checklist: persistent Gulf-free `Menu` text trigger next to the wordmark, rendered in all three chrome states and on mobile; opens a `bg-canvas` full-bleed sheet (`z-[80]`) that reuses the Header mobile-sheet styling and the shared canonical `NAV` array; six destinations + the one Gulf `Get on the list` CTA; `Esc`/tap-to-close; body scroll lock; keeps the `sr-only` "Skip the film."

### 7.3 The `/apply` sponsor nudge
Purpose: give sponsor intent a visible off-ramp now that the sponsor option is gone from the select.
- **Copy:** `Sponsoring the wrap? Start here.` The `Start here` text links to `/sponsor`.
- **Style:** container `text-[13px] leading-relaxed text-ink-3 mt-3`; link `text-ink underline underline-offset-2 hover:text-gulf transition-colors duration-250`. No Gulf fill (not a primary action).
- **Placement:** directly beneath the interest `<Select>` in `ApplicationForm` (closest to the moment of intent). Acceptable alternate: in the "What happens next" rail.

## 8. Build order (prioritized checklist)

### 🔴 Blockers (do first)
- [ ] **SB-04** coming-soon to first-class weight: add the `Opening soon` chip + reframed body. `frames.ts` + §7.1. *(§3.1)*
- [ ] **SB-08** `Choose your car.` → `Which one's yours?` *(§3.1)*
- [ ] **Film Menu** affordance: persistent Gulf-free `Menu` → sheet with the six canonical destinations, shared `NAV` array, mobile-first. `ExperienceScroll.tsx` + `Header.tsx`. *(§4.1)*
- [ ] **/tour** add the missing AEO anchor, server-rendered. *(§5.2 #4)*

### 🟠 Major
- [ ] **/tour** rename The Journey → The Tour (meta title + kicker). *(§5.2 #1)*
- [ ] **/tour** `One built Audi S8` → `One 2017 Audi S8` (hero + meta). *(§5.2 #2)*
- [ ] **/tour** finale headline → `5,000 miles. Ten cities. One blank canvas.` (leave footer `4,980`). *(§5.2 #3)*
- [ ] **SB-18** pivot headline → `This one's the founder's.` (cut `The drive is the product.`). *(§3.1)*
- [ ] **SB-17** add value-bridge jewel `A billboard that drives.` *(§3.1)*
- [ ] **SB-11** add register-flag jewel `Not one of the three.` *(§3.1)*
- [ ] **/apply** remove Sponsor from the select (`lib/interest.ts`) + add the `/sponsor` nudge + sponsor-tier redirect guard + coming-soon clause in the hero sub. *(§5.3, §7.3)*
- [ ] **End-card + Header nav** add Marketplace, fix casing to canonical order, add Ferrari to the marque list. *(§4.2)*

### 🟡 Minor
- [ ] **SB-13b** cut one silent S8 beat. *(§3.1)*
- [ ] **SB-20** add plain gloss body. *(§3.1)*
- [ ] **SB-19** add `The sponsorship` kicker. *(§3.1)*
- [ ] **SB-19b** `Gregory — founder` → `Gregory, founder`. *(§3.1)*
- [ ] **/thank-you** reword sponsor branch (feel received) + swap primaries off `/blog`. *(§5.4)*
- [ ] **End-card** Partner pillar → drop `Bring us yours.` *(§4.2)*
- [ ] **/tour** hero jewel → `The long way south, on purpose.` (optional). *(§5.2 #5)*
- [ ] **Home meta** DESCRIPTION marque list → add Ferrari. *(§5.1)*
- [ ] **Site-wide em-dash pass** across all files. *(§6)*

---

## 9. Master copy map (single index)

Every copy change at a glance. `→` reads "becomes." Design-only items are marked *[design]*.

| # | Surface | File | Change (short) | § |
|---|---|---|---|---|
| 1 | SB-04 | frames.ts | + `Opening soon` chip; body → `exotiq.rent. The marketplace built for people who actually drive.` | 3.1 |
| 2 | SB-08 | frames.ts | `Choose your car.` → `Which one's yours?` | 3.1 |
| 3 | SB-11 | frames.ts | + jewel `Not one of the three.`; aria em-dash → period | 3.1 |
| 4 | SB-13b | frames.ts | **cut the beat** | 3.1 |
| 5 | SB-17 | frames.ts | + jewel `A billboard that drives.` | 3.1 |
| 6 | SB-18 | frames.ts | headline → `This one's the founder's.`; cut `The drive is the product.`; body em-dash → period | 3.1 |
| 7 | SB-19 | frames.ts | + kicker `The sponsorship` | 3.1 |
| 8 | SB-19b | frames.ts | kicker `Gregory — founder` → `Gregory, founder` | 3.1 |
| 9 | SB-20 | frames.ts | + body `Get on the list to drive. Sponsor the wrap for the tour.` | 3.1 |
| 10 | Film Menu | ExperienceScroll.tsx + Header.tsx | **new** persistent Menu → canonical six-destination sheet *[design]* | 4.1 |
| 11 | End-card nav | ExperienceScroll.tsx | add Marketplace; casing → `The Drives · The Tour · Marketplace · Stories · Sponsor` | 4.2 |
| 12 | End-card Rent | ExperienceScroll.tsx | + Ferrari; em-dash → colon | 4.2 |
| 13 | End-card Gather | ExperienceScroll.tsx | em-dash → period | 4.2 |
| 14 | End-card Partner | ExperienceScroll.tsx | drop `Bring us yours.` | 4.2 |
| 15 | End-card footer | ExperienceScroll.tsx | brand line em-dash → period | 4.2 |
| 16 | Home meta | page.tsx + layout.tsx | tagline/OG em-dash → colon; DESCRIPTION + Ferrari | 5.1 |
| 17 | /tour | tour/page.tsx | rename to The Tour; `2017 Audi S8`; finale `5,000 miles...`; **+ AEO anchor**; jewel | 5.2 |
| 18 | /apply | apply/page.tsx + lib/interest.ts | remove Sponsor option; + nudge + redirect guard; coming-soon sub; em-dash | 5.3, 7.3 |
| 19 | /thank-you | thank-you/page.tsx | sponsor branch reworded; primaries swapped off /blog; em-dash | 5.4 |
| 20 | /sponsor | sponsor/page.tsx | em-dash cleanup only (6) | 5.5 |
| 21 | /drives | drives/page.tsx | em-dash cleanup only (5) | 5.6 |
| 22 | /marketplace | marketplace/page.tsx | em-dash cleanup only (4) | 5.7 |
| 23 | /blog | blog/page.tsx | em-dash cleanup only (2) | 5.8 |
| 24 | /dmca, RouteMap | dmca/page.tsx, RouteMap.tsx | em-dash cleanup (low priority) | 6 |

---

*End of handoff. Copy is decided; forks in §2 ship their Recommended line unless Gregory strikes it. Facts are canonical per §1.3. Do not re-invent the car, the mileage, or the marque list.*






