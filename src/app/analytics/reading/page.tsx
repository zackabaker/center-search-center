import Link from 'next/link';
import { loadConsole } from '../load';
import { RoomHead, Unavailable, fold, sessionHref, share, statsHref, sub, thead, timeET } from '../ui';

// /analytics/reading — what gets read: the last texts finished, which texts
// readers are opening this week, how far down they get, what is read
// together, and which texts send readers on to follow.

export const dynamic = 'force-dynamic';

export default async function ReadingPage() {
  const data = await loadConsole();
  if (!data) return <Unavailable />;

  return (
    <>
      <RoomHead title="Reading">
        A “read” means at least half the text and 90+ seconds on it. Yours are excluded. Each title opens that text’s own stats page.
      </RoomHead>

      <h2 className={sub}>Read most recently</h2>
      <ol className="mt-2 space-y-1.5 text-sm">
        {data.recentReads.map((r, i) => {
          const href = sessionHref(data, r.sid, r.t);
          return (
            <li key={i} className="flex flex-wrap items-baseline gap-x-2">
              <span className="w-28 shrink-0 text-xs tabular-nums text-gray-400">{timeET.format(r.t)}</span>
              {statsHref(r.href) ? (
                <Link href={statsHref(r.href)!} className="min-w-0 break-words text-gray-900 dark:text-gray-100 hover:underline">{r.title}</Link>
              ) : (
                <span className="min-w-0 break-words text-gray-900 dark:text-gray-100">{r.title}</span>
              )}
              {r.href && <Link href={r.href} className="text-xs text-gray-500 underline">text →</Link>}
              {href && <Link href={href} className="text-xs text-gray-500 underline">visit →</Link>}
            </li>
          );
        })}
        {data.recentReads.length === 0 && <li className="text-gray-400">No completed reads logged yet.</li>}
      </ol>

      <h2 className={sub}>Most opened this week</h2>
      <p className="mt-1 text-xs text-gray-400">
        Readers who opened each text in the last 7 days against the 7 before — people, not page loads, so bot traffic can’t rank a text.
      </p>
      <ol className="mt-2 space-y-1.5 text-sm">
        {data.movers.map((m, i) => {
          const delta = m.prev > 0 ? Math.round(((m.cur - m.prev) / m.prev) * 100) : null;
          return (
            <li key={m.slug} className="flex gap-2">
              <span className="w-5 shrink-0 text-right tabular-nums text-gray-400">{i + 1}</span>
              <span className="min-w-0 break-words">
                <Link href={`/analytics/post/${m.slug}`} className="text-gray-900 dark:text-gray-100 hover:underline">{m.label}</Link>
                <span className="ml-1.5 text-xs tabular-nums text-gray-500 dark:text-gray-400">{m.cur}{' reader'}{m.cur === 1 ? '' : 's'}</span>
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
        {data.movers.length === 0 && <li className="text-gray-400">No reader opened a text in the last 7 days.</li>}
      </ol>

      <h2 className={sub}>How far readers get</h2>
      <p className="mt-1 text-xs text-gray-400">
        Of the reader sessions that opened each text (30 days): the share that got at least halfway, three-quarters, and to the end — and the share that stayed 90+ active seconds. A text people open but don’t get through sits low on the right.
      </p>
      {data.depthPosts.length === 0 ? (
        <p className="mt-2 text-sm text-gray-400">Depth tracking began Nov 17 — this fills in as readers read.</p>
      ) : (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm tabular-nums">
            <thead>
              <tr className={thead}>
                <th className="py-1.5 pr-3 font-normal">Text</th>
                <th className="py-1.5 pr-3 font-normal text-right">Opened</th>
                <th className="py-1.5 pr-3 font-normal text-right">≥ 50%</th>
                <th className="py-1.5 pr-3 font-normal text-right">≥ 75%</th>
                <th className="py-1.5 pr-3 font-normal text-right">End</th>
                <th className="py-1.5 pr-0 font-normal text-right">90s+</th>
              </tr>
            </thead>
            <tbody>
              {data.depthPosts.slice(0, 30).map((p) => (
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
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Read together</h2>
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
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Texts that lead to a follow</h2>
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

      <details className="mt-8">
        <summary className={fold}>Most viewed — past two months and all time</summary>
        <p className="mt-1 text-xs text-gray-400">Raw page views, kept since before readers could be told from bots — a long-run reference, not a ranking of what people read.</p>
        <div className="mt-3 grid gap-8 sm:grid-cols-2">
          {([['Past two months', data.topRecent], ['All time', data.topAll]] as const).map(([label, rows]) => (
            <div key={label}>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</h3>
              <ol className="mt-2 space-y-1.5 text-sm">
                {rows.map((p, i) => (
                  <li key={p.slug} className="flex gap-2">
                    <span className="w-5 shrink-0 text-right tabular-nums text-gray-400">{i + 1}</span>
                    <span className="min-w-0 break-words">
                      <Link href={`/analytics/post/${p.slug}`} className="text-gray-900 dark:text-gray-100 hover:underline">{p.title}</Link>
                      <span className="ml-1.5 text-xs text-gray-400">{p.source}{' · '}{p.n}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </details>
    </>
  );
}
