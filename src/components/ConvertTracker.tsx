'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getSid } from '@/lib/session-id';

// Anonymous conversion events (counted by /api/convert): the landing page is
// remembered per session; "open" fires once when the session moves past that
// landing page into a text or /begin; "read" once per post per session at
// ≥50% scroll AND ≥90s; "depth" the deepest quarter of a text reached plus a
// dwell bucket, one cell per text per session; "follow" on any click out to
// Substack / @centerstudy_ / RSS (destination + placement only); "pick" a
// search result or Ask citation opened (trail only); "return" when a
// browser comes back after 1–30 days (day gap only). Everything lives in
// session/localStorage, nothing identifying leaves the browser, and every
// call is wrapped — a storage or network failure must never affect the page.

function send(payload: Record<string, unknown>) {
  try {
    // Owner flag (set at /mine): rides along so the owner's own usage can be
    // separated from readers' — tagged, never dropped.
    let mine = false;
    try { mine = !!localStorage.getItem('csc-mine'); } catch { /* ignore */ }
    if (mine) payload = { ...payload, mine: true };
    fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* best-effort */
  }
}

// Mirror an engagement event into the session trail (/api/activity), so a
// visit's timeline on /study shows texts actually read and follows clicked,
// not just pages opened. Aggregate counting stays /api/convert's job.
function sendTrailEvent(ev: string) {
  try {
    const sid = getSid();
    if (!sid) return;
    let mine = false;
    try { mine = !!localStorage.getItem('csc-mine'); } catch { /* ignore */ }
    fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid, path: location.pathname, ev, ...(mine ? { mine: true } : {}) }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* best-effort */
  }
}

export default function ConvertTracker() {
  const pathname = usePathname();

  // Landing + return stamps — once per browser page-load (first page of the session).
  useEffect(() => {
    try {
      if (!sessionStorage.getItem('csc-landed')) {
        sessionStorage.setItem('csc-landed', location.pathname);
      }
      const today = new Date().toISOString().slice(0, 10);
      const seen = localStorage.getItem('csc-seen');
      const fired = localStorage.getItem('csc-return-fired');
      if (seen && seen !== today && fired !== today) {
        const gap = Math.round((Date.parse(today) - Date.parse(seen)) / 86_400_000);
        if (gap >= 1 && gap <= 30) {
          localStorage.setItem('csc-return-fired', today);
          send({ event: 'return', gap });
          // Mirror into the session trail so a visit card can say
          // "returning · Nd" (badge-only; same anonymous day-gap signal).
          sendTrailEvent(`return:${Math.min(gap, 30)}`);
        }
      }
      if (!seen) {
        // Brand-new browser (no prior-day stamp): the trail's "first visit"
        // signal. localStorage only — same posture as the return stamp.
        sendTrailEvent('new');
      }
      localStorage.setItem('csc-seen', today);
    } catch {
      /* storage unavailable (private mode etc.) */
    }
  }, []);

  // "open" — once per session, only when the visitor moves BEYOND the page
  // they landed on. A deep-linked visitor who reads one post and leaves
  // deliberately does not count (that is what "read" is for).
  useEffect(() => {
    try {
      const landed = sessionStorage.getItem('csc-landed');
      const isText = pathname.startsWith('/post/') || pathname === '/begin';
      if (!landed || !isText || pathname === landed) return;
      if (sessionStorage.getItem('csc-open')) return;
      sessionStorage.setItem('csc-open', '1');
      send({ event: 'open' });
    } catch {
      /* ignore */
    }
  }, [pathname]);

  // "read" — ≥50% depth AND ≥90s on one /post/* page, once per slug per session.
  useEffect(() => {
    if (!pathname.startsWith('/post/')) return;
    const slug = pathname.split('/')[2] ?? '';
    if (!slug) return;
    try {
      if (sessionStorage.getItem(`csc-read-${slug}`)) return;
    } catch {
      return;
    }
    let scrolled = false;
    let elapsed = false;
    let fired = false;
    const maybeFire = () => {
      if (fired || !scrolled || !elapsed) return;
      fired = true;
      try {
        sessionStorage.setItem(`csc-read-${slug}`, '1');
      } catch {
        /* still count it */
      }
      send({ event: 'read' });
      sendTrailEvent('read');
    };
    const onScroll = () => {
      const el = document.scrollingElement;
      if (!el) return;
      if ((el.scrollTop + window.innerHeight) / el.scrollHeight >= 0.5) {
        scrolled = true;
        maybeFire();
      }
    };
    const timer = window.setTimeout(() => {
      elapsed = true;
      maybeFire();
    }, 90_000);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // short posts can satisfy depth without scrolling
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  // "depth" — how far down a text the reader got and how long they were
  // actively on it, reported when they leave (tab hidden, navigation,
  // unload). The last reported cell is kept per text in sessionStorage, so a
  // reader who comes back and goes further MOVES their count (pd/pt name the
  // old cell) instead of adding a second one.
  useEffect(() => {
    if (!pathname.startsWith('/post/')) return;
    const slug = pathname.split('/')[2] ?? '';
    if (!slug) return;
    const KEY = `csc-depth-${slug}`;
    let prior: { d: number; t: number; ms: number } | null = null;
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const [d, t, ms] = raw.split(':').map(Number);
        if ([d, t, ms].every(Number.isFinite)) prior = { d, t, ms };
      }
    } catch {
      /* ignore */
    }

    // Time counts only while the tab is visible AND the reader has done
    // something in the last minute: each stretch between interactions adds
    // at most IDLE_CAP. A text left open on a desk, or a tab the browser
    // froze in the background, must not read as a long attentive visit.
    const IDLE_CAP = 60_000;
    let maxRatio = 0;
    let activeMs = 0;
    let last = document.visibilityState === 'visible' ? Date.now() : 0; // 0 = not counting
    const tick = () => {
      if (!last) return;
      const now = Date.now();
      activeMs += Math.min(now - last, IDLE_CAP);
      last = now;
    };
    const measure = () => {
      tick();
      const el = document.scrollingElement;
      if (!el) return;
      const r = (el.scrollTop + window.innerHeight) / Math.max(1, el.scrollHeight);
      if (r > maxRatio) maxRatio = r;
    };
    const report = () => {
      try {
        tick();
        const ms = (prior?.ms ?? 0) + activeMs;
        if (ms < 3000) return; // an instant bounce says nothing about the text
        const reached =
          maxRatio >= 0.97 ? 100 : maxRatio >= 0.75 ? 75 : maxRatio >= 0.5 ? 50 : maxRatio >= 0.25 ? 25 : 0;
        const d = Math.max(prior?.d ?? 0, reached);
        const sec = ms / 1000;
        const t = Math.max(prior?.t ?? 0, sec < 30 ? 0 : sec < 90 ? 1 : sec < 300 ? 2 : 3);
        if (!prior || d !== prior.d || t !== prior.t) {
          send({ event: 'depth', slug, d, t, ...(prior ? { pd: prior.d, pt: prior.t } : {}) });
        }
        prior = { d, t, ms };
        activeMs = 0;
        sessionStorage.setItem(KEY, `${d}:${t}:${ms}`);
      } catch {
        /* best-effort */
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        report();
        last = 0;
      } else {
        last = Date.now();
      }
    };
    const ACTIVITY = ['pointermove', 'pointerdown', 'keydown', 'touchstart'] as const;
    window.addEventListener('scroll', measure, { passive: true });
    for (const name of ACTIVITY) window.addEventListener(name, tick, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', report);
    measure();
    return () => {
      report();
      window.removeEventListener('scroll', measure);
      for (const name of ACTIVITY) window.removeEventListener(name, tick);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', report);
    };
  }, [pathname]);

  // "follow" and "pick" — one delegated listener; no per-link wiring.
  // data-where on an anchor overrides the follow placement inference.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      try {
        const target = e.target as Element | null;
        const a = target?.closest?.('a[href]');
        if (!(a instanceof HTMLAnchorElement)) return;
        // "pick" — a text opened from the search results (rank = its place
        // among the texts listed) or from an Ask answer's citations.
        // Trail-only: it shows up in the visit's timeline on /analytics.
        if (
          a.origin === location.origin &&
          a.pathname.startsWith('/post/') &&
          (location.pathname === '/search' || location.pathname === '/ask')
        ) {
          const listed: string[] = [];
          (document.querySelector('main') ?? document)
            .querySelectorAll<HTMLAnchorElement>('a[href^="/post/"]')
            .forEach((el) => {
              if (!listed.includes(el.pathname)) listed.push(el.pathname);
            });
          sendTrailEvent(`pick:${Math.min(listed.indexOf(a.pathname) + 1, 99)}`);
          return;
        }
        // Placement-strict matching: only real follow CTAs count. The Substack
        // ROOT is a follow; /p/<slug> links (the per-post "Original" button,
        // in-body citations) are source attribution and would contaminate the
        // metric this exists to read. Same for /feed/ substrings on external URLs.
        const u = new URL(a.href);
        const dest =
          u.hostname === 'dennisbouvard.substack.com' && (u.pathname === '/' || u.pathname === '')
            ? 'substack'
            : (u.hostname === 'x.com' || u.hostname === 'twitter.com') && u.pathname.replace(/\/$/, '') === '/centerstudy_'
              ? 'x'
              : u.origin === location.origin && (u.pathname === '/feed.xml' || u.pathname.startsWith('/feed/'))
                ? 'rss'
                : null;
        if (!dest) return;
        const where =
          a.dataset.where ||
          (a.closest('footer')
            ? 'footer'
            : location.pathname.startsWith('/post/')
              ? 'post-end'
              : location.pathname === '/begin'
                ? 'start'
                : 'other');
        send({ event: 'follow', dest, where });
        sendTrailEvent(`follow:${dest}:${where}`);
      } catch {
        /* ignore */
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
