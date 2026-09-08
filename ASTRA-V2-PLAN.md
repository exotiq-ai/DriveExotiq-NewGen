# Drive Exotiq: the feeling, the road, the people

> Execution: use independent media, interaction and editorial workers; root integrates, reviews, tests and publishes the isolated Astra preview.

**Goal:** Turn the first editorial release into a connected, memorable driving story, with an original car study, authentic moving footage and a personal reason to join.

**Architecture:** Keep the existing server-rendered Next.js pages and preview adapters. Add small client components for native-scroll scene progress, a progressively enhanced car study and an explicitly controlled film viewer. Content, links and imagery remain available before those enhancements load.

**Tech stack:** Next 15.5.25, React 18.3, TypeScript, existing CSS/font system, native browser scroll/intersection/video APIs, FFmpeg for supplied footage, Higgsfield only where original campaign motion is needed.

**Spec:** The creative direction and constraints below are the complete design specification for this implementation.

## Direction

The first release made the cars desirable. This release connects that desire to a road, a person and an invitation. The page follows five beats:

1. **The feeling.** Keep the cinematic garage opening and its clear invitation. Let the opening composition recede gently as the next idea arrives. The first image and headline never depend on JavaScript or a loading screen.
2. **The machines.** A large car study stays in view during a short native scroll chapter. Camera movement, typography and restrained technical labels respond to scroll. The three existing personalities remain directly selectable with keyboard-accessible tabs. A genuine camera-orbit asset is preferred if the supplied archive or one reviewed generation supports it; otherwise use deliberate image camera moves, without implying a real 3D model.
3. **The road.** Authentic Audi/Ferrari/Telluride footage opens from an editorial frame into a wider cinematic view. An optional film viewer offers a longer owner-footage edit with normal controls, a visible close button and focus restoration.
4. **The people.** Give Gregory and the real S8 story a substantial place in the page. Use the stronger supplied founder photograph, specific verified copy and clear archive captions. The emotional transition is from looking at a car to getting out and driving it with others.
5. **Your invitation.** Explain what joining means: introduce yourself and your city, receive confirmed drive information when available, and meet over roads and coffee. Retain the distinction between drives now being planned and rentals coming soon.

## Why this approach

A fully cinematic scroll-only site would add spectacle while making navigation and mobile use harder. A cosmetic animation pass would leave the story gap intact. This design uses a short signature car chapter inside an editorial site, with direct navigation and real documentary material doing the emotional work.

The current Awwwards rubric weights design 40%, usability 30%, creativity 20% and content 10%; this plan addresses all four rather than equating more animation with better work. Source: https://www.awwwards.com/about-evaluation/ (checked 2026-09-08 UTC).

## Global constraints

- Work only in the independent Astra worktree, branch `codex/astra-awwwards`; first-release checkpoint `41e3e0a8616170378c2bdbbe8bf9392cfb8fd925` remains recoverable in Git.
- Deploy only to Netlify site `f499ad01-b775-4c7d-901f-98f879c83d94`, preview alias `astra-review`. Main, newgen-main, the production domain and Claude's checkout are outside the mutation scope.
- Existing authorization includes creative decisions, dedicated-branch commits/pushes and preview publication. No discretionary approval checkpoints are needed.
- Keep the total authorized ceiling of $100 new generative-media cash spend. Quote before submitting a generation, record prepaid-credit use separately, and do not enable auto-refill or buy subscriptions.
- Real footage and founder imagery carry exact source/timecode provenance. No invented testimonials, membership counts, trip stops, dates, rental inventory or founder quotations.
- Native scrolling only. No forced cursor, scroll-jacking, compulsory film playback, blocking intro or hidden primary invitation.
- Reduced-motion and Save-Data preferences prevent optional media downloads and scroll animation. Content remains complete; mobile and short landscape screens avoid extended pinning.
- Animate transforms/opacity through bounded animation-frame work, only while relevant. Clean up observers, listeners and pending frames on unmount. Failed media restores a readable poster and working navigation.
- No new animation dependency is required. Keep homepage initial JavaScript near the first release; load any longer film or car scrub clip only when needed. Only the active viewport-sized media variant should download.
- Preserve preview disclosure, null-record responses, crawler blocking, disabled providers and analytics, all existing routes and form contracts.

## Implementation tasks

- [x] **1. Curate media and provenance.** Inspect available films and car render assets. Produce compact desktop/mobile cuts, accurate posters and one longer silent owner-footage film. Inspect representative beginning/middle/end frames and decode outputs. Select or generate a coherent car camera study only after reviewing its source and quote.
- [x] **2. Build the signature garage.** Upgrade `components/astra/HomeGarage.tsx` and a dedicated stylesheet. Add bounded scroll progress, cinematic image/camera transforms, useful scene progress and existing manual selection. Verify keyboard tabs, reverse scrolling, offscreen resource behavior, reduced motion, failed media and compact layouts.
- [x] **3. Restore the human story.** Add focused server-rendered founder/invitation components and supporting CSS. Integrate verified founder material and explicit joining steps. Root owns ordering and integration in `HomeExperience.tsx`.
- [x] **4. Connect the scenes.** Add a small homepage motion controller and chapter navigation. Enhance the hero exit, editorial typography and framed-to-wide road transition. Provide static fallbacks and usable anchor offsets. Avoid animating every element.
- [x] **5. Add the film experience.** Add a lazy film viewer with native dialog/video controls, Escape/focus return, no background audio, no playback behind the closed modal, clear archive context and a good mobile layout. Enhance the existing road-loop source selection while preserving its tested failure latch.
- [x] **6. Integrate and review.** Review the whole page at desktop, mobile and tablet sizes; check narrative repetition, pacing, contrast, legibility and motion restraint. Have an independent reviewer inspect behavioral changes and regressions. Fix material findings before release.
- [x] **7. Verify and publish.** Run production build/type/lint validation, provider unit tests, expanded browser checks and image/media inspection. Measure representative production pages with Lighthouse sequentially. Commit and push only after checks; deploy with the Netlify Next adapter, then run the HTTP and browser checks against the returned preview URL. Record the exact commit/deploy IDs, spending and remaining limitations.

## Acceptance evidence

- The revised page clearly progresses from desire to driving to a real person to a concrete invitation.
- At least one car rendering visibly responds to forward and reverse scroll; manual controls remain usable. A failed or unavailable enhancement does not create an empty pinned section.
- Additional original owner footage is visibly used, not merely added to the asset directory.
- Film playback is explicitly controllable and stops on dismissal; focus returns to its trigger.
- No horizontal overflow, duplicate H1, missing main target, invisible content or broken images on the tested viewports/routes.
- Existing preview/service behavior remains verified, and all new motion/film paths have meaningful browser regression coverage.
- Performance results distinguish local lab, deployed lab and unavailable field/device evidence. Award recognition and measured conversion uplift are not claimed.

## Working record

Implementation and verification evidence lives outside publish in `../evidence/v2/`; selected website media in `public/astra/`. The project-level `../BUILD-STATUS.md` records the current live release and progress on this pass. All seven tasks are complete. Application commit `ccf50e0bd21e0a1f72229d6e9238b194fb678a9e` is live on Netlify deploy `6a9f81daa8f14078f5b3b076`. The full hosted run and targeted recheck cover all 113 executed cases, with seven intentional skips; nine repeated film-close checks also passed. See `evidence/V2-VERIFICATION.md` for the release result and its limits.

Technical references: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines and https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion (checked 2026-09-08 UTC). Browser support is treated as progressive enhancement; readable content is the baseline.
