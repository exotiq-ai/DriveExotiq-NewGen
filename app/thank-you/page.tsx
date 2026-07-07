import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { normalizeApplyInterest, Interest } from '@/lib/interest';

export const metadata: Metadata = {
  title: 'You’re on the list',
  description: 'Thanks for getting on the Drive Exotiq list. We review every name personally.',
  robots: { index: false, follow: false },
};

type Cta = { label: string; href: string };
type Branch = { head: string; body: string; primary: Cta; secondary: Cta };

function copyFor(interest: Interest): Branch {
  switch (interest) {
    case 'title-wrap':
    case 'tour':
    case 'drive':
    case 'partnership':
      return {
        head: 'Got it.',
        body: 'We’ve got your note. A real person reads every one, and we’ll be in touch within a couple of days. This is a small operation.',
        primary: { label: 'Ride the tour', href: '/tour' },
        secondary: { label: 'See the wrap opportunity', href: '/sponsor' },
      };
    case 'drives':
      return {
        head: 'You’re on the list.',
        body: 'We review every name personally. When a drive fits your city, your invite and the meet point land in your inbox a few days ahead.',
        primary: { label: 'Enter the drives', href: '/drives' },
        secondary: { label: 'Read the stories', href: '/blog' },
      };
    case 'access':
      return {
        head: 'You’re on the list.',
        body: 'You’ll hear from us before anyone else gets the keys to exotiq.rent, and when a drive rolls through your city.',
        primary: { label: 'What’s coming', href: '/marketplace' },
        secondary: { label: 'Read the stories', href: '/blog' },
      };
    default:
      return {
        head: 'You’re on the list.',
        body: 'We review every name personally. When a drive fits your city, or the tour rolls through, you’ll be among the first to know.',
        primary: { label: 'Enter the drives', href: '/drives' },
        secondary: { label: 'Read the stories', href: '/blog' },
      };
  }
}

export default function ThankYouPage({
  searchParams,
}: {
  searchParams?: { interest?: string };
}) {
  const interest = normalizeApplyInterest(searchParams?.interest);
  const { head, body, primary, secondary } = copyFor(interest);

  return (
    <>
      <Header />
      <main id="main" className="bg-canvas">
        <section className="mx-auto flex min-h-[70vh] max-w-content flex-col items-center justify-center px-6 py-section text-center md:px-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gulf" />
            <span className="text-[13px] tracking-[0.04em] text-ink-2">Confirmed</span>
            <span className="h-px w-8 bg-gulf" />
          </div>

          <h1 className="mt-7 max-w-[18ch] font-display text-[clamp(2.4rem,7vw,4.5rem)] font-semibold leading-[0.98] tracking-tightest text-ink">
            {head}
          </h1>

          <p className="mt-6 max-w-[46ch] text-[clamp(1rem,1.6vw,1.2rem)] leading-snug text-ink-2">
            {body}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={primary.href}
              className="inline-flex min-h-[52px] items-center justify-center rounded-sm bg-gulf px-7 py-3.5 text-[17px] font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
            >
              {primary.label}
            </Link>
            <Link
              href={secondary.href}
              className="inline-flex min-h-[52px] items-center justify-center rounded-sm border border-line-2 px-7 py-3.5 text-[17px] font-semibold text-ink transition-colors duration-250 ease-de hover:border-ink-3 hover:bg-white/[0.03]"
            >
              {secondary.label}
            </Link>
          </div>

          <a
            href="https://www.instagram.com/driveexotiq/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 text-[14px] text-ink-3 transition-colors hover:text-gulf"
          >
            Follow @driveexotiq
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
