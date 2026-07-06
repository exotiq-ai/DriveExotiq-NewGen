import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SponsorInquiryForm from '@/components/forms/SponsorInquiryForm';
import RouteMap from '@/components/sponsor/RouteMap';
import { normalizeSponsorTier } from '@/lib/sponsor';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sponsor the wrap — Denver→Miami tour',
  description:
    'Wrap one exotic car driven across ten markets and 5,000 miles in 2026. Title, Tour, and Drive sponsorships open now at Drive Exotiq.',
  alternates: { canonical: '/sponsor' },
};

const TIERS = [
  {
    name: 'Title / Wrap',
    tag: 'Your livery on the car for all 5,000 miles.',
    includes: [
      'Full vehicle wrap',
      'Naming on the tour',
      'Every drive and meet',
      'Content rights',
      'First right of renewal',
    ],
    headline: true,
  },
  {
    name: 'Tour',
    tag: 'A panel on the car and presence in every market.',
    includes: ['Panel placement', 'Logo across the route', 'Market activations', 'Content rights'],
    headline: false,
  },
  {
    name: 'Drive',
    tag: 'Present a single sunrise drive and its Cars & Coffee.',
    includes: ['One drive presented', 'On-site presence', 'Cars & Coffee branding', 'Photography'],
    headline: false,
  },
];

export default function SponsorPage({
  searchParams,
}: {
  searchParams?: { interest?: string };
}) {
  const defaultInterest = normalizeSponsorTier(searchParams?.interest);

  return (
    <>
      <Header />
      <main id="main" className="bg-canvas">
        {/* 1 — The opportunity */}
        <section className="mx-auto max-w-content px-6 pb-12 pt-32 md:px-10 md:pb-16 md:pt-40">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gulf" />
            <span className="text-[13px] tracking-[0.04em] text-ink-2">The wrap is open</span>
          </div>

          <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[0.98] tracking-tightest text-ink">
            One car. Ten markets. 5,000 miles of road.
          </h1>

          <p className="mt-7 max-w-[56ch] text-[clamp(1.05rem,1.8vw,1.35rem)] leading-snug text-ink-2">
            A single exotic tour from Denver to Miami in 2026, through ten of the
            country&rsquo;s best car markets — and the wrap on the car is still available.
          </p>

          <p className="mt-6 max-w-[62ch] text-[15px] leading-relaxed text-ink-2">
            Drive Exotiq is the community front door to the exotiq.rent exotic-car
            marketplace. The 2026 tour puts one unmistakable car in front of the exact
            people who care about it — at drives, Cars &amp; Coffee meets, and across
            5,000 miles of public road. Your brand rides shotgun the whole way.
          </p>

          <a
            href="#inquire"
            className="mt-9 inline-flex min-h-[52px] items-center justify-center rounded-sm bg-gulf px-7 py-3.5 text-[17px] font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
          >
            Start a sponsorship conversation
          </a>
        </section>

        {/* 2 — The asset */}
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-content gap-10 px-6 py-section md:grid-cols-2 md:items-center md:px-10">
            <div>
              <p className="font-serif text-lg italic text-ink-3">The asset</p>
              <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.02] tracking-tightest text-ink">
                The car is a billboard that drives.
              </h2>
              <p className="mt-6 max-w-[48ch] text-[15px] leading-relaxed text-ink-2">
                A 2017 Audi S8 in heritage racing livery — a sleeper with real presence.
                It spends the summer and fall of 2026 being seen: at sunrise drives, parked
                at curated meets, and moving between ten major markets. The wrap is the
                blank canvas.
              </p>
            </div>

            {/* Blank-canvas panel — decorative; SP-ASSET-BODY already carries the meaning */}
            <div
              aria-hidden="true"
              className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-dashed border-line-2 bg-canvas-2"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-[clamp(1rem,2.2vw,1.4rem)] italic text-ink-3">
                  Your livery goes here.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3 — The route is the media plan */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-content px-6 py-section md:px-10">
            <p className="font-serif text-lg italic text-ink-3">The route</p>
            <h2 className="mt-4 max-w-[20ch] font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.02] tracking-tightest text-ink">
              The route is the media plan.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">
              Every stop is an audience — a sunrise rollout into a curated Cars &amp;
              Coffee. Reach figures per market come with the media kit.
            </p>

            <div className="mt-10 overflow-hidden rounded-sm border border-line bg-canvas-2 p-6 md:p-10">
              <RouteMap />
            </div>
            <p className="mt-4 text-[13px] tracking-[0.04em] text-ink-3">
              Denver → Miami · summer–fall 2026 · ten markets, one car
            </p>
          </div>
        </section>

        {/* 4 — Tiers */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-content px-6 py-section md:px-10">
            <p className="font-serif text-lg italic text-ink-3">The tiers</p>
            <h2 className="mt-4 max-w-[20ch] font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.02] tracking-tightest text-ink">
              Three ways to ride along.
            </h2>

            <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-3">
              {TIERS.map((tier) => (
                <div key={tier.name} className="flex flex-col bg-canvas px-6 py-8 md:px-7 md:py-9">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl font-semibold tracking-tight-exotiq text-ink">
                      {tier.name}
                    </h3>
                    {tier.headline && (
                      <span className="text-[11px] tracking-[0.08em] text-gulf">Headline</span>
                    )}
                  </div>
                  <p className="mt-3 text-[15px] leading-snug text-ink-2">{tier.tag}</p>
                  <ul className="mt-6 space-y-2.5">
                    {tier.includes.map((inc) => (
                      <li key={inc} className="flex items-start gap-3 text-[14px] text-ink-2">
                        <span className="mt-2 inline-block h-1 w-1 shrink-0 bg-jewel" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
                    <span className="text-[13px] tracking-[0.04em] text-ink-2">Inquire</span>
                    <a
                      href="#inquire"
                      className="text-right text-[14px] text-ink-2 transition-colors hover:text-gulf"
                    >
                      Start a sponsorship conversation →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5 — Proof */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-content px-6 py-section md:px-10">
            <p className="font-serif text-lg italic text-ink-3">Why it works</p>
            <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.02] tracking-tightest text-ink">
              This already works.
            </h2>
            <p className="mt-6 max-w-[54ch] text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-ink-2">
              The drives run monthly with founders, serious owners, and sponsors in the
              room. The audience is small, real, and exactly who you want your brand parked
              next to. In 2026 that audience spans ten markets, from Denver to Miami.
            </p>
          </div>
        </section>

        {/* 6 — Inquiry form */}
        <section id="inquire" className="scroll-mt-24 border-t border-line">
          <div className="mx-auto max-w-content px-6 py-section md:px-10">
            <div className="max-w-[42ch]">
              <p className="font-serif text-lg italic text-ink-3">Let&rsquo;s talk</p>
              <h2 className="mt-4 max-w-[18ch] font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.02] tracking-tightest text-ink">
                Let&rsquo;s talk about the wrap.
              </h2>
              <p className="mt-5 max-w-[48ch] text-[15px] leading-relaxed text-ink-2">
                Tell us a little about your brand and which tier fits. We&rsquo;ll come
                back fast — this is a small operation.
              </p>
            </div>

            <div className="mt-10 max-w-[52rem]">
              <SponsorInquiryForm defaultInterest={defaultInterest} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
