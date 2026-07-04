import type { Metadata } from 'next';
import ExperienceScroll from '@/components/experience/ExperienceScroll';
import { FRAMES } from '@/components/experience/frames';

const DESCRIPTION =
  'Scroll the car out of the dark and down the road — the Drive Exotiq experience, from the garage to the Denver→Miami tour.';

export const metadata: Metadata = {
  title: 'The Drive',
  description: DESCRIPTION,
  alternates: { canonical: '/experience' },
  // Explicit per-page social card — metadata inheritance would otherwise ship
  // the homepage's og:url and generic card for shares of the film.
  openGraph: {
    title: 'The Drive — Drive Exotiq',
    description: DESCRIPTION,
    url: '/experience',
    siteName: 'Drive Exotiq',
    type: 'website',
    images: [{ url: '/og-experience.jpg', width: 1200, height: 630, alt: 'The wrapped S8 at dusk — the Drive Exotiq tour' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Drive — Drive Exotiq',
    description: DESCRIPTION,
    images: ['/og-experience.jpg'],
  },
};

// Structured data for the film page (audit item: JSON-LD). One truthful
// VideoObject — the hero loop that actually streams from R2 — under a WebPage
// node; the scroll film itself is an interaction, not a watchable video file.
const SITE = 'https://driveexotiq.com';
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'The Drive — Drive Exotiq',
  url: `${SITE}/experience`,
  description: DESCRIPTION,
  primaryImageOfPage: { '@type': 'ImageObject', contentUrl: `${SITE}/og-experience.jpg`, width: 1200, height: 630 },
  isPartOf: { '@type': 'WebSite', name: 'Drive Exotiq', url: SITE },
  video: {
    '@type': 'VideoObject',
    name: 'Drive Exotiq — the cold open',
    description: 'The opening scene of the Drive Exotiq scroll film: the garage at dusk, breathing.',
    contentUrl: 'https://media.driveexotiq.com/videos/sb-01.mp4',
    thumbnailUrl: `${SITE}/images/experience/poster/sb-01.jpg`,
    uploadDate: '2026-07-03',
    duration: 'PT10S',
  },
};

/**
 * The cinematic scroll landing (poster-first, no WebGL). The visible experience
 * is a client scroll island; a server-rendered, crawlable spine + the verbatim
 * AEO anchor sit beneath it for SEO, no-JS, and screen-reader users.
 */
export default function ExperiencePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <a
        href="#experience-end"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-sm focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Skip the film
      </a>
      <div className="sr-only">
        <h1>Drive Exotiq — the drive</h1>
        <p>Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace.</p>
        <ol>
          {FRAMES.map((f) => (
            <li key={f.id}>{[f.kicker, f.headline, f.jewel, f.body, f.aria].filter(Boolean).join(' — ')}</li>
          ))}
        </ol>
      </div>
      <ExperienceScroll />
    </main>
  );
}
