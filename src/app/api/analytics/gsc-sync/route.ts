import { isOwner, mayRunJob } from '@/lib/analytics-auth';
import { gscConfigured, syncGsc } from '@/lib/gsc';

// Search Console refresh on demand. The scheduled refresh runs through
// /api/analytics/daily; this route is for the owner (or a manual cron) to
// pull a fresh snapshot right now. Without GSC_SERVICE_ACCOUNT_JSON it
// answers "skipped" and does nothing. The owner sees the failure reason;
// everyone else only ok/failed.

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!mayRunJob(request)) return new Response('Not found', { status: 404 });
  if (!gscConfigured()) return Response.json({ ok: true, skipped: 'not configured' });
  try {
    const snap = await syncGsc();
    return Response.json({ ok: true, queries: snap.queries.length, range: `${snap.start}..${snap.end}` });
  } catch (e) {
    return Response.json(
      { ok: false, ...(isOwner(request) ? { error: e instanceof Error ? e.message : 'failed' } : {}) },
      { status: 502 },
    );
  }
}
