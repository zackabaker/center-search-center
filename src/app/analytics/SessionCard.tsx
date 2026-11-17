import Link from 'next/link';
import type { SessionView } from './data';

// One visit, as a timeline: pages opened, texts read, searches run, results
// picked, reading paths generated, follows clicked. Used by the visits
// explorer (a client component) and by the single-visit page (a server
// one), so it carries no hooks and no server-only imports.

const fmtTime = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });
const fmtDay = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric' });

function duration(mins: number): string {
  if (mins < 1) return '<1 min';
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

const badgeClass = (b: string) =>
  b.startsWith('looked up')
    ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200'
    : b === 'generated path'
      ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200'
      : b.startsWith('via AI')
        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200'
        : b === 'you'
          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
          : b === 'deep session' || b.startsWith('followed')
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400';

export default function SessionCard({ s, linked = false }: { s: SessionView; linked?: boolean }) {
  const when = `${fmtDay.format(s.start)}, ${fmtTime.format(s.start)}`;
  return (
    <section id={`s-${s.id}`} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
        {linked && s.kind === 'live' ? (
          <Link href={`/analytics/session/${s.id}`} className="font-medium text-gray-900 dark:text-gray-100 hover:underline">{when}</Link>
        ) : (
          <span className="font-medium text-gray-900 dark:text-gray-100">{when}</span>
        )}
        <span className="text-gray-500 dark:text-gray-400">
          {duration(s.mins)}
          {s.pages > 0 && <>{' · '}{s.pages}{' '}page{s.pages === 1 ? '' : 's'}</>}
          {s.texts > 0 && <>{' · '}{s.texts}{' '}text{s.texts === 1 ? '' : 's'}</>}
          {s.searches > 0 && <>{' · '}{s.searches}{' '}search{s.searches === 1 ? '' : 'es'}</>}
        </span>
        {s.ref && (
          <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs text-gray-600 dark:text-gray-300">
            {'via '}{s.ref}
          </span>
        )}
        {s.badges.map((b) => (
          <span key={b} className={`rounded px-1.5 py-0.5 text-xs ${badgeClass(b)}`}>{b}</span>
        ))}
      </header>
      <ol className="mt-3 space-y-1.5 text-sm">
        {s.events.map((e, i) => {
          const prev = i > 0 ? s.events[i - 1] : null;
          const gap = prev ? e.t - prev.t : 0;
          return (
            <li key={i}>
              {gap > 15 * 60_000 && (
                <div className="my-1.5 text-xs text-gray-400 dark:text-gray-600">
                  {'— '}{duration(Math.round(gap / 60_000))}{' later —'}
                </div>
              )}
              <div className="flex gap-2">
                <span className="w-16 shrink-0 tabular-nums text-xs text-gray-400 dark:text-gray-500 pt-0.5">
                  {fmtTime.format(e.t)}
                </span>
                {e.type === 'search' ? (
                  <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">
                    <span className="mr-1.5 text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                      {e.mode === 'ask' ? 'ai' : 'search'}
                    </span>
                    “{e.label}”
                    {e.n === 0 && <span className="ml-1.5 text-xs text-rose-600 dark:text-rose-300">0 results</span>}
                  </span>
                ) : e.type === 'begin' ? (
                  <span className="min-w-0 break-words text-violet-700 dark:text-violet-300">
                    <span className="mr-1.5 text-xs uppercase tracking-wide opacity-70">path</span>
                    {'generated a reading path'}
                    {e.label !== 'reading path' && <>{' — '}{e.label}</>}
                    {e.href && (
                      <Link href={e.href} className="ml-1.5 text-xs underline opacity-80">open →</Link>
                    )}
                  </span>
                ) : e.type === 'follow' ? (
                  <span className="text-emerald-700 dark:text-emerald-300">→ {e.label}</span>
                ) : e.type === 'pick' ? (
                  <span className="text-gray-500 dark:text-gray-400">↳ {e.label}</span>
                ) : (
                  <span className="min-w-0 break-words text-gray-700 dark:text-gray-300">
                    <span className="mr-1.5 text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                      {e.type === 'read' ? 'read ✓' : e.href?.startsWith('/post/') ? 'open' : ''}
                    </span>
                    {e.href ? (
                      <Link href={e.href} className="hover:underline">{e.label}</Link>
                    ) : (
                      <span>{e.label}</span>
                    )}
                  </span>
                )}
              </div>
            </li>
          );
        })}
        {s.eventsTotal > s.events.length && (
          <li className="text-xs text-gray-400 dark:text-gray-500">
            {'… '}{s.eventsTotal - s.events.length}{' more events not shown'}
          </li>
        )}
      </ol>
    </section>
  );
}
