import type { StudyData } from './data';
import { sourceName } from './derive';
import type { Insight } from './derive';
import type { XSnapshot, XPost } from '@/lib/x-analytics';
import type { GrowthSeries } from '@/lib/growth';

// Where the overview's "X, and what it sends here" section comes from: the
// one place this console crosses the X account against the site's own
// visit log, rather than showing either on its own (every other X number
// lives in /analytics/x; every other follower number lives in /analytics/growth).

const DAY = 86_400_000;
const POST_WINDOW = 2 * DAY; // site visits credited to a post: the 48h after it
const utcDay = (t: number) => new Date(t).toISOString().slice(0, 10);

// 90 days, not 30 — matches the site's own retention (see data.ts) and
// gives the Daily/Weekly/Monthly toggle on the Overview enough history for
// the weekly and monthly views to show more than a point or two.
const WINDOW_DAYS = 90;

export type ReachCharts = {
  impressions: { day: string; value: number }[]; // 90d, oldest first
  siteVisits: { day: string; value: number }[]; // 90d, oldest first
  followers: { day: string; value: number }[]; // whatever history is stored
  xShareOfReferred: { day: string; value: number }[]; // 0-100, days with any referred visit
  topPost: { text: string; url: string; arrivals: number } | null;
};

export function buildReachCharts(data: StudyData, xSnap: XSnapshot | null, growth: GrowthSeries[]): ReachCharts | null {
  if (!xSnap) return null;
  const now = Date.now();
  const daysN = Array.from({ length: WINDOW_DAYS }, (_, i) => utcDay(now - (WINDOW_DAYS - 1 - i) * DAY));
  const own = xSnap.posts.filter((p) => p.kind !== 'reply');
  const acctByDay = new Map(xSnap.acct.map((d) => [d.day, d]));

  const viewsOnDay = new Map<string, number>();
  for (const p of own) viewsOnDay.set(utcDay(p.t), (viewsOnDay.get(utcDay(p.t)) ?? 0) + p.v);
  const impressions = daysN.map((d) => ({ day: d, value: acctByDay.get(d)?.imp ?? viewsOnDay.get(d) ?? 0 }));

  const sessions = data.allSessions ?? [];
  const fromX = sessions.filter((s) => !!s.ref && sourceName(s.ref) === 'X' && !s.mine && !s.crawler);
  const xArrivalsOnDay = new Map<string, number>();
  for (const s of fromX) xArrivalsOnDay.set(utcDay(s.start), (xArrivalsOnDay.get(utcDay(s.start)) ?? 0) + 1);
  const siteVisits = daysN.map((d) => ({ day: d, value: xArrivalsOnDay.get(d) ?? 0 }));

  // Share of referred visits, by day: of everyone who arrived with ANY
  // referrer that day, what fraction's referrer was X. Days with no
  // referred arrivals at all are left out rather than shown as a false 0%.
  const referred = sessions.filter((s) => !!s.ref && !s.mine && !s.crawler);
  const refTotalOnDay = new Map<string, number>();
  for (const s of referred) { const d = utcDay(s.start); refTotalOnDay.set(d, (refTotalOnDay.get(d) ?? 0) + 1); }
  const xShareOfReferred = daysN
    .filter((d) => (refTotalOnDay.get(d) ?? 0) > 0)
    .map((d) => ({ day: d, value: Math.round(((xArrivalsOnDay.get(d) ?? 0) / refTotalOnDay.get(d)!) * 100) }));

  const followerSeries = growth.find((s) => s.key === 'x:centerstudy_');
  const followers = (followerSeries?.points ?? []).slice(-WINDOW_DAYS);

  // The post from the last 7 days that sent the most site visits in the
  // 48h after it went out.
  const since7 = now - 7 * DAY;
  const logStart = sessions.reduce((m, s) => Math.min(m, s.start), Number.POSITIVE_INFINITY);
  let topPost: ReachCharts['topPost'] = null;
  if (Number.isFinite(logStart)) {
    let best: { p: XPost; n: number } | null = null;
    for (const p of own) {
      if (p.t < since7 || p.t < logStart) continue;
      const n = fromX.filter((s) => s.start >= p.t && s.start < p.t + POST_WINDOW).length;
      if (!best || n > best.n) best = { p, n };
    }
    if (best && best.n > 0) {
      // Strip leading/trailing quote marks — a lot of posts are themselves a
      // quotation, and the insight line below adds its own curly quotes.
      const clipped = best.p.text.replace(/https:\/\/t\.co\/\S+/g, '').trim().replace(/^["“”']+|["“”']+$/g, '').trim().slice(0, 100);
      topPost = { text: clipped, url: `https://x.com/centerstudy_/status/${best.p.id}`, arrivals: best.n };
    }
  }

  return { impressions, siteVisits, followers, xShareOfReferred, topPost };
}

export function buildReachInsights(charts: ReachCharts | null): Insight[] {
  if (!charts) return [];
  const out: Insight[] = [];
  const recentShare = charts.xShareOfReferred.slice(-7);
  if (recentShare.length > 0) {
    const avg = Math.round(recentShare.reduce((a, p) => a + p.value, 0) / recentShare.length);
    out.push({
      text: `X has been ${avg}% of referred arrivals this week (days with any referral), averaged over the last ${recentShare.length}`,
      href: '/analytics/x',
    });
  }
  const last7Visits = charts.siteVisits.slice(-7).reduce((a, p) => a + p.value, 0);
  const prev7Visits = charts.siteVisits.slice(-14, -7).reduce((a, p) => a + p.value, 0);
  if (last7Visits > 0 || prev7Visits > 0) {
    const p = prev7Visits > 0 ? Math.round(((last7Visits - prev7Visits) / prev7Visits) * 100) : null;
    out.push({
      text: `${last7Visits} site visit${last7Visits === 1 ? '' : 's'} from X this week` + (p !== null ? ` (${p > 0 ? '+' : ''}${p}%)` : ''),
      href: '/analytics/x',
      tone: p !== null ? (p >= 0 ? 'up' : 'down') : undefined,
    });
  }
  if (charts.followers.length >= 2) {
    const last = charts.followers[charts.followers.length - 1];
    const weekAgo = [...charts.followers].reverse().find((p) => Date.parse(`${p.day}T00:00:00Z`) <= Date.now() - 7 * DAY);
    if (weekAgo && weekAgo.day !== last.day) {
      const delta = last.value - weekAgo.value;
      out.push({ text: `X followers: ${delta >= 0 ? '+' : ''}${delta} this week, now ${last.value.toLocaleString('en-US')}`, href: '/analytics/growth', tone: delta >= 0 ? 'up' : 'down' });
    }
  }
  if (charts.topPost) {
    out.push({
      text: `Top X post this week sent ${charts.topPost.arrivals} site visit${charts.topPost.arrivals === 1 ? '' : 's'} in the 48h after: “${charts.topPost.text}”`,
      href: charts.topPost.url,
    });
  }
  return out;
}
