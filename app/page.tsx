import type { Metadata } from 'next';
import ExperienceScroll from '@/components/experience/ExperienceScroll';
import { FRAMES } from '@/components/experience/frames';

// Keyword-forward but honest (≤155 ch; rentals always "coming soon"). One
// DESCRIPTION const so search snippets and social shares pitch the same film.
const DESCRIPTION =
  'Exotic car rentals coming soon at exotiq.rent — McLaren, Porsche, Lamborghini. Invite-only drives, monthly Cars & Coffee, and the Denver→Miami tour.';

export const metadata: Metadata = {
  // ≤60 with the "· Drive Exotiq" template suffix (brief law).
  title: 'Exotic Car Rentals & Curated Drives',
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Drive Exotiq — built for the people who actually drive the car',
    description: DESCRIPTION,
    url: '/',
    siteName: 'Drive Exotiq',
    type: 'website',
    images: [{ url: '/og-experience.jpg', width: 1200, height: 630, alt: 'The wrapped S8 at dusk — the Drive Exotiq tour' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drive Exotiq — built for the people who actually drive the car',
    description: DESCRIPTION,
    images: ['/og-experience.jpg'],
  },
};

// Structured data for the home film. One truthful VideoObject — the hero loop
// that actually streams from R2 — under a WebPage node; the scroll film itself
// is an interaction, not a watchable video file.
const SITE = 'https://driveexotiq.com';
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Drive Exotiq — built for the people who actually drive the car',
  url: SITE,
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
 * HOME — the cinematic scroll landing (poster-first, no WebGL). The visible
 * experience is a client scroll island; a server-rendered, crawlable spine +
 * the verbatim AEO anchor sit beneath it for SEO, no-JS, and screen-reader
 * users. The film carries its own chrome (StageChrome) and end-card nav, so it
 * does not render the global Header/Footer.
 */
export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <a
        href="#experience-end"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-sm focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Skip the film
      </a>
      {/* The spine stays FILM-EQUIVALENT (every hidden word has a visible
          counterpart on the page) — the keyword freight lives in the visible
          end-card pillars, where Google actually weights it. */}
      <div className="sr-only">
        <h1>Drive Exotiq — built for the people who actually drive the car</h1>
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
