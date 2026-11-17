'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// The opportunities list with its two verdict buttons. Ticking one hides the
// item at once and tells the owner-gated endpoint; the handled ones can be
// reopened from the full list. Local prop types: this is a client component,
// so nothing from the server-side opportunities module is imported.

export type OppItem = {
  id: string;
  kindLabel: string;
  title: string;
  evidence: string;
  fix: string;
  links: { label: string; href: string }[];
  status?: 'done' | 'ignored';
};

const KIND_CLASS: Record<string, string> = {
  'On Google': 'bg-[#6250d6]/10 text-[#4a3aa7] dark:bg-[#9085e9]/15 dark:text-[#b3aaf2]',
  'Site search': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
  Ask: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200',
  Reading: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  'Broken link': 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
};

export default function OppList({ items, compact = false }: { items: OppItem[]; compact?: boolean }) {
  const router = useRouter();
  // Items hidden optimistically, valid only for the list they were hidden
  // from: when fresh data arrives (after the refresh below) the signature
  // changes and the server's version of the list takes over — so an item
  // reopened elsewhere on the page comes back here.
  const sig = items.map((o) => `${o.id}:${o.status ?? ''}`).join('|');
  const [hidden, setHidden] = useState<{ sig: string; ids: string[] }>({ sig, ids: [] });
  const gone = hidden.sig === sig ? hidden.ids : [];
  const [error, setError] = useState<string | null>(null);

  const mark = async (id: string, status: 'done' | 'ignored' | 'open') => {
    setError(null);
    setHidden({ sig, ids: [...gone, id] });
    try {
      const res = await fetch('/api/analytics/opps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('failed');
      router.refresh();
    } catch {
      setHidden({ sig, ids: gone.filter((x) => x !== id) });
      setError('That didn’t save. Try again.');
    }
  };

  const shown = items.filter((o) => !gone.includes(o.id));
  if (shown.length === 0) {
    return <p className="mt-3 text-sm text-gray-400">Nothing open right now.</p>;
  }
  const btn = 'rounded border border-gray-300 dark:border-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';

  return (
    <>
      {error && <p className="mt-2 text-xs text-rose-700 dark:text-rose-300">{error}</p>}
      <ol className="mt-3 divide-y divide-gray-200 dark:divide-gray-800 border-y border-gray-200 dark:border-gray-800">
        {shown.map((o) => (
          <li key={o.id} className="py-3">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${KIND_CLASS[o.kindLabel] ?? KIND_CLASS['Broken link']}`}>
                {o.kindLabel}
              </span>
              <span className="min-w-0 break-words text-sm font-medium text-gray-900 dark:text-gray-100">{o.title}</span>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{o.evidence}.</p>
            {!compact && <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{o.fix}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {o.status ? (
                <button type="button" className={btn} onClick={() => mark(o.id, 'open')}>Reopen</button>
              ) : (
                <>
                  <button type="button" className={btn} onClick={() => mark(o.id, 'done')}>Done</button>
                  <button type="button" className={btn} onClick={() => mark(o.id, 'ignored')}>Not relevant</button>
                </>
              )}
              {o.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="text-xs text-gray-500 underline"
                >
                  {l.label}{' →'}
                </a>
              ))}
              {o.status && (
                <span className="text-xs text-gray-400">{o.status === 'done' ? 'marked done' : 'marked not relevant'}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
