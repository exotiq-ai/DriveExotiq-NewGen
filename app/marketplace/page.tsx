import type { Metadata } from 'next';
import PillarShell from '@/components/sections/PillarShell';

export const metadata: Metadata = {
  title: 'exotiq.rent — The Marketplace, Coming Soon',
  description:
    'Renting an exotic is next. exotiq.rent is the marketplace that puts something extraordinary in your driveway — for a weekend, a morning, or the day you’ve been saving for. Join the waitlist.',
  alternates: { canonical: '/marketplace' },
};

export default function MarketplacePage() {
  return (
    <PillarShell
      eyebrow="exotiq.rent"
      title="Renting them is next."
      sub="We’re building the marketplace that puts something extraordinary in your driveway — for a weekend, a morning, or the day you’ve been saving for. Coming soon."
      cta={{ label: 'Join the waitlist', href: '/apply' }}
      whatsComing={[
        'The exotiq.rent teaser',
        'Waitlist capture — first through the door',
        'Early-access for the Drive Exotiq community',
      ]}
    />
  );
}
