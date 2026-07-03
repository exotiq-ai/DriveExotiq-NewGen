'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface CloseSceneProps {
  children: React.ReactNode;
}

/**
 * CloseScene — H6. The garage door opens: the closing copy + CTAs resolve into
 * focus on arrival over the breathing Gulf glow. Content (children) is
 * server-rendered for crawlability; this island only carries the settle.
 */
export default function CloseScene({ children }: CloseSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.45, once: true });
  const resolved = reduce || inView;

  return (
    <div
      ref={ref}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden"
    >
      {/* a wider gulf wash for the open door — the one accent, breathing */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-[46vh] w-[78vw] -translate-x-1/2"
        style={{ background: 'radial-gradient(60% 100% at 50% 100%, rgba(108,189,230,.2), transparent 70%)' }}
      />

      <div className="relative z-[2] mx-auto w-full max-w-content px-6 text-center md:px-8">
        <motion.div
          initial={false}
          animate={
            reduce
              ? undefined
              : { opacity: resolved ? 1 : 0, y: resolved ? 0 : 24 }
          }
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
