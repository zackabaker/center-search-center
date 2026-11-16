'use client';
import { useEffect } from 'react';
import { logAccountEvent, signedInHint } from '@/lib/account-client';

const BEAT_MS = 30_000;
/** No scroll, tap or key for this long = not reading; the clock stops. */
const IDLE_MS = 90_000;

export function MarkPostRead({ slug, title }: { slug: string; title?: string }) {
  useEffect(() => {
    try {
      const key = 'csc-read-posts';
      const existing: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      if (!existing.includes(slug)) {
        existing.push(slug);
        localStorage.setItem(key, JSON.stringify(existing));
      }
    } catch {}
    // Signed-in readers keep a reading history (no-op when signed out).
    logAccountEvent({ type: 'read', slug, title: title ?? slug });
  }, [slug, title]);

  // Reading time, for signed-in readers only: one beat per 30 seconds in which
  // the tab was visible and the reader did something. Feeds the engagement
  // score; nothing is sent for anonymous visitors.
  useEffect(() => {
    if (!signedInHint()) return;
    let lastActive = Date.now();
    const active = () => { lastActive = Date.now(); };
    const events = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const;
    events.forEach((e) => window.addEventListener(e, active, { passive: true }));
    const timer = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastActive > IDLE_MS) return;
      logAccountEvent({ type: 'time' });
    }, BEAT_MS);
    return () => {
      clearInterval(timer);
      events.forEach((e) => window.removeEventListener(e, active));
    };
  }, [slug]);

  return null;
}
