'use client';
import { useEffect } from 'react';

// Mounted on the 404 page: reports the missing path (and nothing else) so
// /analytics can list broken links people actually follow. Same best-effort,
// anonymous posture as the other trackers.
export default function TrackMiss() {
  useEffect(() => {
    try {
      let mine = false;
      try { mine = !!localStorage.getItem('csc-mine'); } catch { /* ignore */ }
      fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: '404', path: location.pathname, ...(mine ? { mine: true } : {}) }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* best-effort */
    }
  }, []);
  return null;
}
