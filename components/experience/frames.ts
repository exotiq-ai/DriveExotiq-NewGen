// The cinematic scroll spine as data. Media are photoreal scene renders on one
// locked film-noir grade (docs/redesign/storyboard/scenes-photoreal.mjs) plus
// real S8/founder photography in Movement II. The component layer is media-
// agnostic — swap any `media` path per frame (video posters welcome later).
// Copy is in the locked voice: short declaratives, sentence-case kickers, one
// serif-italic "jewel" line per beat, gulf reserved for actions only.

export type Movement = 'I' | 'pivot' | 'II';

export interface Frame {
  id: string;
  media: string;
  movement: Movement;
  align?: 'left' | 'center' | 'right';
  kicker?: string;
  headline?: string;
  /**
   * Small eyebrow status chip rendered centered directly above the kicker/
   * headline in the copy block (deck §7.1): `line` hairline border, `ink-2`
   * text, transparent (or `surface`) background. NO Gulf, no glow: it is a
   * status, not an action, and the film reserves Gulf for CTA choreography.
   * Inherits the beat's copy reveal; static under reduced motion. (SB-04's
   * `Opening soon`.)
   */
  chip?: string;
  /** The one Spectral-italic emotional line. */
  jewel?: string;
  body?: string;
  /** Animates a "{n}" placeholder in body as a count-up (SB-17's 5,000). */
  odometerTarget?: number;
  cta?: string;
  ctaHref?: string;
  secondaryCta?: string;
  secondaryCtaHref?: string;
  /** Accessible label when the frame carries no headline. */
  aria?: string;
  /**
   * Scroll weight on scrub-capable viewports (≥1024px, fine pointer): the
   * beat's copy block is weight·100svh tall, so it owns `weight` viewports of
   * scroll (default 1). Reviewed change — see bands.ts for the band math.
   */
  weight?: number;
  /**
   * Weight on coarse pointers / <1024px, defaulting to `weight`. Scrub beats
   * set 1 here: their mobile fallback is a play-once clip that finishes in
   * wall-clock time, so a long band would just hold a dead frame.
   */
  mobileWeight?: number;
  /**
   * Copy anchor inside a weighted block, as plate-local progress (default 0.5
   * = band center; clamped so the 100svh anchor window stays inside the
   * block). SB-19 anchors late so the caption resolves while the completed
   * livery reveal holds; SB-19b so it lands after the get-in resolves.
   */
  copyAt?: number;
  /**
   * Label for a tap-to-unmute affordance (SB-11: the REAL ignition bark rides
   * the clip's audio track). The film stays silent by design — sound only
   * ever plays on this explicit user gesture. Film path only.
   */
  sound?: string;
  /**
   * CSS object-position for the plate (still AND living layer). Portrait
   * viewports crop 16:9 to the center ~46% of frame width — set this when the
   * subject lives off-center (SB-16's wheel sits in the left half).
   */
  focus?: string;
  /**
   * The plate is bright where the copy block sits (zones measured 2026-07-06:
   * SB-07, SB-08b, SB-14), so ink copy risks washing out on large viewports.
   * The stage chrome renders a desktop legibility scrim behind the copy block
   * when this is set; the flag is pure data, no styling lives here.
   */
  brightPlate?: boolean;
}

const M = '/images/experience/photo';

export const FRAMES: Frame[] = [
  // ---------- Movement I — The Experience (renters) ----------
  {
    id: 'SB-01', media: `${M}/cold-open-v2.png`, movement: 'I', align: 'center',
    headline: 'Drive Exotiq',
    jewel: 'Built for the people who actually drive the car.',
    // Plain English at second zero (audit: the org-chart line made three cold
    // visitors work for the premise). The verbatim AEO anchor lives in the
    // page spine; the Exotiq Inc. lineage lives on the end card.
    body: 'Exotic rentals, invite-only drives, and a Denver-to-Miami tour.',
  },
  // Act I redesign (2026-07-06): the industrial door opens ONTO the corridor —
  // one centered vanishing point from the door aperture through SB-04's aisle,
  // and the first legible car in the film is the fleet itself. Centered copy
  // for the symmetric plate.
  // mobileWeight 2 (2026-07-07): phones now FINGER-SCRUB the door via the
  // portrait-native encode (LIVING portraitSrc) — the band must give the
  // gesture room. Save-data devices fall back to play-once and simply hold
  // the opened door for the band tail (acceptable: it is the money frame).
  { id: 'SB-02', media: `${M}/door-industrial-closed.png`, movement: 'I', align: 'center', headline: 'The door is open.', weight: 2, mobileWeight: 2 },
  // The walk-in: scroll carries the visitor through the doorway and down the
  // corridor (silent beat). Replaces SB-03's teleport-to-speed — velocity now
  // lives in this clip's final-second acceleration, blooming into SB-04.
  { id: 'SB-02b', media: `${M}/door-industrial-open.png`, movement: 'I', aria: 'Walking through the open door and down the corridor into the garage', weight: 1.5, mobileWeight: 1.5 },
  {
    id: 'SB-04', media: `${M}/garage-interior-v2.png`, movement: 'I', align: 'center',
    // Coming-soon promoted to first-class visual weight (deck §3.1 + §7.1):
    // the chip is the loud cue, so the fleet can't misread as a live rental
    // catalog; the body names the entity and echoes the /marketplace sub.
    kicker: 'The fleet', headline: 'Every one of them, driven.',
    chip: 'Opening soon',
    body: 'exotiq.rent. The marketplace built for people who actually drive.',
  },
  {
    id: 'SB-05', media: `${M}/mclaren-720s-v2.png`, movement: 'I', align: 'left', kicker: '01', headline: 'McLaren 720S',
    body: 'Twin-turbo V8 behind your shoulders. The one that rewards the driver, not the parking lot.',
  },
  {
    id: 'SB-06', media: `${M}/porsche-gt3rs.png`, movement: 'I', align: 'right', kicker: '02', headline: 'Porsche 911 GT3 RS',
    jewel: 'The canyon carver.',
    body: 'GT3 is Porsche’s motorsport bloodline, naturally aspirated in every generation. RS is that bloodline, concentrated.',
  },
  // 458 nose macro, restaged (owner 2026-07-06): the real Telluride photo
  // (daylight, gravel) popped out of the all-AI Movement-I stretch after the
  // AI-first reorder — a grade couldn't move it into the studio void, so the
  // plate is an AI restage FROM the real photo (same composition and panel
  // line; badge corrected in a second continuity pass — first take mangled
  // the Cavallino). icons-458.jpg stays on disk. Still-only beat: the plate +
  // ken-burns + global grain carry it (zero video bytes).
  {
    id: 'SB-07', media: `${M}/icons-458-v2.png`, movement: 'I', align: 'left', kicker: '03', headline: 'Ferrari 458',
    // The 458 earns its clause (audit: the third model in the pattern got a
    // brand list where 01/02 got love) — and the fact is exact: after the 458,
    // every Ferrari V8 went turbo.
    body: 'The last naturally aspirated Ferrari V8.',
    brightPlate: true,
  },
  // SB-07b cut (owner + copy plan §4): the film asked before the viewer had
  // chosen. Its ask now lands on SB-08b — desire → choice → possession → ask.
  // Rhetorical, not imperative (deck §3.1): "Choose your car." was a buy-now
  // ask before anything is bookable. SB-08b's "This one's yours." still
  // answers it, four beats later and over real cars.
  // mobileWeight 2 (2026-07-08): phones finger-scrub the creep via the
  // portrait encode — the band gives the gesture room (matches SB-02).
  { id: 'SB-08', media: `${M}/choose.png`, movement: 'I', align: 'center', headline: 'Which one’s yours?', weight: 2, mobileWeight: 2 },
  // ---------- McLaren drive-out (grouped: get in, wake it, roll out, run the road) ----------
  { id: 'SB-09', media: `${M}/door-up.png`, movement: 'I', align: 'right', headline: 'Doors up.', weight: 2, mobileWeight: 2 },
  { id: 'SB-10', media: `${M}/cockpit-pov-v2.png`, movement: 'I', align: 'center', jewel: 'Settle in.' },
  // 2026-07-08 owner redesign: the roll-out is now the film's THIRD scroll-
  // operated door — cabin POV facing the closed garage door (dawn leaking
  // beneath it, the Act I light-blade motif from the driver's seat), the
  // scroll rises the door and rolls the car out into the dawn, handing
  // POV-to-POV into SB-14c's windscreen canyon run. The old takes read as
  // driving PAST a garage (outside → door slides by → outside) — retired.
  { id: 'SB-11b', media: `${M}/cockpit-door-closed.png`, movement: 'I', aria: 'The garage door rises ahead and the car rolls out into the dawn', weight: 2, mobileWeight: 2 },
  // SB-14c re-plated (owner 2026-07-06): the coast aerial is OUT — the reorder
  // had revived the rejected coast take. Back in: the original dawn-canyon run
  // THROUGH THE WINDSCREEN (SB-12-t1, the pre-swap "road opens" POV). It closes
  // the cockpit thread (settle in → roll out → drive) and ends the AI storyline
  // from the driver's seat. Traveling POV → play-once and hold.
  { id: 'SB-14c', media: `${M}/open-road.png`, movement: 'I', align: 'center', aria: 'The dawn run through the windscreen, down the open canyon road' },
  {
    // The Movement-I ask, moved AFTER the McLaren storyline (owner 2026-07-06:
    // all AI content closes the first storyline, then the film goes real). The
    // film now answers SB-08's question by letting you drive the car; the
    // possession line lands on the FIRST real-footage frame — the AI dream
    // cuts to the real pair exactly as the film says "This one's yours."
    // REAL plate, third take (owner: the lakeside pan ghosted at its loop and
    // poster handoff — traveling shots can't do either). This is the STATIC
    // camera: R8 + 458 nose-on in the aspens (Telluride 58.2–62.2s), an
    // imperceptible-drift palindrome. focus biases the portrait crop onto the
    // 458 — the pair straddles a phone-width center crop.
    id: 'SB-08b', media: `${M}/pair-real.jpg`, movement: 'I', align: 'left', focus: '62% 50%',
    // The ask keeps its held beat (weight 1.5) — the film's only in-movement
    // conversion, now at the emotional peak instead of mid-choice.
    headline: 'First keys to the fleet.', jewel: 'This one’s yours.',
    body: 'First booking windows when exotiq.rent opens.',
    cta: 'Get on the list', ctaHref: '/apply',
    weight: 1.5,
    brightPlate: true,
  },

  // ---------- Real footage → the drives ----------
  { id: 'SB-12', media: `${M}/road-real.jpg`, movement: 'I', align: 'center', headline: 'The road opens.' },
  {
    id: 'SB-14', media: `${M}/highcountry-real.jpg`, movement: 'I', align: 'center',
    // "Colorado's high country" is the film's one geography anchor (audit:
    // no persona could say WHERE any of this happens until the end card).
    kicker: 'The drives', body: 'Invite-only, the last Sunday of every month. Sunrise in Colorado’s high country, then Cars & Coffee.',
    aria: 'Aerial over a high-country road, two cars in convoy',
    brightPlate: true,
  },
  // The Gather beat (audit: the film claimed community and showed one human).
  // Re-plated 2026-07-06 (owner): the Senna/Veyron shot is OUT (it also
  // carried another organizer's MAGNA placard in-scene — provenance flag
  // resolved). In: the owner's own lineup (Lambos + R8s nose to nose at
  // golden hour, 8K source), graded into the print at encode; the GRADE
  // overlay seats it like every real plate. Pays off SB-14's Cars & Coffee.
  {
    id: 'SB-14b', media: `${M}/lineup-real.jpg`, movement: 'I', align: 'left',
    jewel: 'No stanchions. No judging.',
    aria: 'Golden hour at the Cars & Coffee, the row of supercars nose to nose',
    focus: '58% 50%',
  },

  // ---------- The turn ----------
  { id: 'SB-15', media: `${M}/chase-real.jpg`, movement: 'I', align: 'right', jewel: 'This could be you.' },

  // ---------- S8 storyline (grouped, silent): the founder's car, before it is named ----------
  // The lone dark S8 stays UNEXPLAINED here — a plant, not a spoiler; SB-18's
  // "One more thing" pays it off. Its own block (ignition → drive → wheel)
  // tightens the plant→payoff. Ignition is the REAL S8 start-button
  // (Roller 24.9–28.4s); the unmute is stripped (the master's audio carries the
  // videographer's music — silent until a clean startup recording exists).
  // The register-flag jewel (deck §3.1): flags this as one lone car set apart
  // from the numbered 01/02/03 fleet, so its recurrence registers and the
  // SB-18 reveal lands on a car the viewer has been tracking.
  { id: 'SB-11', media: `${M}/ignition-real.jpg`, movement: 'I', align: 'left', kicker: 'Push to start', jewel: 'Not one of the three.', aria: 'Push to start. The real V8 wakes.', weight: 1.5 },
  { id: 'SB-13', media: `${M}/drive-real.jpg`, movement: 'I', align: 'left', kicker: 'The high country', jewel: 'This is the drive.' },
  // (SB-13b taillights-receding CUT 2026-07-06, deck §2 fork: four silent S8
  // beats was a long trough right where a cold viewer decides whether to keep
  // scrolling. Ignition → drive → wheel-slowing keeps the decel (SB-16)
  // leading straight into the pivot. Assets stay on disk for revert.)
  // focus 25%: the rolling wheel lives in the left half of the frame — a
  // portrait center-crop would ship mostly empty flank on phones.
  { id: 'SB-16', media: `${M}/wheel-real.jpg`, movement: 'I', aria: 'The wheel, up close, slowing', focus: '25% 50%' },

  // ---------- The Pivot ----------
  {
    id: 'SB-18', media: `${M}/s8-pivot.jpg`, movement: 'pivot', align: 'center',
    // The reveal lives in the HEADLINE (deck §3.1: "The drive is the product."
    // was a slogan, not information — cut). "This one's the founder's." echoes
    // SB-08b's "This one's yours.": renter's yours → founder's founder's.
    kicker: 'One more thing', headline: 'This one’s the founder’s.', jewel: 'The story goes further.',
    // The reveal now names its payoff (audit: every persona hit "it's… a
    // sedan?"): the plant from the pass becomes the founder's own car.
    body: 'The 2017 Audi S8 you kept seeing. The founder’s own car, driven every mile.',
    // The narrative hinge holds a breath: three copy elements over the
    // statue-still S8 earn more than one viewport.
    weight: 1.5,
  },

  // ---------- Movement II — The Tour (sponsors) ----------
  {
    // REAL dusk S-curve (Roller 70.9–75.2s) — the S8 small in a vast twilight
    // landscape: the journey at journey scale. Timing is canonical (§1.4);
    // the ghost link gives sponsor traffic its missing fact path (audit).
    id: 'SB-17', media: `${M}/scurve-real.jpg`, movement: 'II', align: 'left',
    kicker: 'The tour', headline: 'One car. Denver to Miami.',
    // The value bridge (deck §3.1): reframes the tour as an advertising asset
    // (pre-echoes /sponsor's "The car is a billboard that drives.") so the
    // SB-19 livery ask lands as the obvious payoff.
    jewel: 'A billboard that drives.',
    body: 'Ten markets. {n} miles. Summer to fall 2026.', odometerTarget: 5000,
    secondaryCta: 'See the tour plan', secondaryCtaHref: '/tour',
  },
  {
    id: 'SB-19', media: `${M}/wrap-photoreal.png`, movement: 'II', align: 'center',
    // The kicker marks the audience shift (deck §3.1): the ask was landing
    // before a cold viewer registered they'd been recategorized from renter
    // to sponsor. Sentence-case, no Gulf.
    kicker: 'The sponsorship',
    headline: 'Your livery on this car.', jewel: 'Down this line, through ten cities.',
    // The sponsor money shot: full weight everywhere — the mobile path is the
    // code wipe, which is scroll-driven and genuinely fills the band.
    weight: 2.5, copyAt: 0.78,
  },
  {
    id: 'SB-19b', media: `${M}/gregory-getin.jpg`, movement: 'II', align: 'left',
    // The film's one human gets a name (audit: anonymous founder = wasted
    // trust moment for every persona).
    kicker: 'Gregory, founder',
    headline: 'The garage door is open.', jewel: 'The road starts here.',
    // The real founder get-in (8.3s play-once) — at weight 1 the film cut away
    // ~25% into the one human money shot. Play-once ends settled, so the tail
    // of the band is a composed held frame on every device.
    weight: 2, copyAt: 0.65,
  },
  {
    id: 'SB-20', media: `${M}/cold-open-v2.png`, movement: 'II', align: 'center',
    // Owner-approved finale line: names both doors in — keys for renters,
    // canvas for the wrap sponsor — matching the two CTAs beneath it.
    // Secondary label is CTA-LIST ("Get on the list" ↔ /apply per the copy
    // brief's library; "Join the waitlist" is bound to /marketplace).
    kicker: 'Two ways in', headline: 'The keys, or the canvas.',
    // The plain gloss (deck §3.1): maps each metaphor to its door (keys →
    // list → drive, canvas → wrap → tour) so a skimmer can tell which ask is
    // theirs. Sits between the headline and the CTA pair.
    body: 'Get on the list to drive. Sponsor the wrap for the tour.',
    cta: 'Sponsor the wrap', ctaHref: '/sponsor',
    secondaryCta: 'Get on the list', secondaryCtaHref: '/apply',
  },
];
