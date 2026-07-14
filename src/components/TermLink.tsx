'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import TERM_DEFS from '@/data/term-defs.json';

type Def = { t: string; q: string; s: string; href: string };
const DEFS = TERM_DEFS as Record<string, Def>;

// A dotted-underline term link with a quote-first definition card.
// Desktop (hover-capable): hover or keyboard focus opens the card.
// Touch: FIRST tap opens the card instead of navigating; a second tap on the
// term (or the card's link) navigates. Tapping elsewhere, scrolling, or
// Escape closes it. The card renders in a portal (fixed position), so it
// never breaks paragraph markup or gets clipped by overflow containers.
export default function TermLink({
  href,
  defKey,
  title,
  className,
  children,
}: {
  href: string;
  defKey: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const def = DEFS[defKey];
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const overCard = useRef(false);
  const timers = useRef<{ open?: ReturnType<typeof setTimeout>; close?: ReturnType<typeof setTimeout> }>({});
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number; above: boolean } | null>(null);
  // useId, not defKey — the same term occurs many times per page and two
  // instances can be open at once, which would create duplicate DOM ids.
  const cardId = useId();
  // Set after mount only: calling matchMedia during render would mismatch
  // the SSR markup (server has no window).
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    try { setTouch(!window.matchMedia('(hover: hover) and (pointer: fine)').matches); } catch {}
  }, []);

  const computePos = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const width = Math.min(340, vw - 24);
    const left = Math.min(Math.max(r.left + r.width / 2 - width / 2, 12), vw - 12 - width);
    const above = r.top > 220;
    return { top: above ? r.top - 8 : r.bottom + 8, left, width, above };
  }, []);

  const show = useCallback(() => {
    const p = computePos();
    if (p) { setPos(p); setOpen(true); }
  }, [computePos]);

  const hide = useCallback(() => { setOpen(false); overCard.current = false; }, []);

  // Close on scroll / outside tap / Escape while open.
  useEffect(() => {
    if (!open) return;
    const onScroll = () => hide();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') hide(); };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (anchorRef.current?.contains(t)) return;
      if ((t as HTMLElement).closest?.('[data-term-card]')) return;
      hide();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open, hide]);

  if (!def) {
    // No definition data — plain link, zero behavior change.
    return <Link href={href} className={className} title={title}>{children}</Link>;
  }

  const hoverCapable = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const scheduleOpen = () => {
    clearTimeout(timers.current.close);
    timers.current.open = setTimeout(show, 120);
  };
  const scheduleClose = () => {
    clearTimeout(timers.current.open);
    timers.current.close = setTimeout(() => { if (!overCard.current) hide(); }, 160);
  };

  return (
    <>
      <Link
        ref={anchorRef}
        href={href}
        className={className}
        title={open ? undefined : title}
        aria-describedby={open ? cardId : undefined}
        aria-expanded={touch ? open : undefined}
        onMouseEnter={() => { if (hoverCapable()) scheduleOpen(); }}
        onMouseLeave={() => { if (hoverCapable()) scheduleClose(); }}
        onFocus={() => { if (hoverCapable()) show(); }}
        onBlur={() => { if (hoverCapable()) scheduleClose(); }}
        onClick={(e) => {
          if (!hoverCapable() && !open) {
            // Touch: first tap previews; second tap (card link or term) navigates.
            e.preventDefault();
            show();
          }
        }}
      >
        {children}
      </Link>
      {open && pos && typeof document !== 'undefined' &&
        createPortal(
          <div
            data-term-card
            id={cardId}
            // Honest semantics: this is a hover preview, not a dialog — focus
            // never moves into it (role="dialog" promised keyboard entry that
            // doesn't exist). The term itself navigates on click/Enter.
            role="tooltip"
            aria-label={`Definition: ${def.t}`}
            onMouseEnter={() => { overCard.current = true; clearTimeout(timers.current.close); }}
            onMouseLeave={() => { overCard.current = false; scheduleClose(); }}
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              width: pos.width,
              transform: pos.above ? 'translateY(-100%)' : undefined,
              zIndex: 60,
            }}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-4"
          >
            <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">
              {def.t}
            </p>
            <p
              className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed mb-2 border-l-2 border-amber-600 dark:border-amber-500 pl-3"
              style={{
                fontFamily: 'var(--prose-font-family)',
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              &ldquo;{def.q}&rdquo;
            </p>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs text-gray-400 dark:text-gray-500 truncate">{def.s}</span>
              <Link
                href={def.href}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0"
                onClick={hide}
              >
                View →
              </Link>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
