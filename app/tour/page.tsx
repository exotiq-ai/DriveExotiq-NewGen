import "@/app/styles/pages.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "The Tour · The long way, remembered",
  description:
    "Denver to Miami. A completed journey and the driving culture behind Drive Exotiq. Explore the road, the car, and the stories.",
  alternates: { canonical: "/tour" },
};
export default function TourPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="ed-page">
        <section className="ed-hero ed-tour-hero ed-wrap">
          <h1 className="ed-title">
            The long way,
            <br />
            <em>remembered.</em>
          </h1>
          <div className="ed-hero-bottom">
            <p className="ed-lead">
              Denver to Miami. One journey behind us.
              <br />A whole reason to keep driving.
            </p>
            <a className="ed-link" href="#roadbook">
              Open the roadbook <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>
        <div
          className="ed-wrap ed-route-line"
          aria-label="Journey endpoints: Denver to Miami"
        >
          <span>Denver, CO</span>
          <i aria-hidden="true" />
          <span>Miami, FL</span>
        </div>
        <figure>
          <div className="ed-photo ed-tour-wide">
            <Image
              src="/media/s8-desert-vista.webp"
              alt="The Audi S8 at a desert overlook in the golden light of Tortilla Flats"
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
            />
          </div>
          <figcaption className="ed-wrap ed-caption">
            The S8 at Tortilla Flats. From the Drive Exotiq driving archive.
          </figcaption>
        </figure>
        <section id="roadbook" className="ed-section">
          <div className="ed-wrap">
            <div className="ed-split">
              <h2 className="ed-quote">
                A car only becomes a story when you take it somewhere.
              </h2>
              <div className="ed-stack">
                <p className="ed-lead">
                  The Denver-to-Miami trip is complete. The road has become part
                  of the story.
                </p>
                <p className="ed-body">
                  This is the idea behind Drive Exotiq: put the car on the road,
                  make room for the people, and give yourself something worth
                  remembering.
                </p>
                <p className="ed-body">
                  The photographs here come from our driving archive. The
                  stories below explore the car and the places that frame the
                  journey.
                </p>
                <Link href="/blog" className="ed-link">
                  Stories from the road <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="ed-paper ed-section">
          <div className="ed-wrap">
            <div className="ed-split">
              <h2 className="ed-heading">
                Four doors.
                <br />
                <em>A different idea.</em>
              </h2>
              <div>
                <p className="ed-lead">
                  The Audi S8. Quiet presence. A very good reason to take the
                  longer road.
                </p>
                <p className="ed-body">
                  There is something satisfying about a car that keeps its
                  capability to itself. The S8 captures that spirit: composed,
                  understated, and built for more than the view from the garage.
                </p>
                <Link className="ed-link" href="/blog/the-car-sleeper-thesis">
                  Read the sleeper thesis <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
            <div className="ed-gallery">
              <figure>
                <div className="ed-photo">
                  <Image
                    src="/media/s8-alpine-drive.webp"
                    alt="Audi S8 moving through a Colorado alpine pass"
                    fill
                    sizes="(max-width: 680px) 100vw, 58vw"
                  />
                </div>
                <figcaption className="ed-caption">
                  The road, as it should be. / Colorado
                </figcaption>
              </figure>
              <figure>
                <div className="ed-photo">
                  <Image
                    src="/media/r8-rain-detail.webp"
                    alt="Rain droplets on the hood and headlight of an Audi R8"
                    fill
                    sizes="(max-width: 680px) 100vw, 40vw"
                  />
                </div>
                <figcaption className="ed-caption">
                  Evidence of a day outside. / Telluride
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
        <section className="ed-section">
          <div className="ed-wrap">
            <div className="ed-split">
              <div className="ed-stack">
                <h2 className="ed-heading">
                  Denver.
                  <br />
                  <em>Home ground.</em>
                </h2>
                <p className="ed-body">
                  The mountains are close. The roads keep climbing. Our story
                  starts with the city that made early mornings feel like a good
                  idea.
                </p>
                <Link href="/blog/tour-denver" className="ed-link">
                  The Denver story <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <div className="ed-stack">
                <h2 className="ed-heading">
                  Miami.
                  <br />
                  <em>A change of pace.</em>
                </h2>
                <p className="ed-body">
                  A different light and a different automotive language. Miami
                  brings the contrast that gives a journey across the country
                  its perspective.
                </p>
                <Link href="/blog/tour-miami" className="ed-link">
                  The Miami story <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="ed-close ed-paper">
          <div className="ed-wrap">
            <h2 className="ed-heading">
              The next story
              <br />
              starts <em>at sunrise.</em>
            </h2>
            <Link href="/apply?interest=drives" className="ed-button">
              Request your invite <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
