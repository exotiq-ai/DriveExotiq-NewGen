import { register } from 'node:module';
import test from 'node:test';
import assert from 'node:assert/strict';
register('./preview-loader.mjs', import.meta.url);

test('explicit tracking never forwards contact data or raw CTA queries to Plausible', async () => {
  const calls = [];
  globalThis.window = { location: { pathname: '/apply' }, plausible: (...args) => calls.push(args) };
  const { track } = await import('../lib/analytics.ts');
  track('CTA', { href: '/apply?email=person@example.com', label: 'Hello Person', email: 'person@example.com' });
  assert.deepEqual(calls, [['CTA', { props: { href: '/apply' } }]]);
  delete globalThis.window;
});
