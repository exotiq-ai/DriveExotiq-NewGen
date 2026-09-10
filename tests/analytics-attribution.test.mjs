import { register } from 'node:module';
import test from 'node:test';
import assert from 'node:assert/strict';
register('./preview-loader.mjs', import.meta.url);
const mod = await import('../lib/analytics-attribution.ts').catch(() => ({}));

const tags = '?utm_source=linktree&utm_medium=referral&utm_campaign=profile_hub&utm_content=drivers';
const expected = { utm_source: 'linktree', utm_medium: 'referral', utm_campaign: 'profile_hub', utm_content: 'drivers' };
function fixture() {
  assert.equal(typeof mod.createCampaignAttribution, 'function');
  const map = new Map(); let now = 1000;
  const storage = { getItem: k => map.get(k) ?? null, setItem: (k,v) => map.set(k,v), removeItem: k => map.delete(k) };
  const make = () => mod.createCampaignAttribution(() => storage, () => now);
  return { make, map, advance: ms => { now += ms; } };
}
test('approved tags survive untagged navigation and reload in the same tab', () => {
  const f = fixture(), campaign = f.make();
  campaign.capture(tags); assert.deepEqual(campaign.properties(), expected);
  campaign.capture(''); assert.deepEqual(campaign.properties(), expected);
  const reloaded = f.make(); reloaded.capture(''); assert.deepEqual(reloaded.properties(), expected);
});
test('unknown values, duplicate fields, contact details and raw URL data never persist', () => {
  const f = fixture(), campaign = f.make();
  campaign.capture('?utm_source=linktree&utm_campaign=person@example.com&utm_content=drivers&utm_content=secret&email=private@example.com&fbclid=secret');
  assert.deepEqual(campaign.properties(), { utm_source: 'linktree' });
  assert.ok(!JSON.stringify([...f.map.values()]).includes('secret'));
  assert.ok(!JSON.stringify([...f.map.values()]).includes('@'));
});
test('revocation clears memory and storage; attribution expires after thirty minutes', () => {
  const f = fixture(), campaign = f.make(); campaign.capture(tags); campaign.clear();
  assert.deepEqual(campaign.properties(), {}); assert.equal(f.map.size, 0);
  campaign.capture(tags); f.advance(30 * 60 * 1000 + 1);
  assert.deepEqual(campaign.properties(), {}); assert.equal(f.map.size, 0);
});
test('blocked storage still permits consented in-memory attribution', () => {
  assert.equal(typeof mod.createCampaignAttribution, 'function');
  const campaign = mod.createCampaignAttribution(() => { throw new Error('blocked'); });
  campaign.capture(tags); assert.deepEqual(campaign.properties(), expected);
  campaign.clear(); assert.deepEqual(campaign.properties(), {});
});
