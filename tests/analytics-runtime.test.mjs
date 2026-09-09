import { register } from 'node:module';
import test from 'node:test';
import assert from 'node:assert/strict';
register('./preview-loader.mjs', import.meta.url);

const runtimeModule = await import('../lib/analytics-runtime.ts').catch(() => ({}));
const config = { key: 'phc_test', host: 'https://eu.i.posthog.com', environment: 'production' };

function fixture(selected = config) {
  const state = { consent: false, pathname: '/apply', origin: 'https://driveexotiq.com', ready: true };
  const calls = [];
  let options;
  let loads = 0;
  const sdk = {
    init(key, settings) { calls.push(['init', key]); options = settings; return sdk; },
    capture(event, props) { const result = options.before_send({ event, properties: props }); if (result) calls.push(['event', result]); },
    set_config(settings) { calls.push(['config', settings]); },
    opt_in_capturing() { calls.push(['in']); },
    opt_out_capturing() { calls.push(['out']); },
    reset() { calls.push(['reset']); },
    startSessionRecording() { calls.push(['replay']); },
    stopSessionRecording() { calls.push(['stop']); },
  };
  assert.equal(typeof runtimeModule.createAnalyticsRuntime, 'function', 'consent-aware runtime must exist');
  const runtime = runtimeModule.createAnalyticsRuntime(selected, () => state, async () => { loads++; return sdk; });
  return { state, calls, runtime, options: () => options, loads: () => loads };
}

test('missing config, absent consent, deferred initial work and admin prevent SDK loading', async () => {
  const noKey = fixture(null); noKey.state.consent = true; await noKey.runtime.sync(); assert.equal(noKey.loads(), 0);
  const f = fixture(); await f.runtime.sync(); assert.equal(f.loads(), 0);
  f.state.consent = true; f.state.ready = false; await f.runtime.sync(); assert.equal(f.loads(), 0);
  f.state.ready = true; f.state.pathname = '/admin/leads'; await f.runtime.sync(); assert.equal(f.loads(), 0);
});

test('consent starts once, route updates deduplicate pageviews, revoke stops and drops capture', async () => {
  const f = fixture(); f.state.consent = true;
  await f.runtime.sync(); await f.runtime.sync();
  assert.equal(f.loads(), 1);
  assert.equal(f.calls.filter(c => c[0] === 'event' && c[1].event === '$pageview').length, 1);
  f.state.pathname = '/tour'; await f.runtime.sync();
  assert.equal(f.calls.filter(c => c[0] === 'event' && c[1].event === '$pageview').length, 2);
  f.state.consent = false; await f.runtime.sync();
  assert.ok(f.calls.some(c => c[0] === 'stop')); assert.ok(f.calls.some(c => c[0] === 'out')); assert.ok(f.calls.some(c => c[0] === 'reset'));
  assert.ok(f.calls.some(c => c[0] === 'config' && c[1].capture_heatmaps === false && c[1].autocapture === false), 'revocation must discard heatmap collection, not just suppress its next upload');
  const count = f.calls.length; f.runtime.capture('Signup', { form: 'apply', status: 'stored' }); assert.equal(f.calls.length, count);
  assert.equal(f.options().before_send({ event: '$snapshot', properties: { $snapshot_data: 'secret' } }), null);
});

test('revocation during async import never initializes the SDK', async () => {
  let resolve; const state = { consent: true, ready: true, pathname: '/', origin: 'https://driveexotiq.com' };
  const calls = [];
  const runtime = runtimeModule.createAnalyticsRuntime(config, () => state, () => new Promise(r => { resolve = r; }));
  const pending = runtime.sync(); state.consent = false; await runtime.sync();
  resolve({ init() { calls.push('init'); } }); await pending; assert.deepEqual(calls, []);
});

test('SDK event boundary strips contact data, query strings and unknown properties', async () => {
  const f = fixture(); f.state.consent = true; await f.runtime.sync();
  const clean = f.options().before_send({ event: 'Signup', properties: {
    form: 'apply', status: 'stored', email: 'person@example.com', phone: '5551234567', intro: 'private',
    $current_url: 'https://driveexotiq.com/apply?email=person@example.com#secret',
    $referrer: 'https://example.com/?email=person@example.com',
    $set: { email: 'person@example.com' },
  } });
  assert.equal(clean.properties.$current_url, 'https://driveexotiq.com/apply');
  assert.equal(clean.properties.form, 'apply');
  assert.equal(JSON.stringify(clean).includes('person@example.com'), false);
  assert.equal(JSON.stringify(clean).includes('5551234567'), false);
  const recording = f.options().session_recording;
  assert.equal(recording.maskAllInputs, true); assert.equal(recording.maskTextSelector, '*');
  assert.equal(recording.recordBody, false); assert.equal(recording.recordHeaders, false);
  assert.equal(recording.maskCapturedNetworkRequestFn({ name: 'https://driveexotiq.com/api/apply', method: 'POST', requestBody: 'secret' }), null);
  assert.equal(recording.maskCapturedNetworkRequestFn({ name: 'https://driveexotiq.com/apply?email=secret' }).name, 'https://driveexotiq.com/apply');
});

test('preview requires an explicit key and permits deliberate reuse with preview tagging', () => {
  assert.equal(runtimeModule.analyticsConfig({ preview: true, production: true, key: 'phc_prod', region: 'us' }), null);
  assert.deepEqual(runtimeModule.analyticsConfig({ preview: true, production: true, key: 'phc_prod', previewKey: 'phc_prod', region: 'us' }), { key: 'phc_prod', host: 'https://us.i.posthog.com', environment: 'preview' });
  assert.deepEqual(runtimeModule.analyticsConfig({ preview: true, production: true, key: 'phc_prod', previewKey: 'phc_preview', region: 'eu' }), { key: 'phc_preview', host: 'https://eu.i.posthog.com', environment: 'preview' });
  assert.equal(runtimeModule.analyticsConfig({ preview: false, production: false, key: 'phc_prod', region: 'us' }), null);
});

test('distinct detail routes count separately without sending their sensitive path segments', async () => {
  const f = fixture(); f.state.consent = true;
  f.state.pathname = '/journal/first-post'; await f.runtime.sync();
  f.state.pathname = '/journal/second-post'; await f.runtime.sync();
  const views = f.calls.filter(c => c[0] === 'event' && c[1].event === '$pageview');
  assert.equal(views.length, 2);
  assert.equal(views[1][1].properties.$pathname, '/journal/detail');
});

test('pageleave retains the preceding safe URL and heatmaps redact URL keys', async () => {
  const f = fixture(); f.state.consent = true; await f.runtime.sync();
  f.state.pathname = '/tour';
  const event = f.options().before_send({ event: '$pageleave', properties: { $current_url: 'https://driveexotiq.com/apply?email=secret' } });
  assert.equal(event.properties.$current_url, 'https://driveexotiq.com/apply');
  const heat = f.options().before_send({ event: '$$heatmap', properties: { $heatmap_data: { 'https://driveexotiq.com/tour?email=secret': [{ x: 12, y: 34, type: 'click', text: 'secret' }] } } });
  assert.deepEqual(heat.properties.$heatmap_data, { 'https://driveexotiq.com/tour': [{ x: 12, y: 34, type: 'click' }] });
});

test('acquisition uses fixed channel categories without transmitting raw UTMs or referrer queries', async () => {
  const f = fixture(); f.state.consent = true;
  f.state.search = '?utm_medium=email&utm_campaign=person@example.com';
  f.state.referrer = 'https://example.com/?private=secret';
  await f.runtime.sync();
  const view = f.calls.find(c => c[0] === 'event')[1];
  assert.equal(view.properties.acquisition_channel, 'email');
  assert.equal(JSON.stringify(view).includes('person@example.com'), false);
});

test('malformed heatmap points cannot throw or leak arbitrary numeric properties', async () => {
  const f = fixture(); f.state.consent = true; await f.runtime.sync();
  const event = f.options().before_send({ event: '$$heatmap', properties: { $heatmap_data: {
    'https://driveexotiq.com/apply?email=secret': [null, 'secret', 42, { x: 1, y: 2, type: 'click', phone: 5551234567 }],
  } } });
  assert.deepEqual(event.properties.$heatmap_data, { 'https://driveexotiq.com/apply': [{ x: 1, y: 2, type: 'click' }] });
});

test('sanitizer retains the configured ingestion token and disables person processing', async () => {
  const f = fixture(); f.state.consent = true; await f.runtime.sync();
  const result = f.options().before_send({ event: '$pageview', properties: { token: 'untrusted_raw_token', $process_person_profile: true, email: 'person@example.com' } });
  assert.equal(result.properties.token, config.key);
  assert.equal(result.properties.$process_person_profile, false);
  assert.equal(result.properties.email, undefined);
  const { knownUnsafeEditableEventProperty } = await import('@posthog/core');
  for (const key of knownUnsafeEditableEventProperty) {
    if (key === 'token') assert.ok(result.properties[key], 'actual SDK drops captures without token');
  }
});
