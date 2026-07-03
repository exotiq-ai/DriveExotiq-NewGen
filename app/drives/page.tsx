import type { Metadata } from 'next';
import PillarShell from '@/components/sections/PillarShell';

export const metadata: Metadata = {
  title: 'Monthly Drives — Invite-Only Sunrise Drives + Cars & Coffee',
  description:
    'The last Sunday morning of every month: an invite-only exotic-car sunrise drive followed by a curated Cars & Coffee. Founders, lifers, and first-timers. Request your invite.',
  alternates: { canonical: '/drives' },
};

export default function DrivesPage() {
  return (
    <PillarShell
      eyebrow="Monthly Drives"
      title="The last Sunday morning is spoken for."
      sub="Invite-only sunrise drives, followed by a curated Cars & Coffee. Founders, lifers, and first-timers — same route, same coffee, hoods up."
      cta={{ label: 'Get on the list', href: '/apply' }}
      whatsComing={[
        'A next-drive card with the live date',
        'Upcoming + past events — AI-updatable on the go via Airtable',
        'RSVP / invite capture',
        'Recaps and galleries from past mornings',
      ]}
    />
  );
}
