#!/usr/bin/env node
// One-off: link exotiq-ai/DriveExotiq-NewGen (branch newgen-main) to the
// driveexotiq-newgen Netlify site for auto-deploys, reusing the GitHub App
// installation already attached to the production site.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../../..');
for (const l of fs.readFileSync(path.join(REPO, '.env.local'), 'utf8').split('\n')) {
  const i = l.indexOf('='); if (i > 0 && !l.trim().startsWith('#')) process.env[l.slice(0, i).trim()] ??= l.slice(i + 1).trim();
}
const H = { Authorization: `Bearer ${process.env.NETLIFY_AUTH_TOKEN}`, 'Content-Type': 'application/json' };
const PROD = 'a7b48b06-4faf-4ad5-86ca-c6c8248fc28f';
const NEWGEN = 'a9dc6785-ca82-407f-8899-edc4ebf23fd0';

const prod = await (await fetch(`https://api.netlify.com/api/v1/sites/${PROD}`, { headers: H })).json();
const bs = prod.build_settings || {};
console.log('prod repo:', bs.repo_path, '| provider:', bs.provider, '| installation:', bs.installation_id ?? bs.repo_installation_id ?? 'n/a');
const installationId = bs.installation_id ?? bs.repo_installation_id;
if (!installationId) { console.log('No installation id on prod site — dashboard link required.'); process.exit(1); }

const put = await fetch(`https://api.netlify.com/api/v1/sites/${NEWGEN}`, {
  method: 'PATCH',
  headers: H,
  body: JSON.stringify({
    repo: {
      provider: 'github',
      installation_id: installationId,
      repo_path: 'exotiq-ai/DriveExotiq-NewGen',
      repo_branch: 'newgen-main',
      cmd: 'npm run build',
      dir: '.next',
    },
  }),
});
const j = await put.json();
console.log('link status:', put.status);
console.log('linked repo:', j.build_settings?.repo_path, '| branch:', j.build_settings?.repo_branch, '| cmd:', j.build_settings?.cmd);
