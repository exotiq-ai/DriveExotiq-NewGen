import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Emblem from '@/components/ui/Emblem';
import GarageStage from '@/components/home/GarageStage';
import ArrivalScene from '@/components/home/ArrivalScene';
import Room from '@/components/home/Room';
import RoomCopy from '@/components/home/RoomCopy';
import CloseScene from '@/components/home/CloseScene';

/**
 * THE GARAGE — home. A SERVER component: all copy, headings and links render
 * server-side for crawlers. Scroll moves you THROUGH a dark private collection;
 * each room previews a pillar and links to its page. Motion lives entirely in
 * the 'use client' islands (GarageStage / ArrivalScene / Room / CloseScene),
 * which degrade to a clean static vertical stack under reduced motion.
 */
export default function Home() {
  return (
    <>
      <Header />

      {/* fixed cinematic backdrop the visitor scrolls through (decorative) */}
      <GarageStage />

      <main className="relative z-[1]">
        {/* H0 — Arrival */}
        <section aria-labelledby="arrival-heading" className="relative">
          <ArrivalScene>
            <p className="flex items-center gap-3 text-ink-2">
              <Emblem className="h-[20px] w-auto text-ink" />
              <span className="font-display text-[18px] font-bold tracking-tight-exotiq text-ink">
                Drive Exotiq
              </span>
            </p>

            <h1
              id="arrival-heading"
              className="mt-7 max-w-[16ch] font-display text-[clamp(40px,8vw,104px)] font-bold leading-[0.92] tracking-tight-exotiq text-ink"
            >
              Built for the people who actually drive the car.
            </h1>

            <p className="mt-7 max-w-[46ch] font-serif text-[clamp(16px,1.6vw,22px)] italic leading-relaxed text-metal">
              An Exotiq Inc. brand — the community front door to the exotiq.rent
              marketplace.
            </p>

            <p className="mt-9 flex items-center gap-3 text-[13px] tracking-[0.04em] text-ink-3">
              <span className="h-px w-7 bg-ink-3" aria-hidden="true" />
              Walk the garage
            </p>
          </ArrivalScene>
        </section>

        {/* H1 — The Drives */}
        <section aria-label="The Drives" className="relative">
          <Room index="01">
            <RoomCopy
              title="The Drives"
              promise="Last Sunday of the month. Before the city wakes."
              jewel="Dawn roads, empty passes, the right people."
              micro="Invite-only sunrise drives."
              href="/drives"
              cta="Enter the drives"
            />
          </Room>
        </section>

        {/* H2 — The Tour */}
        <section aria-label="The Tour" className="relative">
          <Room index="02" align="right">
            <RoomCopy
              title="The Tour"
              promise="One car. Denver to Miami. Ten markets. 5,000 miles."
              jewel="A single built S8, running coast to coast."
              micro="Summer into fall, 2026."
              href="/tour"
              cta="Ride the tour"
              align="right"
            />
          </Room>
        </section>

        {/* H3 — The Community */}
        <section aria-label="The Community" className="relative">
          <Room index="03">
            <RoomCopy
              title="The Community"
              promise="The cars get you here. The people keep you."
              jewel="A garage is its people before it is its cars."
              micro="Drive Exotiq, exotiq.rent, exotiq.ai"
              href="/community"
              cta="Meet the community"
            />
          </Room>
        </section>

        {/* H4 — The Marketplace (quietest) */}
        <section aria-label="The Marketplace" className="relative">
          <Room index="04" quiet align="right">
            <RoomCopy
              title="The Marketplace"
              promise="The keys are coming out of the glovebox."
              jewel="Where the metal finally moves."
              micro="exotiq.rent · coming soon"
              href="/marketplace"
              cta="Join the waitlist"
              align="right"
            />
          </Room>
        </section>

        {/* H5 — The Sponsor (crescendo, most-lit, S8) */}
        <section aria-label="The Sponsor" className="relative">
          <Room
            index="05"
            lit
            image={{ src: '/images/cars/Audi_S8_tortillaflats_adamkiss.jpg' }}
          >
            <RoomCopy
              title="The Sponsor"
              promise="Your livery on this car. Down this road."
              jewel="One name, carried five thousand miles."
              micro="One wrap sponsor. Ten markets. 5,000 miles."
              href="/sponsor"
              cta="See the wrap opportunity"
            />
          </Room>
        </section>

        {/* H6 — Close */}
        <section aria-labelledby="close-heading" className="relative">
          <CloseScene>
            <h2
              id="close-heading"
              className="mx-auto max-w-[18ch] font-display text-[clamp(34px,5.6vw,76px)] font-bold leading-[0.98] tracking-tight-exotiq text-ink"
            >
              The garage door is open. The road starts here.
            </h2>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/apply"
                className="inline-flex min-h-[52px] items-center justify-center rounded-sm bg-gulf px-7 py-3.5 text-[16px] font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
              >
                Get on the list
              </Link>
              <Link
                href="/blog"
                className="inline-flex min-h-[52px] items-center justify-center rounded-sm border border-line-2 px-7 py-3.5 text-[16px] text-ink transition-colors duration-250 ease-de hover:border-ink-3 hover:bg-white/[0.03]"
              >
                Read the stories
              </Link>
            </div>
          </CloseScene>
        </section>
      </main>

      {/* Footer must sit ABOVE the fixed GarageStage backdrop (z-0) */}
      <div className="relative z-[1]">
        <Footer />
      </div>
    </>
  );
}
