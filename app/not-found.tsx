import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Emblem from '@/components/ui/Emblem';

export const metadata: Metadata = {
  title: 'Wrong turn · Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
        <Emblem className="mb-8 h-7 w-auto text-line-2" />
        <p className="idx mb-4 text-xl">404</p>
        <h1 className="mb-4 font-display text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight-exotiq text-ink">
          This road doesn&rsquo;t exist.
        </h1>
        <p className="serif mb-10 max-w-prose font-serif text-lg italic text-ink-2">
          You took an exit that isn&rsquo;t on the map. Let&rsquo;s get you back to
          where the engines are running.
        </p>
        <Link
          href="/"
          className="rounded-sm bg-gulf px-6 py-3 font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
        >
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
