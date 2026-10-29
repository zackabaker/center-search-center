'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { SessionView } from './data';

// The sessions browser on /study: receives display-ready session timelines
// from the server and adds the owner-side ergonomics — a filter box that
// matches queries, page titles and badges, and one-tap facet chips
// (people lookups, deep sessions, searched sessions, the owner's own,
// crawlers). Pure presentation; nothing here talks to the network.

const fmtTime = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit',
});
const fmtDay = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York', month: 'short', day: 'numeric',
});

function duration(mins: number): string {
  if (mins < 1) return '<1 min';
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

const FACETS = [
  { key: 'all', label: 'All' },
  { key: 'people', label: 'People lookups' },
  { key: 'deep', label: 'Deep sessions' },
  { key: 'search', label: 'With searches' },
  { key: 'mine', label: 'Yours' },
  { key: 'crawler', label: 'Crawlers' },
] as const;

type FacetKey = (typeof FACETS)[number]['key'];

export default function SessionsExplorer({ sessions }: { sessions: SessionView[] }) {
  const [filter, setFilter] = useState('');
  const [facet, setFacet] = useState<FacetKey>('all');
  // A #s-<id> hash (the "session →" links above) pins that session: it is
  // shown first regardless of facet or filter, so the anchor always lands.
  const [anchorId, setAnchorId] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      const m = window.location.hash.match(/^#s-(.+)$/);
      setAnchorId(m ? decodeURIComponent(m[1]) : null);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  const shown = useMemo(() => {
    const f = filter.trim().toLowerCase();
    const list = sessions.filter((s) => {
      if (anchorId && s.id === anchorId) return true;
      if (facet === 'people' && !s.badges.some((b) => b.startsWith('looked up'))) return false;
      if (facet === 'deep' && !s.badges.includes('deep session')) return false;
      if (facet === 'search' && s.searches === 0) return false;
      if (facet === 'mine' && !s.mine) return false;
      if (facet === 'crawler' && !s.crawler) return false;
      if (facet === 'all' && (s.crawler || s.mine)) return false; // default view = readers
      if (!f) return true;
      return (
        s.badges.some((b) => b.toLowerCase().includes(f)) ||
        s.events.some((e) => e.label.toLowerCase().includes(f)) ||
        (s.ref ?? '').toLowerCase().includes(f)
      );
    });
    if (anchorId) {
      const i = list.findIndex((s) => s.id === anchorId);
      if (i > 0) {
        const [a] = list.splice(i, 1);
        list.unshift(a);
      }
    }
    return list;
  }, [sessions, filter, facet, anchorId]);

  useEffect(() => {
    if (!anchorId) return;
    document.getElementById(`s-${anchorId}`)?.scrollIntoView({ block: 'start' });
  }, [anchorId, shown]);

  const hiddenNote =
    facet === 'all'
      ? sessions.filter((s) => s.crawler || s.mine).length
      : 0;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter sessions — a query, a title, a name…"
          className="w-full sm:w-80 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
        />
        <div className="flex flex-wrap gap-1.5">
          {FACETS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFacet(f.key)}
              className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                facet === f.key
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
        {shown.length}{' session'}{shown.length === 1 ? '' : 's'}
        {hiddenNote > 0 && <>{' · '}{hiddenNote}{' yours/crawler hidden (use the chips)'}</>}
      </p>

      <div className="mt-5 space-y-6">
        {shown.slice(0, 60).map((s) => (
          <section
            key={s.id}
            id={`s-${s.id}`}
            className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-5"
          >
            <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {fmtDay.format(s.start)}, {fmtTime.format(s.start)}
              </span>
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
                <span
                  key={b}
                  className={`rounded px-1.5 py-0.5 text-xs ${
                    b.startsWith('looked up')
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200'
                      : b === 'you'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
                        : b === 'deep session' || b.startsWith('followed')
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {b}
                </span>
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
                        <span className="text-gray-800 dark:text-gray-200">
                          <span className="mr-1.5 text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                            {e.mode === 'ask' ? 'ai' : 'search'}
                          </span>
                          “{e.label}”
                        </span>
                      ) : e.type === 'follow' ? (
                        <span className="text-emerald-700 dark:text-emerald-300">→ {e.label}</span>
                      ) : (
                        <span className="text-gray-700 dark:text-gray-300">
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
        ))}
        {shown.length > 60 && (
          <p className="text-xs text-gray-500">
            {'Showing the top 60 of '}{shown.length}{' — narrow with the filter box.'}
          </p>
        )}
      </div>
    </div>
  );
}
