import { getKV } from './kv';

// The Center Study account on X, archived for the owner's console
// (/analytics/x). X drives much of the site's traffic — a post that travels
// shows up as arrivals from t.co within the hour — so the console keeps each
// post with its public numbers and sets them beside the visits X sent.
//
// What this can and cannot see. It reads the X API with the app's bearer
// token (TWITTER_BEARER_TOKEN, the same one the Bouvard archive uses), which
// returns what anyone can see on a post: views, likes, reposts, replies,
// quotes, bookmarks. Link clicks and profile visits are private to the
// account and are NOT available this way. Those come from the CSV exports
// on X's own analytics page (Overview and Content, signed in as the
// account), which the owner uploads in /analytics/x: importXCsv() below.
//
// Cost. Every post returned counts against the X API plan, so the daily run
// reads only the newest hundred posts (their numbers are the ones still
// moving). The full history is read once, on request (`pages` below).
//
// Stored in the shared KV store: `x:posts` (hash, post id → XPost),
// `x:days` (hash, day → XDay), `x:acct` (hash, day → XAcctDay, from the
// Overview export) and `x:meta`. Without a store (local
// development) it lives in memory.

export const X_ACCOUNT = 'centerstudy_';
const SITE_HOSTS = /(^|\.)(center\.study|thereisnoeconomy\.com|generativeanthropology\.com)$/i;
const HISTORY_CAP = 40; // view-count readings kept per post

export const xConfigured = (): boolean => !!process.env.TWITTER_BEARER_TOKEN;

export type XPost = {
  id: string;
  t: number; // posted at, ms
  text: string;
  kind: 'post' | 'reply' | 'quote';
  v: number; // views
  l: number; // likes
  rt: number; // reposts
  rp: number; // replies
  q: number; // quotes
  b: number; // bookmarks
  /** Paths on the owner's own sites this post links to, e.g. "center.study/post/…". */
  site?: string[];
  /** View count as read on successive days, oldest first: [day, views]. */
  h?: [string, number][];
  u: number; // last refreshed, ms
  // Private numbers, present only once a Content export has been imported.
  eng?: number; // engagements
  uc?: number; // link clicks
  pv?: number; // profile visits
  de?: number; // detail expands
  nf?: number; // new follows
};

/** One day of the account as X's Overview export reports it (private). */
export type XAcctDay = {
  day: string;
  imp: number; // impressions
  eng: number; // engagements
  pv: number; // profile visits
  nf: number; // new follows
  uf: number; // unfollows
  likes: number;
  rt: number; // reposts
  rp: number; // replies
  bm: number; // bookmarks
  cp: number; // posts created
};

export type XDay = { day: string; followers: number; following: number; posts: number };
export type XMeta = { account: string; userId?: string; syncedAt?: number; fullAt?: number; importedAt?: number };
export type XSnapshot = { meta: XMeta; posts: XPost[]; days: XDay[]; acct: XAcctDay[] };

// ── Store ───────────────────────────────────────────────────────────────────
// The in-memory stand-in hangs off globalThis because route handlers and
// pages are bundled separately and would otherwise each get their own copy.
type Mem = { posts: Map<string, XPost>; days: Map<string, XDay>; acct: Map<string, XAcctDay>; meta: XMeta | null };
const g = globalThis as typeof globalThis & { __xMem?: Mem };
const mem: Mem = (g.__xMem ??= { posts: new Map(), days: new Map(), acct: new Map(), meta: null });
const POSTS = 'x:posts';
const DAYS = 'x:days';
const ACCT = 'x:acct';
const META = 'x:meta';

const parse = <T,>(v: unknown): T | null => {
  if (v && typeof v === 'object') return v as T; // Upstash already parsed it
  if (typeof v === 'string') {
    try { return JSON.parse(v) as T; } catch { return null; }
  }
  return null;
};

export async function readX(): Promise<XSnapshot | null> {
  const kv = getKV();
  if (!kv) {
    if (!mem.meta) return null;
    return { meta: mem.meta, posts: [...mem.posts.values()], days: [...mem.days.values()], acct: [...mem.acct.values()] };
  }
  const [meta, posts, days, acct] = await Promise.all([
    kv.get<XMeta | string>(META),
    kv.hgetall<Record<string, unknown>>(POSTS),
    kv.hgetall<Record<string, unknown>>(DAYS),
    kv.hgetall<Record<string, unknown>>(ACCT),
  ]);
  const m = parse<XMeta>(meta);
  if (!m) return null;
  return {
    meta: m,
    posts: Object.values(posts ?? {}).map((p) => parse<XPost>(p)).filter((p): p is XPost => !!p),
    days: Object.values(days ?? {}).map((d) => parse<XDay>(d)).filter((d): d is XDay => !!d),
    acct: Object.values(acct ?? {}).map((d) => parse<XAcctDay>(d)).filter((d): d is XAcctDay => !!d),
  };
}

async function writeX(meta: XMeta, posts: XPost[], day: XDay | null): Promise<void> {
  const kv = getKV();
  if (!kv) {
    mem.meta = meta;
    for (const p of posts) mem.posts.set(p.id, p);
    if (day) mem.days.set(day.day, day);
    return;
  }
  for (let i = 0; i < posts.length; i += 200) {
    const chunk: Record<string, string> = {};
    for (const p of posts.slice(i, i + 200)) chunk[p.id] = JSON.stringify(p);
    await kv.hset(POSTS, chunk);
  }
  if (day) await kv.hset(DAYS, { [day.day]: JSON.stringify(day) });
  await kv.set(META, JSON.stringify(meta));
}

async function existingPosts(ids: string[]): Promise<Map<string, XPost>> {
  const out = new Map<string, XPost>();
  if (ids.length === 0) return out;
  const kv = getKV();
  if (!kv) {
    for (const id of ids) {
      const p = mem.posts.get(id);
      if (p) out.set(id, p);
    }
    return out;
  }
  for (let i = 0; i < ids.length; i += 200) {
    const part = ids.slice(i, i + 200);
    const got = await kv.hmget<Record<string, unknown>>(POSTS, ...part);
    for (const id of part) {
      const p = parse<XPost>(got?.[id]);
      if (p) out.set(id, p);
    }
  }
  return out;
}

// ── X API ───────────────────────────────────────────────────────────────────
type ApiTweet = {
  id: string;
  text: string;
  created_at: string;
  public_metrics?: {
    impression_count?: number; like_count?: number; retweet_count?: number;
    reply_count?: number; quote_count?: number; bookmark_count?: number;
  };
  entities?: { urls?: { expanded_url?: string; unwound_url?: string }[] };
  referenced_tweets?: { type: string; id: string }[];
};

async function api<T>(path: string, params: Record<string, string>): Promise<T> {
  const res = await fetch(`https://api.twitter.com/2/${path}?${new URLSearchParams(params)}`, {
    headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`X API ${res.status} on ${path.split('/')[0]}`);
  return (await res.json()) as T;
}

function sitePaths(t: ApiTweet): string[] | undefined {
  const out: string[] = [];
  for (const u of t.entities?.urls ?? []) {
    const raw = u.unwound_url || u.expanded_url;
    if (!raw) continue;
    try {
      const url = new URL(raw);
      if (SITE_HOSTS.test(url.hostname)) out.push(url.hostname.replace(/^www\./, '') + url.pathname.replace(/\/$/, ''));
    } catch { /* not a URL */ }
  }
  return out.length > 0 ? [...new Set(out)] : undefined;
}

function toPost(t: ApiTweet, prev: XPost | undefined, day: string, now: number): XPost {
  const m = t.public_metrics ?? {};
  const v = m.impression_count ?? 0;
  const refs = t.referenced_tweets ?? [];
  const kind: XPost['kind'] = refs.some((r) => r.type === 'replied_to')
    ? 'reply'
    : refs.some((r) => r.type === 'quoted') ? 'quote' : 'post';
  // One reading per day; a later run the same day replaces that day's reading.
  const h = (prev?.h ?? []).filter(([d]) => d !== day);
  h.push([day, v]);
  const site = sitePaths(t);
  return {
    // Private numbers from an earlier import survive the daily refresh.
    ...(prev ? { eng: prev.eng, uc: prev.uc, pv: prev.pv, de: prev.de, nf: prev.nf } : {}),
    id: t.id,
    t: Date.parse(t.created_at),
    text: t.text.slice(0, 600),
    kind,
    v,
    l: m.like_count ?? 0,
    rt: m.retweet_count ?? 0,
    rp: m.reply_count ?? 0,
    q: m.quote_count ?? 0,
    b: m.bookmark_count ?? 0,
    ...(site ? { site } : {}),
    h: h.slice(-HISTORY_CAP),
    u: now,
  };
}

/**
 * Refresh the archive. `pages` is how many pages of a hundred posts to read,
 * newest first: 1 for the daily run, enough to reach the first post for the
 * one-time full history.
 */
export async function syncX(opts: { pages?: number } = {}): Promise<{ posts: number; followers: number; reachedEnd: boolean }> {
  if (!xConfigured()) throw new Error('X is not configured');
  const pages = Math.max(1, Math.min(opts.pages ?? 1, 40));
  const now = Date.now();
  const day = new Date(now).toISOString().slice(0, 10);

  const user = await api<{ data?: { id: string; public_metrics?: { followers_count?: number; following_count?: number; tweet_count?: number } } }>(
    `users/by/username/${X_ACCOUNT}`,
    { 'user.fields': 'public_metrics' },
  );
  if (!user.data) throw new Error('X account not found');
  const um = user.data.public_metrics ?? {};

  const fetched: ApiTweet[] = [];
  let token: string | undefined;
  let reachedEnd = false;
  for (let i = 0; i < pages; i++) {
    const page = await api<{ data?: ApiTweet[]; meta?: { next_token?: string } }>(`users/${user.data.id}/tweets`, {
      max_results: '100',
      exclude: 'retweets',
      'tweet.fields': 'id,text,created_at,public_metrics,entities,referenced_tweets',
      ...(token ? { pagination_token: token } : {}),
    });
    fetched.push(...(page.data ?? []));
    token = page.meta?.next_token;
    if (!token) { reachedEnd = true; break; }
  }

  const prev = await existingPosts(fetched.map((t) => t.id));
  const posts = fetched.map((t) => toPost(t, prev.get(t.id), day, now));
  const old = (await readMeta()) ?? undefined;
  await writeX(
    { ...old, account: X_ACCOUNT, userId: user.data.id, syncedAt: now, fullAt: reachedEnd ? now : old?.fullAt },
    posts,
    { day, followers: um.followers_count ?? 0, following: um.following_count ?? 0, posts: um.tweet_count ?? 0 },
  );
  return { posts: posts.length, followers: um.followers_count ?? 0, reachedEnd };
}

async function readMeta(): Promise<XMeta | null> {
  const kv = getKV();
  if (!kv) return mem.meta;
  return parse<XMeta>(await kv.get<XMeta | string>(META));
}

// ── Import of X's own CSV exports (private numbers) ────────────────────────
// Two files, told apart by their header row:
//   Overview: Date, Impressions, Likes, Engagements, Bookmarks, Shares,
//             New follows, Unfollows, Replies, Reposts, Profile visits, Create Post, …
//   Content:  Post id, Date, Post text, Post Link, Impressions, Likes, Engagements,
//             Bookmarks, Shares, New follows, Replies, Reposts, Profile visits,
//             Detail Expands, URL Clicks, …
// Dates read "Wed, Nov 18, 2026". Importing again overwrites the same days
// and posts, so overlapping exports are safe.

/** Minimal CSV reader: quoted fields, doubled quotes, newlines inside quotes. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const src = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.length > 1 || row[0] !== '') rows.push(row);
  return rows;
}

const csvDay = (s: string): string | null => {
  const t = Date.parse(`${s.trim()} UTC`);
  return Number.isFinite(t) ? new Date(t).toISOString().slice(0, 10) : null;
};
const int = (s: string | undefined): number => {
  const n = Number((s ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? Math.round(n) : 0;
};

export type XImportResult = { kind: 'overview' | 'content'; rows: number; from: string; to: string };

export async function importXCsv(text: string): Promise<XImportResult | string> {
  if (text.length > 4_000_000) return 'That file is too large.';
  const rows = parseCsv(text);
  if (rows.length < 2) return 'That file has no rows.';
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const col = (name: string) => head.indexOf(name);
  const now = Date.now();
  const kv = getKV();
  const old = (await readMeta()) ?? { account: X_ACCOUNT };

  if (col('post id') >= 0 && col('url clicks') >= 0) {
    const c = {
      id: col('post id'), date: col('date'), text: col('post text'), imp: col('impressions'), likes: col('likes'),
      eng: col('engagements'), bm: col('bookmarks'), nf: col('new follows'), rp: col('replies'), rt: col('reposts'),
      pv: col('profile visits'), de: col('detail expands'), uc: col('url clicks'),
    };
    const parsed = rows.slice(1)
      .map((r) => ({ r, id: (r[c.id] ?? '').trim(), day: csvDay(r[c.date] ?? '') }))
      .filter((x): x is { r: string[]; id: string; day: string } => /^\d{5,25}$/.test(x.id) && !!x.day);
    if (parsed.length === 0) return 'No posts could be read from that file.';
    const prev = await existingPosts(parsed.map((x) => x.id));
    const posts: XPost[] = parsed.map(({ r, id, day }) => {
      const p = prev.get(id);
      const priv = { eng: int(r[c.eng]), uc: int(r[c.uc]), pv: int(r[c.pv]), de: int(r[c.de]), nf: int(r[c.nf]) };
      if (p) return { ...p, ...priv };
      // Not seen by the API pull yet: build the post from the export. The
      // export gives only the day, so the time is set to midday UTC until
      // the API pull supplies the real one.
      return {
        id, t: Date.parse(`${day}T12:00:00Z`), text: (r[c.text] ?? '').slice(0, 600), kind: 'post' as const,
        v: int(r[c.imp]), l: int(r[c.likes]), rt: int(r[c.rt]), rp: int(r[c.rp]), q: 0, b: int(r[c.bm]),
        u: now, ...priv,
      };
    });
    await writeX({ ...old, account: X_ACCOUNT, importedAt: now }, posts, null);
    const days = parsed.map((x) => x.day).sort();
    return { kind: 'content', rows: posts.length, from: days[0], to: days[days.length - 1] };
  }

  if (col('unfollows') >= 0 && col('impressions') >= 0) {
    const c = {
      date: col('date'), imp: col('impressions'), likes: col('likes'), eng: col('engagements'), bm: col('bookmarks'),
      nf: col('new follows'), uf: col('unfollows'), rp: col('replies'), rt: col('reposts'), pv: col('profile visits'),
      cp: col('create post'),
    };
    const out: XAcctDay[] = [];
    for (const r of rows.slice(1)) {
      const day = csvDay(r[c.date] ?? '');
      if (!day) continue;
      out.push({
        day, imp: int(r[c.imp]), eng: int(r[c.eng]), pv: int(r[c.pv]), nf: int(r[c.nf]), uf: int(r[c.uf]),
        likes: int(r[c.likes]), rt: int(r[c.rt]), rp: int(r[c.rp]), bm: int(r[c.bm]), cp: int(r[c.cp]),
      });
    }
    if (out.length === 0) return 'No days could be read from that file.';
    if (!kv) for (const d of out) mem.acct.set(d.day, d);
    else {
      for (let i = 0; i < out.length; i += 200) {
        const chunk: Record<string, string> = {};
        for (const d of out.slice(i, i + 200)) chunk[d.day] = JSON.stringify(d);
        await kv.hset(ACCT, chunk);
      }
    }
    await writeX({ ...old, account: X_ACCOUNT, importedAt: now }, [], null);
    const days = out.map((d) => d.day).sort();
    return { kind: 'overview', rows: out.length, from: days[0], to: days[days.length - 1] };
  }

  return 'That does not look like an X analytics export (Overview or Content).';
}
