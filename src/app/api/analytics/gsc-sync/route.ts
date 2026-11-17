import { isOwner } from '@/lib/analytics-auth';
import { gscConfigured, syncGsc } from '@/lib/gsc';

// Daily Search Console refresh — run by the Vercel cron in vercel.json, or by
// the owner on demand. Same runner rule as the digest: the cron (Bearer
// $CRON_SECRET when set, otherwise Vercel's cron user-agent) or the owner.
// Without GSC_SERVICE_ACCOUNT_JSON it answers "skipped" and does nothing.
// The owner sees the failure reason; everyone else only ok/failed.

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function mayRun(request: Request): boolean {
  if (isOwner(request)) return true;
  const secret = process.env.CRON_SECRET;
  if (secret) return request.headers.get('authorization') === `Bearer ${secret}`;
  return /vercel-cron/i.test(request.headers.get('user-agent') ?? '');
}

export async function GET(request: Request) {
  if (!mayRun(request)) return new Response('Not found', { status: 404 });
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
