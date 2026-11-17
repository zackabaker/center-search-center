'use client';
import { useEffect, useMemo, useState } from 'react';
import type { SessionView } from './data';
import SessionCard from './SessionCard';

// The sessions browser on /analytics: receives display-ready session timelines
// from the server and adds the owner-side ergonomics — a filter box that
// matches queries, page titles and badges, and one-tap facet chips
// (people lookups, deep sessions, searched sessions, the owner's own,
// crawlers). Pure presentation; nothing here talks to the network.

const FACETS = [
  { key: 'all', label: 'All' },
  { key: 'paths', label: 'Reading paths' },
  { key: 'ai', label: 'Via AI' },
  { key: 'people', label: 'People lookups' },
  { key: 'deep', label: 'Deep sessions' },
  { key: 'search', label: 'With searches' },
  { key: 'mine', label: 'Yours' },
  { key: 'crawler', label: 'Crawlers' },
] as const;

type FacetKey = (typeof FACETS)[number]['key'];

const ORDERS = [
  { key: 'newest', label: 'Newest' },
  { key: 'notable', label: 'Most notable' },
] as const;
type OrderKey = (typeof ORDERS)[number]['key'];

export default function SessionsExplorer({ sessions }: { sessions: SessionView[] }) {
  const [filter, setFilter] = useState('');
  const [facet, setFacet] = useState<FacetKey>('all');
  const [order, setOrder] = useState<OrderKey>('newest');
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
      if (facet === 'paths' && !s.badges.includes('generated path')) return false;
      if (facet === 'ai' && !s.ai) return false;
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
    // The server delivers the 150 most notable sessions score-first; reorder
    // for display. Newest = reverse chronology by the session's last event.
    list.sort(order === 'newest' ? (a, b) => b.end - a.end : (a, b) => b.score - a.score);
    if (anchorId) {
      const i = list.findIndex((s) => s.id === anchorId);
      if (i > 0) {
        const [a] = list.splice(i, 1);
        list.unshift(a);
      }
    }
    return list;
  }, [sessions, filter, facet, anchorId, order]);

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
        <div className="flex gap-1.5 sm:ml-auto">
          {ORDERS.map((o) => (
            <button
              key={o.key}
              onClick={() => setOrder(o.key)}
              className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                order === o.key
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {o.label}
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
          <SessionCard key={s.id} s={s} linked />
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
