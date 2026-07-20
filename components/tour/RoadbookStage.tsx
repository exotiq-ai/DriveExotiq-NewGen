'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { BEATS, TOUR_FINALE } from './data';
import Roadbook from './Roadbook';
import Odometer from './Odometer';
import CityBeat from './CityBeat';
import MobileWindshield from './MobileWindshield';

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

  // Safari autoplay fix (design push F3). React SSR never serializes the
  // `muted` attribute into markup (React #10389), so Safari parses an UNMUTED
  // autoplay video and blocks it — and nothing here retried after hydration.
  // Same pattern as the film's LivingLayer: set muted imperatively, then
  // play().catch on mount, on stage entry (IntersectionObserver), and on the
  // first scroll/pointer as gesture-adjacent retries. On final rejection (Low
  // Power Mode) the poster holds — still-first — and a tap-to-play affordance
  // surfaces OUTSIDE the aria-hidden stage tree below.
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // The stage is md+ only (display:none below): never nudge a hidden video
    // into fetching on phones — preload="metadata" stays the mobile ceiling.
    if (!window.matchMedia('(min-width: 768px)').matches) return;
    v.defaultMuted = true;
    v.muted = true;

    const attempt = (final = false) => {
      if (!v.paused) return;
      v.play().catch(() => {
        if (final) setNeedsTap(true); // still-first: poster stays underneath
      });
    };
    attempt();

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) attempt();
      },
      { rootMargin: '25% 0px' }
    );
    io.observe(v);

    const gesture = () => attempt(true);
    window.addEventListener('scroll', gesture, { once: true, passive: true });
    window.addEventListener('pointerdown', gesture, { once: true });

    const onPlaying = () => setNeedsTap(false);
    v.addEventListener('playing', onPlaying);

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', gesture);
      window.removeEventListener('pointerdown', gesture);
      v.removeEventListener('playing', onPlaying);
    };
  }, [reduce]);

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
              md+ only, so phones never fetch it.
              Off-center (F4): the asymmetric overscan puts the wrapper's
              center at ~70vw — the visual center rides ~20% of the viewport
              right of middle, so beat text owns the dark left ground.
              objectPosition can't deliver this (it only redistributes the
              ~12% cover overflow); framer owns the wrapper's inline
              transform, so the shift lives in the insets, not a translate. */}
          <motion.div
            style={{ y: pan }}
            className="absolute bottom-[-4%] left-0 right-[-40%] top-0 will-change-transform"
          >
            <video
              ref={videoRef}
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

          {/* Cinematic scrims — top + bottom legibility, never glow. The left
              curve is the explicit canvas ramp (F4): #0B0B0C ground under the
              max-w-[34rem] beat text, decaying to transparent by 65vw. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-canvas/90" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(to right, #0B0B0C 0%, rgba(11,11,12,0.82) 22%, rgba(11,11,12,0.35) 45%, transparent 65%)' }}
          />
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

          {/* Finale — settles in at the end of the drive. Strings come from
              TOUR_FINALE (data.ts), the same source the server finale renders
              — the copy can never drift between the two again (F2). */}
          <motion.div
            style={{ opacity: finaleOpacity, y: finaleY }}
            className="absolute inset-x-0 top-1/2 z-30 mx-auto max-w-content -translate-y-1/2 px-6 text-center md:px-10"
          >
            <p className="font-serif text-[clamp(1rem,1.6vw,1.2rem)] italic text-gulf">
              {TOUR_FINALE.jewel}
            </p>
            <p className="mx-auto mt-5 max-w-[18ch] font-display text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[0.94] tracking-tightest text-ink">
              {TOUR_FINALE.headline}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tap-to-play (F3) — surfaces only after a gesture-adjacent play()
          retry is refused (Low Power Mode). Lives OUTSIDE the aria-hidden
          stage tree so assistive tech can reach it; bottom-left, clear of the
          sponsor pill's corner. md+ only, like the stage it revives. */}
      {needsTap && (
        <button
          type="button"
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            v.muted = true;
            v.play().catch(() => { /* still-first: the poster holds */ });
          }}
          className="fixed bottom-5 left-5 z-30 hidden min-h-[44px] items-center gap-2.5 rounded-sm border border-line-2 bg-canvas/80 px-4 py-2.5 text-[13px] text-ink backdrop-blur-sm transition-colors duration-250 ease-de hover:border-ink-3 md:inline-flex lg:bottom-8 lg:left-8"
        >
          <svg aria-hidden="true" viewBox="0 0 10 12" className="h-3 w-2.5 fill-current">
            <path d="M0 0l10 6-10 6z" />
          </svg>
          Play the drive
        </button>
      )}

      {/* Crawlable static content. Hidden on desktop (the stage carries the
          visual), shown as a vertical timeline on mobile + reduced motion.
          The MobileWindshield strip (owner 2026-07-20 PM) gives phones the
          rolling footage the desktop stage owns — video WITHOUT text over it,
          between the hero and the timeline. */}
      <div className="md:hidden">
        <MobileWindshield />
        {children}
      </div>
    </>
  );
}
