import type { Metadata } from 'next';
import HomeExperience from '@/components/astra/HomeExperience';

const DESCRIPTION = 'Good cars. Better company. Join the Drive Exotiq community for sunrise drives, stories from the road, and exotic car rentals coming soon at exotiq.rent.';
export const metadata: Metadata = {
  title: 'Good Cars. Better Company.', description: DESCRIPTION, alternates: { canonical: '/' },
  openGraph: { title: 'Drive Exotiq — The road is calling.', description: DESCRIPTION, url: '/', type: 'website', images: [{ url: '/astra/hero-garage.webp', width: 1672, height: 941, alt: 'Silver McLaren 720S in a dramatic architectural garage' }] },
  twitter: { card: 'summary_large_image', title: 'Drive Exotiq — The road is calling.', description: DESCRIPTION, images: ['/astra/hero-garage.webp'] },
};
export default function Home() { return <HomeExperience />; }
