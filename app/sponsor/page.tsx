import "@/app/styles/pages.css";
import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SponsorInquiryForm from "@/components/forms/SponsorInquiryForm";
import { normalizeSponsorTier } from "@/lib/sponsor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Brand partnerships · Good company. On and off the road.",
  description:
    "Start a brand partnership conversation with Drive Exotiq. Shared experiences, thoughtful storytelling, and a community that loves to drive.",
  alternates: { canonical: "/sponsor" },
};
export default async function SponsorPage({
  searchParams,
}: {
  searchParams?: Promise<{ interest?: string }>;
}) {
  const query = await searchParams;
  const defaultInterest = normalizeSponsorTier(query?.interest);
  return (
    <>
      <Header />
      <main id="main-content" className="ed-page">
        <section className="ed-hero ed-partner-hero ed-wrap">
          <p className="ed-kicker">Drive Exotiq / Brand partnerships</p>
          <h1 className="ed-title">
            Good company.
            <br />
            <em>On and off the road.</em>
          </h1>
          <div className="ed-hero-bottom">
            <p className="ed-lead">
              For brands that understand the best connections happen when people
              share an experience.
            </p>
            <a href="#inquire" className="ed-button">
              Start a conversation <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
        <figure>
          <div className="ed-photo ed-partner-image">
            <Image
              src="/media/ferrari-r8-lakeside.webp"
              alt="Two sports cars together beside a lake in the Colorado mountains"
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
            />
          </div>
          <figcaption className="ed-wrap ed-caption">
            An appreciation for the drive. And the company it keeps. / Telluride
          </figcaption>
        </figure>
        <section className="ed-paper ed-section">
          <div className="ed-wrap">
            <div className="ed-section-top">
              <p className="ed-kicker">Shared interests</p>
              <span className="ed-section-number">01 / The right fit</span>
            </div>
            <div className="ed-split">
              <h2 className="ed-heading">
                Something real
                <br />
                to <em>be part of.</em>
              </h2>
              <div>
                <p className="ed-lead">
                  The cars start the conversation. What happens next is about
                  people.
                </p>
                <p className="ed-body">
                  We are interested in partnerships that add something to the
                  experience: a memorable gathering, a story worth telling, or a
                  thoughtful detail that makes a good day better.
                </p>
              </div>
            </div>
            <div className="ed-partner-list">
              {[
                [
                  "The gathering.",
                  "Explore a partnership around a drive or a shared moment over coffee. The starting point is what your brand brings to the people there.",
                ],
                [
                  "The story.",
                  "Talk with us about photography, editorial ideas, and ways to tell a story that belongs naturally in the world of driving.",
                ],
                [
                  "Your idea.",
                  "Have something else in mind? Tell us what you are building and where you see a connection. Good ideas do not need to fit a package.",
                ],
              ].map(([title, body], i) => (
                <div key={title}>
                  <span>0{i + 1}</span>
                  <h3>{title}</h3>
                  <p className="ed-body">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="inquire"
          className="ed-section"
          style={{ scrollMarginTop: 100 }}
        >
          <div className="ed-wrap">
            <div className="ed-section-top">
              <p className="ed-kicker">An introduction</p>
              <span className="ed-section-number">02 / Let’s talk</span>
            </div>
            <div className="ed-form-layout">
              <div>
                <h2 className="ed-heading">
                  Tell us
                  <br />
                  <em>what you have in mind.</em>
                </h2>
                <p className="ed-body">
                  Your brand, your idea, and what a good partnership would look
                  like. We will take it from there, person to person.
                </p>
                <p className="ed-caption">
                  Every partnership begins with a conversation. Scope, timing,
                  and availability are agreed together.
                </p>
              </div>
              <div className="ed-form">
                <SponsorInquiryForm defaultInterest={defaultInterest} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
