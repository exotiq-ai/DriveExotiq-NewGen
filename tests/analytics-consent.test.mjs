import { register } from 'node:module';
import test from 'node:test';
import assert from 'node:assert/strict';
register('./preview-loader.mjs', import.meta.url);
const consent = await import('../lib/cookie-consent.ts');

test('malformed stored preferences cannot grant analytics consent', () => {
  globalThis.window = {};
  globalThis.localStorage = { getItem: () => JSON.stringify({ analytics: 'yes', functional: true }) };
  assert.equal(consent.getConsentPreferences(), null);
  delete globalThis.window; delete globalThis.localStorage;
});

test('clearing consent immediately notifies the analytics lifecycle', () => {
  const events = [];
  globalThis.window = { dispatchEvent: event => events.push(event.type) };
  globalThis.localStorage = { removeItem() {} };
  consent.clearConsent();
  assert.deepEqual(events, ['cookie-consent-changed']);
  delete globalThis.window; delete globalThis.localStorage;
});

test('configured preview offers consent while disabled preview and existing choices stay suppressed', () => {
  assert.equal(consent.shouldPromptConsent(true, true, false), true);
  assert.equal(consent.shouldPromptConsent(true, false, false), false);
  assert.equal(consent.shouldPromptConsent(true, true, true), false);
  assert.equal(consent.shouldPromptConsent(false, false, false), true);
});
