import type { Metadata } from 'next';
import PillarShell from '@/components/sections/PillarShell';

export const metadata: Metadata = {
  title: 'The Community',
  description:
    'Founders, lifers, and first-timers who think exotic cars are wasted standing still. No garage audit, no flex tax — come for the machines, stay for the people. Get on the list.',
  alternates: { canonical: '/community' },
};

export default function CommunityPage() {
  return (
    <PillarShell
      eyebrow="The Community"
      title="The car gets you in. The people are why you stay."
      sub="Founders who build between drives, lifers who know the spec sheets cold, and newcomers on their first real ride — same group chat, same lot, same Sunday."
      cta={{ label: 'Get on the list', href: '/apply' }}
      whatsComing={[
        'The origin story — why we start them at sunrise',
        'Member portraits',
        'The ecosystem: Drive Exotiq → exotiq.rent → exotiq.ai',
      ]}
    />
  );
}
