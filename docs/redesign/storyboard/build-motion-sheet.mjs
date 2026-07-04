#!/usr/bin/env node
// Regenerates motion-contact-sheet.html from renders/ — the video-grid sibling of
// contact-sheet.html, for curating takes. Click a card to mark it selected; the
// "copy selections" button emits JSON to paste back into beats-manifest.json
// (selectedTake per beat). Open via: open docs/redesign/storyboard/motion-contact-sheet.html
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RENDERS = path.join(__dirname, 'renders');
const LEDGER = path.join(RENDERS, 'cost-ledger.json');
const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : [];
const costOf = (rel) => ledger.find((e) => e.file?.endsWith(rel))?.cost;

const beats = fs.existsSync(RENDERS)
  ? fs.readdirSync(RENDERS).filter((d) => /^SB-/.test(d) && fs.statSync(path.join(RENDERS, d)).isDirectory()).sort()
  : [];

let cards = '';
for (const b of beats) {
  const takes = fs.readdirSync(path.join(RENDERS, b)).filter((f) => /\.(mp4|webm)$/.test(f)).sort();
  if (!takes.length) continue;
  cards += `<section><h2>${b}</h2><div class="grid">`;
  for (const t of takes) {
    const rel = `${b}/${t}`;
    const c = costOf(rel);
    cards += `<figure data-take="${rel}"><video src="renders/${rel}" muted loop playsinline preload="metadata" onclick="this.paused?this.play():this.pause()"></video><figcaption>${t}${c ? ` · $${c.toFixed(2)}` : ''}<button onclick="sel(event,'${rel}')">select</button></figcaption></figure>`;
  }
  cards += `</div></section>`;
}

const html = `<!doctype html><meta charset="utf-8"><title>Living scenes — motion contact sheet</title>
<style>
body{background:#0B0B0C;color:#e8e6e3;font:14px/1.5 -apple-system,sans-serif;margin:2rem}
h1{font-weight:600} h2{margin:2.2rem 0 .6rem;color:#C8A24E;font-size:15px;letter-spacing:.12em}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:14px}
figure{margin:0;border:1px solid #26262a;border-radius:2px;overflow:hidden}
figure.sel{border-color:#6CBDE6;box-shadow:0 0 0 1px #6CBDE6}
video{width:100%;display:block;aspect-ratio:16/9;background:#000;cursor:pointer}
figcaption{padding:6px 9px;color:#9a978f;font-size:12px;display:flex;justify-content:space-between;gap:8px;align-items:center}
button{background:#1a1a1e;color:#e8e6e3;border:1px solid #33333a;border-radius:2px;padding:2px 10px;cursor:pointer}
#bar{position:sticky;top:0;background:#0B0B0Cee;padding:.8rem 0;display:flex;gap:12px;align-items:center;z-index:2}
#bar button{background:#6CBDE6;color:#0B0B0C;font-weight:600;border:0;padding:6px 14px}
</style>
<div id="bar"><h1>Motion contact sheet</h1><button onclick="copySel()">copy selections JSON</button><span id="n"></span></div>
${cards || '<p>No renders yet — run generate-videos.mjs first, then re-run build-motion-sheet.mjs.</p>'}
<script>
const S={};function sel(e,rel){e.stopPropagation();const beat=rel.split('/')[0];S[beat]=rel;
document.querySelectorAll('figure').forEach(f=>f.classList.toggle('sel',Object.values(S).includes(f.dataset.take)));
document.getElementById('n').textContent=Object.keys(S).length+' selected';}
function copySel(){navigator.clipboard.writeText(JSON.stringify(S,null,2));alert('Selections copied — paste into beats-manifest.json as selectedTake fields.')}
document.querySelectorAll('video').forEach(v=>{new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting?v.play().catch(()=>{}):v.pause())).observe(v)});
</script>`;

fs.writeFileSync(path.join(__dirname, 'motion-contact-sheet.html'), html);
console.log(`motion-contact-sheet.html written (${beats.length} beat folder(s))`);
