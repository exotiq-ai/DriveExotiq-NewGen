/**
 * THE JOURNEY — shared, crawlable source of truth for the Denver→Miami tour.
 * Both the SERVER page (real headings/links) and the 'use client' motion
 * islands read from this file, so the copy never drifts between the static
 * fallback and the cinematic stage.
 */

/** Round-trip odometer target. Matches the "~5,000 miles" headline. Single constant. */
export const ODO_TARGET = 4980;

export interface CityBeat {
  /** 1-indexed leg number. */
  leg: number;
  /** URL/section id slug. */
  id: string;
  /** City name (the <h2>). */
  name: string;
  /** One Spectral-italic line — the scene. */
  dek: string;
  /** Cumulative mile marker at this stop. */
  mi: number;
  /** Display label for the leg's mileage ("0 mi", "~785 mi"). */
  legMi: string;
  /** Editorial note beneath the dek. */
  note: string;
  /** Optional tag rendered as a quiet marker ("start"). */
  tag?: string;
}

/**
 * Cumulative miles are derived from the verbatim per-leg distances so the
 * route line, odometer, and node flips all agree. The last city (Miami) lands
 * near the one-way distance; ODO_TARGET represents the full round trip.
 */
export const BEATS: CityBeat[] = [
  {
    leg: 1,
    id: 'denver',
    name: 'Denver',
    dek: 'Where the air is thin and the road begins.',
    mi: 0,
    legMi: '0 mi',
    note: 'Mile zero. The S8 wakes at altitude, on the Front Range.',
    tag: 'start',
  },
  {
    leg: 2,
    id: 'dallas-ft-worth',
    name: 'Dallas / Ft Worth',
    dek: 'Down off the mountains, into the flat fast dark.',
    mi: 785,
    legMi: '~785 mi',
    note: 'First long haul. Big sky, bigger straights, the densest Texas scene.',
  },
  {
    leg: 3,
    id: 'austin',
    name: 'Austin',
    dek: 'Where the cars and the people get a little weirder.',
    mi: 980,
    legMi: '~195 mi',
    note: 'A sleeper S8 belongs here. Cars & Coffee at the track.',
  },
  {
    leg: 4,
    id: 'houston',
    name: 'Houston',
    dek: 'Heat, horsepower, and the first taste of Gulf air.',
    mi: 1145,
    legMi: '~165 mi',
    note: 'Serious builds, serious humidity. The deepest market between the coasts.',
  },
  {
    leg: 5,
    id: 'new-orleans',
    name: 'New Orleans',
    dek: 'The road turns south and slows down to listen.',
    mi: 1495,
    legMi: '~350 mi',
    note: 'Brake check after the dry run. A night off the gas.',
  },
  {
    leg: 6,
    id: 'tampa-st-pete',
    name: 'Tampa / St. Pete',
    dek: 'Across the Gulf, into the Florida light.',
    mi: 2170,
    legMi: '~675 mi',
    note: 'The longest single leg. Sunrise somewhere over the Panhandle.',
  },
  {
    leg: 7,
    id: 'orlando',
    name: 'Orlando',
    dek: 'Inland for a night, then back toward the water.',
    mi: 2255,
    legMi: '~85 mi',
    note: 'Shortest hop of the tour. Pure Cars & Coffee country.',
  },
  {
    leg: 8,
    id: 'palm-beach',
    name: 'Palm Beach',
    dek: 'Where the money idles at the curb.',
    mi: 2425,
    legMi: '~170 mi',
    note: 'The sleeper disguise earns its keep among the open exotics.',
  },
  {
    leg: 9,
    id: 'ft-lauderdale',
    name: 'Ft Lauderdale',
    dek: 'Down the coast, windows down, the A1A unspooling.',
    mi: 2470,
    legMi: '~45 mi',
    note: 'The slowest, prettiest miles on the whole route.',
  },
  {
    leg: 10,
    id: 'miami',
    name: 'Miami',
    dek: 'The end of the line, under a falling sun.',
    mi: 2500,
    legMi: '~30 mi',
    note: 'The tour arrives where the scene is loudest.',
  },
];
