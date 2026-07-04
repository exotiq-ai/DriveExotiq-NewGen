'use client';

// The living layer of a plate — loop / play-once / scrub / wipe tiers per the
// handoff engineering plan (§4.4). Always mounted UNDER the assumption that the
// graded still beneath it is the source of truth: this layer fades in only when
// its media is actually ready, and every failure path (autoplay rejection, slow
// network, missing file) silently leaves the still showing.

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import type { LivingMedia } from './living';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function useSaveData() {
  const [save, setSave] = useState(false);
  useEffect(() => {
    const c = (navigator as any).connection;
    if (c?.saveData) setSave(true);
  }, []);
  return save;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setMobile(mq.matches);
    const on = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return mobile;
}

/** Desktop-fine-pointer check for the scrub tier (mobile never scrubs — iOS never prebuffers). */
function useCanScrub() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches);
  }, []);
  return ok;
}

/** Fade wrapper: living media becomes visible only once ready. */
function Fade({ ready, children }: { ready: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function LoopLayer({ cfg, near, p }: { cfg: Extract<LivingMedia, { kind: 'loop' }>; near: boolean; p: MotionValue<number> }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const mobile = useIsMobile();
  const src = mobile && cfg.mobileSrc ? cfg.mobileSrc : cfg.src;

  // loadeddata can fire before React attaches the handler (fast local loads) —
  // poll readiness imperatively as well.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (v.readyState >= 2) { setReady(true); return; }
    const id = setInterval(() => { if (v.readyState >= 2) { setReady(true); clearInterval(id); } }, 250);
    return () => clearInterval(id);
  }, [src]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (near && ready) v.play().catch(() => setReady(false));
    else if (!near) v.pause();
  }, [near, src, ready]);

  useEffect(() => {
    const v = ref.current;
    if (v && cfg.playbackRate) v.playbackRate = cfg.playbackRate;
  }, [cfg.playbackRate, ready]);

  // SB-16 coast-down: playbackRate eases toward minRate across [start,end].
  useMotionValueEvent(p, 'change', (v) => {
    const vid = ref.current;
    if (!vid || !cfg.coastDown) return;
    const [a, b, min] = cfg.coastDown;
    const t = clamp((v - a) / (b - a), 0, 1);
    vid.playbackRate = 1 - t * (1 - Math.max(min, 0.5)); // 0.5 = Safari's reliable floor
  });

  return (
    <Fade ready={ready}>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={cfg.poster}
        muted
        playsInline
        loop
        preload="auto"
        disableRemotePlayback
        onLoadedData={() => setReady(true)}
        onError={() => setReady(false)}
      />
    </Fade>
  );
}

function PlayOnceLayer({ cfg, near, p }: { cfg: Extract<LivingMedia, { kind: 'play-once' }>; near: boolean; p: MotionValue<number> }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const played = useRef(false);
  const mobile = useIsMobile();
  const src = mobile && cfg.mobileSrc ? cfg.mobileSrc : cfg.src;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (v.readyState >= 2) { setReady(true); return; }
    const id = setInterval(() => { if (v.readyState >= 2) { setReady(true); clearInterval(id); } }, 250);
    return () => clearInterval(id);
  }, [src]);

  const maybePlay = (v: number) => {
    const vid = ref.current;
    if (!vid) return;
    if (v >= (cfg.playAt ?? 0.15) && near && !played.current) {
      played.current = true;
      vid.play().catch(() => { played.current = false; setReady(false); });
    } else if (v < (cfg.resetBelow ?? 0.02) && played.current) {
      played.current = false;
      vid.pause();
      try { vid.currentTime = 0; } catch { /* not seekable yet */ }
    }
  };
  useMotionValueEvent(p, 'change', maybePlay);
  // A plate can mount already inside its band (mid-page reload, teleport) —
  // no 'change' fires then, so evaluate once media is ready.
  useEffect(() => { if (ready) maybePlay(p.get()); }, [ready, near]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Fade ready={ready}>
      {/* no `loop`: the clip ends settled and natively holds its final frame */}
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={cfg.poster}
        muted
        playsInline
        preload="auto"
        disableRemotePlayback
        onLoadedData={() => setReady(true)}
        onError={() => setReady(false)}
      />
    </Fade>
  );
}

function ScrubLayer({ cfg, near, p }: { cfg: Extract<LivingMedia, { kind: 'scrub' }>; near: boolean; p: MotionValue<number> }) {
  const canScrub = useCanScrub();
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const target = useRef(0);
  const seekGate = useRef(false);

  const [d0, d1] = cfg.deadZone ?? [0.12, 0.88];

  useEffect(() => {
    const v = ref.current;
    if (!v || !canScrub) return;
    if (v.readyState >= 2) { setReady(true); return; }
    const id = setInterval(() => { if (v.readyState >= 2) { setReady(true); clearInterval(id); } }, 250);
    return () => clearInterval(id);
  }, [canScrub]);

  const syncTarget = (v: number) => {
    const vid = ref.current;
    if (!vid || !vid.duration) return;
    target.current = clamp((v - d0) / (d1 - d0), 0, 1) * (vid.duration - 0.05);
  };
  useMotionValueEvent(p, 'change', syncTarget);
  useEffect(() => { if (ready) syncTarget(p.get()); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  // Per-frame lerp toward target; issue the next seek only after 'seeked' fires
  // (seeking is not frame-accurate — never queue seeks).
  useEffect(() => {
    if (!canScrub) return;
    let raf = 0;
    const tick = () => {
      const vid = ref.current;
      if (vid && vid.duration && !seekGate.current) {
        const cur = vid.currentTime;
        const next = cur + (target.current - cur) * 0.18;
        if (Math.abs(next - cur) > 0.012) {
          seekGate.current = true;
          vid.currentTime = next;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [canScrub, ready]);

  if (!canScrub) {
    // Mobile / coarse pointer: the code wipe when defined (SB-19 — zero video
    // bytes by design), otherwise a play-once of the normal encode.
    if (cfg.wipe) return <WipeLayer cfg={{ kind: 'wipe', ...cfg.wipe }} p={p} />;
    return (
      <PlayOnceLayer
        cfg={{ kind: 'play-once', src: cfg.mobileSrc ?? cfg.src, poster: cfg.poster }}
        near={near}
        p={p}
      />
    );
  }

  return (
    <>
      {/* instant-render layer beneath the video (still-first, no CLS) */}
      {cfg.wipe && !ready && <WipeLayer cfg={{ kind: 'wipe', ...cfg.wipe }} p={p} />}
      <Fade ready={ready}>
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          poster={cfg.poster}
          muted
          playsInline
          preload="auto"
          disableRemotePlayback
          onLoadedData={() => setReady(true)}
          onSeeked={() => { seekGate.current = false; }}
          onError={() => setReady(false)}
        >
          <source src={cfg.src} type="video/mp4" />
          {cfg.webmSrc && <source src={cfg.webmSrc} type="video/webm" />}
        </video>
      </Fade>
    </>
  );
}

/**
 * SB-19 code light-wipe — the instant-render reveal (and the universal mobile
 * path): the lit still, masked by a feathered leading edge driven by plate
 * progress, sweeps nose-to-tail over the dark still. Zero video bytes.
 */
function WipeLayer({ cfg, p }: { cfg: Extract<LivingMedia, { kind: 'wipe' }>; p: MotionValue<number> }) {
  const complete = cfg.completeAt ?? 0.85;
  const reveal = useTransform(p, [0.08, complete], [0, 1]);
  const edge = useTransform(reveal, (r) => r * 140 - 20);
  const edgeSoft = useTransform(reveal, (r) => r * 140 - 5);
  const mask = useMotionTemplate`linear-gradient(105deg, black 0%, black ${edge}%, transparent ${edgeSoft}%)`;
  const lampX = useTransform(reveal, (r) => `${r * 120 - 10}%`);
  const lampOpacity = useTransform(reveal, [0, 0.05, 0.92, 1], [0, 1, 1, 0]);

  return (
    <div className="absolute inset-0">
      <img src={cfg.darkSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <motion.img
        src={cfg.litSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ WebkitMaskImage: mask, maskImage: mask } as any}
      />
      {/* the traveling "lamp": a warm glow bar tracking the mask edge */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-[12%]"
        style={{
          left: lampX,
          opacity: lampOpacity,
          background: 'radial-gradient(closest-side, rgba(255,196,120,0.15), transparent 72%)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}

export default function LivingLayer({
  cfg,
  p,
  near,
}: {
  cfg: LivingMedia;
  /** Plate-local progress 0..1 across this plate's band. */
  p: MotionValue<number>;
  /** Within the active±1 window (play); mounted within ±2 (buffer). */
  near: boolean;
}) {
  const saveData = useSaveData();
  if (saveData && cfg.kind !== 'wipe') return null; // wipe is still-only, always allowed

  switch (cfg.kind) {
    case 'loop': return <LoopLayer cfg={cfg} near={near} p={p} />;
    case 'play-once': return <PlayOnceLayer cfg={cfg} near={near} p={p} />;
    case 'scrub': return <ScrubLayer cfg={cfg} near={near} p={p} />;
    case 'wipe': return <WipeLayer cfg={cfg} p={p} />;
  }
}
