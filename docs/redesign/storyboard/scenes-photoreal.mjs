#!/usr/bin/env node
// Photoreal scene generator for /experience — one locked cinematic grade across every
// scene so the whole scroll feels shot by one DP. OpenRouter -> image model.
// Output: public/images/experience/photo/<id>[tag].png
// Usage:
//   node docs/redesign/storyboard/scenes-photoreal.mjs                       # all (missing only), gpt-image-1
//   node docs/redesign/storyboard/scenes-photoreal.mjs --only mclaren-720s --force
//   node docs/redesign/storyboard/scenes-photoreal.mjs --only mclaren-720s --model google/gemini-2.5-flash-image --tag -nano
// Requires OPENROUTER_API_KEY in .env.local.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../../..');
const OUT = path.join(REPO, 'public/images/experience/photo');
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

const GRADE = 'Cinematic photograph, shot on 35mm anamorphic lens, shallow depth of field, moody film-noir lighting with a single warm key light against deep matte-black shadow, restrained high-end luxury automotive advertising quality, subtle film grain, desaturated graphite palette with warm highlights, 16:9 widescreen, photorealistic, ultra-detailed, no text, no logos, no visible license plates, no watermark. Scene:';

const SCENES = [
  ['cold-open', ' a near-black modern private supercar garage just before dawn, almost pure shadow, a single faint warm pool of light low on a polished concrete floor, the silhouette of one covered supercar barely readable, immense stillness and empty negative space.'],
  ['garage-exterior', ' the plain matte-concrete facade of a private supercar garage at pre-dawn, a sectional roll-up door lifting, a hard blade of warm light spilling out across wet reflective asphalt toward the camera, no car visible yet, cinematic and quiet.'],
  ['garage-interior', ' the interior of a pristine dark modern warehouse garage, two facing rows of low exotic supercars angled inward along a central aisle that recedes to a single warm vanishing-point light, polished concrete floor with mirror reflections, dramatic overhead pools of light, deep shadow everywhere else.'],
  ['mclaren-720s', ' a McLaren 720S parked in a dark studio-garage, low three-quarter front angle, one dramatic key light raking across its curved organic bodywork and hollow eye-socket headlights, matte grey paint, pure black background, a crisp reflection on the polished floor.'],
  ['porsche-gt3rs', ' a Porsche 911 GT3 RS in a dark garage, rear three-quarter angle, its huge swan-neck rear wing catching a hard rim light, muscular rear haunches sunk in deep shadow, aggressive planted stance, cinematic.'],
  ['lambo-ferrari', ' a Lamborghini with one scissor door raised vertically beside a Ferrari in a dark garage lineup, the angular Lamborghini wedge nearest catching a hard key light, the curvier Ferrari behind falling into shadow, dramatic contrast.'],
  ['choose', ' a fanned lineup of five exotic supercars in a dark garage arranged in a shallow arc, the center car stepped forward and lit noticeably brighter than the rest as the hero, the flankers softening into shadow on either side.'],
  ['cockpit-pov', ' first-person driver point of view from inside a McLaren supercar cabin at dawn, both hands resting on the carbon steering wheel, dark carbon-and-alcantara interior, a band of soft dawn light glowing across the top of the windscreen ahead.'],
  ['ignition', ' an extreme close-up of a thumb pressing a round engine start button on a dark carbon supercar console, the button face plain brushed metal with a single glowing ring and absolutely no lettering or symbols on it, instrument-cluster gauges sweeping with glowing needles behind, dramatic specular highlights, shallow depth of field.'],
  ['open-road', ' first-person view through a supercar windscreen onto an empty two-lane mountain highway at first light, the road opening toward a distant vanishing point, the dark dashboard and A-pillars silhouetted around a glowing road ahead.'],
  ['drive-mountain', ' a low mid-engine supercar carving an open mountain highway at speed, side tracking shot at rocker height, granite ridgeline and pines smeared into horizontal motion blur, crisp low morning light raking the flank.'],
  ['coast-aerial', ' a high golden-hour aerial drone shot looking down and ahead at a lone supercar on a thin coastal cliff road, vast ocean and a headland beyond, long raking shadows, glittering water, the car small for scale.'],
  ['coastline-run', ' a low road-level tracking shot of a supercar running a cliffside coast road at golden hour, a hard low sun flaring off the sea, a bright highlight raking down the car flank, background blurred with speed.'],
  ['wheel-detail', ' an extreme macro close-up of a supercar wheel and sculpted fender at speed, radial motion blur across the spokes, a hard low golden key light grazing the bodywork, very shallow depth of field, deep shadow.'],
  ['threshold-rush', ' first-person camera rushing through the open doorway of a dark supercar garage, the door frame streaking past the edges with directional motion blur, a cavernous dark interior opening ahead toward a single warm pool of light at the far vanishing point, dramatic wide-angle perspective, no car visible yet.'],
  ['waitlist-still', ' a quiet corner of a dark luxury garage at night, a row of supercar silhouettes receding into deep shadow and haze along the left, one soft warm downlight pooling on empty polished concrete in the foreground right, calm, still, vast negative space.'],
  ['door-up', ' a McLaren 720S in a dark garage with its dihedral door swung fully open and upward, low three-quarter angle from just outside the sill looking into the dark sculpted cabin, a hard rim light tracing the raised door edge, dramatic and inviting, matte grey paint, pure black background.'],
  ['roll-out', ' first-person driver point of view from inside a dark supercar cabin as the car noses out of a garage at pre-dawn, the garage-door frame just clearing the top of the windscreen, a soft glowing pre-dawn sky and wet concrete apron opening ahead, dark dashboard and A-pillars silhouetted.'],
];

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const pick = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };
const MODEL = pick('--model') || 'openai/gpt-image-1';
const TAG = pick('--tag') || '';
const only = pick('--only');
const ONLY = only ? new Set(only.split(',').map((s) => s.trim())) : null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function gen(prompt) {
  const body = JSON.stringify({ model: MODEL, prompt, aspect_ratio: '16:9' });
  const headers = { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://driveexotiq.com', 'X-Title': 'Drive Exotiq Experience' };
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/images', { method: 'POST', headers, body });
      if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 240)}`);
      const j = await res.json();
      const b64 = j?.data?.[0]?.b64_json;
      if (!b64) throw new Error('no image bytes: ' + JSON.stringify(j).slice(0, 200));
      return { buf: Buffer.from(b64, 'base64'), cost: Number(j?.usage?.cost) || 0 };
    } catch (e) {
      if (attempt === 3) throw new Error(`${e.message}${e.cause ? ' | ' + (e.cause.code || e.cause.message) : ''}`);
      await sleep(2500 * attempt);
    }
  }
}

let done = 0, failed = 0, skipped = 0, cost = 0;
console.log(`Model: ${MODEL}${TAG ? ` · tag ${TAG}` : ''} · out: ${OUT}`);
for (const [id, subject] of SCENES) {
  if (ONLY && !ONLY.has(id)) continue;
  const out = path.join(OUT, `${id}${TAG}.png`);
  if (!FORCE && fs.existsSync(out) && fs.statSync(out).size > 0) { skipped++; console.log(`skip  ${id}`); continue; }
  try {
    const { buf, cost: c } = await gen(GRADE + subject);
    fs.writeFileSync(out, buf); cost += c; done++;
    console.log(`ok    ${id}${TAG} (${buf.length} bytes${c ? `, $${c.toFixed(4)}` : ''})`);
  } catch (e) { failed++; console.error(`FAIL  ${id}: ${String(e.message).slice(0, 200)}`); }
}
console.log(`\ndone. rendered=${done} skipped=${skipped} failed=${failed}${cost ? ` · ~$${cost.toFixed(2)}` : ''}`);
if (failed) process.exit(2);
