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

// Lazy inits (UX-audit perf fix 2026-07-20): effect-time initialization made
// the first client render match the SSR fallback, so hydration mounted the
// DESKTOP <video> sources on phones and swapped after the effect — up to
// ~5 MB fetched and discarded. Lazy init picks the right branch on the very
// first client render (same doctrine as useNoTextBlur in CinematicStage).
function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setMobile(mq.matches);
    const on = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return mobile;
}

/**
 * The 720 ladder's audience (UX-audit perf fix): tablets 768-1023px run the
 * COARSE band path (no scrub) but the old <768px check served them full
 * desktop encodes — the .720 ladder was unreachable exactly where it pays.
 * Matches the coarse side of SCRUB_MQ.
 */
function useCoarseLadder() {
  const [coarse, setCoarse] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px), (pointer: coarse)');
    setCoarse(mq.matches);
    const on = (e: MediaQueryListEvent) => setCoarse(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return coarse;
}

/** Desktop-fine-pointer check for the scrub tier (mobile never scrubs — iOS never prebuffers). */
function useCanScrub() {
  const [ok, setOk] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches,
  );
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

function LoopLayer({ cfg, near, p, focus }: { cfg: Extract<LivingMedia, { kind: 'loop' }>; near: boolean; p: MotionValue<number>; focus?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const mobile = useIsMobile();
  // Portrait-native beats: phones get the recomposed 9:16 encode, not a crop.
  // The .720 ladder serves the whole COARSE path (tablets included) — see
  // useCoarseLadder.
  const coarseLadder = useCoarseLadder();
  const src = mobile && cfg.portraitSrc ? cfg.portraitSrc : coarseLadder && cfg.mobileSrc ? cfg.mobileSrc : cfg.src;
  const poster = mobile && cfg.portraitSrc ? (cfg.portraitPoster ?? cfg.poster) : cfg.poster;

  // loadeddata can fire before React attaches the handler (fast local loads) —
  // poll readiness imperatively as well. Deps include `ready` (reverse-scroll
  // fix): a real playback failure downgrades to the still, but the watch
  // restarts, so the beat can come back — previously one rejection locked the
  // beat onto its still for the rest of the session.
  useEffect(() => {
    const v = ref.current;
    if (!v || ready) return;
    if (v.readyState >= 2) { setReady(true); return; }
    const id = setInterval(() => { if (v.readyState >= 2) { setReady(true); clearInterval(id); } }, 250);
    return () => clearInterval(id);
  }, [src, ready]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (near && ready) {
      v.play().catch((err: unknown) => {
        // A fast reversal interrupts play() with our own pause() — that
        // AbortError is bookkeeping, not failure. Killing `ready` on it is
        // what froze beats on their stills after quick scroll flips.
        if ((err as DOMException)?.name === 'AbortError') return;
        setReady(false);
      });
    } else if (!near) v.pause();
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
        style={focus ? { objectPosition: focus } : undefined}
        src={src}
        poster={poster}
        muted
        playsInline
        loop
        preload={near ? 'auto' : 'metadata'}
        disableRemotePlayback
        onLoadedData={() => setReady(true)}
        onError={() => setReady(false)}
      />
    </Fade>
  );
}

function PlayOnceLayer({ cfg, near, p, focus }: { cfg: Extract<LivingMedia, { kind: 'play-once' }>; near: boolean; p: MotionValue<number>; focus?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const played = useRef(false);
  const mobile = useIsMobile();
  // Portrait-native beats: phones get the recomposed 9:16 encode, not a crop.
  // The .720 ladder serves the whole COARSE path (tablets included) — see
  // useCoarseLadder.
  const coarseLadder = useCoarseLadder();
  const src = mobile && cfg.portraitSrc ? cfg.portraitSrc : coarseLadder && cfg.mobileSrc ? cfg.mobileSrc : cfg.src;
  const poster = mobile && cfg.portraitSrc ? (cfg.portraitPoster ?? cfg.poster) : cfg.poster;

  // Tap-to-unmute contract (cfg.sound beats only): the Copy layer's button
  // dispatches de:sound-toggle; we unmute + replay from the press, report
  // state back on de:sound-state, and ALWAYS re-mute when the beat leaves the
  // working set — sound must never bleed into a neighboring beat.
  const emitSound = (on: boolean) => window.dispatchEvent(new CustomEvent('de:sound-state', { detail: on }));
  useEffect(() => {
    if (!cfg.sound) return;
    const onToggle = () => {
      const v = ref.current;
      if (!v) return;
      if (v.muted) {
        v.muted = false;
        v.currentTime = 0;
        played.current = true;
        v.play().catch(() => { v.muted = true; emitSound(false); });
        emitSound(true);
      } else {
        v.muted = true;
        emitSound(false);
      }
    };
    window.addEventListener('de:sound-toggle', onToggle);
    return () => window.removeEventListener('de:sound-toggle', onToggle);
  }, [cfg.sound]);
  useEffect(() => {
    const v = ref.current;
    if (!cfg.sound || !v || near) return;
    if (!v.muted) { v.muted = true; emitSound(false); }
  }, [near, cfg.sound]);

  useEffect(() => {
    const v = ref.current;
    if (!v || ready) return;
    if (v.readyState >= 2) { setReady(true); return; }
    const id = setInterval(() => { if (v.readyState >= 2) { setReady(true); clearInterval(id); } }, 250);
    return () => clearInterval(id);
  }, [src, ready]);

  // Reverse-scroll integrity (final design push 2026-07-20). The old model —
  // play once past playAt, rewind only below a p<0.02 sliver — had four
  // failure modes at speed: an interrupted play() killed `ready` for the
  // session; a reversal landing in p∈[0.02,0.15] left the ended frame frozen
  // with no way to replay; the rewind fired inside the visible dissolve (a
  // stuck-then-snap artifact); and any upward entry played the clip forward
  // under a backward scroll. New model: rewinds happen only while the layer
  // is out of the working set (near=false ⇒ covered or beyond the adjacent
  // band — not visible); direction decides re-entry state.
  const prevP = useRef(0);
  const armedReplay = useRef(false);
  const wasNear = useRef(false);
  useEffect(() => {
    const vid = ref.current;
    if (!vid) { wasNear.current = near; return; }
    if (!near && wasNear.current) {
      vid.pause();
    } else if (near && !wasNear.current) {
      if (!ready) return; // media not up yet — this effect re-runs on `ready`
      const v = p.get();
      armedReplay.current = false;
      if (v >= (cfg.playAt ?? 0.15)) {
        // Entering from above (reverse scroll) or a mid-band teleport: hold
        // the settled final frame — never play forward under an upward scroll.
        played.current = true;
        if (vid.duration) { try { vid.currentTime = Math.max(0, vid.duration - 0.05); } catch { /* not seekable yet */ } }
      } else {
        // Entering from below: re-arm a fresh play while still invisible.
        played.current = false;
        try { vid.currentTime = 0; } catch { /* not seekable yet */ }
      }
    }
    wasNear.current = near;
  }, [near, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const maybePlay = (v: number) => {
    const vid = ref.current;
    if (!vid) return;
    const down = v >= prevP.current;
    prevP.current = v;
    const playAt = cfg.playAt ?? 0.15;
    if (down && near && v >= playAt && !played.current) {
      played.current = true;
      vid.play().catch((err: unknown) => {
        played.current = false; // allow a retry pass either way
        if ((err as DOMException)?.name === 'AbortError') return; // interrupted, not failed
        setReady(false);
      });
    } else if (down && near && v >= playAt && armedReplay.current) {
      // The owner's "it's not replaying": retreated above the trigger, then
      // came back down. play() on an ended element natively restarts from 0.
      armedReplay.current = false;
      if (vid.ended) vid.play().catch(() => { /* still-first: hold the frame */ });
      else { try { vid.currentTime = 0; } catch { /* not seekable */ } vid.play().catch(() => { /* still-first */ }); }
    } else if (!down && v < playAt && played.current) {
      armedReplay.current = true; // restart waits for the next downward pass
    }
  };
  useMotionValueEvent(p, 'change', maybePlay);
  // A plate can mount already inside its band (mid-page reload, teleport) —
  // no 'change' fires then, so evaluate once media is ready. (The near-entry
  // effect above runs first — component definition order — so an upward or
  // teleport entry has already set played=true and this is a no-op.)
  useEffect(() => { if (ready) maybePlay(p.get()); }, [ready, near]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Fade ready={ready}>
      {/* no `loop`: the clip ends settled and natively holds its final frame */}
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        style={focus ? { objectPosition: focus } : undefined}
        src={src}
        poster={poster}
        muted
        playsInline
        preload={near ? 'auto' : 'metadata'}
        disableRemotePlayback
        onLoadedData={() => setReady(true)}
        onError={() => setReady(false)}
        onEnded={() => {
          const v = ref.current;
          if (cfg.sound && v && !v.muted) { v.muted = true; emitSound(false); }
        }}
      />
    </Fade>
  );
}

function ScrubLayer({ cfg, near, p, focus }: { cfg: Extract<LivingMedia, { kind: 'scrub' }>; near: boolean; p: MotionValue<number>; focus?: string }) {
  const canScrub = useCanScrub();
  const mobile = useIsMobile();
  // TOUCH SCRUB (2026-07-07 mobile pass): when a portrait-native all-intra
  // encode exists, phones get the real finger-synced scrub — the film's
  // signature "scroll owns the mechanism" — instead of the play-once fallback.
  // Portrait-only (<768px): tablets/coarse-wide keep the fallback, and beats
  // without portraitSrc are untouched.
  const touchScrub = !canScrub && mobile && !!cfg.portraitSrc;
  const active = canScrub || touchScrub;
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const target = useRef(0);
  // 0 = gate open; otherwise the performance.now() timestamp the gate closed
  // (a lost 'seeked' used to deadlock the chase forever — see watchdog below).
  const seekGate = useRef(0);
  const primed = useRef(false);
  const lastP = useRef(0);

  const [d0, d1] = cfg.deadZone ?? [0.12, 0.88];

  useEffect(() => {
    const v = ref.current;
    if (!v || !active || ready) return;
    if (v.readyState >= 2) { setReady(true); return; }
    const id = setInterval(() => { if (v.readyState >= 2) { setReady(true); clearInterval(id); } }, 250);
    return () => clearInterval(id);
  }, [active, ready]);

  // iOS decoder primer: Safari may not paint currentTime seeks on a video that
  // has never played — one muted play()/pause() on ready wakes the decoder.
  useEffect(() => {
    const v = ref.current;
    if (!touchScrub || !ready || !v || primed.current) return;
    primed.current = true;
    v.play().then(() => v.pause()).catch(() => { /* still-first: poster stays */ });
  }, [touchScrub, ready]);

  const syncTarget = (v: number) => {
    lastP.current = v;
    const vid = ref.current;
    if (!vid || !vid.duration) return;
    target.current = clamp((v - d0) / (d1 - d0), 0, 1) * (vid.duration - 0.05);
  };
  useMotionValueEvent(p, 'change', syncTarget);
  useEffect(() => { if (ready) syncTarget(p.get()); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  // Per-frame lerp toward target; issue the next seek only after 'seeked' fires
  // (seeking is not frame-accurate — never queue seeks). Touch gets a slightly
  // stiffer chase: momentum scroll moves progress faster than a wheel, and the
  // softer desktop lerp reads as lag under a flick.
  useEffect(() => {
    if (!active) return;
    const chase = touchScrub ? 0.24 : 0.18;
    let raf = 0;
    const tick = () => {
      const vid = ref.current;
      if (vid && vid.duration) {
        // Watchdog (reverse-scroll fix): Safari can drop 'seeked' under rapid
        // currentTime writes on covered/paused elements — a lost event used
        // to freeze the scrub at an arbitrary frame for good. 250ms with no
        // 'seeked' reopens the gate.
        if (seekGate.current && performance.now() - seekGate.current > 250) seekGate.current = 0;
        if (!seekGate.current) {
          const cur = vid.currentTime;
          // Snap-to-final (seam integrity, plan D1): inside either dead zone
          // the target is pinned to an end frame — bypass the lerp there so a
          // fast pass can never carry a mid-clip frame into the dissolve.
          const snap = lastP.current >= d1 || lastP.current <= d0;
          const next = snap ? target.current : cur + (target.current - cur) * chase;
          if (Math.abs(next - cur) > 0.012) {
            seekGate.current = performance.now();
            vid.currentTime = next;
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, touchScrub, ready]);

  if (!active) {
    // Coarse pointer without a portrait encode: the code wipe when defined
    // (SB-19 — zero video bytes by design), otherwise a play-once fallback.
    if (cfg.wipe) return <WipeLayer cfg={{ kind: 'wipe', ...cfg.wipe }} p={p} focus={focus} />;
    return (
      <PlayOnceLayer
        cfg={{ kind: 'play-once', src: cfg.mobileSrc ?? cfg.src, poster: cfg.poster }}
        near={near}
        p={p}
        focus={focus}
      />
    );
  }

  return (
    <>
      {/* instant-render layer beneath the video (still-first, no CLS) */}
      {cfg.wipe && !ready && <WipeLayer cfg={{ kind: 'wipe', ...cfg.wipe }} p={p} focus={focus} />}
      <Fade ready={ready}>
        <video
          key={touchScrub ? 'portrait' : 'landscape'}
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          style={focus ? { objectPosition: focus } : undefined}
          poster={touchScrub ? (cfg.portraitPoster ?? cfg.poster) : cfg.poster}
          muted
          playsInline
          preload={near ? 'auto' : 'metadata'}
          disableRemotePlayback
          onLoadedData={() => setReady(true)}
          onSeeked={() => { seekGate.current = 0; }}
          onStalled={() => { seekGate.current = 0; }}
          onError={() => { seekGate.current = 0; setReady(false); }}
        >
          {touchScrub ? (
            <source src={cfg.portraitSrc} type="video/mp4" />
          ) : (
            <>
              <source src={cfg.src} type="video/mp4" />
              {cfg.webmSrc && <source src={cfg.webmSrc} type="video/webm" />}
            </>
          )}
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
function WipeLayer({ cfg, p, focus }: { cfg: Extract<LivingMedia, { kind: 'wipe' }>; p: MotionValue<number>; focus?: string }) {
  const complete = cfg.completeAt ?? 0.85;
  const reveal = useTransform(p, [0.08, complete], [0, 1]);
  const edge = useTransform(reveal, (r) => r * 140 - 20);
  const edgeSoft = useTransform(reveal, (r) => r * 140 - 5);
  const mask = useMotionTemplate`linear-gradient(105deg, black 0%, black ${edge}%, transparent ${edgeSoft}%)`;
  const lampX = useTransform(reveal, (r) => `${r * 120 - 10}%`);
  const lampOpacity = useTransform(reveal, [0, 0.05, 0.92, 1], [0, 1, 1, 0]);

  return (
    <div className="absolute inset-0">
      <img src={cfg.darkSrc} alt="" className="absolute inset-0 h-full w-full object-cover" style={focus ? { objectPosition: focus } : undefined} />
      <motion.img
        src={cfg.litSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ WebkitMaskImage: mask, maskImage: mask, ...(focus ? { objectPosition: focus } : {}) } as any}
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
  focus,
}: {
  cfg: LivingMedia;
  /** Plate-local progress 0..1 across this plate's band. */
  p: MotionValue<number>;
  /** Within the active±1 window (play); mounted within ±2 (buffer). */
  near: boolean;
  /** object-position matching the plate still (off-center subjects on portrait crops). */
  focus?: string;
}) {
  const saveData = useSaveData();
  // Mount gate (mobile-smoothness pass 2026-07-20): video tiers render NOTHING
  // on the server and the first client render. The SSR frame is the graded
  // still by design (poster-first doctrine), and the src choice diverges by
  // viewport (portrait vs desktop encodes) — SSR'ing one branch made React
  // 418/423 hydration errors on phones, which threw away the entire server
  // document and re-rendered it client-side. One effect-tick of delay is
  // invisible behind the Fade-ready gate; the wipe tier stays SSR'd (its still
  // srcs are identical on every viewport, and SB-19's instant reveal depends
  // on it painting with the server HTML).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (cfg.kind === 'wipe') return <WipeLayer cfg={cfg} p={p} focus={focus} />;
  if (!mounted || saveData) return null;

  switch (cfg.kind) {
    case 'loop': return <LoopLayer cfg={cfg} near={near} p={p} focus={focus} />;
    case 'play-once': return <PlayOnceLayer cfg={cfg} near={near} p={p} focus={focus} />;
    case 'scrub': return <ScrubLayer cfg={cfg} near={near} p={p} focus={focus} />;
  }
}
