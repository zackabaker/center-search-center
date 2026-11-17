'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AskMode, AskStatus } from '@/lib/ask-budget';

// Today's Ask spending and the owner's switch: let the limits work on their
// own, force the cheaper model, or turn AI answers off. Talks only to the
// owner-gated /api/analytics/ask-mode endpoint.

const OPTIONS: { mode: AskMode; label: string; hint: string }[] = [
  { mode: 'auto', label: 'Automatic', hint: 'Main model until the day’s spending is high, then the cheaper one, then paused' },
  { mode: 'economy', label: 'Cheaper model only', hint: 'Every answer on the cheaper model' },
  { mode: 'off', label: 'Off', hint: 'No AI answers; search and passages keep working' },
];

const usd = (n: number) => `$${n.toFixed(2)}`;

export default function AskSwitch({ status }: { status: AskStatus }) {
  const router = useRouter();
  const [mode, setMode] = useState<AskMode>(status.mode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { limits } = status;

  const pick = async (next: AskMode) => {
    if (next === mode || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/analytics/ask-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: next }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !json?.ok) {
        setError(json?.error ?? 'That didn’t save. Try again.');
        return;
      }
      setMode(next);
      router.refresh();
    } catch {
      setError('That didn’t save. Check the connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const state =
    status.effective === 'paused'
      ? mode === 'off' ? 'Off: switched off by you' : 'Paused: today’s ceiling was reached'
      : status.effective === 'economy'
        ? mode === 'economy' ? 'Cheaper model: set by you' : 'Cheaper model: today’s spending passed the first threshold'
        : 'Normal';

  return (
    <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <p>
          <span className="text-gray-500 dark:text-gray-400">Spent today</span>{' '}
          <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-100">{usd(status.spentUsd)}</span>{' '}
          <span className="text-gray-500 dark:text-gray-400">on {status.answers} answer{status.answers === 1 ? '' : 's'}</span>
        </p>
        <p>
          <span className="text-gray-500 dark:text-gray-400">Right now</span>{' '}
          <span className={`font-semibold ${status.effective === 'full' ? 'text-gray-900 dark:text-gray-100' : 'text-rose-700 dark:text-rose-300'}`}>{state}</span>
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="AI answers">
        {OPTIONS.map((o) => (
          <button
            key={o.mode}
            type="button"
            title={o.hint}
            aria-pressed={mode === o.mode}
            disabled={busy}
            onClick={() => pick(o.mode)}
            className={`min-h-9 px-3 rounded border text-sm transition-colors disabled:opacity-50 ${
              mode === o.mode
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white font-semibold'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-200'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-rose-700 dark:text-rose-300">{error}</p>}
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Limits, per day (UTC): {limits.freePerDay} answers for a signed-out reader, then sign-in; {limits.userPerDay} for a
        signed-in reader; cheaper model after {usd(limits.economyUsd)}; paused after {usd(limits.pauseUsd)}.
      </p>
    </div>
  );
}
