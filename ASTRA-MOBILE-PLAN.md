# Drive Exotiq mobile clarity implementation plan

> For agentic workers: use independent implementation and review tasks; root integrates and verifies the existing isolated Astra worktree. Follow the tasks below in order. The user has already authorized routine implementation and preview publication without discretionary permission questions; implementation and preview publication are now approved by the user.

**Goal:** Make the mobile site feel calm, cinematic and easy to act on by removing decorative detail, increasing useful text sizes and shortening the path into the join form.

**Architecture:** Keep the existing server-rendered pages, media, native scrolling and small interactive components. Change mobile content hierarchy and responsive CSS; use the existing components and form contracts. The compact garage needs a normal-flow image/detail layout so readable text can grow without clipping.

**Tech stack:** Existing Next.js 15.5.25, React, TypeScript, CSS, Playwright and Netlify preview. No new animation package, generated media or paid service is needed.

**Spec:** The observed findings, content decisions, type system, viewport rules and acceptance criteria in this document are the design specification.

**Status:** Implementation and local verification complete, 8 September 2026. Final build passed; 116 browser cases passed with 7 intentional skips. Mobile Lighthouse: home 96 performance / 100 accessibility, apply 97 / 100. Preview publication and hosted verification are next.

## What the audit found

Reviewed the live Astra preview homepage at 320×568, 360×800, 390×844, 430×932, 768×1024 and 844×390. Additional boundary measurements covered 600×960, 601×960, 767×1024 and 932×430. The drives/application journey, menu and footer were also inspected at phone widths, with a 768px tablet check. These are browser viewport inspections, not physical-device certification.

| Finding | Evidence | Implication |
| --- | --- | --- |
| The garage layers small numbers, model subtitles, a studio slogan, a counter, a make, specification labels/values and a bottom slogan around the image | Computed 8–10px text; phone garage screenshots | The competing annotations distract from the car and its selection controls |
| Primary header action becomes tiny | 9px at 320/360; 10px at 390/430 | The action people need is visually weaker than decorative content |
| Reading copy and useful status also shrink | 12px invitation paragraphs, 10px planning status, 8px archive captions | Hiding all small text would remove information people need; retain and enlarge it |
| Small/short screens inherit oversized media sections | At 320×568 and 844×390, homepage hero is 720px tall | Supporting copy is pushed off the first screen, especially in landscape |
| The application requires substantial scrolling before typing | First meaningful input approximately y=1,142px at 390px wide; the preceding hero is approximately 640px tall | A visitor who has already chosen to join must pass another long introduction |
| Mobile and tablet rules are inconsistent | At 601–767px the header is 88px but section scroll margin remains 72px; document scroll padding is another 100px. At 932×430 desktop navigation returns | Align anchors with the actual header and handle landscape explicitly |
| Ordinary horizontal overflow was not found in the sampled homepage viewports | Measured document width equals viewport width | The main issue is hierarchy and density; do not replace the whole visual system |

Source details: `../evidence/mobile-ux/SOURCE-AUDIT.md`. Live measurements: `../evidence/mobile-ux/home-inspection.json`, `breakpoints.log`, and `journey-audit.md`. The element inventory contains nested elements, so its counts are not counts of independent labels.

## Recommended direction

Keep the large images, expressive headings, cars, real people and clear invitation. Give each section one visual focus, one short supporting thought and one primary action. Use normal readable text for information that helps someone choose or act.

A typography-only increase would preserve the clutter and overflow the fixed garage. A complete mobile redesign would discard working identity and interactions. The recommended pass edits the content hierarchy first, then adjusts typography, layout and pacing around what remains.

### Content decisions

| Area | Remove or hide on compact layouts | Keep, simplify and make readable |
| --- | --- | --- |
| Hero | Decorative eyebrow, edition/index annotations and tiny scrolling instruction | Headline, two-line value statement, header join action and visible pause/play control |
| Manifesto | Numbered section scaffolding, decorative arrow, three tiny footer slogans | Main heading, one concise paragraph and the drives link |
| Garage | Tab numbers, duplicate counter, studio slogan, bottom slogan/arrow, repeated poetic description and “In a word” classification | All three make/model tabs, selected make/model, one personality line and one engine line |
| Road footage | Repeated “camera roll” subtitles and poetic bottom caption competing with the main heading | Primary driving invitation, 14px film action, pause control and one short archive/source caption |
| Founder/pair imagery | Competing left/right micro-captions and repeated section taglines | One naturally wrapping caption per image; Gregory's identity and verified S8 story |
| Journal | Row numbers and stacked category/time micro-labels | Article titles as full-row links; one 13px category line if it adds context; readable “All stories” action |
| Invitation | Section number, side slogan and step numbers | Three short steps, 13px pending-date status, readable FAQ and primary button |
| Menu/footer | Menu numbers, tiny decorative group labels and surplus taglines | Destinations, legible link labels, focus behavior, legal links and cookie preferences |
| Drives | Numbered kickers and the photo separating the heading from the invitation | Benefit, invite button and pending-date status together before the photo on compact screens |
| Apply | Long mobile photographic intro, duplicated marketing paragraphs, self-linking join CTA and repeated footer invitation | One page heading, concise introduction, preview disclosure, interest selection, field labels, errors and consent |

Do not apply a global `.astra-eyebrow { display:none }` or a blanket font-size rule. That class also carries vehicle identity and useful context. Never hide form labels, errors, pending-date/coming-soon status, preview disclosure, consent or playback controls to make a screenshot cleaner.

### Type and interaction targets

- Body and form input text: **16px equivalent**, approximately 1.55–1.65 line height.
- Actions, tabs and field labels: **14px or larger**; FAQ questions 16px.
- Supporting status, provenance, help and legal text: **13px preferred**, 12px only for genuinely secondary legal metadata. No retained 8–10px copy in compact components.
- Use rem-based roles; reduce excessive uppercase tracking. Let text wrap and containers grow.
- Interactive targets: project target **44×44 CSS pixels minimum**, including pause controls and footer links on tablets. Do not confuse this design target with WCAG 2.2's 24px minimum criterion and its exceptions.
- Preserve visible focus, one selected garage tab, keyboard access, modal dismissal/focus return, image failure fallbacks, reduced motion and Save-Data.

### Viewport rules

| Range | Treatment |
| --- | --- |
| 320–380px portrait | 16px content gutters; remove the header emblem if needed to preserve the wordmark and 14px join action. Stack reading content. No fixed-height detail blocks. |
| 381–767px portrait | 20px gutters; same content priorities and type roles. Extra width becomes breathing room, not extra annotation. |
| 768–900px tablet | Apply the compact annotation/type system. Keep narrative copy in generous columns or a single reading column; keep invitation steps sequential. Do not reinstate three narrow text columns simply at 768px. |
| Up to 1024px wide and 500px tall | Compact navigation and media spacing, normal-flow copy/actions, no extended pinning. Keep readable type; allow vertical scrolling. The film dialog must remain scrollable with an accessible close control. |
| Larger desktop | Preserve the existing editorial detail and scroll choreography; check shared-component regressions after implementation. |

Use the compact rules at `@media (max-width:900px), (max-width:1024px) and (max-height:500px)`. Keep phone image proportions and gutters in narrower queries. Prototype screenshots currently demonstrate only the phone direction, not this entire matrix.

## Browser-only direction study

The concept changes live DOM styling in an isolated browser session, not application files or Netlify. It demonstrates larger retained labels and removing competing decoration. The prototype is a direction study, not an implementation-ready patch for every route or viewport.

- [Current 390px garage](output/playwright/mobile-audit/home-standard-garage.png)
- [Proposed 390px garage](output/playwright/mobile-audit/concept-390-garage.png)
- [Proposed invitation steps](output/playwright/mobile-audit/concept-390-steps.png)
- [Proposed 320px opening](output/playwright/mobile-audit/concept-320-hero.png)

At 390px, a DOM text-node inspection of the garage found 19 sub-12px text runs before the concept and zero after it; some numbered labels are split into separate React text nodes, so this is not 19 distinct labels. The concept retains all three car choices and the selected engine. At 320px, the proposed header action is 14px, the hero fits a 568px viewport and document overflow measures zero. Other states still need implementation validation.

The draft styling is retained at `../evidence/mobile-ux/mobile-concept.css`; its phone-only scope and limitations are explicit. The engine label becomes “Engine” and the invitation copy becomes:

1. **Introduce yourself.** Tell us your name, city and why you'd like to join.
2. **Get the details.** When a drive fits your city, your invite brings the confirmed date, route and meet point.
3. **Join the drive.** Meet the group for a drive and coffee.

## Implementation tasks

### 1. Protect the header and useful text

**Files:** `app/astra.css`, `components/astra/SiteHeader.tsx`, `components/astra/SiteFooter.tsx`, `app/astra-home.css`, `app/astra-motion.css`.

- [x] Introduce compact type roles and apply them to actual reading/action/status selectors, not every span. Example values:

```css
--astra-mobile-body: 1rem;
--astra-mobile-action: .875rem;
--astra-mobile-meta: .8125rem;
```

- [x] Raise `.astra-header-cta` to `.875rem`; hide its arrow consistently on phones; remove only the narrow-phone emblem when space is needed. Keep the wordmark, 44px menu target and named join action.
- [x] Raise `.home-film-control` and `.home-watch-film` to readable labels; every pause/play target is at least 44px. Remove the latter's repeated subtitle after adding the single source caption in task 3.
- [x] Remove menu numbers. Keep menu destinations and the existing native dialog focus/close behavior. Raise footer links to 14px and legal/help links to 12–13px, with 44px tablet targets.
- [x] Inspect header/menu at 320, 360, 390, 430, 768 and 932×430; labels wrap only where intended, actions never shrink to fit.

### 2. Recompose the compact garage

**Files:** `components/astra/HomeGarage.tsx`, `app/astra-garage.css`, relevant legacy overrides in `app/astra-home.css`. Preserve `garage-data.ts` and `useGarageProgress.ts` interfaces unless a concrete defect requires a change.

- [x] Hide only `.home-tab-number`, `.home-tab-indicator`, `.garage-study-topline`, `.garage-study-caption`, `.garage-study-scroll` and the redundant compact progress bar.
- [x] Keep make/model text on every tab at 14px, with natural wrapping and a consistent selected border. Keep IDs, tab roles, roving focus and the single tabpanel.
- [x] Use a bounded image followed by normal-flow details; the phone core is:

```css
.garage-study .home-car-panel { height:auto; }
.garage-study-images { position:relative; inset:auto; aspect-ratio:1.18; z-index:0; }
.garage-study .home-car-details { height:auto; padding:22px 20px 30px; gap:18px; }
```

Apply this only in compact queries; remove the old 270px top padding and dependent overlay gradients there. The full prototype shows the other dependent rules. Use a wider image ratio on tablets after inspection.

- [x] Keep the selected make, large model, personality line and engine. The compact engine row reads `Engine` and `{car.engine}`; remove the repeated `{car.copy}` and `{car.spirit}` from the compact presentation. Keep larger-screen content and the existing data model.
- [x] Inspect all three cars at 320/390/430/768, including image failure and enlarged text. Details must remain inside the visible panel and the next section must follow naturally; no clipped fixed height or empty spacer.

### 3. Edit the story and invitation for mobile reading

**Files:** `components/astra/HomeExperience.tsx`, `HomeFounder.tsx`, `HomeInvitation.tsx`, `HomeFilm.tsx`; `app/astra-home.css`, `astra-story.css`, `astra-motion.css`.

- [x] Remove the decorative elements listed in the content table with scoped selectors. Keep headings as orientation rather than repeating numbered labels.
- [x] Remove phone reading-column indents from `.home-manifesto-copy`, `.astra-founder-note` and `.home-road-coda-copy`; use 16px text with 1.6 line height and shorten repeated copy.
- [x] Consolidate source captions into one 13px wrapping line. Exact copy: `R8 & 458 · Telluride, Colorado · From the archive` and `Gregory with his S8 · Tortilla Flats · From the archive`. Road film source stays `Original footage · Colorado`; do not relabel campaign car images as documentary footage.
- [x] Keep the founder's 2017 S8, custom tune and Milltek facts; keep the deeper story link. Show one concise paragraph alongside the existing larger personal introduction.
- [x] Apply the three invitation sentences above. Remove visual step numbers and use one-column steps. Keep `Next date and route being planned` immediately below the join button at 13px; FAQ summaries 16px, answers 16px.
- [x] Reduce journal decoration and retain linked titles. Move or wrap “All stories” so it stays 14px. Simplify the marketplace line to `Exotiq.rent — coming soon`, preserving its honest availability state.
- [x] Inspect the complete sequence, not just individual crops: image → idea → action should remain clear without a succession of tiny labels. Check a paused road frame and a bright moving frame for readability.

### 4. Bring the drives invitation and application forward

**Files:** `app/drives/page.tsx`, `app/apply/page.tsx`, `components/forms/ApplicationForm.tsx`, `components/forms/SmsConsentCheckboxes.tsx`, `components/astra/PreviewNotice.tsx`, `components/astra/SiteHeader.tsx`, `app/astra.css`, `app/astra-pages.css`.

- [x] On `/drives`, group the existing benefit, `Request your invite` button and `Next date and route being planned` status immediately after the main heading and before the photograph on compact screens. Move/reuse the existing `.ed-invitation` content, avoiding another repeated mobile CTA block. Use layout areas to preserve the larger-screen composition. Raise the benefit line from 11px to 16px.
- [x] At 768–900px use a simple two-row invitation layout so the kicker and button do not wrap into narrow columns. Keep one unbroken, readable action label.
- [x] Give the application main a specific `astra-apply-page` class. On compact screens remove the tall photographic introduction and duplicate marketing text; start with one heading, one sentence and the form.
- [x] Keep exactly one H1. Make `Get on the list` the page H1; render the desktop-only “Find your people” display text as a styled paragraph, preserving its desktop appearance. Update the existing display-heading selectors deliberately.
- [x] Remove eager loading/preload for a hero hidden on compact screens. Use native lazy loading for the retained desktop image, then verify that mobile does not download a hidden hero and desktop still paints correctly.
- [x] Use this concise introduction: `Tell us a little about yourself and the drives you're interested in.` Keep the explicit preview notice, interest options, field labels, inline errors and all consent wording. Raise labels/help to 14px and consent to 14px; retain 16px input values and the existing approximately 53px inputs.
- [x] On `/apply`, suppress the compact header's self-linking join CTA and the repeated footer invitation. Keep the logo, menu and legal destinations. Scope this via route/class state rather than affecting unrelated forms.
- [x] Group the existing optional SMS checkboxes inside a native fieldset with the legend `Optional text updates`, separated from required terms. Keep all original consent wording and unchecked defaults, use 14px text and a comfortably sized visual checkbox with its whole label clickable. Keep a clear route to the sponsor form and preserve the optional invite-code field.
- [x] Preserve query-derived interest, sponsor redirects, values on validation errors, checkbox defaults, optional SMS consent and null-record preview responses. Do not turn required disclosures into collapsed accordions.
- [x] Target first input fully visible within 320×568, 360×800 and 390×844 before the keyboard opens. With the software keyboard open, keep the focused input and error reachable through native scrolling; add no fixed bottom bar.

### 5. Resolve short-screen and breakpoint pacing

**Files:** `app/astra.css`, `astra-home.css`, `astra-garage.css`, `astra-story.css`, `astra-motion.css`.

- [x] Use one header-height variable per compact range and one anchor-offset mechanism. The current `scroll-padding:100px` plus per-section margins doubles the gap. Set compact document scroll padding to header height plus 12px and remove compact section scroll margins. Verify actual anchor arrival and focus; do not assume CSS declarations alone prove it.
- [x] Make the compact header's actual height match its declared variable, including borders/padding. Use 72px on phones/short landscape and 88px on tablet portrait.
- [x] Replace the phone hero's 720px minimum with content-safe height rules. The concept demonstrates `min-height:560px;height:100svh` for portrait; short landscape must use normal-flow content and a shorter bounded image instead of forcing a tall poster composition.
- [x] Keep film closing controls accessible at 844×390 and 932×430. Keep compact navigation at these widths, and preserve vertical scrolling through the dialog when necessary.
- [x] Check 600/601, 767/768 and 900/901 boundaries so labels, section spacing and header offsets do not jump unexpectedly.

### 6. Verify and publish the implemented pass

**Files:** Existing `tests/browser/experience.spec.ts`, `garage-scroll.spec.ts`, `film-viewer.spec.ts`, `journeys.spec.ts`, `quality.spec.ts`; new release record `evidence/MOBILE-VERIFICATION.md` after actual execution; task-local configs `../tooling/playwright.mobile.local.config.ts` and `../tooling/playwright.mobile.remote.config.ts`.

- [x] Capture before/after viewport screenshots for the full matrix above. Exercise every car tab, navigation/film open-close, expanded FAQ, field focus/errors, footer/cookie controls and the interest selector. Use fresh visible screenshots after images load; unscrolled full-page lazy-image captures are not final visual evidence.
- [x] Verify reflow at 320 CSS pixels and text enlargement to 200%, with no loss of essential content or controls. Device pixel ratio is not a substitute for text enlargement. Record browser/physical-device limitations honestly.
- [x] Copy the existing task-local `playwright.v2.local.config.ts` and `playwright.v2.remote.config.ts` to the mobile config names above. Change only their evidence directory to `../evidence/mobile-release/browser/local` and `../evidence/mobile-release/browser/remote`; retain the exact local/isolated preview targets. This preserves V2 reports.
- [x] Run the production build from `website`, then start the built server in a separate running execution session with `npm run start -- --port 4317`. Run the existing meaningful browser/journey coverage against that server:

```sh
npm run build
npx --no-install playwright test --config ../tooling/playwright.mobile.local.config.ts
node --test tests/preview-services.test.mjs tests/preview-production.test.mjs
```

Use the mobile remote config with one worker after deployment, retaining separately named reports. Add a targeted layout regression only if the changes introduce a behavior not already exercised; do not create dozens of tests that merely repeat CSS values.

- [x] Remeasure homepage and application mobile performance on a production build, sequentially. Preserve the V2 home baseline of local 96 performance / 100 accessibility as context, not a promised identical score. Confirm no hidden-image download or extra animation workload was introduced.
- [ ] Commit/push the isolated Astra branch after verification, deploy the existing `astra-review` alias on site `f499ad01-b775-4c7d-901f-98f879c83d94`, then verify the hosted page/form/media behavior. Record failures/rechecks separately, as in V2; do not call an interrupted run a clean pass.

## Acceptance and limits

The delivered mobile version should have readable join, tab and playback labels; the drives invitation before the long photo; no decorative 8–10px annotation layers; normal-flow car details; concise source captions; an application that starts on the first phone screen; and stable layouts across the audited breakpoints. Essential status, consent, preview behavior and accessibility semantics remain complete.

No application changes, form submissions, commits, deployment or new generative-media spending were performed for this audit. No performance audit, physical keyboard/device test or 200% text-enlargement certification is claimed for the concept. These are execution checks in task 6.

References checked for the validation plan: [W3C reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [W3C text resizing](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), [W3C minimum target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). The 16/14/13px role sizes and 44px targets are project design choices; these references are not a universal minimum-font-size rule.
