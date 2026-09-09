import Link from 'next/link';
import Emblem from '@/components/ui/Emblem';
import CookieSettingsButton from '@/components/CookieSettingsButton';

const EXPLORE = [
  { label: 'The Drives', href: '/drives' },
  { label: 'The Tour', href: '/tour' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Stories', href: '/blog' },
  { label: 'Sponsor', href: '/sponsor' },
];

const ECOSYSTEM = [
  { label: 'exotiq.rent · Marketplace (soon)', href: '/marketplace' },
  { label: 'exotiq.ai · For operators', href: 'https://exotiq.ai' },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto max-w-content px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 text-ink">
              <Emblem className="h-6 w-auto" />
              <span className="font-display text-lg font-bold tracking-tight-exotiq">
                Drive Exotiq
              </span>
            </div>
            <p className="mt-5 max-w-sm font-serif text-lg italic leading-snug text-ink-2">
              An Exotiq Inc. brand. The community front door to exotiq.rent.
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Explore">
            <h3 className="text-[13px] text-ink-3">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] text-ink-2 transition-colors duration-250 hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Ecosystem */}
          <nav aria-label="Ecosystem">
            <h3 className="text-[13px] text-ink-3">Ecosystem</h3>
            <ul className="mt-4 space-y-2.5">
              {ECOSYSTEM.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[15px] text-ink-2 transition-colors duration-250 hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-lg italic text-ink">
            Built for the people who actually drive the car.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-3">
            <span>© {new Date().getFullYear()} Exotiq Inc. All rights reserved.</span>
            <Link href="/privacy" className="transition-colors hover:text-ink-2">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-ink-2">Terms</Link>
            <Link href="/cookies" className="transition-colors hover:text-ink-2">Cookies</Link>
            <Link href="/sms" className="transition-colors hover:text-ink-2">SMS</Link>
            <Link href="/dmca" className="transition-colors hover:text-ink-2">DMCA</Link>
            <CookieSettingsButton className="transition-colors hover:text-ink-2" />
          </div>
        </div>
      </div>
    </footer>
  );
}
