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
  { id: 'SB-02', media: `${M}/garage-exterior.png`, movement: 'I', align: 'left', headline: 'The door is open.', weight: 2, mobileWeight: 1 },
  { id: 'SB-03', media: `${M}/threshold-rush.png`, movement: 'I', aria: 'Flying through the threshold into the garage' },
  {
    id: 'SB-04', media: `${M}/garage-interior-v2.png`, movement: 'I', align: 'center',
    kicker: 'The fleet', headline: 'Every one of them, driven.',
    body: 'The marketplace opens soon — exotiq.rent.',
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
  // Real 458 nose macro (Telluride shoot) — still-only beat: the source shot is
  // locked-off, so the plate + ken-burns + global grain carry it (zero video
  // bytes). Copy completes the 01/02/03 model pattern; the badge on screen
  // leads, the rest of the dial rides one sentence.
  {
    id: 'SB-07', media: `${M}/icons-458.jpg`, movement: 'I', align: 'left', kicker: '03', headline: 'Ferrari 458',
    // The 458 earns its clause (audit: the third model in the pattern got a
    // brand list where 01/02 got love) — and the fact is exact: after the 458,
    // every Ferrari V8 went turbo.
    body: 'The last naturally aspirated Ferrari V8.',
  },
  // SB-07b cut (owner + copy plan §4): the film asked before the viewer had
  // chosen. Its ask now lands on SB-08b — desire → choice → possession → ask.
  { id: 'SB-08', media: `${M}/choose.png`, movement: 'I', align: 'center', headline: 'Choose your car.', weight: 2, mobileWeight: 1 },
  {
    // REAL plate, third take (owner: the lakeside pan ghosted at its loop and
    // poster handoff — traveling shots can't do either). This is the STATIC
    // camera: R8 + 458 nose-on in the aspens (Telluride 58.2–62.2s), an
    // imperceptible-drift palindrome. focus biases the portrait crop onto the
    // 458 — the pair straddles a phone-width center crop.
    id: 'SB-08b', media: `${M}/pair-real.jpg`, movement: 'I', align: 'left', focus: '62% 50%',
    // The Movement-I ask, landed at possession (no kicker — the CTA already
    // says "the list"; review: the near-duplication class SB-20 was cured of).
    // Weight 1.5: the film's only in-movement conversion earns a held beat.
    headline: 'First keys to the fleet.', jewel: 'This one’s yours.',
    // The ask carries one noun of value (audit: it promised nothing).
    body: 'First booking windows when exotiq.rent opens.',
    cta: 'Get on the list', ctaHref: '/apply',
    weight: 1.5,
  },

  // ---------- McLaren drive-out (grouped: get in, wake it, roll out, run the coast) ----------
  { id: 'SB-09', media: `${M}/door-up.png`, movement: 'I', align: 'right', headline: 'Doors up.', weight: 2, mobileWeight: 1 },
  { id: 'SB-10', media: `${M}/cockpit-pov-v2.png`, movement: 'I', align: 'center', jewel: 'Settle in.' },
  { id: 'SB-11b', media: `${M}/roll-out.png`, movement: 'I', aria: 'The nose eases out of the garage' },
  // SB-14c REAL-added AI clip: the coastal-cliff aerial the reorder brings back
  // (SB-14-t1, the original coast take). A wordless exhale — the McLaren finally
  // out on open road at golden hour — before the drive world goes real.
  { id: 'SB-14c', media: `${M}/coast-aerial.png`, movement: 'I', align: 'center', aria: 'The McLaren runs the coast road at golden hour' },

  // ---------- Real footage → the drives ----------
  { id: 'SB-12', media: `${M}/road-real.jpg`, movement: 'I', align: 'center', headline: 'The road opens.' },
  {
    id: 'SB-14', media: `${M}/highcountry-real.jpg`, movement: 'I', align: 'center',
    // "Colorado's high country" is the film's one geography anchor (audit:
    // no persona could say WHERE any of this happens until the end card).
    kicker: 'The drives', body: 'Invite-only, the last Sunday of every month. Sunrise in Colorado’s high country, then Cars & Coffee.',
    aria: 'Aerial over a high-country road, two cars in convoy',
  },
  // The Gather beat (audit: the film claimed community and showed one human).
  // Real golden-hour Cars & Coffee — the rows of Ferraris and the people
  // between them ARE the pillar. Pays off SB-14's "then Cars & Coffee."
  {
    id: 'SB-14b', media: `${M}/gather-real.jpg`, movement: 'I', align: 'left',
    jewel: 'No stanchions. No judging.',
    aria: 'Golden hour at the Cars & Coffee, rows of Ferraris and the crowd between them',
  },

  // ---------- The turn ----------
  { id: 'SB-15', media: `${M}/chase-real.jpg`, movement: 'I', align: 'right', jewel: 'This could be you.' },

  // ---------- S8 storyline (grouped, silent): the founder's car, before it is named ----------
  // The lone dark S8 stays UNEXPLAINED here — a plant, not a spoiler; SB-18's
  // "One more thing" pays it off. Its own block (ignition → drive → away →
  // wheel) tightens the plant→payoff. Ignition is the REAL S8 start-button
  // (Roller 24.9–28.4s); the unmute is stripped (the master's audio carries the
  // videographer's music — silent until a clean startup recording exists).
  { id: 'SB-11', media: `${M}/ignition-real.jpg`, movement: 'I', align: 'left', kicker: 'Push to start', aria: 'Push to start — the real V8 wakes', weight: 1.5 },
  { id: 'SB-13', media: `${M}/drive-real.jpg`, movement: 'I', align: 'left', kicker: 'The high country', jewel: 'This is the drive.' },
  // SB-13b REAL: the S8 drives away down the dusk mountain road (Roller
  // 64.0–68.8s, lifted dusk-noir grade to keep the receding car legible).
  // Directional motion → play-once and hold, per the traveling-shot rule.
  { id: 'SB-13b', media: `${M}/drive-away.jpg`, movement: 'I', align: 'right', aria: 'Taillights receding down the dusk mountain road' },
  // focus 25%: the rolling wheel lives in the left half of the frame — a
  // portrait center-crop would ship mostly empty flank on phones.
  { id: 'SB-16', media: `${M}/wheel-real.jpg`, movement: 'I', aria: 'The wheel, up close, slowing', focus: '25% 50%' },

  // ---------- The Pivot ----------
  {
    id: 'SB-18', media: `${M}/s8-pivot.jpg`, movement: 'pivot', align: 'center',
    kicker: 'One more thing', headline: 'The drive is the product.', jewel: 'The story goes further.',
    // The reveal now names its payoff (audit: every persona hit "it's… a
    // sedan?"): the plant from the pass becomes the founder's own car.
    body: 'The 2017 Audi S8 you kept seeing — the founder’s own car, driven every mile.',
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
    body: 'Ten markets. {n} miles. Summer to fall 2026.', odometerTarget: 5000,
    secondaryCta: 'See the tour plan', secondaryCtaHref: '/tour',
  },
  {
    id: 'SB-19', media: `${M}/wrap-photoreal.png`, movement: 'II', align: 'center',
    headline: 'Your livery on this car.', jewel: 'Down this line, through ten cities.',
    // The sponsor money shot: full weight everywhere — the mobile path is the
    // code wipe, which is scroll-driven and genuinely fills the band.
    weight: 2.5, copyAt: 0.78,
  },
  {
    id: 'SB-19b', media: `${M}/gregory-getin.jpg`, movement: 'II', align: 'left',
    // The film's one human gets a name (audit: anonymous founder = wasted
    // trust moment for every persona).
    kicker: 'Gregory — founder',
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
    cta: 'Sponsor the wrap', ctaHref: '/sponsor',
    secondaryCta: 'Get on the list', secondaryCtaHref: '/apply',
  },
];
