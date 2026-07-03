'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface ArrivalSceneProps {
  children: React.ReactNode;
}

/**
 * ArrivalScene — H0 cold-open. The R8 at first light resolves into focus and
 * drifts as you enter the garage; the server-rendered hero copy (children) sits
 * over it and lifts away on scroll. Decorative imagery is aria-hidden; the real
 * <h1>/copy/link come from the parent server component.
 *
 * Reduced motion: image holds at a clean exposure, copy stays put — no drift.
 */
export default function ArrivalScene({ children }: ArrivalSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.16]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.7, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55, 0.85], [1, 1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const motionImg = reduce ? {} : { scale: imgScale, y: imgY, opacity: imgOpacity };
  const motionCopy = reduce ? {} : { y: copyY, opacity: copyOpacity };

  return (
    <div ref={ref} className="relative min-h-[100svh] w-full">
      {/* sticky cinematic frame */}
      <div className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden">
        {/* R8 dawn plate — decorative, resolves into focus */}
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[78vh] w-[118vw] -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={motionImg}
          initial={reduce ? false : { opacity: 0, scale: 1.12 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1.06 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/images/cars/R8-telluride.jpg"
            alt=""
            fill
            priority
            sizes="118vw"
            className="object-cover object-[center_42%]"
            style={{ filter: 'brightness(.6) contrast(1.06) saturate(.86)' }}
          />
          {/* letterbox so the car sits, never floats; never glows */}
          <span
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(11,11,12,.85) 0%, rgba(11,11,12,0) 24%, rgba(11,11,12,0) 56%, rgba(11,11,12,.94) 100%)',
            }}
          />
          <span
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(120% 100% at 50% 46%, transparent 50%, rgba(11,11,12,.7))',
            }}
          />
        </motion.div>

        {/* hero copy (server-rendered children) */}
        <motion.div
          className="relative z-[2] mx-auto w-full max-w-content px-6 md:px-8"
          style={motionCopy}
        >
          {children}
        </motion.div>

        {/* down-arrow cue */}
        <motion.div
          aria-hidden="true"
          className="absolute bottom-7 left-1/2 -translate-x-1/2"
          style={reduce ? undefined : { opacity: cueOpacity }}
        >
          <span className="block h-9 w-px overflow-hidden bg-gradient-to-b from-ink-3 to-transparent">
            <span className="de-cue block h-3 w-px bg-gulf" />
          </span>
        </motion.div>
      </div>

      <style jsx>{`
        .de-cue {
          animation: deDrop 2.2s infinite cubic-bezier(0.7, 0, 0.3, 1);
        }
        @keyframes deDrop {
          0% {
            transform: translateY(-12px);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translateY(34px);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .de-cue {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
