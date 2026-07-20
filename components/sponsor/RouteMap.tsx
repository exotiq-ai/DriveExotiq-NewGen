/**
 * The tour route as a real map. Three static layers, all baked path data from
 * components/tour/route-geo.ts (zero runtime deps, server-safe):
 *
 *   1. State outlines — the states the route crosses (CO NM TX LA MS AL FL)
 *      plus immediate neighbors for context, hairline `--de-line-2` over a
 *      whisper of `--de-surface`.
 *   2. The road-following Denver→Miami driving route (OSRM polyline —
 *      I-25→Raton→US-287, I-35, I-10, I-75/I-4, the Turnpike) in `--de-gulf`,
 *      the route's sanctioned accent. No point-to-point lines.
 *   3. The ten tour stops from BEATS (components/tour/data.ts) — inland
 *      markets labelled in place, the dense Florida cluster as a right-side
 *      label stack with leader lines so every market stays legible.
 *
 * Stop dots are OSRM's snapped waypoint locations, so they sit on the route
 * line by construction. Labels carry a `--de-bg-2` knockout (paint-order:
 * stroke) so state hairlines never strike through the type.
 *
 * Geometry is PROVISIONAL until the owner's Google Maps screenshot arrives —
 * regeneration procedure lives in the route-geo.ts header.
 */

import { BEATS } from '@/components/tour/data';
import {
  ROUTE_D,
  STATES_FILL_D,
  STATES_MESH_D,
  STOP_XY,
  VIEW_H,
  VIEW_W,
} from '@/components/tour/route-geo';

type Anchor = 'start' | 'middle' | 'end';

/** Directly-labelled inland markets — label offset from the dot. */
const INLAND: Record<string, { dx: number; dy: number; anchor: Anchor }> = {
  denver: { dx: 0, dy: -20, anchor: 'middle' },
  'dallas-ft-worth': { dx: 16, dy: 6, anchor: 'start' },
  austin: { dx: -16, dy: 5, anchor: 'end' },
  houston: { dx: 0, dy: 30, anchor: 'middle' },
  'new-orleans': { dx: 0, dy: 30, anchor: 'middle' },
};

/**
 * Florida cluster — label baselines for the right-side stack, ordered
 * north→south (not leg order) so no leader line ever crosses another.
 */
const STACK: Record<string, number> = {
  orlando: 410,
  'tampa-st-pete': 442,
  'palm-beach': 474,
  'ft-lauderdale': 506,
  miami: 538,
};

const LABEL_X = 962;

const XY = STOP_XY as Record<string, readonly [number, number]>;
const STOPS = BEATS.flatMap((b) => {
  const xy = XY[b.id];
  return xy ? [{ beat: b, x: xy[0], y: xy[1] }] : [];
});

const LABEL_STYLE = {
  fontSize: '18px',
  letterSpacing: '0.01em',
  paintOrder: 'stroke',
} as const;

export default function RouteMap() {
  const first = STOPS[0];
  const last = STOPS[STOPS.length - 1];

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`The 2026 tour route: ten markets from Denver to Miami, following the interstates through Colorado, New Mexico, Texas, Louisiana, Mississippi, Alabama, and Florida: ${BEATS.map((b) => b.name).join(', ')}.`}
    >
      {/* 1 — states: silhouette whisper + hairline borders */}
      <path d={STATES_FILL_D} fill="var(--de-surface)" fillOpacity="0.5" />
      <path
        d={STATES_MESH_D}
        fill="none"
        stroke="var(--de-line-2)"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* 2 — the road-following route */}
      <path
        d={ROUTE_D}
        fill="none"
        stroke="var(--de-gulf)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />

      {/* 3 — stops */}
      {STOPS.map((s) => {
        const inland = INLAND[s.beat.id];
        const stackY = STACK[s.beat.id];
        const terminus = s === first || s === last;
        return (
          <g key={s.beat.id}>
            {stackY !== undefined && (
              <polyline
                points={`${s.x},${s.y} ${s.x + 18},${s.y} ${LABEL_X - 10},${stackY - 4} ${LABEL_X - 4},${stackY - 4}`}
                fill="none"
                stroke="var(--de-line-2)"
                strokeWidth="1"
              />
            )}
            <circle cx={s.x} cy={s.y} r={terminus ? 7 : 4.5} fill="var(--de-gulf)" />
            {terminus && (
              <circle
                cx={s.x}
                cy={s.y}
                r="12"
                fill="none"
                stroke="var(--de-gulf)"
                strokeWidth="1"
                opacity="0.5"
              />
            )}
            {inland && (
              <text
                x={s.x + inland.dx}
                y={s.y + inland.dy}
                textAnchor={inland.anchor}
                fill="var(--de-text-2)"
                stroke="var(--de-bg-2)"
                strokeWidth="4"
                strokeLinejoin="round"
                style={LABEL_STYLE}
                fontFamily="var(--font-sans)"
              >
                {s.beat.name}
              </text>
            )}
            {stackY !== undefined && (
              <text
                x={LABEL_X}
                y={stackY}
                textAnchor="start"
                fill="var(--de-text-2)"
                stroke="var(--de-bg-2)"
                strokeWidth="4"
                strokeLinejoin="round"
                style={LABEL_STYLE}
                fontFamily="var(--font-sans)"
              >
                {s.beat.name}
              </text>
            )}
            {s.beat.tag && (
              <text
                x={s.x - 20}
                y={s.y + 5}
                textAnchor="end"
                fill="var(--de-text-3)"
                stroke="var(--de-bg-2)"
                strokeWidth="4"
                strokeLinejoin="round"
                style={{ fontSize: '13px', paintOrder: 'stroke' }}
                fontFamily="var(--font-serif)"
                fontStyle="italic"
              >
                {s.beat.tag}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
