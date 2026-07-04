#!/usr/bin/env node
// One real direct-Kling v3 submit (SB-05 still, first=last, pro): does the
// direct route deliver 1080p where OpenRouter caps at 720p?
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../../..');
for (const l of fs.readFileSync(path.join(REPO, '.env.local'), 'utf8').split('\n')) {
  const i = l.indexOf('='); if (i > 0 && !l.trim().startsWith('#')) process.env[l.slice(0, i).trim()] ??= l.slice(i + 1).trim();
}
const H = { Authorization: `Bearer ${process.env.KLING_API_KEY}`, 'Content-Type': 'application/json' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const tmp = path.join(__dirname, 'renders/.frame-cache/kling-probe.jpg');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(REPO, 'public/images/experience/photo/mclaren-720s.png'),
  '-vf', "crop='min(iw,ih*16/9)':'min(ih,iw*9/16)',scale=1568:-2", '-q:v', '3', tmp]);
const b64 = fs.readFileSync(tmp).toString('base64');

const body = {
  model_name: 'kling-v3',
  mode: 'pro',
  duration: '5',
  image: b64,
  image_tail: b64,
  prompt: 'Cinematic photograph brought to life: the camera drifts laterally by two degrees and returns; the single warm key light travels across the front fender; the headlight signature brightens gently and settles. The car never moves. Film-noir grade, deep matte black, warm highlights. Ends exactly on the first frame.',
  negative_prompt: 'no wheel rotation, no spoke morphing, no grille warping, no badge text, no blue light, no camera shake',
};
const sub = await fetch('https://api-singapore.klingai.com/v1/videos/image2video', { method: 'POST', headers: H, body: JSON.stringify(body) });
const subJ = JSON.parse(await sub.text());
console.log('submit:', sub.status, JSON.stringify(subJ).slice(0, 220));
if (subJ.code !== 0) process.exit(1);
const id = subJ.data.task_id;

for (let i = 0; i < 60; i++) {
  await sleep(15000);
  const r = await fetch(`https://api-singapore.klingai.com/v1/videos/image2video/${id}`, { headers: H });
  const j = JSON.parse(await r.text());
  const st = j.data?.task_status;
  process.stdout.write('.');
  if (st === 'succeed') {
    const url = j.data.task_result?.videos?.[0]?.url;
    console.log('\nsucceed:', url?.slice(0, 90));
    const out = path.join(__dirname, 'renders/SB-05/SB-05-t1-kling-v3-direct.mp4');
    const dl = await fetch(url);
    fs.writeFileSync(out, Buffer.from(await dl.arrayBuffer()));
    console.log('saved:', out, (fs.statSync(out).size / 1e6).toFixed(1) + 'MB');
    console.log('resolution:', execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', out]).toString().trim());
    process.exit(0);
  }
  if (st === 'failed') { console.log('\nfailed:', JSON.stringify(j.data).slice(0, 300)); process.exit(1); }
}
console.log('\ntimeout');
