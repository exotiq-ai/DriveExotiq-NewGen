'use client';

// SB-07b — silence with a pulse. The conversion beat stays deterministic and
// calm: the overhead lamp's pool breathes at the tempo of slow breathing and
// two or three barely-visible dust motes sink through the cone. Zero media
// bytes; transform/opacity only (GPU-composited); gated on reduced motion.

import { motion, useReducedMotion } from 'framer-motion';

const MOTES = [
  { left: '69%', delay: 0, duration: 14 },
  { left: '73.5%', delay: 4.5, duration: 17 },
  { left: '71%', delay: 9, duration: 21 },
];

export default function LampBreath() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* the lamp pool, breathing ±: 9s per breath */}
      <motion.div
        className="absolute"
        style={{
          left: '49%',
          top: '2%',
          width: '46vw',
          height: '52vh',
          background: 'radial-gradient(closest-side, rgba(255,196,120,0.16), transparent 70%)',
          mixBlendMode: 'screen',
        }}
        animate={{ opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 9, ease: 'easeInOut', repeat: Infinity }}
      />
      {/* dust motes sinking through the cone */}
      {MOTES.map((m, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: m.left,
            top: '14%',
            width: 2,
            height: 2,
            background: 'rgba(255,220,180,0.5)',
            filter: 'blur(1px)',
          }}
          animate={{ y: [-10, 44], opacity: [0, 0.6, 0] }}
          transition={{ duration: m.duration, delay: m.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}
