import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReadingRail from '@/components/blog/ReadingRail';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://driveexotiq.com';
const ART: Record<string, {src: string; alt: string; caption: string}> = {
  'the-car-sleeper-thesis': {src:'/astra/s8-desert-vista.webp',alt:'The Audi S8 at a golden-hour desert overlook',caption:'The Audi S8. / Tortilla Flats, from the Drive Exotiq archive.'},
  'tour-denver': {src:'/astra/s8-alpine-drive.webp',alt:'An Audi S8 on a winding alpine road in Colorado',caption:'A reason to leave the city early. / Colorado, from the Drive Exotiq archive.'},
  'tour-miami': {src:'/astra/r8-rain-detail.webp',alt:'A close look at the rain-beaded hood of an Audi R8',caption:'An eye for the details. / Audi R8 photographed in Telluride, from the Drive Exotiq archive.'},
};
export function generateStaticParams() { return getAllPosts().map(post => ({slug:post.slug})); }
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if(!post) return {title:'Story not found'};
  const art=ART[post.slug];
  return {title:post.title,description:post.dek||undefined,alternates:{canonical:`/blog/${post.slug}`},openGraph:{title:post.title,description:post.dek||undefined,url:`/blog/${post.slug}`,type:'article',images:[{url:art?.src||'/og-image.jpg',alt:art?.alt||'Drive Exotiq'}]},twitter:{card:'summary_large_image',title:post.title,description:post.dek||undefined,images:[art?.src||'/og-image.jpg']}};
}
export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if(!post) notFound();
  const art=ART[post.slug];
  const jsonLd={'@context':'https://schema.org','@type':'BlogPosting',headline:post.title,description:post.dek||undefined,author:{'@type':'Organization',name:post.author},publisher:{'@type':'Organization',name:'Drive Exotiq'},...(post.date?{datePublished:post.date}:{}),mainEntityOfPage:{'@type':'WebPage','@id':`${SITE}/blog/${post.slug}`},articleSection:post.category,...(art?{image:`${SITE}${art.src}`}:{ }),...(post.mentions.length?{mentions:post.mentions.map(m=>({'@type':'Brand',name:m.name,url:m.url}))}:{})};
  return <><ReadingRail /><Header /><main id="main-content" className="ed-page"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}} /><article><header className="ed-wrap ed-article-head"><p className="ed-kicker">The Journal / {post.category}</p><h1 className="ed-title">{post.title}</h1>{post.dek&&<p className="ed-lead">{post.dek}</p>}<div className="ed-byline"><span>Words by {post.author}</span><span aria-hidden="true">/</span><span>{post.readTime}</span>{post.date&&<time dateTime={post.date}>{new Date(`${post.date}T12:00:00Z`).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'})}</time>}</div></header>{art&&<figure><div className="ed-photo ed-article-photo"><Image src={art.src} alt={art.alt} fill priority fetchPriority="high" sizes="100vw" /></div><figcaption className="ed-wrap ed-caption" style={{paddingBottom:20}}>{art.caption}</figcaption></figure>}<div className="ed-paper"><div className="ed-wrap ed-article-body"><aside className="ed-article-aside"><Link href="/blog" className="ed-link"><span aria-hidden="true">←</span> All stories</Link></aside><div className="ed-article-prose"><div dangerouslySetInnerHTML={{__html:post.html}} /></div></div></div></article><section className="ed-close"><div className="ed-wrap"><h2 className="ed-heading">From the page<br /><em>to the road.</em></h2><Link href="/apply?interest=drives" className="ed-button">Request your invite <span aria-hidden="true">↗</span></Link></div></section></main><Footer /></>;
}
