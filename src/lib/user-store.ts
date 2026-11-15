// Per-account storage in the shared Upstash store: a reader's saved idioms,
// reading history and queries, keyed by their Google account id.
//
// Unlike the anonymous logs elsewhere in this app, this data is tied to an
// identity ON PURPOSE — the reader signed in and asked for it to be kept. It is
// only ever read back to that same signed-in reader, and DELETE /api/me/account
// erases all of it.
//
// Server-only.

import { getKV } from './kv';

export interface Idiom {
  id: string;
  text: string;
  slug: string;
  title: string;
  source: string;
  anchor: string | null;
  savedAt: string;
}

export interface ReadEvent { slug: string; title: string; at: string; }
export interface QueryEvent { q: string; kind: 'ask' | 'search'; at: string; }

export const MAX_IDIOMS = 1000;
export const MAX_EVENTS = 500;

// Local development has no store; keep data in memory so the feature can be
// exercised end to end. Never used in production.
const mem = new Map<string, unknown>();
const devFallback = () => process.env.NODE_ENV !== 'production';

export function storeAvailable(): boolean {
  return getKV() !== null || devFallback();
}

async function read<T>(key: string, empty: T): Promise<T> {
  const kv = getKV();
  if (!kv) return devFallback() ? ((mem.get(key) as T) ?? empty) : empty;
  const v = await kv.get<T | string>(key);
  if (v == null) return empty;
  if (typeof v === 'string') {
    try { return JSON.parse(v) as T; } catch { return empty; }
  }
  return v as T;
}

async function write(key: string, value: unknown): Promise<void> {
  const kv = getKV();
  if (!kv) { if (devFallback()) mem.set(key, value); return; }
  await kv.set(key, JSON.stringify(value));
}

async function remove(key: string): Promise<void> {
  const kv = getKV();
  if (!kv) { mem.delete(key); return; }
  await kv.del(key);
}

const k = (sub: string, what: string) => `acct:${sub}:${what}`;

const str = (v: unknown, max: number): string => (typeof v === 'string' ? v.slice(0, max) : '');

/** Coerce untrusted input into a clean, bounded idiom list. */
export function cleanIdioms(input: unknown): Idiom[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: Idiom[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== 'object') continue;
    const r = raw as Record<string, unknown>;
    const id = str(r.id, 64);
    const text = str(r.text, 2000).trim();
    const slug = str(r.slug, 200);
    if (!id || !text || !/^[a-z0-9-]+$/i.test(slug) || seen.has(id)) continue;
    seen.add(id);
    const anchor = str(r.anchor, 16);
    out.push({
      id,
      text,
      slug,
      title: str(r.title, 300),
      source: str(r.source, 40),
      anchor: /^p-\d+$/.test(anchor) ? anchor : null,
      savedAt: str(r.savedAt, 40) || new Date().toISOString(),
    });
    if (out.length >= MAX_IDIOMS) break;
  }
  return out;
}

export const getIdioms = (sub: string) => read<Idiom[]>(k(sub, 'idioms'), []);
export const setIdioms = (sub: string, list: Idiom[]) => write(k(sub, 'idioms'), list);

export const getReads = (sub: string) => read<ReadEvent[]>(k(sub, 'reads'), []);
export const getQueries = (sub: string) => read<QueryEvent[]>(k(sub, 'queries'), []);

export async function addRead(sub: string, slug: string, title: string): Promise<void> {
  const list = (await getReads(sub)).filter((e) => e.slug !== slug);
  list.unshift({ slug, title, at: new Date().toISOString() });
  await write(k(sub, 'reads'), list.slice(0, MAX_EVENTS));
}

export async function addQuery(sub: string, q: string, kind: 'ask' | 'search'): Promise<void> {
  const list = (await getQueries(sub)).filter((e) => !(e.q === q && e.kind === kind));
  list.unshift({ q, kind, at: new Date().toISOString() });
  await write(k(sub, 'queries'), list.slice(0, MAX_EVENTS));
}

export async function clearEvents(sub: string, what: 'reads' | 'queries'): Promise<void> {
  await remove(k(sub, what));
}

export async function deleteAccountData(sub: string): Promise<void> {
  await Promise.all([remove(k(sub, 'idioms')), remove(k(sub, 'reads')), remove(k(sub, 'queries'))]);
}
