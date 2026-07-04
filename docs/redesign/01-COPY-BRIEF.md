# COPY-BRIEF.md — driveexotiq.com

> The working copy document for **driveexotiq.com**. Gregory + Claude Cowork fill the `⟦FILL⟧` slots here; the filled text drops straight into the BUILD-SPEC slot IDs (`H0-PROMISE`, `T-CITY-1-NAME`, etc.).
>
> **How to use this doc:** every slot has (1) a guidance line — what it is, length, tone — and (2) a **SEED** you can ship or edit. Editing a strong seed is faster than starting blank. When a seed already works, mark it ✅ and move on.
>
> Drive Exotiq is an **Exotiq Inc. brand** — the community/culture **front door** to **exotiq.rent** (exotic-car rental marketplace, *coming soon*).
> Tagline: **"Built for the people who actually drive the car."**

---

## 0. How to fill this in fast

1. Work **top to bottom by page**. Each page block lists its slots in render order.
2. Respect the **length guidance** — these are real layout constraints (a headline that's 3 words too long breaks the mask-up reveal).
3. Keep the **VOICE GUIDE** (§1) open. Read a seed out loud; if it sounds like an ad, rewrite.
4. Drop the **AEO anchor sentence** (§1.3) verbatim into at least one place per page (usually a subhead or body line). This is non-negotiable for AI-search.
5. Slots marked **🔴 BLOCKING** must be done before that page can ship. Everything else can ship with the seed.
6. When done with a slot, replace `⟦FILL: …⟧` with final text and check the box.

**Legend:** 🔴 = blocking · 🟡 = ships on seed, refine later · ✅ = seed is final-quality · `[N ch]` = character target (incl. spaces) · `[N words]` = word target

---

## 1. THE VOICE GUIDE

### 1.1 Who we sound like

Drive Exotiq is the voice of someone who **owns the car and actually drives it** — not the dealer, not the influencer, not the rental desk. Calm, certain, a little dry. We don't hype because we don't need to. The car, the road, and the people are the proof.

Think: **Amex Centurion** restraint + **Porsche** product confidence + an enthusiast who'd rather show you than tell you. Quiet luxury means we leave room. The most expensive thing on the page is the white space.

**Three voice pillars:**
| Pillar | Means | In practice |
|---|---|---|
| **Confident** | We state, we don't sell. Periods, not exclamation points. | "One car. Denver to Miami. Ten markets." |
| **Enthusiast-credible** | Real specifics a gearhead respects. Numbers, model years, mileage. | "A 2017 Audi S8 — heritage racing livery, sleeper." |
| **Quiet-luxury** | Understated, spare, never gaudy. Earned, not announced. | "Before the city wakes." |

### 1.2 Do / Don't

| ✅ DO | ❌ DON'T |
|---|---|
| "Last Sunday of the month. Before the city wakes." | "Join our EXCLUSIVE monthly meetups!!" |
| "Built for the people who actually drive the car." | "For true car ENTHUSIASTS and luxury lovers." |
| "One car. Ten markets. 5,000 miles." | "An UNFORGETTABLE epic journey across America!" |
| "The keys are coming out of the glovebox." | "Get ready for the RENTAL REVOLUTION." |
| "Your livery on this car, down this line." | "Unlock INSANE brand exposure & maximize ROI!" |
| Short declaratives. Concrete nouns. One idea per line. | Stacked adjectives, hype words, emoji, ALL-CAPS. |
| Sentence-case kickers (rule: never uppercase). | "EXCLUSIVE • PREMIUM • LIMITED" kicker labels. |
| Let silence do work. End on a noun or a fact. | Over-explain. Three sentences where one lands. |

**Banned words/moves:** *unforgettable, epic, revolution, game-changing, unlock, elevate, curated experience (as filler), insane, ROI-speak, exclusivity-as-bragging, multiple exclamation points, ALL CAPS for emphasis, emoji.*

**Allowed jewelry:** one Spectral italic line per scene for the emotional register (e.g. *before the city wakes*). Use sparingly — it's the gold accent of the writing.

### 1.3 The AEO anchor sentence (repeat across the site)

Use this sentence — or a light variant that keeps the bolded entities — at least once per page, ideally in a server-rendered subhead or body paragraph so crawlers and AI answer-engines pick it up:

> **Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace.**

Approved variants (keep the three entities + the "front door" relationship):
- "Drive Exotiq is the community and culture front door to **exotiq.rent**, the exotic-car rental marketplace (coming soon)."
- "An Exotiq Inc. brand, Drive Exotiq is the community front door to the **exotiq.rent** marketplace."
- Ecosystem line: "Drive Exotiq (community) → exotiq.rent (marketplace) → exotiq.ai (intelligence)."

### 1.4 Recurring facts (use these exact numbers — never invent)

| Fact | Canonical phrasing |
|---|---|
| The drives | Invite-only, **last Sunday of the month**, sunrise rollout → curated Cars & Coffee |
| The tour car | **2017 Audi S8**, heritage racing livery, sleeper |
| The route | **Denver → Miami**, **~5,000 miles**, **10 markets**, summer→fall **2026** |
| The 10 markets | Denver · Dallas/Ft Worth · Austin · Houston · New Orleans · Tampa/St Pete · Orlando · Palm Beach · Ft Lauderdale · Miami |
| The marketplace | exotiq.rent — exotic-car rental marketplace, **coming soon** |
| The ask (sponsor) | Seeking a **wrap sponsor**; tiers: Title/Wrap, Tour, Drive |
| The brand | An **Exotiq Inc.** brand |
| The R8→S8 thread | R8 = dawn (HOME arrival / tour cold-open); S8 = dusk (tour finale / sponsor hero) — one journey, two moments of light |

---

## 2. THE CTA LIBRARY (reusable — pick from this list, don't reinvent)

Use **one gulf primary CTA per viewport** (design rule). Secondaries are ghost/text links.

| CTA ID | Label (≤4 words) | Where it goes | Use on |
|---|---|---|---|
| `CTA-LIST` | **Get on the list** | /apply funnel | HOME close, /community, blog, global default |
| `CTA-SPONSOR` | **See the wrap opportunity** | /sponsor | HOME sponsor room |
| `CTA-SPONSOR-2` | **Sponsor the wrap** | /sponsor | /tour finale |
| `CTA-SPONSOR-START` | **Start a sponsorship conversation** | sponsor form submit | /sponsor form |
| `CTA-TOUR` | **Ride the tour** | /tour | HOME tour room |
| `CTA-DRIVES` | **Enter the drives** | /drives | HOME drives room |
| `CTA-COMMUNITY` | **Meet the community** | /community | HOME community room |
| `CTA-WAITLIST` | **Join the waitlist** | /marketplace | HOME marketplace room, /marketplace |
| `CTA-INVITE` | **Request your invite** | /apply (drive context) | /drives close |
| `CTA-RSVP` | **RSVP for this drive** | /apply (pre-filled) | /drives next-drive card (when RSVP open) |
| `CTA-READ` | **Read the story** | /blog/[slug] | blog index card |
| `CTA-PARTNER` | **Partner with us** | /sponsor?interest=partnership | /experience end-card pillar 4, future partner touchpoints |
| `CTA-STORIES` | **Read the stories** | /blog | secondary on HOME/footer |
| `CTA-SCROLL` | **Walk the garage ↓** | scroll cue | HOME H0 |

**Secondary (ghost/text) pattern:** every primary may pair with one quiet text link. Default secondary = **"Get on the list"** unless the primary IS that.

---

## 3. RECURRING MICROCOPY (write once, reuse everywhere)

| Microcopy ID | Where | SEED | Status |
|---|---|---|---|
| `MC-LIVE-DOT` | gulf "live" label on open RSVP / next drive | "RSVP open" | 🟡 |
| `MC-COMING-SOON` | marketplace + teaser states | "Coming soon" | ✅ |
| `MC-INVITE-ONLY` | drives badge | "Invite only" | ✅ |
| `MC-BRAND-LINE` | footer + sub slots | "An Exotiq Inc. brand." | ✅ |
| `MC-FORM-EMAIL` | email field label/placeholder | "Email address" | ✅ |
| `MC-FORM-REQUIRED` | required-field hint | "Required" | ✅ |
| `MC-FORM-CONSENT` | SMS consent line | "I agree to receive texts about drives and tour updates. Reply STOP to opt out." | 🟡 |
| `MC-FORM-PRIVACY` | under any form | "We never sell your info. One list, no noise." | 🟡 |
| `MC-FORM-SUBMITTING` | button loading | "Sending…" | ✅ |
| `MC-FORM-ERROR` | generic error (papaya) | "Something didn't go through. Try again?" | ✅ |
| `MC-ODO-IDLE` | telemetry idle | "000000" | ✅ |
| `MC-LEG-METER` | /tour persistent meter | "LEG 04 / 10 · 1,920 mi" (dynamic) | ✅ |
| `MC-SKIP` | skip-to-content link | "Skip to content" | ✅ |
| `MC-SCROLL-HINT` | generic scroll affordance | "Scroll ↓" | ✅ |
| `MC-404-HEAD` | not-found | "This road doesn't exist." | 🟡 |
| `MC-404-BODY` | not-found | "Let's get you back on route." | 🟡 |
| `MC-NAV` | header nav items | "The Drives · The Tour · Community · Marketplace · Stories" | ✅ |

---

## 4. GLOBAL — Header, Footer, Meta defaults

### 4.1 Header (`CMP-HDR`) 🔴 BLOCKING (global)

| Slot | Guidance | SEED | ☐ |
|---|---|---|---|
| Wordmark | brand text/logo lockup | Drive Exotiq | ☐ |
| Nav items | 5 items, sentence/title case, no caps | The Drives · The Tour · Community · Marketplace · Stories | ☐ |
| Header CTA | the one persistent gulf action | Get on the list | ☐ |

### 4.2 Footer (`CMP-FTR`) 🟡

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `FTR-TAGLINE` | the tagline, full | Built for the people who actually drive the car. | ☐ |
| `FTR-BRAND` | brand attribution + AEO entities | An Exotiq Inc. brand. The community front door to exotiq.rent. | ☐ |
| `FTR-ECO` | one-line ecosystem | Drive Exotiq · exotiq.rent · exotiq.ai | ☐ |
| `FTR-NEWSLETTER` | optional list prompt [≤8 words] | One list. Drives, tour, and the marketplace. | ☐ |
| `FTR-LEGAL` | copyright | © 2026 Exotiq Inc. All rights reserved. | ☐ |

### 4.3 Global meta defaults (used by metadataBase + per-page overrides)

| Slot | Guidance | SEED | ☐ |
|---|---|---|---|
| Default meta title template | `%s · Drive Exotiq` — keep brand suffix on every page | `%s · Drive Exotiq` | ☐ |
| Site name | OG site_name | Drive Exotiq | ☐ |
| Default OG description | [≤155 ch] used where a page has none | The community front door to the exotiq.rent exotic-car marketplace. Monthly sunrise drives, the Denver→Miami tour, and what's coming next. | ☐ |

---

## 5. HOME — "The Garage" 🔴 (Phase 1 showpiece)

> Every line here is one room's single legible idea. Keep each `*-LINE` to **one sentence, ≤9 words**. They must read at a glance to a cold QR walk-up.

### 5.1 SCENE-H0 — Arrival (cold-open) 🔴 BLOCKING

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `H0-WORDMARK-LOCKUP` | brand mark, masks up over R8 | Drive Exotiq | ☐ |
| `H0-PROMISE` | the hero promise — tagline or sharper variant [≤9 words] | Built for the people who actually drive the car. | ☐ |
| `H0-SUB` | one positioning line w/ AEO entities [≤14 words] | An Exotiq Inc. brand — the community front door to the exotiq.rent marketplace. | ☐ |
| `H0-CUE` | gulf scroll cue [≤4 words] | Walk the garage ↓ | ☐ |

### 5.2 SCENE-H1 — The Drives 🔴

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `H1-LINE` | one line, the heart of community [≤8 words] | Last Sunday of the month. Before the city wakes. | ☐ |
| `H1-MICRO` | mini-proof support (next-drive teaser fallback) [≤6 words] | Invite-only sunrise drives. | ☐ |
| `H1-ENTER` | route affordance | Enter the drives → | ☐ |

### 5.3 SCENE-H2 — The Tour 🔴

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `H2-LINE` | the route in numbers [≤9 words] | One car. Denver to Miami. Ten markets. 5,000 miles. | ☐ |
| `H2-MICRO` | telemetry teaser caption | Summer→fall 2026. | ☐ |
| `H2-ENTER` | route affordance (camera continuity) | Ride the tour → | ☐ |

### 5.4 SCENE-H3 — The Community 🟡

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `H3-LINE` | the people line [≤9 words] | Built for the people who actually drive the car. | ☐ |
| `H3-MICRO` | ecosystem whisper | Drive Exotiq → exotiq.rent → exotiq.ai | ☐ |
| `H3-ENTER` | route affordance | Meet the community → | ☐ |

### 5.5 SCENE-H4 — The Marketplace (quietest) 🟡

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `H4-LINE` | teaser line, restrained [≤9 words] | The keys are coming out of the glovebox. | ☐ |
| `H4-MICRO` | status | exotiq.rent · coming soon | ☐ |
| `H4-ENTER` | route affordance | Join the waitlist → | ☐ |

### 5.6 SCENE-H5 — The Sponsor (conversion crescendo) 🔴

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `H5-LINE` | the wrap pitch, vivid [≤9 words] | Your livery on this car. Down this line. Ten cities. | ☐ |
| `H5-MICRO` | the ask | One wrap sponsor. 5,000 miles of road. | ☐ |
| `H5-ENTER` | primary gulf CTA | See the wrap opportunity → | ☐ |

### 5.7 SCENE-H6 — The close / CTA 🔴

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `H6-CLOSER` | the send-off line as the door opens [≤12 words] | The garage door is open. The road starts here. | ☐ |
| `H6-CTA-LABEL` | the one gulf CTA | Get on the list | ☐ |
| `H6-SECONDARY` | ghost link | Read the stories | ☐ |

### 5.8 HOME meta 🔴

| Slot | Guidance | SEED | ☐ |
|---|---|---|---|
| HOME meta title | [≤60 ch] brand-forward, positioning | Drive Exotiq — Built for the People Who Drive the Car | ☐ |
| HOME meta description | [≤155 ch] AEO anchor + the three draws | The community front door to the exotiq.rent exotic-car marketplace. Invite-only sunrise drives, the Denver→Miami tour, and what's coming. | ☐ |

---

## 6. /tour — THE JOURNEY 🔴 (Phase 1 showpiece)

> City beats: each `-NAME` is the city; `-DEK` is the one-line emotional register (Spectral italic OK); `-LEG-MI` is the leg distance; `-NOTE` is one gearhead/telemetry fact. Keep DEKs to **≤10 words**, NOTEs to **≤12 words**.
>
> **Open decision (§10.5 of spec):** 10 beats vs 9 (Palm Beach & Ft Lauderdale combined). This brief lists **10 beats**; if you combine, delete beat 9 and renumber, and update `MC-LEG-METER` to "/ 9".

### 6.1 SCENE-T0 — Pre-dawn idle 🔴

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `T0-INTRO` | cold-open line, the S8 idling in the dark [≤12 words] | Before first light, in Denver, the engine is already warm. | ☐ |
| `T0-SUB` | positioning + AEO [≤16 words] | One car, ten markets, 5,000 miles — Drive Exotiq's Denver-to-Miami exotic tour, summer→fall 2026. | ☐ |

### 6.2 SCENE-T1…T10 — The ten city beats 🔴 (NAME + LEG-MI blocking; DEK/NOTE 🟡)

> Fill the table. `LEG-MI` = miles for *that leg*; cumulative odometer is computed in-build. Seeds for DEK/NOTE are starters — Gregory/Cowork should sharpen with real route detail.

| # | City (`-NAME`) | `-DEK` SEED (≤10 wds) | `-LEG-MI` SEED | `-NOTE` SEED (≤12 wds) | ☐ |
|---|---|---|---|---|---|
| 1 | Denver | *Where the air is thin and the road begins.* | 0 mi (start) | Mile zero. The S8 wakes at altitude. | ☐ |
| 2 | Dallas / Ft Worth | *Down out of the mountains, into the flat fast dark.* | ~660 mi | First long haul. Big sky, bigger straights. | ☐ |
| 3 | Austin | *Where the cars and the people get a little weirder.* | ~200 mi | A sleeper S8 fits right in here. | ☐ |
| 4 | Houston | *Heat, horsepower, and humidity.* | ~165 mi | The first taste of Gulf air. | ☐ |
| 5 | New Orleans | *The road turns south and slows down to listen.* | ~350 mi | Brake check after the longest dry leg. | ☐ |
| 6 | Tampa / St Pete | *Across the Gulf coast, into the Florida light.* | ~680 mi | The longest single leg of the tour. | ☐ |
| 7 | Orlando | *Inland for a night, then back toward the water.* | ~85 mi | Shortest hop. Cars & Coffee territory. | ☐ |
| 8 | Palm Beach | *Where the money idles at the curb.* | ~180 mi | The S8's sleeper disguise earns its keep. | ☐ |
| 9 | Ft Lauderdale | *Down the coast, top down on the A1A.* | ~25 mi | Slowest, prettiest miles of the whole route. | ☐ |
| 10 | Miami | *The end of the line, under a falling sun.* | ~30 mi | Odometer reads ~4,980. The tour arrives. | ☐ |

### 6.3 SCENE-T-FINALE — Miami / the wrap 🔴

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `T-FINALE-HEAD` | the arrival + the ask [≤10 words] | 5,000 miles. Ten cities. One blank canvas. | ☐ |
| `T-FINALE-SUB` | the wrap pitch [≤18 words] | This is the car. This is the route. The wrap is still yours to claim. | ☐ |
| `T-FINALE-CTA` | primary gulf CTA | Sponsor the wrap | ☐ |
| `T-FINALE-SECONDARY` | ghost link | Get on the list | ☐ |

### 6.4 /tour meta 🔴

| Slot | Guidance | SEED | ☐ |
|---|---|---|---|
| meta title | [≤60 ch] | The Exotic Tour — Denver to Miami · Drive Exotiq | ☐ |
| meta description | [≤155 ch] route facts + sponsor hook | One 2017 Audi S8, ten markets, 5,000 miles from Denver to Miami in 2026. Drive Exotiq's exotic tour — seeking a wrap sponsor. | ☐ |

---

## 7. /drives — THE DRIVES 🟡 (Phase 2)

### 7.1 Signature dawn hero 🔴 (for this page)

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `DR-HERO-EYEBROW` | sentence-case kicker [≤4 words] | Invite only | ☐ |
| `DR-HERO-HEAD` | what a drive is [≤8 words] | The last Sunday. The first light. | ☐ |
| `DR-HERO-SUB` | the format, plainly [≤22 words] | Invite-only sunrise drives on the last Sunday of every month — a rollout before the city wakes, ending in a curated Cars & Coffee. | ☐ |
| `DR-HERO-CTA` | primary | Request your invite | ☐ |

### 7.2 Next drive card (`CMP-EVT`) 🟡 — copy is Airtable-driven; static fallback below

| Slot ID | Guidance | SEED (fallback) | ☐ |
|---|---|---|---|
| `DR-NEXT-LABEL` | card label | Next drive | ☐ |
| `DR-NEXT-FALLBACK` | when feed empty [≤12 words] | The next drive is being routed. Get on the list to hear first. | ☐ |
| `DR-NEXT-RSVP` | open state CTA | RSVP for this drive | ☐ |

### 7.3 How an invite works 🟡

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `DR-INVITE-HEAD` | [≤6 words] | How an invite works | ☐ |
| `DR-INVITE-BODY` | the path, 3 short steps [≤45 words] | Get on the list. We review every name — this stays small on purpose. When a drive fits your city, your invite and the meet point land in your inbox a few days ahead. | ☐ |
| `DR-INVITE-STEP-1` | step [≤6 words] | Get on the list. | ☐ |
| `DR-INVITE-STEP-2` | step [≤6 words] | We review and invite. | ☐ |
| `DR-INVITE-STEP-3` | step [≤6 words] | You roll out at sunrise. | ☐ |

### 7.4 Cars & Coffee 🟡

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `DR-CNC-HEAD` | [≤5 words] | And then, coffee. | ☐ |
| `DR-CNC-BODY` | the after-event [≤35 words] | Every drive ends somewhere worth parking — a curated Cars & Coffee where founders, enthusiasts, and sponsors actually talk. No stanchions, no judging. Just the cars and the people who drive them. | ☐ |

### 7.5 Invite Q&A (powers FAQPage JSON-LD) 🟡

> Write 4–6 Q&A pairs. Keep answers ≤40 words; lead with the direct answer (AEO).

| Q (SEED) | A (SEED) | ☐ |
|---|---|---|
| Who can join a Drive Exotiq drive? | Drives are invite-only. Get on the list and we'll invite you when a drive fits your city. It stays small on purpose. | ☐ |
| When do the drives happen? | The last Sunday of every month, at sunrise, followed by a curated Cars & Coffee. | ☐ |
| What kind of car do I need? | If you actually drive it, you belong. We care about the driver more than the badge. | ☐ |
| Is there a cost? | No. The drives are how the Drive Exotiq community is built, not a product. | ☐ |
| How is this related to exotiq.rent? | Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace, coming soon. | ☐ |

### 7.6 Close + meta 🟡

| Slot | Guidance | SEED | ☐ |
|---|---|---|---|
| `DR-CLOSE` | send-off [≤10 words] | The next sunrise is closer than you think. | ☐ |
| meta title | [≤60 ch] | The Drives — Invite-Only Sunrise Drives · Drive Exotiq | ☐ |
| meta description | [≤155 ch] | Invite-only sunrise drives on the last Sunday of every month, followed by a curated Cars & Coffee. Request your invite to Drive Exotiq. | ☐ |

---

## 8. /community — THE COMMUNITY 🟡 (Phase 2)

### 8.1 Story / origin 🔴 (for this page)

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `CM-STORY-EYEBROW` | kicker [≤3 words] | The why | ☐ |
| `CM-STORY-HEAD` | [≤8 words] | Built for the people who actually drive. | ☐ |
| `CM-STORY-BODY` | founding belief, "keys out of the glovebox" [≤70 words] | The best cars don't belong in glass cases. They belong on the road, at sunrise, with people who know what they're holding. Drive Exotiq started as a standing invitation: bring the car you actually drive, and let's drive it. The marketplace, exotiq.rent, grew out of the same belief — that great cars are meant to be used. | ☐ |

### 8.2 The people 🟡

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `CM-PEOPLE-HEAD` | [≤6 words] | Founders, enthusiasts, and the curious. | ☐ |
| `CM-PEOPLE-SUB` | [≤25 words] | Owners who drive, founders building the marketplace, and sponsors who get it. The room is small and the conversation is real. | ☐ |

### 8.3 Ecosystem diagram (`CMP-ECO`) 🔴

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `CM-ECO-HEAD` | [≤6 words] | One company, three doors. | ☐ |
| `CM-ECO-NODE-1` | node label + role | Drive Exotiq — community | ☐ |
| `CM-ECO-NODE-2` | node label + role | exotiq.rent — marketplace | ☐ |
| `CM-ECO-NODE-3` | node label + role | exotiq.ai — intelligence | ☐ |
| `CM-ECO-CAPTION` | AEO anchor [≤20 words] | Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace. An Exotiq Inc. brand. | ☐ |

### 8.4 Values / what we are not 🟡

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `CM-VALUES-HEAD` | [≤6 words] | What we are. What we're not. | ☐ |
| `CM-VALUES` | 3–4 short contrasts, hairline list [≤50 words] | Quiet, not loud. Driven, not displayed. Invitation, not membership tiers. We'd rather be small and real than big and hollow. | ☐ |

### 8.5 Close + meta 🟡

| Slot | Guidance | SEED | ☐ |
|---|---|---|---|
| `CM-CLOSE` | [≤8 words] | If this sounds like you, you're already in. | ☐ |
| meta title | [≤60 ch] | The Community — An Exotiq Inc. Brand · Drive Exotiq | ☐ |
| meta description | [≤155 ch] | Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace. Meet the founders, enthusiasts, and sponsors behind it. | ☐ |

---

## 9. /sponsor — SPONSOR 🔴 (Phase 1 conversion surface)

> This is the most persuasive page on the site and the #1 audience. Be concrete: numbers, markets, the asset. Still no hype. Confidence sells here, not adjectives.

### 9.1 The opportunity 🔴

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `SP-OPP-EYEBROW` | kicker [≤4 words] | The wrap is open | ☐ |
| `SP-OPP-HEAD` | the offer in one line [≤10 words] | One car. Ten markets. 5,000 miles of road. | ☐ |
| `SP-OPP-SUB` | the pitch [≤30 words] | A single exotic tour from Denver to Miami in 2026, through ten of the country's best car markets — and the wrap on the car is still available. | ☐ |
| `SP-OPP-BODY` | context [≤55 words] | Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace. The 2026 tour puts one unmistakable car in front of the exact people who care about it — at drives, Cars & Coffee meets, and across 5,000 miles of public road. Your brand rides shotgun the whole way. | ☐ |

### 9.2 The asset 🔴

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `SP-ASSET-HEAD` | [≤6 words] | The car is a billboard that drives. | ☐ |
| `SP-ASSET-BODY` | the S8, specifically [≤45 words] | A 2017 Audi S8 in heritage racing livery — a sleeper with real presence. It spends the summer and fall of 2026 being seen: at sunrise drives, parked at curated meets, and moving between ten major markets. The wrap is the blank canvas. | ☐ |
| `SP-ASSET-CANVAS-CAP` | caption on blank-wrap view [≤8 words] | Your livery goes here. | ☐ |

### 9.3 Route as media-value map (`CMP-MVM`) 🔴 (data) — fill per market

> For each of the ten markets give: estimated reach, audience, and an activation. Use real/defensible numbers; round honestly. These power both copy and the JSON-LD.

| Market | `reach` (est. impressions) | `audience` (one phrase) | `activation` (one phrase) | ☐ |
|---|---|---|---|---|
| Denver | ⟦FILL⟧ | ⟦FILL: e.g. mountain-state enthusiasts⟧ | ⟦FILL: e.g. sunrise rollout + C&C⟧ | ☐ |
| Dallas / Ft Worth | ⟦FILL⟧ | ⟦FILL⟧ | ⟦FILL⟧ | ☐ |
| Austin | ⟦FILL⟧ | ⟦FILL⟧ | ⟦FILL⟧ | ☐ |
| Houston | ⟦FILL⟧ | ⟦FILL⟧ | ⟦FILL⟧ | ☐ |
| New Orleans | ⟦FILL⟧ | ⟦FILL⟧ | ⟦FILL⟧ | ☐ |
| Tampa / St Pete | ⟦FILL⟧ | ⟦FILL⟧ | ⟦FILL⟧ | ☐ |
| Orlando | ⟦FILL⟧ | ⟦FILL⟧ | ⟦FILL⟧ | ☐ |
| Palm Beach | ⟦FILL⟧ | ⟦FILL⟧ | ⟦FILL⟧ | ☐ |
| Ft Lauderdale | ⟦FILL⟧ | ⟦FILL⟧ | ⟦FILL⟧ | ☐ |
| Miami | ⟦FILL⟧ | ⟦FILL⟧ | ⟦FILL⟧ | ☐ |

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `SP-MVM-HEAD` | section head [≤8 words] | The route is the media plan. | ☐ |
| `SP-MVM-SUB` | [≤20 words] | Every stop is an audience. Hover a market to see who's there and how your brand shows up. | ☐ |

### 9.4 Tiers (`CMP-TIERS`) 🔴 — three tiers

> Title/Wrap is the headline tier. Don't price publicly unless Gregory confirms — use "Inquire" by default.

**Tier 1 — Title / Wrap** (the headline)
| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `SP-TIER-1-NAME` | name | Title Wrap Sponsor | ☐ |
| `SP-TIER-1-TAG` | one-liner [≤9 words] | Your livery on the car for all 5,000 miles. | ☐ |
| `SP-TIER-1-INCLUDES` | 3–5 bullet inclusions [each ≤8 words] | Full vehicle wrap · Naming on the tour · Every drive + meet · Content rights · First right of renewal | ☐ |
| `SP-TIER-1-PRICE` | price or "Inquire" | Inquire | ☐ |

**Tier 2 — Tour**
| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `SP-TIER-2-NAME` | name | Tour Sponsor | ☐ |
| `SP-TIER-2-TAG` | [≤9 words] | A panel on the car and presence in every market. | ☐ |
| `SP-TIER-2-INCLUDES` | bullets | Panel placement · Logo across the route · Market activations · Content rights | ☐ |
| `SP-TIER-2-PRICE` | | Inquire | ☐ |

**Tier 3 — Drive**
| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `SP-TIER-3-NAME` | name | Drive Sponsor | ☐ |
| `SP-TIER-3-TAG` | [≤9 words] | Present a single sunrise drive and its Cars & Coffee. | ☐ |
| `SP-TIER-3-INCLUDES` | bullets | One drive presented · On-site presence · Cars & Coffee branding · Photography | ☐ |
| `SP-TIER-3-PRICE` | | Inquire | ☐ |

### 9.5 Proof 🟡

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `SP-PROOF-HEAD` | [≤6 words] | This already works. | ☐ |
| `SP-PROOF-BODY` | past drives / attendance / who shows [≤40 words] | The drives have been running monthly with founders, serious owners, and sponsors in the room. The audience is small, real, and exactly who you want your brand parked next to. ⟦FILL: add real attendance / city / count⟧ | ☐ |
| `SP-PROOF-STAT-1` | a number [label + value] | ⟦FILL: e.g. 12 drives in 2025⟧ | ☐ |
| `SP-PROOF-STAT-2` | a number | ⟦FILL: e.g. avg. cars per meet⟧ | ☐ |
| `SP-PROOF-STAT-3` | a number | ⟦FILL: e.g. markets in 2026⟧ → 10 | ☐ |

### 9.6 Inquiry form (`CMP-FORM-SPONSOR`) 🔴

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `SP-FORM-HEAD` | [≤8 words] | Let's talk about the wrap. | ☐ |
| `SP-FORM-SUB` | [≤20 words] | Tell us a little about your brand and which tier fits. We'll come back fast — this is a small operation. | ☐ |
| `SP-FORM-NAME` | field label | Your name | ☐ |
| `SP-FORM-COMPANY` | field label | Company | ☐ |
| `SP-FORM-EMAIL` | field label | Email address | ☐ |
| `SP-FORM-PHONE` | field label | Phone (optional) | ☐ |
| `SP-FORM-INTEREST` | select label | Sponsorship interest | ☐ |
| `SP-FORM-INTEREST-OPTS` | select options | Title / Wrap · Tour · Drive · Event partnership · Not sure yet | ☐ |
| | | *(`?interest=partnership` in the URL pre-selects Event partnership — the /experience end card already links this way; wire it when the form is built)* | |
| `SP-FORM-BUDGET` | select label | Budget range | ☐ |
| `SP-FORM-MESSAGE` | field label | Anything else? | ☐ |
| `SP-FORM-CTA` | submit (gulf) | Start a sponsorship conversation | ☐ |
| `SP-FORM-SUCCESS` | success state [≤18 words] | Got it. We'll be in touch within a couple of days — keep an eye on your inbox. | ☐ |

### 9.7 /sponsor meta 🔴

| Slot | Guidance | SEED | ☐ |
|---|---|---|---|
| meta title | [≤60 ch] | Sponsor the Wrap — Denver→Miami Tour · Drive Exotiq | ☐ |
| meta description | [≤155 ch] | Wrap one exotic car driven across ten markets and 5,000 miles in 2026. Title, Tour, and Drive sponsorships open now at Drive Exotiq. | ☐ |

---

## 10. /marketplace — exotiq.rent teaser + waitlist 🟡 (Phase 2)

> The quietest page. Tease, don't oversell. No fake product UI in the copy either — no feature lists that imply it's live.

### 10.1 Teaser hero 🔴 (for this page)

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `MK-HERO-EYEBROW` | status kicker [≤2 words] | Coming soon | ☐ |
| `MK-HERO-HEAD` | the wordmark line [≤6 words] | exotiq.rent | ☐ |
| `MK-HERO-LINE` | one line of what it is [≤12 words] | The exotic-car rental marketplace, built for people who actually drive. | ☐ |
| `MK-HERO-SUB` | AEO + relationship [≤20 words] | Drive Exotiq is the community front door. exotiq.rent is the marketplace it opens onto — coming soon. | ☐ |

### 10.2 What's coming (3 quiet promises) 🟡

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `MK-PROMISE-1` | [≤8 words] | A curated marketplace, not a parking lot. | ☐ |
| `MK-PROMISE-2` | [≤8 words] | Cars from people who drive them. | ☐ |
| `MK-PROMISE-3` | [≤8 words] | Built by the people behind the drives. | ☐ |

### 10.3 Waitlist form (`CMP-FORM-WAITLIST`) 🔴

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `MK-FORM-HEAD` | [≤8 words] | Be first when the keys drop. | ☐ |
| `MK-FORM-EMAIL` | field | Email address | ☐ |
| `MK-FORM-CITY` | optional field | City (optional) | ☐ |
| `MK-FORM-CAR` | optional field | What would you want to drive? (optional) | ☐ |
| `MK-FORM-CTA` | submit | Join the waitlist | ☐ |
| `MK-FORM-SUCCESS` | [≤15 words] | You're on the list. We'll reach out before anyone else gets the keys. | ☐ |
| `MK-SILO-NOTE` | relationship note [≤25 words] | Drive Exotiq is the front door; exotiq.rent is the marketplace. Separate from any existing booking — this is the new thing, built fresh. | ☐ |

### 10.4 /marketplace meta 🟡

| Slot | Guidance | SEED | ☐ |
|---|---|---|---|
| meta title | [≤60 ch] | exotiq.rent — Coming Soon · Drive Exotiq | ☐ |
| meta description | [≤155 ch] | exotiq.rent is the exotic-car rental marketplace, coming soon. Drive Exotiq is its community front door. Join the waitlist. | ☐ |

---

## 11. /blog — STORIES (index) 🟡 (Phase 2)

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `BLOG-INDEX-EYEBROW` | kicker [≤2 words] | Stories | ☐ |
| `BLOG-INDEX-HEAD` | [≤6 words] | Notes from the road and the garage. | ☐ |
| `BLOG-INDEX-INTRO` | [≤30 words] | The drives, the tour, the cars, and the people who keep showing up. Plus what's coming with exotiq.rent. Drive Exotiq, in long form. | ☐ |
| `BLOG-FILTER-LABELS` | category chips | Drives · Tour · Cars · Community | ☐ |
| `BLOG-CARD-CTA` | per-card link | Read the story → | ☐ |
| meta title | [≤60 ch] | Stories — Drives, the Tour & the Cars · Drive Exotiq | ☐ |
| meta description | [≤155 ch] | Stories from Drive Exotiq — the sunrise drives, the Denver→Miami tour, the cars, and the community front door to exotiq.rent. | ☐ |

---

## 12. /blog/[slug] — STORIES (article template) 🟡

> Per-article front-matter. Fill once per article. Keep deks tight; lead the body's first paragraph with the answer (AEO).

| Front-matter field | Guidance | SEED / format | ☐ |
|---|---|---|---|
| `title` | headline [≤65 ch] | ⟦FILL per article⟧ | ☐ |
| `dek` | standfirst [≤140 ch] | ⟦FILL per article⟧ | ☐ |
| `author` | name | ⟦FILL⟧ | ☐ |
| `date` | ISO date | YYYY-MM-DD | ☐ |
| `readTime` | est. | "4 min read" | ☐ |
| `category` | one of | Drives / Tour / Cars / Community | ☐ |
| `heroAlt` | image alt [descriptive] | ⟦FILL⟧ | ☐ |
| `metaTitle` | [≤60 ch] | `{title} · Drive Exotiq` | ☐ |
| `metaDescription` | [≤155 ch] | ⟦FILL — lead with the answer⟧ | ☐ |
| `faqBlock` | optional Q&A (powers FAQPage) | ⟦FILL Q/A pairs where relevant⟧ | ☐ |
| article end-CTA | reuse | Get on the list | ☐ |

**Launch articles to write (suggested, Phase 2):**
1. "Why we drive at sunrise" (Drives) — the format and the why.
2. "One car, ten markets: the 2026 Exotic Tour explained" (Tour) — the route + the sponsor ask.
3. "What exotiq.rent will be" (Cars/Community) — the marketplace teaser + AEO anchor.

---

## 13. /apply + /thank-you — The funnel 🔴 (backend built; copy needed)

### 13.1 /apply 🔴

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `APPLY-HEAD` | [≤7 words] | Get on the list. | ☐ |
| `APPLY-SUB` | what happens [≤25 words] | One list for the drives, the tour, and the marketplace. We review every name and keep it small — no noise, no spam. | ☐ |
| `APPLY-FIELD-NAME` | label | Full name | ☐ |
| `APPLY-FIELD-EMAIL` | label | Email address | ☐ |
| `APPLY-FIELD-PHONE` | label | Phone | ☐ |
| `APPLY-FIELD-CITY` | label | Current city | ☐ |
| `APPLY-FIELD-CITY-INTEREST` | label | City you'd drive in | ☐ |
| `APPLY-FIELD-INTRO` | label | Tell us what you drive | ☐ |
| `APPLY-FIELD-CODE` | label | Invite code (optional) | ☐ |
| `APPLY-FIELD-HELP` | helper under intro [≤15 words] | A sentence is plenty. We care more about the driver than the car. | ☐ |
| `APPLY-CONSENT` | SMS consent | I agree to receive texts about drives and tour updates. Reply STOP to opt out. | ☐ |
| `APPLY-CTA` | submit (gulf) | Get on the list | ☐ |
| `APPLY-SUCCESS` | inline success [≤18 words] | You're on the list. Watch your inbox — we'll be in touch before the next sunrise. | ☐ |
| meta title | [≤60 ch] | Get on the List · Drive Exotiq | ☐ |
| meta description | [≤155 ch] | Get on the list for invite-only sunrise drives, the 2026 tour, and the exotiq.rent waitlist. Drive Exotiq, an Exotiq Inc. brand. | ☐ |

### 13.2 /thank-you 🟡

| Slot ID | Guidance | SEED | ☐ |
|---|---|---|---|
| `THANKYOU-HEAD` | [≤6 words] | You're on the list. | ☐ |
| `THANKYOU-BODY` | [≤30 words] | We review every name personally. When a drive fits your city — or the tour rolls through — you'll be among the first to know. | ☐ |
| `THANKYOU-CTA` | next step (ghost) | Read the stories | ☐ |
| `THANKYOU-SECONDARY` | second link | See the wrap opportunity | ☐ |

---

## 14. BLOCKING SUMMARY (what must be done before each page ships)

| Page | 🔴 Blocking copy (must be final) |
|---|---|
| **Global** | Header (wordmark, nav, CTA); global meta title template + default OG description |
| **HOME** | H0 (all), H1-LINE, H2-LINE, H5-LINE, H6 (all), HOME meta |
| **/tour** | T0-INTRO, all ten `T-CITY-{n}-NAME` + `-LEG-MI`, T-FINALE (all), /tour meta |
| **/sponsor** | SP-OPP (all), SP-ASSET (head+body), SP-MVM data (all ten markets), all three tiers (name/tag/includes/price), SP-FORM (all labels + CTA + success), /sponsor meta |
| **/apply** | APPLY-HEAD, -SUB, all field labels, -CONSENT, -CTA, -SUCCESS, meta |
| **/drives** | DR-HERO (all) |
| **/community** | CM-STORY (all), CM-ECO (all nodes + caption) |
| **/marketplace** | MK-HERO (all), MK-FORM (all) |
| **/blog + /blog/[slug]** | none blocking for Phase-2 launch beyond per-article front-matter |

**Non-blocking (ship on seed, refine later):** all `-DEK`/`-NOTE` tour beats, all FAQ/Q&A blocks, proof stats, blog intros, microcopy, secondary CTAs, footer extras.

---

## 15. Final checklist before handing copy to the build

- [ ] Every 🔴 slot replaced with final text (use §14 to verify per page).
- [ ] AEO anchor sentence appears at least once per page (server-rendered).
- [ ] No banned words; no ALL-CAPS kickers; no exclamation points outside intentional voice.
- [ ] One primary CTA per viewport; all CTA labels pulled from §2 library.
- [ ] All meta titles ≤60 ch and end in `· Drive Exotiq`; all meta descriptions ≤155 ch.
- [ ] All ten markets have consistent naming (matches §1.4 canonical list).
- [ ] Numbers consistent everywhere: ~5,000 miles, 10 markets, 2017 Audi S8, last Sunday, 2026.
- [ ] Form success + error microcopy written for every form.
- [ ] Open decisions resolved where they affect copy: 10 vs 9 tour beats (§6), public pricing vs "Inquire" (§9.4).

---

*Built for the people who actually drive the car. An Exotiq Inc. brand.*
