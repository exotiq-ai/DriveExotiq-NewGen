'use client';

import { useEffect, useRef } from 'react';
import { useScroll, useReducedMotion } from 'framer-motion';

/**
 * GarageStage — the fixed cinematic backdrop the visitor scrolls THROUGH.
 *
 * A purely decorative (aria-hidden) layer system: receding floor, parallax
 * pillars, an overhead light pool, a raking light bar, a low Gulf glow that
 * breathes, drifting dust motes and 5% grain — all driven by global scroll
 * progress via framer-motion's useScroll. The real content/headings live in
 * the server-rendered <section> rooms stacked above this on the z-axis.
 *
 * Reduced motion / no-JS: the stage simply renders a calm static warm-black
 * frame with a faint glow; the rooms degrade to a clean vertical stack.
 */
export default function GarageStage() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();

  const deepRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const rakeRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const motesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;

    const motes: { el: HTMLDivElement; x: number; y: number; z: number; ph: number; sp: number; base: number }[] = [];
    const moteHost = motesRef.current;
    if (moteHost) {
      for (let i = 0; i < 26; i++) {
        const el = document.createElement('div');
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const base = 0.6 + Math.random() * 1.6;
        el.style.cssText =
          'position:absolute;width:2px;height:2px;border-radius:50%;background:rgba(201,198,189,.5);will-change:transform,opacity;';
        el.style.left = x + '%';
        el.style.top = y + '%';
        moteHost.appendChild(el);
        motes.push({
          el,
          x,
          y,
          z: 0.2 + Math.random() * 1,
          ph: Math.random() * Math.PI * 2,
          sp: 0.3 + Math.random() * 0.7,
          base,
        });
      }
    }

    let raf = 0;
    let t = 0;

    const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
    const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

    let cur = scrollYProgress.get();

    const tick = () => {
      t += 0.016;
      const target = scrollYProgress.get();
      cur = lerp(cur, target, 0.09);
      const p = cur;

      if (deepRef.current) deepRef.current.style.transform = `scale(${1 + p * 0.1})`;

      if (farRef.current) {
        farRef.current.style.transform = `scale(${1 + p * 0.9})`;
        farRef.current.style.opacity = String(0.55 + 0.3 * p);
      }

      if (nearRef.current) {
        const nearZ = 1.05 + p * 3.2;
        const nearX = Math.sin(p * Math.PI) * -1.2;
        nearRef.current.style.transform = `scale(${nearZ}) translateX(${nearX}%)`;
        nearRef.current.style.opacity = String(clamp(1.15 - p * 0.95, 0, 1));
      }

      if (floorRef.current) {
        floorRef.current.style.transform = `scale(${1 + p * 2}) translateY(${p * 8}%)`;
      }

      // raking light sweeps once across the frame
      if (rakeRef.current) {
        const rakeProg = clamp((p - 0.08) / 0.5, 0, 1);
        rakeRef.current.style.transform = `translateX(${-45 + rakeProg * 130}vw)`;
        rakeRef.current.style.opacity = String(0.5 + Math.sin(p * Math.PI) * 0.4);
      }

      // low gulf glow brightens toward the marketplace/sponsor crescendo, breathing
      if (glowRef.current) {
        const breathe = 0.5 + 0.5 * Math.sin(t * 0.6);
        const rise = clamp((p - 0.55) / 0.45, 0, 1);
        glowRef.current.style.opacity = String(0.16 + rise * 0.34 + breathe * 0.06);
        glowRef.current.style.transform = `translateX(-50%) scale(${0.9 + rise * 0.35})`;
      }

      for (let k = 0; k < motes.length; k++) {
        const mo = motes[k];
        const drift = Math.sin(t * mo.sp + mo.ph);
        const depthMove = p * 40 * mo.z;
        const yy = (((mo.y - depthMove) % 120) + 120) % 120;
        const sc = mo.base * (0.6 + mo.z * 0.6);
        mo.el.style.transform = `translate(${drift * 8}px, ${-mo.y + yy}vh) scale(${sc})`;
        mo.el.style.opacity = String((0.12 + 0.4 * mo.z) * (0.4 + 0.6 * Math.abs(drift)));
      }

      if (grainRef.current) {
        grainRef.current.style.transform = `translate(${Math.sin(t * 1.3) * 2}px, ${Math.cos(t * 1.1) * 2}px)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      motes.forEach((m) => m.el.remove());
    };
  }, [reduce, scrollYProgress]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-canvas"
      style={{ perspective: '1100px' }}
    >
      {/* deep base — warm-black with the faintest center lift */}
      <div
        ref={deepRef}
        className="absolute inset-0 will-change-transform"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 42%, #161618 0%, #0B0B0C 70%)',
        }}
      />

      {/* far pillars (recede slowly) */}
      <div ref={farRef} className="absolute inset-0 will-change-transform">
        <span
          className="absolute -top-[10%] -bottom-[10%] w-[8vw] border-x border-line"
          style={{ left: '21vw', background: 'linear-gradient(90deg,#1F1F23,#0e0e10 60%,#0a0a0b)', filter: 'brightness(.7)' }}
        />
        <span
          className="absolute -top-[10%] -bottom-[10%] w-[8vw] border-x border-line"
          style={{ right: '21vw', background: 'linear-gradient(270deg,#1F1F23,#0e0e10 60%,#0a0a0b)', filter: 'brightness(.7)' }}
        />
        <span
          className="absolute -top-[6%] left-1/2 h-[60vh] w-[46vw] -translate-x-1/2"
          style={{
            background: 'radial-gradient(50% 60% at 50% 0%, rgba(201,198,189,.10), transparent 72%)',
            WebkitMaskImage: 'linear-gradient(180deg,#000,transparent)',
            maskImage: 'linear-gradient(180deg,#000,transparent)',
            opacity: 0.5,
          }}
        />
      </div>

      {/* near pillars (rush past) */}
      <div ref={nearRef} className="absolute inset-0 will-change-transform">
        <span
          className="absolute -top-[10%] -bottom-[10%] left-[6vw] w-[13vw] border-x border-line"
          style={{ background: 'linear-gradient(90deg,#1F1F23,#0e0e10 60%,#0a0a0b)', boxShadow: 'inset 0 0 0 1px #28282C, 0 0 80px rgba(0,0,0,.7)' }}
        />
        <span
          className="absolute -top-[10%] -bottom-[10%] right-[6vw] w-[13vw] border-x border-line"
          style={{ background: 'linear-gradient(270deg,#1F1F23,#0e0e10 60%,#0a0a0b)', boxShadow: 'inset 0 0 0 1px #28282C, 0 0 80px rgba(0,0,0,.7)' }}
        />
      </div>

      {/* raking light bar */}
      <div
        ref={rakeRef}
        className="absolute inset-y-0 left-0 w-[40vw] will-change-transform"
        style={{
          background:
            'linear-gradient(105deg, transparent 0%, rgba(243,241,236,.04) 38%, rgba(243,241,236,.12) 50%, rgba(243,241,236,.04) 62%, transparent 100%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* receding floor */}
      <div ref={floorRef} className="absolute inset-0 will-change-transform">
        <span
          className="absolute -left-[30%] -right-[30%] bottom-[-12%] h-[78%]"
          style={{
            transformOrigin: '50% 100%',
            background:
              'linear-gradient(180deg, rgba(11,11,12,0) 0%, rgba(11,11,12,.55) 55%, #0B0B0C 100%), repeating-linear-gradient(90deg, rgba(58,58,64,.10) 0 1px, transparent 1px 120px)',
            WebkitMaskImage: 'radial-gradient(120% 90% at 50% 0%, #000 35%, transparent 78%)',
            maskImage: 'radial-gradient(120% 90% at 50% 0%, #000 35%, transparent 78%)',
          }}
        />
      </div>

      {/* low gulf glow — the one accent, breathing near the floor */}
      <div
        ref={glowRef}
        className="absolute bottom-[5%] left-1/2 h-[34vh] w-[62vw] -translate-x-1/2 will-change-transform"
        style={{
          background: 'radial-gradient(60% 100% at 50% 100%, rgba(108,189,230,.16), transparent 70%)',
        }}
      />

      {/* dust motes */}
      <div ref={motesRef} className="absolute inset-0" />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 100% at 50% 42%, transparent 48%, rgba(0,0,0,.72))' }}
      />

      {/* 5% grain */}
      <div ref={grainRef} className="bg-grain absolute -inset-1/2 opacity-[0.05]" style={{ mixBlendMode: 'overlay' }} />
    </div>
  );
}
