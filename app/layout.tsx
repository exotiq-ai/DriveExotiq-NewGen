import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import SmoothScroll from "@/components/providers/SmoothScroll";

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
    { path: "./fonts/spectral-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/spectral-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});

const SITE_URL = "https://driveexotiq.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Drive Exotiq — Built for People Who Drive the Car",
    template: "%s · Drive Exotiq",
  },
  description:
    "The community front door to the exotiq.rent exotic-car marketplace. Invite-only sunrise drives, the Denver→Miami tour, and what's coming.",
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
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
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
    title: "Drive Exotiq — Built for People Who Drive the Car",
    description:
      "The community front door to the exotiq.rent exotic-car marketplace. Monthly sunrise drives, the Denver→Miami tour, and what's coming next.",
    url: SITE_URL,
    siteName: "Drive Exotiq",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Drive Exotiq — Exotic Cars That Actually Get Driven",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drive Exotiq — Built for People Who Drive the Car",
    description:
      "The community front door to the exotiq.rent exotic-car marketplace. Invite-only sunrise drives and the Denver→Miami tour.",
    images: ["/og-image.png"],
    creator: "@driveexotiq",
    site: "@driveexotiq",
  },
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
        <SmoothScroll>{children}</SmoothScroll>
        <CookieConsent />
      </body>
    </html>
  );
}
