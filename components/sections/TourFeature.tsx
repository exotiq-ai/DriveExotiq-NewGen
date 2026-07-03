import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';

const STOPS = [
  'Denver', 'Dallas / Ft. Worth', 'Austin', 'Houston', 'New Orleans',
  'Tampa / St. Pete', 'Orlando', 'Palm Beach & Ft. Lauderdale', 'Miami',
];

const FACTS = [
  ['~5,000', 'miles, round trip'],
  ['10', 'markets'],
  ['1', 'built Audi S8'],
  ['Summer → Fall', '2026'],
];

export default function TourFeature() {
  return (
    <section className="border-t border-line bg-canvas-2 py-section">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <Reveal className="flex items-baseline gap-4">
          <span className="font-serif text-xl italic text-jewel">01</span>
          <h2 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] font-bold tracking-tight-exotiq text-ink">
            The Tour
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left — the story */}
          <Reveal>
            <p className="font-serif text-[clamp(1.4rem,2.6vw,2rem)] italic leading-[1.25] text-ink">
              Denver to Miami. The long way south.
            </p>
            <p className="mt-5 max-w-prose text-ink-2">
              Roughly 5,000 miles through the heart of America&rsquo;s exotic-car
              scene — one founder, one built Audi S8, and ten markets where the
              culture actually lives. We&rsquo;re pulling into the Cars &amp; Coffee
              lots and meeting the people who build, rent, wrap, and love these
              machines.
            </p>
            <p className="mt-4 max-w-prose text-ink-3">
              A heritage-inspired racing livery rides the whole way. If we&rsquo;re
              rolling through your city, come say hi.
            </p>

            {/* Facts */}
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4">
              {FACTS.map(([n, label]) => (
                <div key={label} className="bg-canvas-2 p-4">
                  <dt className="font-display text-2xl font-bold text-ink">{n}</dt>
                  <dd className="mt-1 text-[13px] leading-tight text-ink-3">{label}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tour"
                className="inline-flex items-center justify-center rounded-sm bg-gulf px-6 py-3 text-[15px] font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
              >
                Follow the tour
              </Link>
              <Link
                href="/sponsor"
                className="inline-flex items-center justify-center rounded-sm border border-line text-[15px] font-semibold text-ink-2 px-6 py-3 transition-colors duration-250 ease-de hover:border-line-2 hover:text-ink"
              >
                Put your brand on the wrap
              </Link>
            </div>
          </Reveal>

          {/* Right — car + route */}
          <Reveal delay={80}>
            <figure className="overflow-hidden rounded-md border border-line bg-surface">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/images/cars/Audi_S8_tortillaflats_adamkiss.jpg"
                  alt="The Drive Exotiq Audi S8 — the tour car"
                  fill
                  sizes="(max-width: 1024px) 100vw, 540px"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between border-t border-line px-4 py-3 text-[13px] text-ink-3">
                <span>The tour car — a built 2017 Audi S8</span>
                <span className="font-serif italic text-jewel">a sleeper with manners</span>
              </figcaption>
            </figure>

            {/* Route line */}
            <ul className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2.5">
              {STOPS.map((stop, i) => (
                <li key={stop} className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 text-[14px] text-ink-2">
                    <span className="inline-block h-1.5 w-1.5 bg-jewel" />
                    {stop}
                  </span>
                  {i < STOPS.length - 1 && <span className="text-line-2">→</span>}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
