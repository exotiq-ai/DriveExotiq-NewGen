import "./home.css";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAllPosts } from "@/lib/blog";
import HomeGarage from "./HomeGarage";
import HomeLoop from "./HomeLoop";
import HomeMotion from "./HomeMotion";
import HomeFilm from "./HomeFilm";
import HomeFounder from "./HomeFounder";
import HomeInvitation from "./HomeInvitation";

const portraitPosterSet =
  "/media/v3/hero-portrait-540.avif 540w, /media/v3/hero-portrait-720.avif 720w, /media/v3/hero-portrait-1080.avif 1080w";
const landscapePosterSet =
  "/media/v3/hero-landscape-960.avif 960w, /media/v3/hero-landscape-1440.avif 1440w, /media/v3/hero-landscape-1920.avif 1920w, /media/v3/hero-landscape-2560.avif 2560w, /media/v3/hero-landscape-3200.avif 3200w";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={diagonal ? "home-arrow-diagonal" : undefined}
    >
      <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
export default function HomeExperience() {
  const posts = getAllPosts();
  const selections = ["the-car-sleeper-thesis", "tour-denver"]
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post) => post !== undefined);
  return (
    <>
      <link
        rel="preload"
        as="image"
        type="image/avif"
        media="(max-width: 767px)"
        imageSrcSet={portraitPosterSet}
        imageSizes="100vw"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        type="image/avif"
        media="(min-width: 768px)"
        imageSrcSet={landscapePosterSet}
        imageSizes="100vw"
        fetchPriority="high"
      />
      <Header />
      <main id="main-content" className="home-experience">
        <HomeMotion />
        <section
          id="the-feeling"
          className="home-hero"
          aria-labelledby="home-title"
        >
          <picture>
            <source
              media="(max-width: 767px)"
              type="image/avif"
              srcSet={portraitPosterSet}
            />
            <source
              media="(max-width: 767px)"
              type="image/webp"
              srcSet="/media/v3/hero-portrait-540.webp 540w, /media/v3/hero-portrait-720.webp 720w, /media/v3/hero-portrait-1080.webp 1080w"
            />
            <source type="image/avif" srcSet={landscapePosterSet} />
            <source
              type="image/webp"
              srcSet="/media/v3/hero-landscape-960.webp 960w, /media/v3/hero-landscape-1440.webp 1440w, /media/v3/hero-landscape-1920.webp 1920w, /media/v3/hero-landscape-2560.webp 2560w, /media/v3/hero-landscape-3200.webp 3200w"
            />
            {/* Native image keeps picture art direction and browser preload selection aligned. */}
            <img
              className="home-hero-image"
              src="/media/v3/hero-landscape-1920.webp"
              alt="Gulf racing blue McLaren 720S Coupe in an architectural garage"
              width={1920}
              height={1080}
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
            />
          </picture>
          <HomeLoop variant="hero" />
          <div className="home-hero-shade" />
          <div className="home-hero-content site-wrap">
            <h1 id="home-title">
              The road
              <br />
              <em>is calling.</em>
            </h1>
            <div className="home-hero-bottom">
              <p>
                Extraordinary cars.
                <br />
                The people who make them matter.
              </p>
              <a href="#the-community" className="home-scroll-cue">
                <span>There’s more out there</span>
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>
        <section
          id="the-community"
          className="home-manifesto home-light"
          aria-labelledby="community-heading"
        >
          <div className="site-wrap">
            <div className="home-manifesto-grid">
              <h2 id="community-heading">
                Good cars.
                <br />
                <em>Better company.</em>
              </h2>
              <div className="home-manifesto-copy">
                <span className="home-small-mark" aria-hidden="true">
                  ↗
                </span>
                <p>
                  Early starts. Open roads. Coffee that gets cold because the
                  conversation is too good.
                </p>
                <p className="home-manifesto-context">
                  That’s what we’re here for. Drive Exotiq brings together
                  people who believe the best part of a great car is getting out
                  and driving it.
                </p>
                <Link className="site-text-link" href="/drives">
                  Find your people <Arrow />
                </Link>
              </div>
            </div>
            <div className="home-manifesto-foot">
              <span>Sunrise drives</span>
              <span>Cars & coffee</span>
              <span>A shared obsession</span>
            </div>
          </div>
        </section>
        <section
          id="the-garage"
          className="home-garage"
          aria-labelledby="garage-heading"
        >
          <div className="home-garage-heading site-wrap">
            <div>
              <p className="site-eyebrow">Objects of affection</p>
              <h2 id="garage-heading">
                Pick your <em>pulse.</em>
              </h2>
            </div>
            <div className="home-garage-intro">
              <p className="home-garage-promise">Find your kind of extraordinary.</p>
              <p>
                From luxury cruisers to exotics and supercars, exotiq.rent is
                being built to bring dozens of makes and models together from
                carefully vetted rental agencies.
              </p>
              <p className="home-garage-wink">Your mom’s minivan can sit this one out.</p>
            </div>
          </div>
          <HomeGarage />
          <div className="home-garage-foot site-wrap">
            <p className="home-garage-disclaimer">
              Illustrative lineup. Launch vehicles, locations and availability will vary.
            </p>
            <Link href="/marketplace" className="site-text-link">
              Explore the upcoming marketplace <Arrow diagonal />
            </Link>
          </div>
        </section>
        <div className="home-road-shell">
          <section
            id="the-road"
            className="home-road"
            aria-labelledby="road-heading"
          >
            <Image
              src="/media/s8-alpine-drive.webp"
              alt="Gregory’s Audi S8 on a sunlit alpine road"
              fill
              sizes="100vw"
            />
            <HomeLoop />
            <div className="home-road-shade" />
            <div className="home-road-content site-wrap">
              <h2 id="road-heading">
                Less scrolling.
                <br />
                <em>More switchbacks.</em>
              </h2>
              <div className="home-road-actions">
                <Link href="/drives" className="site-button">
                  Come for a drive <Arrow diagonal />
                </Link>
                <HomeFilm />
              </div>
            </div>
            <p className="home-road-caption">
              <span className="home-road-caption-thought">
                Out here, the drive is the whole point.
              </span>
              <span className="home-road-caption-source">
                Original footage · Colorado
              </span>
            </p>
          </section>
          <section
            className="home-road-coda"
            aria-labelledby="shared-road-heading"
          >
            <div className="site-wrap home-road-coda-grid">
              <figure>
                <div className="home-pair-media">
                  <Image
                    src="/media/telluride-pair.webp"
                    alt="Audi R8 and Ferrari 458 together beneath the autumn aspens in Telluride"
                    fill
                    sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 900px) 90vw, 58vw"
                  />
                  <HomeLoop variant="pair" />
                </div>
                <figcaption>
                  R8 &amp; 458 · Telluride, Colorado · From the archive
                </figcaption>
              </figure>
              <div className="home-road-coda-copy">
                <h2 id="shared-road-heading">
                  Some roads
                  <br />
                  are better
                  <br />
                  <em>shared.</em>
                </h2>
                <p>
                  A different car. A familiar obsession. The kind of company
                  that turns a drive into a story you’re still telling over
                  coffee.
                </p>
                <Link className="site-text-link" href="/drives">
                  Meet us on the road <Arrow />
                </Link>
              </div>
            </div>
          </section>
        </div>
        <HomeFounder />
        <section
          className="home-journal home-journal-compact home-light"
          aria-labelledby="journal-heading"
        >
          <div className="site-wrap">
            <div className="home-journal-heading">
              <div>
                <p className="site-eyebrow">Between drives / The journal</p>
                <h2 id="journal-heading">
                  Worth a <em>read.</em>
                </h2>
              </div>
              <Link href="/blog" className="site-text-link">
                All stories <Arrow />
              </Link>
            </div>
            <div className="home-journal-grid">
              {selections.map((post, index) => (
                <Link
                  className="home-story"
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                >
                  <span className="home-story-number">0{index + 1}</span>
                  <div>
                    <div className="home-story-meta">
                      <span>{post.category}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3>{post.title}</h3>
                  </div>
                  <Arrow diagonal />
                </Link>
              ))}
            </div>
          </div>
        </section>
        <HomeInvitation />
      </main>
      <Footer />
    </>
  );
}
