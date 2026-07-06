# 08 — SITE COHESION HANDOFF: the final push

> **For the next session.** Everything here was verified against the live code
> and staging on 2026-07-04 by a 4-lens parallel review (home+tour ·
> community/marketplace/blog · forms+legal · full link-graph). The film
> (/experience) is finished, reviewed, and live; this doc is the plan for
> making the REST of the site worthy of it. Owner decisions already made are
> marked ✅; open ones are in §7. Blog topics for the writing chat live in
> `BLOG-TOPICS.md` (self-contained — hand that file off separately).

---

## 1. The architecture decision ✅

**The film becomes the home page. Yes.** The current home ("the Garage"
walkthrough) is a second, competing cinematic scroll that ends on the film's
own closing line — two scroll films dilute the flagship, and the film already
carries the thesis, the pillars end-card, the JSON-LD, and the conversion
machinery. The audit personas confirmed the film converts; the garage just
narrates.

**The atomic swap (do all of it in ONE deploy):**
1. Move the film into `app/page.tsx` (ExperienceScroll + metadata + JSON-LD +
   sr-only spine). `/experience` becomes a **permanent redirect → /**
   (next.config redirect, 301).
2. Update in the same commit: `app/sitemap.ts` (drop /experience entry),
   `public/llms.txt` (URLs), OG `url` fields + canonical, the film's JSON-LD
   `url`, and the Footer's "The Drive — the film" entry (retarget or drop).
3. The film's own `href="/"` links (two logo lockups + mini-footer "Home",
   ExperienceScroll.tsx:104/203/357) become self-referential — the logo can
   stay (convention: logo → home scrolls to top), the mini-footer "Home" goes.
4. **The end card becomes the site's de-facto front-door nav** — this is the
   single highest-leverage link fix: today all four pillar cards route to
   /apply or /sponsor only. Rewire: Rent → "Join the waitlist" → /marketplace
   (CTA-WAITLIST law), Drive → "Request your invite" → /apply (CTA-INVITE),
   Gather → /drives (post-fold), Partner → /sponsor?interest=partnership
   (already right). Mini-footer adds The drives · Stories.
5. Harvest before deleting the garage: the visible server-rendered AEO anchor
   (keep one visible on the new /), the room promise/jewel lines (reuse as
   pillar-page intros), then retire `components/home/*`.
6. Verify: LCP on / (poster path already optimized), redirect chains, and that
   every route in sitemap still renders.

## 2. What survives, what goes

| Route | Verdict | One-line work order |
|---|---|---|
| `/` (garage) | **replace** | Film takes it (§1); harvest links/copy first |
| `/experience` | **promote → /** | 301 after the swap |
| `/tour` | **survive** | The sponsor's study document — keep the rail; add per-market date windows + a reach band + media-kit link; fix odometer basis (counts 4,980 round-trip vs legs summing ~2,500 one-way — a sponsor doing arithmetic catches it); lowercase "LEG n/10" |
| `/sponsor` | **survive-rebuild** 🔴 | Launch blocker: real page per brief §9 + CMP-FORM-SPONSOR; kill "Request the sponsor deck"→/apply (off-library, dumps sponsors into the consumer form); honor `?interest=partnership`; tier names Title/Wrap · Tour · Drive (page says "Stop" — wrong) |
| `/apply` | **survive-rebuild** 🔴 | Launch blocker: destination of nearly every primary CTA and the most off-brand page on the site (midnight-blue/VIP/"AI-powered verification" hype, uppercase kicker). Rebuild in film tokens + quiet voice; keep ApplicationForm + POST path; add the interest select (§4); fix cityOfInterest (Denver/Scottsdale/Miami is off-canon) |
| `/thank-you` | **survive-retoken** | Funnel terminus in old skin; success copy branches by interest; noindex |
| `/drives` | **survive-build** | The one pillar with a functional job the film can't do: next-drive card, invite mechanics, FAQ (FAQPage JSON-LD lives HERE, not on the film); absorbs /community's people/values/ecosystem; CTA becomes "Request your invite" |
| `/community` | **fold → /drives** | 301; origin story becomes the first Stories post; drop from Header/Footer/sitemap |
| `/marketplace` | **survive-build** ✅ | Owner call confirmed: real product screenshot + coming-soon teaser + **on-page waitlist capture** (CTA-WAITLIST binds "Join the waitlist" HERE — the current page bouncing that label to /apply breaks the law). ⚠️ existing `public/images/app/*` mockups are legacy light-UI with App-Store badges — owner is feeding a fresh screenshot |
| `/blog` (Stories) | **survive-build** | Shell doesn't exist beyond a stub: build index + `[slug]` MDX template + BlogPosting JSON-LD + reading rail; then feed from BLOG-TOPICS.md |
| `/cities` | **kill** | Orphan, stale launch dates (Dec 2025!), Unsplash imagery; 301 → /tour |
| `/events` | **kill** | Orphan, banned copy ("unforgettable" ×2), past event listed as upcoming; 301 → /drives |
| `/how-it-works` | **kill** | Orphan, claims live booking ("Real-time availability") against coming-soon canon; 301 → /marketplace |
| `/investors` | **kill** | "$2.5M PRE-SEED • CLOSING SOON" orange pill on a quiet-luxury domain; 301 → summary.exotiq.ai |
| `/booking/phoenix` | **kill** ⚠️ §7 | LIVE Wheelbase booking iframe — direct contradiction of "coming soon" everywhere; owner strategy call, then 301 → /marketplace |
| `/privacy /terms /cookies /sms /dmca` | **survive** | Content fine; ONE reskin of shared LegalLayout fixes all five; add /cookies + /sms + /dmca to main Footer legal row; add the promised "Cookie Settings" trigger; SmsConsentCheckboxes must link /sms at the point of consent |
| `/not-found` | **survive-as-is** | Already on-language ("This road doesn't exist.") |
| `/admin*` | **survive** | Internal, robots-excluded (note: client-side password gate is weak — separate security task) |

**Dead code purge (same PR as the garage retirement):** 13 unused
`components/sections/*` files (uppercase kickers, banned copy, Turo-bashing,
stale dates), the legacy tailwind palette (tailwind.config.ts:45-52:
midnight-blue/jet-grey/pure-white/metallic-silver/performance-orange…), the
legacy @apply blocks in globals.css, WheelbaseIframe/WelcomeGate. Salvage
first: InvestorTeaser's market numbers (→ sponsor reach band, if canon-checked).

## 3. Owner's specific questions — answers ✅

- **Tour mileage rail in the film?** No as persistent chrome — the film's law
  is one instrument (Gulf hairline + ticks), and SB-17's odometer already
  delivers the mileage payoff at the right narrative moment. Keep the rail as
  /tour's signature so each surface keeps a distinctive instrument; cohesion ≠
  uniformity. (Rail mechanics documented in the review: SVG bézier spine +
  strokeDash draw-in bound to scroll progress — untouched, it's good.)
- **Marketplace screenshot teaser?** Yes — real product UI beats abstract
  promise. Feed the image; it gets a device/browser frame, dusk-graded
  backdrop, "Coming soon at exotiq.rent", and the on-page waitlist form that
  makes CTA-WAITLIST legal.
- **Contact/interest dropdown?** Spec'd in §4 — one funnel, tagged intent.

## 4. One-contact architecture (the interest select)

Verified submission path: ApplicationForm (react-hook-form + zod) → POST
`/api/applications` → Supabase `de_applications` → email notify → /thank-you.

Minimal change set:
1. `lib/validations.ts`: `interest: z.enum(['access','drives','title-wrap','tour','drive','partnership','other']).default('access')`.
2. ApplicationForm: select above the fields — "What brings you here?" →
   `Rent — first keys to the fleet` / `The drives & Cars and Coffee` /
   `Sponsor the wrap (Title/Wrap · Tour · Drive)` / `Event partnership` /
   `Something else`. Reads `?interest=` for preselect (film end-card already
   sends `?interest=partnership`; sponsor CTAs send their tier).
3. `/api/applications` + `de_applications`: add the column (Supabase
   migration), include in the notify email subject so triage is zero-click.
4. /thank-you branches copy by interest (sponsor gets SP-FORM-SUCCESS voice).
5. When CMP-FORM-SPONSOR ships on /sponsor, sponsor tiers move there; the
   /apply select keeps `partnership` as the lightweight lane.

## 5. Cohesion fix list (mechanical, one sweep)

- Title normalization: kill double branding ("Apply | Drive Exotiq · Drive
  Exotiq") — pages emit bare titles, the template adds the suffix; sentence-case
  per law ("The Journey" → check against brief §5 canon).
- CTA-library violations: /marketplace label (§2 above), /sponsor deck CTA,
  film SB-16 secondary "See the tour plan" → not in library (add to §2 as
  CTA-TOUR-PLAN or relabel "Ride the tour"), Footer ECOSYSTEM duplicate
  /marketplace entries.
- Header rebuild post-swap: film-first nav (The drives · The tour · Stories ·
  Marketplace + Get on the list, Sponsor promoted from footer-only).
- LegalLayout reskin (one component, five pages).
- /tour "LEG n/10" lowercase; CityBeat already does it right.

## 6. Sequenced plan for the next session(s)

1. **P0 — the funnel**: /apply rebuild + interest select + /thank-you retoken.
   (Everything converts through it; do it before driving any traffic.)
2. **P0 — the sponsor lane**: /sponsor real page + form (needs §7 numbers, or
   ship with the map and "Inquire").
3. **P0 — the swap**: film → / atomically (§1) + Header rebuild + kill/301 the
   five legacy orphans + dead-code purge.
4. **P1 — /marketplace teaser** (on screenshot arrival) + /drives buildout +
   /community fold.
5. **P1 — Stories shell** + first three posts from BLOG-TOPICS.md (Denver
   market post, sleeper thesis, sunrise essay).
6. **P2 — LegalLayout reskin, title sweep, tour dates/reach band, odometer
   basis fix.**
7. **Ongoing** (from 05-NEXT-PHASES): startup-audio swap when the clean
   recording arrives; Lighthouse budgets; real-device pass; analytics (§7).

## 7. Open owner decisions

1. **/booking/phoenix**: a live Wheelbase booking iframe exists while the whole
   brand says "coming soon." If Phoenix booking is real business, the canon is
   wrong; if not, the page dies. Which is it?
2. **Sponsor numbers** for /tour + /sponsor: reach/impressions/attendance per
   market — or ship without stats ("Inquire") until real.
3. **Tour date windows** per market (summer→fall 2026 granularity is fine).
4. **Marketplace screenshot** — send when ready.
5. **Analytics provider** (blocks scroll-depth/CTA measurement): Plausible
   (privacy-clean, no consent friction) vs GA4 (free, heavier). Recommend
   Plausible.
6. **Startup audio** — clean recording pending from you.
7. sameAs socials beyond @driveexotiq (Instagram? YouTube?).

## 8. Kickoff prompt for the new chat (copy-paste)

> Continue the Drive Exotiq final push from
> /Users/g.r./Documents/EXOTIQ/driveexotiqweb (branch newgen-main, auto-deploys
> to driveexotiq-newgen.netlify.app via `git push newgen newgen-main` — NOTE:
> `origin` is the production repo, never push there). Read
> docs/redesign/08-SITE-COHESION-HANDOFF.md first and execute its §6 plan in
> order, starting with the /apply rebuild (P0). Memory files carry the pipeline
> rules — follow them: never `next build` while dev is up; regenerate
> media-versions.json after any re-encode; verify live on staging before
> reporting; commit and push per logical unit. The film at /experience is
> DONE — do not restructure it except the end-card nav rewiring specified in
> §1.4. Adversarially review the /apply + /sponsor rebuilds against
> 01-COPY-BRIEF (voice + CTA library are law) before shipping, like the
> crossfade change. Proceed autonomously; batch owner questions at the end.
