import { Redis } from '@upstash/redis';
import { getPostBySlug, getPublicPosts } from '@/lib/parser';
import { aiAgentKind, aiReferrer, isAiProduct, type AiAgentKind } from '@/lib/ai-agents';
import {
  deriveBeginFunnel, deriveCoReads, deriveLandings, deriveSearchOutcomes, deriveSourceQuality,
  readerSessions, sourceName,
  type BeginFunnel, type CoRead, type LandingRow, type Ref, type SearchOutcome, type SourceRow,
} from './derive';

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
  uniq: number | null; // every tab that ran the page's JavaScript — bots included
  // People, as best the day can be counted: sessions that produced a real
  // input (from 2026-11-18), and before that the "engaged" estimate — visits
  // that came from somewhere or did more than load one page.
  readers: number | null;
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
  weak?: boolean;      // the answer reads like "the archive doesn't cover this"
  t: number;
};

export type SessionEvent = {
  t: number;
  type: 'page' | 'search' | 'read' | 'follow' | 'begin' | 'pick';
  label: string;
  href?: string;
  mode?: string;
  n?: number; // searches: how many results came back, when known
};

export type Mover = { slug: string; label: string; cur: number; prev: number }; // views, this 7d vs the 7 before
export type CrawlerRow = {
  family: string;
  kind: AiAgentKind | null;
  d1: number;
  d7: number;
  d30: number;
  topPaths: (Ref & { n: number })[];
};
// Read depth for one text over the window: n = reader sessions that reported,
// reachXX = of those, how many got at least that far down.
export type DepthPost = {
  slug: string;
  title: string;
  n: number;
  reach50: number;
  reach75: number;
  done: number;
  lingered: number; // stayed 90s+
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
  ai?: string;          // the AI assistant that referred this visit, if any
  device?: 'm' | 'd';   // phone vs. larger (sessions since 2026-11-17)
  human?: boolean;      // produced a real input — pointer, touch, wheel or key
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
  sessions: SessionView[];    // the 150 most notable, for the explorer
  allSessions: SessionView[]; // every visit in the retained window (server-side only)
  episodes: Record<string, { id: string; start: number; end: number }[]>; // a tab's visits, by sid
  activitySince: string; // first day with activity data
  // --- "what's working / what isn't" (see derive.ts) ---
  sources: SourceRow[];
  aiRef: {
    total7: number;
    prev7: number;
    total30: number;
    byProduct: { name: string; n: number }[];
  };
  landings: LandingRow[];
  coReads: CoRead[];
  beginFunnel: BeginFunnel;
  searchOutcome: SearchOutcome; // keyword searches, last 14d
  followPosts: (Ref & { n: number })[]; // texts whose readers clicked a follow link
  movers: Mover[];
  crawlers: CrawlerRow[];
  depthPosts: DepthPost[];
  completion: { n: number; reach75: number }; // all texts, 30d
  missing: { path: string; n: number }[]; // 404s, 14d
  devices: { m: number; d: number };
  langs: { l: string; n: number }[];
  weakAsks: number;
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

// Human detection (a real input per session) went live during 2026-11-17, so
// the first complete day of it is the 18th. From then on a day's readers are
// its human sessions and a session must be human to count as a reader; before
// that both fall back to the engaged heuristic.
export const HUMAN_DAY = '2026-11-18';
export const HUMAN_EPOCH = Date.parse(`${HUMAN_DAY}T00:00:00Z`);

type RawActivity = { sid: string; path: string; mine?: boolean; ref?: string; ev?: string; d?: string; h?: boolean; t: number };
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

    // Once a tab has produced a real input it stays "human" — the flag lives
    // in sessionStorage with the sid, so later episodes inherit it.
    let sidHuman = false;

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
      let device: 'm' | 'd' | undefined;

      for (const r of ep) {
        if (r.a) {
          const e = r.a;
          if (e.mine) mine = true;
          if (e.ref && !ref) ref = e.ref;
          if (e.d === 'm' || e.d === 'd') device = e.d;
          if (e.h || e.ev === 'human') sidHuman = true;
          if (e.ev) {
            if (e.ev === 'read') {
              readPaths.add(e.path);
              const p = postTitle(e.path);
              events.push({ t: e.t, type: 'read', label: p?.label ?? e.path, href: CLEAN_PATH.test(e.path) ? p?.href ?? e.path : undefined });
            } else if (e.ev.startsWith('follow')) {
              const [, dest, where] = e.ev.split(':');
              follows.push(dest ?? 'out');
              events.push({ t: e.t, type: 'follow', label: `followed ${dest ?? 'out'}${where ? ` (${where})` : ''}` });
            } else if (e.ev.startsWith('pick')) {
              // A search result (ranked) or an Ask citation was opened.
              const rank = Number(e.ev.split(':')[1]);
              events.push({
                t: e.t, type: 'pick',
                label: e.path === '/ask'
                  ? 'opened a cited text'
                  : rank > 0 ? `opened result #${rank}` : 'opened a result',
              });
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
          events.push({ t: r.s.t, type: 'search', label: r.s.q, mode: r.s.mode ?? 'keyword', n: r.s.n });
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
      // Volume, or speed: eight-plus pages at under ten seconds apiece is
      // not a person reading.
      const crawler =
        (pages > 60 && nSearches === 0) || pages > 300 || (pages >= 8 && end - start < pages * 10_000);

      const ai = aiReferrer(ref) ?? undefined;

      const badges: string[] = [];
      if (mine) badges.push('you');
      if (crawler) badges.push('likely crawler');
      if (ai) badges.push(`via AI · ${ai}`);
      if (firstVisit) badges.push('first visit');
      if (returnGap !== null) badges.push(`returning · ${returnGap}d`);
      if (device === 'm') badges.push('phone');
      if (nBegins > 0) badges.push('generated path');
      if (mins >= 20 && events.length >= 8) badges.push('deep session');
      for (const term of terms) badges.push(`looked up: ${term}`);
      for (const dest of new Set(follows)) badges.push(`followed ${dest}`);

      let score =
        nSearches * 3 + texts * 4 + pages * 0.5 + Math.min(mins, 180) / 10 +
        terms.size * 12 + follows.length * 8 + nBegins * 15 + (ai ? 10 : 0);
      if (crawler) score -= 40;
      if (mine) score -= 25;

      out.push({
        id: episodes.length > 1 ? `${sid}-${epIdx + 1}` : sid,
        sid, kind: 'live', start, end, mins, mine, crawler, ref, ai, device, human: sidHuman || undefined,
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

function parseSearchLog(raw: unknown): RawSearch[] {
  return parseRows((raw as unknown[]) ?? [])
    .filter((e) => typeof e.q === 'string' && typeof e.t === 'number')
    .map((e) => ({
      q: e.q as string,
      mode: typeof e.mode === 'string' ? e.mode : 'keyword',
      mine: e.mine === true,
      n: typeof e.n === 'number' ? e.n : undefined,
      sid: typeof e.sid === 'string' ? e.sid : undefined,
      t: e.t as number,
    })) as RawSearch[];
}

function parseActivityLog(raw: unknown): RawActivity[] {
  return parseRows((raw as unknown[]) ?? [])
    .filter((e) => typeof e.sid === 'string' && typeof e.path === 'string' && typeof e.t === 'number')
    .map((e) => ({
      sid: e.sid as string,
      path: e.path as string,
      mine: e.mine === true,
      ref: typeof e.ref === 'string' ? e.ref : undefined,
      ev: typeof e.ev === 'string' ? e.ev : undefined,
      d: typeof e.d === 'string' ? e.d : undefined,
      h: e.h === 1 || e.h === true || undefined,
      t: e.t as number,
    })) as RawActivity[];
}

function parseBeginLog(raw: unknown): BeginHit[] {
  return parseRows((raw as unknown[]) ?? [])
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
}

/**
 * Chart markers the corpus supplies by itself: an essay published inside the
 * charts' window is an event worth seeing on the lines. Archived threads
 * (X, Reddit) arrive in batches and would only be noise.
 */
export function recentPostNotes(sinceDays = 90): { day: string; label: string }[] {
  const cutoff = Date.now() - sinceDays * 86_400_000;
  const out: { day: string; label: string }[] = [];
  for (const p of getPublicPosts()) {
    if (!p.date || p.source === 'twitter' || p.source === 'reddit') continue;
    const t = Date.parse(p.date);
    if (!Number.isFinite(t) || t < cutoff || t > Date.now()) continue;
    out.push({ day: new Date(t).toISOString().slice(0, 10), label: `New: ${p.title}` });
  }
  return out;
}

// ── One text, in depth ───────────────────────────────────────────────────
// Everything the console knows about a single post, for
// /analytics/post/<slug>: its daily views and reads, how far down readers
// get, who sends them, what they searched just before, and what they open
// next. Series come from the durable day-hashes (90 days); the relational
// parts (sources, searches, next texts, recent visits) from the retained
// trail window, readers only.

export const DEPTH_STEPS = [0, 25, 50, 75, 100];
export const DWELL_LABELS = ['under 30s', '30–90s', '90s–5 min', '5 min+'];

export type PostData = {
  slug: string;
  title: string;
  source: string;
  allTime: number;
  series: { day: string; views: number; reads: number }[]; // oldest first
  views7: number;
  viewsPrev7: number;
  views30: number;
  reads30: number;
  depthN: number;
  reach: number[]; // sessions reaching ≥ each DEPTH_STEPS level
  dwell: number[]; // sessions per DWELL_LABELS bucket
  sources: { name: string; n: number }[];
  searches: { q: string; n: number }[];
  next: (Ref & { n: number })[];
  follows: number;
  visits: { id: string; start: number; mins: number; read: boolean; via?: string }[];
};

export async function fetchPostData(slug: string): Promise<PostData | null> {
  const post = getPostBySlug(slug);
  const kv = getKV();
  if (!post || !kv) return null;

  const DAYS = 90;
  const path = `/post/${slug}`;
  const dayKeys = Array.from({ length: DAYS }, (_, i) => utcDay(i));
  const cellFields = DEPTH_STEPS.flatMap((d) => [0, 1, 2, 3].map((t) => `${slug}|${d}.${t}`));

  const pipe = kv.pipeline();
  for (const d of dayKeys) {
    pipe.hmget(`activity:day:${d}`, `p:${path}`, `pm:${path}`, `r:${path}`, `rm:${path}`, `h:${path}`);
    pipe.hmget(`depth:${d}`, ...cellFields);
  }
  pipe.zscore('views:counts', slug);
  pipe.lrange('search:log', 0, 4999);
  pipe.lrange('activity:log', 0, 19999);
  pipe.lrange('begin:log', 0, 1999);

  let res: unknown[];
  try {
    res = await pipe.exec();
  } catch {
    return null;
  }

  const series: PostData['series'] = [];
  const reach = DEPTH_STEPS.map(() => 0);
  const dwell = [0, 0, 0, 0];
  let depthN = 0;
  const cellTotals = new Map<string, number>();
  for (let i = 0; i < DAYS; i++) {
    const act = (res[i * 2] as Record<string, unknown> | null) ?? {};
    series.push({
      day: dayKeys[i],
      // People from the first full day of human detection; page loads before.
      views: dayKeys[i] >= HUMAN_DAY ? num(act[`h:${path}`]) : Math.max(0, num(act[`p:${path}`]) - num(act[`pm:${path}`])),
      reads: Math.max(0, num(act[`r:${path}`]) - num(act[`rm:${path}`])),
    });
    const cells = (res[i * 2 + 1] as Record<string, unknown> | null) ?? {};
    for (const f of cellFields) cellTotals.set(f, (cellTotals.get(f) ?? 0) + num(cells[f]));
  }
  for (const [field, raw] of cellTotals) {
    const n = Math.max(0, raw);
    if (n === 0) continue;
    const [d, t] = field.slice(field.lastIndexOf('|') + 1).split('.').map(Number);
    depthN += n;
    DEPTH_STEPS.forEach((step, k) => {
      if (d >= step) reach[k] += n;
    });
    dwell[t] += n;
  }
  // series is still newest-first here; it is reversed (copied) for the return.
  const sumViews = (from: number, to: number) => series.slice(from, to).reduce((a, r) => a + r.views, 0);
  const views7 = sumViews(0, 7);
  const viewsPrev7 = sumViews(7, 14);
  const views30 = sumViews(0, 30);
  const reads30 = series.slice(0, 30).reduce((a, r) => a + r.reads, 0);

  const base = DAYS * 2;
  const sessions = readerSessions(
    buildSessions(parseActivityLog(res[base + 2]), parseSearchLog(res[base + 1]), parseBeginLog(res[base + 3])),
  );
  const srcCounts = new Map<string, number>();
  const searchCounts = new Map<string, { q: string; n: number }>();
  const nextCounts = new Map<string, Ref & { n: number }>();
  const visits: PostData['visits'] = [];
  for (const s of sessions) {
    const ev = s.events;
    const first = ev.findIndex((e) => e.href === path && (e.type === 'page' || e.type === 'read'));
    if (first < 0) continue;
    visits.push({
      id: s.id, start: s.start, mins: s.mins,
      read: ev.some((e) => e.type === 'read' && e.href === path),
      via: s.ref ? sourceName(s.ref) : undefined,
    });
    // Arrived straight onto this text from outside?
    if (s.ref && ev.findIndex((e) => e.type === 'page') === first) {
      const name = sourceName(s.ref);
      srcCounts.set(name, (srcCounts.get(name) ?? 0) + 1);
    }
    // The search that led here: the nearest one in the three moves before.
    for (let j = first - 1; j >= Math.max(0, first - 3); j--) {
      if (ev[j].type !== 'search') continue;
      const key = ev[j].label.toLowerCase().trim();
      const row = searchCounts.get(key) ?? { q: ev[j].label, n: 0 };
      row.n += 1;
      searchCounts.set(key, row);
      break;
    }
    // The next text opened after this one.
    let last = first;
    ev.forEach((e, j) => {
      if (e.href === path) last = j;
    });
    const nxt = ev.slice(last + 1).find((e) => e.type === 'page' && e.href?.startsWith('/post/') && e.href !== path);
    if (nxt) {
      const key = nxt.href ?? nxt.label;
      const row = nextCounts.get(key) ?? { label: nxt.label, href: nxt.href, n: 0 };
      row.n += 1;
      nextCounts.set(key, row);
    }
  }
  const follows = parseActivityLog(res[base + 2]).filter(
    (a) => !a.mine && a.path === path && a.ev?.startsWith('follow'),
  ).length;
  const top = <T extends { n: number }>(m: Map<string, T>, cap: number) =>
    [...m.values()].sort((a, b) => b.n - a.n).slice(0, cap);

  return {
    slug,
    title: post.title,
    source: SOURCE_LABEL[post.source] ?? post.source,
    allTime: num(res[base]),
    // Per-path day counts began with the site's own instrumentation.
    series: [...series].reverse().filter((r) => r.day >= '2026-10-29'),
    views7,
    viewsPrev7,
    views30,
    reads30,
    depthN,
    reach,
    dwell,
    sources: [...srcCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, n]) => ({ name, n })),
    searches: top(searchCounts, 10),
    next: top(nextCounts, 8),
    follows,
    visits: visits.sort((a, b) => b.start - a.start).slice(0, 12),
  };
}

// The console is several pages over one dataset; a warm instance reuses a
// fetch for half a minute so moving between rooms is quick.
let memo: { at: number; data: StudyData } | null = null;
const MEMO_MS = 30_000;

export async function fetchStudyData(): Promise<StudyData | null> {
  if (memo && Date.now() - memo.at < MEMO_MS) return memo.data;
  const data = await loadStudyData();
  if (data) memo = { at: Date.now(), data };
  return data;
}

async function loadStudyData(): Promise<StudyData | null> {
  const kv = getKV();
  if (!kv) return null;

  // 90 day rows so the trends panel can show month-over-month; the tiles and
  // the day table slice the newest 30.
  const DAYS = 90;
  const dayKeys = Array.from({ length: DAYS }, (_, i) => utcDay(i));

  // Pipeline A: fixed-order per-day reads (STRIDE commands per day).
  const STRIDE = 5;
  const pa = kv.pipeline();
  for (const d of dayKeys) {
    pa.hgetall(`convert:${d}`);
    pa.hgetall(`activity:day:${d}`);
    pa.hgetall(`search:day:${d}`);
    pa.pfcount(`activity:uniq:${d}`);
    pa.pfcount(`activity:humans:${d}`);
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
  pb.lrange('activity:log', 0, 19999);
  pb.lrange('begin:log', 0, 1999);
  pb.lrange('ask:log', 0, 149);

  // Pipeline C: the newer day-hashes (AI crawlers, read depth: 30 days;
  // 404s: 14). Optional — a failure here must not take the console down.
  const WIN = 30;
  const FOF_DAYS = 14;
  const pc = kv.pipeline();
  for (let i = 0; i < WIN; i++) {
    pc.hgetall(`crawler:day:${dayKeys[i]}`);
    pc.hgetall(`depth:${dayKeys[i]}`);
  }
  for (let i = 0; i < FOF_DAYS; i++) pc.hgetall(`fof:${dayKeys[i]}`);

  let ra: unknown[];
  let rb: unknown[];
  let rc: unknown[];
  try {
    [ra, rb, rc] = await Promise.all([pa.exec(), pb.exec(), pc.exec().catch(() => [] as unknown[])]);
  } catch {
    return null;
  }

  // --- raw logs ---
  const searchLog = parseSearchLog(rb[6]);
  const activityLog = parseActivityLog(rb[7]);
  const beginPaths = parseBeginLog(rb[8]);
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

  // Engaged visits — the pre-"human" way of telling people from tabs: a
  // non-owner session that came from somewhere (a referrer), opened more
  // than one page, or did something (read, followed, picked a result). The
  // automatic new/return/human stamps are not activity: every fresh browser
  // sends "new" on load, bots included.
  const dayOf = (t: number) => new Date(t).toISOString().slice(0, 10);
  const META_EV = /^(new|return|human)/;
  const engagedCutoff = Date.now() - 7 * 86_400_000;
  const sidWeek = new Map<string, { n: number; hit: boolean }>();
  const sidDay = new Map<string, Map<string, { n: number; hit: boolean }>>();
  let oldestLogDay = dayKeys[0];
  for (const a of activityLog) {
    const d = dayOf(a.t);
    if (d < oldestLogDay) oldestLogDay = d;
    if (a.mine || (a.ev && META_EV.test(a.ev))) continue;
    const bump = (row: { n: number; hit: boolean }) => {
      row.n += 1;
      if (a.ref || a.ev) row.hit = true;
      return row;
    };
    let m = sidDay.get(d);
    if (!m) {
      m = new Map();
      sidDay.set(d, m);
    }
    m.set(a.sid, bump(m.get(a.sid) ?? { n: 0, hit: false }));
    if (a.t >= engagedCutoff) sidWeek.set(a.sid, bump(sidWeek.get(a.sid) ?? { n: 0, hit: false }));
  }
  const countEngaged = (m: Map<string, { n: number; hit: boolean }>) => {
    let c = 0;
    for (const row of m.values()) if (row.n >= 2 || row.hit) c += 1;
    return c;
  };
  const engaged7 = countEngaged(sidWeek);
  const engagedByDay = new Map<string, number>();
  for (const [d, m] of sidDay) engagedByDay.set(d, countEngaged(m));

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
  const engagedToStore: [string, number][] = [];
  const days: DayRow[] = dayKeys.map((day, i) => {
    const conv = (ra[i * STRIDE] as Record<string, unknown> | null) ?? {};
    const act = (ra[i * STRIDE + 1] as Record<string, unknown> | null) ?? {};
    const sday = (ra[i * STRIDE + 2] as Record<string, unknown> | null) ?? {};
    const uniq = num(ra[i * STRIDE + 3]);
    const humans = num(ra[i * STRIDE + 4]);
    const hasActivity = Object.keys(act).length > 0;
    const fromLog = logByDay.get(day);
    // The engaged estimate is kept in the day hash once the day is complete,
    // so it survives the raw log rolling over; the log's own oldest day is
    // partial and is left unknown rather than under-reported.
    const engaged =
      act.engaged !== undefined
        ? num(act.engaged)
        : day > oldestLogDay
          ? engagedByDay.get(day) ?? (hasActivity ? 0 : null)
          : null;
    if (i > 0 && act.engaged === undefined && engaged !== null && hasActivity) {
      engagedToStore.push([day, engaged]);
    }
    return {
      day,
      views: hasActivity ? num(act.views) : null,
      viewsMine: num(act['views:mine']),
      uniq: hasActivity ? uniq : null,
      // Human sessions from the first complete day of detection. A day that
      // shows none while visits were plainly engaged means the signal didn't
      // arrive (a capture fault), so the estimate stands in rather than a
      // false zero.
      readers: !hasActivity ? null : day >= HUMAN_DAY && humans > 0 ? humans : engaged,
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
  if (engagedToStore.length > 0) {
    try {
      const pe = kv.pipeline();
      for (const [day, v] of engagedToStore) pe.hsetnx(`activity:day:${day}`, 'engaged', v);
      await pe.exec();
    } catch {
      /* the estimate is recomputed next time */
    }
  }

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
  const allSessions = [...live, ...legacy];
  const sessions = [...allSessions].sort((a, b) => b.score - a.score).slice(0, 150);
  const episodes: Record<string, { id: string; start: number; end: number }[]> = {};
  for (const s of live) {
    if (s.sid) (episodes[s.sid] ??= []).push({ id: s.id, start: s.start, end: s.end });
  }

  // --- what's working / what isn't -------------------------------------
  // From the durable day-hashes: who sends visits (ref:<host>) and which of
  // those were people (hr:<host>), human views per text (h:/post/<slug>),
  // device and language mix.
  const actDays = dayKeys.map((_, i) => (ra[i * STRIDE + 1] as Record<string, unknown> | null) ?? {});
  const refVisits = new Map<string, { v30: number; v7: number; ai: boolean }>();
  const aiDaily: number[] = [];
  const aiProducts = new Map<string, number>();
  const humanCur = new Map<string, number>();  // h:/post/<slug> — human views
  const humanPrev = new Map<string, number>();
  const humanArrivals = new Map<string, number>(); // hr:<host>, 30 days
  const devices = { m: 0, d: 0 };
  const langCounts = new Map<string, number>();
  for (let i = 0; i < WIN; i++) {
    let aiN = 0;
    for (const [field, raw] of Object.entries(actDays[i])) {
      const n = num(raw);
      if (field.startsWith('ref:')) {
        const host = field.slice(4);
        const product = aiReferrer(host);
        const name = sourceName(host);
        const row = refVisits.get(name) ?? { v30: 0, v7: 0, ai: false };
        row.v30 += n;
        if (i < 7) row.v7 += n;
        if (product) {
          row.ai = true;
          aiN += n;
          aiProducts.set(product, (aiProducts.get(product) ?? 0) + n);
        }
        refVisits.set(name, row);
      } else if (i < 14 && field.startsWith('h:/post/')) {
        const slug = field.slice(8).replace(/\/$/, '');
        const m = i < 7 ? humanCur : humanPrev;
        m.set(slug, (m.get(slug) ?? 0) + n);
      } else if (field.startsWith('hr:')) {
        const name = sourceName(field.slice(3));
        humanArrivals.set(name, (humanArrivals.get(name) ?? 0) + n);
      } else if (field === 'dev:m') devices.m += n;
      else if (field === 'dev:d') devices.d += n;
      else if (field.startsWith('lang:')) {
        langCounts.set(field.slice(5), (langCounts.get(field.slice(5)) ?? 0) + n);
      }
    }
    aiDaily.push(aiN);
  }
  const sumRange = (xs: number[], from: number, to: number) => xs.slice(from, to).reduce((a, b) => a + b, 0);
  const aiRef = {
    total7: sumRange(aiDaily, 0, 7),
    prev7: sumRange(aiDaily, 7, 14),
    total30: sumRange(aiDaily, 0, WIN),
    byProduct: [...aiProducts.entries()].sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, n })),
  };
  // From the session episodes (the retained trail window, readers only).
  const readers = readerSessions(live);

  // Most-opened texts, counted in READERS: human views from the day hashes
  // once there are two weeks of them, and until then the reader sessions
  // that opened each text (so bot loads never rank a text).
  const DAY_MS = 86_400_000;
  const opensCur = new Map<string, number>();
  const opensPrev = new Map<string, number>();
  for (const s of readers) {
    const age = Date.now() - s.start;
    if (age > 14 * DAY_MS || (s.eventsTotal < 2 && !s.ref && !s.human)) continue;
    const seen = new Set<string>();
    for (const e of s.events) {
      if ((e.type === 'page' || e.type === 'read') && e.href?.startsWith('/post/')) seen.add(e.href.slice(6));
    }
    const m = age <= 7 * DAY_MS ? opensCur : opensPrev;
    for (const slug of seen) m.set(slug, (m.get(slug) ?? 0) + 1);
  }
  const humanHistory = [...humanPrev.values()].reduce((a, b) => a + b, 0) > 0;
  const [mvCur, mvPrev] = humanHistory ? [humanCur, humanPrev] : [opensCur, opensPrev];
  const movers: Mover[] = [...mvCur.entries()]
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .flatMap(([slug, cur]) => {
      const post = getPostBySlug(slug);
      return post ? [{ slug, label: post.title, cur, prev: Math.max(0, mvPrev.get(slug) ?? 0) }] : [];
    })
    .slice(0, 8);
  const langs = [...langCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([l, n]) => ({ l, n }));

  const quality = deriveSourceQuality(readers);
  const sources: SourceRow[] = [...new Set([...refVisits.keys(), ...quality.keys()])]
    .map((name) => {
      const v = refVisits.get(name);
      const q = quality.get(name);
      return {
        name,
        ai: isAiProduct(name),
        visits30: v?.v30 ?? 0,
        visits7: v?.v7 ?? 0,
        human30: humanArrivals.get(name) ?? 0,
        sessions: q?.sessions ?? 0,
        stayed: q?.stayed ?? 0,
        read: q?.read ?? 0,
      };
    })
    .sort((a, b) => b.visits30 - a.visits30 || b.sessions - a.sessions)
    .slice(0, 16);
  const landings = deriveLandings(readers);
  const coReads = deriveCoReads(readers);
  const beginFunnel = deriveBeginFunnel(readers);
  const searchOutcome = deriveSearchOutcomes(readers, Date.now() - 14 * 86_400_000);

  // Texts whose readers clicked through to follow (the trail event carries
  // the page the click happened on).
  const followCounts = new Map<string, number>();
  for (const a of activityLog) {
    if (a.mine || !a.ev?.startsWith('follow') || !a.path.startsWith('/post/')) continue;
    followCounts.set(a.path, (followCounts.get(a.path) ?? 0) + 1);
  }
  const followPosts = [...followCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([path, n]) => ({ ...(postTitle(path) ?? { label: path }), n }));

  // AI crawlers/agents (counted in src/proxy.ts), per family.
  const crawlerTotals = new Map<string, { d1: number; d7: number; d30: number }>();
  for (let i = 0; i < WIN; i++) {
    const h = (rc[i * 2] as Record<string, unknown> | null) ?? {};
    for (const [family, raw] of Object.entries(h)) {
      if (family === 'probe') continue;
      const row = crawlerTotals.get(family) ?? { d1: 0, d7: 0, d30: 0 };
      const n = num(raw);
      row.d30 += n;
      if (i < 7) row.d7 += n;
      if (i === 0) row.d1 += n;
      crawlerTotals.set(family, row);
    }
  }
  const families = [...crawlerTotals.keys()];
  let pathRows: unknown[] = [];
  if (families.length > 0) {
    try {
      const pp = kv.pipeline();
      for (const f of families) pp.zrange(`crawler:paths:${f}`, 0, 4, { rev: true, withScores: true });
      pathRows = await pp.exec();
    } catch {
      pathRows = [];
    }
  }
  const crawlers: CrawlerRow[] = families
    .map((family, i) => {
      const flat = (pathRows[i] as (string | number)[] | undefined) ?? [];
      const topPaths: (Ref & { n: number })[] = [];
      for (let j = 0; j < flat.length; j += 2) {
        const path = String(flat[j]);
        topPaths.push({ ...(postTitle(path) ?? { label: path, href: CLEAN_PATH.test(path) ? path : undefined }), n: num(flat[j + 1]) });
      }
      return { family, kind: aiAgentKind(family), ...crawlerTotals.get(family)!, topPaths };
    })
    .sort((a, b) => b.d30 - a.d30);

  // Read depth: each (reader session, text) sits in one "<slug>|<d>.<t>"
  // cell; sum the window, then read the funnel off the cells.
  const depthCells = new Map<string, Map<string, number>>();
  for (let i = 0; i < WIN; i++) {
    const h = (rc[i * 2 + 1] as Record<string, unknown> | null) ?? {};
    for (const [field, raw] of Object.entries(h)) {
      const bar = field.lastIndexOf('|');
      if (bar < 1) continue;
      const slug = field.slice(0, bar);
      if (slug === '__probe__') continue;
      const cells = depthCells.get(slug) ?? new Map<string, number>();
      cells.set(field.slice(bar + 1), (cells.get(field.slice(bar + 1)) ?? 0) + num(raw));
      depthCells.set(slug, cells);
    }
  }
  const completion = { n: 0, reach75: 0 };
  const depthPosts: DepthPost[] = [];
  for (const [slug, cells] of depthCells) {
    const row: DepthPost = { slug, title: getPostBySlug(slug)?.title ?? slug, n: 0, reach50: 0, reach75: 0, done: 0, lingered: 0 };
    for (const [cell, raw] of cells) {
      const n = Math.max(0, raw); // a count moved across midnight can dip one day negative
      const [d, t] = cell.split('.').map(Number);
      row.n += n;
      if (d >= 50) row.reach50 += n;
      if (d >= 75) row.reach75 += n;
      if (d >= 100) row.done += n;
      if (t >= 2) row.lingered += n;
    }
    if (row.n === 0) continue;
    completion.n += row.n;
    completion.reach75 += row.reach75;
    depthPosts.push(row);
  }
  depthPosts.sort((a, b) => b.n - a.n);

  // 404s people actually hit.
  const missCounts = new Map<string, number>();
  for (let i = 0; i < FOF_DAYS; i++) {
    const h = (rc[WIN * 2 + i] as Record<string, unknown> | null) ?? {};
    for (const [path, raw] of Object.entries(h)) {
      if (path === '/__probe__') continue;
      missCounts.set(path, (missCounts.get(path) ?? 0) + num(raw));
    }
  }
  const missing = [...missCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15).map(([path, n]) => ({ path, n }));

  // Ask answers that read like a shrug — unmet demand on the Ask side.
  const WEAK = /\b(i (don['’]t|do not) (have|know|see)|(could|can)(n['’]t| not) (find|locate)|no (direct |specific |explicit )?(information|mention|discussion|reference)|(isn['’]t|is not|aren['’]t|are not|not) (covered|discussed|addressed|mentioned) in|(archive|corpus|sources?|passages?|texts?) (do(es)?n['’]t|do(es)? not) (contain|cover|discuss|mention|address|include))\b/i;
  let weakAsks = 0;
  for (const h of askAnswers) {
    if (WEAK.test(h.a.slice(0, 600))) {
      h.weak = true;
      weakAsks += 1;
    }
  }

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
    allSessions,
    episodes,
    activitySince,
    sources,
    aiRef,
    landings,
    coReads,
    beginFunnel,
    searchOutcome,
    followPosts,
    movers,
    crawlers,
    depthPosts: depthPosts.slice(0, 60),
    completion,
    missing,
    devices,
    langs,
    weakAsks,
  };
}
