import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getAllPosts } from '@/lib/blog';
import HomeGarage from './HomeGarage';
import HomeLoop from './HomeLoop';
import HomeMotion from './HomeMotion';
import HomeFilm from './HomeFilm';
import HomeFounder from './HomeFounder';
import HomeInvitation from './HomeInvitation';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={diagonal ? 'home-arrow-diagonal' : undefined}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.4" /></svg>;
}
export default function HomeExperience() {
  const posts = getAllPosts();
  const selections = ['the-car-sleeper-thesis', 'tour-denver'].map(slug => posts.find(post => post.slug === slug)).filter(post => post !== undefined);
  return <>
    <Header />
    <main id="main-content" className="home-experience">
      <HomeMotion />
      <section id="the-feeling" className="home-hero" aria-labelledby="home-title">
        <picture><source media="(max-width: 767px)" srcSet="/astra/hero-garage-mobile.webp" /><Image className="home-hero-image" src="/astra/hero-garage.webp" alt="Silver McLaren 720S in an architectural garage, a shaft of daylight falling across the concrete" fill loading="eager" fetchPriority="high" sizes="100vw" unoptimized /></picture>
        <HomeLoop variant="hero" />
        <div className="home-hero-shade" />
        <div className="home-hero-content astra-wrap">
          <div className="home-hero-topline"><p className="astra-eyebrow"><span className="home-status-dot" />For the love of the drive</p><span className="home-hero-edition">DRIVE EXOTIQ<br />A life in motion.</span></div>
          <h1 id="home-title">The road<br /><em>is calling.</em></h1>
          <div className="home-hero-bottom"><p>Extraordinary cars.<br />The people who make them matter.</p><a href="#the-community" className="home-scroll-cue"><span>There’s more out there</span><span aria-hidden="true">↓</span></a><span className="home-hero-index"><span>01</span> / THE BEGINNING</span></div>
        </div>
      </section>
      <section id="the-community" className="home-manifesto home-light" aria-labelledby="community-heading">
        <div className="astra-wrap">
          <div className="home-section-label"><p className="astra-eyebrow">01 / The common ground</p><span>It starts with a car. It becomes something else.</span></div>
          <div className="home-manifesto-grid">
            <h2 id="community-heading">Good cars.<br /><em>Better company.</em></h2>
            <div className="home-manifesto-copy"><span className="home-small-mark" aria-hidden="true">↗</span><p>The early alarm. The first turn out of town. The coffee that gets cold because the conversation is too good.</p><p>That’s what we’re here for. Drive Exotiq brings together people who believe the best part of a great car is getting out and driving it.</p><Link className="astra-text-link" href="/drives">Find your people <Arrow /></Link></div>
          </div>
          <div className="home-manifesto-foot"><span>Sunrise drives</span><span>Cars & coffee</span><span>A shared obsession</span></div>
        </div>
      </section>
      <section id="the-garage" className="home-garage" aria-labelledby="garage-heading">
        <div className="home-garage-heading astra-wrap"><div><p className="astra-eyebrow">02 / Objects of affection</p><h2 id="garage-heading">Pick your <em>pulse.</em></h2></div><p>Different personalities.<br />One shared language.</p></div>
        <HomeGarage />
        <div className="home-garage-foot astra-wrap"><p><span className="home-status-dot" />The next chapter: exotic car rentals.<span className="home-coming-soon">Marketplace coming soon.</span></p><Link href="/marketplace" className="astra-text-link">Discover exotiq.rent <Arrow diagonal /></Link></div>
      </section>
      <div className="home-road-shell">
      <section id="the-road" className="home-road" aria-labelledby="road-heading">
        <Image src="/astra/s8-alpine-drive.webp" alt="Gregory’s Audi S8 on a sunlit alpine road" fill sizes="100vw" />
        <HomeLoop /><div className="home-road-shade" />
        <div className="home-road-content astra-wrap"><p className="astra-eyebrow">03 / Leave the ordinary behind.</p><h2 id="road-heading">Less scrolling.<br /><em>More switchbacks.</em></h2><div className="home-road-actions"><Link href="/drives" className="astra-button">Come for a drive <Arrow diagonal /></Link><HomeFilm /></div></div>
        <p className="home-road-caption">Out here, the drive is the whole point.<span>FROM OUR OWN CAMERA ROLL / AUDI S8</span></p>
      </section>
      <section className="home-road-coda" aria-labelledby="shared-road-heading"><div className="astra-wrap home-road-coda-grid">
        <figure><div className="home-pair-media"><Image src="/astra/telluride-pair.webp" alt="Audi R8 and Ferrari 458 together beneath the autumn aspens in Telluride" fill sizes="(max-width: 767px) calc(100vw - 48px), 58vw" /><HomeLoop variant="pair" /></div><figcaption><span>The R8. The 458. A moment worth keeping.</span><span>Telluride, Colorado / From the archive</span></figcaption></figure>
        <div className="home-road-coda-copy"><p className="astra-eyebrow">The best part isn’t parked.</p><h2 id="shared-road-heading">Some roads<br />are better<br /><em>shared.</em></h2><p>A different car. A familiar obsession. The kind of company that turns a drive into a story you’re still telling over coffee.</p><Link className="astra-text-link" href="/drives">Meet us on the road <Arrow /></Link></div>
      </div></section>
      </div>
      <HomeFounder />
      <section className="home-journal home-journal-compact home-light" aria-labelledby="journal-heading"><div className="astra-wrap">
        <div className="home-journal-heading"><div><p className="astra-eyebrow">Between drives / The journal</p><h2 id="journal-heading">Worth a <em>read.</em></h2></div><Link href="/blog" className="astra-text-link">All stories <Arrow /></Link></div>
        <div className="home-journal-grid">{selections.map((post, index) => <Link className="home-story" key={post.slug} href={`/blog/${post.slug}`}><span className="home-story-number">0{index + 1}</span><div><div className="home-story-meta"><span>{post.category}</span><span>{post.readTime}</span></div><h3>{post.title}</h3></div><Arrow diagonal /></Link>)}</div>
      </div></section>
      <HomeInvitation />
    </main>
    <Footer />
  </>;
}
