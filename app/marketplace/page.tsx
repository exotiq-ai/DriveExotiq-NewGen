import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WaitlistForm from '@/components/forms/WaitlistForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'exotiq.rent · Coming soon',
  description:
    'exotiq.rent is the exotic-car rental marketplace, coming soon. Drive Exotiq is its community front door. Join the waitlist.',
  alternates: { canonical: '/marketplace' },
};

// When the product screenshot arrives, set this to its path (e.g.
// '/images/app/exotiq-rent-preview.png'). Until then the frame shows the
// dusk placeholder. Nothing else changes.
const PREVIEW_SRC: string | null = '/images/app/exotiq-rent-preview.png';

const PROMISES = [
  'A curated marketplace, not a parking lot.',
  'Cars from people who drive them.',
  'Built by the people behind the drives.',
];

export default function MarketplacePage() {
  return (
    <>
      <Header />
      <main id="main" className="bg-canvas">
        {/* Hero */}
        <section className="mx-auto max-w-content px-6 pb-12 pt-32 md:px-10 md:pb-16 md:pt-40">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gulf" />
            <span className="text-[13px] tracking-[0.04em] text-ink-2">Coming soon</span>
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5rem)] font-semibold leading-[0.98] tracking-tightest text-ink">
            exotiq.rent
          </h1>

          <p className="mt-6 max-w-[44ch] text-[clamp(1.05rem,1.8vw,1.35rem)] leading-snug text-ink-2">
            The exotic-car rental marketplace, built for people who actually drive.
          </p>

          <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-ink-2">
            Drive Exotiq is the community front door. exotiq.rent is the marketplace
            it opens onto. Coming soon.
          </p>
        </section>

        {/* Product frame — dusk backdrop + MacBook presentation; screenshot is the display */}
        <section className="relative overflow-hidden border-y border-line">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 0%, rgba(255,90,31,0.10), transparent 55%), radial-gradient(90% 80% at 80% 100%, rgba(108,189,230,0.08), transparent 60%)',
            }}
          />
          <div className="relative mx-auto max-w-content px-6 py-section md:px-10">
            <div className="relative mx-auto max-w-3xl">
              {/* Floor shadow — grounds the machine on the stage */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-6 left-1/2 h-10 w-[88%] -translate-x-1/2"
                style={{
                  background:
                    'radial-gradient(50% 55% at 50% 35%, rgba(0,0,0,0.5), transparent 72%)',
                }}
              />

              {/* Display lid — graphite aluminum bezel */}
              <div className="relative mx-auto w-[92%] rounded-t-xl rounded-b-[4px] border border-[#2b2b2e] bg-[#1a1a1c] p-[5px] md:p-[6px]">
                {/* Near-black screen border */}
                <div className="rounded-t-[9px] rounded-b-[2px] bg-[#050506] p-[5px] md:p-[7px]">
                  {/* Screenshot slot */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-canvas">
                    {PREVIEW_SRC ? (
                      <Image
                        src={PREVIEW_SRC}
                        alt="A preview of the exotiq.rent marketplace, the exotic-car rental grid"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 768px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-serif text-[clamp(1rem,2.5vw,1.4rem)] italic text-ink-3">
                          Coming soon at exotiq.rent
                        </span>
                      </div>
                    )}
                    {/* Camera notch */}
                    <div
                      aria-hidden="true"
                      className="absolute left-1/2 top-0 z-10 h-[9px] w-[64px] -translate-x-1/2 rounded-b-[5px] bg-[#050506] md:h-[11px] md:w-[84px]"
                    />
                  </div>
                </div>
              </div>

              {/* Base deck — slightly wider than the display */}
              <div className="relative h-[10px] w-full rounded-t-[2px] rounded-b-[10px] bg-gradient-to-b from-[#303034] via-[#1a1a1c] to-[#0f0f10] md:h-[13px]">
                {/* Thumb scoop */}
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 h-[5px] w-[11%] -translate-x-1/2 rounded-b-[8px] bg-[#0c0c0e] md:h-[6px]"
                />
              </div>
            </div>

            <p className="mt-10 text-center text-[13px] text-ink-3">
              A first look at exotiq.rent. Booking opens with the fleet.
            </p>
          </div>
        </section>

        {/* What's coming */}
        <section className="border-b border-line">
          <div className="mx-auto max-w-content px-6 py-section md:px-10">
            <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3">
              {PROMISES.map((promise, i) => (
                <div key={i} className="bg-canvas px-6 py-8 md:px-7 md:py-10">
                  <span className="font-serif text-lg italic text-ink-3 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-4 text-[15px] leading-snug text-ink-2">{promise}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Waitlist */}
        <section className="mx-auto max-w-content px-6 py-section md:px-10">
          <div className="max-w-[42ch]">
            <p className="font-serif text-lg italic text-ink-3">The waitlist</p>
            <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.02] tracking-tightest text-ink">
              Be first when the keys drop.
            </h2>
          </div>

          <div className="mt-8 max-w-[46rem]">
            <WaitlistForm />
          </div>

          <p className="mt-8 max-w-[52ch] text-[13px] leading-relaxed text-ink-3">
            Drive Exotiq is the front door; exotiq.rent is the marketplace. Separate from
            any existing booking. This is the new thing, built fresh.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
