import { isOwner, mayRunJob } from '@/lib/analytics-auth';
import { sendDigestEmail } from '@/lib/digest-email';
import { accountOverview } from '@/lib/user-store';
import { claimWeek, mondayOf, releaseWeek, saveDigest, type Digest } from '@/lib/analytics-digest';
import { fetchStudyData } from '@/app/analytics/data';
import { buildInsights, readerSessions } from '@/app/analytics/derive';

// Weekly digest writer — run by the Vercel cron in vercel.json (Mondays), or
// by the owner on demand (?force=1 rewrites the current week's entry;
// add &email=1 to send it as well).
//
// Who may run it: the cron or the owner (mayRunJob). The work is
// idempotent per week — the slot is claimed with SET NX *before* anything
// expensive runs — and the response says nothing but ok/skipped, so a forged
// call can at most make this week's snapshot happen a few hours early.

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!mayRunJob(request)) return new Response('Not found', { status: 404 });

  const week = mondayOf();
  const params = new URL(request.url).searchParams;
  const force = isOwner(request) && params.get('force') === '1';
  // The owner can ask for the re-run to be emailed too (?force=1&email=1) —
  // the way to test delivery without waiting for Monday.
  const emailNow = force && params.get('email') === '1';
  let claimed = false;
  try {
    claimed = await claimWeek(week);
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
  if (!claimed && !force) return Response.json({ ok: true, skipped: true });

  try {
    const data = await fetchStudyData();
    if (!data) throw new Error('no data');
    const accounts = await accountOverview(1).catch(() => null);

    const d7 = data.days.slice(0, 7);
    const p7 = data.days.slice(7, 14);
    const sum = (rows: typeof d7, f: (r: (typeof d7)[number]) => number) => rows.reduce((a, r) => a + f(r), 0);
    const stat = (label: string, f: (r: (typeof d7)[number]) => number) => ({ label, cur: sum(d7, f), prev: sum(p7, f) });

    const weekAgo = data.generatedAt - 7 * 86_400_000;
    const deepest = readerSessions(data.sessions)
      .filter((s) => s.end >= weekAgo)
      .map((s) => ({ s, reads: s.events.filter((e) => e.type === 'read').length }))
      .filter((x) => x.reads > 0)
      .sort((a, b) => b.reads - a.reads || b.s.mins - a.s.mins)[0]?.s ?? null;

    const digest: Digest = {
      week,
      at: Date.now(),
      stats: [
        stat('Readers', (r) => r.readers ?? 0),
        stat('Reader searches', (r) => Math.max(0, r.searches - r.searchesMine)),
        stat('Texts read', (r) => Math.max(0, r.reads - r.readsMine)),
        stat('Follows', (r) => r.follows),
      ],
      lines: buildInsights({
        movers: data.movers,
        aiRef: data.aiRef,
        crawlers: data.crawlers,
        search: data.searchOutcome,
        begin: data.beginFunnel,
        returns7: sum(d7, (r) => r.returns),
        returnsPrev7: sum(p7, (r) => r.returns),
        follows7: sum(d7, (r) => r.follows),
        followsPrev7: sum(p7, (r) => r.follows),
        newAccounts7: accounts?.last7 ?? 0,
        topJourney: deepest,
        completion: data.completion.n > 0 ? data.completion : null,
      }).map((i) => i.text),
    };
    await saveDigest(digest);
    // By email too, when a mail provider is configured (see digest-email.ts):
    // on the scheduled write, or when the owner's re-run asks for it.
    const emailed = claimed || emailNow ? await sendDigestEmail(digest) : false;
    return Response.json({
      ok: true,
      week,
      ...(isOwner(request) ? { lines: digest.lines.length, emailed } : {}),
    });
  } catch {
    // Give the slot back so the next run can try again.
    if (claimed) await releaseWeek(week).catch(() => {});
    return Response.json({ ok: false }, { status: 500 });
  }
}
