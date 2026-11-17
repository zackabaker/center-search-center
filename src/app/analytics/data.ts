import { Redis } from '@upstash/redis';
import { getPostBySlug } from '@/lib/parser';

// Data layer for /analytics, the owner's private console. Pulls every
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
  readsMine: number; // owner's own reads (":mine" shadow counter)
  follows: number;
  returns: number;
};

export type TermRow = { q: string; n: number };
export type TopPost = { slug: string; title: string; source: string; n: number };
export type SearchHit = { q: string; mode: string; mine: boolean; t: number; sid?: string; n?: number };
export type BeginHit = {
  id: string;          // saved path id → /begin/p/<id>
  interests: string[];
  text?: string;       // the visitor's free-text background (capped at write)
  n: number;           // texts in the generated path
  fb: boolean;         // true when the model failed and top-score fallback ran
  mine: boolean;
  sid?: string;
  t: number;
};
export type PeopleHit = { q: string; t: number; mine: boolean; sid?: string; term: string };
export type AskHit = {
  q: string;
  a: string;           // the AI's answer (capped at write; aLen holds full length)
  aLen?: number;
  cut?: boolean;       // answer hit max_tokens
  concept?: string;    // asked from a concept page
  fresh?: boolean;     // explicit regenerate
  t: number;
};

export type SessionEvent = {
  t: number;
  type: 'page' | 'search' | 'read' | 'follow' | 'begin';
  label: string;
  href?: string;
  mode?: string;
};

export type ReadHit = { title: string; href?: string; t: number; sid?: string };
export type SearchDay = {
  day: string;   // YYYY-MM-DD in ET — the day as the owner experiences it
  n: number;
  nAsk: number;
  sids: number;  // distinct searcher tabs that day (0 = none carried an id)
  items: SearchHit[]; // chronological within the day
};

export type SessionView = {
  id: string;
  sid?: string; // the raw tab id — several episodes can share one (live only)
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
  peopleHits: PeopleHit[];
  searchDays: SearchDay[]; // readers' searches, day by day (ET), newest first
  recentReads: ReadHit[];  // the last texts actually read (≥50% + ≥90s)
  beginPaths: BeginHit[]; // generated reading paths (/begin), newest first
  askAnswers: AskHit[];   // recent Ask Q+A pairs (ask:log), newest first
  engaged7: number;       // distinct visitor sids, last 7d, ≥2 events or a referrer
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

function buildSessions(activity: RawActivity[], searches: RawSearch[], begins: BeginHit[]): SessionView[] {
  const bySid = new Map<string, { a: RawActivity[]; s: RawSearch[]; b: BeginHit[] }>();
  for (const e of activity) {
    const g = bySid.get(e.sid) ?? { a: [], s: [], b: [] };
    g.a.push(e);
    bySid.set(e.sid, g);
  }
  for (const e of searches) {
    if (!e.sid) continue;
    const g = bySid.get(e.sid) ?? { a: [], s: [], b: [] };
    g.s.push(e);
    bySid.set(e.sid, g);
  }
  for (const e of begins) {
    if (!e.sid) continue;
    const g = bySid.get(e.sid) ?? { a: [], s: [], b: [] };
    g.b.push(e);
    bySid.set(e.sid, g);
  }

  // A tab's sid lives in sessionStorage, which survives tab restores — a
  // phone tab reopened over a week stitches into one "169-hour visit". So a
  // session here is an EPISODE: one sid's events with no half-hour silence
  // inside. Each episode gets its own card, duration and score.
  const EPISODE_GAP = 30 * 60_000;
  type Raw = { t: number; a?: RawActivity; s?: RawSearch; b?: BeginHit };

  const out: SessionView[] = [];
  for (const [sid, g] of bySid) {
    const stream: Raw[] = [
      ...g.a.map((a): Raw => ({ t: a.t, a })),
      ...g.s.map((s): Raw => ({ t: s.t, s })),
      ...g.b.map((b): Raw => ({ t: b.t, b })),
    ].sort((x, y) => x.t - y.t);

    const episodes: Raw[][] = [];
    let cur: Raw[] = [];
    for (const r of stream) {
      if (cur.length > 0 && r.t - cur[cur.length - 1].t > EPISODE_GAP) {
        episodes.push(cur);
        cur = [];
      }
      cur.push(r);
    }
    if (cur.length > 0) episodes.push(cur);

    episodes.forEach((ep, epIdx) => {
      const events: SessionEvent[] = [];
      let ref: string | undefined;
      const readPaths = new Set<string>();
      const postPaths = new Set<string>();
      const follows: string[] = [];
      const terms = new Set<string>();
      let pages = 0;
      let nSearches = 0;
      let nBegins = 0;
      let mine = false;
      // First-visit / returning signals (ev 'new' / 'return:<gap>' from
      // ConvertTracker's trail mirror) become badges, not timeline rows.
      let firstVisit = false;
      let returnGap: number | null = null;

      for (const r of ep) {
        if (r.a) {
          const e = r.a;
          if (e.mine) mine = true;
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
            } else if (e.ev === 'new') {
              firstVisit = true;
            } else if (e.ev.startsWith('return:')) {
              const gap = Number(e.ev.slice('return:'.length));
              if (Number.isFinite(gap)) returnGap = gap;
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
        } else if (r.s) {
          if (r.s.mine) mine = true;
          nSearches += 1;
          const term = watchTerm(r.s.q);
          if (term) terms.add(term);
          events.push({ t: r.s.t, type: 'search', label: r.s.q, mode: r.s.mode ?? 'keyword' });
        } else if (r.b) {
          if (r.b.mine) mine = true;
          nBegins += 1;
          events.push({
            t: r.b.t, type: 'begin',
            label: r.b.text ? `“${r.b.text}”` : r.b.interests.length ? r.b.interests.join(', ') : 'reading path',
            href: `/begin/p/${r.b.id}`,
          });
        }
      }
      if (events.length === 0) return;

      const start = events[0].t;
      const end = events[events.length - 1].t;
      const mins = Math.round((end - start) / 60_000);
      const texts = readPaths.size > 0 ? readPaths.size : postPaths.size;
      const crawler = (pages > 60 && nSearches === 0) || pages > 300;

      const badges: string[] = [];
      if (mine) badges.push('you');
      if (crawler) badges.push('likely crawler');
      if (firstVisit) badges.push('first visit');
      if (returnGap !== null) badges.push(`returning · ${returnGap}d`);
      if (nBegins > 0) badges.push('generated path');
      if (mins >= 20 && events.length >= 8) badges.push('deep session');
      for (const term of terms) badges.push(`looked up: ${term}`);
      for (const dest of new Set(follows)) badges.push(`followed ${dest}`);

      let score =
        nSearches * 3 + texts * 4 + pages * 0.5 + Math.min(mins, 180) / 10 +
        terms.size * 12 + follows.length * 8 + nBegins * 15;
      if (crawler) score -= 40;
      if (mine) score -= 25;

      out.push({
        id: episodes.length > 1 ? `${sid}-${epIdx + 1}` : sid,
        sid, kind: 'live', start, end, mins, mine, crawler, ref,
        pages, texts, searches: nSearches, badges, score,
        events: events.slice(0, 120), eventsTotal: events.length,
      });
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

  // 90 day rows so the trends panel can show month-over-month; the tiles and
  // the day table slice the newest 30.
  const DAYS = 90;
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
  pb.lrange('begin:log', 0, 1999);
  pb.lrange('ask:log', 0, 149);

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
  const beginPaths = parseRows((rb[8] as unknown[]) ?? [])
    .filter((e) => typeof e.id === 'string' && typeof e.t === 'number')
    .map((e) => ({
      id: e.id as string,
      interests: Array.isArray(e.interests)
        ? (e.interests as unknown[]).filter((x): x is string => typeof x === 'string')
        : [],
      text: typeof e.text === 'string' ? e.text : undefined,
      n: typeof e.n === 'number' ? e.n : 0,
      fb: e.fb === true,
      mine: e.mine === true,
      sid: typeof e.sid === 'string' ? e.sid : undefined,
      t: e.t as number,
    })) as BeginHit[];
  const askAnswers = parseRows((rb[9] as unknown[]) ?? [])
    .filter((e) => typeof e.q === 'string' && typeof e.a === 'string' && typeof e.t === 'number')
    .map((e) => ({
      q: e.q as string,
      a: e.a as string,
      aLen: typeof e.aLen === 'number' ? e.aLen : undefined,
      cut: e.cut === true || undefined,
      concept: typeof e.concept === 'string' ? e.concept : undefined,
      fresh: e.fresh === true || undefined,
      t: e.t as number,
    })) as AskHit[];

  // Engaged visitors, last 7 days: distinct non-owner sids that either came
  // from somewhere (a referrer) or did more than one thing. The headline
  // "visitors" aggregate counts every tab that executed JS — including bots
  // that run a browser — so most single-event, referrer-less sids are noise.
  // This is the floor estimate of real people; the aggregate is the ceiling.
  const engagedCutoff = Date.now() - 7 * 86_400_000;
  const sidStats = new Map<string, { n: number; ref: boolean }>();
  for (const a of activityLog) {
    if (a.mine || a.t < engagedCutoff) continue;
    const row = sidStats.get(a.sid) ?? { n: 0, ref: false };
    row.n += 1;
    if (a.ref) row.ref = true;
    sidStats.set(a.sid, row);
  }
  let engaged7 = 0;
  for (const row of sidStats.values()) {
    if (row.n >= 2 || row.ref) engaged7 += 1;
  }

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
      readsMine: num(conv['read:mine']),
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

  const peopleHits: PeopleHit[] = [];
  for (const s of searchLog) {
    const term = watchTerm(s.q);
    if (!term) continue;
    peopleHits.push({ q: s.q, t: s.t, mine: s.mine, sid: s.sid, term });
    if (peopleHits.length >= 80) break;
  }

  // Readers' searches, grouped by ET day — the owner reads this console in ET,
  // so "yesterday" should mean his yesterday, not UTC's. His own searches are
  // left out entirely (they're noise in "what are readers looking for").
  const etDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }); // YYYY-MM-DD
  const byDay = new Map<string, SearchDay>();
  const sidsByDay = new Map<string, Set<string>>();
  for (const s of searchLog) {
    if (s.mine) continue;
    const day = etDay.format(s.t);
    let row = byDay.get(day);
    if (!row) {
      if (byDay.size >= 14) continue; // newest-first log → first 14 distinct days
      row = { day, n: 0, nAsk: 0, sids: 0, items: [] };
      byDay.set(day, row);
      sidsByDay.set(day, new Set());
    }
    row.n += 1;
    if (s.mode === 'ask') row.nAsk += 1;
    if (s.sid) sidsByDay.get(day)?.add(s.sid);
    if (row.items.length < 120) row.items.push(s);
  }
  const searchDays = [...byDay.values()];
  for (const d of searchDays) {
    d.sids = sidsByDay.get(d.day)?.size ?? 0;
    d.items.reverse(); // chronological within the day
  }

  // The last texts actually read, newest first — read = ≥50% depth and ≥90s.
  const recentReads: ReadHit[] = [];
  for (const a of activityLog) {
    if (a.ev !== 'read' || a.mine) continue;
    const p = postTitle(a.path);
    recentReads.push({
      title: p?.label ?? a.path,
      href: CLEAN_PATH.test(a.path) ? p?.href ?? a.path : undefined,
      t: a.t,
      sid: a.sid,
    });
    if (recentReads.length >= 12) break;
  }

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
  const live = buildSessions(activityLog, searchLog, beginPaths);
  const legacy = buildLegacySessions(searchLog);
  const sessions = [...live, ...legacy].sort((a, b) => b.score - a.score).slice(0, 150);

  return {
    generatedAt: Date.now(),
    days,
    weeklySearches,
    searchTotal: num(rb[1]),
    viewTotal: num(rb[2]),
    termsAll,
    peopleHits,
    searchDays,
    recentReads,
    beginPaths: beginPaths.slice(0, 60),
    askAnswers: askAnswers.slice(0, 40),
    engaged7,
    topRecent,
    topAll,
    sessions,
    activitySince,
  };
}
