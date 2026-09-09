'use client';

import { useEffect, useMemo, useRef } from 'react';
import { MotionValue, useMotionValueEvent } from 'framer-motion';
import { BEATS } from './data';

interface RoadbookProps {
  /** Drive progress 0→1 across the pinned stage. */
  progress: MotionValue<number>;
}

const VB_W = 120;
const VB_H = 1000;
const PAD = 48;

/** Build a smooth quadratic spine through the ten stops (mirrors the prototype). */
function buildPath() {
  const n = BEATS.length;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const y = PAD + t * (VB_H - 2 * PAD);
    const x = 60 + Math.sin(t * Math.PI * 3.2) * 24;
    pts.push([x, y]);
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    d += ` Q${a[0]},${a[1]} ${mx},${my}`;
  }
  const last = pts[pts.length - 1];
  d += ` L${last[0]},${last[1]}`;
  return { d, pts };
}

/**
 * Left-rail roadbook: the route draws in via strokeDashoffset as you drive, a
 * warm-metal car dot rides the line (getPointAtLength), and the ten city nodes
 * flip hairline→gulf as they're passed. Decorative (aria-hidden) — the route is
 * also expressed as the server-rendered <section> list for crawlers.
 */
export default function Roadbook({ progress }: RoadbookProps) {
  const { d, pts } = useMemo(buildPath, []);

  const drawRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);
  const nodeRefs = useRef<Array<SVGCircleElement | null>>([]);
  const lenRef = useRef(0);

  const render = (p: number) => {
    const path = drawRef.current;
    if (!path) return;
    const clamped = p < 0 ? 0 : p > 1 ? 1 : p;
    const total = lenRef.current || path.getTotalLength();

    path.style.strokeDashoffset = String(total * (1 - clamped));

    const pt = path.getPointAtLength(total * clamped);
    if (carRef.current) {
      carRef.current.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
    }

    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const node = nodeRefs.current[i];
      if (!node) continue;
      const passed = clamped >= i / (n - 1) - 0.001;
      // Gulf is the one live color — only the reached nodes get it.
      node.setAttribute('fill', passed ? 'var(--de-gulf)' : 'var(--de-bg)');
      node.setAttribute(
        'stroke',
        passed ? 'var(--de-gulf)' : 'var(--de-line-2)'
      );
    }
  };

  useMotionValueEvent(progress, 'change', render);

  useEffect(() => {
    const path = drawRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    lenRef.current = total;
    path.style.strokeDasharray = String(total);
    path.style.strokeDashoffset = String(total);
    render(progress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-[120px] overflow-visible"
    >
      {/* base track */}
      <path
        d={d}
        fill="none"
        stroke="var(--de-line-2)"
        strokeWidth={1.5}
      />
      {/* drawn (driven) line — gulf, the live color */}
      <path
        ref={drawRef}
        d={d}
        fill="none"
        stroke="var(--de-gulf)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* nodes */}
      {pts.map((pt, i) => (
        <circle
          key={i}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          cx={pt[0]}
          cy={pt[1]}
          r={3.4}
          fill="var(--de-bg)"
          stroke="var(--de-line-2)"
          strokeWidth={1.5}
        />
      ))}
      {/* warm-metal car dot riding the line */}
      <g ref={carRef} transform={`translate(${pts[0][0]} ${pts[0][1]})`}>
        <circle r={4.5} fill="var(--de-metal)" />
      </g>
    </svg>
  );
}
