'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Add one day's number to a series with no API this site can reach
// (Substack subscribers, a number read off another analytics tool). Typing
// the same name again keeps adding to the same chart.

type Props = { existing: { key: string; label: string }[] };

export default function GrowthEntry({ existing }: Props) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [label, setLabel] = useState('');
  const [day, setDay] = useState(today);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const match = existing.find((s) => s.label.toLowerCase() === label.trim().toLowerCase());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || !label.trim() || !value.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/analytics/growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: label.trim(), day, value, key: match?.key }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !json?.ok) {
        setError(json?.error ?? 'That didn’t save. Try again.');
        return;
      }
      setValue('');
      router.refresh();
    } catch {
      setError('That didn’t save. Check the connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-3 flex flex-wrap items-end gap-2 text-sm">
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">Series</span>
        <input
          list="growth-series-names"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Substack subscribers"
          className="w-44 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1.5"
        />
        <datalist id="growth-series-names">
          {existing.map((s) => <option key={s.key} value={s.label} />)}
        </datalist>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">Date</span>
        <input
          type="date"
          value={day}
          max={today}
          onChange={(e) => setDay(e.target.value)}
          className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1.5"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">Number</span>
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="1250"
          className="w-28 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1.5"
        />
      </label>
      <button
        type="submit"
        disabled={busy || !label.trim() || !value.trim()}
        className="min-h-9 rounded border border-gray-900 dark:border-gray-200 bg-gray-900 dark:bg-gray-100 px-3 text-white dark:text-gray-900 disabled:opacity-40"
      >
        {busy ? 'Saving…' : 'Add'}
      </button>
      {error && <p className="w-full text-rose-700 dark:text-rose-300">{error}</p>}
    </form>
  );
}
