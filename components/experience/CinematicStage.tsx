'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { FRAMES, type Frame } from './frames';
import { LIVING, OVERLAYS, EXITS, FADES, GRADE } from './living';
import { PLACEHOLDERS } from './placeholders';
import { FINE_BANDS, COARSE_BANDS, useBands, bandAt, type Bands } from './bands';
import LivingLayer from './LivingLayer';
import GaugeSweep from './GaugeSweep';
import LampBreath from './LampBreath';
import Odometer from './Odometer';

const N = FRAMES.length;
// Copy block k is viewport-centered at the band positions in bands.ts — media
// bands must use the same cumulative-weight math or the two drift apart down
// the page (weighted scrub pacing; all-weights-1 reduces to the old k/(N-1)).

/**
 * The copy for one beat — resolves into focus (lift + de-blur) when centered.
 * The de-blur is desktop-only: animating filter on text forces per-frame
 * re-rasterization during iOS momentum scroll (review finding), so coarse
 * pointers get the same lift with opacity only.
 */
function useNoTextBlur() {
  // Lazy init: the FIRST render must already know (mobile pass finding: with
  // a false initial, the entrance variant applies blur(6px) before the effect
  // flips the flag, and framer keeps orphaned values — every copy block on
  // mobile stayed permanently blurred). SSR renders false; hydration computes
  // the real value before any animation runs.
  const [noBlur, setNoBlur] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px), (pointer: coarse)').matches,
  );
  useEffect(() => {
    setNoBlur(window.matchMedia('(max-width: 767px), (pointer: coarse)').matches);
  }, []);
  return noBlur;
}

function Copy({ frame, index }: { frame: Frame; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const noBlur = useNoTextBlur();
  const inView = useInView(ref, { amount: 0.55 });

  // Chrome guard (owner bug 2026-07-08, 375×812): the fixed chrome (wordmark +
  // Menu + CTA row, ~64px + hairline) rides over the film, and a SHORT copy
  // block — SB-02's lone centered headline is ~40px tall — stays ≥55% in view,
  // and therefore fully lit, until it is physically inside that chrome zone.
  // The anchor math is correct (the block centers exactly at band middle); it
  // is the exit reveal that fires too late for short blocks, because the
  // useInView threshold above is a fraction of BLOCK height, not a viewport
  // line. Guard: a second observer whose root is the top 13% of the viewport
  // (~106px at 812 — a beat above the ~72px chrome zone) hides the copy the
  // moment its top edge crosses in, so the 0.3s fade + y-dip completes before
  // the wordmark. It watches the un-transformed .copy-block box, NOT `ref`:
  // the animated child dips y+30 on hide, and observing the moving box would
  // oscillate across the trigger line. Mobile/coarse only (`noBlur` is the
  // same media query); CTA beats are exempt — the chrome bows out over them
  // (ACCENT_BEATS in ExperienceScroll), and an invisible-but-still-clickable
  // Gulf button under the top edge would be worse than any overlap.
  const chromeGuardRef = useRef<HTMLDivElement>(null);
  const nearChrome = useInView(chromeGuardRef, { margin: '0px 0px -87% 0px' });
  const chromeGuarded = noBlur && !frame.cta && !frame.secondaryCta && nearChrome;
  const show = reduce || (inView && !chromeGuarded);

  // Tap-to-unmute affordance (film path only — StaticStage has no video).
  // The button talks to the beat's PlayOnceLayer over a window event pair;
  // the layer owns the video and reports the live state back.
  const [soundOn, setSoundOn] = useState(false);
  useEffect(() => {
    if (!frame.sound || index === undefined) return;
    const onState = (e: Event) => setSoundOn(Boolean((e as CustomEvent).detail));
    window.addEventListener('de:sound-state', onState);
    return () => window.removeEventListener('de:sound-state', onState);
  }, [frame.sound, index]);

  // Weighted beat pacing — only the film path passes an index (StaticStage
  // stays unweighted by design), and only beats whose weight differs from 1 on
  // either table get the taller block + anchor-window markup; everything else
  // keeps the exact legacy DOM. Heights/anchors are CSS vars resolved by the
  // .beat-h/.beat-anchor media query (globals.css) so SSR paints the right
  // column with zero hydration shift.
  const heavy =
    index !== undefined && (FINE_BANDS.weight[index] !== 1 || COARSE_BANDS.weight[index] !== 1);
  const beatVars = heavy
    ? ({
        '--wf': FINE_BANDS.weight[index!],
        '--wc': COARSE_BANDS.weight[index!],
        '--af': FINE_BANDS.copyAt[index!] * FINE_BANDS.weight[index!] - 0.5,
        '--ac': COARSE_BANDS.copyAt[index!] * COARSE_BANDS.weight[index!] - 0.5,
      } as React.CSSProperties)
    : undefined;

  const alignItems =
    frame.align === 'center' ? 'items-center text-center'
    : frame.align === 'right' ? 'items-end text-right'
    : 'items-start text-left';
  const justify =
    frame.align === 'center' ? 'justify-center'
    : frame.align === 'right' ? 'justify-end'
    : 'justify-start';

  // frames.ts is owned by a parallel agent adding two optional fields (the
  // SB-04 `chip` eyebrow and the `brightPlate` flags) — read them defensively
  // through a type intersection so either merge order type-checks.
  const { chip, brightPlate } = frame as Frame & { chip?: string; brightPlate?: boolean };

  const has = chip || frame.kicker || frame.headline || frame.jewel || frame.body || frame.cta || frame.secondaryCta;
  if (!has)
    return heavy
      ? <div className="beat-h" style={beatVars} aria-hidden="true" />
      : <div className="h-[100svh]" aria-hidden="true" />;

  // Copy sits at mid-viewport where the global scrim is most transparent —
  // a soft local scrim keyed to alignment protects contrast over live video.
  // The scrim is a CSS class (globals.css): portrait crops discard the plates'
  // dark thirds, so narrow/coarse viewports get a stronger, wider scrim plus
  // a text-shadow on .copy-block (mobile pass: white copy over the white 458
  // hood measured effective luminance 113 behind the desktop scrim — illegible).
  const scrimX = frame.align === 'center' ? '50%' : frame.align === 'right' ? '78%' : '22%';

  const inner = (
    <>
      <div
        aria-hidden="true"
        className="copy-scrim pointer-events-none absolute inset-0"
        style={{ '--sx': scrimX } as React.CSSProperties}
      />
      {/* Bright-plate assist (type pass 2026-07-06): plates flagged brightPlate
          keep no dark third behind the copy on desktop — a second, quieter pass
          of the scrim treatment layers behind the copy zone only, ≥1024px
          (globals.css .copy-scrim-bright; mobile already ships the strong scrim). */}
      {brightPlate && (
        <div
          aria-hidden="true"
          className="copy-scrim copy-scrim-bright pointer-events-none absolute inset-0"
          style={{ '--sx': scrimX } as React.CSSProperties}
        />
      )}
      <div ref={chromeGuardRef} className="copy-block relative mx-auto w-full max-w-content px-6 md:px-8">
        <motion.div
          ref={ref}
          className={cn('flex w-full flex-col', alignItems)}
          initial={false}
          animate={
            reduce
              ? undefined
              : noBlur
                // filter pinned to 0 (not omitted): clears any stale blur if
                // the pointer class flips mid-session; a constant costs nothing.
                ? { opacity: show ? 1 : 0, y: show ? 0 : 30, filter: 'blur(0px)' }
                : { opacity: show ? 1 : 0, y: show ? 0 : 30, filter: show ? 'blur(0px)' : 'blur(6px)' }
          }
          // Chrome-guard hides are quick (clear the zone in ~0.3s); every other
          // reveal/hide keeps the film's 0.85s resolve. Desktop is untouched —
          // chromeGuarded is always false on fine pointers ≥768px.
          transition={{ duration: chromeGuarded ? 0.3 : 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          {chip && (
            // The status chip (deck §7.1, SB-04 `Opening soon`): a quiet
            // eyebrow above the kicker line. Hairline border, no Gulf, no
            // glow — it is a status, not an action. Inherits the beat's copy
            // reveal; static under reduced motion like the rest of the block.
            <span className="mb-4 inline-flex items-center rounded-sm border border-line px-2.5 py-1 text-[11px] tracking-[0.08em] text-ink-2">
              {chip}
            </span>
          )}
          {frame.kicker && (
            // Brand law: kickers are sentence-case (never uppercase); purely
            // numeric kickers render as the Spectral-italic .idx numeral
            // (color lifted to metal by .copy-block .idx — the type pass; the
            // ink-3 default measured as the dimmest text on screen).
            /^\d+$/.test(frame.kicker)
              ? <span className="idx mb-5 text-lg">{frame.kicker}</span>
              : <span className="mb-5 text-[11px] tracking-[0.08em] text-metal">{frame.kicker}</span>
          )}
          {frame.sound && index !== undefined && (
            <button
              type="button"
              aria-pressed={soundOn}
              onClick={() => window.dispatchEvent(new CustomEvent('de:sound-toggle'))}
              // 44px min touch target on coarse pointers (Apple HIG).
              className="mb-4 flex w-fit items-center rounded-sm border border-line-2 px-4 py-1.5 text-[11px] font-semibold tracking-[0.08em] text-ink-2 transition-colors duration-250 ease-de hover:border-ink-3 hover:text-ink max-sm:min-h-[44px]"
            >
              {soundOn ? 'Mute' : frame.sound}
            </button>
          )}
          {frame.headline && (
            <h2 className="max-w-[16ch] font-display text-4xl font-bold leading-[1.03] tracking-tight-exotiq text-ink md:text-6xl">
              {frame.headline}
            </h2>
          )}
          {frame.jewel && <p className="mt-4 font-serif text-2xl italic text-ink-2 md:text-3xl">{frame.jewel}</p>}
          {frame.body && (
            // Type pass (owner-approved 2026-07-06): the support tier measured
            // under-legible on desktop — body rises one token step (ink-2 →
            // metal) and one size step (18 → 19px with matched leading).
            // Brighter floor, not louder voice. .copy-body left-aligns
            // multi-line body text on mobile (globals.css).
            <p className="copy-body mt-4 max-w-prose text-base text-metal md:text-[19px] md:leading-[30px]">
              {frame.odometerTarget && frame.body.includes('{n}')
                ? frame.body.split('{n}').flatMap((part, i, arr) =>
                    i < arr.length - 1 ? [part, <Odometer key={i} to={frame.odometerTarget!} />] : [part])
                : frame.body}
            </p>
          )}
          {(frame.cta || frame.secondaryCta) && (
            // The finale's ask arrives as film: the CTA row rises a beat after
            // the jewel line, each button staggered (SB-20 only; elsewhere the
            // row resolves with the block).
            <motion.div
              className={cn('mt-8 flex flex-wrap gap-3', justify)}
              initial={false}
              animate={
                reduce || frame.id !== 'SB-20'
                  ? undefined
                  : noBlur
                    ? { opacity: show ? 1 : 0, y: show ? 0 : 24, filter: 'blur(0px)' }
                    : { opacity: show ? 1 : 0, y: show ? 0 : 24, filter: show ? 'blur(0px)' : 'blur(6px)' }
              }
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {frame.cta && (
                <Link href={frame.ctaHref || '#'} className="rounded-sm bg-gulf px-6 py-3 text-sm font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2">
                  {frame.cta}
                </Link>
              )}
              {frame.secondaryCta && (
                <motion.span
                  initial={false}
                  animate={reduce || frame.id !== 'SB-20' ? undefined : { opacity: show ? 1 : 0, y: show ? 0 : 24 }}
                  transition={{ duration: 0.7, delay: 0.47, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={frame.secondaryCtaHref || '#'} className="rounded-sm border border-line-2 px-6 py-3 text-sm font-semibold text-ink transition-colors duration-250 ease-de hover:border-ink-3">
                    {frame.secondaryCta}
                  </Link>
                </motion.span>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );

  return heavy ? (
    // The weighted block: weight·100svh tall, with a 100svh anchor window
    // absolutely positioned at copyAt so the copy centers at the treatment's
    // chosen plate-local progress (SB-19's caption rides the held money frame).
    <div className="beat-h relative" style={beatVars}>
      <div className="beat-anchor absolute inset-x-0 flex h-[100svh] items-center">{inner}</div>
    </div>
  ) : (
    <div className="relative flex h-[100svh] items-center">{inner}</div>
  );
}

/** One cross-fading, slowly-zooming media plate in the pinned stage. */
function Plate({ frame, index, progress, priority, active, bands }: { frame: Frame; index: number; progress: MotionValue<number>; priority?: boolean; active: number; bands: Bands }) {
  // Opaque-underneath crossfade: the incoming plate fades in OVER a still
  // fully-opaque outgoing plate (later sibling paints above — keep DOM order,
  // never add z-index), and the outgoing drops to 0 only once provably
  // covered. True film dissolve: no canvas/vignette dip at any boundary, in
  // either scroll direction. Per-boundary width via FADES (keyed by the
  // OUTGOING plate id), centered on the band boundary so reverse scroll stays
  // symmetric. Fade widths are constant in SCROLL distance (units of
  // bands.unit = one viewport), NOT scaled by band weight — a dissolve reads
  // in scroll-time, so weighted bands keep the same felt dissolve as the rest
  // of the film. Consequence: on weighted beats the fade-in completes at
  // plate-local p = 0.15/weight, safely before every scrub deadZone start
  // (living.ts) — do not "restore" deadZones to 0.15, that margin is intended.
  const HALF = 0.15;
  const sIn = FADES[FRAMES[index - 1]?.id ?? ''] ?? 1;
  const sOut = FADES[frame.id] ?? 1;
  const inStart = bands.start[index] - HALF * sIn * bands.unit;
  const inEnd = bands.start[index] + HALF * sIn * bands.unit;
  const nextOpaque = bands.end[index] + HALF * sOut * bands.unit; // the plate above is at opacity 1
  const outStart = nextOpaque + 0.03 * bands.unit;
  const outEnd = outStart + 0.12 * bands.unit;
  const stops =
    index === 0 ? [0, outStart, outEnd]
    : index === N - 1 ? [inStart, inEnd, 1]
    : [inStart, inEnd, outStart, outEnd];
  const values = index === 0 ? [1, 1, 0] : index === N - 1 ? [0, 1, 1] : [0, 1, 1, 0];
  const opacity = useTransform(progress, stops, values);

  // Once covered, the plate's video decodes invisibly — pause it (resumes the
  // moment upward scroll uncovers it, just before the reveal).
  const [covered, setCovered] = useState(index !== 0);
  useMotionValueEvent(progress, 'change', (v) => {
    const c = v > nextOpaque || v < inStart;
    setCovered((cur) => (cur === c ? cur : c));
  });
  // SB-20 is locked-off (the finale holds its breath) — no ken-burns.
  // The [0,1] clamps are load-bearing: without them plate 0's range starts
  // negative and the cold open would paint mid-zoom on the LCP frame.
  const finale = frame.id === 'SB-20';
  const scale = useTransform(
    progress,
    [Math.max(0, bands.start[index] - 0.1 * bands.unit), Math.min(1, bands.end[index] + 0.1 * bands.unit)],
    finale ? [1, 1] : [1.06, 1.16],
  );
  // Plate-local progress: 0 at band entry, 1 at band exit (same band math).
  const p = useTransform(progress, [bands.start[index], bands.end[index]], [0, 1]);

  // Treatment exit moves (crane-away / dive / whip) over the band's final
  // stretch — on the outer wrapper so they compose with the ken-burns.
  const exit = EXITS[frame.id];
  const exitScale = useTransform(p, [exit?.from ?? 2, 1], [1, exit?.scale ?? 1]);
  const exitY = useTransform(p, [exit?.from ?? 2, 1], ['0%', exit?.y ?? '0%']);

  const living = LIVING[frame.id];
  const overlay = OVERLAYS[frame.id];
  const dist = Math.abs(index - active);

  // GPU promotion only for the working set (incoming/active/outgoing) — a
  // permanently promoted 24-plate stack pins ~48 viewport-sized compositor
  // buffers and blows the iOS Safari tile budget. Stills stay mounted for all
  // plates (teleports/fast flicks must never land on an unpainted layer).
  const promote = dist <= 1;

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity, scale: exitScale, y: exitY, transformOrigin: exit?.origin, willChange: promote ? 'opacity, transform' : undefined }}
    >
      <motion.div className="absolute inset-0" style={{ scale, willChange: promote ? 'transform' : undefined }}>
        <Image
          src={frame.media}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          placeholder={PLACEHOLDERS[frame.media] ? 'blur' : 'empty'}
          blurDataURL={PLACEHOLDERS[frame.media]}
          className="object-cover"
          style={frame.focus ? { objectPosition: frame.focus } : undefined}
        />
        {/* Living layer: poster-first enhancement, mounted ±2 bands (buffer), playing ±1 while uncovered. */}
        {living && dist <= 2 && <LivingLayer cfg={living} p={p} near={dist <= 1 && !covered} focus={frame.focus} />}
        {/* Film-print unifier for real-footage beats (see GRADE in living.ts). */}
        {GRADE[frame.id] && <FilmGrade cfg={GRADE[frame.id]} />}
      </motion.div>
      {/* Instrument/code overlays sit outside the ken-burns wrapper — razor-sharp, no zoom. */}
      {overlay === 'gauge' && dist <= 1 && <GaugeSweep p={p} />}
      {overlay === 'lamp' && dist <= 1 && <LampBreath />}
      {/* Finale vignette settle — the theater lights coming down. */}
      {finale && <FinaleVignette p={p} />}
    </motion.div>
  );
}

/**
 * Seats real-footage beats in the film's print: warm soft-light wash, tiled
 * 35mm-style grain, extra vignette. Static layers — zero per-frame cost; the
 * plate's own opacity/transform wrappers carry them through dissolves.
 */
function FilmGrade({ cfg }: { cfg: { wash?: number; grain?: number; vignette?: number } }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {cfg.wash && (
        <div
          className="absolute inset-0"
          style={{
            opacity: cfg.wash,
            mixBlendMode: 'soft-light',
            background: 'linear-gradient(160deg, #FFB870 0%, #7A5A3A 45%, #1A1410 100%)',
          }}
        />
      )}
      {cfg.grain && (
        <div
          className="absolute inset-0"
          style={{
            opacity: cfg.grain,
            mixBlendMode: 'overlay',
            backgroundImage: 'url(/images/experience/grain.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
          }}
        />
      )}
      {cfg.vignette && (
        <div
          className="absolute inset-0"
          style={{
            opacity: cfg.vignette,
            background: 'radial-gradient(115% 90% at 50% 45%, transparent 45%, rgba(7,7,8,1) 100%)',
          }}
        />
      )}
    </div>
  );
}

function FinaleVignette({ p }: { p: MotionValue<number> }) {
  const vignette = useTransform(p, [0.5, 1], [0.35, 0.5]);
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: vignette,
        background: 'radial-gradient(120% 95% at 50% 45%, transparent 35%, rgba(7,7,8,1) 100%)',
      }}
    />
  );
}

/**
 * The threshold bloom (SB-02b→SB-04): warm light swelling over the cut as the
 * walk-in's final acceleration lands in the fleet aisle. Screen-blend above
 * both plates; peaks at the exact band boundary; ±0.35 viewports either side.
 * (Act I redesign 2026-07-06 — was SB-02→SB-03; the walk-in absorbed the rush,
 * so the bloom moved to the corridor's arrival.)
 */
function Bloom({ progress, bands }: { progress: MotionValue<number>; bands: Bands }) {
  const k = FRAMES.findIndex((f) => f.id === 'SB-02b');
  const cut = bands.end[k];
  // Asymmetric swell (owner 2026-07-17: the aisle's light should arrive
  // SOONER): a long lead — the corridor's end brightens half a viewport
  // before arrival — peaking harder at the cut, then a slow warm decay while
  // the fleet aisle resolves underneath.
  const opacity = useTransform(
    progress,
    [cut - 0.55 * bands.unit, cut, cut + 0.45 * bands.unit],
    [0, 0.42, 0],
  );
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        mixBlendMode: 'screen',
        background: 'radial-gradient(90% 70% at 50% 58%, rgba(255,214,160,0.9), rgba(255,190,120,0.25) 55%, transparent 78%)',
      }}
    />
  );
}

/** Pinned full-viewport media layer: all plates stacked, cross-fading on scroll. */
function StageMedia({ progress, bands }: { progress: MotionValue<number>; bands: Bands }) {
  // Active plate index — drives windowed mounting of living layers only; the
  // cross-dissolve itself stays purely motion-value-driven. bandAt (band
  // containment) replaces Math.round(v/D): identical at all-weights-1,
  // correct ownership on weighted bands.
  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, 'change', (v) => {
    const i = bandAt(v, bands);
    setActive((cur) => (cur === i ? cur : i));
  });
  // 'change' never fires for a restored scroll position — sync before paint
  // (iOS Safari restores scroll aggressively; a post-paint sync would commit
  // one frame with the wrong working set promoted). Re-runs when the weight
  // table flips (breakpoint crossing) — same restore semantics, new bands.
  useLayoutEffect(() => {
    setActive(bandAt(progress.get(), bands));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bands]);
  // Plates are keyed by table identity: framer's useTransform captures its
  // stop arrays at hook time, so a breakpoint flip must remount the stack to
  // rebuild every dissolve with the new geometry (rare event, poster-first
  // makes the remount invisible).
  const mode = bands === FINE_BANDS ? 'f' : 'c';
  return (
    // aria-hidden: the whole media stack is decorative — the story lives in
    // the copy blocks and the server-rendered spine.
    <div aria-hidden="true" className="sticky top-0 h-[100svh] w-full overflow-hidden bg-canvas">
      {FRAMES.map((f, i) => (
        <Plate key={`${f.id}-${mode}`} frame={f} index={i} progress={progress} priority={i === 0} active={active} bands={bands} />
      ))}
      {/* SB-02b→SB-04 bloom assist (treatment: the corridor's light swallows
          the frame as the walk-in lands in the aisle). Under opaque-underneath
          layering the outgoing plate can't brighten itself out, so a
          screen-blend swell ABOVE both plates peaks exactly on the cut,
          constant scroll width like every dissolve. */}
      <Bloom progress={progress} bands={bands} />
      {/* One film, one print: 5% grain over every plate (spec §2.5) welds the
          generative and real footage; static tile, zero per-frame cost. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: 'url(/images/experience/grain.png)', backgroundRepeat: 'repeat', backgroundSize: '256px 256px' }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 42%, transparent 40%, rgba(11,11,12,.5) 85%), linear-gradient(180deg, rgba(11,11,12,.5), transparent 22%, transparent 60%, rgba(11,11,12,.85))',
        }}
      />
    </div>
  );
}

/** Reduced-motion / no-JS friendly: plain stacked static beats, no pinning or cross-fade. */
function StaticStage() {
  return (
    <div>
      {FRAMES.map((f, i) => {
        const wordless = !f.kicker && !f.headline && !f.jewel && !f.body && !f.cta;
        return (
          <section key={f.id} aria-label={f.aria} className="relative flex min-h-[100svh] items-center overflow-hidden bg-canvas">
            <Image
              src={f.media}
              alt=""
              fill
              sizes="100vw"
              priority={i === 0}
              placeholder={PLACEHOLDERS[f.media] ? 'blur' : 'empty'}
              blurDataURL={PLACEHOLDERS[f.media]}
              className="object-cover opacity-90"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(11,11,12,.5), transparent 26%, transparent 56%, rgba(11,11,12,.85))' }}
            />
            <div className="relative z-[2] w-full">
              {wordless && f.aria ? (
                <div className="mx-auto w-full max-w-content px-6 md:px-8">
                  <span className="text-[11px] tracking-[0.08em] text-ink-2">{f.aria}</span>
                </div>
              ) : (
                <Copy frame={f} />
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/**
 * The cinematic scroll stage — one pinned viewport that cross-dissolves and
 * slow-zooms through every beat as you scroll (the "one continuous camera"
 * feel), with copy resolving in over the top. Fully reduced-motion safe.
 */
export default function CinematicStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const bands = useBands();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  if (reduce) return <StaticStage />;

  return (
    <section ref={ref} className="relative">
      <StageMedia progress={scrollYProgress} bands={bands} />
      <div className="relative z-10 -mt-[100svh]">
        {FRAMES.map((f, i) => (
          <Copy key={f.id} frame={f} index={i} />
        ))}
      </div>
    </section>
  );
}
