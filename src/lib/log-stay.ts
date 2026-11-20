// Fire-and-forget: how long a visitor has had a search's results in view,
// in seconds, written to the visit's trail as "stay:<seconds>". The console
// uses it to tell a search that was read on the page from one that was
// abandoned. Anonymous like the rest of the trail; never throws.
import { getSid } from './session-id';

export function logStay(seconds: number): void {
  if (typeof window === 'undefined') return;
  const secs = Math.min(900, Math.round(seconds));
  if (secs < 2) return;
  try {
    const sid = getSid();
    if (!sid) return;
    const mine = !!localStorage.getItem('csc-mine');
    fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid, path: '/search', ev: `stay:${secs}`, ...(mine ? { mine: true } : {}) }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* best-effort */
  }
}
