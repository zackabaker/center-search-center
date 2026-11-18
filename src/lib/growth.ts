import { getKV } from './kv';

// A small, generic day → number series, for anything the owner wants
// tracked over time across platforms: follower counts, subscriber counts,
// an outside analytics tool's visit count — whatever /analytics/growth
// should chart. Two ways a series gets a point:
//   - automatic: the daily job (src/app/api/analytics/daily/route.ts) calls
//     recordAutoFollowerCounts(), which reads the X accounts this site
//     already has a bearer token for;
//   - manual: the owner types a number into the room, for anything with no
//     API this site can reach (generativeanthropology.com's own analytics,
//     etc.) — src/app/api/analytics/growth/route.ts.
// Re-recording the same day replaces that day's value, so nothing breaks if
// the cron and a manual entry both touch the same day.
//
// Substack subscriber tracking (a public "hundreds of subscribers"-style
// floor Substack prints on its own homepage, no login needed) was tried and
// removed at the owner's request, 2026-11-18 — too coarse to be worth a
// series of its own. If it comes back, read the commit that added it.

export type GrowthPoint = { day: string; value: number };
export type GrowthSeries = { key: string; label: string; unit: string; auto: boolean; points: GrowthPoint[] };

const SERIES_KEY = 'growth:series'; // hash: key -> { label, unit, auto } JSON
const pointsKey = (key: string) => `growth:pts:${key}`; // hash: day -> number

type SeriesMeta = { label: string; unit: string; auto: boolean };

const mem = (() => {
  const g = globalThis as typeof globalThis & {
    __growthMem?: { series: Map<string, SeriesMeta>; points: Map<string, Map<string, number>> };
  };
  return (g.__growthMem ??= { series: new Map(), points: new Map() });
})();

const parse = <T,>(v: unknown): T | null => {
  if (v && typeof v === 'object') return v as T;
  if (typeof v === 'string') {
    try { return JSON.parse(v) as T; } catch { return null; }
  }
  return null;
};

/** Accounts this site can read a follower count for directly (no CSV needed). */
export const AUTO_X_ACCOUNTS: { key: string; username: string; label: string }[] = [
  { key: 'x:centerstudy_', username: 'centerstudy_', label: 'X followers — @centerstudy_' },
  { key: 'x:bouvard38829538', username: 'bouvard38829538', label: 'X followers — Dennis Bouvard' },
];

export async function recordPoint(key: string, label: string, unit: string, auto: boolean, day: string, value: number): Promise<void> {
  const kv = getKV();
  if (!kv) {
    if (!mem.series.has(key)) mem.series.set(key, { label, unit, auto });
    (mem.points.get(key) ?? mem.points.set(key, new Map()).get(key)!).set(day, value);
    return;
  }
  await Promise.all([
    kv.hset(SERIES_KEY, { [key]: JSON.stringify({ label, unit, auto }) }),
    kv.hset(pointsKey(key), { [day]: value }),
  ]);
}

export async function readAllGrowth(): Promise<GrowthSeries[]> {
  const kv = getKV();
  let series: Map<string, SeriesMeta>;
  if (!kv) {
    series = mem.series;
  } else {
    const raw = await kv.hgetall<Record<string, unknown>>(SERIES_KEY);
    series = new Map(
      Object.entries(raw ?? {})
        .map(([k, v]) => [k, parse<SeriesMeta>(v)] as const)
        .filter((e): e is [string, SeriesMeta] => !!e[1]),
    );
  }
  const out: GrowthSeries[] = [];
  for (const [key, meta] of series) {
    let pts: Map<string, number>;
    if (!kv) {
      pts = mem.points.get(key) ?? new Map();
    } else {
      const raw = await kv.hgetall<Record<string, unknown>>(pointsKey(key));
      pts = new Map(Object.entries(raw ?? {}).map(([d, v]) => [d, Number(v) || 0]));
    }
    out.push({
      key, label: meta.label, unit: meta.unit, auto: meta.auto,
      points: [...pts.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([day, value]) => ({ day, value })),
    });
  }
  return out.sort((a, b) => a.label.localeCompare(b.label));
}

/** One X user's public follower count — no tweet payload, so it's cheap enough to call daily per account. */
async function xFollowerCount(username: string): Promise<number | null> {
  if (!process.env.TWITTER_BEARER_TOKEN) return null;
  const res = await fetch(
    `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics`,
    { headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` }, cache: 'no-store' },
  );
  if (!res.ok) return null;
  const json = (await res.json()) as { data?: { public_metrics?: { followers_count?: number } } };
  return json.data?.public_metrics?.followers_count ?? null;
}

/** Called by the daily job. Every account gets its own best-effort try. */
export async function recordAutoFollowerCounts(): Promise<{ recorded: string[]; failed: string[] }> {
  const day = new Date().toISOString().slice(0, 10);
  const recorded: string[] = [];
  const failed: string[] = [];
  for (const acc of AUTO_X_ACCOUNTS) {
    try {
      const n = await xFollowerCount(acc.username);
      if (n === null) { failed.push(acc.key); continue; }
      await recordPoint(acc.key, acc.label, 'followers', true, day, n);
      recorded.push(acc.key);
    } catch {
      failed.push(acc.key);
    }
  }
  return { recorded, failed };
}

/** A fresh key from a label the owner typed, for manual series ("Substack subscribers" -> "manual:substack-subscribers"). */
export function keyFromLabel(label: string): string {
  const slug = label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  return `manual:${slug || 'series'}`;
}

/** Drop a series entirely — its meta and every point. Owner action only (see the growth route). */
export async function removeSeries(key: string): Promise<void> {
  const kv = getKV();
  if (!kv) {
    mem.series.delete(key);
    mem.points.delete(key);
    return;
  }
  await Promise.all([kv.hdel(SERIES_KEY, key), kv.del(pointsKey(key))]);
}
