import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ApplicationForm from '@/components/forms/ApplicationForm';
import { normalizeApplyInterest } from '@/lib/interest';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Get on the list',
  description:
    'Get on the list for invite-only sunrise drives, the 2026 Denver→Miami tour, and the exotiq.rent waitlist. Drive Exotiq, an Exotiq Inc. brand.',
  alternates: { canonical: '/apply' },
};

const STEPS = [
  {
    head: 'We read every name.',
    body: 'This stays small on purpose. A real person reviews each one.',
  },
  {
    head: 'Your city, your invite.',
    body: 'When a drive fits your city, the invite and the meet point land in your inbox a few days ahead.',
  },
  {
    head: 'First to hear.',
    body: 'You get word before anyone else when the tour rolls through — and when exotiq.rent opens.',
  },
];

export default function ApplyPage({
  searchParams,
}: {
  searchParams?: { interest?: string };
}) {
  const defaultInterest = normalizeApplyInterest(searchParams?.interest);

  return (
    <>
      <Header />
      <main id="main" className="bg-canvas">
        {/* Hero */}
        <section className="mx-auto max-w-content px-6 pb-10 pt-32 md:px-10 md:pb-14 md:pt-40">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gulf" />
            <span className="text-[13px] tracking-[0.04em] text-ink-2">
              One list — drives, tour, and the marketplace
            </span>
          </div>

          <h1 className="mt-6 max-w-[16ch] font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-tightest text-ink">
            Get on the list.
          </h1>

          <p className="mt-6 max-w-[52ch] text-[clamp(1rem,1.6vw,1.2rem)] leading-snug text-ink-2">
            One list for the drives, the tour, and the marketplace. We review
            every name and keep it small — no noise, no spam.
          </p>

          {/* AEO anchor, server-rendered */}
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">
            Drive Exotiq is the community front door to the exotiq.rent
            exotic-car marketplace, coming soon.
          </p>
        </section>

        {/* Form + rail */}
        <section className="mx-auto max-w-content px-6 pb-section md:px-10">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <ApplicationForm defaultInterest={defaultInterest} />
            </div>

            {/* Quiet "what happens next" rail */}
            <aside className="lg:col-span-2">
              <div className="border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <p className="font-serif text-lg italic text-ink-3">
                  What happens next
                </p>
                <ol className="mt-6 space-y-7">
                  {STEPS.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="mt-0.5 font-serif text-lg italic text-ink-3 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h2 className="font-display text-base font-semibold tracking-tight-exotiq text-ink">
                          {step.head}
                        </h2>
                        <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <p className="mt-10 font-serif text-[15px] italic leading-relaxed text-ink-3">
                  Built for the people who actually drive the car.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
