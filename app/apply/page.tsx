import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ApplicationForm from '@/components/forms/ApplicationForm';
import { normalizeApplyInterest } from '@/lib/interest';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Get on the list',
  description: 'Find your people. Join the list for Drive Exotiq sunrise drives and the upcoming exotiq.rent marketplace.',
  alternates: { canonical: '/apply' },
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams?: Promise<{ interest?: string }>;
}) {
  const query = await searchParams;
  const defaultInterest = normalizeApplyInterest(query?.interest ?? 'drives');
  if (defaultInterest === 'title-wrap') {
    const raw = query?.interest;
    redirect(raw ? `/sponsor?interest=${encodeURIComponent(raw)}` : '/sponsor');
  }
  return (
    <>
      <Header />
      <main id="main-content" className="astra-form-layout">
        <section className="astra-form-story" aria-labelledby="apply-title">
          <Image src="/astra/s8-alpine-drive.webp" alt="An Audi S8 on a winding mountain road" fill priority fetchPriority="high" sizes="(max-width: 900px) 100vw, 50vw" className="astra-form-story-image" />
          <div className="astra-form-story-copy">
            <span className="astra-eyebrow">THE BEST PART IS WHO YOU MEET.</span>
            <h1 id="apply-title">Find your<br /><em>people.</em></h1>
            <p>Early starts. Open roads. Conversations that last longer than the drive. There’s a place for you here.</p>
          </div>
        </section>
        <section className="astra-form-panel" aria-labelledby="form-title">
          <span className="astra-eyebrow"><span className="astra-live-dot" />YOUR NEXT CHAPTER</span>
          <h2 id="form-title">Get on the list.</h2>
          <p>Tell us a little about yourself. We’ll keep you in the loop on the drives and the things you’re here for.</p>
          <ApplicationForm defaultInterest={defaultInterest} />
        </section>
      </main>
      <Footer />
    </>
  );
}
