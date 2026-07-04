#!/usr/bin/env node
// Content-version map for living media. Videos and posters are served with
// immutable/1yr caching under STABLE filenames — re-encodes were invisible to
// Cloudflare's edge and returning browsers. vid()/pos() append ?v=<hash8> so
// any content change busts every cache layer automatically.
// Run after encode-web.mjs, before upload-r2.mjs; commit the JSON.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../../..');
const map = {};
for (const [dir, prefix] of [
  ['public/videos/experience', '/videos/experience'],
  ['public/images/experience/poster', '/images/experience/poster'],
]) {
  const abs = path.join(REPO, dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs).sort()) {
    if (!/\.(mp4|webm|jpg|webp|avif)$/.test(f)) continue;
    const hash = crypto.createHash('md5').update(fs.readFileSync(path.join(abs, f))).digest('hex').slice(0, 8);
    map[`${prefix}/${f}`] = hash;
  }
}
fs.writeFileSync(
  path.join(REPO, 'components/experience/media-versions.json'),
  JSON.stringify(map, null, 2),
);
console.log(`media-versions.json: ${Object.keys(map).length} files`);
