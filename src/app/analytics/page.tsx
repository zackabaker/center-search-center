import Link from 'next/link';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { fetchStudyData, type DayRow } from './data';
import SessionsExplorer from './SessionsExplorer';
import TrendsPanel from './TrendsPanel';
import { recentFeedback, topEngaged } from '@/lib/user-store';
import { rememberOwnerNetwork } from '@/lib/owner-mark';
import { getKV } from '@/lib/kv';

// /analytics — the owner's private console (formerly /study; src/proxy.ts
// 308-redirects the old URL and gates this one: owner Google session, or the
// legacy key cookie). Reorganized 2026-11-16 around how the owner actually
// reads it: trends first (line charts, week over week), then what readers
// searched day by day, the reading paths they generated, what was just read,
// and the full session trails. Reference lists (all-time terms, most-read,
// people watch, the daily table) stay one <details> away.

export const metadata: Metadata = {
  title: 'Analytics',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const fmtDayLong = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric',
});
const fmtDayShort = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC', month: 'short', day: 'numeric',
});

function sum(rows: DayRow[], f: (r: DayRow) => number | null): number {
  return rows.reduce((a, r) => a + (f(r) ?? 0), 0);
}

function Tile({ label, today, week, month, note }: {
  label: string; today: string; week: string; month: string; note?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3 sm:p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">{today}</div>
      <div className="mt-1 text-xs tabular-nums text-gray-500 dark:text-gray-400">
        {week}{' · 7d'}<br />{month}{' · 30d'}
      </div>
      {note && <div className="mt-1 text-[10px] text-gray-400 dark:text-gray-600">{note}</div>}
    </div>
  );
}

function Bar({ n, max, className }: { n: number; max: number; className: string }) {
  const pct = n > 0 && max > 0 ? Math.max(2, Math.round((n / max) * 100)) : 0;
  return (
    <span className="inline-flex w-24 items-center" aria-hidden>
      <span className={`h-1.5 rounded-sm ${className}`} style={{ width: `${pct}%` }} />
    </span>
  );
}

const SECTIONS = [
  ['overview', 'Trends'],
  ['searches', 'Searches'],
  ['begin', 'Journeys'],
  ['reading', 'Reading'],
  ['answers', 'Answers'],
  ['sessions', 'Sessions'],
  ['readers', 'Readers'],
  ['feedback', 'Feedback'],
] as const;

// Day keys are YYYY-MM-DD; render them without timezone drift.
function dayLabel(day: string, long = false): string {
  const d = new Date(`${day}T00:00:00Z`);
  return (long ? fmtDayLong : fmtDayShort).format(d);
}

export default async function AnalyticsPage() {
  // Whoever is reading this page is the owner (the proxy gate saw to that) —
  // remember this network so the ingest routes can mark searches/activity
  // from it as "mine" and keep them out of the readers' view, whichever
  // browser or device they come from. Peppered hash, owner's networks only.
  try {
    const kv = getKV();
    if (kv) await rememberOwnerNetwork(kv, await headers());
  } catch { /* never block the console on this */ }

  const data = await fetchStudyData();
  const feedback = await recentFeedback(100).catch(() => []);
  const readers = await topEngaged(50).catch(() => []);
  const readTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
  };

  if (!data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Analytics</h1>
        <p className="mt-3 text-sm text-gray-500">The data store is not reachable from this environment.</p>
      </main>
    );
  }

  const d7 = data.days.slice(0, 7);
  const d30 = data.days.slice(0, 30); // days now carries 90 rows for the trends panel
  const today = data.days[0];
  const fmt = (n: number | null) => (n === null ? '—' : n.toLocaleString('en-US'));
  const maxViews = Math.max(1, ...d30.map((r) => r.views ?? 0));
  const maxSearches = Math.max(1, ...d30.map((r) => r.searches));
  const timeET = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
  const timeOnlyET = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit',
  });
  // "session →" links only where a serialized session actually exists.
  const sidSet = new Set(data.sessions.map((s) => s.id));

  // --- journeys: the week's most engaged visits as readable digests ------
  const weekAgoTs = data.generatedAt - 7 * 86_400_000;
  const journeys = data.sessions
    .filter((s) => !s.mine && !s.crawler && s.kind === 'live' && s.end >= weekAgoTs)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((s) => {
      const seen = new Set<string>();
      const searches: string[] = [];
      const reads: { label: string; href?: string }[] = [];
      const follows: string[] = [];
      const begins: { label: string; href?: string }[] = [];
      let landing: string | undefined;
      for (const e of s.events) {
        if (e.type === 'page' && landing === undefined) landing = e.label;
        else if (e.type === 'search' && !seen.has(`s:${e.label}`)) {
          seen.add(`s:${e.label}`);
          searches.push(e.label);
        } else if (e.type === 'read' && !seen.has(`r:${e.label}`)) {
          seen.add(`r:${e.label}`);
          reads.push({ label: e.label, href: e.href });
        } else if (e.type === 'follow') follows.push(e.label);
        else if (e.type === 'begin') begins.push({ label: e.label, href: e.href });
      }
      return { s, landing, searches, reads, follows, begins };
    });

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {'Private console · generated '}{timeET.format(data.generatedAt)}{' ET · all times ET'}
          </p>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm">
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="text-gray-600 dark:text-gray-300 hover:underline">{label}</a>
          ))}
        </nav>
      </header>

      {/* ---------------- Trends ---------------- */}
      <section id="overview" className="mt-8">
        <TrendsPanel days={data.days} weeks={data.weeklySearches} engaged7={data.engaged7} />

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Tile
            label="Page views"
            today={fmt(today.views)}
            week={fmt(sum(d7, (r) => r.views))}
            month={fmt(sum(d30, (r) => r.views))}
            note={`own instrumentation, since ${data.activitySince}`}
          />
          <Tile
            label="Visitors"
            today={fmt(today.uniq)}
            week={fmt(sum(d7, (r) => r.uniq))}
            month={fmt(sum(d30, (r) => r.uniq))}
          />
          <Tile
            label="Searches"
            today={fmt(today.searches)}
            week={fmt(sum(d7, (r) => r.searches))}
            month={fmt(sum(d30, (r) => r.searches))}
            note="yours included"
          />
          <Tile
            label="Reads"
            today={fmt(today.reads)}
            week={fmt(sum(d7, (r) => r.reads))}
            month={fmt(sum(d30, (r) => r.reads))}
          />
          <Tile
            label="Follows"
            today={fmt(today.follows)}
            week={fmt(sum(d7, (r) => r.follows))}
            month={fmt(sum(d30, (r) => r.follows))}
            note="clicks out to Substack / X / RSS"
          />
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:underline">
            Day-by-day table (last 30)
          </summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm tabular-nums">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <th className="py-1.5 pr-3 font-normal">Day</th>
                  <th className="py-1.5 pr-3 font-normal">Views</th>
                  <th className="py-1.5 pr-3 font-normal"></th>
                  <th className="py-1.5 pr-3 font-normal">Visitors</th>
                  <th className="py-1.5 pr-3 font-normal">Searches</th>
                  <th className="py-1.5 pr-3 font-normal"></th>
                  <th className="py-1.5 pr-3 font-normal">Opens</th>
                  <th className="py-1.5 pr-3 font-normal">Reads</th>
                  <th className="py-1.5 pr-3 font-normal">Follows</th>
                  <th className="py-1.5 pr-0 font-normal">Returns</th>
                </tr>
              </thead>
              <tbody>
                {d30.map((r) => (
                  <tr key={r.day} className="border-b border-gray-100 dark:border-gray-900">
                    <td className="py-1.5 pr-3 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {dayLabel(r.day, true)}
                    </td>
                    <td className="py-1.5 pr-1 text-gray-900 dark:text-gray-100">{fmt(r.views)}</td>
                    <td className="py-1.5 pr-3"><Bar n={r.views ?? 0} max={maxViews} className="bg-[#2a78d6]/60 dark:bg-[#3987e5]/60" /></td>
                    <td className="py-1.5 pr-3 text-gray-700 dark:text-gray-300">{fmt(r.uniq)}</td>
                    <td className="py-1.5 pr-1 text-gray-900 dark:text-gray-100">{r.searches.toLocaleString('en-US')}</td>
                    <td className="py-1.5 pr-3"><Bar n={r.searches} max={maxSearches} className="bg-[#eb6834]/60 dark:bg-[#d95926]/60" /></td>
                    <td className="py-1.5 pr-3 text-gray-700 dark:text-gray-300">{r.opens || '·'}</td>
                    <td className="py-1.5 pr-3 text-gray-700 dark:text-gray-300">{r.reads || '·'}</td>
                    <td className="py-1.5 pr-3 text-gray-700 dark:text-gray-300">{r.follows || '·'}</td>
                    <td className="py-1.5 pr-0 text-gray-700 dark:text-gray-300">{r.returns || '·'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
            {'Days are UTC (matching the ingest keys). Views/Visitors are the site’s own counters, collected since '}
            {data.activitySince}{'. Searches before then are reconstructed from the retained search log.'}
          </p>
        </details>

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {'All-time: '}{data.searchTotal.toLocaleString('en-US')}{' searches · '}
          {data.viewTotal.toLocaleString('en-US')}{' text views. External layers: '}
          <a className="underline" href="https://vercel.com/zack-bakers-projects/center-search-center/analytics" target="_blank" rel="noreferrer">Vercel Analytics</a>
          {' · '}
          <a className="underline" href="https://search.google.com/search-console?resource_id=sc-domain%3Acenter.study" target="_blank" rel="noreferrer">Search Console</a>
          {'.'}
        </p>
      </section>

      {/* ---------------- Searches ---------------- */}
      <section id="searches" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">What readers search</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Every reader search, day by day (your own excluded). Open a day to read it in order; the session link opens the full trail.
        </p>
        <div className="mt-4 space-y-2">
          {data.searchDays.map((d, i) => (
            <details
              key={d.day}
              open={i === 0}
              className="rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <summary className="cursor-pointer select-none px-3 py-2.5 sm:px-4 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <span className="font-medium text-gray-900 dark:text-gray-100">{dayLabel(d.day, true)}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {d.n}{' search'}{d.n === 1 ? '' : 'es'}
                  {d.nAsk > 0 && <>{' · '}{d.nAsk}{' AI'}</>}
                </span>
                {/* line-clamp (not truncate): nowrap text poisons every ancestor's
                    min-content width and forces the page wide on phones. */}
                <span className="min-w-0 flex-1 line-clamp-1 text-xs text-gray-400 dark:text-gray-600">
                  {d.items.slice(-3).reverse().map((s) => `“${s.q}”`).join(' · ')}
                </span>
              </summary>
              <ol className="border-t border-gray-100 dark:border-gray-900 px-3 py-2.5 sm:px-4 space-y-1 text-sm">
                {d.items.map((s, j) => (
                  <li key={j} className="flex flex-wrap items-baseline gap-x-2">
                    <span className="w-16 shrink-0 text-xs tabular-nums text-gray-400">{timeOnlyET.format(s.t)}</span>
                    <span className="text-xs uppercase tracking-wide text-gray-400">{s.mode === 'ask' ? 'ai' : 'kw'}</span>
                    <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">“{s.q}”</span>
                    {typeof s.n === 'number' && s.n === 0 && <span className="text-xs text-rose-600 dark:text-rose-300">0 results</span>}
                    {s.sid && sidSet.has(s.sid) && <a href={`#s-${s.sid}`} className="text-xs text-gray-500 underline">session →</a>}
                  </li>
                ))}
                {d.n > d.items.length && (
                  <li className="text-xs text-gray-400">{'… '}{d.n - d.items.length}{' more that day'}</li>
                )}
              </ol>
            </details>
          ))}
          {data.searchDays.length === 0 && <p className="text-sm text-gray-400">Nothing logged yet.</p>}
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Searched, found nothing</h3>
            <p className="text-xs text-gray-400">Unmet demand, verified against the live index — candidates for new concept pages or vocabulary.</p>
            <ol className="mt-2 space-y-1 text-sm">
              {data.zeroResult.map((s) => (
                <li key={`${s.q}-${s.t}`} className="break-words text-gray-800 dark:text-gray-200">
                  “{s.q}”<span className="ml-1.5 text-xs text-gray-400">{timeET.format(s.t)}</span>
                </li>
              ))}
              {data.zeroResult.length === 0 && <li className="text-gray-400">None recorded.</li>}
            </ol>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Top terms, last 7 days</h3>
            <ol className="mt-2 space-y-1 text-sm">
              {data.termsRecent.map((t) => (
                <li key={t.q} className="flex justify-between gap-2">
                  <span className="min-w-0 line-clamp-1 text-gray-800 dark:text-gray-200">{t.q}</span>
                  <span className="tabular-nums text-gray-400">{t.n}</span>
                </li>
              ))}
              {data.termsRecent.length === 0 && <li className="text-gray-400">Nothing yet this week.</li>}
            </ol>
          </div>
        </div>

        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:underline">
            All-time top 40 terms
          </summary>
          <ol className="mt-2 columns-2 gap-6 text-sm sm:columns-3">
            {data.termsAll.map((t) => (
              <li key={t.q} className="flex justify-between gap-2 break-inside-avoid">
                <span className="min-w-0 line-clamp-1 text-gray-800 dark:text-gray-200">{t.q}</span>
                <span className="tabular-nums text-gray-400">{t.n}</span>
              </li>
            ))}
          </ol>
        </details>

        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:underline">
            {'People watch · '}{data.peopleHits.length}{' retained hits'}
          </summary>
          <p className="mt-1 text-xs text-gray-400">Every retained search that names you or the circle.</p>
          <ol className="mt-2 space-y-1 text-sm">
            {data.peopleHits.map((h, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-xs tabular-nums text-gray-400 w-28 shrink-0">{timeET.format(h.t)}</span>
                <span className="rounded bg-rose-100 dark:bg-rose-900/40 px-1.5 py-0.5 text-xs text-rose-800 dark:text-rose-200">{h.term}</span>
                <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">“{h.q}”</span>
                {h.mine && <span className="text-xs text-amber-600 dark:text-amber-300">you</span>}
                {h.sid && sidSet.has(h.sid) && <a href={`#s-${h.sid}`} className="text-xs text-gray-500 underline">session →</a>}
              </li>
            ))}
            {data.peopleHits.length === 0 && <li className="text-gray-400">None recorded.</li>}
          </ol>
        </details>
      </section>

      {/* ---------------- Journeys ---------------- */}
      <section id="begin" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Journeys</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The week’s most engaged visits, each as one card: who they are (what they typed on /begin), where they came from, and what they actually did — no clicking required.
        </p>
        <ol className="mt-4 space-y-3">
          {journeys.map(({ s, landing, searches, reads, follows, begins }) => (
            <li key={s.id} className="rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-3 sm:px-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                <span className="font-medium text-gray-900 dark:text-gray-100">{timeET.format(s.start)}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {s.mins < 1 ? '<1 min' : s.mins < 60 ? `${s.mins} min` : `${Math.floor(s.mins / 60)}h ${s.mins % 60}m`}
                  {' · '}{s.pages}{' page'}{s.pages === 1 ? '' : 's'}
                  {s.texts > 0 && <>{' · '}{s.texts}{' text'}{s.texts === 1 ? '' : 's'}</>}
                </span>
                {s.ref && (
                  <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs text-gray-600 dark:text-gray-300">{'via '}{s.ref}</span>
                )}
                {s.badges.includes('first visit') && (
                  <span className="rounded bg-sky-100 dark:bg-sky-900/40 px-1.5 py-0.5 text-xs text-sky-800 dark:text-sky-200">first visit</span>
                )}
                {s.badges.filter((b) => b.startsWith('returning')).map((b) => (
                  <span key={b} className="rounded bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 text-xs text-emerald-800 dark:text-emerald-200">{b}</span>
                ))}
              </div>
              {begins.map((b, i) => (
                <div key={i} className="mt-2">
                  {b.label.startsWith('“') ? (
                    <blockquote className="font-serif text-[15px] italic leading-snug text-gray-900 dark:text-gray-100">{b.label}</blockquote>
                  ) : (
                    <span className="text-sm text-gray-700 dark:text-gray-300">{'Generated a path from: '}{b.label}</span>
                  )}
                  {b.href && <a href={b.href} className="ml-2 text-xs text-gray-500 underline">their path →</a>}
                </div>
              ))}
              <dl className="mt-2 space-y-1 text-sm">
                {landing && (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-xs uppercase tracking-wide text-gray-400 pt-0.5">entered</dt>
                    <dd className="min-w-0 text-gray-700 dark:text-gray-300">{landing}</dd>
                  </div>
                )}
                {searches.length > 0 && (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-xs uppercase tracking-wide text-gray-400 pt-0.5">searched</dt>
                    <dd className="min-w-0 break-words text-gray-700 dark:text-gray-300">
                      {searches.slice(0, 4).map((q) => `“${q}”`).join(' · ')}
                      {searches.length > 4 && <span className="text-gray-400">{' +'}{searches.length - 4}{' more'}</span>}
                    </dd>
                  </div>
                )}
                {reads.length > 0 && (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-xs uppercase tracking-wide text-gray-400 pt-0.5">read</dt>
                    <dd className="min-w-0 text-gray-900 dark:text-gray-100">
                      {reads.slice(0, 4).map((r, i) => (
                        <span key={i}>
                          {i > 0 && <span className="text-gray-400">{' · '}</span>}
                          {r.href ? <Link href={r.href} className="hover:underline">{r.label}</Link> : r.label}
                        </span>
                      ))}
                      {reads.length > 4 && <span className="text-gray-400">{' +'}{reads.length - 4}{' more'}</span>}
                    </dd>
                  </div>
                )}
                {follows.length > 0 && (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-xs uppercase tracking-wide text-gray-400 pt-0.5">followed</dt>
                    <dd className="min-w-0 text-emerald-700 dark:text-emerald-300">{follows.join(' · ')}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-2 text-xs">
                <a href={`#s-${s.id}`} className="text-gray-500 underline">full trail →</a>
              </div>
            </li>
          ))}
          {journeys.length === 0 && <li className="text-sm text-gray-400">No engaged visits in the last 7 days.</li>}
        </ol>

        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:underline">
            {'All generated reading paths · '}{data.beginPaths.length}
          </summary>
          <ol className="mt-3 space-y-2 text-sm">
            {data.beginPaths.map((b, i) => (
              <li key={`${b.id}-${i}`} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-xs tabular-nums text-gray-400 w-28 shrink-0">{timeET.format(b.t)}</span>
                {b.interests.map((it) => (
                  <span key={it} className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs text-gray-700 dark:text-gray-300">{it}</span>
                ))}
                {b.text && <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">“{b.text}”</span>}
                <a href={`/begin/p/${b.id}`} className="text-xs text-gray-500 underline">{b.n}{' texts →'}</a>
                {b.fb && <span className="text-xs text-rose-600 dark:text-rose-300">fallback</span>}
                {b.mine && <span className="text-xs text-amber-600 dark:text-amber-300">you</span>}
                {b.sid && sidSet.has(b.sid) && <a href={`#s-${b.sid}`} className="text-xs text-gray-500 underline">session →</a>}
              </li>
            ))}
            {data.beginPaths.length === 0 && <li className="text-gray-400">None generated yet.</li>}
          </ol>
        </details>
      </section>

      {/* ---------------- Reading ---------------- */}
      <section id="reading" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Read most recently</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The last texts readers actually finished with (≥50% depth, ≥90s) — yours excluded.
        </p>
        <ol className="mt-3 space-y-1.5 text-sm">
          {data.recentReads.map((r, i) => (
            <li key={i} className="flex flex-wrap items-baseline gap-x-2">
              <span className="w-28 shrink-0 text-xs tabular-nums text-gray-400">{timeET.format(r.t)}</span>
              {r.href ? (
                <Link href={r.href} className="text-gray-900 dark:text-gray-100 hover:underline">{r.title}</Link>
              ) : (
                <span className="text-gray-900 dark:text-gray-100">{r.title}</span>
              )}
              {r.sid && sidSet.has(r.sid) && <a href={`#s-${r.sid}`} className="text-xs text-gray-500 underline">session →</a>}
            </li>
          ))}
          {data.recentReads.length === 0 && <li className="text-gray-400">No completed reads logged yet.</li>}
        </ol>

        <details className="mt-5">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:underline">
            Most read — past two months and all time
          </summary>
          <div className="mt-3 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Past two months</h3>
              <ol className="mt-2 space-y-1.5 text-sm">
                {data.topRecent.map((p, i) => (
                  <li key={p.slug} className="flex gap-2">
                    <span className="w-5 shrink-0 text-right tabular-nums text-gray-400">{i + 1}</span>
                    <span className="min-w-0">
                      <Link href={`/post/${p.slug}`} className="text-gray-900 dark:text-gray-100 hover:underline">{p.title}</Link>
                      <span className="ml-1.5 text-xs text-gray-400">{p.source}{' · '}{p.n}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">All time</h3>
              <ol className="mt-2 space-y-1.5 text-sm">
                {data.topAll.map((p, i) => (
                  <li key={p.slug} className="flex gap-2">
                    <span className="w-5 shrink-0 text-right tabular-nums text-gray-400">{i + 1}</span>
                    <span className="min-w-0">
                      <Link href={`/post/${p.slug}`} className="text-gray-900 dark:text-gray-100 hover:underline">{p.title}</Link>
                      <span className="ml-1.5 text-xs text-gray-400">{p.source}{' · '}{p.n}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </details>
      </section>

      {/* ---------------- Ask answers ---------------- */}
      <section id="answers" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Ask answers</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          What the AI actually told readers — the full answer behind each recent Ask question. Click a question to read it.
        </p>
        <ol className="mt-3 space-y-2 text-sm">
          {data.askAnswers.map((h, i) => (
            <li key={`${h.t}-${i}`}>
              <details>
                <summary className="cursor-pointer flex flex-wrap items-baseline gap-x-2">
                  <span className="text-xs tabular-nums text-gray-400 w-28 shrink-0">{timeET.format(h.t)}</span>
                  <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">“{h.q}”</span>
                  {h.concept && <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs text-gray-700 dark:text-gray-300">from {h.concept}</span>}
                  {h.fresh && <span className="text-xs text-gray-400">regenerate</span>}
                  {h.cut && <span className="text-xs text-rose-600 dark:text-rose-300">truncated</span>}
                </summary>
                <div className="mt-2 ml-28 max-w-2xl whitespace-pre-wrap rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-[13px] leading-relaxed text-gray-700 dark:text-gray-300">
                  {h.a}{h.aLen ? ` … [${h.aLen} chars total]` : ''}
                </div>
              </details>
            </li>
          ))}
          {data.askAnswers.length === 0 && <li className="text-gray-400">None recorded yet — answers are kept from today forward.</li>}
        </ol>
      </section>

      {/* ---------------- Sessions ---------------- */}
      <section id="sessions" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sessions</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {'Whole visits, newest first — pages opened, texts read ('}
          <span className="text-xs uppercase">read ✓</span>
          {'), searches run, reading paths generated, follows clicked. Trails with page data start '}
          {data.activitySince}
          {'; older sessions are search-bursts from the retained log (“pre-ID era”).'}
        </p>
        <div className="mt-4">
          <SessionsExplorer sessions={data.sessions} />
        </div>
      </section>

      {/* ---------------- Readers ---------------- */}
      <section id="readers" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Most engaged readers</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {'Signed-in readers by score (minutes read + 2 × new searches + 5 × idioms saved). Shown here only — there is no public leaderboard. Usernames, never emails.'}
        </p>
        {readers.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No signed-in reader has a score yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm tabular-nums">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 pr-3 font-medium">#</th>
                  <th className="py-2 pr-3 font-medium">Username</th>
                  <th className="py-2 pr-3 font-medium text-right">Read</th>
                  <th className="py-2 pr-3 font-medium text-right">Searches</th>
                  <th className="py-2 pr-3 font-medium text-right">Idioms</th>
                  <th className="py-2 font-medium text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {readers.map((r, i) => (
                  <tr key={r.username} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-3 text-gray-500 dark:text-gray-400">{i + 1}</td>
                    <td className="py-2 pr-3 font-medium text-gray-900 dark:text-gray-100">{r.username}</td>
                    <td className="py-2 pr-3 text-right">{readTime(r.readSec)}</td>
                    <td className="py-2 pr-3 text-right">{r.searches}</td>
                    <td className="py-2 pr-3 text-right">{r.idioms}</td>
                    <td className="py-2 text-right font-semibold text-gray-900 dark:text-gray-100">{r.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ---------------- Feedback ---------------- */}
      <section id="feedback" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Feedback</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {'Notes sent from the footer’s Feedback button, newest first. A username appears only when the sender was signed in.'}
        </p>
        {feedback.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Nothing yet.</p>
        ) : (
          <ol className="mt-4 divide-y divide-gray-200 dark:divide-gray-700 border-y border-gray-200 dark:border-gray-700">
            {feedback.map((f, i) => (
              <li key={`${f.at}-${i}`} className="py-3">
                <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">{f.text}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {timeET.format(new Date(f.at))}{' · on '}{f.page}{f.username ? ` · ${f.username}` : ''}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
