import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RoadbookStage from '@/components/tour/RoadbookStage';
import { BEATS, ODO_TARGET } from '@/components/tour/data';

export const metadata: Metadata = {
  title: 'The Journey — Denver to Miami',
  description:
    'Scroll the drive. One built Audi S8, ten markets, ~5,000 miles — Drive Exotiq’s Denver-to-Miami exotic tour, summer into fall 2026. The wrap is still yours to claim.',
  alternates: { canonical: '/tour' },
};

/**
 * THE JOURNEY — /tour. SERVER component: the page IS the Denver→Miami drive.
 * Real copy, one <h1>, ordered headings, and ten semantic <section>s render
 * server-side for crawlers. RoadbookStage (a 'use client' island) wraps the
 * static timeline and, on capable desktop browsers, paints the pinned
 * "windshield" stage in its place — degrading to this static stack on
 * reduced-motion / mobile.
 */
export default function TourPage() {
  const MEDIA = process.env.NEXT_PUBLIC_MEDIA_BASE ?? '/videos/experience';
  return (
    <>
      <Header />
      <main id="main" className="bg-canvas">
        {/* Intro — full-bleed S8 hero carrying the one <h1>. The real founder's
            car in the canyon plays muted behind a legibility scrim; the copy
            sits on the dark floor of the gradient so it stays fully readable. */}
        <section className="relative flex min-h-[92svh] items-end overflow-hidden">
          <video
            aria-hidden="true"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/experience/poster/tour-hero.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={`${MEDIA}/tour-hero.720.mp4`} media="(max-width: 768px)" type="video/mp4" />
            <source src={`${MEDIA}/tour-hero.mp4`} type="video/mp4" />
          </video>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(11,11,12,0.94) 4%, rgba(11,11,12,0.55) 42%, rgba(11,11,12,0.18) 100%)' }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(11,11,12,0.7) 0%, rgba(11,11,12,0.1) 55%, transparent 100%)' }}
          />

          <div className="relative mx-auto w-full max-w-content px-6 pb-14 md:px-10 md:pb-20">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gulf" />
              <span className="text-[13px] tracking-[0.04em] text-ink-2">
                The Journey · Denver → Miami · summer–fall 2026
              </span>
            </div>

            <h1
              className="mt-6 max-w-[20ch] font-display text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[0.98] tracking-tightest text-ink"
              style={{ textShadow: '0 2px 40px rgba(0,0,0,0.65)' }}
            >
              Before first light, in Denver, the engine is already warm.
            </h1>

            <p
              className="mt-6 max-w-[54ch] text-[clamp(1.05rem,1.7vw,1.3rem)] leading-snug text-ink"
              style={{ textShadow: '0 1px 24px rgba(0,0,0,0.7)' }}
            >
              One built Audi S8, ten markets, ~5,000 miles — the Denver-to-Miami
              exotic tour, summer into fall 2026. The wrap is still yours to claim.
            </p>

            <p className="mt-5 font-serif text-[clamp(1.1rem,2vw,1.5rem)] italic text-gulf">
              a long way south, the long way.
            </p>
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

        {/* Finale — always rendered server-side. Real CTAs (crawlable links). */}
        <section
          aria-labelledby="tour-finale"
          className="relative mx-auto max-w-content px-6 py-section text-center md:px-10"
        >
          <p className="font-serif text-[clamp(1.1rem,2vw,1.4rem)] italic text-gulf">
            the end of the line, under a falling sun.
          </p>

          <h2
            id="tour-finale"
            className="mx-auto mt-5 max-w-[18ch] font-display text-[clamp(2.6rem,8vw,5rem)] font-semibold leading-[0.94] tracking-tightest text-ink"
          >
            Ten cities. Thousands of miles. One blank canvas.
          </h2>

          <p className="mx-auto mt-6 max-w-[44ch] text-[clamp(1rem,1.6vw,1.15rem)] leading-snug text-ink-2">
            This is the car. This is the route. The wrap is still yours to claim.
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
      </main>
      <Footer />
    </>
  );
}
