import "@/app/styles/pages.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WaitlistForm from "@/components/forms/WaitlistForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "exotiq.rent · A different kind of access. Coming soon.",
  description:
    "The exotic-car rental marketplace from the people behind Drive Exotiq. Coming soon. Join the waitlist for launch updates.",
  alternates: { canonical: "/marketplace" },
};
export default function MarketplacePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="ed-page">
        <section className="ed-market-hero">
          <div className="ed-market-copy">
            <p className="ed-kicker">exotiq.rent / Coming soon</p>
            <h1 className="ed-title">
              The keys
              <br />
              to <em>what’s next.</em>
            </h1>
            <p className="ed-lead">
              An exotic-car rental marketplace, built from a love of the drive.
            </p>
            <a className="ed-button" href="#waitlist">
              Join the waitlist <span aria-hidden="true">↗</span>
            </a>
            <p className="ed-caption">
              In development. Booking is not yet available.
            </p>
          </div>
          <div className="ed-photo ed-market-photo">
            <Image
              src="/media/r8-ferrari-telluride.webp"
              alt="Audi R8 and Ferrari 458 photographed together in Telluride"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 680px) 100vw, 50vw"
            />
          </div>
        </section>
        <section className="ed-paper ed-section">
          <div className="ed-wrap">
            <div className="ed-section-top">
              <p className="ed-kicker">The next chapter</p>
              <span className="ed-section-number">
                01 / A different kind of access
              </span>
            </div>
            <p className="ed-wordmark">
              exotiq<span>.rent</span>
            </p>
            <div className="ed-split">
              <h2 className="ed-heading">
                The community
                <br />
                came <em>first.</em>
              </h2>
              <div>
                <p className="ed-lead">
                  The marketplace grows from the same idea as our sunrise
                  drives: cars are for driving.
                </p>
                <p className="ed-body">
                  Drive Exotiq is where the people meet. exotiq.rent is the
                  marketplace we are building next. Join the waitlist for news
                  as it takes shape.
                </p>
              </div>
            </div>
            <ol className="ed-three">
              {[
                [
                  "For the driver.",
                  "A marketplace shaped around the experience behind the wheel.",
                ],
                [
                  "From the community.",
                  "Built by the people behind Drive Exotiq and its invitation-only drives.",
                ],
                [
                  "More to come.",
                  "Launch timing and vehicle availability will be announced as the marketplace develops.",
                ],
              ].map(([title, body], i) => (
                <li className="ed-step" key={title}>
                  <span>0{i + 1}</span>
                  <h3>{title}</h3>
                  <p className="ed-body">{body}</p>
                </li>
              ))}
            </ol>
            <p className="ed-caption" style={{ marginTop: 40 }}>
              Photographed cars are from the Drive Exotiq archive. They do not
              represent confirmed rental inventory.
            </p>
          </div>
        </section>
        <section
          id="waitlist"
          className="ed-section"
          style={{ scrollMarginTop: 100 }}
        >
          <div className="ed-wrap ed-form-layout">
            <div>
              <p className="ed-kicker">The waitlist</p>
              <h2 className="ed-heading" style={{ marginTop: 28 }}>
                Be there
                <br />
                <em>at the beginning.</em>
              </h2>
              <p className="ed-body">
                Leave your details for marketplace updates. We’ll let you know
                when there is news worth sharing.
              </p>
            </div>
            <div className="ed-form">
              <WaitlistForm />
            </div>
          </div>
        </section>
        <section className="ed-close">
          <div className="ed-wrap">
            <h2 className="ed-heading">
              In the meantime,
              <br />
              <em>let’s drive.</em>
            </h2>
            <Link href="/apply?interest=drives" className="ed-link">
              Request a sunrise drive invite <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
