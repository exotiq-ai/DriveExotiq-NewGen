'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The windshield on phones (owner 2026-07-20 PM: "can we render video for the
 * tour page on mobile browser?"). The pinned stage stays md+ — this is its
 * mobile counterpart: the same rolling S8 canyon footage as a full-bleed
 * cinematic strip between the hero and the timeline, with NO text over it
 * (the owner's instinct: on phones, video and copy don't fight). Keeps the
 * page's one-moving-picture rule — the hero above is a still.
 *
 * Autoplay doctrine = the F3 fix (React never SSRs `muted`, so Safari blocks
 * the attribute-only path): imperative muted + play().catch on mount, on
 * viewport entry, and on the first gesture; on final refusal (Low Power Mode)
 * the poster holds and a tap-to-play affordance surfaces in the strip.
 */
const MEDIA = process.env.NEXT_PUBLIC_MEDIA_BASE ?? '/videos/experience';

export default function MobileWindshield() {
  const ref = useRef<HTMLVideoElement>(null);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Strip is display:none on md+ (the stage owns that band) — never nudge
    // a hidden video into fetching on desktop.
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    v.defaultMuted = true;
    v.muted = true;

    const attempt = (final = false) => {
      if (!v.paused) return;
      v.play().catch(() => {
        if (final) setNeedsTap(true); // still-first: the poster holds
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
  }, []);

  return (
    <section aria-label="The S8 on the road" className="relative h-[52svh] overflow-hidden bg-canvas md:hidden">
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: '62% 50%' }}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/experience/poster/tour-road.jpg"
      >
        <source src={`${MEDIA}/tour-road.720.mp4`} type="video/mp4" />
      </video>
      {/* Seat the strip into the dark page — canvas ramps top and bottom,
          grain to match the print. No text: the footage carries the beat. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-canvas" />
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-40" />
      {needsTap && (
        <button
          type="button"
          onClick={() => {
            const v = ref.current;
            if (!v) return;
            v.muted = true;
            v.play().catch(() => { /* still-first: the poster holds */ });
          }}
          className="absolute left-1/2 top-1/2 inline-flex min-h-[44px] -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 rounded-sm border border-line-2 bg-canvas/80 px-4 py-2.5 text-[13px] text-ink backdrop-blur-sm"
        >
          <svg aria-hidden="true" viewBox="0 0 10 12" className="h-3 w-2.5 fill-current">
            <path d="M0 0l10 6-10 6z" />
          </svg>
          Play the drive
        </button>
      )}
    </section>
  );
}
