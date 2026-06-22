'use client';
import { useEffect } from 'react';
import { trackView } from '@/hooks/useReadingHistory';

export default function TrackView({ slug, title, source, date }: {
  slug: string; title: string; source: string; date: string | null;
}) {
  useEffect(() => {
    trackView({ slug, title, source, date });
  }, [slug, title, source, date]);

  // Server-side view count (anonymous, best-effort) — once per post per browser
  // session so re-mounts / HMR don't inflate the count. No UI uses this yet;
  // we're just accumulating data, like the search log.
  useEffect(() => {
    if (typeof window === 'undefined' || !slug) return;
    try {
      const key = `csc-viewed-${slug}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
      fetch('/api/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* best-effort */
    }
  }, [slug]);

  return null;
}
