# 10 — Copy & Journey Audit (Copywriter Handoff)

> **Who this is for:** an outside copywriter with no prior context on Drive Exotiq. Read §1, then work the punch list in §7. The goal is one thing: make the whole journey make 100% sense to a **first-time** visitor AND a **returning** visitor.
>
> **How to read this doc:** §1 gives you the product and the voice. §2 answers the two decisions the founder wants settled. §3 is the film, beat by beat, with current copy quoted verbatim. §4 is every other page. §5 walks the two visitor types through the site. §6 is the navigation fix. §7 is your prioritized to-do list.
>
> Source files (quote from these, they are the live copy): `components/experience/frames.ts` (the film), `app/*/page.tsx` (the pages), `components/layout/Header.tsx` (the nav), `lib/interest.ts` (the /apply form options).

---

## 1. What Drive Exotiq is

**Drive Exotiq is the community and culture "front door" to exotiq.rent — an exotic-car rental marketplace that is *coming soon* (no live rentals yet).** It is an Exotiq Inc. brand. Three things live under it: (1) **exotic rentals**, via the exotiq.rent marketplace waitlist; (2) **invite-only "drives"** — sunrise convoy runs on the last Sunday of every month in Colorado's high country, each ending in a curated Cars & Coffee; and (3) a **Denver→Miami "tour"** in 2026, where the founder's own 2017 Audi S8 drives ~5,000 miles through ten markets, and a brand can buy the wrap (livery) on the car as a sponsorship. The home page is a **cinematic scroll film** — you fall through a garage, meet the fleet (McLaren, Porsche, Ferrari), ride a sunrise drive, then hit a **pivot** where a recurring dark sedan is revealed to be the founder's S8, and the film turns from a renter story into a sponsor pitch for the tour wrap. Everything sells calm certainty: the car, the road, and the people are the proof, so the copy never hypes.

### The voice, in 5 bullets (from `01-COPY-BRIEF.md §1)

1. **We state, we don't sell.** Periods, not exclamation points. Short declaratives, concrete nouns, one idea per line. *"One car. Denver to Miami. Ten markets."* — never *"An UNFORGETTABLE epic journey!"*
2. **Enthusiast-credible specifics.** Real numbers, model years, mileage a gearhead respects: *"a 2017 Audi S8 — heritage racing livery, sleeper,"* *"the last naturally aspirated Ferrari V8."* Never invent a fact — use the canonical numbers in §1.4 of the brief (**2017 Audi S8**, **~5,000 miles**, **10 markets**, **last Sunday of the month**, **Denver→Miami**, summer→fall **2026**).
3. **Quiet luxury.** Understated, spare, earned not announced. The most expensive thing on the page is the white space. Let silence do the work; end on a noun or a fact.
4. **Sentence-case kickers, one serif-italic "jewel" line per scene.** Kickers are never uppercase. Each beat gets at most one Spectral-italic emotional line (the gold accent) — use it sparingly. Gulf (the accent color) is reserved for **actions only** — one primary CTA per viewport.
5. **Banned words/moves:** *unforgettable, epic, revolution, game-changing, unlock, elevate, curated experience (as filler), insane, ROI-speak, exclusivity-as-bragging, multiple exclamation points, ALL CAPS for emphasis, emoji.* Also required: the **AEO anchor sentence** — *"Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace"* (or an approved variant keeping the three entities + "front door") must appear server-rendered **at least once on every page.**

---

## 2. The two big questions, answered

### (a) Does a first-time visitor understand the "Choose your car" moment?

**Verdict: No.** The beat **SB-08 `"Choose your car."`** sits right after the fleet intro (McLaren 720S / Porsche 911 GT3 RS / Ferrari 458) and reads as a live rental catalog command — "pick one, rent it now." But **nothing is bookable**: the marketplace is coming soon, exotiq.rent is not live. The very next beat, **SB-08b**, has to walk it straight back to *"First booking windows when exotiq.rent opens."* So the film gives an imperative in one breath and admits it can't be fulfilled in the next. It's a non-sequitur, and it's the single beat most likely to make a first-timer think the site is broken or misleading. (The lens JSON flags this as a **blocker** for both narrative arc and funnel clarity — the two lenses agree.)

**The fix direction — resolved call: reframe SB-08 from a command into a future-tense desire beat, and promote "coming soon" to a first-class element at the fleet reveal.**

- Change **SB-08** `"Choose your car."` → **`"Which one's yours?"`** (a rhetorical daydream, present tense but not transactional). SB-08b's existing jewel *"This one's yours."* then answers it — the choose→possession logic survives, the false "buy now" promise disappears. (Second choice if the founder wants to keep the imperative: **`"Pick your first."`**)
- At **SB-04** (the fleet reveal), lift "coming soon" out of the small body line into the **kicker** so it reads at headline weight — e.g. kicker **`"The fleet — opening soon"`** instead of just `"The fleet"`. Right now the only coming-soon signal across SB-01→SB-08 is one line of body copy on a fast-scrolling beat, and a cold visitor can spend a third of the film believing they can rent today.

Net: no beat between SB-04 and SB-08b should be readable as "rent this now."

### (b) Should there be a skip-to-menu button at the top of the film?

**Recommendation: Yes — add a persistent, visible "Menu" affordance to the film's top chrome, mobile-first.** Today the film is the **only** page on the site that renders no global Header. Its top chrome exposes just the wordmark (which links to `/`, i.e. nowhere) plus two CTAs (`Sponsor the wrap` → /sponsor, `Get on the list` → /apply). The only way to reach /drives, /tour, /marketplace, or /blog is to scroll the entire ~30-viewport film to the end-card. The three "skip" affordances that exist are all inadequate: the `Skip the film` link is `sr-only` (invisible to mouse/touch), the act ticks are desktop-only 1px marks that jump *within* the film (not to any page), and on mobile there is effectively **zero** skip affordance. This strands the site's most valuable audience — the returning visitor who already knows the film and just wants the next drive date.

**Proposed design (copy + IA — engineering wires it):**

- A single quiet ghost **`Menu`** text button at the **top-right** of the film chrome (sits opposite the one Gulf CTA). Text label, not a hamburger — better fit for the quiet aesthetic. **Must render on mobile** (do not gate behind `sm:`). No Gulf accent — navigation is not an action, so the one-accent-per-viewport law is preserved.
- On tap it opens a quiet full-bleed sheet using the same treatment as the existing Header mobile sheet, listing the **canonical destination set**, reused verbatim from `Header.tsx`'s `NAV` array so the two front doors finally agree:
  **The Drives** (/drives) · **The Tour** (/tour) · **Marketplace** (/marketplace) · **Stories** (/blog) · **Sponsor** (/sponsor) · then the **Get on the list** CTA (/apply).
- Keep the existing `sr-only` "Skip the film" link for keyboard/AT users; it is no longer the general skip solution once Menu ships.
- Fix a consistency bug while you're here: the **end-card footer nav** currently lists only *The drives · The tour · Sponsor · Stories* — **Marketplace is missing** and is reachable only via the "Rent" pillar. Add Marketplace to the end-card footer nav so all three nav surfaces (film Menu sheet, end-card footer, global Header) expose the same six destinations, with matching label casing ("The Drives," not "The drives").

---

## 3. Film beat-by-beat copy table

Every beat in `frames.ts` order. Copy is quoted verbatim. `[k]` = kicker, `[H]` = headline, `[j]` = jewel (serif italic), `[b]` = body, `[aria]` = accessible label only (no visible copy). Movement I = renter arc; **PIVOT**; Movement II = sponsor arc.

| ID | Current copy | Gap / issue | Recommended direction |
|---|---|---|---|
| **SB-01** | [H] `Drive Exotiq` · [j] `Built for the people who actually drive the car.` · [b] `Exotic rentals, invite-only drives, and a Denver-to-Miami tour.` | Solid cold open. The body front-loads all three offerings including the **tour**, which is the sponsor-arc payoff that doesn't arrive for 20+ beats — mildly pre-spends the pivot surprise. | **Keep.** Minor optional: consider leading with just the two renter-facing offers (`Exotic rentals and invite-only drives.`) to sharpen Movement-I focus and let the tour land as a real surprise at the pivot. Low priority — current line is better for SEO/scope. |
| **SB-02** | [H] `The door is open.` | Clean. | Keep. |
| **SB-03** | [aria] `Flying through the threshold into the garage` | Wordless transition. | Keep. |
| **SB-04** | [k] `The fleet` · [H] `Every one of them, driven.` · [b] `The marketplace opens soon — exotiq.rent.` | **BLOCKER.** The only "coming soon" cue in the whole renter arc is this one body line on a fast beat. Combined with SB-08, the fleet reads as a live rental catalog. | Promote coming-soon to first-class weight: kicker → **`The fleet — opening soon`**. Keep the body line. See §2(a). |
| **SB-05** | [k] `01` · [H] `McLaren 720S` · [b] `Twin-turbo V8 behind your shoulders. The one that rewards the driver, not the parking lot.` | On-voice, enthusiast-credible. | Keep. |
| **SB-06** | [k] `02` · [H] `Porsche 911 GT3 RS` · [j] `The canyon carver.` · [b] `GT3 is Porsche's motorsport bloodline, naturally aspirated in every generation. RS is that bloodline, concentrated.` | On-voice. | Keep. |
| **SB-07** | [k] `03` · [H] `Ferrari 458` · [b] `The last naturally aspirated Ferrari V8.` | On-voice, exact fact. Note: Ferrari is a film hero here but is **absent** from the end-card marketplace marque list — a consistency gap (see SB end-card row). | Keep the beat. Fix the marque-list divergence elsewhere. |
| **SB-08** | [H] `Choose your car.` | **BLOCKER.** Imperative "buy now" command before anything is bookable; SB-08b immediately walks it back. See §2(a). | Reframe to **`Which one's yours?`** (or `Pick your first.`). |
| **SB-08b** | [H] `First keys to the fleet.` · [j] `This one's yours.` · [b] `First booking windows when exotiq.rent opens.` · CTA `Get on the list` → /apply | The Movement-I conversion, landed well. Only crack is that it must repair SB-08's false promise. | Keep. Once SB-08 becomes `Which one's yours?`, this beat's `This one's yours.` answers it cleanly. |
| **SB-09** | [H] `Doors up.` | Clean drive-out beat. | Keep. |
| **SB-10** | [j] `Settle in.` | Clean. | Keep. |
| **SB-11b** | [aria] `The nose eases out of the garage` | Wordless. | Keep. |
| **SB-14c** | [aria] `The McLaren runs the coast road at golden hour` | Wordless exhale. | Keep. |
| **SB-12** | [H] `The road opens.` | Clean. | Keep. |
| **SB-14** | [k] `The drives` · [b] `Invite-only, the last Sunday of every month. Sunrise in Colorado's high country, then Cars & Coffee.` | Strong — the film's one geography + cadence anchor. Matches canonical facts. | Keep. |
| **SB-14b** | [j] `No stanchions. No judging.` · [aria] `Golden hour at the Cars & Coffee...` | On-voice; pays off SB-14. | Keep. |
| **SB-15** | [j] `This could be you.` | The renter-arc aspirational cap — BUT it sits immediately before four silent unnamed S8 beats, so "you" ambiguously points forward at the founder's sedan instead of back at the McLaren/drives. | **Relocate** to sit right after SB-14b (Cars & Coffee), so it clearly caps the renter content before any S8 footage. Cheapest fix for the ambiguity. |
| **SB-11** | [k] `Push to start` · [aria] `Push to start — the real V8 wakes` | First of four silent S8 "plant" beats. For a cold viewer this reads as "a fourth fleet car," not "one specific recurring car" — so the SB-18 payoff can misfire ("wait, which car?"). | **Add a kicker/jewel that flags a different register** — signal this is one lone car, not the fleet, so its recurrence is noticed. This is what makes the pivot land. |
| **SB-13** | [k] `The high country` · [j] `This is the drive.` | Part of the S8 plant. | Keep (benefits from the SB-11 register flag). |
| **SB-13b** | [aria] `Taillights receding down the dusk mountain road` | Silent plant beat. Four silent S8 beats is a long trough right where a cold viewer decides whether to keep scrolling. | Candidate to **cut** if tightening the plant — drop this OR SB-16 to shorten the silent stretch. |
| **SB-16** | [aria] `The wheel, up close, slowing` | Silent plant beat. | Candidate to cut (see SB-13b). |
| **SB-18** (PIVOT) | [k] `One more thing` · [H] `The drive is the product.` · [j] `The story goes further.` · [b] `The 2017 Audi S8 you kept seeing — the founder's own car, driven every mile.` | **MAJOR.** The most load-bearing line in the film is the vague founder-speak headline `The drive is the product.` — a slogan, not information. The real reveal is in the body. A cold viewer reads only the headline and learns nothing concrete. | **Make the headline carry the reveal:** e.g. **`This one's the founder's.`** or **`Meet the founder's car.`** Let the body explain it's the S8 they kept seeing; keep the jewel `The story goes further.` pointing to the tour. The abstraction can survive as a jewel or be cut. Test: after the headline alone, the viewer should know a specific concrete thing happened. |
| **SB-17** | [k] `The tour` · [H] `One car. Denver to Miami.` · [b] `Ten markets. {n} miles. Summer to fall 2026.` (odometer → 5,000) · secondary CTA `See the tour plan` → /tour | Clean, canonical. BUT this is the first sponsor-arc beat and there's **no bridge** telling a renter-minded viewer why they should now care about a sponsorship — SB-19's "Your livery on this car" then asks for money before the value prop exists. | **Add one bridging idea here** that frames the tour as a value prop before the ask — e.g. a body/jewel casting it as a rolling billboard across ten markets — so SB-19's livery ask arrives as the obvious payoff. Optionally a kicker at SB-19 flagging `For brands` / `The sponsorship` so the audience shift is explicit. |
| **SB-19** | [H] `Your livery on this car.` · [j] `Down this line, through ten cities.` | The sponsor money shot. The ask lands before a cold viewer understands they've been recategorized from renter to sponsor. | Keep the copy; fix the setup at SB-17 (above). Optional kicker `The sponsorship`. |
| **SB-19b** | [k] `Gregory — founder` · [H] `The garage door is open.` · [j] `The road starts here.` | The film's one named human — a trust moment. On-voice. | Keep. |
| **SB-20** (finale) | [k] `Two ways in` · [H] `The keys, or the canvas.` · CTA `Sponsor the wrap` → /sponsor · secondary `Get on the list` → /apply | Elegant but abstract for a skimmer — the two asks are distinguished by metaphor only, so someone who skimmed can't tell which ask is for them. | **Add a plain gloss** so the metaphor isn't the only signpost, e.g. body: `Rent and drive (get on the list), or wrap the car (sponsor the tour).` Keeps the poetry, removes ambiguity. The kicker `Two ways in` already helps. |

**End-card (rendered in `ExperienceScroll.tsx`, below SB-20) — flagged here for the copywriter:**
- **Rent pillar marque list:** `McLaren, Porsche, Lamborghini, Rolls-Royce, and the rest of the dream garage` — but the film's heroes are McLaren, Porsche, **Ferrari**, and the home meta lists a third set (`McLaren, Porsche, Lamborghini`). **Pick one canonical short marque list** that includes the marques the film actually shows (add Ferrari), and reuse it identically in the end-card and the home meta description.
- **Partner pillar:** `We partner with events and brands that get it. Bring us yours.` — `Bring us yours` is a vague sell-y imperative. **Tighten to** `We partner with events and brands that get it.` (let the "Partner with us →" CTA carry the ask) or make the object concrete: `Bring us your event.`

---

## 4. Page-by-page copy audit

### /apply — "Get on the list" (`app/apply/page.tsx`, form options in `lib/interest.ts`)
- **Current key copy:** kicker `One list — drives, tour, and the marketplace`; H1 `Get on the list.`; sub `One list for the drives, the tour, and the marketplace. We review every name and keep it small — no noise, no spam.`; AEO anchor present ✅; rail steps `We read every name.` / `Your city, your invite.` / `First to hear.` (step 3 body: `...when exotiq.rent opens.`).
- **Issue:** The page conflates three outcomes (drives invites, tour news, marketplace access) into "one list" without telling a renter, upfront, that the **marketplace part isn't live**. The only coming-soon cue is the last of three rail steps. A renter who came to rent expects a booking confirmation. **Bigger issue — the form itself:** `APPLY_INTEREST_OPTIONS` includes `Sponsor the wrap (Title/Wrap · Tour · Drive)`. A high-value sponsor picks it, fills the **consumer** form (name, phone, city, "what you drive", SMS consent — none sponsor-relevant), then lands on /thank-you being told to *go start over on /sponsor*. That's a dead-end loop for the best lead type.
- **Direction:** (1) Add one clause to the hero sub making coming-soon explicit for a renter: `One list for the drives, the tour, and the marketplace (rentals open soon at exotiq.rent).` (2) **Remove `Sponsor the wrap` from the /apply select** and replace with a one-line redirect nudge (`Sponsoring the wrap? → start here` linking to /sponsor), so sponsor intent never enters the consumer form. Keep `Event partnership` only if you also fix its thank-you copy (see /thank-you).

### /thank-you (`app/thank-you/page.tsx`)
- **Current key copy:** sponsor branch (`title-wrap`/`tour`/`drive`/`partnership`): head `Got it.`, body `Thanks for the interest in the wrap. We'll be in touch within a couple of days...`, primary `See the wrap opportunity` → /sponsor, secondary `Ride the tour` → /tour. Renter branch (`access`/`drives`/default): `You're on the list.` variants, primary `Read the stories` → /blog.
- **Issue:** (1) The sponsor branch's primary CTA `See the wrap opportunity → /sponsor` reads as "you're not done — go start over," after they already submitted. (2) The renter branches route the primary CTA to `Read the stories → /blog`, but **/blog is empty** (`The first stories are being written.`) — the strongest post-conversion moment sends the new lead to a dead page. (Note: `Ride the tour` → /tour is CTA-library-compliant; no change there.)
- **Direction:** (1) Sponsor branch: reword so the lead feels *received*, not redirected — e.g. affirm "we've got your note, a real person will reply," and demote /sponsor to secondary. (2) While /blog is empty, **don't make "Read the stories" the primary**. Point the primary at something with substance — /drives (`See how the drives work`) or /marketplace (`What's coming`) — and demote or hide the stories CTA until posts exist.

### /sponsor — "Sponsor the wrap" (`app/sponsor/page.tsx`)
- **Current key copy:** kicker `The wrap is open`; H1 `One car. Ten markets. 5,000 miles of road.`; AEO anchor present ✅; asset section `The car is a billboard that drives.` + `A 2017 Audi S8 in heritage racing livery — a sleeper with real presence.`; tiers `Title / Wrap` / `Tour` / `Drive`; CTA `Start a sponsorship conversation`. Meta title `Sponsor the wrap — Denver→Miami tour`.
- **Issue:** Strong page, on-voice, canonical facts, uses `2017 Audi S8` correctly. One open item: the meta title has no visible `· Drive Exotiq` suffix in the file — the global meta law requires every title end in `· Drive Exotiq` (≤60 ch). Verify the layout template appends it.
- **Direction:** No copy changes needed to the body. **Confirm** `app/layout.tsx` appends `· Drive Exotiq` to titles; if it doesn't, this and other page titles need the suffix. This page is the model other pages should match for the AEO anchor and the canonical `2017 Audi S8` phrasing.

### /drives (`app/drives/page.tsx`)
- **Current key copy:** kicker `Invite only`; H1 `The last Sunday. The first light.`; sub about sunrise drives + Cars & Coffee; AEO anchor present ✅; steps, a Cars & Coffee section, a "The people" section, and a full FAQ with FAQPage JSON-LD; CTA `Request your invite` → /apply?interest=drives.
- **Issue:** None material. Clean, on-voice, canonical facts, AEO anchor and FAQ schema present.
- **Direction:** Keep. This is a healthy page — use its FAQ pattern and its clean "invite-only, last Sunday, sunrise, Cars & Coffee" phrasing as the canonical way to describe the drives everywhere else.

### /marketplace — "exotiq.rent — Coming soon" (`app/marketplace/page.tsx`)
- **Current key copy:** kicker `Coming soon`; H1 `exotiq.rent`; sub `The exotic-car rental marketplace, built for people who actually drive.`; AEO anchor present ✅; three promises (`A curated marketplace, not a parking lot.` etc.); waitlist H2 `Be first when the keys drop.`; footnote `...Separate from any existing booking — this is the new thing, built fresh.`
- **Issue:** None material. This is the clearest coming-soon explainer on the site — and it's the page a confused first-timer most needs, yet the film has no link to it (see §2b, §6).
- **Direction:** Keep the copy. The fix is navigational: make this page reachable from the film via the new Menu. Optionally the film could surface a quiet `What's exotiq.rent?` text link near the SB-04 fleet reveal.

### /tour — "The Journey" (`app/tour/page.tsx`) — **the weakest page against the brief; fix first**
- **Current key copy:** meta title `The Journey — Denver to Miami`; kicker `The Journey · Denver → Miami · summer–fall 2026`; hero sub `One built Audi S8, ten markets, ~5,000 miles — the Denver-to-Miami exotic tour, summer into fall 2026. The wrap is still yours to claim.`; jewel `a long way south, the long way.`; finale H2 `Ten cities. Thousands of miles. One blank canvas.`; footer stat `4,980 miles round trip · 10 markets · one car`.
- **Issues (four, three of them major):**
  1. **Wrong entity name.** The page is titled `The Journey` in the meta title, kicker, and doc title. The canonical name is **The Tour** / The Exotic Tour (the nav item is "The Tour," the CTA is "Ride the tour"). A third name for the same thing fragments the entity signal and confuses anyone who clicked a "The Tour" nav link.
  2. **Drops the canonical model year.** Hero and meta say `One built Audi S8` — no year, and `built` is an invented modifier. Everywhere else (sponsor page, film SB-18) it's the canonical **`2017 Audi S8`**.
  3. **Softens the canonical mileage.** The finale headline says `Thousands of miles` — vague — while the brief fixes the route at **~5,000 miles** and the footer two lines below says `4,980 miles round trip`. It reads like we're hiding the number.
  4. **No AEO anchor sentence anywhere on the page.** Every other built page carries it; /tour never mentions exotiq.rent or the front-door relationship. The brief makes this non-negotiable per page.
- **Direction:**
  1. Rename to the canonical entity: kicker `The tour · Denver → Miami · summer–fall 2026`; meta title `The Exotic Tour — Denver to Miami`. If "The Journey" is wanted as flavor, keep it only in the H1/jewel, never in the entity label crawlers and nav depend on.
  2. Hero + meta: `One 2017 Audi S8, ten markets, ~5,000 miles...`. Drop `built`.
  3. Finale headline: **`5,000 miles. Ten cities. One blank canvas.`** (matches the brief seed and the sponsor H1 `One car. Ten markets. 5,000 miles of road.`).
  4. Add the AEO anchor once, server-rendered — e.g. under the finale sub: `Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace, coming soon.`
  5. Minor: the hero jewel `a long way south, the long way.` is on-voice but near-meaningless to a cold reader; optional tighten to something that resolves on first read (e.g. `south, the long way — on purpose.`). Low priority; the H1 carries the meaning.

### /blog — "Stories" (`app/blog/page.tsx`)
- **Current key copy:** kicker `Stories`; H1 `Notes from the road and the garage.`; sub mentions exotiq.rent; empty state `The first stories are being written. Get on the list and you'll be among the first to read them.` + CTA `Get on the list`.
- **Issue:** The page is **empty** (no posts). It renders a graceful empty state — fine on its own — but it's currently the **primary post-submit destination** from /thank-you, which sends fresh leads to a dead page (see /thank-you).
- **Direction:** Keep the empty-state copy. The fix is upstream: stop making /blog the primary CTA from /thank-you until posts exist. When posts land, the index card CTA `Read the story →` is already CTA-library-compliant.

---

## 5. User-journey walkthroughs

### First-time visitor (cold, arrived from an ad or a link — knows nothing)
1. **Lands on the home film.** Sees `Drive Exotiq` / `Built for the people who actually drive the car.` / `Exotic rentals, invite-only drives, and a Denver-to-Miami tour.` Good — they get the scope. ✅
2. **Falls through the garage, meets the fleet** (McLaren/Porsche/Ferrari). ⚠️ **Friction:** the fleet + `Choose your car.` reads as *rent one now*. The only "coming soon" cue is one body line on the fast SB-04 beat, easy to miss. They may spend a third of the film believing rentals are live. **(Fix: §2a — promote coming-soon at SB-04, reframe SB-08.)**
3. **SB-08b** asks them to `Get on the list` for `First booking windows when exotiq.rent opens.` — first honest coming-soon at full weight. If they missed SB-04, this is a small whiplash.
4. **Rides the sunrise drive**, Cars & Coffee, `This could be you.` ✅ emotionally lands — *if* SB-15 is positioned so "you" points at the drive, not the sedan that follows. ⚠️ **Friction:** right now four silent unnamed S8 beats follow, reading as "a fourth fleet car." **(Fix: relocate SB-15, flag the S8 register at SB-11.)**
5. **The pivot (SB-18).** ⚠️ **Friction:** headline `The drive is the product.` says nothing concrete; the reveal is buried in the body. Many read only the headline and think "*it's… a sedan?*" **(Fix: make the headline the reveal.)**
6. **Sponsor arc.** ⚠️ **Friction:** `Your livery on this car.` asks for money before the viewer knows they've been switched from renter to sponsor — no bridge at SB-17. **(Fix: value-prop bridge at SB-17.)**
7. **Finale `The keys, or the canvas.`** ⚠️ Elegant but a skimmer can't tell which door is theirs. **(Fix: plain gloss.)** They convert via `Get on the list` or bounce.

### Returning visitor (already on the waitlist — just wants the next drive date, or /tour, or /marketplace)
1. **Lands on the home film.** ⚠️ **Blocker friction:** there is **no visible link to any menu page.** The top chrome shows only `Sponsor the wrap` + `Get on the list`; the wordmark links to `/` (itself). Every other page on the site has a Header menu — this one, the default landing page, doesn't. Their mental model ("the menu is up top") is violated at the exact entry point. **(Fix: §2b / §6 — the Menu affordance.)**
2. **Wants /drives.** On desktop they might find a 1px hairline "act tick" — but it jumps *within the film* to a beat, not to the /drives page. On mobile even that is hidden. The `Skip the film` link is invisible unless they tab a keyboard.
3. **Result today:** to reach the next drive date they must **scroll the entire ~30-viewport film** to the end-card, then find the pillar/footer links — where **Marketplace isn't even listed.** This is the highest-friction path for likely the largest traffic segment. **(Fix: §2b Menu sheet with all six destinations, mobile-first.)**

---

## 6. Navigation & skip — recommendation + IA notes

**Recommendation (single highest-leverage structural fix):** add one persistent, visible, mobile-first **`Menu`** ghost text button to the film's top chrome (both Movement-I and Movement-II states, and the reduced-motion static chrome), opening a quiet sheet with the canonical six destinations. Full design in §2(b). This one change fixes the returning-visitor dead-end on desktop and mobile at once, and brings the film to navigation parity with the rest of the site without touching the cinematic CTA choreography.

**IA notes — make the three nav surfaces agree on one canonical list:**

| Surface | Today | Fix |
|---|---|---|
| Global Header (`Header.tsx` NAV) | The Drives · The Tour · Stories · Marketplace · Sponsor + Get on the list | **Canonical — reuse this array everywhere.** |
| Film top chrome (StageChrome) | *(no menu pages at all)* — only Sponsor the wrap + Get on the list | Add the **Menu** sheet mirroring the Header NAV. |
| Film end-card footer nav | The drives · The tour · Sponsor · Stories — **Marketplace missing** | Add **Marketplace**; match casing to Header ("The Drives"). |

- **One-accent law is safe:** the Menu control is text/ghost, no Gulf — the single Gulf CTA stays the only accent per viewport.
- **Keep** the `sr-only` "Skip the film" link for keyboard/AT; ensure the visible Menu button is in the tab order right after the wordmark.
- The desktop **act ticks** can remain as a power-user in-film chapter jump, but they are not the skip/nav solution — the Menu sheet carries page navigation. Optionally expose "Jump to the tour" / "Jump to the ask" inside the sheet so the tick behavior gets a discoverable, labeled home.
- The **wordmark** (`Drive Exotiq` → `/`) is fine as a brand anchor but is not a nav affordance — it links to the page it's already on. The Menu button is what carries navigation.

---

## 7. Prioritized punch list for the copywriter

### 🔴 Blockers (do first)
1. **SB-04 (`frames.ts`):** promote "coming soon" to first-class weight — kicker `The fleet` → **`The fleet — opening soon`** (keep the body line).
2. **SB-08 (`frames.ts`):** reframe `Choose your car.` → **`Which one's yours?`** (kills the false "rent now" promise; SB-08b's `This one's yours.` answers it).
3. **Film top chrome (`ExperienceScroll.tsx`):** add a persistent, mobile-first **`Menu`** affordance opening a sheet with the six canonical destinations (Drives · Tour · Marketplace · Stories · Sponsor · Get on the list). Reuse `Header.tsx` NAV. *(Copy + IA task; engineering wires it.)*
4. **/tour (`app/tour/page.tsx`):** add the missing **AEO anchor sentence** server-rendered once (e.g. under the finale sub).

### 🟠 Major
5. **/tour:** rename the entity from **The Journey → The Tour** in meta title (`The Exotic Tour — Denver to Miami`), kicker, and doc title.
6. **/tour:** restore the canonical car — hero + meta `One built Audi S8` → **`One 2017 Audi S8`** (drop `built`).
7. **/tour finale headline:** `Ten cities. Thousands of miles. One blank canvas.` → **`5,000 miles. Ten cities. One blank canvas.`**
8. **SB-18 pivot headline (`frames.ts`):** `The drive is the product.` → a concrete reveal, e.g. **`This one's the founder's.`** (keep the S8 explanation in the body).
9. **SB-17 (`frames.ts`):** add a value-prop bridge (tour as a rolling billboard across ten markets) so SB-19's `Your livery on this car.` isn't a cold ask.
10. **SB-11 (`frames.ts`):** add a kicker/jewel flagging the S8 as one lone recurring car (not fleet), so the SB-18 payoff lands.
11. **/apply (`lib/interest.ts` + `app/apply/page.tsx`):** remove `Sponsor the wrap` from the select; replace with a `Sponsoring the wrap? → start here` nudge to /sponsor. Add coming-soon clause to the hero sub.
12. **End-card + Header nav:** add **Marketplace** to the film end-card footer nav and align label casing to the Header.

### 🟡 Minor
13. **SB-15 (`frames.ts`):** relocate `This could be you.` to right after SB-14b so "you" points at the drive, not the S8.
14. **SB-13b / SB-16 (`frames.ts`):** cut one of the two silent S8 plant beats to shorten the trough before the pivot.
15. **SB-20 (`frames.ts`):** add a plain gloss to `The keys, or the canvas.` — e.g. body `Rent and drive (get on the list), or wrap the car (sponsor the tour).`
16. **End-card marque list (`ExperienceScroll.tsx`) + home meta:** pick one canonical marque list, include **Ferrari**, reuse identically in both places.
17. **End-card Partner pillar:** `Bring us yours.` → drop it, or make it concrete (`Bring us your event.`).
18. **/thank-you (`app/thank-you/page.tsx`):** sponsor branch — reword so the lead feels received, demote /sponsor to secondary. Renter branches — swap primary off empty /blog to /drives or /marketplace until posts exist.
19. **/apply hero sub:** add `(rentals open soon at exotiq.rent)` so renters don't expect a booking confirmation.
20. **/sponsor meta title:** confirm `app/layout.tsx` appends `· Drive Exotiq` (≤60 ch); if not, add the suffix site-wide.
21. **/tour hero jewel (optional):** `a long way south, the long way.` → something that resolves on first read (e.g. `south, the long way — on purpose.`).
22. **SB-01 (optional):** consider dropping the tour from the opening breath so it lands as a surprise at the pivot (trade-off: current line is better for SEO).
