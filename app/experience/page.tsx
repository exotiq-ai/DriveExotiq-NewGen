import type { Metadata } from 'next';
import ExperienceScroll from '@/components/experience/ExperienceScroll';
import { FRAMES } from '@/components/experience/frames';

export const metadata: Metadata = {
  title: 'The Drive',
  description:
    'Scroll the car out of the dark and down the road — the Drive Exotiq experience, from the garage to the Denver→Miami tour.',
  alternates: { canonical: '/experience' },
};

/**
 * The cinematic scroll landing (poster-first, no WebGL). The visible experience
 * is a client scroll island; a server-rendered, crawlable spine + the verbatim
 * AEO anchor sit beneath it for SEO, no-JS, and screen-reader users.
 */
export default function ExperiencePage() {
  return (
    <main>
      <div className="sr-only">
        <h1>Drive Exotiq — the drive</h1>
        <p>Drive Exotiq is the community front door to the exotiq.rent exotic-car marketplace.</p>
        <ol>
          {FRAMES.map((f) => (
            <li key={f.id}>{[f.kicker, f.headline, f.jewel, f.body].filter(Boolean).join(' — ')}</li>
          ))}
        </ol>
      </div>
      <ExperienceScroll />
    </main>
  );
}
