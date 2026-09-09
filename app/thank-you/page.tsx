import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Arrow from "@/components/ui/Arrow";
import { isFormPreview } from "@/lib/preview";

export const metadata: Metadata = {
  title: isFormPreview ? "Preview complete" : "You’re on the list",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="site-thanks">
        <span className="site-eyebrow">
          <span className="site-live-dot" />
          {isFormPreview ? "PREVIEW COMPLETE" : "YOU’RE ON THE LIST"}
        </span>
        <h1>
          {isFormPreview ? (
            <>
              A good
              <br />
              <em>beginning.</em>
            </>
          ) : (
            <>
              Good things
              <br />
              <em>are ahead.</em>
            </>
          )}
        </h1>
        <p>
          {isFormPreview
            ? "Your form passed validation. This is a design preview: no information was saved and no email or text was sent."
            : "Thanks for the introduction. We’ll keep you in the loop on your interests. Until then, there’s a little more road to explore."}
        </p>
        <div className="site-thanks-links">
          <Link href="/drives" className="site-button">
            Discover the drives <Arrow />
          </Link>
          <Link href="/blog" className="site-text-link">
            A little reading for the road <Arrow />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
