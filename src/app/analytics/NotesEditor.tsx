'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Pin a dated note to the trend charts ("posted the thread on X", "Avalon
// talk") and remove old ones. Talks only to the owner-gated notes endpoint;
// a saved note shows up as a marker on every chart whose range includes it.

type Note = { id: string; day: string; label: string };

const fmtDay = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' });

export default function NotesEditor({ notes, today }: { notes: Note[]; today: string }) {
  const router = useRouter();
  const [day, setDay] = useState(today);
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = async (method: 'POST' | 'DELETE', body: unknown) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/analytics/notes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !json?.ok) {
        setError(json?.error ?? 'That didn’t save — try again.');
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setError('That didn’t save — check the connection and try again.');
      return false;
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (await call('POST', { day, label })) setLabel('');
        }}
      >
        <input
          type="date"
          value={day}
          max={today}
          onChange={(e) => setDay(e.target.value)}
          aria-label="Date"
          className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100"
        />
        <input
          type="text"
          value={label}
          maxLength={80}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="What happened — e.g. posted the thread on X"
          aria-label="What happened"
          className="min-w-0 flex-1 basis-56 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
        />
        <button
          type="submit"
          disabled={busy || label.trim().length < 2}
          className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-40 dark:bg-gray-100 dark:text-gray-900"
        >
          Mark it
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-rose-700 dark:text-rose-300">{error}</p>}
      {notes.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {notes.map((n) => (
            <li key={n.id} className="flex flex-wrap items-baseline gap-x-2">
              <span className="w-28 shrink-0 text-xs tabular-nums text-gray-400">
                {fmtDay.format(new Date(`${n.day}T00:00:00Z`))}
              </span>
              <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">{n.label}</span>
              <button
                type="button"
                disabled={busy}
                onClick={() => call('DELETE', { id: n.id })}
                className="text-xs text-gray-500 underline disabled:opacity-40"
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
