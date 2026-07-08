#!/usr/bin/env node
// Prep-frame synthesizer for the two-step beats (SB-09 door-closed.png, SB-19 wrap-dark.png).
// Primary: direct Gemini API (gemini-3-pro-image / Nano Banana Pro) — OpenRouter's Google
// image route is 403-blocked upstream (handoff §2.2). Fallback: OpenRouter images API
// with the beat's fallbackModel (seedream-4.5 / gpt-image-2).
// Usage: node docs/redesign/storyboard/prep-images.mjs [--only SB-09] [--force] [--via openrouter]

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../../..');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(__dirname, 'beats-manifest.json'), 'utf8'));
const STILLS = path.join(REPO, MANIFEST.stillsDir);

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

const args = process.argv.slice(2);
const pick = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const ONLY = pick('--only') ? new Set(pick('--only').split(',')) : null;
const FORCE = args.includes('--force');
const VIA = pick('--via') || (process.env.GEMINI_API_KEY ? 'gemini' : 'openrouter');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function b64Of(still, maxW = 1568) {
  const src = path.join(STILLS, still);
  const tmp = path.join(REPO, 'docs/redesign/storyboard/renders/.frame-cache', `prep-${still.replace(/[^\w.-]/g, '_')}.jpg`);
  fs.mkdirSync(path.dirname(tmp), { recursive: true });
  // 16:9 center-crop so the model can't reframe 3:2 sources (continuity frames).
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src,
    '-vf', `crop='min(iw,ih*16/9)':'min(ih,iw*9/16)',scale='min(${maxW},iw)':-2`, '-q:v', '3', tmp]);
  return fs.readFileSync(tmp).toString('base64');
}

async function viaGemini(beat) {
  const model = 'gemini-3-pro-image';
  const body = {
    contents: [{
      parts: [
        { text: beat.prepImage.prompt },
        ...beat.prepImage.inputReferences.map((r) => ({ inline_data: { mime_type: 'image/jpeg', data: b64Of(r) } })),
      ],
    }],
    // prepImage.aspect '9:16' = portrait-native mobile plates (2026-07-07);
    // references stay 16:9-cropped context either way.
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: beat.prepImage.aspect || '16:9', imageSize: beat.prepImage.size || '2K' } },
  };
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`gemini ${res.status}: ${text.slice(0, 300)}`);
  const j = JSON.parse(text);
  const part = j.candidates?.[0]?.content?.parts?.find((p) => p.inlineData || p.inline_data);
  const data = part?.inlineData?.data || part?.inline_data?.data;
  if (!data) throw new Error('gemini returned no image: ' + text.slice(0, 300));
  return Buffer.from(data, 'base64');
}

async function viaOpenRouter(beat) {
  const body = {
    model: beat.prepImage.fallbackModel,
    prompt: beat.prepImage.prompt,
    aspect_ratio: '16:9',
    input_references: beat.prepImage.inputReferences.map((r) => `data:image/jpeg;base64,${b64Of(r, 1000)}`),
  };
  const res = await fetch('https://openrouter.ai/api/v1/images', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`openrouter ${res.status}: ${text.slice(0, 300)}`);
  const b64 = JSON.parse(text)?.data?.[0]?.b64_json;
  if (!b64) throw new Error('no image bytes');
  return Buffer.from(b64, 'base64');
}

const beats = MANIFEST.beats.filter((b) => b.prepImage && (!ONLY || ONLY.has(b.id)));
for (const b of beats) {
  const out = path.join(STILLS, b.prepImage.output);
  if (!FORCE && fs.existsSync(out)) { console.log(`skip  ${b.id} (${b.prepImage.output} exists)`); continue; }
  let buf = null;
  for (let attempt = 1; attempt <= 3 && !buf; attempt++) {
    try {
      buf = VIA === 'gemini' ? await viaGemini(b) : await viaOpenRouter(b);
    } catch (e) {
      console.error(`${b.id} attempt ${attempt} via ${VIA}: ${String(e.message).slice(0, 220)}`);
      if (attempt === 3 && VIA === 'gemini') {
        console.log(`${b.id}: falling back to OpenRouter ${b.prepImage.fallbackModel}`);
        try { buf = await viaOpenRouter(b); } catch (e2) { console.error(`${b.id} fallback failed: ${e2.message.slice(0, 220)}`); }
      } else await sleep(3000 * attempt);
    }
  }
  if (!buf) { console.error(`FAIL  ${b.id}`); process.exitCode = 2; continue; }
  fs.writeFileSync(out, buf);
  console.log(`ok    ${b.id} -> ${b.prepImage.output} (${(buf.length / 1e6).toFixed(2)}MB) — INSPECT before video gen`);
}
