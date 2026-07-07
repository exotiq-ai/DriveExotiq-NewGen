/**
 * The tour route as a map. Ten markets plotted at their real geographic
 * positions (Denver NW → the Gulf → the Florida coast), connected by the gulf
 * route line. Replaces the old "Reach: Inquire" list — the route IS the media
 * plan (copy brief §9.3). Reach figures arrive with the media kit.
 *
 * The dense Florida cluster (Tampa→Miami) gets a clean right-side label stack
 * with leader lines so every market stays legible.
 */

type Dot = { n: number; name: string; x: number; y: number };

// Directly-labelled inland markets.
const INLAND: (Dot & { lx: number; ly: number; anchor: 'start' | 'middle' | 'end' })[] = [
  { n: 1, name: 'Denver', x: 96, y: 104, lx: 96, ly: 80, anchor: 'middle' },
  { n: 2, name: 'Dallas / Ft Worth', x: 362, y: 300, lx: 362, ly: 278, anchor: 'middle' },
  { n: 3, name: 'Austin', x: 338, y: 372, lx: 300, ly: 388, anchor: 'end' },
  { n: 4, name: 'Houston', x: 420, y: 392, lx: 420, ly: 424, anchor: 'middle' },
  { n: 5, name: 'New Orleans', x: 590, y: 372, lx: 590, ly: 350, anchor: 'middle' },
];

// Florida cluster — dots in place, labels stacked on the right with leaders.
const FLORIDA: (Dot & { ly: number })[] = [
  { n: 6, name: 'Tampa / St Pete', x: 812, y: 430, ly: 384 },
  { n: 7, name: 'Orlando', x: 852, y: 402, ly: 416 },
  { n: 8, name: 'Palm Beach', x: 900, y: 452, ly: 448 },
  { n: 9, name: 'Ft Lauderdale', x: 908, y: 480, ly: 480 },
  { n: 10, name: 'Miami', x: 912, y: 508, ly: 512 },
];

const LABEL_X = 962;
const ALL = [...INLAND, ...FLORIDA].sort((a, b) => a.n - b.n);
const routeD = ALL.map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x} ${s.y}`).join(' ');

export default function RouteMap() {
  return (
    <svg
      viewBox="0 0 1160 560"
      className="h-auto w-full"
      role="img"
      aria-label="The 2026 tour route: ten markets from Denver to Miami: Denver, Dallas/Ft Worth, Austin, Houston, New Orleans, Tampa/St Pete, Orlando, Palm Beach, Ft Lauderdale, and Miami."
    >
      <path
        d={routeD}
        fill="none"
        stroke="var(--de-gulf)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />

      {/* Inland markets — direct labels */}
      {INLAND.map((s) => (
        <g key={s.n}>
          <circle cx={s.x} cy={s.y} r={s.n === 1 ? 7 : 4.5} fill="var(--de-gulf)" />
          {s.n === 1 && (
            <circle cx={s.x} cy={s.y} r="12" fill="none" stroke="var(--de-gulf)" strokeWidth="1" opacity="0.5" />
          )}
          <text
            x={s.lx}
            y={s.ly}
            textAnchor={s.anchor}
            fill="var(--de-text-2)"
            style={{ fontSize: '18px', letterSpacing: '0.01em' }}
            fontFamily="var(--font-sans)"
          >
            {s.name}
          </text>
        </g>
      ))}
      <text x="96" y="136" textAnchor="middle" fill="var(--de-text-3)" style={{ fontSize: '13px' }} fontFamily="var(--font-serif)" fontStyle="italic">
        start
      </text>

      {/* Florida cluster — dots + leader lines + stacked labels */}
      {FLORIDA.map((s) => (
        <g key={s.n}>
          <polyline
            points={`${s.x},${s.y} ${s.x + 18},${s.y} ${LABEL_X - 10},${s.ly - 4} ${LABEL_X - 4},${s.ly - 4}`}
            fill="none"
            stroke="var(--de-line-2)"
            strokeWidth="1"
          />
          <circle cx={s.x} cy={s.y} r={s.n === 10 ? 7 : 4.5} fill="var(--de-gulf)" />
          {s.n === 10 && (
            <circle cx={s.x} cy={s.y} r="12" fill="none" stroke="var(--de-gulf)" strokeWidth="1" opacity="0.5" />
          )}
          <text
            x={LABEL_X}
            y={s.ly}
            textAnchor="start"
            fill="var(--de-text-2)"
            style={{ fontSize: '18px', letterSpacing: '0.01em' }}
            fontFamily="var(--font-sans)"
          >
            {s.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
