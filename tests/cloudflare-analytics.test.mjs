import assert from 'node:assert/strict';
import { register } from 'node:module';
import { test } from 'node:test';
import vm from 'node:vm';

register('./preview-loader.mjs', import.meta.url);
const { cloudflareAnalyticsBootstrap } = await import('../lib/cloudflare-analytics.ts').catch(() => ({}));
const token = '0123456789abcdef0123456789abcdef';

function script(overrides = {}) {
  assert.equal(typeof cloudflareAnalyticsBootstrap, 'function');
  return cloudflareAnalyticsBootstrap({ production: true, preview: false, token, ...overrides });
}

function browser(url = 'https://driveexotiq.com/') {
  const nodes = [];
  const document = {
    getElementById: id => nodes.find(node => node.id === id),
    createElement: tag => ({ tag, attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } }),
    head: { appendChild: node => nodes.push(node) },
  };
  const window = { location: new URL(url) };
  return { nodes, window, run: source => vm.runInNewContext(source, { window, document }) };
}

test('no Cloudflare bootstrap without production mode and a valid public token', () => {
  for (const options of [{ production: false }, { preview: true }, { token: '' }, { token: undefined }, { token: 'not-a-token' }, { token: '</script>' }]) {
    assert.equal(script(options), null);
  }
});

test('production hosts load one manual beacon with automatic SPA tracking disabled', () => {
  for (const host of ['driveexotiq.com', 'www.driveexotiq.com']) {
    const page = browser(`https://${host}/drives`);
    page.run(script());
    page.run(script());
    assert.equal(page.nodes.length, 1);
    const beacon = page.nodes[0];
    assert.equal(beacon.tag, 'script');
    assert.equal(beacon.src, 'https://static.cloudflareinsights.com/beacon.min.js');
    assert.equal(beacon.type, 'module');
    assert.equal(beacon.async, true);
    assert.deepEqual(JSON.parse(beacon.attributes['data-cf-beacon']), { token, spa: false });
  }
});

test('preview, local, lookalike hosts and non-HTTPS pages never load the beacon', () => {
  for (const url of [
    'https://astra-review--driveexotiq-astra.netlify.app/',
    'https://driveexotiq-astra.netlify.app/',
    'http://localhost:3000/',
    'https://driveexotiq.com.example.org/',
    'https://staging.driveexotiq.com/',
    'http://driveexotiq.com/',
  ]) {
    const page = browser(url); page.run(script());
    assert.equal(page.nodes.length, 0, url);
  }
});

test('admin/API paths and encoded equivalents are excluded at lazy execution time', () => {
  for (const path of ['/admin', '/admin/', '/admin/instagram', '/api', '/api/applications', '/%61dmin', '/%61pi/applications', '/ADMIN', '/%']) {
    const page = browser('https://driveexotiq.com/');
    // The browser can navigate after hydration but before Next runs lazyOnload.
    page.window.location = new URL(`https://driveexotiq.com${path}`);
    page.run(script());
    assert.equal(page.nodes.length, 0, path);
  }
});
