import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
const text = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8');
function section(name) {
  return text.split(`[${name}]`)[1]?.split(/^\[/m)[0] || '';
}
test('production and review deploy contexts have independent indexing and canonical settings', () => {
  assert.match(section('context.production.environment'), /NEXT_PUBLIC_SITE_MODE\s*=\s*"production"/);
  assert.match(section('context.production.environment'), /NEXT_PUBLIC_SITE_URL\s*=\s*"https:\/\/driveexotiq.com"/);
  assert.doesNotMatch(section('build.environment'), /astra-review/);
  for (const context of ['deploy-preview', 'branch-deploy', 'astra-review']) {
    assert.match(section(`context.${context}.environment`), /NEXT_PUBLIC_SITE_MODE\s*=\s*"preview"/);
  }
});
