#!/usr/bin/env node
// Living-scenes video generator — OpenRouter async video API (submit -> poll -> save).
// Mirrors scenes-photoreal.mjs; routing/prompts come from beats-manifest.json.
// Output: docs/redesign/storyboard/renders/<beat>/<beat>-t<take>-<model>.mp4 (+ cost-ledger.json)
// Usage:
//   node docs/redesign/storyboard/generate-videos.mjs --only SB-01            # final model, N takes from manifest
//   node docs/redesign/storyboard/generate-videos.mjs --only SB-01,SB-05 --takes 1 --draft
//   node docs/redesign/storyboard/generate-videos.mjs --only SB-02 --model google/veo-3.1-lite --tag testA
//   node docs/redesign/storyboard/generate-videos.mjs --only SB-19 --dry      # print request, no spend
// Requires OPENROUTER_API_KEY in .env.local and ffmpeg on PATH (frame payload downsizing).

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../../..');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(__dirname, 'beats-manifest.json'), 'utf8'));
const STILLS = path.join(REPO, MANIFEST.stillsDir);
const RENDERS = path.join(REPO, MANIFEST.rendersDir);
const CACHE = path.join(RENDERS, '.frame-cache');
fs.mkdirSync(CACHE, { recursive: true });

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

const args = process.argv.slice(2);
const pick = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const ONLY = pick('--only') ? new Set(pick('--only').split(',').map((s) => s.trim())) : null;
const TAKES = pick('--takes') ? Number(pick('--takes')) : null;
const DRAFT = args.includes('--draft');
const DRY = args.includes('--dry');
const MODEL_OVERRIDE = pick('--model');
const TAG = pick('--tag') || '';

const HEADERS = {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': 'https://driveexotiq.com',
  'X-Title': 'Drive Exotiq Living Scenes',
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Frame payloads: OpenRouter accepts b64 data URLs; keep each under ~1.5MB.
// Center-crop to 16:9 first (legacy plates are 3:2; the stage shows them
// object-cover, so the 16:9 center crop IS what viewers see — and it stops
// providers reframing 3:2 inputs unpredictably). Cached by source mtime.
function frameDataUrl(stillName) {
  const src = path.isAbsolute(stillName) ? stillName : path.join(STILLS, stillName);
  if (!fs.existsSync(src)) throw new Error(`frame image missing: ${src}`);
  const key = `${path.basename(src).replace(/[^\w.-]/g, '_')}-${fs.statSync(src).mtimeMs}.jpg`;
  const cached = path.join(CACHE, key);
  if (!fs.existsSync(cached)) {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src,
      '-vf', "crop='min(iw,ih*16/9)':'min(ih,iw*9/16)',scale='min(1568,iw)':-2", '-q:v', '3', cached]);
  }
  return `data:image/jpeg;base64,${fs.readFileSync(cached).toString('base64')}`;
}

function buildRequest(beat, model) {
  const fi = [];
  if (beat.frameImages?.first) fi.push({ type: 'image_url', image_url: { url: frameDataUrl(beat.frameImages.first) }, frame_type: 'first_frame' });
  if (beat.frameImages?.last) fi.push({ type: 'image_url', image_url: { url: frameDataUrl(beat.frameImages.last) }, frame_type: 'last_frame' });
  // Veo durations are 4/6/8s (and 1080p requires 8s) — clamp when a >8s beat
  // (Hailuo-routed) is drafted or retaken on a Google model.
  let duration = beat.duration;
  if (model.startsWith('google/') && duration > 8) duration = 8;
  const body = {
    model,
    prompt: beat.prompt,
    duration,
    resolution: beat.resolution || MANIFEST.defaults.resolution,
    aspect_ratio: MANIFEST.defaults.aspect_ratio,
    generate_audio: false,
  };
  if (fi.length) body.frame_images = fi;
  if (beat.inputReferences?.length) {
    body.input_references = beat.inputReferences.map((r) => ({
      type: 'image_url', image_url: { url: frameDataUrl(path.join(__dirname, r)) },
    }));
  }
  // negative prompt: kling/wan take a real negative_prompt param; everyone else
  // (incl. Google — provider-options passthrough proved unreliable: a draft came
  // back with a burned-in "35" and smoke the negatives forbid) gets it appended
  // to the prompt, which verifiably reaches the model.
  if (beat.negativePrompt) {
    if (model.startsWith('kwaivgi/') || model.startsWith('alibaba/')) body.negative_prompt = beat.negativePrompt;
    else body.prompt += ` STRICTLY AVOID (hard constraints): ${beat.negativePrompt}.`;
  }
  return body;
}

async function submit(body) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/videos', { method: 'POST', headers: HEADERS, body: JSON.stringify(body) });
      const text = await res.text();
      if (!res.ok) throw new Error(`submit ${res.status}: ${text.slice(0, 300)}`);
      return JSON.parse(text); // { id, polling_url, status }
    } catch (e) {
      if (attempt === 3 || String(e.message).includes(' 402:')) throw e; // 402 = out of credits, retrying is pointless
      await sleep(4000 * attempt);
    }
  }
}

// ---------- Direct Gemini API route (Veo 3.1) ----------
// Used when OpenRouter credits run dry or for newest-model access. Same beat
// definitions; body mapped to predictLongRunning. Costs bill to the owner's
// Google project (GEMINI_API_KEY), so they do NOT appear in usage.cost — the
// ledger records estimated list price instead.
const GEMINI_MODEL_MAP = {
  'google/veo-3.1': 'veo-3.1-generate-preview',
  'google/veo-3.1-fast': 'veo-3.1-fast-generate-preview',
  'google/veo-3.1-lite': 'veo-3.1-fast-generate-preview', // lite is OpenRouter-only; fast is the direct draft tier
};
const b64Raw = (still) => frameDataUrl(still).replace(/^data:image\/jpeg;base64,/, '');

async function runGeminiJob(beat, model, outFile) {
  const gModel = GEMINI_MODEL_MAP[model];
  if (!gModel) throw new Error(`no direct-Gemini mapping for ${model}`);
  const instance = { prompt: beat.prompt };
  if (beat.frameImages?.first) instance.image = { bytesBase64Encoded: b64Raw(beat.frameImages.first), mimeType: 'image/jpeg' };
  if (beat.frameImages?.last) instance.lastFrame = { bytesBase64Encoded: b64Raw(beat.frameImages.last), mimeType: 'image/jpeg' };
  if (beat.inputReferences?.length) {
    instance.referenceImages = beat.inputReferences.slice(0, 3).map((r) => ({
      image: { bytesBase64Encoded: b64Raw(path.join(__dirname, r)), mimeType: 'image/jpeg' },
      referenceType: 'asset',
    }));
  }
  let duration = beat.duration;
  if (duration > 8) duration = 8;
  const parameters = {
    aspectRatio: '16:9',
    durationSeconds: duration,
    resolution: beat.resolution || '1080p',
    // NOTE: no generateAudio — the direct Gemini API rejects the param on both
    // veo-3.1 tiers (probe-veo-direct.mjs, 2026-07-03). Strip audio at encode.
  };
  if (beat.negativePrompt) parameters.negativePrompt = beat.negativePrompt;

  const key = process.env.GEMINI_API_KEY;
  let subText;
  for (let attempt = 1; ; attempt++) {
    const sub = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${gModel}:predictLongRunning`, {
      method: 'POST',
      headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ instances: [instance], parameters }),
    });
    subText = await sub.text();
    if (sub.ok) break;
    // Veo long-running ops are tightly rate-limited per key — back off hard on 429.
    if (sub.status === 429 && attempt <= 6) { await sleep(70000); continue; }
    throw new Error(`gemini submit ${sub.status}: ${subText.slice(0, 300)}`);
  }
  const opName = JSON.parse(subText).name;
  console.log(`sent  ${beat.id} -> ${gModel} (op ${opName.split('/').pop()})`);

  const started = Date.now();
  for (;;) {
    await sleep(15000);
    let op;
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/${opName}`, { headers: { 'x-goog-api-key': key } });
      op = await res.json();
    } catch { continue; }
    if (op.error) throw new Error(`gemini op failed: ${JSON.stringify(op.error).slice(0, 300)}`);
    if (op.done) {
      const sample = op.response?.generateVideoResponse?.generatedSamples?.[0]
        ?? op.response?.generatedSamples?.[0] ?? op.response?.videos?.[0];
      const uri = sample?.video?.uri ?? sample?.uri;
      const inline = sample?.video?.bytesBase64Encoded ?? sample?.bytesBase64Encoded;
      if (inline) { fs.writeFileSync(outFile, Buffer.from(inline, 'base64')); return; }
      if (!uri) throw new Error(`gemini done but no video: ${JSON.stringify(op.response).slice(0, 400)}`);
      const dl = await fetch(uri, { headers: { 'x-goog-api-key': key }, redirect: 'follow' });
      if (!dl.ok) throw new Error(`gemini download ${dl.status}`);
      fs.writeFileSync(outFile, Buffer.from(await dl.arrayBuffer()));
      return;
    }
    if (Date.now() - started > 20 * 60 * 1000) throw new Error('gemini op timed out after 20min');
    process.stdout.write('.');
  }
}
// Estimated list $/s for the ledger when billing is Google-side.
const GEMINI_EST = { 'veo-3.1-generate-preview': { '720p': 0.2, '1080p': 0.2 }, 'veo-3.1-fast-generate-preview': { '720p': 0.08, '1080p': 0.1 } };

async function pollUntilDone(jobId, label) {
  const url = `https://openrouter.ai/api/v1/videos/${jobId}`;
  const started = Date.now();
  for (;;) {
    await sleep(15000);
    let j;
    try {
      const res = await fetch(url, { headers: HEADERS });
      j = await res.json();
    } catch { continue; } // transient poll error — keep polling
    if (j.status === 'completed') return j;
    if (j.status === 'failed') throw new Error(`${label} failed: ${JSON.stringify(j.error || j).slice(0, 300)}`);
    if (Date.now() - started > 20 * 60 * 1000) throw new Error(`${label} timed out after 20min`);
    process.stdout.write('.');
  }
}

async function download(jobId, outFile) {
  const res = await fetch(`https://openrouter.ai/api/v1/videos/${jobId}/content?index=0`, { headers: HEADERS });
  if (!res.ok) throw new Error(`download ${res.status}`);
  fs.writeFileSync(outFile, Buffer.from(await res.arrayBuffer()));
}

const LEDGER = path.join(RENDERS, 'cost-ledger.json');
function logLedger(entry) {
  const cur = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : [];
  cur.push(entry);
  fs.writeFileSync(LEDGER, JSON.stringify(cur, null, 2));
}

const runnable = MANIFEST.beats.filter((b) =>
  (!ONLY || ONLY.has(b.id)) && b.videoModel && !['code', 'reuse', 'real-footage'].includes(b.treatment));
if (!runnable.length) { console.error('No runnable beats matched. (code/reuse/real-footage beats have no generation step.)'); process.exit(1); }

// Pre-flight: prep images must exist (SB-09 door-closed.png, SB-19 wrap-dark.png).
for (const b of runnable) {
  if (b.prepImage && !fs.existsSync(path.join(STILLS, b.prepImage.output))) {
    console.error(`${b.id}: prep image ${b.prepImage.output} missing — run prep-images.mjs first.`);
    process.exit(1);
  }
}

const jobs = [];
for (const b of runnable) {
  const model = MODEL_OVERRIDE || (DRAFT ? (b.draftModel || b.videoModel) : b.videoModel);
  const takes = TAKES ?? (DRAFT ? 1 : (b.takes || MANIFEST.defaults.takes));
  for (let t = 1; t <= takes; t++) jobs.push({ beat: b, model, take: t });
}

console.log(`${jobs.length} take(s) across ${runnable.length} beat(s)${DRAFT ? ' [DRAFT tier]' : ''}${DRY ? ' [DRY RUN]' : ''}`);

let totalCost = 0, ok = 0, fail = 0;
const MAX_INFLIGHT = 6;
const queue = [...jobs];
const inflight = [];

const VIA = pick('--via') || 'openrouter'; // 'openrouter' | 'gemini' | 'kling-direct'

// Direct Kling (single Bearer key, api-singapore) — kling-v3 pro delivers true
// 1920×1080 where OpenRouter caps at 720p (probe 2026-07-03). Prepaid credits.
async function runKlingJob(beat, out) {
  const H = { Authorization: `Bearer ${process.env.KLING_API_KEY}`, 'Content-Type': 'application/json' };
  const b64 = (still) => frameDataUrl(still).replace(/^data:image\/jpeg;base64,/, '');
  const body = {
    model_name: 'kling-v3',
    mode: 'pro',
    duration: beat.duration >= 8 ? '10' : '5', // Kling accepts 5/10
    prompt: beat.prompt.slice(0, 2400),
    image: b64(beat.frameImages.first),
  };
  if (beat.frameImages?.last) body.image_tail = b64(beat.frameImages.last);
  if (beat.negativePrompt) body.negative_prompt = beat.negativePrompt.slice(0, 2400);
  const sub = await fetch('https://api-singapore.klingai.com/v1/videos/image2video', { method: 'POST', headers: H, body: JSON.stringify(body) });
  const subJ = JSON.parse(await sub.text());
  if (subJ.code !== 0) throw new Error(`kling-direct submit: ${JSON.stringify(subJ).slice(0, 250)}`);
  const id = subJ.data.task_id;
  console.log(`sent  ${beat.id} -> kling-v3 direct (task ${id})`);
  const started = Date.now();
  for (;;) {
    await sleep(15000);
    let j;
    try { j = JSON.parse(await (await fetch(`https://api-singapore.klingai.com/v1/videos/image2video/${id}`, { headers: H })).text()); }
    catch { continue; }
    const st = j.data?.task_status;
    if (st === 'succeed') {
      const url = j.data.task_result?.videos?.[0]?.url;
      const dl = await fetch(url);
      fs.writeFileSync(out, Buffer.from(await dl.arrayBuffer()));
      return;
    }
    if (st === 'failed') throw new Error(`kling-direct failed: ${JSON.stringify(j.data).slice(0, 250)}`);
    if (Date.now() - started > 20 * 60 * 1000) throw new Error('kling-direct timed out');
    process.stdout.write('.');
  }
}

async function runJob({ beat, model, take }) {
  const short = model.split('/')[1].replace(/[^\w.-]/g, '');
  const dir = path.join(RENDERS, beat.id);
  fs.mkdirSync(dir, { recursive: true });
  const suffix = VIA === 'gemini' ? '-gdirect' : VIA === 'kling-direct' ? '-kdirect' : '';
  const out = path.join(dir, `${beat.id}-t${take}-${short}${suffix}${TAG ? `-${TAG}` : ''}.mp4`);
  if (fs.existsSync(out)) { console.log(`skip  ${path.basename(out)} (exists)`); return; }

  if (VIA === 'kling-direct') {
    if (!process.env.KLING_API_KEY) throw new Error('KLING_API_KEY missing');
    if (DRY) { console.log(`DRY   ${beat.id} t${take} -> kling-v3 direct`); return; }
    await runKlingJob(beat, out);
    ok++;
    logLedger({ ts: new Date().toISOString(), beat: beat.id, take, model: 'kling-direct:kling-v3-pro-1080p', cost: 0, costNote: 'prepaid Kling credits (not USD-metered here)', file: path.relative(REPO, out), seconds: beat.duration, resolution: '1080p' });
    console.log(`\nok    ${path.basename(out)} (${(fs.statSync(out).size / 1e6).toFixed(1)}MB, Kling credits)`);
    return;
  }

  if (VIA === 'gemini') {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing');
    if (DRY) { console.log(`DRY   ${beat.id} t${take} -> ${GEMINI_MODEL_MAP[model]} (direct Gemini)`); return; }
    await runGeminiJob(beat, model, out);
    const est = (GEMINI_EST[GEMINI_MODEL_MAP[model]]?.[beat.resolution || '1080p'] ?? 0.2) * Math.min(beat.duration, 8);
    totalCost += est; ok++;
    logLedger({ ts: new Date().toISOString(), beat: beat.id, take, model: `gemini-direct:${GEMINI_MODEL_MAP[model]}`, cost: est, costNote: 'estimated list price, billed to Google project', file: path.relative(REPO, out), seconds: Math.min(beat.duration, 8), resolution: beat.resolution });
    console.log(`\nok    ${path.basename(out)} (${(fs.statSync(out).size / 1e6).toFixed(1)}MB, ~$${est.toFixed(2)} est, Google-billed)`);
    return;
  }

  const body = buildRequest(beat, model);
  if (DRY) {
    const preview = { ...body, frame_images: body.frame_images?.map((f) => ({ ...f, image_url: { url: f.image_url.url.slice(0, 48) + `… (${Math.round(f.image_url.url.length / 1024)}KB)` } })) };
    console.log(`DRY   ${beat.id} t${take} -> ${model}\n${JSON.stringify(preview, null, 2).slice(0, 1200)}\n`);
    return;
  }
  const sub = await submit(body);
  console.log(`sent  ${beat.id} t${take} -> ${model} (job ${sub.id})`);
  const done = await pollUntilDone(sub.id, `${beat.id} t${take}`);
  await download(sub.id, out);
  const cost = Number(done.usage?.cost) || 0;
  totalCost += cost; ok++;
  logLedger({ ts: new Date().toISOString(), beat: beat.id, take, model, jobId: sub.id, cost, file: path.relative(REPO, out), seconds: beat.duration, resolution: body.resolution });
  console.log(`\nok    ${path.basename(out)} (${(fs.statSync(out).size / 1e6).toFixed(1)}MB, $${cost.toFixed(3)})`);
}

async function pump() {
  while (queue.length) {
    const job = queue.shift();
    const p = runJob(job).catch((e) => { fail++; console.error(`\nFAIL  ${job.beat.id} t${job.take}: ${String(e.message).slice(0, 300)}`); });
    inflight.push(p);
    p.finally(() => inflight.splice(inflight.indexOf(p), 1));
    while (inflight.length >= MAX_INFLIGHT) await Promise.race(inflight);
    await sleep(1200); // stagger submits
  }
  await Promise.all(inflight);
}

await pump();
console.log(`\ndone. ok=${ok} fail=${fail}${totalCost ? ` · spend $${totalCost.toFixed(2)}` : ''}`);
if (fail) process.exit(2);
