import Image from 'next/image';
import Link from 'next/link';

export default function HomeFounder() {
  return (
    <section id="the-people" className="astra-founder" aria-labelledby="founder-heading">
      <div className="astra-wrap">
        <div className="astra-story-label">
          <p className="astra-eyebrow">04 / The people</p>
          <span>The person behind the keys.</span>
        </div>
        <h2 id="founder-heading">Some cars get collected.<br /><em>This one gets driven.</em></h2>
        <div className="astra-founder-layout">
          <figure className="astra-founder-frame">
            <div className="astra-founder-image">
              <Image
                src="/astra/gregory-open-door.webp"
                alt="Gregory standing at the open driver door of his Audi S8 in the desert"
                fill
                sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1680px) 65vw, 1040px"
              />
            </div>
            <figcaption><span>Gregory and his Audi S8.</span><span>Tortilla Flats / From the archive</span></figcaption>
          </figure>
          <div className="astra-founder-note">
            <p className="astra-eyebrow">Founder. Owner. Driver.</p>
            <h3>Gregory.</h3>
            <p className="astra-founder-intro">The quiet sedan is his.<br />So is the reason we’re here.</p>
            <p>His own 2017 Audi S8, with a custom tune and a Milltek exhaust. A car built around what happens behind the wheel.</p>
            <p>That’s the idea behind Drive Exotiq: cars are meant to be driven. And a good road is better with people who feel the same.</p>
            <Link className="astra-text-link" href="/blog/the-car-sleeper-thesis">The story of the S8 <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className="astra-founder-postscript">
          <p><span className="astra-eyebrow">The roadbook</span>Denver to Miami.<br /><em>The long way, remembered.</em></p>
          <div><p>The journey is complete. The reason to get out and drive hasn’t changed.</p><Link className="astra-text-link" href="/tour">Open the roadbook <span aria-hidden="true">↗</span></Link></div>
        </div>
      </div>
    </section>
  );
}
