'use client';

import { useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
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
const MEDIA = process.env.NEXT_PUBLIC_MEDIA_BASE ?? '/videos/experience';

export default function RoadbookStage({ children }: RoadbookStageProps) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // WAAPI escape hatch (owner bug 2026-07-06, browser-measured): framer
  // compiles linear scroll→style chains to native ScrollTimeline animations,
  // and on this STICKY stage the compiled timeline's computed opacity was
  // non-monotonic garbage (intro fade read 0.03 → 0.10 → 0.39 going DOWN the
  // track — a one-way fade can't rise), which is exactly the ghost-text
  // overlay in the owner's screenshot. Mirroring progress through an
  // imperatively-set MotionValue breaks the scroll attachment, so every
  // downstream transform (drive, intro, finale, beats, roadbook, odometer)
  // stays JS-driven and deterministic.
  const p = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => p.set(v));
  useEffect(() => {
    p.set(scrollYProgress.get()); // restored-scroll sync before first change event
  }, [p, scrollYProgress]);

  // Active drive window sits inside the track so intro/finale get breathing room.
  const drive = useTransform(p, [0.08, 0.92], [0, 1], {
    clamp: true,
  });

  // Vertical settle only — the windshield is REAL rolling footage now (owner
  // 2026-07-06: the R8 still didn't belong on the S8's tour page, and a
  // scroll-dollied photo can't compete with the car actually moving). The
  // push-forward scale and the R8→S8 photo dissolve retired with the stills.
  const pan = useTransform(drive, [0, 1], ['0%', '-5%']);

  // Finale settles at the end. Derived from the JS-mirrored `p`, never raw
  // scrollYProgress (see the WAAPI note above). The stage's duplicate intro
  // overlay was CUT 2026-07-07 (owner): the server hero directly above already
  // carries the identical headline, so the stage opens straight onto the
  // drive — odometer, roadbook, and Denver's beat.
  const finaleOpacity = useTransform(p, [0.9, 0.98], [0, 1]);
  const finaleY = useTransform(p, [0.9, 0.98], ['4%', '0%']);

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
        className="relative hidden h-[1300vh] md:block"
      >
        <div className="sticky top-0 h-screen overflow-hidden bg-canvas">
          {/* Windshield — the S8 running the canyon (the mountain roller,
              26–62s of the 4K master, dusk-noir graded at encode). A long
              take, muted loop; the seam is a hard cut 36s apart, which a
              page background wears fine. Poster-first for LCP; the stage is
              md+ only, so phones never fetch it. */}
          <motion.div
            style={{ y: pan }}
            className="absolute inset-x-[-6%] bottom-[-4%] top-0 will-change-transform"
          >
            <video
              className="absolute inset-0 h-full w-full scale-[1.06] object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/experience/poster/tour-road.jpg"
            >
              <source src={`${MEDIA}/tour-road.720.mp4`} media="(max-width: 1279px)" type="video/mp4" />
              <source src={`${MEDIA}/tour-road.mp4`} type="video/mp4" />
            </video>
          </motion.div>

          {/* Cinematic scrims — top + bottom legibility, never glow. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-canvas/90" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-canvas/70 via-canvas/10 to-transparent" />
          <div className="bg-grain pointer-events-none absolute inset-0 opacity-40" />

          {/* Left roadbook rail */}
          <div className="pointer-events-none absolute bottom-0 left-4 top-0 z-20 hidden lg:block">
            <Roadbook progress={drive} />
          </div>

          {/* Odometer HUD — top offset clears the fixed site header (owner
              bug 2026-07-07: top-6 tucked the mileage under the nav bar). */}
          <div className="absolute left-6 top-20 z-30 md:left-10 md:top-24 lg:left-[150px]">
            <Odometer progress={drive} />
          </div>

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
              5,000 miles. Ten cities. One blank canvas.
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
