'use client';

// SB-11 — THE GAUGE SWEEP. A razor-sharp drawn tachometer owned by the scroll,
// modeled on the real S8 cluster photography (refs/shoots/s8/DSC02086 tach,
// DSC02096 needle): numerals 0–8 (×1000 1/min) inside the tick ring, 0 at the
// bottom with the needle at rest pointing straight down, ~300° clockwise sweep,
// slim white tapered needle on a dark hub, red dashes at the top of the scale,
// "1/min ×1000" label. Brand law: 1.5px line weights, 2px corners, no glow
// fills (the photographic starter ring beneath supplies all bloom), and ONE
// Gulf-blue tick that ignites for a beat at the redline crossing.
//
// Timeline (plate-local progress p, scrubbing both directions):
//   0–.30 dormant · .30–.55 cold-start sweep 0→8000 (aggressive ease-out)
//   ≈.55 Gulf tick beat · .55–.72 damped fall-back to idle · .72–1 idle micro-tick

import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';

const MAX = 8000;
const IDLE = 1100;
/** Needle angle: 0 rpm points straight down (180° from 12 o'clock), full scale +300° clockwise. */
const angleOf = (rpm: number) => 180 + (Math.max(0, rpm) / MAX) * 300;

function rpmAt(p: number): number {
  if (p < 0.3) return 0;
  if (p < 0.55) {
    const t = (p - 0.3) / 0.25;
    return MAX * (1 - Math.pow(2, -10 * t)); // easeOutExpo — the cold-start snap
  }
  if (p < 0.72) {
    const t = (p - 0.55) / 0.17;
    return IDLE + (MAX - IDLE) * Math.exp(-4.5 * t) * Math.cos(4.7 * t); // damped overshoot
  }
  return IDLE;
}

const C = 200; // dial center
const R = 172; // tick ring radius

function polar(deg: number, r: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180; // deg measured clockwise from 12 o'clock
  return [C + r * Math.cos(rad), C + r * Math.sin(rad)];
}

function Tick({ rpm, major }: { rpm: number; major: boolean }) {
  const a = angleOf(rpm);
  const [x1, y1] = polar(a, R);
  const [x2, y2] = polar(a, R - (major ? 16 : 9));
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--de-text)" strokeWidth={major ? 2 : 1.2} opacity={major ? 0.95 : 0.6} />;
}

/** Red dashes riding the rim over the top of the scale, as on the real cluster. */
function RedlineDashes() {
  const dashes = [];
  for (let r = 7050; r <= 7950; r += 180) {
    const a = angleOf(r);
    const [x1, y1] = polar(a, R + 4);
    const [x2, y2] = polar(a, R - 4);
    dashes.push(<line key={r} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#B33A2B" /* diegetic instrument red (real cluster), exempt from the papaya flag rule */ strokeWidth={3} opacity={0.9} />);
  }
  return <>{dashes}</>;
}

export default function GaugeSweep({ p }: { p: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const needleRef = useRef<SVGGElement>(null);
  const digitsRef = useRef<SVGTextElement>(null);
  const gulfRef = useRef<SVGGElement>(null);
  const pRef = useRef(0);

  useMotionValueEvent(p, 'change', (v) => { pRef.current = v; });

  // One imperative 60fps driver: scroll-determined rpm + time-based idle wander.
  useAnimationFrame((t) => {
    if (reduce) return;
    const v = pRef.current;
    let rpm = rpmAt(v);
    if (v >= 0.72) rpm += Math.sin((t / 1200) * Math.PI * 2) * 40 + Math.sin(t / 310) * 12; // ±~1.5° idle tick
    needleRef.current?.setAttribute('transform', `rotate(${angleOf(rpm)} ${C} ${C})`);
    if (digitsRef.current) {
      const shown = Math.max(0, Math.round(rpm / 50) * 50);
      digitsRef.current.textContent = String(shown).padStart(4, '0');
      digitsRef.current.setAttribute('opacity', v < 0.3 ? '0.3' : '0.95');
    }
    // The one Gulf-blue element: a telemetry tick igniting as the needle crosses redline.
    const gulf = v > 0.5 && v < 0.62 ? 1 - Math.abs((v - 0.56) / 0.06) : 0;
    gulfRef.current?.setAttribute('opacity', String(Math.max(0, Math.min(1, gulf))));
  });

  // Overlay resolves in over the plate's first 10% of band and out over its last 10%.
  const envelope = useTransform(p, [0, 0.1, 0.9, 1], [0, 0.92, 0.92, 0]);

  if (reduce) {
    // Frozen idle pose — the instrument still reads, nothing animates.
    return (
      <div className="pointer-events-none absolute right-[6%] top-[10%] w-[min(38vw,460px)] opacity-90 mix-blend-screen" aria-hidden="true">
        <Dial needleAngle={angleOf(IDLE)} />
      </div>
    );
  }

  return (
    <motion.div
      className="pointer-events-none absolute right-[6%] top-[10%] w-[min(38vw,460px)] mix-blend-screen"
      style={{ opacity: envelope }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 400" className="w-full">
        <DialChrome />
        <g ref={gulfRef} opacity={0}>
          {(() => {
            const a = angleOf(MAX);
            const [x1, y1] = polar(a, R + 7);
            const [x2, y2] = polar(a, R - 18);
            return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--de-gulf)" strokeWidth={2.5} />;
          })()}
        </g>
        {/* needle — slim, tapered, counterweighted, per DSC02096 */}
        <g ref={needleRef} transform={`rotate(${angleOf(0)} ${C} ${C})`}>
          <polygon points={`${C - 2.6},${C + 18} ${C + 2.6},${C + 18} ${C + 1},${C - 150} ${C - 1},${C - 150}`} fill="var(--de-text)" />
          <polygon points={`${C - 3.4},${C + 18} ${C + 3.4},${C + 18} ${C + 2.2},${C + 34} ${C - 2.2},${C + 34}`} fill="var(--de-surface-2)" />
        </g>
        <circle cx={C} cy={C} r={17} fill="var(--de-surface)" stroke="var(--de-line-2)" strokeWidth={1.5} />
        {/* rpm digits in a hairline frame, Schibsted/tabular per brand */}
        <rect x={C - 38} y={C + 96} width={76} height={26} rx={2} fill="rgba(11,11,12,0.55)" stroke="var(--de-line-2)" strokeWidth={1} />
        <text
          ref={digitsRef}
          x={C}
          y={C + 114}
          textAnchor="middle"
          fill="var(--de-text)"
          opacity={0.3}
          style={{ font: '600 17px var(--font-sans, ui-sans-serif)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.08em' }}
        >
          0000
        </text>
      </svg>
    </motion.div>
  );
}

/** Static dial furniture shared by live and reduced-motion poses. */
function DialChrome() {
  const nums = [];
  for (let k = 0; k <= 8; k++) {
    const a = angleOf(k * 1000);
    const [x, y] = polar(a, R - 34);
    nums.push(
      <text key={k} x={x} y={y + 7} textAnchor="middle" fill="var(--de-text)" opacity={0.92}
        style={{ font: '500 26px var(--font-sans, ui-sans-serif)', fontVariantNumeric: 'tabular-nums' }}>
        {k}
      </text>,
    );
  }
  const ticks = [];
  for (let r = 0; r <= MAX; r += 250) {
    if (r % 1000 === 0) ticks.push(<Tick key={r} rpm={r} major />);
    else if (r % 500 === 0) ticks.push(<Tick key={r} rpm={r} major={false} />);
  }
  return (
    <>
      <circle cx={C} cy={C} r={R + 12} fill="none" stroke="var(--de-line-2)" strokeWidth={1.5} opacity={0.8} />
      {ticks}
      <RedlineDashes />
      {nums}
      <text x={C + 64} y={C + 152} fill="var(--de-text-3)" opacity={0.75} style={{ font: '400 13px var(--font-sans, ui-sans-serif)' }}>
        1/min ×1000
      </text>
    </>
  );
}

function Dial({ needleAngle }: { needleAngle: number }) {
  return (
    <svg viewBox="0 0 400 400" className="w-full">
      <DialChrome />
      <g transform={`rotate(${needleAngle} ${C} ${C})`}>
        <polygon points={`${C - 2.6},${C + 18} ${C + 2.6},${C + 18} ${C + 1},${C - 150} ${C - 1},${C - 150}`} fill="var(--de-text)" />
      </g>
      <circle cx={C} cy={C} r={17} fill="var(--de-surface)" stroke="var(--de-line-2)" strokeWidth={1.5} />
    </svg>
  );
}
