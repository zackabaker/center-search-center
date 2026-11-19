// Kept answers: tutor answers the owner judged good enough to reuse. They are
// served instantly for the same question (the starter questions above all),
// each has a page of its own, and they double as reference answers for the
// eval. Two stores, one view: tutor/answers.json in the repo, and whatever
// the owner has kept since from the site (KV), which wins on the same id.
import crypto from 'crypto';
import { getKV } from '../kv';
import starters from '../../../tutor/starters.json';
import seeded from '../../../tutor/answers.json';

export interface KeptAnswer {
  id: string;
  q: string;
  a: string;
  sources: { title: string; url: string; source: string; snippet: string }[];
  whole: { title: string; url: string }[];
  keptAt: number;
}

const KEY = 'tutor:kept';
const norm = (q: string) => q.normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** A starter question keeps its readable id; anything else gets one from its wording. */
export function keptIdFor(q: string): string {
  const n = norm(q);
  const starter = (starters as { id: string; q: string }[]).find((s) => norm(s.q) === n);
  return starter ? starter.id : 'q-' + crypto.createHash('sha1').update(n).digest('hex').slice(0, 10);
}

export async function getKept(id: string): Promise<KeptAnswer | null> {
  if (!/^[a-z0-9-]{2,60}$/.test(id)) return null;
  const kv = getKV();
  if (kv) {
    try {
      const v = await kv.hget<KeptAnswer | string>(KEY, id);
      if (v === 'removed') return null;
      if (v) return typeof v === 'string' ? (JSON.parse(v) as KeptAnswer) : v;
    } catch { /* fall through to the repo copy */ }
  }
  return (seeded as KeptAnswer[]).find((k) => k.id === id) ?? null;
}

export async function saveKept(k: Omit<KeptAnswer, 'id' | 'keptAt'>): Promise<KeptAnswer | null> {
  const kv = getKV();
  if (!kv) return null;
  const kept: KeptAnswer = { ...k, id: keptIdFor(k.q), keptAt: Date.now() };
  await kv.hset(KEY, { [kept.id]: JSON.stringify(kept) });
  return kept;
}

/** Un-keep. A tombstone, so a repo copy with the same id stays hidden too. */
export async function removeKept(id: string): Promise<void> {
  const kv = getKV();
  if (kv && /^[a-z0-9-]{2,60}$/.test(id)) await kv.hset(KEY, { [id]: 'removed' });
}
