import { register } from 'node:module';
import test from 'node:test';
import assert from 'node:assert/strict';
register('./preview-loader.mjs', import.meta.url);

test('media lifecycle emits bounded quartiles once and distinguishes replay and failures', async () => {
  const { createMediaAnalytics } = await import('../lib/analytics-media.ts');
  const calls = [];
  const media = createMediaAnalytics('hero', (...args) => calls.push(args));
  media.play(); media.play(); media.progress(3, 10); media.progress(3, 10);
  media.progress(8, 10); media.complete(); media.complete();
  media.play(); media.failure(); media.failure();
  assert.deepEqual(calls.map(([name]) => name), ['Video Play', 'Video Progress', 'Video Progress', 'Video Progress', 'Video Progress', 'Video Complete', 'Video Replay', 'Video Play', 'Video Failure']);
  assert.deepEqual(calls.filter(([name]) => name === 'Video Progress').map(([,props]) => props.depth), [25,50,75,100]);
  assert.ok(calls.every(([,props]) => props.video === 'hero'));
});
test('loop wrap completes once and invalid duration produces no progress', async () => {
  const { createMediaAnalytics } = await import('../lib/analytics-media.ts');
  const calls = [];
  const media = createMediaAnalytics('road', (...args) => calls.push(args));
  media.play(); media.progress(1, NaN); media.progress(9.9,10,true); media.progress(0.1,10,true); media.progress(9.9,10,true); media.progress(0.1,10,true);
  media.play(false);
  assert.equal(calls.filter(([name]) => name === 'Video Complete').length, 1);
  assert.equal(calls.filter(([name]) => name === 'Video Play').length, 1);
});
test('media and CTA properties use fixed categories and discard arbitrary URLs', async () => {
  const { safeAnalyticsProps, analyticsEvents } = await import('../lib/analytics-privacy.ts');
  assert.equal(analyticsEvents.has('Video Complete'),true);
  assert.deepEqual(safeAnalyticsProps({video:'film',action:'watch-film',url:'https://private.test',depth:25}),{video:'film',action:'watch-film',depth:25});
  assert.deepEqual(safeAnalyticsProps({video:'private',action:'person@example.com'}),{});
});
