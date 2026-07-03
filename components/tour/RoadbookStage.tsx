'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { BEATS } from './data';
import Roadbook from './Roadbook';
import Odometer from './Odometer';
import CityBeat from './CityBeat';

interface RoadbookStageProps {
  /**
   * The crawlable, server-rendered tour content (intro + ten <section>s +
   * finale). Rendered as-is for reduced-motion / mobile; visually replaced by
   * the pinned cinematic stage otherwise.
   */
  children: React.ReactNode;
}

/**
 * THE JOURNEY stage. A tall scroll track pins a "windshield": the road image
 * pushes forward and cross-dissolves R8(dawn)→S8(dusk) at ~two-thirds, while
 * the left roadbook draws, the odometer counts, and ten city beats travel past.
 *
 * On reduced-motion or small screens we skip the stage entirely and render the
 * server children as a quiet vertical timeline — no scroll-jacking, full copy.
 */
export default function RoadbookStage({ children }: RoadbookStageProps) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // Active drive window sits inside the track so intro/finale get breathing room.
  const drive = useTransform(scrollYProgress, [0.08, 0.92], [0, 1], {
    clamp: true,
  });

  // Windshield push-forward (subtle dolly) + vertical settle.
  const pushScale = useTransform(drive, [0, 1], [1.06, 1.22]);
  const pan = useTransform(drive, [0, 1], ['0%', '-5%']);

  // Cross-dissolve R8(dawn) → S8(dusk) at ~two-thirds of the drive.
  const r8Opacity = useTransform(drive, [0.55, 0.78], [1, 0]);
  const s8Opacity = useTransform(drive, [0.55, 0.78], [0, 1]);

  // Intro headline clears as the drive starts; finale settles at the end.
  const introOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.08], ['0%', '-6%']);
  const finaleOpacity = useTransform(scrollYProgress, [0.9, 0.98], [0, 1]);
  const finaleY = useTransform(scrollYProgress, [0.9, 0.98], ['4%', '0%']);

  // ---- Reduced-motion / no-JS-fallback path: just the server content. ----
  if (reduce) {
    return <>{children}</>;
  }

  return (
    <>
      {/* The cinematic stage. aria-hidden: the readable copy is the static
          timeline below, kept in the DOM for crawlers + reduced motion. */}
      <div
        ref={trackRef}
        aria-hidden="true"
        className="relative hidden h-[1100vh] md:block"
      >
        <div className="sticky top-0 h-screen overflow-hidden bg-canvas">
          {/* Windshield — the road ahead */}
          <motion.div
            style={{ y: pan }}
            className="absolute inset-x-[-6%] bottom-[-4%] top-0 will-change-transform"
          >
            <motion.div
              style={{ scale: pushScale, opacity: r8Opacity }}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src="/images/cars/R8-telluride.jpg"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-[center_38%]"
              />
            </motion.div>
            <motion.div
              style={{ scale: pushScale, opacity: s8Opacity }}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src="/images/cars/Audi_S8_tortillaflats_adamkiss.jpg"
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-[center_42%]"
              />
            </motion.div>
          </motion.div>

          {/* Cinematic scrims — top + bottom legibility, never glow. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-canvas/90" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-canvas/70 via-canvas/10 to-transparent" />
          <div className="bg-grain pointer-events-none absolute inset-0 opacity-40" />

          {/* Left roadbook rail */}
          <div className="pointer-events-none absolute bottom-0 left-4 top-0 z-20 hidden lg:block">
            <Roadbook progress={drive} />
          </div>

          {/* Odometer HUD */}
          <div className="absolute left-6 top-6 z-30 md:left-10 lg:left-[150px]">
            <Odometer progress={drive} />
          </div>

          {/* Intro headline — clears as the drive begins. */}
          <motion.div
            style={{ opacity: introOpacity, y: introY }}
            className="absolute inset-x-0 top-1/2 z-20 mx-auto max-w-content -translate-y-1/2 px-6 md:px-10"
          >
            <p className="font-serif text-[clamp(1rem,1.6vw,1.2rem)] italic text-gulf">
              a long way south, the long way.
            </p>
            <p className="mt-5 max-w-[32ch] font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold leading-[0.96] tracking-tightest text-ink">
              Before first light, in Denver, the engine is already warm.
            </p>
          </motion.div>

          {/* City beats travelling past the car. */}
          <div className="absolute inset-x-0 top-0 z-20 mx-auto h-full max-w-content px-6 md:px-10 lg:pl-[200px]">
            <div className="relative h-full">
              {BEATS.map((beat, i) => (
                <CityBeat
                  key={beat.id}
                  beat={beat}
                  index={i}
                  total={BEATS.length}
                  progress={drive}
                />
              ))}
            </div>
          </div>

          {/* Finale — settles in at the end of the drive. */}
          <motion.div
            style={{ opacity: finaleOpacity, y: finaleY }}
            className="absolute inset-x-0 top-1/2 z-30 mx-auto max-w-content -translate-y-1/2 px-6 text-center md:px-10"
          >
            <p className="font-serif text-[clamp(1rem,1.6vw,1.2rem)] italic text-gulf">
              the end of the line, under a falling sun.
            </p>
            <p className="mx-auto mt-5 max-w-[18ch] font-display text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[0.94] tracking-tightest text-ink">
              Ten cities. Thousands of miles. One blank canvas.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Crawlable static content. Hidden on desktop (the stage carries the
          visual), shown as a vertical timeline on mobile + reduced motion. */}
      <div className="md:hidden">{children}</div>
    </>
  );
}
