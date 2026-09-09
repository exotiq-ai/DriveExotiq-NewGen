import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RoadbookStage from '@/components/tour/RoadbookStage';
import SponsorPill from '@/components/tour/SponsorPill';
import { BEATS, ODO_TARGET, TOUR_FINALE, TOUR_HERO } from '@/components/tour/data';
import { TOUR_PLACEHOLDERS } from '@/components/tour/placeholders';

export const metadata: Metadata = {
  title: 'The Exotic Tour: Denver to Miami',
  description:
    'We’re driving one 2017 Audi S8 from Denver to Miami: ten markets, about 5,000 miles, summer into fall 2026, parked in front of the people who run exotic fleets. The wrap is for sale.',
  alternates: { canonical: '/tour' },
};

/**
 * THE TOUR — /tour. SERVER component: the page IS the Denver→Miami drive.
 * Real copy, one <h1>, ordered headings, and ten semantic <section>s render
 * server-side for crawlers. RoadbookStage (a 'use client' island) wraps the
 * static timeline and, on capable desktop browsers, paints the pinned
 * "windshield" stage in its place — degrading to this static stack on
 * reduced-motion / mobile.
 */
export default function TourPage() {
  return (
    <>
      <Header />
      <main id="main" className="bg-canvas">
        {/* Intro — full-bleed liveried-S8 hero carrying the one <h1>. Still a
            STILL (owner 2026-07-07: two videos on one page competed — the
            roadbook's rolling windshield below is the page's single moving
            picture). Design push F1: the two owner renders replace the distant
            unliveried berm shot — Tortilla Flats front-45 on desktop, the
            Hangar No. 1 portrait as mobile art direction. The breakpoint-
            conditioned `sizes` keep the hidden variant's preload at thumbnail
            weight so LCP holds with two priority images. */}
        <section id="tour-hero" className="relative flex min-h-[92svh] items-end overflow-hidden bg-canvas">
          {/* Desktop — overscan wrapper mirrors the stage's right-shift (F4)
              so the car reads right-of-center and copy owns the dark left. */}
          <div aria-hidden="true" className="absolute inset-y-0 left-0 right-[-18%] hidden md:block">
            <Image
              src="/images/experience/poster/tour-hero-livery.jpg"
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 118vw, 1vw"
              placeholder="blur"
              blurDataURL={TOUR_PLACEHOLDERS['/images/experience/poster/tour-hero-livery.jpg']}
              className="object-cover"
              style={{ objectPosition: '20% 60%' }}
            />
          </div>
          {/* Mobile — portrait art direction: the car low in frame, the wet
              tarmac's dark lower third as natural ground for the copy. */}
          <div aria-hidden="true" className="absolute inset-0 md:hidden">
            <Image
              src="/images/experience/poster/tour-hero-hangar.jpg"
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 1vw, 100vw"
              placeholder="blur"
              blurDataURL={TOUR_PLACEHOLDERS['/images/experience/poster/tour-hero-hangar.jpg']}
              className="object-cover"
              style={{ objectPosition: '45% 50%' }}
            />
          </div>
          {/* Bottom scrim — capped under the copy block so the car reads
              instantly instead of dimming the whole frame (F1). */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(11,11,12,0.92) 0%, rgba(11,11,12,0.6) 24%, rgba(11,11,12,0.12) 46%, transparent 62%)' }}
          />
          {/* Left scrim — the stage's explicit canvas curve (F4), desktop only;
              the portrait crop earns its floor from the bottom scrim alone. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden md:block"
            style={{ background: 'linear-gradient(to right, #0B0B0C 0%, rgba(11,11,12,0.82) 22%, rgba(11,11,12,0.35) 45%, transparent 65%)' }}
          />

          <div className="relative mx-auto w-full max-w-content px-6 pb-14 md:px-10 md:pb-20">
            {/* Readability (owner 2026-07-20 PM): the mobile hangar render is
                ~80% bright white wall and the copy climbs into it — the film's
                feathered copy plate (deep variant) pools behind the text's
                actual extent, so the copy reads without dimming the car or
                the frame. Same edgeless system as the film. */}
            <div className="relative w-fit max-w-full">
              {/* Top-biased reach: the block's BOTTOM already sits on the wet-
                  tarmac scrim, but its top lines climb into the white hangar
                  wall — the pool leans up so the kicker and first headline
                  line get the core, not the feather. */}
              <div
                aria-hidden="true"
                className="copy-plate copy-plate-bright pointer-events-none absolute -inset-x-6 -bottom-6 -top-20 md:-inset-16"
              />
              <div className="relative">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gulf" />
              {/* Full ink + shadow (owner readability pass): ink-2 gray
                  vanished over the white hangar wall on phones. */}
              <span className="text-[13px] tracking-[0.04em] text-ink" style={{ textShadow: '0 1px 12px rgba(0,0,0,0.6)' }}>
                {TOUR_HERO.kicker}
              </span>
            </div>

            <h1
              className="mt-6 max-w-[20ch] font-display text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[0.98] tracking-tightest text-ink"
              style={{ textShadow: '0 2px 40px rgba(0,0,0,0.65)' }}
            >
              {TOUR_HERO.headline}
            </h1>

            <p
              className="mt-6 max-w-[54ch] text-[clamp(1.05rem,1.7vw,1.3rem)] leading-snug text-ink"
              style={{ textShadow: '0 1px 24px rgba(0,0,0,0.7)' }}
            >
              {TOUR_HERO.sub}
            </p>

            <p className="mt-5 font-serif text-[clamp(1.1rem,2vw,1.5rem)] italic text-gulf">
              {TOUR_HERO.jewel}
            </p>

            {/* Hero CTA row (F5) — the owner's dictated value line, quiet
                bordered treatment: the persistent pill downpage is the tour's
                one Gulf action, so this stays hairline, not accent. */}
            <div className="mt-8">
              <Link
                href="/sponsor?interest=title-wrap"
                className="group inline-flex min-h-[52px] items-center gap-3 rounded-sm border border-line-2 bg-canvas/60 px-5 py-3 text-[15px] font-medium text-ink backdrop-blur-sm transition-colors duration-250 ease-de hover:border-ink-3 hover:bg-canvas/80"
              >
                <span>Why this wrap is worth $10 million — partner or sponsor the wrap.</span>
                <span
                  aria-hidden="true"
                  className="text-ink-2 transition-transform duration-250 ease-de group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>
              </div>
            </div>
          </div>
        </section>

        {/* The drive. RoadbookStage renders the cinematic stage on desktop and
            this crawlable timeline of the ten stops on mobile / reduced motion. */}
        <RoadbookStage>
          <ol className="mx-auto max-w-content px-6 pb-8 md:px-10">
            {BEATS.map((beat) => (
              <li key={beat.id}>
                <section
                  id={beat.id}
                  aria-labelledby={`${beat.id}-name`}
                  className="relative border-t border-line py-10"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[12px] tabular-nums tracking-[0.04em] text-gulf">
                      leg {beat.leg}/{BEATS.length}
                    </span>
                    <span className="text-[12px] tabular-nums tracking-[0.1em] text-ink-3">
                      {beat.legMi}
                      {beat.tag ? ` · ${beat.tag}` : ''}
                    </span>
                  </div>

                  <h2
                    id={`${beat.id}-name`}
                    className="mt-4 font-display text-[clamp(2rem,8vw,3rem)] font-semibold leading-[0.96] tracking-tightest text-ink"
                  >
                    {beat.name}
                  </h2>

                  <p className="mt-3 max-w-[28ch] font-serif text-[clamp(1.05rem,4.5vw,1.3rem)] italic leading-snug text-ink-2">
                    {beat.dek}
                  </p>

                  <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-ink-3">
                    {beat.note}
                  </p>
                </section>
              </li>
            ))}
          </ol>
        </RoadbookStage>

        {/* Finale — always rendered server-side. Real CTAs (crawlable links).
            Copy reads from TOUR_FINALE (data.ts) — the stage consumes the same
            strings, so the finale can never drift again (F2). */}
        <section
          id="tour-finale-section"
          aria-labelledby="tour-finale"
          className="relative mx-auto max-w-content px-6 py-section text-center md:px-10"
        >
          <p className="font-serif text-[clamp(1.1rem,2vw,1.4rem)] italic text-gulf">
            {TOUR_FINALE.jewel}
          </p>

          <h2
            id="tour-finale"
            className="mx-auto mt-5 max-w-[18ch] font-display text-[clamp(2.6rem,8vw,5rem)] font-semibold leading-[0.94] tracking-tightest text-ink"
          >
            {TOUR_FINALE.headline}
          </h2>

          <p className="mx-auto mt-6 max-w-[54ch] text-[clamp(1rem,1.6vw,1.15rem)] leading-snug text-ink-2">
            {TOUR_FINALE.sub}
          </p>

          {/* AEO anchor, server-rendered (§1.3 law) — copy, not a CTA. */}
          <p className="mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-ink-3">
            Drive Exotiq is the community front door to the exotiq.rent
            exotic-car marketplace, coming soon.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sponsor"
              className="inline-flex min-h-[52px] items-center justify-center rounded-sm bg-gulf px-7 py-3.5 text-[17px] font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
            >
              Sponsor the wrap
            </Link>
            <Link
              href="/apply"
              className="inline-flex min-h-[52px] items-center justify-center rounded-sm border border-line-2 px-7 py-3.5 text-[17px] font-semibold text-ink transition-colors duration-250 ease-de hover:border-ink-3 hover:bg-white/[0.03]"
            >
              Get on the list
            </Link>
          </div>

          <p className="mt-10 text-[12px] tabular-nums tracking-[0.1em] text-ink-3">
            {ODO_TARGET.toLocaleString()} miles round trip · {BEATS.length} markets · one car
          </p>
        </section>

        {/* Persistent sponsor pill (F5) — the page's one Gulf action once the
            hero scrolls away; suppressed at the finale so the ask never
            doubles. Crawlable <a> from first paint (client island SSRs it). */}
        <SponsorPill />
      </main>
      <Footer />
    </>
  );
}
