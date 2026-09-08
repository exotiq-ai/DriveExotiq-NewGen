# Flagship homepage implementation

Files: `app/page.tsx`, `app/astra-home.css`, `components/astra/HomeExperience.tsx`, `components/astra/HomeGarage.tsx`, `components/astra/HomeLoop.tsx`.

The homepage now follows a natural editorial sequence: architectural garage opening, warm community manifesto, authentic alpine driving film, three-car interactive garage, completed Denver-to-Miami roadbook with original desert photography and founder portrait, live journal links, and the blue invitation. One visible h1; all core content renders on the server. No scroll interception, artificial page length, or perpetual animation loop.

Hero art direction uses a picture source for the mobile poster with eager/high-priority loading, so mobile does not preload the desktop poster. Both film enhancements assign their source only when on screen. Mobile selects its own smaller video before download. Reduced motion, saveData, hidden browser tabs, and leaving the viewport pause or prevent automatic playback; each film includes a pause control. Reduced-motion content is complete and readable.

Garage selection uses native buttons with tab roles, one selected tab, roving tabIndex, arrow/Home/End navigation, native Enter/Space activation, and a single labelled tabpanel. Ferrari uses authentic badge detail from the owner footage. Marketplace copy states coming soon and does not imply rental availability. The roadbook identifies the tour as completed without invented dates or mileage.

Verification: `npx tsc --noEmit --incremental false` passed after the initial composition and again after responsive hero integration. Read `tests/browser/experience.spec.ts` before implementation; root owns executing the shared browser suite and screenshot review after shared CSS/layout integration. No commits, package changes, production integrations, or external writes performed.

Pending integration review: rendered desktop/mobile/tablet screenshots; primary invitation and mobile chrome are provided by the shared Header/Footer implemented by root.

## Rendered review

Playwright isolated session `astra-home-review`: inspected 1440×1000, 390×844, and 768×844 screenshots. Hero typography remains clear of the car; editorial imagery and alternating light/dark sections maintain the intended pacing. At 390 and 768, document scrollWidth equals viewport width, all home images decode, and there are no heading/text/link overflow outliers. Browser console has zero errors; the initial Next Image static-picture-parent warning was fixed by positioning its picture wrapper.

Verified Porsche click, Ferrari Enter activation, ArrowRight wrap to McLaren, and exactly one selected tab. Under reduced motion, both videos are paused with null sources. Garage tabs now remain disabled until hydration, preventing early clicks being lost before React binds handlers. Video controls already render only after hydration.

Artifacts: `home-desktop.png`, `home-desktop-full.png`, `home-390-hero.png`, `home-390-full.png`, `home-768-hero.png`, `home-768-full.png` in this directory. The full screenshots were captured before suppressing the shared footer's duplicate invitation on the homepage.
