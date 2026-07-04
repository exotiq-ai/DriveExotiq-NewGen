#!/usr/bin/env node
// One-off: isolate why veo-3.1-generate-preview 400s via direct Gemini API
// while veo-3.1-fast-generate-preview succeeds. Probes are submit-only.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../../..');
for (const l of fs.readFileSync(path.join(REPO, '.env.local'), 'utf8').split('\n')) {
  const i = l.indexOf('='); if (i > 0 && !l.trim().startsWith('#')) process.env[l.slice(0, i).trim()] ??= l.slice(i + 1).trim();
}
const key = process.env.GEMINI_API_KEY;
const tmp = path.join(__dirname, 'renders/.frame-cache/probe.jpg');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(REPO, 'public/images/experience/photo/drive-mountain.png'),
  '-vf', "crop='min(iw,ih*16/9)':'min(ih,iw*9/16)',scale=1280:-2", '-q:v', '4', tmp]);
const img = fs.readFileSync(tmp).toString('base64');

async function probe(name, params, extraInstance = {}) {
  const body = { instances: [{ prompt: 'car on mountain road, static camera', image: { bytesBase64Encoded: img, mimeType: 'image/jpeg' }, ...extraInstance }], parameters: params };
  const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning', {
    method: 'POST', headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const t = await r.text();
  console.log(name, r.status, r.ok ? 'ACCEPTED op=' + JSON.parse(t).name.slice(-16) : t.replace(/\s+/g, ' ').slice(0, 150));
}

await probe('A base+generateAudio:false', { aspectRatio: '16:9', durationSeconds: 8, resolution: '1080p', generateAudio: false });
await probe('B no generateAudio       ', { aspectRatio: '16:9', durationSeconds: 8, resolution: '1080p' });
await probe('C 720p no audio param    ', { aspectRatio: '16:9', durationSeconds: 8, resolution: '720p' });
