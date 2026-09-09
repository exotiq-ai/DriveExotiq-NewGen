import assert from 'node:assert/strict';
import { register } from 'node:module';
import { beforeEach, test } from 'node:test';

process.env.NEXT_PUBLIC_SITE_MODE = 'preview';
process.env.NEXT_PUBLIC_FORM_MODE = 'live';
process.env.PREVIEW_TEST_PROVIDER_MOCK = '1';
register('./preview-loader.mjs', import.meta.url);

const { providerCalls, resetProviderCalls, failNextDatabaseWrite } = await import('./preview-provider-mocks.mjs');
beforeEach(resetProviderCalls);

const fixtures = [
  {
    path: 'applications', table: 'de_applications', entity: 'application', emailKind: 'application',
    body: { fullName: 'Live Driver', email: 'DRIVER@EXAMPLE.COM', phone: '5555550100', currentCity: 'Phoenix', cityOfInterest: 'Denver', interest: 'drives', briefIntro: 'I enjoy driving beautiful roads.', agreedToTerms: true },
    expected: { full_name: 'Live Driver', email: 'driver@example.com', current_city: 'Phoenix', city_of_interest: 'Denver' },
  },
  {
    path: 'waitlist', table: 'de_waitlist', entity: 'waitlist', emailKind: 'waitlist',
    body: { email: 'DRIVER@EXAMPLE.COM', city: 'Phoenix', desiredCar: '911' },
    expected: { email: 'driver@example.com', city: 'Phoenix', desired_car: '911', source: 'marketplace' },
  },
  {
    path: 'booking-leads', table: 'de_booking_leads', entity: 'lead', emailKind: null,
    body: { firstName: 'Live', lastName: 'Driver', email: 'DRIVER@EXAMPLE.COM', phone: '5555550100' },
    expected: { first_name: 'Live', last_name: 'Driver', email: 'driver@example.com', status: 'lead', location: 'phoenix' },
  },
  {
    path: 'sponsor-inquiries', table: 'de_sponsor_inquiries', entity: 'inquiry', emailKind: 'sponsor',
    body: { name: 'Live Partner', company: 'Example Co', email: 'PARTNER@EXAMPLE.COM', interest: 'tour' },
    expected: { name: 'Live Partner', company: 'Example Co', email: 'partner@example.com', interest: 'tour' },
  },
];

for (const fixture of fixtures) {
  test(`${fixture.path}: explicit live form mode on a preview stores the validated lead before success`, async () => {
    const { POST } = await import(`../app/api/${fixture.path}/route.ts`);
    const response = await POST(new Request(`http://localhost/api/${fixture.path}`, {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.1' }, body: JSON.stringify(fixture.body),
    }));
    assert.equal(response.status, 201);
    const payload = await response.json();
    assert.equal(payload.success, true);
    assert.equal(payload.preview, undefined);
    assert.equal(payload[fixture.entity].id, `${fixture.table}-id`);
    assert.equal(providerCalls.inserts.length, 1);
    assert.equal(providerCalls.inserts[0].table, fixture.table);
    for (const [column, expected] of Object.entries(fixture.expected)) {
      assert.equal(providerCalls.inserts[0].rows[0][column], expected, column);
    }
    assert.deepEqual(providerCalls.emails.map(({ kind }) => kind), fixture.emailKind ? [fixture.emailKind] : []);
  });

  test(`${fixture.path}: database failure returns an error and never reports or emails a lead`, async () => {
    failNextDatabaseWrite({ code: 'XX000', message: 'controlled database failure' });
    const { POST } = await import(`../app/api/${fixture.path}/route.ts`);
    const originalError = console.error;
    console.error = () => {};
    try {
      const response = await POST(new Request(`http://localhost/api/${fixture.path}`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(fixture.body),
      }));
      assert.equal(response.status, 500);
      assert.equal((await response.json()).success, undefined);
      assert.deepEqual(providerCalls.emails, []);
    } finally {
      console.error = originalError;
    }
  });

  test(`${fixture.path}: malformed live-form payload is rejected before provider access`, async () => {
    const { POST } = await import(`../app/api/${fixture.path}/route.ts`);
    const response = await POST(new Request(`http://localhost/api/${fixture.path}`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...fixture.body, email: 'invalid' }),
    }));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error, 'Invalid form data');
    assert.deepEqual(providerCalls, { inserts: [], emails: [] });
  });
}

for (const path of ['applications', 'waitlist', 'sponsor-inquiries']) {
  test(`${path}: live-form honeypot remains a zero-side-effect silent drop`, async () => {
    const { POST } = await import(`../app/api/${path}/route.ts`);
    const response = await POST(new Request(`http://localhost/api/${path}`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ website: 'bot.example' }),
    }));
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { success: true });
    assert.deepEqual(providerCalls, { inserts: [], emails: [] });
  });
}

test('live forms do not lift preview isolation for SEO or admin routes', async () => {
  const { isPreview, isFormPreview, formSubmissionStatus } = await import('../lib/preview.ts');
  const { default: robots } = await import('../app/robots.ts');
  assert.equal(isPreview, true);
  assert.equal(isFormPreview, false);
  assert.equal(formSubmissionStatus, 'stored');
  assert.deepEqual(robots(), { rules: { userAgent: '*', disallow: '/' } });
  const admin = await import('../app/api/admin/applications/route.ts');
  const response = await admin.GET(new Request('http://localhost/api/admin/applications', { headers: { authorization: 'Bearer preview-test-only' } }));
  assert.equal(response.status, 404);
});

test('live forms on a preview render stored-application thank-you copy while remaining noindex', async () => {
  const { default: ThankYouPage, metadata } = await import('../app/thank-you/page.tsx');
  const text = [];
  const visit = (node) => {
    if (typeof node === 'string') text.push(node);
    else if (Array.isArray(node)) node.forEach(visit);
    else if (node?.props) visit(node.props.children);
  };
  visit(ThankYouPage());
  const copy = text.join(' ').replace(/\s+/g, ' ').trim();
  assert.match(copy, /YOU’RE ON THE LIST/);
  assert.match(copy, /Good things are ahead\./);
  assert.match(copy, /Thanks for the introduction\./);
  assert.doesNotMatch(copy, /no information was saved|PREVIEW COMPLETE/);
  assert.equal(metadata.title, 'You’re on the list');
  assert.deepEqual(metadata.robots, { index: false, follow: false });
});
