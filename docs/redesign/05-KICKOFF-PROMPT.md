# 05 — Kickoff prompt for the living-scenes build session

Copy-paste the block below into a fresh Claude Code session opened in this repo.

---

I'm Gregory, owner of Drive Exotiq. You're picking up a fully-scoped project mid-flight: turning our working cinematic scroll page `/experience` into an award-level, film-style **living** experience — every scene in motion, Hollywood-grade.

**Before doing anything else, read `docs/redesign/04-LIVING-SCENES-HANDOFF.md` in full.** It is the complete handoff: Part 1 = everything already built + hard-won implementation learnings (do not re-derive or rebuild any of it), Part 2 = live-researched model landscape, Part 3 = per-scene living-element treatments for all 24 beats with ready-to-run image-to-video prompts, Part 4 = strategy, pipeline, engineering plan, 5-phase roadmap, budget, risks. Companion docs if needed: `00-BUILD-SPEC.md` (brand law), `01-COPY-BRIEF.md` (voice), `03-STORYBOARD-cinematic-scroll.md` (storyboard + director decisions).

Key facts (all verified, details in the handoff):
- Repo branch: `claude/exotiq-cinematic-scroll-landing` (work is intentionally uncommitted — commit only when I ask).
- `/experience` runs today: pinned cross-dissolve stage, 24 photoreal beats, dev server via `npm run dev`.
- API keys in `.env.local`, all live-validated: `OPENROUTER_API_KEY` (images + video: Veo 3.1, Kling, Hailuo, Seedance routes), `GEMINI_API_KEY` (Nano Banana Pro / gemini-3-pro-image, Imagen 4, Veo 3.1 direct), `KLING_API_KEY` (direct, single Bearer key, api-singapore.klingai.com). Sora is excluded (API sunset).
- Real assets beat generation wherever they exist: see handoff §1.5b (4K roller footage, interiors, drone) and §1.5c (photo-shoot inventory + the real-asset override map). Generation scripts to pattern-match: `docs/redesign/storyboard/scenes-photoreal.mjs` and `sketch-from-ref.mjs`.

How I work: proceed autonomously end-to-end; don't stop for approval on things the handoff already decides. Surface genuine forks as short explicit questions (the handoff's §4.8 open questions are still open — ask them when they block you, not before). Respect the hard ship-gates: mobile/reduced-motion/slow-connection always get the static-poster experience; the crawlable spine + verbatim AEO anchor stay; one Gulf accent per viewport; the banned-word list; never invent car specs.

Your mission: execute the Part 4.5 roadmap starting at **Phase 0** (generation/encoding/delivery pipeline + stage foundation, zero visible change), then **Phase 1** (the hero beats come alive — Kling seamless loops, Veo hero shots, the Rive gauge sweep modeled on the real cluster photos DSC02086/DSC02096, and the regraded real roller footage cut into SB-19b). Apply the §1.5c real-asset override map as you go. Verify everything you claim (run it, curl it, screenshot it). Go.
