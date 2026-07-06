import type { MetadataRoute } from 'next';

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
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
