import type { MetadataRoute } from 'next';

const BASE = 'https://driveexotiq.com';

// AI answer-engine + search crawlers are explicitly welcomed on public content
// (this is the AEO play — be citable). /admin and /api are kept out of the index.
export default function robots(): MetadataRoute.Robots {
  const aiBots = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'anthropic-ai',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot-Extended',
    'Amazonbot',
    'Bytespider',
    'CCBot',
  ];

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
      ...aiBots.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
