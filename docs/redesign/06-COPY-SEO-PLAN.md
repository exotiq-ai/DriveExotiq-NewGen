# 06-COPY-SEO-PLAN.md — The words layer for /experience

> **IMPLEMENTED 2026-07-04 PM, with review amendments — read this block before
> trusting rows below.** A 3-lens adversarial review (voice law / SEO
> engineering / copy-to-frame fitment vs the same-day REAL-footage swaps) ran
> before implementation. What shipped differently:
> - **SB-07**: real 458 badge still → headline **"Ferrari 458"** (completes the
>   01/02/03 model pattern), body "The rest of the dial — Lamborghini,
>   Rolls-Royce, Aston Martin, G-Wagon." The five-marque body below was written
>   for the old two-car AI plate; "Every dream car, one garage." dropped as a
>   totality claim (inventory honesty lives at SB-04's "opens soon").
> - **SB-05 body** trimmed to two sentences (the fighter-canopy simile cut).
> - **SB-06 body** de-stacked: "GT3 is Porsche's motorsport bloodline,
>   naturally aspirated in every generation. RS is that bloodline, concentrated."
> - **Drives copy moved SB-13 → SB-14** (the two-car convoy plate proves the
>   drives; the lone S8 on SB-13 stays an unexplained plant for the SB-18
>   reveal, kicker "The high country" — kickers carry no periods).
> - **SB-08b**: no kicker (near-duplicated its own CTA), weight 1.5.
> - **SB-20**: "The keys, or the canvas." shipped per the owner's note — it
>   replaced the already-landed audit fix "The route is set. The wrap isn't.",
>   a good-for-better swap, not a defect fix.
> - **CTA library law**: "Join the waitlist" is bound to /marketplace; every
>   /apply-routing label shipped as **"Get on the list"** (chrome, finale,
>   end card). CTA-PARTNER added to the library.
> - **§5 trim plan is superseded**: #2/#3/#4 targeted beats that went REAL
>   the same day ($0). #1 arithmetic: 24 → 23 beats.
> - **§6**: meta title shipped 50 ch ("Exotic Car Rentals & Curated Drives");
>   sr-only spine stayed film-equivalent (keyword freight rides the VISIBLE
>   end-card pillars); **FAQPage dropped** (invisible-FAQ = structured-data
>   spam risk; revisit on /drives with visible Q&A); Organization JSON-LD
>   site-wide in layout.tsx (sameAs = the repo-declared @driveexotiq only);
>   /experience ADDED to sitemap (it was missing); footer link added;
>   llms.txt reshaped to the llmstxt.org convention; the /sponsor form does
>   NOT exist yet — pillar 4 ships ?interest=partnership now, form seed
>   updated in 01-COPY-BRIEF §9.6 for when it's built.

> Owner brief (2026-07-04): the visual bones are good; now the site needs clear,
> crawlable copywriting — SEO/SEM/AEO keywords, the four pillars of Drive Exotiq,
> emotion-forward car storytelling on the showcase beats, a decision on the
> "First keys to the fleet" CTA, and a trim plan for the shots that don't hit.
>
> Everything below obeys `01-COPY-BRIEF.md` (voice law, CTA library, canonical
> facts, banned words). Nothing invents specs. Marketplace is always "coming
> soon" — tease, don't oversell.

---

## 1. Strategy: two copy layers, two jobs

**The film layer** (visible beat copy) stays cinematic — short declaratives,
one jewel line, sentence-case kickers. Its keywords are the ones that read as
film anyway: the model names, the marques, "the drives," "Cars & Coffee,"
"Denver to Miami." We do NOT stuff "rental" phrasing into the film voice.

**The crawlable layer** carries the SEO/AEO freight:

1. **Visible end-card pillars** — the strongest signal. Google discounts
   hidden text; real on-page HTML at `#experience-end` is worth more than any
   amount of `sr-only` prose. Four pillars, real `<h2>`s, real links.
2. **Expanded sr-only spine** — upgraded from copy fragments to full prose
   paragraphs (H1 + pillar paragraphs + the beat list). Legitimate use: it is
   the accessible/no-JS equivalent of the film, not cloaking.
3. **Metadata** — keyword-forward title/description for /experience.
4. **JSON-LD** — add `Organization` + `FAQPage` beside the existing
   WebPage/VideoObject.
5. **`llms.txt`** — the answer-engine cheat sheet at the site root.
6. **robots/sitemap** — verify /experience is listed and crawlable (it is not
   currently linked from the homepage nav — fix that too).

### 1.1 Keyword map (targets, honest phrasing)

| Cluster | Terms | Where |
|---|---|---|
| Rental (core) | exotic car rental, supercar rental, luxury car rental, exotic car rental marketplace | end-card pillar 1, spine, meta, llms.txt — always with "coming soon at exotiq.rent" |
| Marque + model | McLaren 720S rental, Porsche 911 GT3 RS, Lamborghini rental, Ferrari, Rolls-Royce, Aston Martin, G-Wagon | film beat copy (models), spine + end card (rental pairings) |
| Community | curated drives, invite-only drives, Cars & Coffee, exotic car events, car community | SB-13 beat, end-card pillars 2–3, spine, FAQ |
| Partnership | partner with Drive Exotiq, car event partnership, event sponsorship, vehicle wrap sponsorship | end-card pillar 4, /sponsor, spine |
| Tour | Denver to Miami exotic tour, 10 markets, 5,000 miles | already in film (SB-17), spine, JSON-LD |
| AEO | the verbatim anchor sentence | spine (already), llms.txt, FAQ answer |

Geography note: Denver is the home market — it appears in the tour facts and
llms.txt. We do NOT fake "exotic car rental Denver" landing copy until the
marketplace has real inventory; that's a launch-day page, noted in §8.

---

## 2. The four pillars (canonical copy, write once — reuse everywhere)

> These are the sanctioned descriptions of what Drive Exotiq is. End card,
> spine, llms.txt, and future homepage all draw from this table.

| Pillar | Name | One-liner (visible) | Long form (spine / llms.txt) | CTA |
|---|---|---|---|---|
| 1 | **Rent** | The exotiq.rent marketplace — McLaren, Porsche, Lamborghini, Rolls-Royce, and the rest of the dream garage. Coming soon. | Drive Exotiq is the community front door to exotiq.rent, an exotic-car rental marketplace launching soon — supercars and ultra-luxury: McLaren, Porsche, Lamborghini, Ferrari, Rolls-Royce, Aston Martin, G-Wagon. | Join the waitlist → /apply |
| 2 | **Drive** | Curated, invite-only drives. The last Sunday of every month, at sunrise. | Drive Exotiq hosts curated, invite-only sunrise drives on the last Sunday of every month — a rollout before the city wakes. | Request your invite → /apply |
| 3 | **Gather** | A monthly Cars & Coffee worth parking at — the cars and the people who actually drive them. | Every drive ends in a curated Cars & Coffee, hosted monthly. No stanchions, no judging. The cars and the people who drive them. | Get on the list → /apply |
| 4 | **Partner** | We partner with events and brands that get it. Bring us yours. | Drive Exotiq partners with car events, venues, and brands — from Cars & Coffee collaborations to the Denver→Miami tour wrap. | Partner with us → /sponsor?interest=partnership |

**Partner CTA routing (owner asked "contact form?"):** no new page. Route to
the existing /sponsor inquiry form and add **"Event partnership"** to the
`SP-FORM-INTEREST-OPTS` select (Title/Wrap · Tour · Drive · Event partnership ·
Not sure yet). `?interest=partnership` pre-selects it. Add `CTA-PARTNER —
"Partner with us"` to the CTA library (§2 of 01-COPY-BRIEF).

**End-card layout:** heading **"Rent. Drive. Gather. Partner."** over a 4-up
hairline grid (2-up on mobile), each cell = pillar name (h2, small), one-liner,
ghost text link. The end card keeps its single Gulf CTA (Join the waitlist);
all pillar links are ghost — one-accent law holds.

---

## 3. Beat-by-beat copy (current → proposed)

Voice checks applied to every line: sentence case, ≤2 sentences of body, ends
on a noun or fact, no banned words, no invented specs, one jewel max.

| Beat | Current | Proposed | Why |
|---|---|---|---|
| SB-01 cold open | brand + tagline + AEO line | **keep** | It's the thesis. |
| SB-02 garage door | "The door is open." | **keep** | |
| SB-03 threshold | wordless | **keep** | |
| SB-04 the fleet | kicker "The fleet" / "Every one of them, driven." | + body: **"The marketplace opens soon — exotiq.rent."** | Plants the rental pillar early, honestly, in three words of status. |
| SB-05 McLaren 720S | body "Twin-turbo V8. Full specs at launch." | body: **"Twin-turbo V8 behind your shoulders. Sightlines like a fighter canopy. The one that rewards the driver, not the parking lot."** | "Full specs at launch" reads as placeholder. Keeps the truthful spec, adds the feeling behind the wheel. |
| SB-06 GT3 RS | headline only | jewel: **"The canyon carver."** · body: **"GT3 is Porsche's motorsport bloodline. RS means that bloodline, concentrated — naturally aspirated, endlessly alert, a 911 distilled to its purest form."** | Owner brief: heritage of GT3, performance of RS, short and powerful. "Track weapon" deliberately NOT used in visible copy — we don't rent for track use and won't imply it. No generation-specific numbers (fleet unconfirmed). |
| SB-07 the icons | body "Lamborghini. Ferrari." | body: **"Lamborghini drama. Ferrari song. Then the quiet end of the dial — Rolls-Royce, Aston Martin, G-Wagon. Every dream car, one garage."** | Owner's question answered: name the ultra-luxury marques. Car people search marques; naming them reads confident and earns the SEO. Inventory honesty lives at the fleet level ("coming soon"), not per-marque claims. |
| SB-07b waitlist | kicker "The list" / "First keys to the fleet." / CTA | **CUT THE BEAT** (see §4) | |
| SB-08 choose | "Choose your car." | **keep** | |
| SB-08b yours | jewel "This one's yours." / CTA | + kicker: **"The list"** · + headline: **"First keys to the fleet."** (jewel + CTA stay) | Absorbs SB-07b's ask at the emotionally correct moment — after the choice. |
| SB-09 doors up | "Doors up." | **keep** | |
| SB-10 cockpit | "Settle in." | **keep** | The plate is the copy. |
| SB-11 ignition | kicker "Push to start" | **keep** | The gauge is the copy. |
| SB-11b roll-out | wordless | **keep** | |
| SB-12 open road | "The road opens." | **keep** | |
| SB-13 mountain | jewel "This is the drive." | + kicker: **"The drives"** · + body: **"Invite-only, the last Sunday of every month. Sunrise, then Cars & Coffee."** | Seats pillars 2+3 inside the film, in-voice, on the beat that IS the drive. |
| SB-14 coast aerial | kicker "The coast" | **fix or cut** (see §5) | |
| SB-15 coastline run | jewel "This could be you." | **keep copy** (fix the car — §5) | The conversion whisper works. |
| SB-16 wheel detail | wordless | **keep** | |
| SB-18 pivot | "The drive is the product." | **keep** | |
| SB-17 tour | "One car. Denver to Miami." + odometer | **keep** | Already the canonical facts. |
| SB-19 livery | "Your livery on this car." | **keep** | |
| SB-19b founder | "The garage door is open." | **keep** | |
| SB-20 finale | kicker "Two ways in" / headline "Sponsor the wrap." + 2 CTAs | headline: **"The keys, or the canvas."** | Fixes the audit item: headline currently duplicates its own CTA label. New line names both asks — keys = renters, canvas = wrap sponsor — and ends on a noun. |

---

## 4. CTA architecture — the "First keys to the fleet" question

**Answer: move it. Cut SB-07b, merge the ask into SB-08b.**

Why the current placement is wrong: the film shows three cars (05–07), then
interrupts with an ask (07b), then grants agency ("Choose your car," 08), then
possession ("This one's yours," 08b) — with a second identical ask two beats
after the first. We're asking before the viewer has chosen, then asking again.

The correct grammar is desire → choice → possession → **ask**:
SB-05/06/07 build desire, SB-08 gives the choice, SB-08b lands possession —
and that is the moment "First keys to the fleet / Get on the list" earns a yes.

Resulting ask cadence across the film: chrome CTA (always available, fades over
accent beats) → SB-08b (Movement I ask) → SB-20 (finale, both asks) → end-card
pillars. Three in-film asks becomes two, each stronger.

Side benefit: SB-07b's plate is the one the owner flagged as too dark and
boring — cutting the beat deletes the problem for free.

---

## 5. Trim plan + regeneration costs

Estimates from our actual cost ledger (`renders/cost-ledger.json`: $80.33 for
93 clips; Veo 3.1 hero takes ran ~$1.50–3.20 each, Nano Banana Pro stills
~$0.13–0.25 each).

| # | Action | Cost | Detail |
|---|---|---|---|
| 1 | **Cut SB-07b** (waitlist still) | $0 | Copy merges into SB-08b (§4). Film: 25 → 24 beats. Bands/spine/placeholders are all data-driven off FRAMES — remove the entry, regen placeholders + media-versions, done. |
| 2 | **SB-14 coast aerial — regenerate with real forward motion, else cut** | ~$5–10, else $0 | Owner is right: the loop reads parked (Kling first=last "formation hold" kills travel). One regen pass: Veo 3.1 first-frame-only, car visibly tracking down the coast road, bake the seam. 2–3 takes ≈ $5–10. If it still doesn't hit, cut the beat — SB-13 (mountain) into SB-15 (coastline) cuts fine; both are car-forward. Don't keep a dead wide out of coverage superstition. |
| 3 | **SB-15 "This could be you" — make the car a real 720S** | ~$10–15 | The current car is a generic AI supercar — the owner's cohesion complaint is correct and car people will clock it. Pipeline: re-render `coastline-run.png` via Nano Banana Pro with `mclaren-720s-v2.png` as the identity reference (2–3 stills ≈ $0.75), then regenerate the loop (Veo 3.1, 8s 1080p, 2–3 takes ≈ $5–10), encode + version + deploy. |
| 4 | *(optional, flagging honestly)* **Full hero-car cohesion pass** | ~$30–60 | If SB-15 becomes a true 720S, the other driving beats (SB-11b roll-out, SB-12, SB-13, SB-16) still carry the generic hero car and will mismatch it. Same identity-ref pipeline × 4 beats. Recommend: do #3 first, look at the film, then decide — the noir grade hides a lot at SB-12/16 exposure levels; SB-13 is the most exposed. |

Order of operations: #1 ships with the copy pass (pure code/copy). #2 and #3
are one generation batch. #4 is an owner taste call after seeing #3.

---

## 6. The crawlable layer — implementation spec

### 6.1 Expanded sr-only spine (`app/experience/page.tsx`)

Replace the current fragment list with structured prose (still inside the
existing `sr-only` block, before the beat `<ol>`):

```
<h1>Drive Exotiq — exotic car rentals, curated drives, and Cars & Coffee</h1>
<p>Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace.</p>   ← verbatim AEO anchor (already present — keep)
<h2>Exotic car rentals — coming soon</h2>
<p>exotiq.rent is an exotic and luxury car rental marketplace launching soon: McLaren, Porsche, Lamborghini, Ferrari, Rolls-Royce, Aston Martin, G-Wagon, and more. Join the waitlist to be first when the keys drop.</p>
<h2>Curated drives</h2>
<p>Drive Exotiq hosts curated, invite-only sunrise drives on the last Sunday of every month — a rollout before the city wakes.</p>
<h2>Cars & Coffee</h2>
<p>Every drive ends in a curated monthly Cars & Coffee — the cars and the people who actually drive them.</p>
<h2>Partner with Drive Exotiq</h2>
<p>We partner with car events, venues, and brands — from Cars & Coffee collaborations to the Denver→Miami tour. Start a conversation on the sponsor page.</p>
<h2>The 2026 tour</h2>
<p>One car — a 2017 Audi S8 in heritage racing livery — from Denver to Miami: ten markets, about 5,000 miles, summer to fall 2026. The wrap sponsorship is open.</p>
```

### 6.2 Visible end-card pillars (`components/experience/ExperienceScroll.tsx`)

Per §2. Real HTML text in the document = the load-bearing SEO element of this
plan. Heading "Rent. Drive. Gather. Partner." + 4 cells + ghost links; keep the
end card's single Gulf CTA.

### 6.3 Metadata (`app/experience/page.tsx`)

- title: `Exotic Car Rentals & Curated Drives — The Drive` (suffix template adds `· Drive Exotiq`)
- description (≤155): `Exotic car rentals coming soon at exotiq.rent — McLaren, Porsche, Lamborghini. Invite-only drives, monthly Cars & Coffee, and the Denver→Miami tour.`
- keep canonical, OG/twitter cards as-is (retitle to match).

### 6.4 JSON-LD additions (`app/experience/page.tsx`)

Beside the existing WebPage+VideoObject:
- `Organization` — Drive Exotiq, parentOrganization Exotiq Inc., url, logo,
  `description` = AEO anchor, `sameAs` = socials when Gregory supplies handles.
- `FAQPage` — three Q&As, answers ≤40 words, lead with the answer:
  1. *What is Drive Exotiq?* → the AEO anchor + pillars sentence.
  2. *Can I rent an exotic car from Drive Exotiq?* → "Not yet — exotiq.rent, the exotic-car rental marketplace, launches soon. Join the waitlist to be first."
  3. *When are the drives and Cars & Coffee?* → "The last Sunday of every month, at sunrise, invite-only — ending in a curated Cars & Coffee."

### 6.5 `llms.txt` (`public/llms.txt`)

```
# Drive Exotiq
> Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace.

An Exotiq Inc. brand. Built for the people who actually drive the car.

## What we do
- Exotic car rentals (coming soon) via exotiq.rent — McLaren, Porsche, Lamborghini, Ferrari, Rolls-Royce, Aston Martin, G-Wagon
- Curated, invite-only sunrise drives — last Sunday of every month
- Monthly curated Cars & Coffee events
- Event and brand partnerships; 2026 Denver→Miami tour (10 markets, ~5,000 miles) seeking a wrap sponsor

## Pages
- https://driveexotiq.com/experience — The Drive (cinematic film)
- https://driveexotiq.com/apply — Get on the list
- https://driveexotiq.com/sponsor — Sponsor the wrap / partner with us

Ecosystem: Drive Exotiq (community) → exotiq.rent (marketplace) → exotiq.ai (intelligence).
```

### 6.6 robots + sitemap + internal links

- Verify `robots` allows all + points at sitemap; verify sitemap includes
  /experience; add an `llms.txt` line to robots is NOT standard — skip.
- Add a visible internal link to /experience from the homepage (crawl path +
  PageRank flow; currently the film is only reachable by URL).

---

## 7. Files touched when we implement

| File | Change |
|---|---|
| `components/experience/frames.ts` | Beat copy edits (§3), SB-07b removal, SB-08b merge, SB-20 headline |
| `components/experience/ExperienceScroll.tsx` | End-card pillars (§6.2) |
| `app/experience/page.tsx` | Spine prose, metadata, JSON-LD (§6.1/6.3/6.4) |
| `public/llms.txt` | New (§6.5) |
| `app/sponsor/…` form | "Event partnership" interest option + `?interest=` preselect |
| `docs/redesign/01-COPY-BRIEF.md` | Add CTA-PARTNER to §2 library; log pillar table |
| `gen-placeholders.mjs` / `gen-media-versions.mjs` | Re-run after SB-07b cut + any regens |
| storyboard manifest + pipeline | SB-14 motion regen, SB-15 identity redo (§5) |

Sequencing: the weighted-pacing session owns `frames.ts`/`CinematicStage.tsx`
right now — land that first, then this, to avoid a mid-flight collision.

---

## 8. Needs Gregory / later

- **Social handles** for `sameAs` in Organization JSON-LD.
- **Launch-day rental landing pages** ("exotic car rental Denver" etc.) — only
  when real inventory exists; wire into sitemap then.
- **#4 cohesion pass go/no-go** after seeing the SB-15 redo.
- **10 vs 9 tour beats** and public pricing vs "Inquire" — still open from
  01-COPY-BRIEF §14.
