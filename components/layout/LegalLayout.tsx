import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface LegalLayoutProps {
  children: React.ReactNode;
  entity?: string;
  title: string;
  subtitle?: string;
  effectiveDate?: string;
  lastUpdated?: string;
}

const LEGAL_NAV_LINKS = [
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookies', label: 'Cookie Policy' },
  { href: '/sms', label: 'SMS Policy' },
  { href: '/dmca', label: 'DMCA' },
];

export default function LegalLayout({
  children,
  entity = 'Exotiq Inc. dba Drive Exotiq — a Delaware C-Corporation',
  title,
  subtitle,
  effectiveDate = 'January 1, 2026',
  lastUpdated = 'March 2026',
}: LegalLayoutProps) {
  return (
    <>
      <Header />
      <main id="main" className="bg-canvas">
        <article className="mx-auto max-w-3xl px-6 pb-section pt-32 md:pt-40">
          {/* Document header */}
          <p className="text-[12px] tracking-[0.04em] text-ink-3">{entity}</p>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-tightest text-ink">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-[52ch] font-serif text-[clamp(1.1rem,2vw,1.4rem)] italic leading-snug text-ink-2">
              {subtitle}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3 text-[13px] text-ink-3">
            <span>Effective {effectiveDate}</span>
            <span aria-hidden="true">·</span>
            <span>Updated {lastUpdated}</span>
          </div>

          <div className="hairline my-10" />

          {/* Body */}
          <div className="legal-prose">{children}</div>

          {/* Cross-policy nav */}
          <nav
            aria-label="Legal"
            className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-8 text-[14px] text-ink-2"
          >
            {LEGAL_NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-gulf">
                {link.label}
              </Link>
            ))}
          </nav>
        </article>
      </main>
      <Footer />
    </>
  );
}
