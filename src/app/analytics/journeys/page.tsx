import Link from 'next/link';
import { loadConsole } from '../load';
import { JourneyCard, RoomHead, Unavailable, fold, sessionHref, timeET, topJourneys } from '../ui';

// /analytics/journeys — the week's most engaged visits as readable cards
// (who they are, where they came from, what they did), how far a generated
// reading path carries someone, and every path generated on /begin.

export const dynamic = 'force-dynamic';

export default async function JourneysPage() {
  const data = await loadConsole();
  if (!data) return <Unavailable />;
  const journeys = topJourneys(data, 12);
  const f = data.beginFunnel;

  return (
    <>
      <RoomHead title="Journeys">
        The week’s most engaged visits, each as one card: who they are (what they typed on /begin), where they came from, and what they actually did. “Read” is strict: at least halfway down the text and 90+ seconds on it.
      </RoomHead>
      {f.generated > 0 && (
        <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
          {'Reading paths lately: '}
          <span className="font-medium tabular-nums">{f.generated}</span>{' generated → '}
          <span className="font-medium tabular-nums">{f.opened}</span>{' opened a text → '}
          <span className="font-medium tabular-nums">{f.read}</span>{' read one → '}
          <span className="font-medium tabular-nums">{f.returned}</span>{' came back'}
          <span className="ml-1.5 text-xs text-gray-400">{'(readers, recent trail window)'}</span>
        </p>
      )}
      <ol className="mt-4 space-y-3">
        {journeys.map((s) => <JourneyCard key={s.id} s={s} />)}
        {journeys.length === 0 && <li className="text-sm text-gray-400">No engaged visits in the last 7 days.</li>}
      </ol>

      <details className="mt-8">
        <summary className={fold}>{'All generated reading paths · '}{data.beginPaths.length}</summary>
        <ol className="mt-3 space-y-2 text-sm">
          {data.beginPaths.map((b, i) => {
            const href = sessionHref(data, b.sid, b.t);
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
                {href && <Link href={href} className="text-xs text-gray-500 underline">visit →</Link>}
              </li>
            );
          })}
          {data.beginPaths.length === 0 && <li className="text-gray-400">None generated yet.</li>}
        </ol>
      </details>
    </>
  );
}
