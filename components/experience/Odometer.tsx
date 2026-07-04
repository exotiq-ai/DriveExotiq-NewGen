'use client';

// SB-17 — the numerals earn their weight: the mileage ticks up from 0 like an
// odometer being trusted, tabular and quiet, once, when the copy resolves.
// Reduced motion renders the final value immediately.

import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

export default function Odometer({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!inView) return;
    if (reduce) { node.textContent = to.toLocaleString('en-US'); return; }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { node.textContent = Math.round(v).toLocaleString('en-US'); },
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {reduce ? to.toLocaleString('en-US') : '0'}
    </span>
  );
}
