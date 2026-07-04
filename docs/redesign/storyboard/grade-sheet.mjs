#!/usr/bin/env node
// Grade-consistency sheet: one labeled mid-frame from every delivered desktop
// loop/play-once, tiled 5-across — the "does it read as one film?" check.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '../../..');
const V = path.join(REPO, 'public/videos/experience');
const Q = path.join(__dirname, 'renders/.qa');
const ff = (a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
const probe = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

const files = fs.readdirSync(V).filter((f) => f.endsWith('.mp4') && !f.includes('720') && !f.includes('scrub')).sort();
const frames = [];
for (const f of files) {
  const b = f.replace('.mp4', '');
  const out = path.join(Q, `g-${b}.jpg`);
  ff(['-ss', String(probe(path.join(V, f)) / 2), '-i', path.join(V, f), '-frames:v', '1',
    '-vf', `scale=280:-2,drawtext=text='${b}':x=6:y=h-18:fontsize=13:fontcolor=white:box=1:boxcolor=black@0.5`, '-update', '1', out]);
  frames.push(out);
}
const cols = 5, n = frames.length;
const layout = frames.map((_, i) => {
  const c = i % cols, r = Math.floor(i / cols);
  const x = c === 0 ? '0' : Array.from({ length: c }, (_, j) => `w${j}`).join('+');
  const y = r === 0 ? '0' : Array.from({ length: r }, () => 'h0').join('+');
  return `${x}_${y}`;
}).join('|');
ff([...frames.flatMap((f) => ['-i', f]),
  '-filter_complex', `${frames.map((_, i) => `[${i}]`).join('')}xstack=inputs=${n}:layout=${layout}:fill=black`,
  path.join(Q, 'GRADE-SHEET.jpg')]);
console.log(`GRADE-SHEET.jpg: ${n} plates`);
