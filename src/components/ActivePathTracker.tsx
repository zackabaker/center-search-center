'use client';

import { useEffect } from 'react';

// Remembers which reading path the visitor most recently opened, so posts
// shared between paths (16 of ~42) can thread "Next in …" to the path the
// reader is actually on instead of the first path that claims the slug.
// Not reading-position memory — no resume UI, no per-post state; just which
// door the reader walked through last.
export default function ActivePathTracker({ pathSlug }: { pathSlug: string }) {
  useEffect(() => {
    try {
      localStorage.setItem('csc-reading-path', pathSlug);
    } catch {}
  }, [pathSlug]);
  return null;
}
