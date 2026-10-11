'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Anonymous conversion events (counted by /api/convert): the landing page is
// remembered per session; "open" fires once when the session moves past that
// landing page into a text or /start; "read" once per post per session at
// ≥50% scroll AND ≥90s; "follow" on any click out to Substack /
// @centerstudy_ / RSS (destination + placement only); "return" when a
// browser comes back after 1–30 days (day gap only). Everything lives in
// session/localStorage, nothing identifying leaves the browser, and every
// call is wrapped — a storage or network failure must never affect the page.
// The /the-center-of-everything flagship bypasses this layout, so it carries
// its own equivalent inline script.

function send(payload: Record<string, unknown>) {
  try {
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
        }
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
      const isText = pathname.startsWith('/post/') || pathname === '/start';
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

  // "follow" — one delegated listener; no per-link wiring. data-where on an
  // anchor overrides the placement inference.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      try {
        const target = e.target as Element | null;
        const a = target?.closest?.('a[href]');
        if (!(a instanceof HTMLAnchorElement)) return;
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
              : location.pathname === '/start'
                ? 'start'
                : location.pathname === '/animal-communication'
                  ? 'endlist'
                  : 'other');
        send({ event: 'follow', dest, where });
      } catch {
        /* ignore */
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
