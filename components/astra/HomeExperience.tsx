import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getAllPosts } from '@/lib/blog';
import HomeGarage from './HomeGarage';
import HomeLoop from './HomeLoop';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={diagonal ? 'home-arrow-diagonal' : undefined}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.4" /></svg>;
}
export default function HomeExperience() {
  const posts = getAllPosts();
  const selections = ['the-car-sleeper-thesis', 'tour-denver'].map(slug => posts.find(post => post.slug === slug)).filter(post => post !== undefined);
  return <>
    <Header />
    <main id="main-content" className="home-experience">
      <section className="home-hero" aria-labelledby="home-title">
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
      <section className="home-road" aria-labelledby="road-heading">
        <Image src="/astra/s8-alpine-drive.webp" alt="Gregory’s Audi S8 on a sunlit alpine road" fill sizes="100vw" />
        <HomeLoop /><div className="home-road-shade" />
        <div className="home-road-content astra-wrap"><p className="astra-eyebrow">Leave the ordinary behind.</p><h2 id="road-heading">Less scrolling.<br /><em>More switchbacks.</em></h2><Link href="/drives" className="astra-button">Come for a drive <Arrow diagonal /></Link></div>
        <p className="home-road-caption">Out here, the drive is the whole point.<span>FROM OUR OWN CAMERA ROLL / AUDI S8</span></p>
      </section>
      <section className="home-garage" aria-labelledby="garage-heading">
        <div className="home-garage-heading astra-wrap"><div><p className="astra-eyebrow">02 / Objects of affection</p><h2 id="garage-heading">Pick your <em>pulse.</em></h2></div><p>Different personalities.<br />One shared language.</p></div>
        <HomeGarage />
        <div className="home-garage-foot astra-wrap"><p><span className="home-status-dot" />The next chapter: exotic car rentals.<span className="home-coming-soon">Marketplace coming soon.</span></p><Link href="/marketplace" className="astra-text-link">Discover exotiq.rent <Arrow diagonal /></Link></div>
      </section>
      <section className="home-roadbook home-light" aria-labelledby="roadbook-heading">
        <div className="astra-wrap">
          <div className="home-section-label"><p className="astra-eyebrow">03 / A road well travelled</p><span>Denver → Miami. Journey completed.</span></div>
          <div className="home-roadbook-heading"><h2 id="roadbook-heading">The long way<br /><em>was the right way.</em></h2><div><p>One Audi S8. A road from Denver to Miami. A reminder that the stories you keep are usually the ones you went out to find.</p><Link href="/tour" className="astra-text-link">Open the roadbook <Arrow /></Link></div></div>
          <div className="home-roadbook-images"><figure className="home-desert-photo"><Image src="/astra/s8-desert-vista.webp" alt="The Audi S8 overlooking the desert at Tortilla Flats in golden light" width={1920} height={1200} sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1680px) 73vw, 1170px" /><figcaption><span>A pause worth taking.</span><span>Tortilla Flats / From the archive</span></figcaption></figure><figure className="home-founder-photo"><Image src="/astra/gregory-portrait.webp" alt="Gregory beside his Audi S8 in the desert" width={900} height={1126} sizes="(max-width: 767px) 105px, (max-width: 1680px) 20vw, 316px" /><figcaption>Gregory<br /><span>Founder. Driver. Usually both.</span></figcaption></figure></div>
        </div>
      </section>
      <section className="home-journal home-light" aria-labelledby="journal-heading"><div className="astra-wrap">
        <div className="home-journal-heading"><div><p className="astra-eyebrow">04 / Between drives</p><h2 id="journal-heading">Worth a <em>read.</em></h2></div><Link href="/blog" className="astra-text-link">All stories <Arrow /></Link></div>
        <div className="home-journal-grid">{selections.map((post, index) => <Link className="home-story" key={post.slug} href={`/blog/${post.slug}`}><div className="home-story-image"><Image src={index === 0 ? '/astra/s8-rear-golden.webp' : '/astra/r8-ferrari-telluride.webp'} alt={index === 0 ? 'Audi S8 in late desert light' : 'Audi R8 and Ferrari 458 beneath autumn aspens in Telluride'} fill sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1680px) 48vw, 772px" /><span className="home-story-open"><Arrow diagonal /></span></div><div className="home-story-meta"><span>{post.category}</span><span>{post.readTime}</span></div><h3>{post.title}</h3></Link>)}</div>
      </div></section>
      <section className="home-invitation" aria-labelledby="invitation-heading"><div className="astra-wrap"><div className="home-section-label"><p className="astra-eyebrow">The next good story starts outside.</p><span>YOU IN?</span></div><h2 id="invitation-heading">See you<br /><em>out there.</em><span className="home-invitation-arrow" aria-hidden="true">↗</span></h2><div className="home-invitation-bottom"><p>Good roads. Early starts. Your kind of people.<br />Get the invitation to what comes next.</p><Link className="astra-button" href="/apply?interest=drives">Get on the list <Arrow diagonal /></Link></div></div></section>
    </main>
    <Footer />
  </>;
}
