import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { register } from 'node:module';
import { test } from 'node:test';

register('./preview-loader.mjs', import.meta.url);
delete process.env.NEXT_PUBLIC_SITE_MODE;

// Exercise the route and the real editorial content, not a copy of its URL list.
test('sitemap includes real public pages and stories without invented modification dates', async () => {
  const { default: sitemap } = await import('../app/sitemap.ts');
  const { getPostSlugs } = await import('../lib/blog.ts');
  const entries = sitemap();
  const urls = entries.map(({ url }) => url);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.includes('https://driveexotiq.com'));
  for (const entry of entries) {
    const url = new URL(entry.url);
    assert.equal(url.origin, 'https://driveexotiq.com');
    assert.doesNotMatch(url.pathname, /^\/(?:api|admin|thank-you)(?:\/|$)/);
    assert.equal(Object.hasOwn(entry, 'lastModified'), false,
      `${url.pathname} has no recorded editorial modification date`);
    if (!url.pathname.startsWith('/blog/')) {
      const relative = url.pathname === '/' ? '' : url.pathname.slice(1) + '/';
      assert.ok(existsSync(new URL(`../app/${relative}page.tsx`, import.meta.url)), entry.url);
      const page = readFileSync(new URL(`../app/${relative}page.tsx`, import.meta.url), 'utf8');
      assert.ok(page.includes(`canonical: "${url.pathname}"`), `${url.pathname} needs its own canonical`);
      assert.match(page, /title:\s*["']/);
    }
  }
  for (const slug of getPostSlugs()) {
    assert.ok(urls.includes(`https://driveexotiq.com/blog/${slug}`));
  }
});
