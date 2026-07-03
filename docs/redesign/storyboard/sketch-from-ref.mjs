#!/usr/bin/env node
// Image-to-sketch: redraw a real reference photo (refs/) into the house B&W charcoal
// storyboard style via OpenRouter -> openai/gpt-image-1 with input_references (base64 data URL).
// Usage:
//   node docs/redesign/storyboard/sketch-from-ref.mjs                 # all jobs (missing only)
//   node docs/redesign/storyboard/sketch-from-ref.mjs --only SB-19 --force
// Requires OPENROUTER_API_KEY in .env.local. Reference photos are downsized with sips before send.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../../..');
const REFS = path.join(__dirname, 'refs');
const OUT = path.join(__dirname, 'frames');
fs.mkdirSync(OUT, { recursive: true });

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const raw of fs.readFileSync(file, 'utf8').split('\n')) {
    const l = raw.trim(); if (!l || l.startsWith('#')) continue;
    const eq = l.indexOf('='); if (eq < 0) continue;
    const k = l.slice(0, eq).trim(); const v = l.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!(k in process.env)) process.env[k] = v;
  }
}
loadEnv(path.join(REPO, '.env.local'));
if (!process.env.OPENROUTER_API_KEY) { console.error('Missing OPENROUTER_API_KEY in .env.local'); process.exit(1); }

const STYLE = 'Black-and-white cinematic storyboard sketch, rough graphite and charcoal on lightly toned paper, loose confident director hand, bold gesture linework with soft smudged shading, high-contrast film-noir key light, no color, no text, 16:9 widescreen frame, subtle motion arrows where movement is implied —';

const JOBS = [
  {
    id: 'SB-19', ref: 's8-side-profile.jpg', out: 'frame-22-sb-19.png',
    prompt: STYLE + ' Redraw the car in the referenced photo — a large low Audi S8 super-sedan — as a dead-on pure SIDE PROFILE at dusk, telephoto-flat so the flank reads as one clean plane, keeping the real proportions, greenhouse and wheels of the reference. Strip the desert background to a calm empty dusk sky as deep negative space above for a headline, seat the car on a single thin horizon hairline. Draw a HERITAGE MOTORSPORT LIVERY onto the flank as bold graphic line-art — angular racing stripes and blocky panels echoing a classic 1980s Audi quattro IMSA race car, rendered in black-and-white as crisp white, mid-grey and solid black stripe fields running the full length of the body. A light-wipe arrow sweeps front-to-rear along the livery to imply it drawing on. A small simple rectangular call-to-action button shape rests low in the frame. Even wraparound light with a soft raking highlight along the shoulder line, heavy vignette, no brand logos, no lettering.',
  },
  {
    id: 'SB-19b', ref: 'gregory-open-door-s8-wide.jpg', out: 'frame-22b-sb-19b.png',
    prompt: STYLE + ' Redraw the referenced photo — a man standing in the open driver\'s door of a grey Audi S8 super-sedan in open country — as a charcoal storyboard frame: the founder caught mid-motion about to drop into the driver\'s seat, one hand on the door frame, the long sedan angled three-quarter across the frame with its nose to frame-left, dusk light. Keep his stance, cap, and build from the reference. Replace the background with a quiet dusk horizon and a faint suggested road/route line trailing off toward the distance. A curved motion arrow on the swinging door and a forward departure arrow ahead of the car imply the tour setting off. Deep shadow, hard low key light, heavy vignette, no logos, no text.',
  },
  {
    id: 'SB-17', ref: 's8-vista-front-3q.jpg', out: 'frame-20-sb-17.png',
    prompt: STYLE + ' Redraw the referenced photo — an Audi S8 super-sedan parked front three-quarter on an open desert vista with a mountain range behind — as a wide charcoal storyboard frame at golden hour: the car resting lower-center, vast landscape and sky as breathing negative space, long raking shadow, a single deceleration arrow settling it to a stop, a small suggested instrument readout low-right. Keep the car\'s real proportions from the reference. Heavy vignette, hard low key light, no logos, no text.',
  },
  {
    id: 'WRAP-PHOTO', refs: ['s8-side-profile.jpg', 'livery-heritage-audi90-imsa.jpeg'], out: 'wrap-photoreal.png',
    prompt: 'Cinematic photograph, shot on 35mm anamorphic lens, moody dusk lighting, restrained high-end luxury automotive advertising quality, subtle film grain, desaturated graphite palette with warm highlights, 16:9 widescreen, photorealistic, ultra-detailed, no watermark. TWO reference images are provided. Reference 1 is a grey Audi S8 super-sedan — keep the EXACT car: its real proportions, greenhouse, wheels, stance and Daytona-grey paint. Reference 2 is a classic 1980s Audi quattro IMSA GTO race car wearing an iconic heritage racing livery of bold geometric white, red and black blocks and diagonal slashes — use it ONLY as the livery graphic pattern. Render the S8 from Reference 1 in a dead-on pure SIDE PROFILE at dusk on an empty stretch of dark asphalt, PAINTED with that heritage racing livery adapted across its doors, fenders and rockers as a vinyl wrap, calm empty dusk sky above as negative space, a soft raking highlight along the shoulder line, faint reflection under the car. No race numbers, no sponsor wordmarks, no brand lettering — livery pattern only, no visible license plate.',
  },
  {
    id: 'SB-19-heritage', refs: ['s8-side-profile.jpg', 'livery-heritage-audi90-imsa.jpeg'], out: 'frame-22-sb-19-heritage.png',
    prompt: STYLE + ' TWO reference images are provided. Reference 1 is an Audi S8 super-sedan in side view — use it for the EXACT car: proportions, greenhouse, wheels and stance. Reference 2 is a classic 1980s Audi quattro IMSA GTO race car wearing an iconic heritage racing livery of bold geometric white, red and black blocks, diagonal slashes and stripe panels — use it ONLY as the livery graphic pattern. Redraw the Audi S8 from Reference 1 as a dead-on pure SIDE PROFILE at dusk in black-and-white charcoal, and PAINT that heritage racing livery pattern from Reference 2 across the S8 flank — the same angular blocks, diagonal slashes and stripe fields, adapted to wrap the sedan doors, fenders and rocker, rendered in black-and-white as crisp white, mid-grey and solid black fields (no color). Strip the background to a calm empty dusk sky as negative space above for a headline; seat the car on a single thin horizon hairline; soft raking highlight along the shoulder line; a small rectangular call-to-action button shape low in the frame; heavy vignette. IMPORTANT: no race numbers, no sponsor wordmarks, no brand logos, no lettering anywhere — livery pattern only.',
  },
];

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const onlyIdx = args.indexOf('--only');
const ONLY = onlyIdx >= 0 && args[onlyIdx + 1] ? new Set(args[onlyIdx + 1].split(',').map(s => s.trim())) : null;

function refDataUrl(refFile) {
  const src = path.join(REFS, refFile);
  if (!fs.existsSync(src)) throw new Error('ref not found: ' + refFile);
  const tmp = path.join(os.tmpdir(), 'ref-' + refFile.replace(/[^a-z0-9.]/gi, '_') + '.jpg');
  execSync(`sips -Z 1000 -s formatOptions 60 ${JSON.stringify(src)} --out ${JSON.stringify(tmp)}`, { stdio: 'ignore' });
  const b64 = fs.readFileSync(tmp).toString('base64');
  return 'data:image/jpeg;base64,' + b64;
}

async function run(job) {
  const outPath = path.join(OUT, job.out);
  if (!FORCE && fs.existsSync(outPath) && fs.statSync(outPath).size > 0) { console.log(`skip  ${job.id} (exists)`); return; }
  const refList = job.refs || [job.ref];
  const inputRefs = refList.map((r) => ({ type: 'image_url', image_url: { url: refDataUrl(r) } }));
  const body = JSON.stringify({ model: 'openai/gpt-image-1', prompt: job.prompt, aspect_ratio: '16:9', input_references: inputRefs });
  const headers = { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://driveexotiq.com', 'X-Title': 'Drive Exotiq Storyboard' };
  let j;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/images', { method: 'POST', headers, body });
      if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 300)}`);
      j = await res.json();
      break;
    } catch (e) {
      if (attempt === 3) throw new Error(`${job.id} ${e.message}${e.cause ? ' | ' + (e.cause.code || e.cause.message) : ''}`);
      console.warn(`  retry ${job.id} (${attempt}): ${String(e.message).slice(0, 120)}`);
      await new Promise((r) => setTimeout(r, 2500 * attempt));
    }
  }
  const b64 = j?.data?.[0]?.b64_json;
  if (!b64) throw new Error(`${job.id}: no image bytes: ` + JSON.stringify(j).slice(0, 220));
  fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
  console.log(`ok    ${job.id} <- ${(job.refs || [job.ref]).join('+')} -> ${job.out} (${Buffer.from(b64, 'base64').length} bytes${j?.usage?.cost ? `, $${Number(j.usage.cost).toFixed(4)}` : ''})`);
}

let failed = 0;
for (const job of JOBS) {
  if (ONLY && !ONLY.has(job.id)) continue;
  try { await run(job); } catch (e) { failed++; console.error('FAIL ' + String(e.message).slice(0, 300)); }
}
console.log('done' + (failed ? ` (${failed} failed)` : ''));
if (failed) process.exit(2);
