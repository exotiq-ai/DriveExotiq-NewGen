import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'The Journal · Notes from the road and the garage',
  description: 'The Drive Exotiq journal. Stories about the cars, the roads, the places, and the people who make the drive worth taking.',
  alternates: { canonical: '/blog' },
};
export default function BlogIndex() {
  const posts = getAllPosts();
  const featured = posts.find(post => post.slug === 'the-car-sleeper-thesis') || posts[0];
  const remaining = posts.filter(post => post.slug !== featured?.slug);
  return <><Header /><main id="main-content" className="ed-page">
    <section className="ed-wrap ed-journal-hero"><p className="ed-kicker">Drive Exotiq / Field notes</p><h1 className="ed-journal-title">The Journal.</h1><div className="ed-journal-deck"><p className="ed-lead">Notes from the road.<br />Thoughts from the garage.</p><p className="ed-story-meta">Cars / Places / People</p></div></section>
    <div className="ed-wrap">{featured ? <article className="ed-feature-story"><Link href={`/blog/${featured.slug}`} className="ed-photo ed-feature-photo" aria-label={`Read ${featured.title}`}><Image src="/astra/s8-desert-vista.webp" alt="Audi S8 at a sunlit desert overlook" fill priority fetchPriority="high" sizes="(max-width: 680px) 100vw, 55vw" /></Link><div><p className="ed-story-meta">Featured story / {featured.category} / {featured.readTime}</p><h2 className="ed-heading"><Link href={`/blog/${featured.slug}`}>{featured.title}</Link></h2><p className="ed-body">{featured.dek}</p><Link href={`/blog/${featured.slug}`} className="ed-link">Read the story <span aria-hidden="true">↗</span></Link></div></article> : <div className="ed-section"><p className="ed-lead">The first stories are taking shape. Join the invitation list to stay close.</p><Link className="ed-link" href="/apply?interest=drives">Request your invite <span aria-hidden="true">↗</span></Link></div>}</div>
    {remaining.length > 0 && <section className="ed-paper ed-section"><div className="ed-wrap"><div className="ed-section-top"><p className="ed-kicker">Keep reading</p><span className="ed-section-number">The places behind the drive</span></div><div>{remaining.map((post,i)=><article key={post.slug}><Link className="ed-story-row" href={`/blog/${post.slug}`}><span className="ed-section-number">0{i+2}</span><div><p className="ed-story-meta">{post.category} / {post.readTime}</p><h2>{post.title}</h2></div><p className="ed-body">{post.dek}</p><span aria-hidden="true">↗</span></Link></article>)}</div></div></section>}
    <section className="ed-close"><div className="ed-wrap"><h2 className="ed-heading">A story is better<br /><em>when you’re in it.</em></h2><Link href="/apply?interest=drives" className="ed-button">Request your invite <span aria-hidden="true">↗</span></Link></div></section>
  </main><Footer /></>;
}
