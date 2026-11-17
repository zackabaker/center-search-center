import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadConsole } from '../../load';
import SessionCard from '../../SessionCard';
import { Unavailable, duration, timeET } from '../../ui';

// /analytics/session/<id> — one visit on its own page, so every "visit →"
// link in the console lands somewhere, not just the 150 the explorer shows.
// A tab's other visits (it splits at 30-minute silences) are listed beneath.

export const dynamic = 'force-dynamic';

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-z0-9-]{4,40}$/i.test(id)) notFound();
  const data = await loadConsole();
  if (!data) return <Unavailable />;
  const s = data.allSessions.find((x) => x.id === id);
  if (!s) {
    return (
      <>
        <p className="text-sm"><Link href="/analytics/sessions" className="text-gray-500 underline">← Visits</Link></p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          That visit is no longer in the retained log — the raw trail only reaches back about three weeks.
        </p>
      </>
    );
  }
  const siblings = s.sid
    ? data.allSessions.filter((x) => x.sid === s.sid && x.id !== s.id).sort((a, b) => a.start - b.start)
    : [];

  return (
    <>
      <p className="text-sm"><Link href="/analytics/sessions" className="text-gray-500 underline">← Visits</Link></p>
      <div className="mt-4">
        <SessionCard s={s} />
      </div>
      {s.kind === 'live' && s.start >= Date.parse('2026-11-18T00:00:00Z') && !s.human && !s.mine && (
        <p className="mt-2 text-xs text-gray-400">No tap, key or mouse movement was seen in this visit — probably not a person.</p>
      )}
      {siblings.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Other visits from the same tab</h2>
          <ol className="mt-2 space-y-1 text-sm">
            {siblings.map((x) => (
              <li key={x.id} className="flex flex-wrap items-baseline gap-x-2">
                <Link href={`/analytics/session/${x.id}`} className="text-gray-900 dark:text-gray-100 hover:underline">
                  {timeET.format(x.start)}
                </Link>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {duration(x.mins)}{' · '}{x.pages}{' page'}{x.pages === 1 ? '' : 's'}
                  {x.searches > 0 && <>{' · '}{x.searches}{' search'}{x.searches === 1 ? '' : 'es'}</>}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
