import { getKV } from './kv';

// A small, generic day → number series, for anything the owner wants
// tracked over time across platforms: follower counts, subscriber counts,
// an outside analytics tool's visit count — whatever /analytics/growth
// should chart. Two ways a series gets a point:
//   - automatic: the daily job (src/app/api/analytics/daily/route.ts) calls
//     recordAutoFollowerCounts(), which reads the X accounts this site
//     already has a bearer token for;
//   - manual: the owner types a number into the room, for anything with no
//     API this site can reach (Substack subscribers, a generativeanthropology.com
//     analytics number, …) — src/app/api/analytics/growth/route.ts.
// Re-recording the same day replaces that day's value, so nothing breaks if
// the cron and a manual entry both touch the same day.

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

// ── Substack: no exact count without signing in, but a rounded floor IS
// public ───────────────────────────────────────────────────────────────────
// Substack's own homepage meta description says "...a Substack publication
// with hundreds of subscribers" (or thousands, tens of thousands, ...) —
// nothing finer than that bucket, and no number the author hasn't opted to
// round. That bucket is still worth charting: it steps up only when a real
// milestone is crossed, with no login needed, so it runs daily for free.
// For the real number, the owner reads it off Substack's own dashboard
// (substack.com/publish/stats) and types it into the room — the two are
// kept as separate series on purpose, since mixing an exact count with a
// rounded floor on one line would make the floor look like real data.
export const PUBLIC_SUBSTACKS: { key: string; host: string; label: string }[] = [
  { key: 'substack:dennisbouvard:floor', host: 'dennisbouvard.substack.com', label: 'Substack (public floor) — Dennis Bouvard' },
];

const SUBSTACK_BUCKETS: [RegExp, number][] = [
  [/a handful of/i, 5],
  [/dozens of/i, 24],
  [/hundreds of/i, 100],
  [/thousands of/i, 1_000],
  [/tens of thousands of/i, 10_000],
  [/hundreds of thousands of/i, 100_000],
];

async function substackFloor(host: string): Promise<number | null> {
  const res = await fetch(`https://${host}/`, { headers: { 'User-Agent': 'Mozilla/5.0' }, cache: 'no-store' });
  if (!res.ok) return null;
  const html = await res.text();
  const m = html.match(/content="[^"]*?with ([a-z\s]+?) subscribers\.?"/i);
  if (!m) return null;
  const hit = SUBSTACK_BUCKETS.find(([re]) => re.test(m[1]));
  return hit ? hit[1] : null;
}

/** Called by the daily job, alongside the X follower lookups. */
export async function recordSubstackFloors(): Promise<{ recorded: string[]; failed: string[] }> {
  const day = new Date().toISOString().slice(0, 10);
  const recorded: string[] = [];
  const failed: string[] = [];
  for (const pub of PUBLIC_SUBSTACKS) {
    try {
      const n = await substackFloor(pub.host);
      if (n === null) { failed.push(pub.key); continue; }
      await recordPoint(pub.key, pub.label, 'subscribers, at least', true, day, n);
      recorded.push(pub.key);
    } catch {
      failed.push(pub.key);
    }
  }
  return { recorded, failed };
}
