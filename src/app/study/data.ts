import { Redis } from '@upstash/redis';
import { getPostBySlug } from '@/lib/parser';

// Data layer for /study, the owner's private analytics console. Pulls every
// store the site writes — the durable daily aggregates (activity:day:*,
// search:day:*, convert:*), the all-time counters and ZSETs, and the two
// capped raw logs — and shapes them for one server render. Gated upstream in
// src/proxy.ts; nothing here is reachable without the key.

function getKV(): Redis | null {
  const url =
    process.env.centerstudy_KV_REST_API_URL ||
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.centerstudy_KV_REST_API_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export type DayRow = {
  day: string; // YYYY-MM-DD (UTC, matching every ingest key)
  views: number | null; // null = before activity logging began
  viewsMine: number;
  uniq: number | null;
  searches: number;
  searchesMine: number;
  opens: number;
  reads: number;
  follows: number;
  returns: number;
};

export type TermRow = { q: string; n: number };
export type TopPost = { slug: string; title: string; source: string; n: number };
export type SearchHit = { q: string; mode: string; mine: boolean; t: number; sid?: string; n?: number };
export type PeopleHit = { q: string; t: number; mine: boolean; sid?: string; term: string };

export type SessionEvent = {
  t: number;
  type: 'page' | 'search' | 'read' | 'follow';
  label: string;
  href?: string;
  mode?: string;
};

export type SessionView = {
  id: string;
  kind: 'live' | 'legacy'; // legacy = pre-sid, reconstructed from search bursts
  start: number;
  end: number;
  mins: number;
  mine: boolean;
  crawler: boolean;
  ref?: string;
  pages: number;
  texts: number;
  searches: number;
  badges: string[];
  score: number;
  events: SessionEvent[];
  eventsTotal: number;
};

export type StudyData = {
  generatedAt: number;
  days: DayRow[]; // newest first, 30 rows
  weeklySearches: { week: string; n: number; mine: number }[]; // oldest first
  searchTotal: number;
  viewTotal: number;
  termsAll: TermRow[];
  termsRecent: TermRow[]; // last 7 days, from the raw log
  zeroResult: SearchHit[];
  peopleHits: PeopleHit[];
  recentSearches: SearchHit[];
  topRecent: TopPost[]; // rolling two-month window
  topAll: TopPost[];
  sessions: SessionView[];
  activitySince: string; // first day with activity data
};

const SOURCE_LABEL: Record<string, string> = {
  substack: 'Substack', gablog: 'GABlog', book: 'Anthropomorphics', pdf: 'Essay',
  reddit: 'Thread', twitter: 'Thread', chronicle: 'Chronicle', ap: 'Anthropoetics', lecture: 'Lecture',
};

// People the owner watches for in queries — his own names first, then the
// GA-blogosphere figures readers look up. Longest match wins so "zack baker"
// doesn't double-report as "zack".
const PEOPLE_WATCH = [
  'zack baker', 'zachary baker', 'dennis bouvard', 'adam katz', 'eric gans',
  'nick land', 'bouvard', 'katz', 'gans', 'zack', 'baker', 'taimur',
  'truepeers', 'carlson', 'xenosystems', 'vassar', 'moldbug', 'yarvin', 'pablo',
].sort((a, b) => b.length - a.length);

function watchTerm(q: string): string | null {
  const norm = q.toLowerCase();
  for (const term of PEOPLE_WATCH) {
    if (new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(norm)) return term;
  }
  return null;
}

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function parseRows(rows: unknown[]): Record<string, unknown>[] {
  return rows
    .map((r) => {
      try { return typeof r === 'string' ? JSON.parse(r) : r; } catch { return null; }
    })
    .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object');
}

function utcDay(offset: number): string {
  return new Date(Date.now() - offset * 86_400_000).toISOString().slice(0, 10);
}

function postTitle(path: string): { label: string; href?: string } | null {
  if (!path.startsWith('/post/')) return null;
  const slug = path.split('/')[2] ?? '';
  const post = slug ? getPostBySlug(slug) : null;
  return post ? { label: post.title, href: `/post/${slug}` } : { label: path, href: path };
}

const CLEAN_PATH = /^\/(?![/\\])/;

type RawActivity = { sid: string; path: string; mine?: boolean; ref?: string; ev?: string; t: number };
type RawSearch = { q: string; mode: string; mine: boolean; n?: number; sid?: string; t: number };

function buildSessions(activity: RawActivity[], searches: RawSearch[]): SessionView[] {
  const bySid = new Map<string, { a: RawActivity[]; s: RawSearch[] }>();
  for (const e of activity) {
    const g = bySid.get(e.sid) ?? { a: [], s: [] };
    g.a.push(e);
    bySid.set(e.sid, g);
  }
  for (const e of searches) {
    if (!e.sid) continue;
    const g = bySid.get(e.sid) ?? { a: [], s: [] };
    g.s.push(e);
    bySid.set(e.sid, g);
  }

  const out: SessionView[] = [];
  for (const [sid, g] of bySid) {
    const events: SessionEvent[] = [];
    let ref: string | undefined;
    const readPaths = new Set<string>();
    const postPaths = new Set<string>();
    const follows: string[] = [];
    let pages = 0;
    for (const e of g.a) {
      if (e.ref && !ref) ref = e.ref;
      if (e.ev) {
        if (e.ev === 'read') {
          readPaths.add(e.path);
          const p = postTitle(e.path);
          events.push({ t: e.t, type: 'read', label: p?.label ?? e.path, href: CLEAN_PATH.test(e.path) ? p?.href ?? e.path : undefined });
        } else if (e.ev.startsWith('follow')) {
          const [, dest, where] = e.ev.split(':');
          follows.push(dest ?? 'out');
          events.push({ t: e.t, type: 'follow', label: `followed ${dest ?? 'out'}${where ? ` (${where})` : ''}` });
        }
        continue;
      }
      pages += 1;
      if (e.path.startsWith('/post/')) postPaths.add(e.path);
      const p = postTitle(e.path);
      events.push({
        t: e.t, type: 'page',
        label: p?.label ?? e.path,
        href: CLEAN_PATH.test(e.path) ? (p?.href ?? e.path) : undefined,
      });
    }
    for (const s of g.s) {
      events.push({ t: s.t, type: 'search', label: s.q, mode: s.mode ?? 'keyword' });
    }
    events.sort((a, b) => a.t - b.t);
    if (events.length === 0) continue;

    const start = events[0].t;
    const end = events[events.length - 1].t;
    const mins = Math.round((end - start) / 60_000);
    const mine = g.a.some((e) => e.mine) || g.s.some((e) => e.mine);
    const texts = readPaths.size > 0 ? readPaths.size : postPaths.size;
    const nSearches = g.s.length;
    const crawler = (pages > 60 && nSearches === 0) || pages > 300;

    const badges: string[] = [];
    if (mine) badges.push('you');
    if (crawler) badges.push('likely crawler');
    if (mins >= 20 && events.length >= 8) badges.push('deep session');
    const terms = new Set<string>();
    for (const s of g.s) {
      const term = watchTerm(s.q);
      if (term) terms.add(term);
    }
    for (const term of terms) badges.push(`looked up: ${term}`);
    for (const dest of new Set(follows)) badges.push(`followed ${dest}`);

    let score =
      nSearches * 3 + texts * 4 + pages * 0.5 + Math.min(mins, 180) / 10 +
      terms.size * 12 + follows.length * 8;
    if (crawler) score -= 40;
    if (mine) score -= 25;

    out.push({
      id: sid, kind: 'live', start, end, mins, mine, crawler, ref,
      pages, texts, searches: nSearches, badges, score,
      events: events.slice(0, 120), eventsTotal: events.length,
    });
  }
  return out;
}

// Pre-sid history: the search log is the only timestamped store, so old
// sessions are reconstructed the way the owner's analysis always did it —
// bursts split on 10-minute gaps. Searches only; no page trail exists.
function buildLegacySessions(searches: RawSearch[]): SessionView[] {
  const noSid = searches.filter((s) => !s.sid).sort((a, b) => a.t - b.t);
  const bursts: RawSearch[][] = [];
  let cur: RawSearch[] = [];
  for (const e of noSid) {
    if (cur.length && e.t - cur[cur.length - 1].t > 600_000) {
      bursts.push(cur);
      cur = [];
    }
    cur.push(e);
  }
  if (cur.length) bursts.push(cur);

  const out: SessionView[] = [];
  for (const b of bursts) {
    const terms = new Set<string>();
    for (const s of b) {
      const term = watchTerm(s.q);
      if (term) terms.add(term);
    }
    if (b.length < 2 && terms.size === 0) continue; // singles with nothing notable
    const start = b[0].t;
    const end = b[b.length - 1].t;
    const mins = Math.round((end - start) / 60_000);
    const mine = b.some((e) => e.mine);
    const badges: string[] = ['pre-ID era'];
    if (mine) badges.push('you');
    if (mins >= 20 && b.length >= 6) badges.push('deep session');
    for (const term of terms) badges.push(`looked up: ${term}`);
    let score = b.length * 3 + Math.min(mins, 180) / 10 + terms.size * 12 - 5;
    if (mine) score -= 25;
    out.push({
      id: `legacy-${start}`, kind: 'legacy', start, end, mins, mine, crawler: false,
      pages: 0, texts: 0, searches: b.length, badges, score,
      events: b.slice(0, 120).map((s) => ({ t: s.t, type: 'search' as const, label: s.q, mode: s.mode ?? 'keyword' })),
      eventsTotal: b.length,
    });
  }
  return out;
}

export async function fetchStudyData(): Promise<StudyData | null> {
  const kv = getKV();
  if (!kv) return null;

  const DAYS = 30;
  const dayKeys = Array.from({ length: DAYS }, (_, i) => utcDay(i));

  // Pipeline A: fixed-order per-day reads (4 commands per day).
  const pa = kv.pipeline();
  for (const d of dayKeys) {
    pa.hgetall(`convert:${d}`);
    pa.hgetall(`activity:day:${d}`);
    pa.hgetall(`search:day:${d}`);
    pa.pfcount(`activity:uniq:${d}`);
  }

  // Pipeline B: everything else. The month key is anchored to day 1 —
  // setUTCMonth on a day-of-month the target month lacks (e.g. Oct 31 → Sep)
  // rolls forward and would silently double-count the current month.
  const monthKey = (off: number) => {
    const now = new Date();
    const dt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + off, 1));
    return `views:counts:${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}`;
  };
  const pb = kv.pipeline();
  pb.zrange('search:terms', 0, 59, { rev: true, withScores: true });
  pb.get('search:total');
  pb.get('views:total');
  pb.zrange('views:counts', 0, 24, { rev: true, withScores: true });
  pb.zrange(monthKey(0), 0, 49, { rev: true, withScores: true });
  pb.zrange(monthKey(-1), 0, 49, { rev: true, withScores: true });
  pb.lrange('search:log', 0, 4999);
  pb.lrange('activity:log', 0, 11999);

  let ra: unknown[];
  let rb: unknown[];
  try {
    [ra, rb] = await Promise.all([pa.exec(), pb.exec()]);
  } catch {
    return null;
  }

  // --- raw logs ---
  const searchLog = parseRows((rb[6] as unknown[]) ?? [])
    .filter((e) => typeof e.q === 'string' && typeof e.t === 'number')
    .map((e) => ({
      q: e.q as string,
      mode: typeof e.mode === 'string' ? e.mode : 'keyword',
      mine: e.mine === true,
      n: typeof e.n === 'number' ? e.n : undefined,
      sid: typeof e.sid === 'string' ? e.sid : undefined,
      t: e.t as number,
    })) as RawSearch[];
  const activityLog = parseRows((rb[7] as unknown[]) ?? [])
    .filter((e) => typeof e.sid === 'string' && typeof e.path === 'string' && typeof e.t === 'number')
    .map((e) => ({
      sid: e.sid as string,
      path: e.path as string,
      mine: e.mine === true,
      ref: typeof e.ref === 'string' ? e.ref : undefined,
      ev: typeof e.ev === 'string' ? e.ev : undefined,
      t: e.t as number,
    })) as RawActivity[];

  // Searches-per-day fallback before search:day existed, computed from the
  // retained raw log.
  const logByDay = new Map<string, { n: number; mine: number }>();
  for (const s of searchLog) {
    const d = new Date(s.t).toISOString().slice(0, 10);
    const row = logByDay.get(d) ?? { n: 0, mine: 0 };
    row.n += 1;
    if (s.mine) row.mine += 1;
    logByDay.set(d, row);
  }

  // --- daily table ---
  const days: DayRow[] = dayKeys.map((day, i) => {
    const conv = (ra[i * 4] as Record<string, unknown> | null) ?? {};
    const act = (ra[i * 4 + 1] as Record<string, unknown> | null) ?? {};
    const sday = (ra[i * 4 + 2] as Record<string, unknown> | null) ?? {};
    const uniq = num(ra[i * 4 + 3]);
    const hasActivity = Object.keys(act).length > 0;
    const fromLog = logByDay.get(day);
    return {
      day,
      views: hasActivity ? num(act.views) : null,
      viewsMine: num(act['views:mine']),
      uniq: hasActivity ? uniq : null,
      // max() rather than prefer-aggregate: on the deploy day the aggregate
      // only counts post-deploy searches while the retained log has the
      // whole day; the two sources count the same events, never summed.
      searches: Math.max(num(sday.n), fromLog?.n ?? 0),
      searchesMine: Math.max(num(sday.mine), fromLog?.mine ?? 0),
      opens: num(conv.open),
      reads: num(conv.read),
      follows: num(conv.follow),
      returns: num(conv.return),
    };
  });
  const activitySince = [...days].reverse().find((d) => d.views !== null)?.day ?? dayKeys[0];

  // --- weekly search history (full retained log) ---
  const weekOf = (t: number) => {
    const d = new Date(t);
    const dow = (d.getUTCDay() + 6) % 7; // Monday = 0
    return new Date(t - dow * 86_400_000).toISOString().slice(0, 10);
  };
  const weekly = new Map<string, { n: number; mine: number }>();
  for (const s of searchLog) {
    const w = weekOf(s.t);
    const row = weekly.get(w) ?? { n: 0, mine: 0 };
    row.n += 1;
    if (s.mine) row.mine += 1;
    weekly.set(w, row);
  }
  const weeklySearches = [...weekly.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([week, v]) => ({ week, n: v.n, mine: v.mine }));

  // --- terms ---
  const toTerms = (raw: unknown): TermRow[] => {
    const arr = (raw as (string | number)[]) ?? [];
    const out: TermRow[] = [];
    for (let i = 0; i < arr.length; i += 2) {
      const q = String(arr[i]);
      const n = num(arr[i + 1]);
      if (/^__.*__$/.test(q) || q.length < 2) continue;
      out.push({ q, n });
    }
    return out;
  };
  const termsAll = toTerms(rb[0]).slice(0, 40);

  const weekAgo = Date.now() - 7 * 86_400_000;
  const recentCounts = new Map<string, number>();
  for (const s of searchLog) {
    if (s.t < weekAgo || s.mine) continue;
    const norm = s.q.toLowerCase().replace(/\s+/g, ' ').trim();
    if (norm.length < 2) continue;
    recentCounts.set(norm, (recentCounts.get(norm) ?? 0) + 1);
  }
  const termsRecent = [...recentCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([q, n]) => ({ q, n }));

  // --- zero-result + people + recent stream ---
  const seenZero = new Set<string>();
  const zeroResult: SearchHit[] = [];
  for (const s of searchLog) {
    if (s.n !== 0 || s.mine) continue;
    const norm = s.q.toLowerCase().trim();
    if (seenZero.has(norm)) continue;
    seenZero.add(norm);
    zeroResult.push(s);
    if (zeroResult.length >= 25) break;
  }

  const peopleHits: PeopleHit[] = [];
  for (const s of searchLog) {
    const term = watchTerm(s.q);
    if (!term) continue;
    peopleHits.push({ q: s.q, t: s.t, mine: s.mine, sid: s.sid, term });
    if (peopleHits.length >= 80) break;
  }

  const recentSearches = searchLog.slice(0, 60);

  // --- top content ---
  const toTop = (raw: unknown, cap: number): TopPost[] => {
    const arr = (raw as (string | number)[]) ?? [];
    const out: TopPost[] = [];
    for (let i = 0; i < arr.length && out.length < cap; i += 2) {
      const slug = String(arr[i]);
      const post = getPostBySlug(slug);
      if (!post) continue;
      out.push({ slug, title: post.title, source: SOURCE_LABEL[post.source] ?? post.source, n: num(arr[i + 1]) });
    }
    return out;
  };
  const merged = new Map<string, number>();
  for (const raw of [rb[4], rb[5]]) {
    const arr = (raw as (string | number)[]) ?? [];
    for (let i = 0; i < arr.length; i += 2) {
      merged.set(String(arr[i]), (merged.get(String(arr[i])) ?? 0) + num(arr[i + 1]));
    }
  }
  const topRecent: TopPost[] = [...merged.entries()]
    .sort((a, b) => b[1] - a[1])
    .flatMap(([slug, n]) => {
      const post = getPostBySlug(slug);
      return post ? [{ slug, title: post.title, source: SOURCE_LABEL[post.source] ?? post.source, n }] : [];
    })
    .slice(0, 15);
  const topAll = toTop(rb[3], 15);

  // --- sessions ---
  const live = buildSessions(activityLog, searchLog);
  const legacy = buildLegacySessions(searchLog);
  const sessions = [...live, ...legacy].sort((a, b) => b.score - a.score).slice(0, 150);

  return {
    generatedAt: Date.now(),
    days,
    weeklySearches,
    searchTotal: num(rb[1]),
    viewTotal: num(rb[2]),
    termsAll,
    termsRecent,
    zeroResult,
    peopleHits,
    recentSearches,
    topRecent,
    topAll,
    sessions,
    activitySince,
  };
}
