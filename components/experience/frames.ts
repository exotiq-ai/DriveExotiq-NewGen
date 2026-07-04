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
}

const M = '/images/experience/photo';

export const FRAMES: Frame[] = [
  // ---------- Movement I — The Experience (renters) ----------
  {
    id: 'SB-01', media: `${M}/cold-open-v2.png`, movement: 'I', align: 'center',
    headline: 'Drive Exotiq',
    jewel: 'Built for the people who actually drive the car.',
    body: 'An Exotiq Inc. brand — the community front door to the exotiq.rent marketplace.',
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
    body: 'The last naturally aspirated Ferrari V8. Then the quiet end of the dial — Lamborghini, Rolls-Royce, Aston Martin, G-Wagon.',
  },
  // SB-07b cut (owner + copy plan §4): the film asked before the viewer had
  // chosen. Its ask now lands on SB-08b — desire → choice → possession → ask.
  { id: 'SB-08', media: `${M}/choose.png`, movement: 'I', align: 'center', headline: 'Choose your car.', weight: 2, mobileWeight: 1 },
  {
    // REAL plate (owner: don't re-show SB-05's portrait) — the rain-beaded
    // 458+R8 pair at the lakeside. Choose the dream at SB-08; possess the
    // real thing here.
    id: 'SB-08b', media: `${M}/pair-real.jpg`, movement: 'I', align: 'left',
    // The Movement-I ask, landed at possession (no kicker — the CTA already
    // says "the list"; review: the near-duplication class SB-20 was cured of).
    // Weight 1.5: the film's only in-movement conversion earns a held beat.
    headline: 'First keys to the fleet.', jewel: 'This one’s yours.',
    cta: 'Get on the list', ctaHref: '/apply',
    weight: 1.5,
  },
  { id: 'SB-09', media: `${M}/door-up.png`, movement: 'I', align: 'right', headline: 'Doors up.', weight: 2, mobileWeight: 1 },
  { id: 'SB-10', media: `${M}/cockpit-pov-v2.png`, movement: 'I', align: 'center', jewel: 'Settle in.' },
  // Weight 1.5: the gauge sweep is plate-local-progress-driven, so it inherits
  // the longer band on every device — at weight 1 the whole sweep was 0.25
  // viewports and a single flick skipped the ignition moment. Real footage:
  // the S8 Roller start-button press (24.9–28.4s), thumb on the red ring.
  { id: 'SB-11', media: `${M}/ignition-real.jpg`, movement: 'I', align: 'left', kicker: 'Push to start', aria: 'Push to start, the gauges sweep', weight: 1.5 },
  { id: 'SB-11b', media: `${M}/roll-out.png`, movement: 'I', aria: 'The nose eases out of the garage' },
  // The drive world goes REAL from here: Telluride aspen aerial, the S8 alone
  // on the alpine pass, the high-country curve, the FPV chase, the rolling
  // wheel — the owners' actual cars on actual Colorado roads.
  { id: 'SB-12', media: `${M}/road-real.jpg`, movement: 'I', align: 'center', headline: 'The road opens.' },
  // The lone dark sedan stays UNEXPLAINED — a plant, not a spoiler; SB-18's
  // "One more thing" pays it off. The drives-pillar copy lives on SB-14,
  // the plate that actually shows two cars running together.
  { id: 'SB-13', media: `${M}/drive-real.jpg`, movement: 'I', align: 'left', kicker: 'The high country', jewel: 'This is the drive.' },
  {
    id: 'SB-14', media: `${M}/highcountry-real.jpg`, movement: 'I', align: 'center',
    // "Colorado's high country" is the film's one geography anchor (audit:
    // no persona could say WHERE any of this happens until the end card).
    kicker: 'The drives', body: 'Invite-only, the last Sunday of every month. Sunrise in Colorado’s high country, then Cars & Coffee.',
    aria: 'Aerial over a high-country road, two cars in convoy',
  },
  { id: 'SB-15', media: `${M}/chase-real.jpg`, movement: 'I', align: 'right', jewel: 'This could be you.' },
  { id: 'SB-16', media: `${M}/wheel-real.jpg`, movement: 'I', aria: 'The wheel, up close, slowing' },

  // ---------- The Pivot ----------
  {
    id: 'SB-18', media: `${M}/s8-pivot.jpg`, movement: 'pivot', align: 'center',
    kicker: 'One more thing', headline: 'The drive is the product.', jewel: 'The story goes further.',
    // The narrative hinge holds a breath: three copy elements over the
    // statue-still S8 earn more than one viewport.
    weight: 1.5,
  },

  // ---------- Movement II — The Tour (sponsors) ----------
  {
    id: 'SB-17', media: `${M}/s8-vista.jpg`, movement: 'II', align: 'left',
    kicker: 'The tour', headline: 'One car. Denver to Miami.', body: 'Ten markets. {n} miles.', odometerTarget: 5000,
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
