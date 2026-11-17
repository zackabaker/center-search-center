'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getSid } from '@/lib/session-id';

// Logs each page a visitor opens to /api/activity under the tab's ephemeral
// session id, so a visit's trail of pages and searches can be read back
// together on /analytics. Anonymous by the same design as the search log: the
// id is random, per-tab, and gone when the tab closes; no cookie, no IP, no
// identity. The external referrer (hostname only, stripped server-side) rides
// along once, on the session's first event, with a one-letter device class
// and the primary language subtag. Best-effort: every call is wrapped, and a
// failure never affects the page.
//
// It also answers "is anyone actually there?": the first real input in a
// session — a pointer move or press, a touch, a wheel turn, a key — sends one
// "human" event, and every page opened afterwards carries h:1. Most of what
// loads a page and runs its JavaScript is not a person; none of it does any
// of those. (Scroll events are deliberately not on the list: a script can
// scroll.)

const REF_SENT = 'csc-ref-sent';
const REF_HOST = 'csc-ref-host';
const HUMAN = 'csc-human';
const INPUTS = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'keydown'] as const;

const isConsole = (path: string) => path.startsWith('/study') || path.startsWith('/analytics');

function post(body: Record<string, unknown>) {
  let mine = false;
  try { mine = !!localStorage.getItem('csc-mine'); } catch { /* ignore */ }
  fetch('/api/activity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, ...(mine ? { mine: true } : {}) }),
    keepalive: true,
  }).catch(() => {});
}

export default function ActivityTracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === last.current) return;
    last.current = pathname;
    // The console itself stays out of the log.
    if (isConsole(pathname)) return;
    try {
      const sid = getSid();
      if (!sid) return;
      let ref: string | undefined;
      // Also once per session, with that first event: device class (phone
      // vs. larger, from viewport width) and the browser's primary language
      // subtag ("pt", not "pt-BR"). Coarse by design.
      let first: { d?: string; l?: string } = {};
      let human = false;
      try {
        human = !!sessionStorage.getItem(HUMAN);
        if (!sessionStorage.getItem(REF_SENT)) {
          sessionStorage.setItem(REF_SENT, '1');
          const r = document.referrer;
          if (r && !r.startsWith(location.origin)) {
            ref = r;
            // Kept (hostname only) so the "human" event can credit the source.
            try { sessionStorage.setItem(REF_HOST, new URL(r).hostname); } catch { /* not a URL */ }
          }
          const l = (navigator.language || '').split('-')[0].toLowerCase();
          first = {
            d: window.matchMedia('(max-width: 767px)').matches ? 'm' : 'd',
            ...(/^[a-z]{2,3}$/.test(l) ? { l } : {}),
          };
        }
      } catch { /* ignore */ }
      post({ sid, path: pathname, ...(ref ? { ref } : {}), ...first, ...(human ? { h: 1 } : {}) });
    } catch {
      /* best-effort */
    }
  }, [pathname]);

  // The first real input of the session.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(HUMAN)) return;
    } catch {
      return;
    }
    let done = false;
    const stop = () => {
      for (const name of INPUTS) window.removeEventListener(name, onInput, true);
    };
    const onInput = (e: Event) => {
      if (done || !e.isTrusted) return;
      done = true;
      stop();
      try {
        sessionStorage.setItem(HUMAN, '1');
        const path = location.pathname;
        if (isConsole(path)) return;
        const sid = getSid();
        if (!sid) return;
        const hr = sessionStorage.getItem(REF_HOST) || undefined;
        post({ sid, path, ev: 'human', ...(hr ? { hr } : {}) });
      } catch {
        /* best-effort */
      }
    };
    for (const name of INPUTS) window.addEventListener(name, onInput, { passive: true, capture: true });
    return stop;
  }, []);

  return null;
}
