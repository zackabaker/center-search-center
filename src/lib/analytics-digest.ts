// Weekly digests for /analytics: a snapshot of the "This week" lines and the
// headline numbers, written once a week by a cron (src/app/api/analytics/
// digest) so there is a record of how each week went — the rolling console
// only ever shows the present one.
import { getKV } from './kv';

export type Digest = {
  week: string; // the Monday (UTC) the digest was written; it covers the 7 days before
  at: number;
  stats: { label: string; cur: number; prev: number }[];
  lines: string[];
};

const LOG = 'digest:log';
const CAP = 104; // two years of weeks

export function mondayOf(t = Date.now()): string {
  const d = new Date(t);
  const dow = (d.getUTCDay() + 6) % 7; // Monday = 0
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - dow)).toISOString().slice(0, 10);
}

/** Claim this week's slot. False when a digest for the week already exists. */
export async function claimWeek(week: string): Promise<boolean> {
  const kv = getKV();
  if (!kv) return false;
  return (await kv.set(`digest:week:${week}`, 1, { nx: true, ex: 60 * 60 * 24 * 8 })) !== null;
}

export async function releaseWeek(week: string): Promise<void> {
  const kv = getKV();
  if (kv) await kv.del(`digest:week:${week}`);
}

export async function saveDigest(d: Digest): Promise<void> {
  const kv = getKV();
  if (!kv) return;
  const pipe = kv.pipeline();
  pipe.lpush(LOG, JSON.stringify(d));
  pipe.ltrim(LOG, 0, CAP - 1);
  await pipe.exec();
}

/** Newest first, one per week (a forced re-run supersedes the earlier entry). */
export async function listDigests(n: number): Promise<Digest[]> {
  const kv = getKV();
  if (!kv) return [];
  try {
    const rows = (await kv.lrange(LOG, 0, n * 2)) as unknown[];
    const seen = new Set<string>();
    const out: Digest[] = [];
    for (const r of rows) {
      let v: unknown = r;
      if (typeof r === 'string') {
        try { v = JSON.parse(r); } catch { continue; }
      }
      const d = v as Partial<Digest> | null;
      if (!d || typeof d.week !== 'string' || !Array.isArray(d.lines) || seen.has(d.week)) continue;
      seen.add(d.week);
      out.push({ week: d.week, at: Number(d.at) || 0, stats: Array.isArray(d.stats) ? d.stats : [], lines: d.lines });
      if (out.length >= n) break;
    }
    return out;
  } catch {
    return [];
  }
}
