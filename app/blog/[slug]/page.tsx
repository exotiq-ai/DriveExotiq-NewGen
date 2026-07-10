import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReadingRail from '@/components/blog/ReadingRail';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

const SITE = 'https://driveexotiq.com';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Story not found' };
  return {
    title: post.title,
    description: post.dek || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.dek || undefined,
      url: `/blog/${post.slug}`,
      type: 'article',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Drive Exotiq: Exotic Cars That Actually Get Driven',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.dek || undefined,
      images: ['/og-image.jpg'],
    },
  };
}

export default function StoryPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.dek || undefined,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'Drive Exotiq' },
    ...(post.date ? { datePublished: post.date } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${post.slug}` },
    articleSection: post.category,
    ...(post.mentions.length
      ? {
          mentions: post.mentions.map((m) => ({
            '@type': 'Brand',
            name: m.name,
            url: m.url,
          })),
        }
      : {}),
  };

  return (
    <>
      <ReadingRail />
      <Header />
      <main id="main" className="bg-canvas">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <article className="mx-auto max-w-[46rem] px-6 pb-section pt-32 md:pt-40">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gulf" />
            <span className="text-[13px] tracking-[0.04em] text-ink-2">
              {post.category} · {post.readTime}
            </span>
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.1rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-tightest text-ink">
            {post.title}
          </h1>

          {post.dek && (
            <p className="mt-6 font-serif text-[clamp(1.15rem,2vw,1.5rem)] italic leading-snug text-ink-2">
              {post.dek}
            </p>
          )}

          <div className="hairline my-10" />

          <div
            className="story-prose"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <div className="mt-16 border-t border-line pt-10">
            <Link
              href="/apply"
              className="inline-flex min-h-[52px] items-center justify-center rounded-sm bg-gulf px-7 py-3.5 text-[17px] font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
            >
              Get on the list
            </Link>
            <Link href="/blog" className="ml-6 text-[15px] text-ink-2 transition-colors hover:text-gulf">
              ← All stories
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
