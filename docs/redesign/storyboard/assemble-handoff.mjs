#!/usr/bin/env node
// Assemble Parts 2-4 of 04-LIVING-SCENES-HANDOFF.md from the workflow's structured
// output JSON. Deterministic serialization — no LLM in the loop, nothing truncated.
// Usage: node assemble-handoff.mjs <workflow-output.json>

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOC = path.resolve(__dirname, '../04-LIVING-SCENES-HANDOFF.md');
const src = process.argv[2];
if (!src || !fs.existsSync(src)) { console.error('usage: node assemble-handoff.mjs <workflow-output.json>'); process.exit(1); }

const raw = JSON.parse(fs.readFileSync(src, 'utf8'));
const { research, treatments, strategy } = raw.result || raw;
if (!research || !treatments || !strategy) { console.error('output missing research/treatments/strategy'); process.exit(1); }

const esc = (s) => (s == null ? '' : String(s).trim());
let md = '';

// ---------- Part 2: researched model landscape ----------
md += '\n---\n\n# Part 2 — The model landscape (live research, 2026-07-03)\n\n';
md += '> Four researchers verified this against primary sources (pricing pages, API refs) on the live web. Sources listed per section.\n\n';
const TOPIC_TITLES = {
  'video-gen': '2.1 Video generation (image-to-video) — the core capability',
  'openrouter-video': '2.2 OpenRouter video API — what the existing key can do',
  'hollywood-stills': '2.3 Hollywood-grade stills — re-render, upscale, depth',
  'scroll-film-engineering': '2.4 Award-site scroll-film engineering',
};
for (const r of research) {
  md += `## ${TOPIC_TITLES[r.topic] || r.topic}\n\n${esc(r.summary)}\n\n`;
  md += `**Recommendation:** ${esc(r.recommendation)}\n\n`;
  for (const f of r.findings || []) {
    md += `### ${esc(f.name)}\n\n${esc(f.detail)}\n\n**Fit for this project:** ${esc(f.fitForProject)}\n\n`;
  }
  if (r.sources?.length) md += '**Sources:** ' + r.sources.map(esc).join(' · ') + '\n\n';
}

// ---------- Part 3: per-scene treatments ----------
md += '---\n\n# Part 3 — Living-element treatments, scene by scene\n\n';
md += '> One entry per beat: what moves, how it is made (video gen vs code vs hybrid), the ready-to-run generation prompt, the transition into the next beat, and the mandatory fallback. Priorities: **hero** = build first, defines the experience; high = strong lift; standard = polish.\n\n';
const ACT_ORDER = ['Act I', 'Act II', 'Act III', 'Act IV', 'Act V', 'Act VI'];
const sorted = [...treatments].sort((a, b) =>
  ACT_ORDER.findIndex((k) => a.act.startsWith(k)) - ACT_ORDER.findIndex((k) => b.act.startsWith(k)));
for (const t of sorted) {
  md += `## ${esc(t.act)}\n\n_${esc(t.actIntent)}_\n\n`;
  for (const s of t.scenes || []) {
    md += `### ${esc(s.id)} — priority: ${esc(s.priority)} · technique: \`${esc(s.technique)}\`\n\n`;
    md += `**The living element.** ${esc(s.livingElement)}\n\n`;
    if (esc(s.videoGenPrompt)) md += '**Video-gen prompt (ready to run):**\n\n```text\n' + esc(s.videoGenPrompt) + '\n```\n\n';
    if (esc(s.codeMotionSpec)) md += `**Code motion spec.** ${esc(s.codeMotionSpec)}\n\n`;
    md += `**Transition out.** ${esc(s.transitionOut)}\n\n`;
    md += `**Fallback (ship-gate).** ${esc(s.fallback)}\n\n`;
  }
}

// ---------- Part 4: strategy ----------
md += '---\n\n# Part 4 — Strategy: pipeline, roadmap, budget\n\n';
md += `## 4.1 Executive summary\n\n${esc(strategy.executiveSummary)}\n\n`;
md += '## 4.2 Model matrix\n\n| Model | Provider | Access | Best for | Cost (our volume) | Verdict |\n|---|---|---|---|---|---|\n';
for (const m of strategy.modelMatrix || []) {
  const row = [m.model, m.provider, m.access, m.bestFor, m.costEstimate, m.verdict].map((x) => esc(x).replace(/\|/g, '/').replace(/\n/g, ' '));
  md += '| ' + row.join(' | ') + ' |\n';
}
md += `\n## 4.3 The generation pipeline\n\n${esc(strategy.pipeline)}\n\n`;
md += `## 4.4 Engineering plan (how CinematicStage evolves)\n\n${esc(strategy.engineeringPlan)}\n\n`;
md += '## 4.5 Phased roadmap\n\n';
for (const p of strategy.phasedRoadmap || []) {
  md += `### ${esc(p.phase)} — ${esc(p.goal)}\n\n`;
  for (const task of p.tasks || []) md += `- ${esc(task)}\n`;
  md += `\n**Exit criteria:** ${esc(p.exitCriteria)}\n\n`;
}
md += `## 4.6 Budget estimate\n\n${esc(strategy.budgetEstimate)}\n\n`;
md += '## 4.7 Risks & mitigations\n\n';
for (const r of strategy.risks || []) md += `- ${esc(r)}\n`;
md += '\n## 4.8 Open questions for the owner\n\n';
(strategy.openQuestionsForOwner || []).forEach((q, i) => { md += `${i + 1}. ${esc(q)}\n`; });
md += '\n---\n\n*End of handoff. Start at Part 4.5 Phase 1; Part 1 has everything you must not re-derive; Part 3 has the prompts ready to run.*\n';

// Replace everything after the Part-1 sentinel line, or append.
const SENTINEL = '*Part 2 (researched model landscape), Part 3 (per-scene living-element treatments), and Part 4 (strategy, pipeline, roadmap, budget) are generated from live research below.*';
let doc = fs.readFileSync(DOC, 'utf8');
const idx = doc.indexOf(SENTINEL);
doc = idx >= 0 ? doc.slice(0, idx + SENTINEL.length) + '\n' + md : doc + '\n' + md;
fs.writeFileSync(DOC, doc);
console.log(`assembled: ${DOC} (${doc.length} chars)`);
console.log(`research topics: ${research.map((r) => r.topic).join(', ')}`);
console.log(`treatment acts: ${sorted.map((t) => t.act).join(' | ')}`);
console.log(`scenes treated: ${sorted.reduce((n, t) => n + (t.scenes?.length || 0), 0)}`);
console.log(`roadmap phases: ${(strategy.phasedRoadmap || []).length}`);
