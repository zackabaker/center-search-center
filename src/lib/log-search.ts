// Fire-and-forget client logger: records a settled search query to the
// /api/search-log endpoint. Best-effort by design — it never throws, never
// awaits, and never blocks or breaks the search if logging is down.
//
// "Mine" tagging: every visitor's search is logged anonymously (no id, no IP).
// Only searches from a browser that has the owner flag set are tagged mine:true,
// so the owner can later filter their own searches from everyone else's. Set the
// flag once in the console:  localStorage.setItem('csc-mine','1')
const MINE_FLAG = 'csc-mine';

export type SearchMode = 'keyword' | 'meaning' | 'ask';

export function logSearch(q: string, mode: SearchMode, n?: number): void {
  if (typeof window === 'undefined') return;
  const query = q.trim().replace(/^["'“”]+|["'“”]+$/g, '').trim();
  if (query.length < 2) return;
  try {
    const mine = !!localStorage.getItem(MINE_FLAG);
    fetch('/api/search-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query, mode, mine, n }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* logging is best-effort */
  }
}
