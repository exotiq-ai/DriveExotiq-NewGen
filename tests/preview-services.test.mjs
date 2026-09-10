import assert from 'node:assert/strict';
import { register } from 'node:module';
import { test, after } from 'node:test';

register('./preview-loader.mjs', import.meta.url);
process.env.NEXT_PUBLIC_SITE_MODE = 'preview';
// Invalid credentials fail immediately if a route initializes Supabase.
process.env.NEXT_PUBLIC_SUPABASE_URL = 'invalid-preview-provider-url';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'preview-test-only';
process.env.RESEND_API_KEY = 'preview-test-only';
process.env.ADMIN_PASSWORD = 'preview-test-only';
const originalFetch = globalThis.fetch;
const outbound = [];
globalThis.fetch = async (input) => {
  outbound.push(String(input));
  throw new Error('Preview attempted an outbound provider request');
};
after(() => {
  globalThis.fetch = originalFetch;
  assert.deepEqual(outbound, [], 'Preview must never attempt provider network access');
});

test('default preview form status is explicitly non-converting', async () => {
  const { isFormPreview, formSubmissionStatus } = await import('../lib/preview.ts');
  assert.equal(isFormPreview, true);
  assert.equal(formSubmissionStatus, 'preview');
});

const fixtures = [
  ['applications', 'application', {
    fullName: 'Preview Driver', email: 'preview@example.com', phone: '5555550100',
    currentCity: 'Phoenix', cityOfInterest: 'Denver',
    briefIntro: 'I enjoy driving beautiful roads.', agreedToTerms: true,
  }],
  ['waitlist', 'waitlist', { email: 'preview@example.com', city: 'Phoenix', desiredCar: '911' }],
  ['booking-leads', 'lead', { firstName: 'Preview', lastName: 'Driver', email: 'preview@example.com', phone: '5555550100' }],
  ['sponsor-inquiries', 'inquiry', { name: 'Preview Partner', email: 'preview@example.com', interest: 'tour' }],
];

for (const [path, entity, body] of fixtures) {
  test(`${path}: valid preview submission succeeds without a stored record or providers`, async () => {
    const { POST } = await import(`../app/api/${path}/route.ts`);
    const response = await POST(new Request(`http://localhost/api/${path}`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
    }));
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { success: true, preview: true, [entity]: null });
  });
  test(`${path}: preview preserves field validation`, async () => {
    const { POST } = await import(`../app/api/${path}/route.ts`);
    const response = await POST(new Request(`http://localhost/api/${path}`, {
      method: 'POST', body: JSON.stringify({ ...body, email: 'invalid' }),
    }));
    assert.equal(response.status, 400);
    const payload = await response.json();
    assert.equal(payload.error, 'Invalid form data');
    assert.ok(payload.details.email.length > 0);
  });
}

for (const [path, methods] of [
  ['applications', ['GET', 'PATCH']],
  ['instagram', ['GET', 'POST', 'PATCH', 'DELETE']],
]) {
  for (const method of methods) {
    test(`admin/${path} ${method}: disabled even with valid admin authorization`, async () => {
      const route = await import(`../app/api/admin/${path}/route.ts`);
      const response = await route[method](new Request(`http://localhost/api/admin/${path}`, {
        method, headers: { authorization: 'Bearer preview-test-only' },
        ...(method === 'GET' ? {} : { body: '{}' }),
      }));
      assert.equal(response.status, 404);
      assert.deepEqual(await response.json(), { error: 'Not found' });
    });
  }
}

test('preview robots excludes every crawler and advertises no production sitemap', async () => {
  const { default: robots } = await import('../app/robots.ts');
  assert.deepEqual(robots(), { rules: { userAgent: '*', disallow: '/' } });
});

test('preview sitemap exposes no production URLs', async () => {
  const { default: sitemap } = await import('../app/sitemap.ts');
  assert.deepEqual(sitemap(), []);
});

test('preview middleware marks documents, API, metadata, assets, and errors noindex', async () => {
  const { middleware } = await import('../middleware.ts');
  const { NextRequest } = await import('next/server.js');
  for (const path of ['/', '/apply', '/api/waitlist', '/robots.txt', '/sitemap.xml', '/_next/static/example.js', '/missing']) {
    const response = middleware(new NextRequest(`http://localhost${path}`));
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow', path);
    assert.equal(response.headers.get('x-middleware-next'), '1', path);
  }
});

test('preview middleware disables admin pages and keeps the noindex header', async () => {
  const { middleware } = await import('../middleware.ts');
  const { NextRequest } = await import('next/server.js');
  for (const path of ['/admin', '/admin/applications']) {
    const response = middleware(new NextRequest(`http://localhost${path}`));
    assert.equal(response.status, 404);
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  }
});

test('preview honeypot submissions remain silent drops without a stored record', async () => {
  for (const path of ['applications', 'waitlist', 'sponsor-inquiries']) {
    const { POST } = await import(`../app/api/${path}/route.ts`);
    const response = await POST(new Request(`http://localhost/api/${path}`, {
      method: 'POST', body: JSON.stringify({ website: 'bot.example' }),
    }));
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { success: true, preview: true });
  }
});
