import { isOwner, mayRunJob } from '@/lib/analytics-auth';
import { getKV } from '@/lib/kv';
import { syncX, xConfigured } from '@/lib/x-analytics';

// Refresh the X archive on demand (src/lib/x-analytics.ts). The daily job
// calls syncX() itself; this route is for the owner: the "fetch the full
// history" and "refresh now" links in /analytics/x.
//
// GET ?full=1  → read every post back to the first (one-time; counts each
//                post against the X API plan)
// GET          → refresh the newest hundred
// &back=1      → return to the X room instead of answering with JSON
//
// Owner or scheduled job only; everyone else gets the console's 404. A short
// lock keeps a double click from reading the history twice.

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!mayRunJob(request)) return new Response('Not found', { status: 404 });
  const url = new URL(request.url);
  const back = url.searchParams.get('back') === '1';
  const done = (query: string, body: object, status = 200) =>
    back ? Response.redirect(new URL(`/analytics/x?${query}`, url.origin), 303) : Response.json(body, { status });

  if (!xConfigured()) return done('x=unconfigured', { ok: false, error: 'TWITTER_BEARER_TOKEN is not set' }, 503);

  // The full history is the owner's to ask for, never a scheduled job's.
  const full = url.searchParams.get('full') === '1' && isOwner(request);
  const kv = getKV();
  if (kv && (await kv.set('x:lock', 1, { nx: true, ex: 120 })) === null) {
    return done('x=busy', { ok: true, skipped: true });
  }
  try {
    const res = await syncX({ pages: full ? 40 : 1 });
    return done('x=synced', { ok: true, ...res });
  } catch (err) {
    console.error('x-sync failed', err);
    return done('x=failed', { ok: false }, 502);
  }
}
