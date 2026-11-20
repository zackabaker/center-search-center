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
export async function setIdioms(sub: string, list: Idiom[]): Promise<void> {
  await write(k(sub, 'idioms'), list);
  await updateStats(sub, (st) => ({ ...st, idioms: list.length }));
}

export const getReads = (sub: string) => read<ReadEvent[]>(k(sub, 'reads'), []);
export const getQueries = (sub: string) => read<QueryEvent[]>(k(sub, 'queries'), []);

export async function addRead(sub: string, slug: string, title: string): Promise<void> {
  const list = (await getReads(sub)).filter((e) => e.slug !== slug);
  list.unshift({ slug, title, at: new Date().toISOString() });
  await write(k(sub, 'reads'), list.slice(0, MAX_EVENTS));
}

export async function addQuery(sub: string, q: string, kind: 'ask' | 'search'): Promise<void> {
  const before = await getQueries(sub);
  const list = before.filter((e) => !(e.q === q && e.kind === kind));
  // Only a query not already in the reader's history counts toward their
  // engagement score — repeating one search does not.
  const isNew = list.length === before.length;
  list.unshift({ q, kind, at: new Date().toISOString() });
  await write(k(sub, 'queries'), list.slice(0, MAX_EVENTS));
  if (isNew) await updateStats(sub, (st) => ({ ...st, searches: st.searches + 1 }));
}

export async function clearEvents(sub: string, what: 'reads' | 'queries'): Promise<void> {
  await remove(k(sub, what));
}

export async function deleteAccountData(sub: string): Promise<void> {
  const profile = await read<Profile | null>(k(sub, 'profile'), null);
  await Promise.all([
    remove(k(sub, 'idioms')), remove(k(sub, 'reads')), remove(k(sub, 'queries')),
    remove(k(sub, 'profile')), remove(k(sub, 'avatar')), remove(k(sub, 'stats')),
    remove(k(sub, 'contact')), setAnnounce(sub, false),
    profile ? remove(unameKey(profile.username)) : Promise.resolve(),
    lbRemove(sub),
    idxRemove(sub),
  ]);
}

// ── Contact ─────────────────────────────────────────────────────────────
// The reader's email, kept from the moment they sign in (from 2026-11-20; the
// sign-in and profile pages say so) so the site's owner can reach them. Seen
// only in the owner's console. Separately, a reader may ask for occasional
// announcements (book clubs, conferences); that list is opt-in and nothing
// is sent to anyone who has not ticked it.

export interface Contact { email: string; at: string; }
const ANNOUNCE = 'acct:announce';
const memAnnounce = new Set<string>();

export async function recordContact(sub: string, email: string): Promise<void> {
  const clean = email.trim().slice(0, 254);
  if (!/^[^\s@]+@[^\s@]+$/.test(clean)) return;
  await write(k(sub, 'contact'), { email: clean, at: new Date().toISOString() } satisfies Contact);
}

export async function getContact(sub: string): Promise<Contact | null> {
  return read<Contact | null>(k(sub, 'contact'), null);
}

export async function getAnnounce(sub: string): Promise<boolean> {
  const kv = getKV();
  if (!kv) return memAnnounce.has(sub);
  return (await kv.sismember(ANNOUNCE, ref(sub))) === 1;
}

export async function setAnnounce(sub: string, on: boolean): Promise<void> {
  const kv = getKV();
  if (!kv) { if (on) memAnnounce.add(sub); else memAnnounce.delete(sub); return; }
  if (on) await kv.sadd(ANNOUNCE, ref(sub));
  else await kv.srem(ANNOUNCE, ref(sub));
}

export interface ContactRow { username: string; email: string | null; joined: number; announce: boolean; }

/** Every indexed account with its email (when kept) — the owner's console only. */
export async function contactRows(): Promise<ContactRow[]> {
  const kv = getKV();
  if (!kv) return [];
  const [flat, wants] = await Promise.all([
    kv.zrange<(string | number)[]>(IDX, 0, -1, { rev: true, withScores: true }),
    kv.smembers(ANNOUNCE),
  ]);
  const yes = new Set(wants as string[]);
  const refs: { sub: string; at: number; member: string }[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    const sub = unref(flat[i]);
    if (sub) refs.push({ sub, at: Number(flat[i + 1]), member: String(flat[i]) });
  }
  const rows = await Promise.all(refs.slice(0, 500).map(async ({ sub, at, member }) => {
    const [profile, contact] = await Promise.all([
      read<Profile | null>(k(sub, 'profile'), null),
      getContact(sub),
    ]);
    return profile ? { username: profile.username, email: contact?.email ?? null, joined: at, announce: yes.has(member) } : null;
  }));
  return rows.filter((r): r is ContactRow => r !== null);
}

// ── Profile ─────────────────────────────────────────────────────────────
// A signed-in reader's handle on the site: a username, random until they pick
// one. No picture, and nothing about readers is shown to other readers; the
// Google name and photo are never kept, and the email is seen by the owner
// only (see Contact above).

export interface Profile {
  username: string;
  createdAt: string;
}

const unameKey = (name: string) => `uname:${name.toLowerCase()}`;

// Google account ids are ~21-digit numeric strings. The Upstash client
// JSON-parses what it reads back, so a bare id stored as a value or a
// sorted-set member returns as a Number and loses its low digits. Wherever an
// id is stored as data (not as part of a key) it carries this prefix.
const ref = (sub: string) => `u:${sub}`;
const unref = (v: unknown): string | null =>
  typeof v === 'string' && v.startsWith('u:') ? v.slice(2) : null;

const RESERVED = new Set([
  'admin', 'administrator', 'moderator', 'support', 'centerstudy', 'center_study',
  'adam', 'katz', 'adamkatz', 'adam_katz', 'bouvard', 'dennisbouvard', 'dennis_bouvard',
  'gans', 'ericgans', 'eric_gans', 'anonymous', 'null', 'undefined',
]);

/** null when valid, otherwise the reason — shown to the reader as-is. */
export function usernameProblem(name: string): string | null {
  if (name.length < 3 || name.length > 20) return 'Use 3 to 20 characters.';
  if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(name)) return 'Start with a letter; then letters, numbers or underscores only.';
  if (RESERVED.has(name.toLowerCase())) return 'That name is reserved.';
  return null;
}

// Pronounceable but meaningless: consonant-vowel pairs ("kovimeda").
function randomUsername(): string {
  const c = 'bdfgklmnprstvz', v = 'aeiou';
  let out = '';
  for (let i = 0; i < 4; i++) {
    out += c[Math.floor(Math.random() * c.length)] + v[Math.floor(Math.random() * v.length)];
  }
  return out;
}

/** Claim a username for this account. False when someone else holds it. */
async function claimUsername(sub: string, name: string): Promise<boolean> {
  const key = unameKey(name);
  const kv = getKV();
  if (!kv) {
    if (!devFallback()) return false;
    const holder = mem.get(key);
    if (holder && holder !== sub) return false;
    mem.set(key, sub);
    return true;
  }
  const ok = await kv.set(key, ref(sub), { nx: true });
  if (ok) return true;
  return unref(await kv.get<string>(key)) === sub;
}

/** The reader's profile — created with a random username the first time. */
export async function getProfile(sub: string): Promise<Profile> {
  const existing = await read<Profile | null>(k(sub, 'profile'), null);
  if (existing && existing.username) {
    // Backfill: accounts created before the signup index existed enter it
    // with their real creation date the next time they sign in.
    await indexAccount(sub, Date.parse(existing.createdAt) || Date.now());
    return existing;
  }
  let username = randomUsername();
  for (let i = 0; i < 6 && !(await claimUsername(sub, username)); i++) username = randomUsername();
  const profile: Profile = { username, createdAt: new Date().toISOString() };
  await write(k(sub, 'profile'), profile);
  await indexAccount(sub, Date.now());
  return profile;
}

/** Change username. Returns the problem as text, or null on success. */
export async function setUsername(sub: string, name: string): Promise<string | null> {
  const problem = usernameProblem(name);
  if (problem) return problem;
  const profile = await getProfile(sub);
  if (profile.username === name) return null;
  const sameName = profile.username.toLowerCase() === name.toLowerCase();
  if (!sameName && !(await claimUsername(sub, name))) return 'That username is taken.';
  if (!sameName) await remove(unameKey(profile.username));
  await write(k(sub, 'profile'), { ...profile, username: name });
  return null;
}

export async function subForUsername(name: string): Promise<string | null> {
  const kv = getKV();
  if (!kv) return devFallback() ? ((mem.get(unameKey(name)) as string) ?? null) : null;
  return unref(await kv.get<string>(unameKey(name)));
}

// ── Engagement ──────────────────────────────────────────────────────────
// One number per signed-in reader, built from three things they did:
// minutes spent reading, distinct searches run, idioms saved.

export interface Stats { readSec: number; searches: number; idioms: number; }
const NO_STATS: Stats = { readSec: 0, searches: 0, idioms: 0 };

export const getStats = async (sub: string): Promise<Stats> => ({ ...NO_STATS, ...(await read<Partial<Stats>>(k(sub, 'stats'), {})) });

/** A minute of reading = 1, a new search = 2, a saved idiom = 5. */
export function score(st: Stats): number {
  return Math.floor(st.readSec / 60) + 2 * st.searches + 5 * st.idioms;
}

async function updateStats(sub: string, change: (st: Stats) => Stats): Promise<void> {
  const next = change(await getStats(sub));
  await write(k(sub, 'stats'), next);
  await lbSet(sub, score(next));
}

export const addReadingTime = (sub: string, sec: number) =>
  updateStats(sub, (st) => ({ ...st, readSec: st.readSec + sec }));

// Engagement index: a sorted set of account ids by score. Read only by the
// owner's /study console — there is no public leaderboard.
const LB = 'lb:engaged';
const memLb = new Map<string, number>();

async function lbSet(sub: string, value: number): Promise<void> {
  const kv = getKV();
  if (!kv) { if (devFallback()) memLb.set(sub, value); return; }
  await kv.zadd(LB, { score: value, member: ref(sub) });
}

async function lbRemove(sub: string): Promise<void> {
  const kv = getKV();
  if (!kv) { memLb.delete(sub); return; }
  await kv.zrem(LB, ref(sub));
}

export interface Ranked { username: string; score: number; readSec: number; searches: number; idioms: number; }

export async function topEngaged(n: number): Promise<Ranked[]> {
  const kv = getKV();
  let subs: string[];
  if (!kv) {
    if (!devFallback()) return [];
    subs = [...memLb.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([sub]) => sub);
  } else {
    subs = (await kv.zrange<string[]>(LB, 0, n - 1, { rev: true }))
      .map(unref)
      .filter((v): v is string => v !== null);
  }
  const rows = await Promise.all(subs.map(async (sub) => {
    const [profile, st] = await Promise.all([read<Profile | null>(k(sub, 'profile'), null), getStats(sub)]);
    if (!profile) return null;
    return { username: profile.username, score: score(st), ...st };
  }));
  return rows.filter((r): r is Ranked => r !== null && r.score > 0).sort((a, b) => b.score - a.score);
}

// ── Account registry ────────────────────────────────────────────────────
// Every account, scored by creation time, so the owner's console can answer
// "are people making accounts?". Written NX on profile reads and creation;
// accounts that predate the index (added 2026-11-17) backfill with their
// profile's real createdAt — on their next sign-in, or from the engagement
// index when the console reads this. Read only on /analytics.

const IDX = 'acct:index';
const memIdx = new Map<string, number>();

async function indexAccount(sub: string, createdAtMs: number): Promise<void> {
  const kv = getKV();
  if (!kv) { if (devFallback() && !memIdx.has(sub)) memIdx.set(sub, createdAtMs); return; }
  try {
    await kv.zadd(IDX, { nx: true }, { score: createdAtMs, member: ref(sub) });
  } catch { /* best-effort — never break a profile read over the index */ }
}

async function idxRemove(sub: string): Promise<void> {
  const kv = getKV();
  if (!kv) { memIdx.delete(sub); return; }
  await kv.zrem(IDX, ref(sub));
}

export interface AccountSignup { username: string; createdAt: number; score: number; }
export interface AccountOverview {
  total: number;
  last7: number;
  last30: number;
  newest: AccountSignup[]; // newest first
}

export async function accountOverview(n: number): Promise<AccountOverview> {
  const kv = getKV();
  const now = Date.now();
  if (!kv) {
    if (!devFallback()) return { total: 0, last7: 0, last30: 0, newest: [] };
    const entries = [...memIdx.entries()].sort((a, b) => b[1] - a[1]);
    return {
      total: entries.length,
      last7: entries.filter(([, at]) => now - at < 7 * 86_400_000).length,
      last30: entries.filter(([, at]) => now - at < 30 * 86_400_000).length,
      newest: [],
    };
  }

  // Backfill pass: any engaged account missing from the index enters it with
  // its profile's real creation date, so the count is complete from the
  // first read (dormant zero-score accounts join when they next sign in).
  try {
    const [idxMembers, lbMembers] = await Promise.all([
      kv.zrange<string[]>(IDX, 0, -1),
      kv.zrange<string[]>(LB, 0, -1),
    ]);
    const have = new Set(idxMembers);
    const missing = lbMembers
      .filter((m) => !have.has(m))
      .map(unref)
      .filter((v): v is string => v !== null)
      .slice(0, 50);
    for (const sub of missing) {
      const profile = await read<Profile | null>(k(sub, 'profile'), null);
      if (profile) await indexAccount(sub, Date.parse(profile.createdAt) || now);
    }
  } catch { /* backfill is opportunistic */ }

  const flat = await kv.zrange<(string | number)[]>(IDX, 0, -1, { rev: true, withScores: true });
  let total = 0, last7 = 0, last30 = 0;
  const newestRefs: { sub: string; at: number }[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    const sub = unref(flat[i]);
    const at = Number(flat[i + 1]);
    if (!sub || !Number.isFinite(at)) continue;
    total += 1;
    if (now - at < 7 * 86_400_000) last7 += 1;
    if (now - at < 30 * 86_400_000) last30 += 1;
    if (newestRefs.length < n) newestRefs.push({ sub, at });
  }
  const newest = (
    await Promise.all(newestRefs.map(async ({ sub, at }) => {
      const [profile, st] = await Promise.all([read<Profile | null>(k(sub, 'profile'), null), getStats(sub)]);
      return profile ? { username: profile.username, createdAt: at, score: score(st) } : null;
    }))
  ).filter((r): r is AccountSignup => r !== null);
  return { total, last7, last30, newest };
}

// ── Feedback ────────────────────────────────────────────────────────────
// Notes readers send from the Feedback button; read back on /study only.

export interface Feedback { text: string; page: string; at: string; username: string | null; }
const FEEDBACK = 'feedback:list';
const memFeedback: Feedback[] = [];

export async function addFeedback(f: Feedback): Promise<void> {
  const kv = getKV();
  if (!kv) { if (devFallback()) memFeedback.unshift(f); return; }
  await kv.lpush(FEEDBACK, JSON.stringify(f));
  await kv.ltrim(FEEDBACK, 0, 499);
}

export async function recentFeedback(n: number): Promise<Feedback[]> {
  const kv = getKV();
  if (!kv) return devFallback() ? memFeedback.slice(0, n) : [];
  const raw = await kv.lrange<Feedback | string>(FEEDBACK, 0, n - 1);
  return raw.map((v) => (typeof v === 'string' ? (JSON.parse(v) as Feedback) : v));
}
