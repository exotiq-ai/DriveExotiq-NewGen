import type { Metadata } from 'next';
import PillarShell from '@/components/sections/PillarShell';

export const metadata: Metadata = {
  title: 'Stories — American Exotic-Car Culture',
  description:
    'The field journal of American exotic-car culture: the drives, the cities, the cars, and the people building the marketplace behind it. Useful first, optimized second.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  return (
    <PillarShell
      eyebrow="Stories"
      title="Field notes from American exotic-car culture."
      sub="The drives, the cities, the cars, and the people building the marketplace behind it — written for the people who actually show up."
      cta={{ label: 'Get on the list', href: '/apply' }}
      whatsComing={[
        'The Stories index',
        'A reading experience with a gulf reading-progress rail',
        'BlogPosting JSON-LD for search + AI answers',
        'Six launch articles',
      ]}
    />
  );
}
