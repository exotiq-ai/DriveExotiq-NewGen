#!/usr/bin/env node
// Batch-render the Drive Exotiq storyboard B&W sketches from frames.json.
// Provider auto-detected from env (.env.local or shell). Detection order:
//   OPENROUTER_API_KEY  -> OpenRouter Image API (default model openai/gpt-image-1)   [chosen]
//   OPENAI_API_KEY      -> OpenAI direct (gpt-image-1, falls back to dall-e-3)
//   REPLICATE_API_TOKEN -> Replicate FLUX schnell
//   GEMINI_API_KEY / GOOGLE_API_KEY -> Google Imagen 3
// Force one with IMAGE_PROVIDER=openrouter|openai|replicate|gemini.
// Override the OpenRouter model with OPENROUTER_IMAGE_MODEL (e.g. google/gemini-2.5-flash-image-preview).
//
// Usage:
//   node docs/redesign/storyboard/render-sketches.mjs                 # render missing frames
//   node docs/redesign/storyboard/render-sketches.mjs --force         # re-render all
//   node docs/redesign/storyboard/render-sketches.mjs --only SB-01,SB-05
// Idempotent/resumable: skips frames whose PNG already exists (unless --force).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../../..');
const FRAMES = path.join(__dirname, 'frames.json');
const OUT = path.join(__dirname, 'frames');
fs.mkdirSync(OUT, { recursive: true });

// --- load .env.local / .env (simple parser; never overrides a real env var) ---
function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const raw of fs.readFileSync(file, 'utf8').split('\n')) {
    const l = raw.trim();
    if (!l || l.startsWith('#')) continue;
    const eq = l.indexOf('=');
    if (eq < 0) continue;
    const k = l.slice(0, eq).trim();
    const v = l.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!(k in process.env)) process.env[k] = v;
  }
}
loadEnv(path.join(REPO, '.env.local'));
loadEnv(path.join(REPO, '.env'));

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const onlyIdx = args.indexOf('--only');
const ONLY = onlyIdx >= 0 && args[onlyIdx + 1]
  ? new Set(args[onlyIdx + 1].split(',').map((s) => s.trim()))
  : null;

const frames = JSON.parse(fs.readFileSync(FRAMES, 'utf8'));

// --- provider selection ---
let provider = process.env.IMAGE_PROVIDER || null;
if (!provider) {
  if (process.env.OPENROUTER_API_KEY) provider = 'openrouter';
  else if (process.env.OPENAI_API_KEY) provider = 'openai';
  else if (process.env.REPLICATE_API_TOKEN) provider = 'replicate';
  else if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) provider = 'gemini';
}

if (!provider) {
  console.error('\nNo image API key found. Add ONE of these to .env.local, then re-run:');
  console.error('  OPENROUTER_API_KEY=sk-or-v1-...   OpenRouter Image API (openai/gpt-image-1)  [chosen]');
  console.error('  OPENAI_API_KEY=sk-...             OpenAI direct (gpt-image-1 / dall-e-3)');
  console.error('  REPLICATE_API_TOKEN=r8_...        Replicate FLUX');
  console.error('  GEMINI_API_KEY=...                Google Imagen 3');
  process.exit(1);
}

const OR_MODEL = process.env.OPENROUTER_IMAGE_MODEL || 'openai/gpt-image-1';
console.log(`Provider: ${provider}${provider === 'openrouter' ? ` (model ${OR_MODEL})` : ''} · frames: ${frames.length} · out: ${OUT}`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// each gen returns { buf: Buffer, cost: number }
async function genOpenRouter(prompt) {
  const res = await fetch('https://openrouter.ai/api/v1/images', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://driveexotiq.com',
      'X-Title': 'Drive Exotiq Storyboard',
    },
    body: JSON.stringify({ model: OR_MODEL, prompt, aspect_ratio: '16:9' }),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  const b64 = j?.data?.[0]?.b64_json;
  if (!b64) throw new Error('OpenRouter: no image bytes: ' + JSON.stringify(j).slice(0, 220));
  return { buf: Buffer.from(b64, 'base64'), cost: Number(j?.usage?.cost) || 0 };
}

async function genOpenAI(prompt) {
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` };
  let res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST', headers,
    body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1536x1024', quality: 'medium', n: 1 }),
  });
  if (!res.ok) {
    const err = await res.text();
    if ([400, 401, 403, 404].includes(res.status)) {
      res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST', headers,
        body: JSON.stringify({ model: 'dall-e-3', prompt, size: '1792x1024', quality: 'standard', n: 1, response_format: 'b64_json' }),
      });
      if (!res.ok) throw new Error(`OpenAI dall-e-3 ${res.status}: ${(await res.text()).slice(0, 240)} | gpt-image-1: ${err.slice(0, 160)}`);
    } else {
      throw new Error(`OpenAI ${res.status}: ${err.slice(0, 240)}`);
    }
  }
  const j = await res.json();
  const b64 = j.data?.[0]?.b64_json;
  if (!b64) throw new Error('OpenAI: no image bytes in response');
  return { buf: Buffer.from(b64, 'base64'), cost: 0 };
}

async function genReplicate(prompt) {
  const auth = { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` };
  const create = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
    method: 'POST', headers: { ...auth, Prefer: 'wait' },
    body: JSON.stringify({ input: { prompt, aspect_ratio: '16:9', output_format: 'png', num_outputs: 1 } }),
  });
  if (!create.ok) throw new Error(`Replicate ${create.status}: ${(await create.text()).slice(0, 240)}`);
  let pred = await create.json();
  while (pred.status && !['succeeded', 'failed', 'canceled'].includes(pred.status)) {
    await sleep(1500);
    pred = await (await fetch(pred.urls.get, { headers: auth })).json();
  }
  if (pred.status !== 'succeeded') throw new Error(`Replicate prediction ${pred.status}`);
  const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
  return { buf: Buffer.from(await (await fetch(url)).arrayBuffer()), cost: 0 };
}

async function genGemini(prompt) {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${key}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1, aspectRatio: '16:9' } }),
  });
  if (!res.ok) throw new Error(`Imagen ${res.status}: ${(await res.text()).slice(0, 240)}`);
  const j = await res.json();
  const b64 = j.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error('Imagen: no image bytes in response');
  return { buf: Buffer.from(b64, 'base64'), cost: 0 };
}

const gen = { openrouter: genOpenRouter, openai: genOpenAI, replicate: genReplicate, gemini: genGemini }[provider];

async function withRetry(fn, label, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try { return await fn(); }
    catch (e) {
      last = e;
      const wait = 2500 * (i + 1);
      console.warn(`  retry ${label} in ${wait}ms: ${String(e.message).slice(0, 140)}`);
      await sleep(wait);
    }
  }
  throw last;
}

let done = 0, failed = 0, skipped = 0, totalCost = 0;
const queue = frames.filter((f) => !ONLY || ONLY.has(f.id));

async function worker(list) {
  for (const f of list) {
    const outPath = path.join(OUT, f.file);
    if (!FORCE && fs.existsSync(outPath) && fs.statSync(outPath).size > 0) {
      skipped++; console.log(`skip  ${f.id} (exists)`); continue;
    }
    try {
      const { buf, cost } = await withRetry(() => gen(f.prompt), f.id);
      fs.writeFileSync(outPath, buf);
      totalCost += cost;
      done++; console.log(`ok    ${f.id} -> ${f.file} (${buf.length} bytes${cost ? `, $${cost.toFixed(4)}` : ''})`);
    } catch (e) {
      failed++; console.error(`FAIL  ${f.id}: ${String(e.message).slice(0, 200)}`);
    }
  }
}

// bound concurrency with round-robin lanes
const CONC = provider === 'replicate' || provider === 'gemini' ? 2 : 3;
const lanes = Array.from({ length: CONC }, () => []);
queue.forEach((f, i) => lanes[i % CONC].push(f));
await Promise.all(lanes.map(worker));

console.log(`\nDone. rendered=${done} skipped=${skipped} failed=${failed}${totalCost ? ` · cost ~$${totalCost.toFixed(2)}` : ''}\n${OUT}`);
if (failed) process.exit(2);
