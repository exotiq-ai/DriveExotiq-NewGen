import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Stories — the drives, the tour & the cars',
  description:
    'Stories from Drive Exotiq — the sunrise drives, the Denver→Miami tour, the cars, and the community front door to exotiq.rent.',
  alternates: { canonical: '/blog' },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <>
      <Header />
      <main id="main" className="bg-canvas">
        {/* Header */}
        <section className="mx-auto max-w-content px-6 pb-12 pt-32 md:px-10 md:pb-16 md:pt-40">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gulf" />
            <span className="text-[13px] tracking-[0.04em] text-ink-2">Stories</span>
          </div>

          <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-tightest text-ink">
            Notes from the road and the garage.
          </h1>

          <p className="mt-7 max-w-[56ch] text-[clamp(1rem,1.6vw,1.2rem)] leading-snug text-ink-2">
            The drives, the tour, the cars, and the people who keep showing up. Plus what&rsquo;s
            coming with exotiq.rent. Drive Exotiq, in long form.
          </p>

          {categories.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map((c) => (
                <span
                  key={c}
                  className="rounded-sm border border-line px-3 py-1.5 text-[13px] text-ink-2"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Posts */}
        <section className="mx-auto max-w-content px-6 pb-section md:px-10">
          {posts.length === 0 ? (
            <div className="border-t border-line pt-12">
              <p className="max-w-[44ch] font-serif text-[clamp(1.15rem,2vw,1.5rem)] italic leading-snug text-ink-3">
                The first stories are being written. Get on the list and you&rsquo;ll be among
                the first to read them.
              </p>
              <Link
                href="/apply"
                className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-sm bg-gulf px-7 py-3.5 text-[17px] font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
              >
                Get on the list
              </Link>
            </div>
          ) : (
            <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
              {posts.map((post) => (
                <li key={post.slug} className="bg-canvas">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col px-6 py-8 md:px-8 md:py-10"
                  >
                    <span className="text-[12px] tracking-[0.08em] text-ink-3">
                      {post.category} · {post.readTime}
                    </span>
                    <h2 className="mt-3 font-display text-[clamp(1.3rem,2.4vw,1.7rem)] font-semibold leading-snug tracking-tight-exotiq text-ink">
                      {post.title}
                    </h2>
                    {post.dek && (
                      <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-ink-2">
                        {post.dek}
                      </p>
                    )}
                    <span className="mt-auto pt-6 text-[14px] text-ink-2 transition-colors group-hover:text-gulf">
                      Read the story →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
