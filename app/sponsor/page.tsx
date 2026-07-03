import type { Metadata } from 'next';
import PillarShell from '@/components/sections/PillarShell';

export const metadata: Metadata = {
  title: 'Sponsor the Exotic Tour',
  description:
    'Wrap your brand on the one car a whole city stops to photograph. Title, Wrap, and Stop sponsorships across a Denver-to-Miami tour — ten markets, 5,000 miles of content. Request the deck.',
  alternates: { canonical: '/sponsor' },
};

export default function SponsorPage() {
  return (
    <PillarShell
      eyebrow="Partner with Drive Exotiq"
      title="Wrap your brand on the one car a whole city stops to photograph."
      sub="One wrapped Audi S8, ten markets, 5,000 miles of content. Sponsors don’t buy a logo — they buy top billing on the thing everyone’s pointing a phone at."
      cta={{ label: 'Request the sponsor deck', href: '/apply' }}
      whatsComing={[
        'The wrap canvas — see your livery on the actual car',
        'The route rendered as a media-value map (markets × reach)',
        'Title / Wrap / Stop tiers',
        'An inquiry form that routes straight to you',
      ]}
    />
  );
}
