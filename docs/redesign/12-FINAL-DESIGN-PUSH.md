# 12 — THE FINAL DESIGN PUSH

> Source: owner walkthrough, 2026-07-20 ("Website scrolling experience — text pinning, readability,
> transitions, and bugs"). Every item below is grounded in a code recon run the same day; file:line
> references are verified against `newgen-main`.
>
> **For agentic workers:** execute phases in order (A→H). Phases A–E are the film; F–G are /tour;
> H is post-MVP. Each workstream has acceptance criteria — a phase is done when its criteria pass
> on desktop Safari + Chrome AND iPhone Safari (375×812), not when the code compiles.

**Goal:** The film reads like a title sequence you cannot put down — copy pins while the picture
keeps moving, every seam match-cuts, nothing ever sticks on reverse scroll, and you always know
where you are. The tour page shows the car in the first second, talks like a person, plays its
film in Safari, and never buries the sponsor ask.

**Architecture:** All film work flows through the established pattern — *timeline as data in
`bands.ts`/`frames.ts`, consumed via MotionValue transforms*. No third `useScroll`. No z-index.
Tour work is direct edits to `app/tour/page.tsx` + `components/tour/*`.

**Design laws (already enforced in code — every new element obeys them):**
one Gulf accent per viewport · 2px corners · hairline depth, never glow · sentence-case kickers ·
one Spectral-italic jewel per scene · still-first (video failure always leaves the graded still) ·
opaque-underneath crossfade, DOM-order painting · reduced-motion story required for every feature.

---

## The one architectural insight that orders everything

Copy visibility today is a **binary `useInView(0.55)` time-tween** (`CinematicStage.tsx:51-76,156-169`).
Both the owner's pin request AND half the reverse-scroll jank trace to that: a pinned block never
leaves the viewport (so in-view can't hide it), and reverse scrolling replays entrance tweens
non-deterministically. **Phase A moves copy visibility onto band-progress transforms** — the same
`progress` MotionValue + `bands` stops the plates already use. Pinning (B) and scrub-direction
sanity then become data, not special cases. Do A first; everything else gets cheaper.

---

# PHASE A — Foundation: copy on the timeline + reverse-scroll integrity

## A1 · Scroll-linked copy visibility

**Owner's words:** "It doesn't let me pause to see the words" / "when I scroll back up… it's not replaying as it should."

**Current state:** `Copy` in `components/experience/CinematicStage.tsx:51-268` receives only `index`;
reveal is a 0.85s tween fired by `useInView(ref, {amount:0.55})` (line 55); a mobile chrome-guard
observer (57-76) hides copy near the header. Copy physically travels 1:1 with scroll.

**Build:**
- Pass `progress` (MotionValue) + `bands` into `Copy` — both already in scope at the render site
  (`CinematicStage.tsx:563-567`).
- Derive per-beat opacity/y from `useTransform(progress, [bandStops], [...])` mirroring exactly how
  `Plate` computes band-relative stops (`CinematicStage.tsx:284-297`). Entrance completes by
  `start[k] + 0.25·unit`; exit completes by `end[k] − 0.15·unit` — the same margin the plate
  dissolve uses, so copy is always gone before the next plate is fully in.
- Keep the blur-in flourish desktop-only (blur on coarse pointers stays banned — `useNoTextBlur`,
  lines 36-49). Reverse scroll now runs the same curve backwards — deterministic by construction.
- Chrome guard (mobile) stays as a clamp on the derived opacity, not a competing animation.

**Acceptance:** scrub up/down at any speed, stop anywhere — copy opacity/position is a pure
function of scroll position. No tween replays, no pop-in, no stuck-invisible blocks.

## A2 · Reverse-scroll bug kill-list (7 diagnosed causes)

**Current state:** all in `components/experience/LivingLayer.tsx`. The recon confirmed seven
concrete defects; each fix below names its cause.

**Build:**
1. **AbortError kills layers for the session** (`LivingLayer.tsx:83-88`, same at `:176`): `near`
   flipping fast makes the interrupted `play()` promise reject → `setReady(false)` → beat shows its
   still forever (readiness poll re-arms only on `[src]`). Fix: in every `play().catch`, distinguish
   `AbortError`/interruption (no-op or retry) from real failure; make the readiness poll re-arm on
   `[src, ready]`.
2. **Play-once reset asymmetry** (`:171-183`): `playAt` 0.15 vs `resetBelow` 0.02 leaves a dead
   window where `played.current=true` with the clip frozen on last frame. Fix: rewind whenever the
   plate is **covered** (state already computed at `CinematicStage.tsx:300-306`) instead of a p<0.02
   sliver.
3. **Silent rewind failure + visible snap** (`:180`): `currentTime=0` swallowed by `catch {}` and
   fires mid-dissolve. Fix: rewind only while provably covered (opacity 0); log-and-retry on
   failure instead of swallowing.
4. **Scrub seekGate deadlock** (`:264-271, 309`): lost `seeked` event spins the rAF chase forever.
   Fix: watchdog — clear the gate if no `seeked` within ~250ms; also clear on `error`/`stalled`.
5. **Scrub chase lag at seams** (`:259-277`): fast reverse exits the band before the lerp catches
   up. Fix: when p enters the dissolve zone, bypass the lerp — hard-set `currentTime` to the
   boundary frame (see D1 "snap-to-final").
6. **Working-set React-state lag** (`CinematicStage.tsx:300-306, 460-472`): transient stills on
   multi-band flicks. Accept as transient OR derive `covered` from the MotionValue directly.
7. **Play-once replays forward on upward entry** (`:186`): use `progress.getVelocity()` (or prev
   value) for direction; on upward entry show the clip's **last** frame instead of playing from 0.

**Acceptance:** from the finale, flick to top as fast as the trackpad allows, then scroll down
again slowly: every beat replays, no still-locked layers, no frozen mid-frames, no visible frame-0
snaps during dissolves. Repeat 5× including short (2-3 beat) reversals inside the dist≤2 window —
that's where these bugs live. Test Safari + Chrome, desktop + iPhone.

---

# PHASE B — The pin (marquee feature)

**Owner's words:** "Hero text needs to pin… come to like the top 75, and as I continue to scroll it
gets nicely pinned while the video continues behind it, then I go to the next scene."

**Current state:** exactly one sticky element exists — the media stage (`CinematicStage.tsx:481`).
Copy blocks are normal-flow divs. The weighted "anchor window" (`CinematicStage.tsx:258-267`,
`globals.css:404-416`) chooses where copy sits in a long band but still travels 1:1. Lenis uses
native scroll, so `position:sticky` is proven viable (the stage itself).

**Spec:** copy enters with scroll from below, docks at **~25svh from the viewport top**, holds
there while the plate's video keeps playing behind it, then releases/fades ahead of the next
plate's dissolve (release driven by band progress from A1, *not* useInView). ⚠️ 25svh is an
*interpretation* of the owner's "come to, like, the top 75" (read as: text sits 75% of the screen
above the fold). Make the dock offset a single CSS var so it's a one-line tune, and confirm the
read at the B checkpoint (alternative reading: ~75px from the top). The film beat's video hold is
funded by beat weight — the pin is felt on every copy-bearing beat, strongest on the heavies.

**Build:**
- `frames.ts` (`:37-55`): add `pin?: boolean` (default true for copy-bearing beats) — data-only.
  Beats that pin need `weight ≥ ~1.5` to fund hold distance (sticky travel = blockHeight −
  childHeight − topOffset; a weight-1 block holds ≈ zero at top:25svh). Retune weights; both
  weight tables recompute from data (`bands.ts compute()`, `:44-57`) — this is the codebase's
  established data-only path, but it changes total scroll length. That is an **owner-visible side
  effect** (the film gets longer): call it out explicitly at the B checkpoint and re-verify feel
  end-to-end.
- `globals.css` (beside `.beat-anchor`, `:411-416`): new `.beat-pin` — `position:sticky;
  top:25svh; height:100svh` inside the `.beat-h` track, same `--wf/--wc` var pattern. Keep offsets
  in svh (mobile toolbar drift — `jumpTo` already compensates, `ExperienceScroll.tsx:266-277`).
- `CinematicStage.tsx:258-267`: in the heavy-beat branch, swap `beat-anchor absolute` →
  the sticky wrapper, preceded by a flow spacer so entry lands at the current `copyAt` position.
  **Sticky element = outer wrapper; framer animates only descendants** (the inner motion.div's
  transform must never sit on the sticky node).
- `bands.ts compute()`: redefine `anchorVh` for pinned beats to the pin-engage point so FilmMenu
  jumps, act ticks, and keyboard stepping (`ExperienceScroll.tsx:285-317`) land on pinned copy.
- Release: the A1 band-progress exit already handles it — release completes before
  `end[k] − 0.15·unit`.
- Mobile: verify 25svh clears the chrome-guard line (13% ≈ 106px vs 203px on 812px viewport — OK
  on paper, verify per-device). Reduced-motion: `StaticStage` unchanged (no pin, no bands).

**Acceptance:** on every copy-bearing beat you can stop scrolling mid-hold and read a stationary
block at 25svh while the video visibly continues; scrolling through without stopping, the text is
readable in-motion because it is stationary during the hold. Keyboard/menu/tick jumps land on the
pin. No layout shift at dock/release moments. Reverse scroll re-docks cleanly.

---

# PHASE C — Readability: consistent scale + earned contrast

**Owner's words:** "Consistent size… white works down here, but with noise behind it it's very
difficult to read. Bounding box or some interactive element that makes it high contrast."

**Current state:** type is ALREADY uniform across all 25 beats (headline `text-4xl md:text-6xl`,
jewel `text-2xl md:text-3xl`, body `text-base md:text-[19px]` — `CinematicStage.tsx:180-212`).
The failure is contrast: three scrim layers exist (`globals.css:424-461`) but `.copy-scrim-bright`
is **desktop-only** and only 3 beats are flagged `brightPlate` (SB-07, SB-08b, SB-14).

**Spec — the "print plate" treatment, not a box:** a bounding box would fight the warm-noir grammar
(hairline depth, never panels). Instead: earn contrast with a deepened, tighter radial scrim that
reads as a lens vignette, per-beat-tuned. This is the existing system, finished — not a new one.
(The owner said "bounding box **or** some interactive element that makes it high contrast" — the
scrim-over-box call is our design recommendation under that "or"; show him the result at the C
checkpoint rather than treating the box as rejected.)

**Build:**
- **Diagnose the perceived size inconsistency first.** Type classes are uniform in code, yet the
  owner perceived inconsistent sizes — something real produces that: candidate culprits are
  `max-w-[16ch]` wrapping short vs long headlines very differently, jewel-vs-headline mixes
  varying per beat, and travel speed differences on weighted beats. Identify the actual cause and
  fix the *perception* (e.g., balance-wrap long headlines, normalize which slots appear per beat)
  — don't close the item on "already uniform."
- Audit all 25 beats against their **brightest frame** (not the poster): flag every beat that fails
  ~4.5:1 for body text as `brightPlate` in `frames.ts`. (The scrub beats change brightness across
  the band — judge at the copy hold window from Phase B.)
- Enable `.copy-scrim-bright` on mobile/coarse (`globals.css:449-457` — currently desktop-only,
  so flagged beats get no extra help on phones).
- Deepen the base `.copy-scrim` stop curve so the text zone floor is consistent scene-to-scene:
  target = white body text ≥ 4.5:1, headline ≥ 3:1, over the measured brightest frame.
- Optional per-beat `scrim: 'soft' | 'deep'` data field if two strengths aren't enough — same
  brightPlate→class pattern, one render site (`CinematicStage.tsx:132-151`).
- Keep `text-shadow` (`globals.css:432-434`) — it's the last 10%, not the system.

**Acceptance:** step through every beat at its copy hold and screenshot: no beat where body copy
needs effort to read; measured contrast on the worst frame of each beat passes 4.5:1 (body) / 3:1
(display). Mobile gets the same guarantee.

---

# PHASE D — Seam re-keyframing (match cuts)

**Owner's words:** "When we open the door and it shifts to the video, those two need to match up…
re-keyframe the transitions between all the videos."

**Current state:** every handoff is an opaque-underneath crossfade (`CinematicStage.tsx:284-297`)
of *whatever each plate currently shows* = still + video frame + **independent ken-burns zoom
state**. Three compounding mismatches (recon-verified): (1) outgoing plate sits at ~1.16 zoom while
incoming enters at 1.06 — **even pixel-identical frames jump ~9%** (`CinematicStage.tsx:309-314`);
(2) scrub lerp + deadZones ending at 0.94-0.96 mean the dissolve often catches a not-yet-final
frame (`LivingLayer.tsx:228, 259-277`); (3) unpinned play-once seams (SB-11b→SB-14c, SB-09→SB-10)
have no frame relationship at all.

**Build — code first (fixes the "door" class cheaply):**
- **Zoom-sync at seams:** new `SEAMS` data in `living.ts` (beside `EXITS`/`FADES`, `:90-121`)
  flagging matched pairs; for flagged pairs, either land the outgoing ken-burns at the incoming's
  start scale, or exempt both from ken-burns across the boundary (the `finale` flag at
  `CinematicStage.tsx:309` is the existing pattern). First targets: SB-02→SB-02b (same render,
  pure zoom bug today), SB-19→SB-19b.
- **Snap-to-final:** when scrub p exceeds the deadZone end, bypass the chase lerp and hard-set
  `currentTime = duration − 0.05` so the held frame is always the pinned frame (also closes A2 #5).
- **Per-seam FADES tuning + Bloom assists** (`living.ts:112-121`, `CinematicStage.tsx:429-452`):
  for genuinely different compositions, tighten toward a cut or add a Bloom-style swallow rather
  than widening dissolves.

**Build — content second (the two unpinned door seams):**
- Extract the outgoing clip's true last frame; re-render the incoming clip with
  `frameImages.first` pinned to it (pipeline already supports this —
  `docs/redesign/storyboard/beats-manifest.json`; SB-01 pins first=last today).
  Queue: **SB-11b roll-out → SB-14c canyon** and **SB-09 doors-up → SB-10 cockpit** (the seams the
  owner is naming), then sweep all 24 boundaries and triage each as: matched / assisted / cut.

**Acceptance:** a seam audit table of all boundaries (outgoing frame vs incoming frame,
screenshotted at the boundary) with every seam classified and no unintentional framing jump; the
door seams hold composition through the dissolve at any scroll speed, forward and reverse.

---

# PHASE E — Wayfinding: the chapter rail

**Owner's words:** "Have the chapters more visible so I know where I am and where I'm going… I
don't know how long it keeps going for."

**Current state:** a 1px Gulf hairline + two desktop act ticks (SB-18/SB-20) + FilmMenu jumps +
keyboard stepping (`ExperienceScroll.tsx:58-206, 266-317`). No rail. Beats have no title field;
movements exist (I = beats 1-20, pivot = 21, II = 22-25).

**Spec:** a right-edge chapter rail — one hairline tick per chapter (not per beat: ~6-7 chapters
grouped over the 25 beats, e.g. *Cold open · The fleet · Doors up · The drive · First keys · The
pivot · The tour & the ask*), current chapter labeled in sentence case, fill-line showing global
progress so total length is legible at a glance. Desktop: persistent, hover reveals labels,
click = `jumpTo`. Mobile: no rail (touch targets + edge clipping — the documented law at
`ExperienceScroll.tsx:170-172`); instead surface the current chapter name in the existing header
chrome and make FilmMenu the chapter list (it already jumps, `FilmMenu.tsx:144-160`).

**Build:**
- `frames.ts`: new `CHAPTERS` grouping constant over beat ids (no per-frame title field needed).
- Rail renders inside `StageChrome` (`ExperienceScroll.tsx:58-206`) — positioned by
  `anchorVh/(total-1)` like the act ticks, active chapter via `bandAt(progress)`, navigation via
  existing `jumpTo`. Mount-gated + remount on table flip (`:324`) like everything else.
- The Gulf hairline stays the page's one Gulf accent — rail ticks are `--de-line-2`/`--de-metal`,
  active tick may borrow the hairline's sanctioned Gulf.

**Acceptance:** at any point in the film you can see (desktop) or summon (mobile ≤1 tap) where you
are, what's ahead, and how much remains; clicking any chapter glides to its copy anchor; the rail
never fights the header, ticks, or scroll cue for attention.

---

# PHASE F — /tour page

## F1 · Hero: see the car

**Current state:** hero is a still (`app/tour/page.tsx:33-51`) of a distant, unliveried S8 hidden
behind a berm, under two heavy scrims (0.94 bottom / 0.7 left). Two NEW owner renders sit untracked
in `public/images/cars/`: **"S8 with RS6 GT Heritage livery Tortilla flats front 45degree shot.png"**
(1448×1086, car-dominant front-¾, livery visible — the hero) and **"Audi S8 Livery Hanger 1 tall
facing right.png"** (1060×1484 portrait — the mobile art-direction).

**Build:**
- Re-encode both: kebab-case rename, AVIF/WebP + jpg fallback + `blurDataURL`, into
  `public/images/experience/poster/` (protect LCP: keep `fill priority sizes="100vw"`).
- Desktop hero = Tortilla Flats 45° render, car right-of-center via `object-position`; mobile
  art-direction = portrait hangar render (second `<Image>` with responsive visibility).
  Note: 1448px is marginal full-bleed — quality-check at 1440+ viewports; upscale pass if soft.
- Re-tune scrims: bottom gradient capped under the copy block, left scrim per F4's stronger curve —
  the car must read instantly; the copy earns its floor locally instead of dimming the whole frame.
- Keep the one-moving-picture rule (owner call 2026-07-07): hero stays a still.

**Acceptance:** first paint shows a liveried, unmistakable car on both breakpoints; LCP does not
regress (compare Lighthouse before/after); copy still passes contrast.

## F2 · Copy rewrite: "as if you're explaining to a friend"

**Current state:** all inline JSX in `app/tour/page.tsx` (hero `:53-79`, finale `:124-167`),
finale strings **duplicated** in `RoadbookStage.tsx:148-159`, city copy in
`components/tour/data.ts:35-127`.

**Owner's direction:** current copy "smells like AI." He wants: *this is who we are, this is what
we're doing* — the trip visits fleet-management operators across the US; sponsors advertise in
front of them; "10 markets" alone is meaningless — say what the blast radius actually is.

**Constraint (hard):** no invented numbers. The repo has **zero** vendor/fleet-operator counts
(recon-verified; reach figures are a standing owner blocker, `app/sponsor/page.tsx:133`). Honest
fuel that exists today: 10 named markets with per-leg mileage and editorial notes (`data.ts`),
named C&C venues per market in `content/blog/tour-denver.md`/`tour-miami.md`, ODO 4,980 round trip.

**Build:**
- Hero block: keep "Before first light…" only if it survives the friend-test; add one plain-spoken
  line of *what this is* (a supercar-fleet tour: one car, driven to the people who run exotic
  fleets in ten US markets, wrap for sale) before the poetry.
- Finale (`page.tsx:128-141` AND `RoadbookStage.tsx:153-158`, in lockstep): reframe from elegy to
  ask — the blast-radius pitch: the markets visited, the scenes it parks in (C&C venues from the
  blog intel), get your brand on the canvas. Keep the AEO anchor sentence server-rendered.
- Hoist hero/finale strings into `data.ts` beside `BEATS` so server page + stage read one source
  (kills the duplication permanently).
- When owner supplies real reach numbers, they slot into the finale + /sponsor — placeholder copy
  must read complete without them.
- Voice check: doc-10 §1 banned-words list applies; canonical facts only (2017 S8, ~5,000 mi,
  10 markets, Denver→Miami, summer→fall 2026).

**Acceptance:** the owner reads /tour top to bottom and it sounds like him explaining the trip to
a friend; every number on the page is sourced from `data.ts` or owner-supplied; no duplicated
finale strings remain.

## F3 · Safari autoplay fix

**Current state:** ONE video on /tour (`RoadbookStage.tsx:103-114`) with `autoPlay muted loop
playsInline` in JSX — but **React SSR does not serialize `muted` into markup** (React #10389), so
Safari parses an *unmuted* autoplay video and blocks it; there is **no `.play()` call anywhere in
components/tour/** to retry after hydration. This exactly reproduces "nothing autoplays in Safari."
Also: the whole stage is `hidden md:block` (`:91`) — phones get **no video at all** by design.

**Build:**
- Ref + effect in `RoadbookStage`: `v.defaultMuted = true; v.muted = true;` then `play().catch()`
  on mount, on IntersectionObserver entry, and on first scroll/pointer as gesture-adjacent retries
  — the exact pattern already proven in `LivingLayer.tsx:86, 176, 244`.
- Low Power Mode: on final rejection keep the poster and surface a small tap-to-play affordance
  (must live outside the `aria-hidden` tree). Still-first law holds.
- Keep `preload="metadata"` until the stage nears viewport.
- **Owner decision needed:** mobile /tour currently has zero video by design. Either confirm the
  static timeline is the mobile story, or scope a portrait-friendly stage later — but the Safari
  fix above is desktop-complete either way.

**Acceptance:** cold-load /tour in desktop Safari (fresh profile, no gesture): windshield video is
moving before the stage reaches mid-viewport. iPhone Safari: intentional static timeline confirmed
(or video if the owner opts in). Low Power Mode: poster + working tap-to-play. **Site-wide sweep:**
the owner said "or any of them, or any of it" — also cold-load the film page in desktop Safari and
verify every beat's video plays without a gesture (A2's `play()` fixes cover those paths; this
verifies it explicitly rather than assuming).

## F4 · Video off-center + left gradient

**Owner's words:** "Move the video over 20 and create a black fade on the side… so your text stands
out and isn't over top of the car."

**Current state:** video is dead-center (`object-cover`, no object-position —
`RoadbookStage.tsx:104`); left fade exists but decays to canvas/10 by midpoint (`:117-120`);
CityBeat text is left-anchored over the car (`CityBeat.tsx:41`).

**Build:**
- Shift the visual center right by ~20% **of the viewport** — math check: `objectPosition` alone
  cannot deliver this. It only redistributes the cover *overflow*, which today is ~12-19% total
  (`inset-x-[-6%]` + `scale-[1.06]`), i.e. a 2-4% visible shift — imperceptible against the
  owner's most concrete numeric ask. Primary approach: widen the wrapper's overscan asymmetrically
  (e.g. `left-[-2%] right-[-22%]`) and/or compose an `x` shift through the motion wrapper's
  existing style object (`style={{ y: pan, x: '10%' }}` — never a Tailwind translate class; framer
  owns that inline transform). Use `objectPosition` only as the fine-tune on top. Watch the 720p
  source (≤1279px) for softness if scale increases.
- Replace the left scrim with an explicit curve: `linear-gradient(to right, #0B0B0C 0%,
  rgba(11,11,12,0.82) 22%, rgba(11,11,12,0.35) 45%, transparent 65%)` — canvas color, not pure
  black — so `max-w-[34rem]` beat text sits fully on dark ground.
- Mirror both moves on the hero still once F1 lands.
- Check the 720p source (≤1279px viewports) for softness after repositioning.

**Acceptance:** at every city beat, text sits on dark ground with the car/road composition visible
to its right; nothing important in the footage is cropped away; both breakpoint sources verified.

## F5 · CTA system: never bury the ask

**Current state:** above the fold on /tour there is nothing clickable in the page body; the only
sponsor CTA is 13 viewports down (1300vh stage between hero and footer CTAs —
`page.tsx:149-162`, `RoadbookStage.tsx:91`). Header's "Sponsor" nav link renders only at lg+.
The "$10M" line exists nowhere in the repo.

**Build (three composable moves, all server-rendered, crawlable):**
1. **Hero CTA row** (after `page.tsx:78`): primary Link → `/sponsor?interest=title-wrap` (deep-link
   already supported — `lib/sponsor.ts:34+`) with the owner's **dictated** value line: "Why this
   wrap is worth $10 million — partner or sponsor the wrap. Learn more." He specified this wording
   in the meeting, so ship it as dictated — with one flag raised at the F checkpoint: it's a public
   dollar claim with no in-repo backing, so get written confirm there (soften only if he says so).
2. **Persistent tour CTA:** a fixed bottom-right pill (plain positioned Link, `z-40`, below Header's
   z-50, clear of the stage's pointer-events-none overlays): "Sponsor the wrap." Appears after the
   hero (first beat), suppressed near the footer CTAs to avoid doubling.
3. **Header:** surface "Sponsor" below lg (it's invisible on tablet/mobile today outside the
   sheet) — either as the second button or in the compact row.

**Acceptance:** from any scroll position on /tour, the sponsor path is ≤1 interaction away; hero
communicates the value frame without clicking; Gulf-accent law preserved (the pill is the
viewport's one Gulf action).

---

# PHASE G — Route map v2 (partially blocked on owner input)

**Owner's words:** "I'll give you a screenshot of Google Maps with the route… make it look really
pretty and match the site… show the states and the route and the stops. No point-to-point routing —
map routing. Use the Denver-to-Miami Summer/Fall 26 artifact style."

**Current state:** `components/sponsor/RouteMap.tsx` is a hand-plotted SVG with straight
point-to-point polylines — literally what the owner wants replaced. The referenced "Summer/Fall 26"
artwork is **NOT in the repo** (searched exhaustively). Stops data exists twice (`RouteMap.tsx:14-29`
geo coords, `data.ts:35-127` copy/mileage).

**Build (unblocked half — do now):**
- Merge coords into `data.ts` `BEATS` → one canonical tour dataset powering /tour, /sponsor, map.
- Build the offline geometry pipeline: directions API over the BEATS waypoints
  (Denver→Dallas→Austin→Houston→New Orleans→Tampa→Orlando→Palm Beach→Ft Lauderdale→Miami),
  simplify (Douglas-Peucker), project together with `us-atlas` state outlines (d3-geo albersUsa)
  into static SVG path data. **The first geometry pass is provisional** — the owner's Google Maps
  screenshot is the route-fidelity reference, and if his actual routing differs (different
  interstates, detour legs), regenerating is a pipeline re-run, not a rebuild. Zero runtime deps,
  no tile services, no keys — preserves the var(--de-*) theming that makes the current map
  theme-proof.
- Rebuild `RouteMap.tsx` in three layers: state outlines (`--de-line-2`), road-following route
  (`--de-gulf`, optional dash-draw on scroll), stops from the merged dataset (reuse the
  INLAND/FLORIDA label system + leader lines).
- Proposed scope addition (owner OK at the G checkpoint): render the map on /tour too (below the
  finale) — the tour page currently has no geographic visual. The owner asked only for the
  sponsor-page map; this is our suggestion.

**Blocked half — owner inputs:** (1) the Google Maps route screenshot (route fidelity reference);
(2) the "Denver to Miami Summer/Fall 26" artwork file or its location (style reference). Style
pass happens when they arrive; the geometry work above is independent.

**Acceptance:** the route visibly follows highways (I-70/I-35/I-10/I-75 shapes are recognizable),
states are legible, all 10 stops labeled, themed in site tokens in both dark/light; owner confirms
it matches the artifact's mood once supplied.

---

# PHASE H — Post-MVP: the text reveal moment

**Owner's words:** "Maybe there's a color that goes underneath it, a box around it, something that
says *this is what we're looking at right now*… advanced and not necessary for MVP."

Held until A-G land. Direction that fits the grammar (no boxes, no glow): a **scroll-linked
underline draw** — a 2px hairline that draws under the headline during the pin hold (progress-
linked, not timed), in metal with the beat's one Gulf accent reserved for CTAs; optionally the
Spectral-italic jewel line ink-fills from `--de-text-3` to `--de-text` across the hold. And the
owner's "**it links to the next one**": at the end of the hold, the drawn underline resolves into
a small next-chapter cue (sentence-case label, existing `jumpTo`) — each reveal becomes a doorway
to the following beat. Pure `useTransform` on the A1 plumbing; zero new architecture. Prototype on
one heavy beat (SB-19), owner-review before rollout.

---

# Verification protocol (every phase)

- **Device matrix:** desktop Safari + Chrome (fine pointer), iPhone Safari 375×812 (coarse), plus
  reduced-motion pass (StaticStage/StaticChrome must remain coherent).
- **Scroll gauntlet:** slow scrub, fast flick, direction reversal mid-beat, 2-3-beat short
  reversals, Home/End jumps, FilmMenu jumps — after every phase, not just A2.
- **Perf gates:** LCP on / and /tour must not regress (hero swap F1 is the risk); scrub stays
  jank-free (no layout thrash from the sticky pin — watch for reflow in the copy column).
- **SCRUB_MQ law:** `bands.ts:24`, `globals.css:413`, `LivingLayer.tsx:43-49` stay in sync on any
  timeline change.

# Owner inputs needed (none block Phases A-E)

| # | Input | Blocks | Status |
|---|-------|--------|--------|
| 1 | Google Maps route screenshot | G style/fidelity pass | promised in meeting |
| 2 | "Denver to Miami Summer/Fall 26" artwork file (not in repo) | G style pass | needs locating |
| 3 | "$10M wrap" line — written confirm of the wording he dictated | nothing (F5 ships it as dictated meanwhile) | dictated in meeting |
| 4 | Reach/vendor numbers per market | F2 finale + /sponsor upgrade | standing blocker (09 §D) |
| 5 | Mobile /tour video: keep static timeline or scope portrait stage | F3 scope | new |
| 6 | Mileage window confirm (4,980 round trip vs one-way framing) | F2 copy | standing (09 §D) |
| 7 | POV canyon clip placement | none (parked) | standing (09 §D) |
| 8 | Pin dock point — "top 75" read as ~25svh from top (75% of screen below the text); confirm vs a ~75px reading | nothing (tunable CSS var either way) | interpretation |

# Sequencing at a glance

**A (foundation) → B (pin) → C (contrast) → D (seams) → E (chapters)** — the film, in dependency
order. **F1-F5** (tour) is independent of A-E and can run in parallel. **G** geometry work anytime;
style pass on owner assets. **H** last, gated on owner review of a one-beat prototype.

Ship checkpoints: after B (the film feels different), after E (film complete), after F5 (tour
complete), after G (sponsor story complete). Each checkpoint = full verification protocol +
staging deploy for owner walkthrough.

---

# Appendix — paste-ready `/goal` condition (≤4,000 chars)

```
Final design push for driveexotiq.com (plan: docs/redesign/12-FINAL-DESIGN-PUSH.md). Done when ALL hold on desktop Safari+Chrome and iPhone Safari (375x812):

FILM (/):
1. Copy pins: on every copy-bearing beat, text enters with scroll, docks ~25svh from the viewport top, holds stationary while the video keeps playing behind it, then releases before the next scene's dissolve. Stopping mid-hold shows a stationary, readable block. Keyboard/menu/tick jumps land on pinned copy.
2. Readability: type scale consistent across beats; every beat's copy passes contrast at its brightest frame (body >=4.5:1, display >=3:1) via deepened per-beat scrims including mobile; no beat requires effort to read.
3. Seams: no unintentional framing jump at any beat boundary — ken-burns zoom synced at flagged seams, scrub holds its final pinned frame into the dissolve, and the door seams (SB-09→SB-10, SB-11b→SB-14c) match-cut via re-rendered first-frame pins. A seam audit table classifies every boundary.
4. Reverse scroll: flick bottom→top then scroll down again: every beat replays; no stuck frames, no still-locked layers (AbortError guarded), no frame-0 snaps mid-dissolve; scrub seek watchdog in place; short 2-3-beat reversals stay clean 5x in a row.
5. Chapters: desktop shows a chapter rail (grouped chapters, current highlighted, click-to-jump, total length legible at a glance); mobile surfaces the current chapter in the chrome and FilmMenu doubles as the chapter list.

TOUR (/tour):
6. Hero shows the liveried car unmistakably at first paint on both breakpoints (Tortilla Flats 45deg desktop / hangar portrait mobile, re-encoded AVIF/WebP); LCP not regressed.
7. Copy rewritten in owner voice ("explaining to a friend"): hero states plainly what the tour is; finale reframed as the blast-radius sponsor ask using only real numbers (10 named markets, named C&C scenes, 4,980 mi); finale strings single-sourced in data.ts (RoadbookStage duplicate gone).
8. Windshield video autoplays on desktop Safari cold-load (muted set imperatively + play() retries); Low Power Mode shows poster + tap-to-play.
9. Stage video visual center shifted right ~20% of the viewport (asymmetric overscan / wrapper x-shift; objectPosition alone is insufficient) with a strengthened canvas-left gradient so beat text sits on dark ground with the car visible beside it; mirrored on the hero.
10. Sponsor path <=1 interaction from any scroll position: hero CTA row with the dictated value line ("Why this wrap is worth $10 million — partner or sponsor the wrap"; written confirm at checkpoint), persistent sponsor pill, Sponsor surfaced in the header below lg.

ROUTE MAP: RouteMap rebuilt as a themed static SVG: real road-following geometry (recognizable interstates, not point-to-point lines), state outlines, 10 stops driven from a merged canonical data.ts dataset; rendered on /sponsor and /tour; style pass matches the Summer/Fall 26 artifact once the owner supplies it plus the Google Maps reference.

POST-MVP (only after all above): scroll-linked underline/ink text reveal prototyped on one beat for owner review.

Laws throughout: one Gulf accent per viewport, hairline not glow, still-first video fallback, reduced-motion coherent, SCRUB_MQ trio in sync, no invented numbers.
```
