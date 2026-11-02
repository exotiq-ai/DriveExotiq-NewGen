import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { validateDeploymentContext, verifyAstraSource } from '../scripts/verify-deployment-source.mjs';

const production = {
  NETLIFY: 'true', CONTEXT: 'production', BRANCH: 'production-astra',
  SITE_ID: 'a9dc6785-ca82-407f-8899-edc4ebf23fd0',
  NEXT_PUBLIC_SITE_MODE: 'production', NEXT_PUBLIC_SITE_URL: 'https://driveexotiq.com',
  NEXT_PUBLIC_FORM_MODE: 'live',
};

test('verified Astra production context accepts its dedicated branch and site', () => {
  assert.doesNotThrow(() => validateDeploymentContext(production, 'production-astra'));
});

for (const branch of ['main', 'newgen-main', 'codex/astra-awwwards']) {
  test(`production rejects the ${branch} source branch`, () => {
    assert.throws(() => validateDeploymentContext({ ...production, BRANCH: branch }, branch), /production-astra/);
  });
}

test('production rejects a claimed release branch when the checkout is another branch', () => {
  assert.throws(() => validateDeploymentContext(production, 'main'), /checkout branch/);
});

test('detached CI checkout uses the provider branch identity', () => {
  assert.doesNotThrow(() => validateDeploymentContext(production, null));
});

test('production never accepts the isolated preview project', () => {
  assert.throws(() => validateDeploymentContext({ ...production, SITE_ID: 'f499ad01-b775-4c7d-901f-98f879c83d94' }, 'production-astra'), /production site/);
});

for (const key of ['SITE_ID', 'BRANCH', 'NEXT_PUBLIC_SITE_MODE', 'NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_FORM_MODE']) {
  test(`automatic production fails closed without ${key}`, () => {
    const env = { ...production }; delete env[key];
    assert.throws(() => validateDeploymentContext(env, 'production-astra'));
  });
}

test('automatic Netlify builds require an explicit recognized context', () => {
  assert.throws(() => validateDeploymentContext({ NETLIFY: 'true' }, 'main'), /context/);
  assert.throws(() => validateDeploymentContext({ NETLIFY: 'true', CONTEXT: 'unknown' }, 'main'), /context/);
});

test('production rejects a conflicting CLI site identity', () => {
  assert.throws(() => validateDeploymentContext({ ...production, NETLIFY_SITE_ID: 'f499ad01-b775-4c7d-901f-98f879c83d94' }, 'production-astra'), /conflicting/);
});

test('a production context cannot build preview mode or a preview canonical URL', () => {
  assert.throws(() => validateDeploymentContext({ ...production, NEXT_PUBLIC_SITE_MODE: 'preview' }, 'production-astra'), /site mode/);
  assert.throws(() => validateDeploymentContext({ ...production, NEXT_PUBLIC_SITE_URL: 'https://astra-review--driveexotiq-astra.netlify.app' }, 'production-astra'), /canonical/);
});

test('local production-mode QA does not require Netlify deployment identity', () => {
  assert.doesNotThrow(() => validateDeploymentContext({ NODE_ENV: 'production', NEXT_PUBLIC_SITE_MODE: 'production' }, 'codex/astra-awwwards'));
});

test('draft Netlify builds retain preview mode on development branches', () => {
  assert.doesNotThrow(() => validateDeploymentContext({ NETLIFY: 'true', CONTEXT: 'deploy-preview', BRANCH: 'feature/test', NEXT_PUBLIC_SITE_MODE: 'preview' }, 'feature/test'));
  assert.throws(() => validateDeploymentContext({ NETLIFY: 'true', CONTEXT: 'branch-deploy', NEXT_PUBLIC_SITE_MODE: 'production' }, 'feature/test'), /preview mode/);
});

test('skip-like environment values do not waive a wrong production branch', () => {
  assert.throws(() => validateDeploymentContext({ ...production, BRANCH: 'main', SKIP_DEPLOYMENT_GUARD: 'true', FORCE_DEPLOY: 'true' }, 'main'), /production-astra/);
});

async function withSource(files, run) {
  const directory = await mkdtemp(path.join(tmpdir(), 'astra-source-'));
  try {
    for (const [name, content] of Object.entries(files)) {
      const destination = path.join(directory, name);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, content);
    }
    await run(directory);
  } finally { await rm(directory, { recursive: true, force: true }); }
}

test('source identity follows rendered imports without requiring a component filename', async () => {
  await withSource({
    'app/page.tsx': 'import Scene from "@/components/RenamedScene"; export default function Page(){return <Scene/>}',
    'components/RenamedScene.tsx': 'export default function Scene(){return <main data-site-experience="astra">Astra</main>}',
  }, async directory => assert.match(await verifyAstraSource(directory), /RenamedScene/));
});

test('an unrelated homepage with a disconnected marker file is rejected', async () => {
  await withSource({
    'app/page.tsx': 'export default function Page(){return <main>Another site</main>}',
    'components/Unused.tsx': 'export default function Scene(){return <main data-site-experience="astra"/>}',
  }, async directory => assert.rejects(verifyAstraSource(directory), /Astra source identity/));
});

test('a marker inside a comment or an unrendered imported component does not certify the homepage', async () => {
  await withSource({
    'app/page.tsx': 'import Unused from "@/components/Unused"; /* <main data-site-experience="astra"/> */ export default function Page(){return <main>Another site</main>}',
    'components/Unused.tsx': 'export default function Scene(){return <main data-site-experience="astra"/>}',
  }, async directory => assert.rejects(verifyAstraSource(directory), /Astra source identity/));
});

test('source traversal supports a rendered relative component chain', async () => {
  await withSource({
    'app/page.tsx': 'import Scene from "../components/Scene"; export default function Page(){return <Scene/>}',
    'components/Scene.tsx': 'import { Content as Main } from "./Content"; export default function Scene(){return <Main/>}',
    'components/Content.tsx': 'export function Content(){return <main data-site-experience={"astra"}/>}',
  }, async directory => assert.match(await verifyAstraSource(directory), /Content/));
});

test('an unused local component cannot certify a different default homepage', async () => {
  await withSource({
    'app/page.tsx': 'function OldAstra(){return <main data-site-experience="astra"/>} export default function Page(){return <main>Different homepage</main>}',
  }, async directory => assert.rejects(verifyAstraSource(directory), /Astra source identity/));
});

test('an unused named export cannot certify the imported default component', async () => {
  await withSource({
    'app/page.tsx': 'import Scene from "@/components/Scene"; export default function Page(){return <Scene/>}',
    'components/Scene.tsx': 'export function Unused(){return <main data-site-experience="astra"/>} export default function Scene(){return <main>Different homepage</main>}',
  }, async directory => assert.rejects(verifyAstraSource(directory), /Astra source identity/));
});

test('a rendered local component can carry the homepage identity', async () => {
  await withSource({
    'app/page.tsx': 'const Scene=()=> <main data-site-experience="astra"/>; export default function Page(){return <Scene/>}',
  }, async directory => assert.match(await verifyAstraSource(directory), /page/));
});

test('missing homepage source is rejected', async () => {
  await withSource({}, async directory => assert.rejects(verifyAstraSource(directory), /homepage entry/));
});
