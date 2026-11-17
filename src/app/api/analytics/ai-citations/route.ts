import { isOwner, mayRunJob } from '@/lib/analytics-auth';
import { getKV } from '@/lib/kv';
import { runCitationChecks } from '@/lib/ai-citations';

// Run a few AI-citation checks on demand (the daily cron does this through
// /api/analytics/daily). Each check is a paid model call with web search, so
// a run is small — two questions by default, five at most — and at most one
// may start per ten minutes, whoever asks.
//
// GET ?n=2 → { ok, checked: [{ id, cited, error? }] } for the owner; { ok } otherwise.

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!mayRunJob(request)) return new Response('Not found', { status: 404 });
  const kv = getKV();
  if (!kv) return Response.json({ ok: false }, { status: 503 });
  if ((await kv.set('aicite:lock', 1, { nx: true, ex: 600 })) === null) {
    return Response.json({ ok: true, skipped: 'ran in the last ten minutes' });
  }
  const n = Number(new URL(request.url).searchParams.get('n')) || 2;
  const checks = await runCitationChecks(n);
  return Response.json({
    ok: true,
    ...(isOwner(request)
      ? { checked: checks.map((c) => ({ id: c.id, searched: c.searched, cited: c.cited, seenRank: c.seenRank, top: c.top.map((t) => t.host), error: c.error })) }
      : {}),
  });
}
