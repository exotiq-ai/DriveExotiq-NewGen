import assert from 'node:assert/strict';
import { register } from 'node:module';
import { test } from 'node:test';

register('./preview-loader.mjs', import.meta.url);
delete process.env.NEXT_PUBLIC_SITE_MODE;
delete process.env.ADMIN_PASSWORD;
delete process.env.NEXT_PUBLIC_SUPABASE_URL;
delete process.env.SUPABASE_SERVICE_ROLE_KEY;

test('without the preview flag production crawlers and sitemap remain enabled', async () => {
  const { default: robots } = await import('../app/robots.ts');
  const { default: sitemap } = await import('../app/sitemap.ts');
  assert.equal(robots().sitemap, 'https://driveexotiq.com/sitemap.xml');
  assert.ok(sitemap().some(({ url }) => url === 'https://driveexotiq.com/apply'));
});

test('without the preview flag middleware permits admin and adds no noindex header', async () => {
  const { middleware } = await import('../middleware.ts');
  const { NextRequest } = await import('next/server.js');
  const response = middleware(new NextRequest('http://localhost/admin'));
  assert.equal(response.headers.get('x-middleware-next'), '1');
  assert.equal(response.headers.get('X-Robots-Tag'), null);
});

test('without the preview flag admin authentication still rejects unauthenticated users', async () => {
  const { GET } = await import('../app/api/admin/applications/route.ts');
  const response = await GET(new Request('http://localhost/api/admin/applications'));
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: 'Unauthorized' });
});

test('without the preview flag valid forms still require a configured real persistence service', async () => {
  const { POST } = await import('../app/api/waitlist/route.ts');
  const originalError = console.error;
  console.error = () => {}; // Expected missing-provider failure; no secrets or network.
  try {
    const response = await POST(new Request('http://localhost/api/waitlist', {
      method: 'POST', body: JSON.stringify({ email: 'preview@example.com' }),
    }));
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: 'Internal server error' });
  } finally {
    console.error = originalError;
  }
});
