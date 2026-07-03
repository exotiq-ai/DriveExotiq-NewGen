import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface PillarShellProps {
  eyebrow: string;
  title: string;
  sub: string;
  cta?: { label: string; href: string };
  whatsComing?: string[];
}

/**
 * On-brand scaffold for a pillar page while its full cinematic experience is
 * built out. Real RSC content (crawlable, metadata-backed) — not a "coming soon"
 * dead end. Gets swapped for the page's signature experience per BUILD-SPEC §5.
 */
export default function PillarShell({ eyebrow, title, sub, cta, whatsComing }: PillarShellProps) {
  return (
    <>
      <Header />
      <main className="mx-auto min-h-[82vh] max-w-content px-6 pb-section pt-40 md:px-10">
        <p className="font-serif text-lg italic text-ink-3">{eyebrow}</p>
        <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-tightest text-ink">
          {title}
        </h1>
        <p className="mt-6 max-w-[54ch] font-serif text-[clamp(1.15rem,2vw,1.5rem)] italic leading-snug text-ink-2">
          {sub}
        </p>
        {cta && (
          <Link
            href={cta.href}
            className="mt-9 inline-flex items-center justify-center rounded-sm bg-gulf px-7 py-3.5 font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
          >
            {cta.label}
          </Link>
        )}
        {whatsComing && whatsComing.length > 0 && (
          <div className="mt-16">
            <div className="hairline mb-6 max-w-[16rem]" />
            <p className="text-[13px] text-ink-3">The full experience is being built — what&rsquo;s coming:</p>
            <ul className="mt-4 space-y-2.5">
              {whatsComing.map((w) => (
                <li key={w} className="flex items-start gap-3 text-ink-2">
                  <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 bg-jewel" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
