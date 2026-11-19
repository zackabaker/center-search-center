'use client';

import { useCallback, useEffect, useState } from 'react';
import Markdown from '@/app/oracle/Markdown';

export type Round = { id: string; q: string; left: { setup: string; a: string }; right: { setup: string; a: string } };
type Setup = { key: string; label: string; firstWords: number; seconds: number };

export default function JudgeClient({ rounds, setups }: { rounds: Round[]; setups: Setup[] }) {
  const [at, setAt] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({}); // round id → winning setup, or "same"
  const done = at >= rounds.length;

  const pick = useCallback((choice: 'left' | 'right' | 'same') => {
    const r = rounds[at];
    if (!r) return;
    const winner = choice === 'same' ? 'same' : r[choice].setup;
    setPicks((p) => ({ ...p, [r.id]: winner }));
    setAt((n) => n + 1);
    window.scrollTo({ top: 0 });
    fetch('/api/tutor/judge', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: r.id, best: winner }),
    }).catch(() => {});
  }, [at, rounds]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') pick('left');
      else if (e.key === 'ArrowRight') pick('right');
      else if (e.key === 'ArrowDown') { e.preventDefault(); pick('same'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pick]);

  if (done) {
    return (
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your picks</h2>
        <table className="mt-2 w-full text-sm tabular-nums">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs text-gray-500 dark:text-gray-400">
              <th className="py-1.5 pr-3 font-normal">Setup</th>
              <th className="py-1.5 pr-3 text-right font-normal">Won</th>
              <th className="py-1.5 pr-3 text-right font-normal">of</th>
              <th className="py-1.5 pr-3 text-right font-normal">First words</th>
              <th className="py-1.5 text-right font-normal">Whole answer</th>
            </tr>
          </thead>
          <tbody>
            {setups.map((s) => (
              <tr key={s.key} className="border-b border-gray-100 dark:border-gray-900">
                <td className="py-1.5 pr-3 text-gray-900 dark:text-gray-100">{s.label}</td>
                <td className="py-1.5 pr-3 text-right">{Object.values(picks).filter((p) => p === s.key).length}</td>
                <td className="py-1.5 pr-3 text-right">{rounds.filter((r) => r.left.setup === s.key || r.right.setup === s.key).length}</td>
                <td className="py-1.5 pr-3 text-right">{s.firstWords}s</td>
                <td className="py-1.5 text-right">{s.seconds}s</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-400">
          {Object.values(picks).filter((p) => p === 'same').length} called even. Six rounds is a small sample: a clear sweep means something, a 2–2 split doesn’t.
        </p>
        <ol className="mt-4 space-y-1 text-sm text-gray-700 dark:text-gray-300">
          {rounds.map((r) => (
            <li key={r.id}>
              {r.q} <span className="text-gray-400">· you picked {picks[r.id] === 'same' ? 'neither' : setups.find((s) => s.key === picks[r.id])?.label}</span>
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => { setAt(0); setPicks({}); }} className="mt-4 rounded border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm">
          Start over
        </button>
      </div>
    );
  }

  const r = rounds[at];
  const column = (side: 'left' | 'right') => (
    <div className="flex min-w-0 flex-col rounded-lg border border-gray-200 dark:border-gray-800">
      <button
        type="button"
        onClick={() => pick(side)}
        className="rounded-t-lg bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
      >
        {side === 'left' ? '← This one is better' : 'This one is better →'}
      </button>
      <div className="px-4 py-4">
        <Markdown text={r[side].a} />
      </div>
    </div>
  );

  return (
    <div className="mt-4">
      <p className="text-xs text-gray-500 dark:text-gray-400">Question {at + 1} of {rounds.length}</p>
      <p className="mt-1 font-serif text-xl text-gray-900 dark:text-gray-100">{r.q}</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {column('left')}
        {column('right')}
      </div>
      <div className="mt-4 text-center">
        <button type="button" onClick={() => pick('same')} className="rounded border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200">
          Can’t choose
        </button>
      </div>
    </div>
  );
}
