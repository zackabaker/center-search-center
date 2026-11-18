import Link from 'next/link';
import { recentPostNotes } from './data';
import { buildFreshInsights, buildInsights } from './derive';
import { buildReachCharts, buildReachInsights } from './reach';
import { loadConsole } from './load';
import NotesEditor from './NotesEditor';
import OppList from './OppList';
import TrendsPanel from './TrendsPanel';
import XReachPanel from './XReachPanel';
import {
  InsightList, JourneyCard, Unavailable, dayLabel, fmt, fold, sessionHref, statsHref, sum, thead,
  timeET, timeOnlyET, topJourneys,
} from './ui';
import { accountOverview } from '@/lib/user-store';
import { listNotes } from '@/lib/analytics-notes';
import { listDigests } from '@/lib/analytics-digest';
import { readGscSnapshot } from '@/lib/gsc';
import { readX } from '@/lib/x-analytics';
import { readAllGrowth } from '@/lib/growth';
import { KIND_LABEL, buildOpportunities, oppStatuses } from '@/lib/opportunities';

// /analytics — the overview. One screen: how the lines are moving, what the
// week amounted to in sentences, the few things most worth doing, and the
// latest of what readers searched, read and did. Everything else lives in
// the rooms (see RoomNav).

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const data = await loadConsole();
  if (!data) return <Unavailable />;

  const [accounts, notes, digests, gsc, statuses, xSnap, growth] = await Promise.all([
    accountOverview(1).catch(() => null),
    listNotes(),
    listDigests(12),
    readGscSnapshot(),
    oppStatuses(),
    readX().catch(() => null),
    readAllGrowth().catch(() => []),
  ]);
  const reach = buildReachCharts(data, xSnap, growth);

  const d7 = data.days.slice(0, 7);
  const prev7 = data.days.slice(7, 14);
  const d30 = data.days.slice(0, 30);

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
    completion: data.completion.n > 0 ? data.completion : null,
  });
  // data.days[0] is today, still partial — yesterday vs. the day before is
  // the freshest apples-to-apples comparison there is, and it moves every
  // day instead of once a week.
  const freshInsights = data.days[1] && data.days[2] ? buildFreshInsights(data.days[1], data.days[2]) : [];
  // The single most notable visit in the last day and a half — not the
  // week's best (that's "Journeys" below), the most recent thing worth a
  // look right now.
  const freshJourney = topJourneys(data, 1, 36 * 3_600_000)[0] ?? null;

  const openOpps = buildOpportunities(data, gsc).filter((o) => !statuses[o.id]);
  const journeys = topJourneys(data, 3);
  const latestDay = data.searchDays[0];
  // The owner's notes, the corpus's own events (a new essay published), and
  // X posting days — so the readers/searches/reads charts above can show
  // whether a day with more posts on X was also a day with more of either,
  // without a chart of its own.
  const xPostDays = new Map<string, number>();
  for (const p of xSnap?.posts.filter((p) => p.kind !== 'reply') ?? []) {
    const d = new Date(p.t).toISOString().slice(0, 10);
    xPostDays.set(d, (xPostDays.get(d) ?? 0) + 1);
  }
  const xPostNotes = [...xPostDays.entries()].map(([day, n]) => ({ day, label: `${n} post${n > 1 ? 's' : ''} on X` }));
  const chartNotes = [...notes, ...recentPostNotes(), ...xPostNotes];
  const reachInsights = buildReachInsights(reach);

  return (
    <>
      <TrendsPanel
        days={data.days}
        weeks={data.weeklySearches}
        notes={chartNotes}
        google={(gsc?.daily ?? []).map((g) => ({ day: g.day, clicks: g.clicks }))}
      />

      <details className="mt-3">
        <summary className={fold}>
          {'Mark an event on the charts'}{notes.length > 0 && <>{' · '}{notes.length}{' marked'}</>}
        </summary>
        <p className="mt-1 text-xs text-gray-400">
          Posted a thread, gave a talk, shipped a change? Pin it to the day — a ◆ appears on every chart whose range includes it, so you can see what moved the lines. A newly published essay, and every day with a post on X, is marked automatically.
        </p>
        <div className="mt-3">
          <NotesEditor notes={notes} today={data.days[0].day} />
        </div>
      </details>

      {(freshInsights.length > 0 || freshJourney) && (
        <section className="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-3 sm:px-4">
          <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Since yesterday</h2>
          {freshInsights.length > 0 && <InsightList insights={freshInsights} />}
          {freshJourney && (
            <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 mb-1">Most notable visit in the last day and a half:</p>
              <JourneyCard s={freshJourney} />
            </div>
          )}
        </section>
      )}

      {(insights.length > 0 || reachInsights.length > 0) && (
        <section className="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-3 sm:px-4">
          <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">This week</h2>
          <InsightList insights={[...insights, ...reachInsights]} />
        </section>
      )}

      {reach && (
        <XReachPanel
          impressions={reach.impressions}
          siteVisits={reach.siteVisits}
          followers={reach.followers}
          xShareOfReferred={reach.xShareOfReferred}
        />
      )}

      <section className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Latest searches</h2>
          <Link href="/analytics/searches" className="text-xs text-gray-500 underline">all searches →</Link>
        </div>
        <ol className="mt-2 space-y-1 text-sm">
          {(latestDay?.items ?? []).slice(-8).reverse().map((s, i) => {
            const href = sessionHref(data, s.sid, s.t);
            return (
              <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                <span className="w-16 shrink-0 text-xs tabular-nums text-gray-400">{timeOnlyET.format(s.t)}</span>
                <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">“{s.q}”</span>
                {s.n === 0 && <span className="text-xs text-rose-600 dark:text-rose-300">0 results</span>}
                {href && <Link href={href} className="text-xs text-gray-500 underline">visit →</Link>}
              </li>
            );
          })}
          {!latestDay && <li className="text-gray-400">Nothing logged yet.</li>}
        </ol>
        {latestDay && (
          <p className="mt-1 text-xs text-gray-400">
            {dayLabel(latestDay.day, true)}{' · '}{latestDay.n}{' search'}{latestDay.n === 1 ? '' : 'es'}
            {latestDay.sids > 0 && <>{' by '}{latestDay.sids}{' visitor'}{latestDay.sids === 1 ? '' : 's'}</>}
          </p>
        )}
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Worth doing</h2>
          <Link href="/analytics/opportunities" className="text-xs text-gray-500 underline">
            {'all '}{openOpps.length}{' open →'}
          </Link>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          What readers looked for and didn’t find, click, or get an answer to. Read these as hints worth a skim, not a verdict — a search that keeps recurring means more than one that happened once and never came back.
        </p>
        <OppList
          compact
          items={openOpps.slice(0, 4).map((o) => ({
            id: o.id, kindLabel: KIND_LABEL[o.kind], title: o.title, evidence: o.evidence, fix: o.fix, links: o.links,
          }))}
        />
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Read most recently</h2>
          <Link href="/analytics/reading" className="text-xs text-gray-500 underline">reading →</Link>
        </div>
        <ol className="mt-2 space-y-1 text-sm">
          {data.recentReads.slice(0, 7).map((r, i) => (
            <li key={i} className="flex flex-wrap items-baseline gap-x-2">
              <span className="w-28 shrink-0 text-xs tabular-nums text-gray-400">{timeET.format(r.t)}</span>
              {statsHref(r.href) ? (
                <Link href={statsHref(r.href)!} className="min-w-0 break-words text-gray-900 dark:text-gray-100 hover:underline">{r.title}</Link>
              ) : (
                <span className="min-w-0 break-words text-gray-900 dark:text-gray-100">{r.title}</span>
              )}
            </li>
          ))}
          {data.recentReads.length === 0 && <li className="text-gray-400">No completed reads logged yet.</li>}
        </ol>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Journeys this week</h2>
          <Link href="/analytics/journeys" className="text-xs text-gray-500 underline">all journeys →</Link>
        </div>
        <ol className="mt-3 space-y-3">
          {journeys.map((s) => <JourneyCard key={s.id} s={s} />)}
          {journeys.length === 0 && <li className="text-sm text-gray-400">No engaged visits in the last 7 days.</li>}
        </ol>
      </section>

      {digests.length > 0 && (
        <details className="mt-8">
          <summary className={fold}>
            {'Past weeks · '}{digests.length}{' weekly digest'}{digests.length === 1 ? '' : 's'}
          </summary>
          <ol className="mt-3 space-y-5">
            {digests.map((d) => (
              <li key={d.week}>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{'Week to '}{dayLabel(d.week, true)}</div>
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
                  {d.lines.map((line, i) => <li key={i} className="break-words">{'· '}{line}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </details>
      )}

      <details className="mt-3">
        <summary className={fold}>Day-by-day table (last 30)</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm tabular-nums">
            <thead>
              <tr className={thead}>
                <th className="py-1.5 pr-3 font-normal">Day</th>
                <th className="py-1.5 pr-3 font-normal text-right">Readers</th>
                <th className="py-1.5 pr-3 font-normal text-right">All tabs</th>
                <th className="py-1.5 pr-3 font-normal text-right">Searches</th>
                <th className="py-1.5 pr-3 font-normal text-right">Opens</th>
                <th className="py-1.5 pr-3 font-normal text-right">Reads</th>
                <th className="py-1.5 pr-3 font-normal text-right">Follows</th>
                <th className="py-1.5 pr-0 font-normal text-right">Returns</th>
              </tr>
            </thead>
            <tbody>
              {d30.map((r) => (
                <tr key={r.day} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="py-1.5 pr-3 whitespace-nowrap text-gray-700 dark:text-gray-300">{dayLabel(r.day, true)}</td>
                  <td className="py-1.5 pr-3 text-right text-gray-900 dark:text-gray-100">{fmt(r.readers)}</td>
                  <td className="py-1.5 pr-3 text-right text-gray-400">{fmt(r.uniq)}</td>
                  <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{Math.max(0, r.searches - r.searchesMine) || '·'}</td>
                  <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{r.opens || '·'}</td>
                  <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{Math.max(0, r.reads - r.readsMine) || '·'}</td>
                  <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{r.follows || '·'}</td>
                  <td className="py-1.5 pr-0 text-right text-gray-700 dark:text-gray-300">{r.returns || '·'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
          {'Days are UTC. Readers are people (see the note under the charts); “All tabs” is every browser tab that loaded a page and ran its script, most of them bots. Searches and reads leave yours out. Own counters since '}
          {data.activitySince}{'.'}
        </p>
      </details>

      <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
        {'Generated '}{timeET.format(data.generatedAt)}{' ET · all-time: '}{data.searchTotal.toLocaleString('en-US')}{' searches, '}
        {data.viewTotal.toLocaleString('en-US')}{' text views · '}
        <a className="underline" href="https://vercel.com/zack-bakers-projects/center-search-center/analytics" target="_blank" rel="noreferrer">Vercel Analytics</a>
        {' · '}
        <a className="underline" href="https://search.google.com/search-console?resource_id=sc-domain%3Acenter.study" target="_blank" rel="noreferrer">Search Console</a>
      </p>
    </>
  );
}
