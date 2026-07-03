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
  cta?: string;
  ctaHref?: string;
  secondaryCta?: string;
  secondaryCtaHref?: string;
  /** Accessible label when the frame carries no headline. */
  aria?: string;
}

const M = '/images/experience/photo';

export const FRAMES: Frame[] = [
  // ---------- Movement I — The Experience (renters) ----------
  {
    id: 'SB-01', media: `${M}/cold-open.png`, movement: 'I', align: 'center',
    headline: 'Drive Exotiq',
    jewel: 'Built for the people who actually drive the car.',
    body: 'An Exotiq Inc. brand — the community front door to the exotiq.rent marketplace.',
  },
  { id: 'SB-02', media: `${M}/garage-exterior.png`, movement: 'I', align: 'left', headline: 'The door is open.' },
  { id: 'SB-03', media: `${M}/threshold-rush.png`, movement: 'I', aria: 'Flying through the threshold into the garage' },
  {
    id: 'SB-04', media: `${M}/garage-interior.png`, movement: 'I', align: 'center',
    kicker: 'The fleet', headline: 'Every one of them, driven.',
  },
  { id: 'SB-05', media: `${M}/mclaren-720s.png`, movement: 'I', align: 'left', kicker: '01', headline: 'McLaren 720S', body: 'Twin-turbo V8. Full specs at launch.' },
  { id: 'SB-06', media: `${M}/porsche-gt3rs.png`, movement: 'I', align: 'right', kicker: '02', headline: 'Porsche 911 GT3 RS' },
  { id: 'SB-07', media: `${M}/lambo-ferrari.png`, movement: 'I', align: 'left', kicker: '03', headline: 'The icons.', body: 'Lamborghini. Ferrari.' },
  {
    id: 'SB-07b', media: `${M}/waitlist-still.png`, movement: 'I', align: 'center',
    kicker: 'The list', headline: 'First keys to the fleet.', cta: 'Get on the list', ctaHref: '/apply',
  },
  { id: 'SB-08', media: `${M}/choose.png`, movement: 'I', align: 'center', headline: 'Choose your car.' },
  { id: 'SB-08b', media: `${M}/mclaren-720s.png`, movement: 'I', align: 'left', jewel: 'This one’s yours.', cta: 'Reserve it', ctaHref: '/apply' },
  { id: 'SB-09', media: `${M}/door-up.png`, movement: 'I', align: 'right', headline: 'Doors up.' },
  { id: 'SB-10', media: `${M}/cockpit-pov.png`, movement: 'I', align: 'center', jewel: 'Settle in.' },
  { id: 'SB-11', media: `${M}/ignition.png`, movement: 'I', align: 'left', kicker: 'Push to start', aria: 'Push to start, the gauges sweep' },
  { id: 'SB-11b', media: `${M}/roll-out.png`, movement: 'I', aria: 'The nose eases out of the garage' },
  { id: 'SB-12', media: `${M}/open-road.png`, movement: 'I', align: 'center', headline: 'The road opens.' },
  { id: 'SB-13', media: `${M}/drive-mountain.png`, movement: 'I', align: 'left', jewel: 'This is the drive.' },
  { id: 'SB-14', media: `${M}/coast-aerial.png`, movement: 'I', align: 'center', kicker: 'The coast', aria: 'Golden-hour aerial over the coast road' },
  { id: 'SB-15', media: `${M}/coastline-run.png`, movement: 'I', align: 'right', jewel: 'This could be you.' },
  { id: 'SB-16', media: `${M}/wheel-detail.png`, movement: 'I', aria: 'Close detail along the flank' },

  // ---------- The Pivot ----------
  {
    id: 'SB-18', media: `${M}/s8-pivot.jpg`, movement: 'pivot', align: 'center',
    kicker: 'One more thing', headline: 'The drive is the product.', jewel: 'The story goes further.',
  },

  // ---------- Movement II — The Tour (sponsors) ----------
  {
    id: 'SB-17', media: `${M}/s8-vista.jpg`, movement: 'II', align: 'left',
    kicker: 'The tour', headline: 'One car. Denver to Miami.', body: 'Ten markets. 5,000 miles.',
  },
  {
    id: 'SB-19', media: `${M}/wrap-photoreal.png`, movement: 'II', align: 'center',
    jewel: 'Your livery on this car.', headline: 'Down this line. Ten cities.',
  },
  {
    id: 'SB-19b', media: `${M}/gregory-getin.jpg`, movement: 'II', align: 'left',
    headline: 'The garage door is open.', jewel: 'The road starts here.',
  },
  {
    id: 'SB-20', media: `${M}/cold-open.png`, movement: 'II', align: 'center',
    kicker: 'Two ways in', headline: 'Sponsor the wrap.',
    cta: 'Sponsor the wrap', ctaHref: '/sponsor',
    secondaryCta: 'Reserve an exotic', secondaryCtaHref: '/apply',
  },
];
