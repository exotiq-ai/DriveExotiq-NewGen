import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank You | Drive Exotiq',
  description: 'Thank you for applying to Drive Exotiq. We\'ll review your application within 24-48 hours.',
};

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <div className="min-h-screen bg-deep-black flex items-center justify-center px-6 py-24">
          <div className="max-w-2xl text-center">
            {/* Checkmark Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto bg-gulf-blue/10 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gulf-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-h1 text-pure-white mb-6">
              You're On The List
            </h1>

            {/* Body */}
            <p className="text-body text-metallic-silver mb-8">
              We'll review your application and be in touch within 24-48 hours.
            </p>

            {/* Social */}
            <div className="mb-12">
              <p className="text-body text-pure-white mb-4">
                In the meantime, follow us:
              </p>
              <a
                href="https://www.instagram.com/driveexotiq/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gulf-blue hover:text-gulf-blue/80 transition-colors text-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @driveexotiq
              </a>
            </div>

            {/* Back to Home */}
            <Link href="/">
              <Button variant="outline" size="lg" className="inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
