import Image from "next/image";
import Link from "next/link";

export default function HomeFounder() {
  return (
    <section
      id="the-people"
      className="site-founder"
      aria-labelledby="founder-heading"
    >
      <div className="site-wrap">
        <h2 id="founder-heading">
          Some cars get collected.
          <br />
          <em>This one gets driven.</em>
        </h2>
        <div className="site-founder-layout">
          <figure className="site-founder-frame">
            <div className="site-founder-image">
              <Image
                src="/media/gregory-open-door.webp"
                alt="Gregory standing at the open driver door of his Audi S8 in the desert"
                fill
                sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 900px) 90vw, (max-width: 1680px) 65vw, 1040px"
              />
            </div>
            <figcaption>
              Gregory with his S8 · Tortilla Flats · From the archive
            </figcaption>
          </figure>
          <div className="site-founder-note">
            <h3>Gregory.</h3>
            <p className="site-founder-intro">
              The quiet sedan is his.
              <br />
              So is the reason we’re here.
            </p>
            <p>
              His own 2017 Audi S8, with a custom tune and a Milltek exhaust.
              Built for getting out on a good road, with people who feel the
              same.
            </p>
            <Link
              className="site-text-link"
              href="/blog/the-car-sleeper-thesis"
            >
              The story of the S8 <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className="site-founder-postscript">
          <p>
            Denver to Miami.
            <br />
            <em>The long way, remembered.</em>
          </p>
          <div>
            <p>
              The journey is complete. The reason to get out and drive hasn’t
              changed.
            </p>
            <Link className="site-text-link" href="/tour">
              Open the roadbook <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
