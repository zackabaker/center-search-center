import Link from 'next/link';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { fetchStudyData, type DayRow } from './data';
import { buildInsights, readerSessions } from './derive';
import NotesEditor from './NotesEditor';
import SessionsExplorer from './SessionsExplorer';
import TrendsPanel from './TrendsPanel';
import { accountOverview, recentFeedback, topEngaged } from '@/lib/user-store';
import { listNotes } from '@/lib/analytics-notes';
import { listDigests } from '@/lib/analytics-digest';
import { gscConfigured, readGscSnapshot } from '@/lib/gsc';
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
  ['sources', 'Sources'],
  ['searches', 'Searches'],
  ['begin', 'Journeys'],
  ['reading', 'Reading'],
  ['answers', 'Answers'],
  ['sessions', 'Sessions'],
  ['readers', 'Accounts'],
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
  const accounts = await accountOverview(8).catch(() => null);
  const [notes, digests, gsc] = await Promise.all([listNotes(), listDigests(12), readGscSnapshot()]);
  const readTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
  };

  if (!data) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-14">
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
  // "session →" links: a tab's sid can span several episodes (sessions split
  // at 30-minute silences), so a link targets the episode covering the
  // event's timestamp, falling back to the sid's first episode.
  const episodesBySid = new Map<string, { id: string; start: number; end: number }[]>();
  for (const s of data.sessions) {
    if (s.kind !== 'live' || !s.sid) continue;
    const list = episodesBySid.get(s.sid) ?? [];
    list.push({ id: s.id, start: s.start, end: s.end });
    episodesBySid.set(s.sid, list);
  }
  const PAD = 30 * 60_000;
  const sessionAnchor = (sid?: string, t?: number): string | null => {
    if (!sid) return null;
    const eps = episodesBySid.get(sid);
    if (!eps) return null;
    if (typeof t === 'number') {
      const hit = eps.find((e) => t >= e.start - PAD && t <= e.end + PAD);
      if (hit) return `#s-${hit.id}`;
    }
    return `#s-${eps[0].id}`;
  };

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

  // --- "This week", in sentences (rule-based — see derive.ts) -------------
  const prev7 = data.days.slice(7, 14);
  // "Deepest" = most texts actually read, then longest — not the notability
  // score the journeys are ranked by.
  const deepest =
    readerSessions(data.sessions)
      .filter((s) => s.end >= weekAgoTs)
      .map((s) => ({ s, reads: s.events.filter((e) => e.type === 'read').length }))
      .filter((x) => x.reads > 0)
      .sort((a, b) => b.reads - a.reads || b.s.mins - a.s.mins)[0]?.s ?? null;
  const insights = buildInsights({
    movers: data.movers,
    aiRef: data.aiRef,
    crawlers: data.crawlers,
    search: data.searchOutcome,
    begin: data.beginFunnel,
    returns7: sum(d7, (r) => r.returns),
    returnsPrev7: sum(prev7, (r) => r.returns),
    follows7: sum(d7, (r) => r.follows),
    followsPrev7: sum(prev7, (r) => r.follows),
    newAccounts7: accounts?.last7 ?? 0,
    topJourney: deepest,
    completion: data.completion.n > 0 ? data.completion : null,
  });
  // Only the most notable sessions are serialized below; link to one only if
  // its trail is actually on the page.
  const sessionIds = new Set(data.sessions.map((s) => s.id));
  // A text's own stats page, from its public href.
  const statsHref = (href?: string) =>
    href?.startsWith('/post/') ? `/analytics${href}` : null;
  const share = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : '—');
  const deviceTotal = data.devices.m + data.devices.d;
  const langTotal = data.langs.reduce((a, l) => a + l.n, 0);

  return (
    // w-full matters: auto margins make <main> shrink-to-fit in the layout's
    // flex column, so without a definite width any table's min-width (even
    // inside its own scroll container) widens the whole page on phones.
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
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
        <TrendsPanel days={data.days} weeks={data.weeklySearches} engaged7={data.engaged7} notes={notes} />

        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:underline">
            {'Mark an event on the charts'}{notes.length > 0 && <>{' · '}{notes.length}{' marked'}</>}
          </summary>
          <p className="mt-1 text-xs text-gray-400">
            Posted a thread, gave a talk, shipped a change? Pin it to the day — a ◆ appears on every chart whose range includes it, so you can see what moved the lines.
          </p>
          <div className="mt-3">
            <NotesEditor notes={notes} today={data.days[0].day} />
          </div>
        </details>

        {insights.length > 0 && (
          <div className="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-3 sm:px-4">
            <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">This week</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {insights.map((it, i) => (
                <li key={i} className="flex gap-2">
                  <span
                    aria-hidden
                    className={`w-3 shrink-0 text-center ${
                      it.tone === 'up'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : it.tone === 'down'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-gray-400'
                    }`}
                  >
                    {it.tone === 'up' ? '↑' : it.tone === 'down' ? '↓' : '·'}
                  </span>
                  <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">
                    {it.text}
                    {it.href && (
                      <a href={it.href} className="ml-1.5 text-xs text-gray-500 underline">see →</a>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {digests.length > 0 && (
          <details className="mt-3">
            <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:underline">
              {'Past weeks · '}{digests.length}{' weekly digest'}{digests.length === 1 ? '' : 's'}
            </summary>
            <ol className="mt-3 space-y-5">
              {digests.map((d) => (
                <li key={d.week}>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {'Week to '}{dayLabel(d.week, true)}
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-4 text-xs tabular-nums text-gray-500 dark:text-gray-400">
                    {d.stats.map((st) => {
                      const p = st.prev > 0 ? Math.round(((st.cur - st.prev) / st.prev) * 100) : null;
                      return (
                        <span key={st.label}>
                          {st.label}{' '}{st.cur.toLocaleString('en-US')}
                          {p !== null && <>{' ('}{p > 0 ? '+' : ''}{p}{'%)'}</>}
                        </span>
                      );
                    })}
                  </div>
                  <ul className="mt-1.5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {d.lines.map((line, i) => (
                      <li key={i} className="break-words">{'· '}{line}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </details>
        )}

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

      {/* ---------------- Sources ---------------- */}
      <section id="sources" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Where readers come from</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Arrivals by source, and whether each source sends people who stay. “Stayed” = did more than land; “read” = finished a text (half the page, 90+ seconds). Quality columns cover the recent trail window only.
        </p>
        {data.sources.length === 0 ? (
          <p className="mt-3 text-sm text-gray-400">No referred arrivals recorded yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm tabular-nums">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <th className="py-1.5 pr-3 font-normal">Source</th>
                  <th className="py-1.5 pr-3 font-normal text-right">7 days</th>
                  <th className="py-1.5 pr-3 font-normal text-right">30 days</th>
                  <th className="py-1.5 pr-3 font-normal text-right">Stayed</th>
                  <th className="py-1.5 pr-0 font-normal text-right">Read</th>
                </tr>
              </thead>
              <tbody>
                {data.sources.map((r) => (
                  <tr key={r.name} className="border-b border-gray-100 dark:border-gray-900">
                    <td className="py-1.5 pr-3 text-gray-900 dark:text-gray-100">
                      {r.name}
                      {r.ai && (
                        <span className="ml-1.5 rounded bg-indigo-100 dark:bg-indigo-900/40 px-1.5 py-0.5 text-[10px] font-medium text-indigo-800 dark:text-indigo-200">AI</span>
                      )}
                    </td>
                    <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{r.visits7 || '·'}</td>
                    <td className="py-1.5 pr-3 text-right text-gray-900 dark:text-gray-100">{r.visits30 || '·'}</td>
                    <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">
                      {r.sessions > 0 ? <>{share(r.stayed, r.sessions)}<span className="ml-1 text-xs text-gray-400">{r.stayed}/{r.sessions}</span></> : '·'}
                    </td>
                    <td className="py-1.5 pr-0 text-right text-gray-700 dark:text-gray-300">{r.read || '·'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {'AI assistants sent '}{data.aiRef.total7}{' reader'}{data.aiRef.total7 === 1 ? '' : 's'}{' this week, '}
          {data.aiRef.total30}{' in 30 days'}
          {data.aiRef.byProduct.length > 0 && <>{' ('}{data.aiRef.byProduct.map((b) => `${b.name} ${b.n}`).join(', ')}{')'}</>}
          {'. A floor: the assistants’ mobile apps strip the referrer, and Search Console can’t see this traffic at all.'}
        </p>
        {deviceTotal > 0 && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {'Of '}{deviceTotal.toLocaleString('en-US')}{' new sessions since Nov 17: phones '}{share(data.devices.m, deviceTotal)}{', larger screens '}{share(data.devices.d, deviceTotal)}
            {langTotal > 0 && <>{' · browser languages: '}{data.langs.map((l) => `${l.l} ${share(l.n, langTotal)}`).join(', ')}</>}
            {'. Every JS-running tab counts, bots included — a language far out of line with your readership is a bot signature.'}
          </p>
        )}

        <h3 id="google" className="mt-8 text-sm font-semibold text-gray-700 dark:text-gray-300">Google Search</h3>
        {gsc ? (
          <>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium tabular-nums">{gsc.totals.clicks.toLocaleString('en-US')}</span>{' clicks'}
              {gsc.prevTotals && gsc.prevTotals.clicks > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {' ('}{gsc.totals.clicks >= gsc.prevTotals.clicks ? '+' : ''}
                  {Math.round(((gsc.totals.clicks - gsc.prevTotals.clicks) / gsc.prevTotals.clicks) * 100)}{'% vs the 28 days before)'}
                </span>
              )}
              {' · '}<span className="font-medium tabular-nums">{gsc.totals.impressions.toLocaleString('en-US')}</span>{' impressions · '}
              <span className="font-medium tabular-nums">{(gsc.totals.ctr * 100).toFixed(1)}%</span>{' CTR · average position '}
              <span className="font-medium tabular-nums">{gsc.totals.position.toFixed(1)}</span>
              <span className="ml-1.5 text-xs text-gray-400">{dayLabel(gsc.start)}{' – '}{dayLabel(gsc.end)}</span>
            </p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm tabular-nums">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    <th className="py-1.5 pr-3 font-normal">Query on Google</th>
                    <th className="py-1.5 pr-3 font-normal text-right">Clicks</th>
                    <th className="py-1.5 pr-3 font-normal text-right">Shown</th>
                    <th className="py-1.5 pr-3 font-normal text-right">CTR</th>
                    <th className="py-1.5 pr-0 font-normal text-right">Position</th>
                  </tr>
                </thead>
                <tbody>
                  {gsc.queries.slice(0, 20).map((q) => (
                    <tr key={q.key} className="border-b border-gray-100 dark:border-gray-900">
                      <td className="py-1.5 pr-3 text-gray-900 dark:text-gray-100"><span className="line-clamp-1 break-words">{q.key}</span></td>
                      <td className="py-1.5 pr-3 text-right text-gray-900 dark:text-gray-100">{q.clicks}</td>
                      <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{q.impressions.toLocaleString('en-US')}</td>
                      <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{(q.ctr * 100).toFixed(1)}%</td>
                      <td className="py-1.5 pr-0 text-right text-gray-700 dark:text-gray-300">{q.position.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:underline">Pages Google sends people to</summary>
              <ol className="mt-2 space-y-1 text-sm">
                {gsc.pages.slice(0, 25).map((p) => (
                  <li key={p.key} className="flex justify-between gap-3">
                    <span className="min-w-0 break-all text-gray-800 dark:text-gray-200">{p.key.replace(/^https?:\/\/[^/]+/, '') || '/'}</span>
                    <span className="shrink-0 tabular-nums text-gray-400">{p.clicks}{' clicks · '}{p.impressions.toLocaleString('en-US')}{' shown'}</span>
                  </li>
                ))}
              </ol>
            </details>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
              {'From Search Console, refreshed daily (last '}{timeET.format(gsc.fetchedAt)}{' ET); its data runs about two days behind.'}
            </p>
          </>
        ) : (
          <p className="mt-1 text-sm text-gray-400">
            {gscConfigured()
              ? 'Credentials are set — the first import runs with the daily refresh.'
              : 'Not connected. It needs a Google service-account key in the GSC_SERVICE_ACCOUNT_JSON environment variable; the steps are in geo/analytics-roadmap.md.'}
          </p>
        )}

        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:underline">
            Where visits land — and whether the page holds them
          </summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm tabular-nums">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <th className="py-1.5 pr-3 font-normal">Landing page</th>
                  <th className="py-1.5 pr-3 font-normal text-right">Visits</th>
                  <th className="py-1.5 pr-3 font-normal text-right">Stayed</th>
                  <th className="py-1.5 pr-0 font-normal text-right">Read</th>
                </tr>
              </thead>
              <tbody>
                {data.landings.map((r) => (
                  <tr key={r.href ?? r.label} className="border-b border-gray-100 dark:border-gray-900">
                    <td className="py-1.5 pr-3 text-gray-900 dark:text-gray-100">
                      <span className="line-clamp-1 break-words">{r.label}</span>
                    </td>
                    <td className="py-1.5 pr-3 text-right text-gray-900 dark:text-gray-100">{r.sessions}</td>
                    <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{share(r.stayed, r.sessions)}</td>
                    <td className="py-1.5 pr-0 text-right text-gray-700 dark:text-gray-300">{r.read || '·'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
            Recent trail window, yours and likely crawlers excluded. A page with many visits and a low “stayed” share is mostly one-touch traffic — much of it JS-running bots on /search and /ask.
          </p>
        </details>

        <h3 id="ai-systems" className="mt-8 text-sm font-semibold text-gray-700 dark:text-gray-300">AI systems reading the archive</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Page fetches by AI crawlers and agents, counted where the request arrives (they never run the page’s JavaScript). “Live” = an assistant fetching the page to answer someone right then.
        </p>
        {data.crawlers.length === 0 ? (
          <p className="mt-3 text-sm text-gray-400">Counting began Nov 17 — fetches appear here as they happen.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm tabular-nums">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <th className="py-1.5 pr-3 font-normal">Agent</th>
                  <th className="py-1.5 pr-3 font-normal text-right">Today</th>
                  <th className="py-1.5 pr-3 font-normal text-right">7 days</th>
                  <th className="py-1.5 pr-3 font-normal text-right">30 days</th>
                  <th className="py-1.5 pr-0 font-normal">Fetched most</th>
                </tr>
              </thead>
              <tbody>
                {data.crawlers.map((c) => (
                  <tr key={c.family} className="border-b border-gray-100 dark:border-gray-900 align-top">
                    <td className="py-1.5 pr-3 whitespace-nowrap text-gray-900 dark:text-gray-100">
                      {c.family}
                      {c.kind && (
                        <span className={`ml-1.5 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          c.kind === 'live'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                        }`}>{c.kind}</span>
                      )}
                    </td>
                    <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{c.d1 || '·'}</td>
                    <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{c.d7 || '·'}</td>
                    <td className="py-1.5 pr-3 text-right text-gray-900 dark:text-gray-100">{c.d30}</td>
                    <td className="py-1.5 pr-0 text-xs text-gray-600 dark:text-gray-300">
                      <span className="line-clamp-2 break-words">
                        {c.topPaths.slice(0, 3).map((p) => `${p.label} (${p.n})`).join(' · ') || '·'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data.missing.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:underline">
              {'Broken links — 404s people hit · '}{data.missing.reduce((a, m) => a + m.n, 0)}{' in 14 days'}
            </summary>
            <ol className="mt-2 space-y-1 text-sm">
              {data.missing.map((m) => (
                <li key={m.path} className="flex justify-between gap-3">
                  <span className="min-w-0 break-all font-mono text-xs text-gray-800 dark:text-gray-200">{m.path}</span>
                  <span className="tabular-nums text-gray-400">{m.n}</span>
                </li>
              ))}
            </ol>
          </details>
        )}
      </section>

      {/* ---------------- Searches ---------------- */}
      <section id="searches" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">What readers search</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Every reader search, day by day (your own excluded). Open a day to read it in order; the session link opens the full trail.
        </p>
        <div className="mt-4 space-y-2">
          {data.searchDays.map((d, i) => {
            // Per-day searcher letters: same letter = same tab. Assigned by
            // first appearance so the day reads A, B, C… in order.
            const letters = new Map<string, string>();
            for (const it of d.items) {
              if (it.sid && !letters.has(it.sid)) {
                letters.set(it.sid, String.fromCharCode(65 + (letters.size % 26)));
              }
            }
            return (
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
                    {d.sids > 0 && <>{' · '}{d.sids}{' searcher'}{d.sids === 1 ? '' : 's'}</>}
                  </span>
                  {/* line-clamp (not truncate): nowrap text poisons every ancestor's
                      min-content width and forces the page wide on phones. */}
                  <span className="min-w-0 flex-1 line-clamp-1 text-xs text-gray-400 dark:text-gray-600">
                    {d.items.slice(-3).reverse().map((s) => `“${s.q}”`).join(' · ')}
                  </span>
                </summary>
                <ol className="border-t border-gray-100 dark:border-gray-900 px-3 py-2.5 sm:px-4 space-y-1 text-sm">
                  {d.items.map((s, j) => {
                    const anchor = sessionAnchor(s.sid, s.t);
                    return (
                      <li key={j} className="flex flex-wrap items-baseline gap-x-2">
                        <span className="w-16 shrink-0 text-xs tabular-nums text-gray-400">{timeOnlyET.format(s.t)}</span>
                        <span
                          className="w-4 shrink-0 text-center text-[10px] font-semibold rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          title="Same letter = same visitor (browser tab) that day"
                        >
                          {s.sid ? letters.get(s.sid) : '·'}
                        </span>
                        <span className="text-xs uppercase tracking-wide text-gray-400">{s.mode === 'ask' ? 'ai' : 'kw'}</span>
                        <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">“{s.q}”</span>
                        {typeof s.n === 'number' && s.n === 0 && <span className="text-xs text-rose-600 dark:text-rose-300">0 results</span>}
                        {anchor && <a href={anchor} className="text-xs text-gray-500 underline">session →</a>}
                      </li>
                    );
                  })}
                  {d.n > d.items.length && (
                    <li className="text-xs text-gray-400">{'… '}{d.n - d.items.length}{' more that day'}</li>
                  )}
                </ol>
              </details>
            );
          })}
          {data.searchDays.length === 0 && <p className="text-sm text-gray-400">Nothing logged yet.</p>}
        </div>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
          Letters distinguish searchers within a day: same letter, same visitor. A dot means the search carried no tab id.
        </p>

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

        <details id="no-click" className="mt-3">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:underline">
            {'Searched, opened nothing · '}
            {data.searchOutcome.searches - data.searchOutcome.opened}{' of '}{data.searchOutcome.searches}
            {' keyword searches in 14 days ('}
            {share(data.searchOutcome.searches - data.searchOutcome.opened, data.searchOutcome.searches)}{')'}
          </summary>
          <p className="mt-1 text-xs text-gray-400">
            Searches that returned results but where the visitor’s next move wasn’t a result, a text or a concept page — ranking and vocabulary misses. Half-typed queries are left out.
          </p>
          <ol className="mt-2 space-y-1 text-sm">
            {data.searchOutcome.noClick.map((m) => (
              <li key={m.q} className="flex flex-wrap items-baseline gap-x-2">
                <span className="w-28 shrink-0 text-xs tabular-nums text-gray-400">{timeET.format(m.t)}</span>
                <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">“{m.q}”</span>
                {m.times > 1 && <span className="text-xs text-gray-400">×{m.times}</span>}
                <a href={`/search?q=${encodeURIComponent(m.q)}`} className="text-xs text-gray-500 underline">try it →</a>
                {sessionIds.has(m.anchor.slice(3)) && <a href={m.anchor} className="text-xs text-gray-500 underline">session →</a>}
              </li>
            ))}
            {data.searchOutcome.noClick.length === 0 && <li className="text-gray-400">None in the window.</li>}
          </ol>
        </details>

        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:underline">
            {'People watch · '}{data.peopleHits.length}{' retained hits'}
          </summary>
          <p className="mt-1 text-xs text-gray-400">Every retained search that names you or the circle.</p>
          <ol className="mt-2 space-y-1 text-sm">
            {data.peopleHits.map((h, i) => {
              const anchor = sessionAnchor(h.sid, h.t);
              return (
                <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-xs tabular-nums text-gray-400 w-28 shrink-0">{timeET.format(h.t)}</span>
                  <span className="rounded bg-rose-100 dark:bg-rose-900/40 px-1.5 py-0.5 text-xs text-rose-800 dark:text-rose-200">{h.term}</span>
                  <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">“{h.q}”</span>
                  {h.mine && <span className="text-xs text-amber-600 dark:text-amber-300">you</span>}
                  {anchor && <a href={anchor} className="text-xs text-gray-500 underline">session →</a>}
                </li>
              );
            })}
            {data.peopleHits.length === 0 && <li className="text-gray-400">None recorded.</li>}
          </ol>
        </details>
      </section>

      {/* ---------------- Journeys ---------------- */}
      <section id="begin" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Journeys</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The week’s most engaged visits, each as one card: who they are (what they typed on /begin), where they came from, and what they actually did — no clicking required.
          {' “Read” is strict: they got at least halfway down the text and stayed on it 90+ seconds.'}
        </p>
        {data.beginFunnel.generated > 0 && (
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {'Reading paths lately: '}
            <span className="font-medium tabular-nums">{data.beginFunnel.generated}</span>{' generated → '}
            <span className="font-medium tabular-nums">{data.beginFunnel.opened}</span>{' opened a text → '}
            <span className="font-medium tabular-nums">{data.beginFunnel.read}</span>{' read one → '}
            <span className="font-medium tabular-nums">{data.beginFunnel.returned}</span>{' came back'}
            <span className="ml-1.5 text-xs text-gray-400">{'(readers, recent trail window)'}</span>
          </p>
        )}
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
                {s.ai ? (
                  <span className="rounded bg-indigo-100 dark:bg-indigo-900/40 px-1.5 py-0.5 text-xs text-indigo-800 dark:text-indigo-200">{'via '}{s.ai}{' (AI)'}</span>
                ) : s.ref ? (
                  <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs text-gray-600 dark:text-gray-300">{'via '}{s.ref}</span>
                ) : null}
                {s.device === 'm' && (
                  <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs text-gray-600 dark:text-gray-300">phone</span>
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
            {data.beginPaths.map((b, i) => {
              const anchor = sessionAnchor(b.sid, b.t);
              return (
                <li key={`${b.id}-${i}`} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-xs tabular-nums text-gray-400 w-28 shrink-0">{timeET.format(b.t)}</span>
                  {b.interests.map((it) => (
                    <span key={it} className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs text-gray-700 dark:text-gray-300">{it}</span>
                  ))}
                  {b.text && <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">“{b.text}”</span>}
                  <a href={`/begin/p/${b.id}`} className="text-xs text-gray-500 underline">{b.n}{' texts →'}</a>
                  {b.fb && <span className="text-xs text-rose-600 dark:text-rose-300">fallback</span>}
                  {b.mine && <span className="text-xs text-amber-600 dark:text-amber-300">you</span>}
                  {anchor && <a href={anchor} className="text-xs text-gray-500 underline">session →</a>}
                </li>
              );
            })}
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
          {data.recentReads.map((r, i) => {
            const anchor = sessionAnchor(r.sid, r.t);
            return (
              <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                <span className="w-28 shrink-0 text-xs tabular-nums text-gray-400">{timeET.format(r.t)}</span>
                {r.href ? (
                  <Link href={r.href} className="text-gray-900 dark:text-gray-100 hover:underline">{r.title}</Link>
                ) : (
                  <span className="text-gray-900 dark:text-gray-100">{r.title}</span>
                )}
                {statsHref(r.href) && <Link href={statsHref(r.href)!} className="text-xs text-gray-500 underline">stats →</Link>}
                {anchor && <a href={anchor} className="text-xs text-gray-500 underline">session →</a>}
              </li>
            );
          })}
          {data.recentReads.length === 0 && <li className="text-gray-400">No completed reads logged yet.</li>}
        </ol>

        <h3 className="mt-8 text-sm font-semibold text-gray-700 dark:text-gray-300">Most opened this week</h3>
        <p className="mt-1 text-xs text-gray-400">Views in the last 7 days against the 7 before. Each title opens that text’s own stats page.</p>
        <ol className="mt-2 space-y-1.5 text-sm">
          {data.movers.map((m, i) => {
            const delta = m.prev > 0 ? Math.round(((m.cur - m.prev) / m.prev) * 100) : null;
            return (
              <li key={m.slug} className="flex gap-2">
                <span className="w-5 shrink-0 text-right tabular-nums text-gray-400">{i + 1}</span>
                <span className="min-w-0">
                  <Link href={`/analytics/post/${m.slug}`} className="text-gray-900 dark:text-gray-100 hover:underline">{m.label}</Link>
                  <span className="ml-1.5 text-xs tabular-nums text-gray-500 dark:text-gray-400">{m.cur}{' views'}</span>
                  <span className={`ml-1.5 text-xs tabular-nums ${
                    delta === null
                      ? 'text-gray-400'
                      : delta >= 0
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-rose-700 dark:text-rose-300'
                  }`}>
                    {delta === null ? (m.prev === 0 ? 'new this week' : '') : `${delta > 0 ? '+' : ''}${delta}% (was ${m.prev})`}
                  </span>
                </span>
              </li>
            );
          })}
          {data.movers.length === 0 && <li className="text-gray-400">No text views in the last 7 days.</li>}
        </ol>

        <h3 className="mt-8 text-sm font-semibold text-gray-700 dark:text-gray-300">How far readers get</h3>
        <p className="mt-1 text-xs text-gray-400">
          Of the reader sessions that opened each text (30 days): the share that got at least halfway, three-quarters, and to the end — and the share that stayed 90+ seconds. A text people open but don’t get through sits low on the right.
        </p>
        {data.depthPosts.length === 0 ? (
          <p className="mt-2 text-sm text-gray-400">Depth tracking began Nov 17 — this fills in as readers read.</p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm tabular-nums">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <th className="py-1.5 pr-3 font-normal">Text</th>
                  <th className="py-1.5 pr-3 font-normal text-right">Opened</th>
                  <th className="py-1.5 pr-3 font-normal text-right">≥ 50%</th>
                  <th className="py-1.5 pr-3 font-normal text-right">≥ 75%</th>
                  <th className="py-1.5 pr-3 font-normal text-right">End</th>
                  <th className="py-1.5 pr-0 font-normal text-right">90s+</th>
                </tr>
              </thead>
              <tbody>
                {data.depthPosts.slice(0, 25).map((p) => (
                  <tr key={p.slug} className="border-b border-gray-100 dark:border-gray-900">
                    <td className="py-1.5 pr-3">
                      <Link href={`/analytics/post/${p.slug}`} className="line-clamp-1 break-words text-gray-900 dark:text-gray-100 hover:underline">{p.title}</Link>
                    </td>
                    <td className="py-1.5 pr-3 text-right text-gray-900 dark:text-gray-100">{p.n}</td>
                    <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{share(p.reach50, p.n)}</td>
                    <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{share(p.reach75, p.n)}</td>
                    <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{share(p.done, p.n)}</td>
                    <td className="py-1.5 pr-0 text-right text-gray-700 dark:text-gray-300">{share(p.lingered, p.n)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Read together</h3>
            <p className="mt-1 text-xs text-gray-400">Pairs of texts finished in the same visit, by how often.</p>
            <ol className="mt-2 space-y-2 text-sm">
              {data.coReads.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-6 shrink-0 text-right tabular-nums text-gray-400">{p.n}×</span>
                  <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">
                    {p.a.href ? <Link href={p.a.href} className="hover:underline">{p.a.label}</Link> : p.a.label}
                    <span className="text-gray-400">{' + '}</span>
                    {p.b.href ? <Link href={p.b.href} className="hover:underline">{p.b.label}</Link> : p.b.label}
                  </span>
                </li>
              ))}
              {data.coReads.length === 0 && <li className="text-gray-400">No pair has repeated yet in the recent window.</li>}
            </ol>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Texts that lead to a follow</h3>
            <p className="mt-1 text-xs text-gray-400">Where readers were when they clicked out to Substack, X or RSS.</p>
            <ol className="mt-2 space-y-1.5 text-sm">
              {data.followPosts.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-6 shrink-0 text-right tabular-nums text-gray-400">{p.n}×</span>
                  <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">
                    {p.href ? <Link href={p.href} className="hover:underline">{p.label}</Link> : p.label}
                  </span>
                </li>
              ))}
              {data.followPosts.length === 0 && <li className="text-gray-400">No follow clicks from a text in the recent window.</li>}
            </ol>
          </div>
        </div>

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
                      <Link href={`/analytics/post/${p.slug}`} className="ml-1.5 text-xs text-gray-500 underline">stats →</Link>
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
                      <Link href={`/analytics/post/${p.slug}`} className="ml-1.5 text-xs text-gray-500 underline">stats →</Link>
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
          {data.weakAsks > 0 && (
            <>{' '}<span className="text-rose-700 dark:text-rose-300">{data.weakAsks}{' of the recent answers read like “the archive doesn’t cover this”'}</span>{' — marked below; each is a gap worth a look.'}</>
          )}
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
                  {h.weak && <span className="rounded bg-rose-100 dark:bg-rose-900/40 px-1.5 py-0.5 text-xs text-rose-800 dark:text-rose-200">no real answer?</span>}
                </summary>
                <div className="mt-2 sm:ml-28 max-w-2xl whitespace-pre-wrap [overflow-wrap:anywhere] rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-[13px] leading-relaxed text-gray-700 dark:text-gray-300">
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
          {'), searches run, reading paths generated, follows clicked. A tab quiet for 30+ minutes starts a new visit (restored tabs used to stitch into one days-long “session”). Trails with page data start '}
          {data.activitySince}
          {'; older sessions are search-bursts from the retained log (“pre-ID era”).'}
        </p>
        <div className="mt-4">
          <SessionsExplorer sessions={data.sessions} />
        </div>
      </section>

      {/* ---------------- Accounts ---------------- */}
      <section id="readers" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Accounts</h2>

        {accounts && (
          <>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <span className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                {accounts.total.toLocaleString('en-US')}
                <span className="ml-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">account{accounts.total === 1 ? '' : 's'}</span>
              </span>
              <span className="text-sm tabular-nums text-gray-600 dark:text-gray-300">{'+'}{accounts.last7}{' this week'}</span>
              <span className="text-sm tabular-nums text-gray-600 dark:text-gray-300">{'+'}{accounts.last30}{' this month'}</span>
            </div>
            {accounts.newest.length > 0 && (
              <ol className="mt-3 space-y-1 text-sm">
                {accounts.newest.map((a) => (
                  <li key={a.username} className="flex flex-wrap items-baseline gap-x-2">
                    <span className="w-28 shrink-0 text-xs tabular-nums text-gray-400">{'joined '}{fmtDayShort.format(a.createdAt)}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{a.username}</span>
                    <span className="text-xs text-gray-400">{a.score > 0 ? `score ${a.score}` : 'no activity yet'}</span>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
              {'Signup index started Nov 17, 2026 — engaged accounts were backfilled with their real creation dates; dormant ones join the count when they next sign in.'}
            </p>
          </>
        )}

        <h3 className="mt-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Most engaged</h3>
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
