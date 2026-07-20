'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NAV } from '@/lib/nav';

/**
 * The film's Menu affordance (copy deck §4.1): a quiet, persistent, Gulf-free
 * text trigger in the chrome's left cluster that opens a full-bleed sheet with
 * the canonical destination set. The home film has no global Header — without
 * this, a returning visitor must scroll ~30 viewports to reach any other page.
 *
 * Navigation is not an action, so the trigger carries no Gulf and no border;
 * inside the opaque sheet the single `Get on the list` CTA is the only accent
 * in view, so the one-accent-per-viewport law holds in both states.
 *
 * The sheet portals to <body>: the film chrome animates opacity over accent
 * beats, and a fixed sheet nested inside that fading header would dim with it.
 * z-[80] clears the film's progress hairline (z-[60]) and act ticks (z-[61]).
 *
 * A11y (review must-fixes): closed, the sheet is `invisible` + `inert` +
 * aria-hidden — opacity alone left ~8 invisible tab stops in the page order.
 * Open, it is a modal dialog: focus moves in, Tab cycles inside, Esc/Close
 * return focus to the trigger. `document.body.dataset.filmMenuOpen` mirrors
 * the open state so the film's beat-stepping key handler can stand down.
 */
export default function FilmMenu({
  jumps,
}: {
  /**
   * Optional in-film wayfinding jumps (Phase E: the chapter list plus the
   * direct `Jump to the ask`). `active` marks the chapter currently on
   * screen so the menu doubles as a "you are here" — the film chrome owns
   * that state and passes it down.
   */
  jumps?: { label: string; onSelect: () => void; active?: boolean }[];
}) {
  const [open, setOpen] = useState(false);
  // Portal target exists only after mount (SSR renders the trigger alone).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Body scroll lock + open-state flag while open (the flag lets the film's
  // window keydown handler ignore beat-stepping keys behind the modal).
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    document.body.dataset.filmMenuOpen = 'true';
    return () => {
      document.body.style.overflow = 'unset';
      delete document.body.dataset.filmMenuOpen;
    };
  }, [open]);

  // Focus management: into the sheet on open, back to the trigger on close.
  // The focus call defers a frame — synchronously the sheet is still
  // visibility:hidden (mid-transition) and focus() on a hidden element is a
  // silent no-op (verified in the browser during the a11y pass).
  useEffect(() => {
    if (open) {
      // A lone rAF measured too early (sheet still computed `hidden`, focus
      // no-ops silently) — short timer plus one retry after the 400ms fade.
      const focusSheet = () => {
        if (!sheetRef.current?.contains(document.activeElement)) {
          sheetRef.current?.focus({ preventScroll: true });
        }
      };
      const t1 = setTimeout(focusSheet, 90);
      const t2 = setTimeout(focusSheet, 450);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    // Only restore if focus is stranded inside the (now hidden) sheet.
    if (sheetRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
  }, [open]);

  // Esc closes; Tab cycles within the sheet (simple trap — the sheet is the
  // only focusable region while open because everything behind it is inert
  // to pointers and covered visually, but VoiceOver/Tab can still escape a
  // portal without this).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !sheetRef.current) return;
      const focusables = sheetRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const sheet = (
    <div
      id="film-menu-sheet"
      ref={sheetRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      tabIndex={-1}
      aria-hidden={!open}
      // No `inert`: this React version warns on the boolean form and drops it
      // anyway. visibility:hidden (below) already removes the closed sheet
      // from the tab order and the accessibility tree — browser-verified.
      className={`fixed inset-0 z-[80] bg-canvas transition-[opacity,visibility] duration-400 ease-de ${
        open ? 'visible pointer-events-auto opacity-100' : 'invisible pointer-events-none opacity-0'
      }`}
    >
      <button
        type="button"
        onClick={close}
        className="absolute right-6 top-4 p-2 text-xs font-semibold text-ink-2 transition-colors duration-250 ease-de hover:text-ink md:right-8"
      >
        Close
      </button>
      <div className="flex h-full flex-col justify-center px-8 pb-16">
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="block py-3 font-display text-[30px] font-bold tracking-tight-exotiq text-ink transition-transform duration-250 hover:translate-x-1"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {jumps && jumps.length > 0 && (
          <div className="mt-8 flex flex-col items-start gap-1">
            {/* The film's chapter list (Phase E) — the sheet is mobile's whole
                wayfinding surface, so the seven bare titles get a quiet
                eyebrow naming what they are. Active chapter in metal: a
                status, not an action, so no Gulf and no border. */}
            <p className="mb-1 text-[11px] tracking-[0.08em] text-ink-3">The film</p>
            {jumps.map((j) => (
              <button
                key={j.label}
                type="button"
                aria-current={j.active || undefined}
                onClick={() => {
                  close();
                  j.onSelect();
                }}
                className={`py-1 text-[13px] transition-colors duration-250 ease-de hover:text-ink ${
                  j.active ? 'text-metal' : 'text-ink-2'
                }`}
              >
                {j.label}
              </button>
            ))}
          </div>
        )}
        <Link
          href="/apply"
          onClick={close}
          className="mt-10 inline-flex items-center justify-center rounded-sm bg-gulf px-6 py-3.5 font-semibold text-on-gulf"
        >
          Get on the list
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="film-menu-sheet"
        aria-label="Menu"
        onClick={() => setOpen(true)}
        className="font-sans text-xs font-semibold text-ink-2 transition-colors duration-250 ease-de hover:text-ink"
      >
        Menu
      </button>
      {mounted && createPortal(sheet, document.body)}
    </>
  );
}
