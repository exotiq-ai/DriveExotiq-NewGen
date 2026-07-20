'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Emblem from '@/components/ui/Emblem';
import { NAV } from '@/lib/nav';

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-10">
          {/* Lockup */}
          <Link
            href="/"
            className="flex items-center gap-3 text-ink transition-opacity duration-250 hover:opacity-80"
            aria-label="Drive Exotiq, Home"
          >
            <Emblem className="h-[22px] w-auto" />
            <span className="font-display text-[20px] font-bold tracking-tight-exotiq">
              Drive Exotiq
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-9 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-[15px] text-ink-2 transition-colors duration-250 hover:text-ink"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-jewel transition-all duration-250 ease-de group-hover:w-full" />
              </Link>
            ))}
            <Link
              href="/apply"
              className="rounded-sm bg-gulf px-5 py-2.5 text-[15px] font-semibold text-on-gulf transition-colors duration-250 ease-de hover:bg-gulf-2"
            >
              Get on the list
            </Link>
          </div>

          {/* Compact row (below lg) — Sponsor surfaced beside the toggle so
              the sponsor path never hides in the sheet (design push F5). */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/sponsor"
              className="px-3 py-2 text-[15px] text-ink-2 transition-colors duration-250 hover:text-ink"
            >
              Sponsor
            </Link>
            <button
              className="relative z-50 -mr-2 p-2 text-ink"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <div className="flex h-5 w-6 flex-col justify-between">
                <span className={`h-px w-full bg-current transition-all duration-300 ${open ? 'translate-y-2 rotate-45' : ''}`} />
                <span className={`h-px w-full bg-current transition-all duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`h-px w-full bg-current transition-all duration-300 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet — overflow-y-auto + min-h-full (UX audit 2026-07-20):
          justify-center on an overflowing column clips both ends with body
          scroll locked; landscape phones lost the top links and the CTA. */}
      <div
        className={`fixed inset-0 z-40 overflow-y-auto bg-canvas transition-opacity duration-400 ease-de lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex min-h-full flex-col justify-center px-8 pb-[max(4rem,env(safe-area-inset-bottom))] pt-20">
          <nav className="space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-display text-[30px] font-bold tracking-tight-exotiq text-ink transition-transform duration-250 hover:translate-x-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/apply"
            onClick={() => setOpen(false)}
            className="mt-10 inline-flex items-center justify-center rounded-sm bg-gulf px-6 py-3.5 font-semibold text-on-gulf"
          >
            Get on the list
          </Link>
        </div>
      </div>
    </>
  );
}
