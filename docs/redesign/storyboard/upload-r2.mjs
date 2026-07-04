#!/usr/bin/env node
// Push encoded living-scenes media to Cloudflare R2 (zero-egress; handoff §2.4 + §4.8 Q2).
// Dependency-free AWS SigV4 PUT against the R2 S3 endpoint.
// Requires in .env.local (owner to provision — §4.8 open question 2):
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET (e.g. exotiq-media)
// Usage:
//   node docs/redesign/storyboard/upload-r2.mjs                 # sync public/videos/experience/*
//   node docs/redesign/storyboard/upload-r2.mjs --file <path> --key videos/sb-01.mp4
// Serve via media.driveexotiq.com (R2 custom domain) with cache-everything + immutable.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../../..');

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

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
  console.error(`R2 credentials missing from .env.local — this is §4.8 open question 2 (owner approval).
Needed: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
Setup: Cloudflare dashboard -> R2 -> create bucket -> R2 API token (Object Read & Write)
       -> connect custom domain media.driveexotiq.com to the bucket.
Until then, dev serves video from /public/videos/experience (fine locally; do NOT deploy video to Netlify).`);
  process.exit(1);
}

const HOST = `${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const sha256 = (d) => crypto.createHash('sha256').update(d).digest('hex');
const hmac = (k, d) => crypto.createHmac('sha256', k).update(d).digest();

async function put(key, buf, contentType) {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = amzDate.slice(0, 8);
  const payloadHash = sha256(buf);
  const canonicalUri = `/${R2_BUCKET}/${key.split('/').map(encodeURIComponent).join('/')}`;
  const headers = {
    'cache-control': 'public, max-age=31536000, immutable',
    'content-type': contentType,
    host: HOST,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
  };
  const signedHeaders = Object.keys(headers).sort().join(';');
  const canonicalHeaders = Object.keys(headers).sort().map((h) => `${h}:${headers[h]}\n`).join('');
  const canonicalRequest = ['PUT', canonicalUri, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');
  const scope = `${date}/auto/s3/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256(canonicalRequest)].join('\n');
  const kSigning = hmac(hmac(hmac(hmac(`AWS4${R2_SECRET_ACCESS_KEY}`, date), 'auto'), 's3'), 'aws4_request');
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
  const auth = `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY_ID}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  const res = await fetch(`https://${HOST}${canonicalUri}`, {
    method: 'PUT',
    headers: { ...headers, Authorization: auth },
    body: buf,
  });
  if (!res.ok) throw new Error(`PUT ${key} -> ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

const TYPES = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
const args = process.argv.slice(2);
const pick = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };

const uploads = [];
if (pick('--file')) {
  uploads.push({ file: path.resolve(pick('--file')), key: pick('--key') || path.basename(pick('--file')) });
} else {
  const dir = path.join(REPO, 'public/videos/experience');
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) {
    if (TYPES[path.extname(f)]) uploads.push({ file: path.join(dir, f), key: `videos/${f}` });
  }
}
if (!uploads.length) { console.log('nothing to upload'); process.exit(0); }

for (const u of uploads) {
  const buf = fs.readFileSync(u.file);
  for (let attempt = 1; ; attempt++) {
    try {
      await put(u.key, buf, TYPES[path.extname(u.file)] || 'application/octet-stream');
      break;
    } catch (e) {
      if (attempt >= 4) throw e;
      console.log(`retry ${u.key} (${attempt}): ${e.cause?.code || e.message}`);
      await new Promise((r) => setTimeout(r, 3000 * attempt));
    }
  }
  console.log(`ok  ${u.key} (${(buf.length / 1e6).toFixed(1)}MB)`);
}
console.log(`\n${uploads.length} object(s) uploaded to r2://${R2_BUCKET}. Verify byte-range: curl -r 0-1023 -o /dev/null -sw '%{http_code}\\n' https://media.driveexotiq.com/videos/<key> (expect 206).`);
