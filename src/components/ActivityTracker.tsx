'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getSid } from '@/lib/session-id';

// Logs each page a visitor opens to /api/activity under the tab's ephemeral
// session id, so a visit's trail of pages and searches can be read back
// together on /sessions. Anonymous by the same design as the search log: the
// id is random, per-tab, and gone when the tab closes; no cookie, no IP, no
// identity. The external referrer (hostname only, stripped server-side) rides
// along once, on the session's first event. Best-effort: every call is
// wrapped, and a failure never affects the page.

const REF_SENT = 'csc-ref-sent';

export default function ActivityTracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === last.current) return;
    last.current = pathname;
    // The console itself stays out of the log.
    if (pathname.startsWith('/study')) return;
    try {
      const sid = getSid();
      if (!sid) return;
      let mine = false;
      try { mine = !!localStorage.getItem('csc-mine'); } catch { /* ignore */ }
      let ref: string | undefined;
      try {
        if (!sessionStorage.getItem(REF_SENT)) {
          sessionStorage.setItem(REF_SENT, '1');
          const r = document.referrer;
          if (r && !r.startsWith(location.origin)) ref = r;
        }
      } catch { /* ignore */ }
      fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sid, path: pathname, ...(mine ? { mine: true } : {}), ...(ref ? { ref } : {}) }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* best-effort */
    }
  }, [pathname]);

  return null;
}
