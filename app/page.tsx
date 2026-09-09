import type { Metadata } from "next";
import HomeExperience from "@/components/home/HomeExperience";

const DESCRIPTION =
  "Good cars. Better company. Join the Drive Exotiq community for sunrise drives, stories from the road, and exotic car rentals coming soon at exotiq.rent.";
export const metadata: Metadata = {
  title: "Good Cars. Better Company.",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Drive Exotiq — The road is calling.",
    description: DESCRIPTION,
    url: "/",
    type: "website",
    images: [
      {
        url: "/media/v2/hero-og.jpg",
        width: 1200,
        height: 630,
        alt: "Gulf racing blue McLaren 720S in a dramatic architectural garage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drive Exotiq — The road is calling.",
    description: DESCRIPTION,
    images: ["/media/v2/hero-og.jpg"],
  },
};
export default function Home() {
  return <HomeExperience />;
}
