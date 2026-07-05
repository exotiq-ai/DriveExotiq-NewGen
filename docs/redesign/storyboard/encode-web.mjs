#!/usr/bin/env node
// Web-encode ladder for living-scenes media (handoff §4.3 STEP 5 + §2.4 research).
//   loop  -> H.264 High CRF18 -an faststart (+ 720p mobile variant) + poster from frame 0
//   scrub -> all-intra H.264 baseline -g 2 (+ VP9 -g 2 webm twin for Firefox) + poster
//   posters mode -> AVIF/WebP posters for every manifest still (Phase 0 LCP debt fix)
// Usage:
//   node docs/redesign/storyboard/encode-web.mjs --posters
//   node docs/redesign/storyboard/encode-web.mjs --beat SB-01 --in renders/SB-01/SB-01-t1-kling-v3.0-pro.mp4
//   node docs/redesign/storyboard/encode-web.mjs --beat SB-02 --in <take.mp4> --trim 1.5:3.5   # scrub beats: start:duration
//   node docs/redesign/storyboard/encode-web.mjs --beat SB-12 --in <take.mp4> --seam 0.5       # bake xfade loop seam
// Output: public/videos/experience/<beat>[.720|-scrub][.mp4|.webm], public/images/experience/poster/<beat>.{avif,webp,jpg}

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../../..');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(__dirname, 'beats-manifest.json'), 'utf8'));
const VIDS = path.join(REPO, MANIFEST.webVideoDir);
const POSTERS = path.join(REPO, MANIFEST.posterDir);
const STILLS = path.join(REPO, MANIFEST.stillsDir);
fs.mkdirSync(VIDS, { recursive: true });
fs.mkdirSync(POSTERS, { recursive: true });

const args = process.argv.slice(2);
const pick = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const ff = (a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a], { stdio: ['ignore', 'inherit', 'inherit'] });
const probe = (file, entry) => execFileSync('ffprobe', ['-v', 'error', '-show_entries', entry, '-of', 'csv=p=0', file]).toString().trim();

function posterFrom(input, name, { fromVideo = false } = {}) {
  // frame 0 of the delivered loop = pixel-exact still->video handoff (or the graded still itself)
  const base = path.join(POSTERS, name);
  const grab = fromVideo ? ['-i', input, '-frames:v', '1'] : ['-i', input];
  ff([...grab, '-vf', "scale='min(2560,iw)':-2", '-c:v', 'libaom-av1', '-still-picture', '1', '-crf', '28', '-b:v', '0', `${base}.avif`]);
  ff([...grab, '-vf', "scale='min(2560,iw)':-2", '-c:v', 'libwebp', '-q:v', '82', `${base}.webp`]);
  ff([...grab, '-vf', "scale='min(1920,iw)':-2", '-q:v', '3', `${base}.jpg`]); // universal <video poster> fallback
  console.log(`poster ${name}.{avif,webp,jpg}`);
}

if (args.includes('--posters')) {
  const seen = new Set();
  for (const b of MANIFEST.beats) {
    const name = b.id.toLowerCase();
    if (seen.has(b.still)) continue; // SB-20/SB-08b reuse stills; poster per beat id anyway is wasteful — key by still
    seen.add(b.still);
    posterFrom(path.join(STILLS, b.still), path.basename(b.still).replace(/\.(png|jpe?g)$/i, ''));
  }
  console.log('\nAll manifest stills converted to AVIF/WebP/JPG posters.');
  process.exit(0);
}

const beatId = pick('--beat');
const input = pick('--in');
if (!beatId || !input) { console.error('need --beat SB-xx --in <file> (or --posters)'); process.exit(1); }
const beat = MANIFEST.beats.find((b) => b.id === beatId);
if (!beat) { console.error(`unknown beat ${beatId}`); process.exit(1); }
const src = path.isAbsolute(input) ? input : path.join(REPO, input.startsWith('docs/') ? input : path.join('docs/redesign/storyboard', input));
if (!fs.existsSync(src)) { console.error(`input missing: ${src}`); process.exit(1); }

const name = beatId.toLowerCase();
const trim = pick('--trim'); // "start:duration"
const seam = pick('--seam'); // xfade seconds
const kind = pick('--kind') || (beat.treatment === 'scrub' ? 'scrub' : 'loop');

let work = src;
const tmpDir = path.join(REPO, 'docs/redesign/storyboard/renders/.encode-tmp');
fs.mkdirSync(tmpDir, { recursive: true });

if (trim) {
  const [ss, d] = trim.split(':');
  work = path.join(tmpDir, `${name}-trim.mp4`);
  ff(['-ss', ss, '-i', src, '-t', d, '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-an', work]);
}

if (seam) {
  // bake the final <seam>s into the head as a crossfade -> hard-loopable file (§ SB-12/13 spec)
  const dur = parseFloat(probe(work, 'format=duration'));
  const s = parseFloat(seam);
  const out = path.join(tmpDir, `${name}-seamed.mp4`);
  ff(['-i', work, '-filter_complex',
    `[0:v]trim=0:${(dur - s).toFixed(3)},setpts=PTS-STARTPTS[main];[0:v]trim=${(dur - s).toFixed(3)}:${dur.toFixed(3)},setpts=PTS-STARTPTS[tail];[tail][main]xfade=transition=fade:duration=${s}:offset=0[v]`,
    '-map', '[v]', '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-an', out]);
  work = out;
}

// --crf overrides the loop-ladder quality (default 18/21). Real footage is
// entropy-dense (foliage, gravel) and masks compression far better than clean
// AI gradients — the 2026-07-04 real swaps ship at --crf 20 (720p = crf+2).
const crf = parseInt(pick('--crf') ?? '18', 10);
// --audio keeps the master's audio track (AAC 128k) instead of stripping it.
// The film is silent by design — only user-gesture unmute beats (SB-11's real
// ignition) carry sound; playback still starts muted for autoplay policy.
const AUD = args.includes('--audio') ? ['-c:a', 'aac', '-b:a', '128k'] : ['-an'];

if (kind === 'loop' || kind === 'play-once') {
  ff(['-i', work, '-c:v', 'libx264', '-profile:v', 'high', '-crf', String(crf), '-preset', 'slow', '-pix_fmt', 'yuv420p', ...AUD, '-movflags', '+faststart', path.join(VIDS, `${name}.mp4`)]);
  ff(['-i', work, '-vf', "scale='min(1280,iw)':-2", '-c:v', 'libx264', '-profile:v', 'high', '-crf', String(crf + 2), '-preset', 'slow', '-pix_fmt', 'yuv420p', ...AUD, '-movflags', '+faststart', path.join(VIDS, `${name}.720.mp4`)]);
  console.log(`loop   ${name}.mp4 (${(fs.statSync(path.join(VIDS, `${name}.mp4`)).size / 1e6).toFixed(1)}MB) + ${name}.720.mp4`);
} else if (kind === 'scrub') {
  ff(['-i', work, '-c:v', 'libx264', '-profile:v', 'baseline', '-level', '3.1', '-pix_fmt', 'yuv420p', '-g', '2', '-crf', '19', '-preset', 'veryslow', '-an', '-movflags', '+faststart', path.join(VIDS, `${name}-scrub.mp4`)]);
  ff(['-i', work, '-c:v', 'libvpx-vp9', '-g', '2', '-crf', '32', '-b:v', '0', '-an', path.join(VIDS, `${name}-scrub.webm`)]);
  // mobile play-once variant (normal GOP, small)
  ff(['-i', work, '-c:v', 'libx264', '-profile:v', 'high', '-crf', '20', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', path.join(VIDS, `${name}.mp4`)]);
  console.log(`scrub  ${name}-scrub.mp4 (${(fs.statSync(path.join(VIDS, `${name}-scrub.mp4`)).size / 1e6).toFixed(1)}MB) + webm twin + ${name}.mp4 mobile`);
}

posterFrom(work, name, { fromVideo: true });
console.log('done.');
