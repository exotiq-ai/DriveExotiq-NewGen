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
      <main id="main-content" className="astra-form-layout astra-apply-page">
        <section className="astra-form-story" aria-labelledby="apply-title">
          <picture>
            <source media="(max-width: 900px), (max-width: 1024px) and (max-height: 500px)" srcSet="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221%22%20height%3D%221%22%2F%3E" />
            <Image src="/astra/s8-alpine-drive.webp" alt="An Audi S8 on a winding mountain road" fill loading="lazy" sizes="50vw" className="astra-form-story-image" />
          </picture>
          <div className="astra-form-story-copy">
            <span className="astra-eyebrow">THE BEST PART IS WHO YOU MEET.</span>
            <p id="apply-title" className="astra-apply-display">Find your<br /><em>people.</em></p>
            <p>Early starts. Open roads. Conversations that last longer than the drive. There’s a place for you here.</p>
          </div>
        </section>
        <section className="astra-form-panel" aria-labelledby="form-title">
          <span className="astra-eyebrow"><span className="astra-live-dot" />YOUR NEXT CHAPTER</span>
          <h1 id="form-title">Get on the list.</h1>
          <p>Tell us a little about yourself and the drives you’re interested in.</p>
          <ApplicationForm defaultInterest={defaultInterest} />
        </section>
      </main>
      <Footer />
    </>
  );
}
