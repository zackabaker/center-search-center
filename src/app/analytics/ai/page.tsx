import Link from 'next/link';
import { loadConsole } from '../load';
import TrendChart from '../TrendChart';
import { RoomHead, Unavailable, dayLabel, duration, sub, thead, timeET } from '../ui';
import { QUESTIONS, readCitations } from '@/lib/ai-citations';

// /analytics/ai — how the AI systems see the site, in the three places it
// can be measured: whether assistants cite it when asked (the mission's own
// yardstick), the readers they send, and the pages their crawlers and
// agents fetch.

export const dynamic = 'force-dynamic';

export default async function AiPage() {
  const data = await loadConsole();
  if (!data) return <Unavailable />;
  const report = await readCitations();
  const good = report.checks.filter((c) => !c.error);
  const cited = good.filter((c) => c.cited).length;
  const viaAi = data.allSessions
    .filter((s) => s.ai && !s.mine)
    .sort((a, b) => b.start - a.start)
    .slice(0, 12);

  return (
    <>
      <RoomHead title="AI">
        Three views of the same question — is center.study the source the AI systems reach for? What assistants cite when asked, the readers they send, and what their crawlers fetch.
      </RoomHead>

      <h2 className={sub}>Do assistants cite you?</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {QUESTIONS.length}{' questions people ask about Generative Anthropology are put to Claude with web search on, two a day, so each is re-asked about once a week. For every answer: was center.study among the sources it cited, and who was cited instead?'}
      </p>
      {good.length === 0 ? (
        <p className="mt-3 text-sm text-gray-400">
          {report.checks.length > 0
            ? 'The first checks ran into errors — they are retried on the next daily run.'
            : 'No checks have run yet — the first two go out with the next daily run.'}
        </p>
      ) : (
        <>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-3">
            <span className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
              {cited}{' of '}{good.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">answers cite center.study</span>
            {report.pending > 0 && (
              <span className="text-xs text-gray-400">{report.pending}{' question'}{report.pending === 1 ? '' : 's'}{' not checked yet'}</span>
            )}
          </p>
          {report.weekly.length >= 2 && (
            <div className="mt-4 max-w-md">
              <TrendChart
                title="Answers citing center.study / week (%)"
                points={report.weekly.map((w) => ({
                  label: `wk of ${dayLabel(w.week)}`,
                  value: w.total > 0 ? Math.round((w.cited / w.total) * 100) : 0,
                }))}
                colorClass="text-[#6250d6] dark:text-[#9085e9]"
                headline={`${Math.round((cited / good.length) * 100)}%`}
                deltaPct={null}
                deltaVs=""
              />
            </div>
          )}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className={thead}>
                  <th className="py-1.5 pr-3 font-normal">Question</th>
                  <th className="py-1.5 pr-3 font-normal">Cited you</th>
                  <th className="py-1.5 pr-3 font-normal">Cited instead</th>
                  <th className="py-1.5 pr-0 font-normal text-right">Checked</th>
                </tr>
              </thead>
              <tbody>
                {report.checks.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 dark:border-gray-900 align-top">
                    <td className="py-1.5 pr-3 text-gray-900 dark:text-gray-100">{c.q}</td>
                    <td className="py-1.5 pr-3 whitespace-nowrap">
                      {c.error ? (
                        <span className="text-xs text-gray-400">{c.error}</span>
                      ) : c.cited ? (
                        <span className="rounded bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-200">
                          {'yes'}{c.ourUrls[0] ? ` · ${c.ourUrls[0]}` : ''}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {'no'}
                          {c.seenRank ? ` — seen at result ${c.seenRank}, not used` : c.searched ? ' — not in its results' : ' — it didn’t search'}
                        </span>
                      )}
                    </td>
                    <td className="py-1.5 pr-3 text-xs text-gray-600 dark:text-gray-300">
                      <span className="line-clamp-2 break-words">
                        {c.top.filter((t) => !t.host.endsWith('center.study')).slice(0, 4).map((t) => t.host).join(' · ') || '·'}
                      </span>
                    </td>
                    <td className="py-1.5 pr-0 text-right text-xs tabular-nums text-gray-400 whitespace-nowrap">{timeET.format(c.at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {report.rivals.length > 0 && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-xs uppercase tracking-wide text-gray-400">Cited most across these answers</span>{' '}
              {report.rivals.map((r) => `${r.host} (${r.n})`).join(' · ')}
            </p>
          )}
        </>
      )}
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
        One assistant, one phrasing per question, re-asked weekly — a consistent yardstick rather than a census. Each check is a paid model call with a web search.
      </p>

      <h2 className={sub}>Readers sent by assistants</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {data.aiRef.total7}{' this week, '}{data.aiRef.total30}{' in 30 days'}
        {data.aiRef.byProduct.length > 0 && <>{' ('}{data.aiRef.byProduct.map((b) => `${b.name} ${b.n}`).join(', ')}{')'}</>}
        {'. A floor: the assistants’ mobile apps strip the referrer, and Search Console can’t see this traffic at all.'}
      </p>
      {viaAi.length > 0 && (
        <ol className="mt-2 space-y-1 text-sm">
          {viaAi.map((s) => (
            <li key={s.id} className="flex flex-wrap items-baseline gap-x-2">
              <Link href={`/analytics/session/${s.id}`} className="w-28 shrink-0 text-xs tabular-nums text-gray-500 underline">{timeET.format(s.start)}</Link>
              <span className="rounded bg-indigo-100 dark:bg-indigo-900/40 px-1.5 py-0.5 text-xs text-indigo-800 dark:text-indigo-200">{s.ai}</span>
              <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">{s.events.find((e) => e.type === 'page')?.label ?? ''}</span>
              <span className="text-xs text-gray-400">{duration(s.mins)}{' · '}{s.pages}{' page'}{s.pages === 1 ? '' : 's'}</span>
            </li>
          ))}
        </ol>
      )}

      <h2 id="ai-systems" className={sub}>AI systems reading the archive</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Page fetches by AI crawlers and agents, counted where the request arrives (they never run the page’s JavaScript). “Live” = an assistant fetching the page to answer someone right then.
      </p>
      {data.crawlers.length === 0 ? (
        <p className="mt-3 text-sm text-gray-400">Counting began Nov 17 — fetches appear here as they happen.</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm tabular-nums">
            <thead>
              <tr className={thead}>
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
    </>
  );
}
