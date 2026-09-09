# Preserved cinematic experience

The original scrolling film, living scenes, chapter menu, tour/roadbook,
smooth-scroll provider and supporting components are kept here for possible
reuse. They have not been deleted. The moved component files are byte-for-byte
unchanged; `preservation.json` records their original paths and SHA-256 hashes.

This folder is outside the live application's imports, Tailwind content scan
and TypeScript build. Its files mirror their original repository paths, so the
original `@/components/...` imports are intentionally unchanged. The active site
does not install Framer Motion or Lenis just to retain these inactive sources.

## Restore or adapt

1. Start a separate branch/worktree from the current site.
2. Reinstall the original dependencies with
   `npm install framer-motion@^12.42.0 lenis@^1.3.25`.
3. Copy the chosen component subdirectories back to the corresponding paths
   under `components/`. The saved `app/`, layout components, `lib/` and Tailwind
   configuration show the original integration. Adapt them deliberately;
   overwriting the current root layout would replace preview safeguards.
4. Restore the required media from the independent project's
   `../../../assets/legacy-public-archive/` to the matching `public/` paths.
   Check `frames.ts`, `living.ts`, `media-versions.json` and tour data. If a
   referenced file is missing from that archive, recover it from baseline Git
   commit `2e0ad94738ae9e441b284b2d462d358d1dd88a0d` before enabling the scene.
   The repository is a partial clone, so fetching missing historical media may
   need network access and additional disk space.
5. Move only the required original styles from `app/globals.css` here into the
   new route's stylesheet. Add any required Tailwind tokens from the saved
   configuration. Keep the active homepage's styles scoped to its components.
6. Remove or adjust the `/experience` redirect if restoring that route. Run
   type checking, build, preview-service tests, and browser tests for desktop,
   touch, keyboard, reduced motion, Save-Data, media failure and scroll reversal.

The route and layout snapshots are from the baseline commit above. The moving
components were preserved from the pre-cleanup checkout (`f1a8a37`). No live route
imports this archive.
