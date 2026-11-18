import { mayRunJob } from '@/lib/analytics-auth';
import { getKV } from '@/lib/kv';
import { gscConfigured, syncGsc } from '@/lib/gsc';
import { runCitationChecks } from '@/lib/ai-citations';
import { syncX, xConfigured } from '@/lib/x-analytics';
import { recordAutoFollowerCounts } from '@/lib/growth';

// The console's daily upkeep, run by the Vercel cron in vercel.json: refresh
// the Search Console snapshot, and re-ask the two AI-citation questions that
// have waited longest (fifteen questions, so each comes round about weekly).
// The jobs run side by side and none can fail another. One run per twenty
// hours at most, so a forged call can't spend model credit.

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!mayRunJob(request)) return new Response('Not found', { status: 404 });
  const kv = getKV();
  if (!kv) return Response.json({ ok: false }, { status: 503 });
  if ((await kv.set('daily:lock', 1, { nx: true, ex: 60 * 60 * 20 })) === null) {
    return Response.json({ ok: true, skipped: true });
  }
  // Also the newest hundred posts of the Center Study X account with their
  // public numbers (src/lib/x-analytics.ts), and the day's follower count
  // for every X account this site can read (src/lib/growth.ts) — cheap
  // lookups (no tweet payload), so every one of them runs daily.
  const [gsc, cites, x, growth] = await Promise.allSettled([
    gscConfigured() ? syncGsc() : Promise.resolve(null),
    runCitationChecks(2),
    xConfigured() ? syncX() : Promise.resolve(null),
    recordAutoFollowerCounts(),
  ]);
  return Response.json({
    ok: true,
    gsc: gsc.status === 'fulfilled',
    citations: cites.status === 'fulfilled',
    x: x.status === 'fulfilled',
    growth: growth.status === 'fulfilled' ? growth.value : null,
  });
}
