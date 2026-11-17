import Link from 'next/link';
import { loadConsole } from '../load';
import { RoomHead, Unavailable, dayLabel, fold, sessionHref, share, sub, timeET, timeOnlyET } from '../ui';

// /analytics/searches — what readers type into the site's own search: every
// search day by day, the ones that opened nothing, the all-time terms, and
// the searches that name people.

export const dynamic = 'force-dynamic';

export default async function SearchesPage() {
  const data = await loadConsole();
  if (!data) return <Unavailable />;
  const { searchOutcome: so } = data;

  return (
    <>
      <RoomHead title="What readers search">
        Every reader search, day by day (your own excluded). Open a day to read it in order. Letters tell searchers apart within a day: same letter, same visitor.
      </RoomHead>
      <div className="mt-4 space-y-2">
        {data.searchDays.map((d, i) => {
          // Assigned by first appearance, so the day reads A, B, C… in order.
          const letters = new Map<string, string>();
          for (const it of d.items) {
            if (it.sid && !letters.has(it.sid)) letters.set(it.sid, String.fromCharCode(65 + (letters.size % 26)));
          }
          return (
            <details key={d.day} open={i === 0} className="rounded-lg border border-gray-200 dark:border-gray-800">
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
                  const href = sessionHref(data, s.sid, s.t);
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
                      {href && <Link href={href} className="text-xs text-gray-500 underline">visit →</Link>}
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
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">A dot in place of a letter means the search carried no tab id.</p>

      <h2 id="no-click" className={sub}>Searched, opened nothing</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {so.searches - so.opened}{' of '}{so.searches}{' keyword searches in 14 days ('}{share(so.searches - so.opened, so.searches)}
        {') ended without a result, a text or a concept page being opened. Half-typed queries are left out.'}
      </p>
      <ol className="mt-2 space-y-1 text-sm">
        {so.noClick.map((m) => (
          <li key={m.q} className="flex flex-wrap items-baseline gap-x-2">
            <span className="w-28 shrink-0 text-xs tabular-nums text-gray-400">{timeET.format(m.t)}</span>
            <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">“{m.q}”</span>
            {m.times > 1 && <span className="text-xs text-gray-400">×{m.times}</span>}
            {m.results === 0 && <span className="text-xs text-rose-600 dark:text-rose-300">0 results</span>}
            <a href={`/search?q=${encodeURIComponent(m.q)}`} className="text-xs text-gray-500 underline">try it →</a>
            <Link href={`/analytics/session/${m.id}`} className="text-xs text-gray-500 underline">visit →</Link>
          </li>
        ))}
        {so.noClick.length === 0 && <li className="text-gray-400">None in the window.</li>}
      </ol>

      <details className="mt-8">
        <summary className={fold}>All-time top 40 terms</summary>
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
        <summary className={fold}>{'People watch · '}{data.peopleHits.length}{' retained hits'}</summary>
        <p className="mt-1 text-xs text-gray-400">Every retained search that names you or the circle.</p>
        <ol className="mt-2 space-y-1 text-sm">
          {data.peopleHits.map((h, i) => {
            const href = sessionHref(data, h.sid, h.t);
            return (
              <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-xs tabular-nums text-gray-400 w-28 shrink-0">{timeET.format(h.t)}</span>
                <span className="rounded bg-rose-100 dark:bg-rose-900/40 px-1.5 py-0.5 text-xs text-rose-800 dark:text-rose-200">{h.term}</span>
                <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">“{h.q}”</span>
                {h.mine && <span className="text-xs text-amber-600 dark:text-amber-300">you</span>}
                {href && <Link href={href} className="text-xs text-gray-500 underline">visit →</Link>}
              </li>
            );
          })}
          {data.peopleHits.length === 0 && <li className="text-gray-400">None recorded.</li>}
        </ol>
      </details>
    </>
  );
}
