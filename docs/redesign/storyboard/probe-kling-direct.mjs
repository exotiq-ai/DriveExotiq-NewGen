#!/usr/bin/env node
// Probe the direct Kling API (single Bearer key, api-singapore.klingai.com):
// 1) task-list GET = free auth check; 2) discover accepted model_name values
// and whether 1080p i2v is available (OpenRouter caps Kling at 720p).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../../..');
for (const l of fs.readFileSync(path.join(REPO, '.env.local'), 'utf8').split('\n')) {
  const i = l.indexOf('='); if (i > 0 && !l.trim().startsWith('#')) process.env[l.slice(0, i).trim()] ??= l.slice(i + 1).trim();
}
const KEY = process.env.KLING_API_KEY;
if (!KEY) { console.log('no KLING_API_KEY'); process.exit(1); }
const H = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

// 1) auth check
const list = await fetch('https://api-singapore.klingai.com/v1/videos/image2video?pageNum=1&pageSize=5', { headers: H });
console.log('task-list:', list.status, (await list.text()).slice(0, 200));

// 2) model_name discovery via deliberately incomplete submits (no image => param
// error AFTER model validation on most APIs; watch the error text)
for (const model of ['kling-v3', 'kling-v3-pro', 'kling-v2-5-turbo', 'kling-v2-1']) {
  const r = await fetch('https://api-singapore.klingai.com/v1/videos/image2video', {
    method: 'POST', headers: H,
    body: JSON.stringify({ model_name: model, prompt: 'probe', duration: '5' }),
  });
  console.log(model, '->', r.status, (await r.text()).replace(/\s+/g, ' ').slice(0, 180));
}
