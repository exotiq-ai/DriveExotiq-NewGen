import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Owned footage still — graded warm, not over-darkened */}
      <Image
        src="/images/cars/R8-telluride.jpg"
        alt="An exotic on an open mountain road at dawn"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Directional scrim — legible text, image stays alive */}
      <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/70 to-canvas/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/60 to-transparent" />

      {/* Content — lower-left editorial */}
      <div className="relative z-10 mx-auto w-full max-w-content px-6 pb-20 pt-32 md:px-10 md:pb-28">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-jewel" />
          <span className="text-[13px] tracking-wide text-ink-2">
            Invite-only · Denver-born · exotic cars that actually get driven
          </span>
        </div>

        <h1 className="mt-6 max-w-[16ch] font-display text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[0.98] tracking-tightest text-ink">
          The supercars you only see parked? We start them at sunrise.
        </h1>

        <p className="mt-7 max-w-[52ch] font-serif text-[clamp(1.15rem,2.2vw,1.6rem)] italic leading-snug text-ink-2">
          A community for people who&rsquo;d rather run an exotic past redline at
          6 a.m. than rope it off and photograph it. Monthly drives, a coast-to-coast
          tour, and the front door to the exotiq.rent marketplace.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center rounded-sm bg-gulf px-7 py-3.5 text-[16px] font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
          >
            Get on the list
          </Link>
          <Link
            href="/tour"
            className="inline-flex items-center justify-center rounded-sm border border-line-2 px-7 py-3.5 text-[16px] font-semibold text-ink transition-colors duration-250 ease-de hover:border-ink-3 hover:bg-white/[0.03]"
          >
            Follow the tour
          </Link>
        </div>

        {/* Facts hairline row — jewel separators */}
        <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-5 text-[15px] text-ink-2">
          <span>Last Sunday mornings</span>
          <span className="text-jewel">/</span>
          <span>Denver → Miami tour, 2026</span>
          <span className="text-jewel">/</span>
          <span>
            exotiq.rent <span className="text-ink-3">— coming soon</span>
          </span>
        </div>
      </div>
    </section>
  );
}
