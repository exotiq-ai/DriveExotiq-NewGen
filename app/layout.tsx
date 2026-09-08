import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import "./astra.css";
import "./astra-home.css";
import "./astra-pages.css";
import "./astra-garage.css";
import "./astra-story.css";
import "./astra-motion.css";
import AnalyticsListener from "@/components/AnalyticsListener";
import CookieConsent from "@/components/CookieConsent";
import { isPreview } from "@/lib/preview";

// Drive Exotiq type system (self-hosted, no build-time network fetch):
// Bricolage Grotesque (display) · Schibsted Grotesk (UI/body) · Spectral (serif voice).
const display = localFont({
  src: "./fonts/bricolage-variable.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "400 800",
});
const sans = localFont({
  src: "./fonts/schibsted-variable.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "400 700",
});
const serif = localFont({
  src: [
    { path: "./fonts/spectral-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/spectral-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  preload: true,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://driveexotiq.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Drive Exotiq: Built for People Who Drive the Car",
    template: "%s · Drive Exotiq",
  },
  description:
    "Good cars. Better company. Discover sunrise drives, stories from the road, and the next chapter of the exotiq.rent exotic-car marketplace.",
  keywords: [
    "exotic cars",
    "supercar community",
    "Cars and Coffee",
    "exotic car rental",
    "exotic car tour",
    "Denver",
    "Dallas",
    "Austin",
    "Houston",
    "Atlanta",
    "Miami",
    "exotiq.rent",
  ],
  authors: [{ name: "Drive Exotiq" }],
  // No global canonical: it told search engines every page without its own
  // override (all five legal pages) was a duplicate of the homepage (QA P1
  // 2026-07-06). The homepage sets canonical "/" in app/page.tsx; every other
  // indexable page declares its own.
  robots: {
    index: !isPreview,
    follow: !isPreview,
    googleBot: { index: !isPreview, follow: !isPreview, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "android-chrome", url: "/android-chrome-192x192.png", sizes: "192x192" },
      { rel: "android-chrome", url: "/android-chrome-512x512.png", sizes: "512x512" },
    ],
  },
  openGraph: {
    title: "Drive Exotiq: Built for People Who Drive the Car",
    description:
      "Good cars. Better company. Sunrise drives, real road stories, and a community built around the journey.",
    url: SITE_URL,
    siteName: "Drive Exotiq",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/astra/hero-garage.webp",
        width: 1672,
        height: 941,
        alt: "Drive Exotiq: Exotic Cars That Actually Get Driven",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drive Exotiq: Built for People Who Drive the Car",
    description:
      "Good cars. Better company. Sunrise drives, real road stories, and a community built around the journey.",
    images: ["/astra/hero-garage.webp"],
    creator: "@driveexotiq",
    site: "@driveexotiq",
  },
};

// Site-wide Organization entity (JSON-LD). description = the verbatim AEO
// anchor. sameAs carries only handles the repo already declares (@driveexotiq
// in the Twitter card metadata above) — add socials here as Gregory supplies
// them; never ship an empty array.
const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Drive Exotiq',
  url: SITE_URL,
  logo: `${SITE_URL}/android-chrome-512x512.png`,
  description: 'Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace.',
  parentOrganization: { '@type': 'Organization', name: 'Exotiq Inc.' },
  sameAs: [
    'https://x.com/driveexotiq',
    'https://www.instagram.com/driveexotiq',
    'https://www.youtube.com/@driveexotiq',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${serif.variable}`}
    >
      <body className="font-sans bg-canvas text-ink antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }} />
        {/* Plausible — privacy-first, cookieless (no consent gate). Prod only so
            local/preview traffic never pollutes stats. This is the account's
            site-keyed tracker from the dashboard (2026-07-07 signup) — the
            pa-*.js URL is generated for driveexotiq.com, so no data-domain
            attribute. The inline shim is Plausible's own: it queues pageviews
            AND custom events (CTA / Film Depth / Signup via lib/analytics.ts)
            fired before the script loads; outboundLinks kept from the old
            script.outbound-links.js setup. Goals live in the dashboard. */}
        {process.env.NODE_ENV === 'production' && !isPreview && (
          <>
            <Script id="plausible-shim" strategy="beforeInteractive">
              {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init({outboundLinks:true})`}
            </Script>
            <Script
              async
              src="https://plausible.io/js/pa-T2DyFOm6ZJ33t6XEg4dFa.js"
              strategy="afterInteractive"
            />
          </>
        )}
        <AnalyticsListener />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
