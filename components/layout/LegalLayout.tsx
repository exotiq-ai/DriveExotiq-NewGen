'use client';

import Link from 'next/link';
import Logo from '@/components/ui/Logo';

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
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-deep-black border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="text-metallic-silver hover:text-pure-white transition-colors text-sm"
          >
            Back to Site
          </Link>
        </nav>
      </header>

      {/* Legal Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        {/* Document Header */}
        <div className="mb-10 pb-8 border-b border-gray-200">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
            {entity}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-gray-500 mt-2">{subtitle}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
            <span>Effective: {effectiveDate}</span>
            <span className="text-gray-300">|</span>
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Document Body — prose styling via Tailwind classes */}
        <article className="legal-prose text-gray-700 leading-relaxed">
          {children}
        </article>
      </main>

      {/* Legal Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-10">
          {/* Legal page links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
            {LEGAL_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-500 hover:text-gulf-blue transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
              className="text-sm text-gray-500 hover:text-gulf-blue transition-colors"
            >
              Cookie Settings
            </button>
          </nav>

          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-xs text-gray-400">
              &copy; {year} Exotiq Inc. dba Drive Exotiq. All rights reserved.
            </p>
            <Link
              href="/"
              className="text-xs text-gulf-blue hover:text-gulf-blue/80 transition-colors"
            >
              driveexotiq.com
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
