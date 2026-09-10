import { register } from 'node:module';
import test from 'node:test';
import assert from 'node:assert/strict';
register('./preview-loader.mjs', import.meta.url);

test('retired Plausible receives no events even if a stale global exists', async () => {
  const calls = [];
  globalThis.window = { location: { pathname: '/apply' }, plausible: (...args) => calls.push(args) };
  const { track } = await import('../lib/analytics.ts');
  track('CTA', { href: '/apply?email=person@example.com', label: 'Hello Person', email: 'person@example.com' });
  assert.deepEqual(calls, []);
  delete globalThis.window;
});
