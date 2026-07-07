import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'The Drives · invite-only sunrise drives',
  description:
    'Invite-only sunrise drives on the last Sunday of every month, followed by a curated Cars & Coffee. Request your invite to Drive Exotiq.',
  alternates: { canonical: '/drives' },
};

const STEPS = [
  { head: 'Get on the list.', body: 'One name at a time. We review every one. This stays small on purpose.' },
  { head: 'We review and invite.', body: 'When a drive fits your city, your invite and the meet point land in your inbox a few days ahead.' },
  { head: 'You roll out at sunrise.', body: 'The last Sunday of the month, before the city wakes, ending somewhere worth parking.' },
];

const FAQ = [
  {
    q: 'Who can join a Drive Exotiq drive?',
    a: 'Drives are invite-only. Get on the list and we’ll invite you when a drive fits your city. It stays small on purpose.',
  },
  {
    q: 'When do the drives happen?',
    a: 'The last Sunday of every month, at sunrise, followed by a curated Cars & Coffee.',
  },
  {
    q: 'What kind of car do I need?',
    a: 'If you actually drive it, you belong. We care about the driver more than the badge.',
  },
  {
    q: 'Is there a cost?',
    a: 'No. The drives are how the Drive Exotiq community is built, not a product.',
  },
  {
    q: 'How is this related to exotiq.rent?',
    a: 'Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace, coming soon.',
  },
];

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function DrivesPage() {
  return (
    <>
      <Header />
      <main id="main" className="bg-canvas">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
        />

        {/* Hero */}
        <section className="mx-auto max-w-content px-6 pb-12 pt-32 md:px-10 md:pb-16 md:pt-40">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gulf" />
            <span className="text-[13px] tracking-[0.04em] text-ink-2">Invite only</span>
          </div>

          <h1 className="mt-6 max-w-[16ch] font-display text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[0.98] tracking-tightest text-ink">
            The last Sunday. The first light.
          </h1>

          <p className="mt-7 max-w-[54ch] text-[clamp(1.05rem,1.8vw,1.3rem)] leading-snug text-ink-2">
            Invite-only sunrise drives on the last Sunday of every month. A rollout before
            the city wakes, ending in a curated Cars &amp; Coffee.
          </p>

          <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-ink-2">
            Drive Exotiq is the community front door to the exotiq.rent exotic-car
            marketplace, coming soon.
          </p>

          <Link
            href="/apply?interest=drives"
            className="mt-9 inline-flex min-h-[52px] items-center justify-center rounded-sm bg-gulf px-7 py-3.5 text-[17px] font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
          >
            Request your invite
          </Link>
        </section>

        {/* Next drive card (static fallback until the feed is wired) */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-content px-6 py-section md:px-10">
            <div className="rounded-sm border border-line bg-surface px-6 py-8 md:px-10 md:py-10">
              <p className="text-[13px] tracking-[0.04em] text-ink-3">Next drive</p>
              <p className="mt-4 max-w-[40ch] font-serif text-[clamp(1.2rem,2.4vw,1.6rem)] italic leading-snug text-ink">
                The next drive is being routed.
              </p>
              <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-ink-2">
                Get on the list to hear first. Invites go out a few days ahead of each
                sunrise.
              </p>
            </div>
          </div>
        </section>

        {/* How an invite works */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-content px-6 py-section md:px-10">
            <h2 className="max-w-[16ch] font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.02] tracking-tightest text-ink">
              How an invite works.
            </h2>
            <ol className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-3">
              {STEPS.map((step, i) => (
                <li key={i} className="bg-canvas px-6 py-8 md:px-7 md:py-10">
                  <span className="font-serif text-lg italic text-ink-3 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold tracking-tight-exotiq text-ink">
                    {step.head}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Cars & Coffee */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-content px-6 py-section md:px-10">
            <p className="font-serif text-lg italic text-ink-3">And then, coffee.</p>
            <h2 className="mt-4 max-w-[18ch] font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.02] tracking-tightest text-ink">
              Every drive ends somewhere worth parking.
            </h2>
            <p className="mt-6 max-w-[54ch] text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-ink-2">
              A curated Cars &amp; Coffee where founders, enthusiasts, and sponsors actually
              talk. No stanchions, no judging. Just the cars and the people who drive them.
            </p>
          </div>
        </section>

        {/* The people / what we are (absorbed from the community pillar) */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-content px-6 py-section md:px-10">
            <p className="font-serif text-lg italic text-ink-3">The people</p>
            <h2 className="mt-4 max-w-[20ch] font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.02] tracking-tightest text-ink">
              Built for the people who actually drive.
            </h2>
            <p className="mt-6 max-w-[54ch] text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-ink-2">
              Owners who drive, founders building the marketplace, and sponsors who get it.
              The room is small and the conversation is real.
            </p>
            <p className="mt-6 max-w-[52ch] font-serif text-[clamp(1.05rem,1.8vw,1.3rem)] italic leading-snug text-ink-3">
              Quiet, not loud. Driven, not displayed. Invitation, not membership tiers.
            </p>
          </div>
        </section>

        {/* Q&A — visible, and the FAQPage source */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-content px-6 py-section md:px-10">
            <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.02] tracking-tightest text-ink">
              Questions.
            </h2>
            <dl className="mt-10 divide-y divide-line border-t border-line">
              {FAQ.map((item) => (
                <div key={item.q} className="py-7">
                  <dt className="font-display text-lg font-semibold tracking-tight-exotiq text-ink">
                    {item.q}
                  </dt>
                  <dd className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-ink-2">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Close */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-content px-6 py-section text-center md:px-10">
            <p className="mx-auto max-w-[24ch] font-serif text-[clamp(1.3rem,3vw,2rem)] italic leading-snug text-ink">
              The next sunrise is closer than you think.
            </p>
            <div className="mt-8">
              <Link
                href="/apply?interest=drives"
                className="inline-flex min-h-[52px] items-center justify-center rounded-sm bg-gulf px-7 py-3.5 text-[17px] font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
              >
                Request your invite
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
