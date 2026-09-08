import { isPreview } from '@/lib/preview';
import type { MetadataRoute } from 'next';
import { getPostSlugs } from '@/lib/blog';

const BASE = 'https://driveexotiq.com';

/**
 * Source of truth for crawlable routes. Expand this as the redesign adds
 * /tour, /tour/[city], /drives, /sponsor, /community, /marketplace, /blog.
 * (Kept to currently-live routes for now so the sitemap never lists a 404.)
 */
const ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/tour', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/drives', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/sponsor', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/marketplace', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/apply', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/sms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/dmca', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  if (isPreview) return [];

  const now = new Date();
  const routes = ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
  // Blog posts come from the content directory, so new stories land in the
  // sitemap without touching this file.
  const posts: MetadataRoute.Sitemap = getPostSlugs().map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  return [...routes, ...posts];
}
