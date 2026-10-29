import Link from 'next/link';
import { Redis } from '@upstash/redis';
import { getPostBySlug } from '@/lib/parser';
import type { Metadata } from 'next';

// /sessions — the owner's reading room for visitor trails. Reconstructs each
// anonymous per-tab session (see src/lib/session-id.ts) by merging the
// activity log (pages opened) with the search log (queries run), ranks the
// sessions by how much happened in them, and renders each as a timeline.
// Unlinked and noindexed; the data is anonymous either way (no IP, no
// cookie, no identity — a session is a random token that died with its tab).
// Owner-tagged (mine) sessions are NEVER rendered here: the page is public
// by posture, and the owner flag is the one thing that would tie trails to
// a person. Likely-crawler sessions are dropped too — the page exists to
// show how people move through the site.

export const metadata: Metadata = {
  title: 'Sessions',
  robots: { index: false, follow: false },
};

// ISR, matching /trending: a 5-minute-stale readout is fine for a study
// tool, and it means repeat hits don't each run large lranges against the
// shared store (the page takes no query params, so one cache entry).
export const revalidate = 300;

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

type Ev = {
  t: number;
  kind: 'page' | 'search';
  // page
  path?: string;
  ref?: string;
  // search
  q?: string;
  mode?: string;
  mine?: boolean;
};

type Session = {
  sid: string;
  events: Ev[];
  start: number;
  end: number;
  mine: boolean;
  ref?: string;
  nPages: number;
  nPosts: number;
  nSearches: number;
  score: number;
  crawler: boolean;
};

// Read windows: recent-enough history without hauling the full caps on
// every revalidation.
const ACTIVITY_WINDOW = 8000;
const SEARCH_WINDOW = 3000;
// A session's timeline is capped in the render; nobody reads 500 rows.
const MAX_EVENTS_SHOWN = 100;

function parseRows(rows: unknown[]): Record<string, unknown>[] {
  return rows
    .map((r) => {
      try { return typeof r === 'string' ? JSON.parse(r) : r; } catch { return null; }
    })
    .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object');
}

function buildSessions(activity: Record<string, unknown>[], searches: Record<string, unknown>[]): Session[] {
  const bySid = new Map<string, Ev[]>();
  const push = (sid: string, ev: Ev) => {
    const list = bySid.get(sid) ?? [];
    list.push(ev);
    bySid.set(sid, list);
  };
  for (const a of activity) {
    if (typeof a.sid !== 'string' || typeof a.path !== 'string' || typeof a.t !== 'number') continue;
    push(a.sid, {
      t: a.t, kind: 'page', path: a.path,
      ref: typeof a.ref === 'string' ? a.ref : undefined,
      mine: a.mine === true,
    });
  }
  for (const s of searches) {
    if (typeof s.sid !== 'string' || typeof s.q !== 'string' || typeof s.t !== 'number') continue;
    push(s.sid, {
      t: s.t, kind: 'search', q: s.q,
      mode: typeof s.mode === 'string' ? s.mode : 'keyword',
      mine: s.mine === true,
    });
  }

  const sessions: Session[] = [];
  for (const [sid, events] of bySid) {
    events.sort((a, b) => a.t - b.t);
    const pages = events.filter((e) => e.kind === 'page');
    const posts = new Set(
      pages.map((e) => e.path!).filter((p) => p.startsWith('/post/')).map((p) => p.split('/')[2] ?? p),
    );
    const nSearches = events.length - pages.length;
    const start = events[0].t;
    const end = events[events.length - 1].t;
    const minutes = (end - start) / 60_000;
    // Machine-shaped trails: a long page sweep with no searching, or a page
    // count no reader reaches. (One stray search shouldn't launder a sweep.)
    const crawler = (pages.length > 60 && nSearches === 0) || pages.length > 300;
    sessions.push({
      sid,
      events,
      start,
      end,
      mine: events.some((e) => e.mine),
      ref: pages.find((e) => e.ref)?.ref,
      nPages: pages.length,
      nPosts: posts.size,
      nSearches,
      score: nSearches * 3 + posts.size * 2 + pages.length * 0.5 + Math.min(minutes, 180) / 15,
      crawler,
    });
  }
  return sessions.sort((a, b) => b.score - a.score);
}

const fmtTime = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit',
});
const fmtDay = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York', month: 'short', day: 'numeric',
});

function duration(ms: number): string {
  const m = Math.round(ms / 60_000);
  if (m < 1) return '<1 min';
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function pageLabel(path: string): { label: string; href?: string; badge?: string } {
  // Defense in depth alongside the ingest guard: anything that isn't a
  // clean site-relative path renders as text, never as a link.
  if (!/^\/(?![/\\])/.test(path)) return { label: path };
  if (path.startsWith('/post/')) {
    const slug = path.split('/')[2] ?? '';
    const post = slug ? getPostBySlug(slug) : null;
    if (post) return { label: post.title, href: path, badge: 'read' };
    return { label: path, href: path, badge: 'read' };
  }
  return { label: path, href: path };
}

export default async function SessionsPage() {
  const kv = getKV();
  let sessions: Session[] = [];
  let hidden = 0;
  if (kv) {
    try {
      const [activityRows, searchRows] = await Promise.all([
        kv.lrange('activity:log', 0, ACTIVITY_WINDOW - 1) as Promise<unknown[]>,
        kv.lrange('search:log', 0, SEARCH_WINDOW - 1) as Promise<unknown[]>,
      ]);
      const all = buildSessions(parseRows(activityRows), parseRows(searchRows));
      const shown = all.filter((s) => !s.mine && !s.crawler);
      hidden = all.length - shown.length;
      sessions = shown.slice(0, 40);
    } catch {
      sessions = [];
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        Reader sessions
      </h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Anonymous visit trails, most eventful first — each one is a single browser tab&apos;s
        pages and searches, strung together by a random token that died when the tab closed.
        No identity, no IP. Collection began Oct 29, 2026.
      </p>
      {hidden > 0 && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
          {hidden}
          {' owner or likely-crawler session'}{hidden === 1 ? '' : 's'}{' excluded.'}
        </p>
      )}

      {sessions.length === 0 && (
        <p className="mt-10 text-sm text-gray-500 dark:text-gray-400">
          Nothing yet — trails appear here as visitors browse.
        </p>
      )}

      <div className="mt-8 space-y-8">
        {sessions.map((s) => (
          <section
            key={s.sid}
            className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-5"
          >
            <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {fmtDay.format(s.start)}, {fmtTime.format(s.start)}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {duration(s.end - s.start)}{' · '}{s.nPages}{' '}page{s.nPages === 1 ? '' : 's'}
                {s.nPosts > 0 && <>{' · '}{s.nPosts}{' '}text{s.nPosts === 1 ? '' : 's'}</>}
                {s.nSearches > 0 && <>{' · '}{s.nSearches}{' '}search{s.nSearches === 1 ? '' : 'es'}</>}
              </span>
              {s.ref && (
                <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs text-gray-600 dark:text-gray-300">
                  {'via '}{s.ref}
                </span>
              )}
            </header>
            <ol className="mt-3 space-y-1.5 text-sm">
              {s.events.slice(0, MAX_EVENTS_SHOWN).map((e, i) => {
                const prev = i > 0 ? s.events[i - 1] : null;
                const gap = prev ? e.t - prev.t : 0;
                return (
                  <li key={i}>
                    {gap > 15 * 60_000 && (
                      <div className="my-1.5 text-xs text-gray-400 dark:text-gray-600">
                        {'— '}{duration(gap)}{' later —'}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <span className="w-16 shrink-0 tabular-nums text-xs text-gray-400 dark:text-gray-500 pt-0.5">
                        {fmtTime.format(e.t)}
                      </span>
                      {e.kind === 'search' ? (
                        <span className="text-gray-800 dark:text-gray-200">
                          <span className="mr-1.5 text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                            {e.mode === 'ask' ? 'ai' : 'search'}
                          </span>
                          “{e.q}”
                        </span>
                      ) : (
                        (() => {
                          const p = pageLabel(e.path ?? '/');
                          return (
                            <span className="text-gray-700 dark:text-gray-300">
                              {p.badge && (
                                <span className="mr-1.5 text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                                  {p.badge}
                                </span>
                              )}
                              {p.href ? (
                                <Link href={p.href} className="hover:underline">
                                  {p.label}
                                </Link>
                              ) : (
                                <span>{p.label}</span>
                              )}
                            </span>
                          );
                        })()
                      )}
                    </div>
                  </li>
                );
              })}
              {s.events.length > MAX_EVENTS_SHOWN && (
                <li className="text-xs text-gray-400 dark:text-gray-500">
                  {'… '}{s.events.length - MAX_EVENTS_SHOWN}{' more events not shown'}
                </li>
              )}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}
