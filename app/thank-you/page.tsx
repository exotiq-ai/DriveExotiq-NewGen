import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Arrow from '@/components/astra/Arrow';
import { isPreview } from '@/lib/preview';

export const metadata: Metadata = {
  title: isPreview ? 'Preview complete' : 'You’re on the list',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="astra-thanks">
        <span className="astra-eyebrow"><span className="astra-live-dot" />{isPreview ? 'PREVIEW COMPLETE' : 'YOU’RE ON THE LIST'}</span>
        <h1>{isPreview ? <>A good<br /><em>beginning.</em></> : <>Good things<br /><em>are ahead.</em></>}</h1>
        <p>{isPreview ? 'Your form passed validation. This is a design preview: no information was saved and no email or text was sent.' : 'Thanks for the introduction. We’ll keep you in the loop on your interests. Until then, there’s a little more road to explore.'}</p>
        <div className="astra-thanks-links">
          <Link href="/drives" className="astra-button">Discover the drives <Arrow /></Link>
          <Link href="/blog" className="astra-text-link">A little reading for the road <Arrow /></Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
