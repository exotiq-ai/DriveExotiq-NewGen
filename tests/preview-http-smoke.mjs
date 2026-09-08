// Run against a local Next preview server after the route-module tests pass:
// node tests/preview-http-smoke.mjs http://127.0.0.1:3000
import assert from 'node:assert/strict';

const base = new URL(process.argv[2] || 'http://127.0.0.1:3000');
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname), 'Local preview only');
const checked = [];
async function check(path, options = {}) {
  const response = await fetch(new URL(path, base), options);
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow', path);
  checked.push(`${options.method || 'GET'} ${path}: ${response.status}, noindex`);
  return response;
}

// Verify preview mode before exercising any submission endpoint.
const robots = await check('/robots.txt');
assert.equal(robots.status, 200);
assert.match(await robots.text(), /Disallow: \/\s*$/m);
const sitemap = await check('/sitemap.xml');
assert.equal(sitemap.status, 200);
assert.doesNotMatch(await sitemap.text(), /<loc>/);
const page = await check('/');
assert.equal(page.status, 200);
const html = await page.text();
const asset = html.match(/src="([^" ]*\/_next\/static\/[^" ]+)"/);
if (asset) assert.equal((await check(asset[1].replaceAll('&amp;', '&'))).status, 200);
assert.equal((await check('/preview-missing-page')).status, 404);
assert.equal((await check('/admin')).status, 404);

const fixtures = [
  ['applications', 'application', {
    fullName: 'Preview Driver', email: 'preview@example.com', phone: '5555550100',
    currentCity: 'Phoenix', cityOfInterest: 'Denver', briefIntro: 'I enjoy driving beautiful roads.', agreedToTerms: true,
  }],
  ['waitlist', 'waitlist', { email: 'preview@example.com' }],
  ['booking-leads', 'lead', { firstName: 'Preview', lastName: 'Driver', email: 'preview@example.com', phone: '5555550100' }],
  ['sponsor-inquiries', 'inquiry', { name: 'Preview Partner', email: 'preview@example.com', interest: 'tour' }],
];
for (const [path, entity, body] of fixtures) {
  const valid = await check(`/api/${path}`, { method: 'POST', body: JSON.stringify(body) });
  assert.equal(valid.status, 201);
  assert.deepEqual(await valid.json(), { success: true, preview: true, [entity]: null });
  const invalid = await check(`/api/${path}`, { method: 'POST', body: JSON.stringify({ ...body, email: 'invalid' }) });
  assert.equal(invalid.status, 400);
  assert.ok((await invalid.json()).details.email.length > 0);
}
for (const [path, methods] of [['applications', ['GET', 'PATCH']], ['instagram', ['GET', 'POST', 'PATCH', 'DELETE']]]) {
  for (const method of methods) {
    const response = await check(`/api/admin/${path}`, { method });
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: 'Not found' });
  }
}
console.log(checked.join('\n'));
console.log(`${checked.length} local preview HTTP checks passed.`);
