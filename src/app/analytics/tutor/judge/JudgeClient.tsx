'use client';

import { useEffect, useState } from 'react';
import Markdown from '@/app/oracle/Markdown';

export type JudgeQuestion = {
  id: string;
  q: string;
  answers: { setup: string; a: string; words: number; firstWords: number; seconds: number; cost: number }[];
};
type Vote = { best: string | null; worst: string | null };
const LETTERS = ['A', 'B', 'C', 'D'];

export default function JudgeClient({ questions, setups }: { questions: JudgeQuestion[]; setups: { key: string; label: string }[] }) {
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [open, setOpen] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/tutor/judge').then((r) => (r.ok ? r.json() : null)).then((j) => { if (j?.votes) setVotes(j.votes); }).catch(() => {});
  }, []);

  const vote = async (id: string, field: 'best' | 'worst', setup: string) => {
    const cur = votes[id] ?? { best: null, worst: null };
    const next = { ...cur, [field]: cur[field] === setup ? null : setup };
    if (field === 'best' && next.worst === setup) next.worst = null;
    if (field === 'worst' && next.best === setup) next.best = null;
    setVotes((v) => ({ ...v, [id]: next }));
    setError(null);
    const r = await fetch('/api/tutor/judge', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id, ...next }),
    }).catch(() => null);
    if (!r?.ok) setError('That choice did not save. Try again.');
  };

  const judged = questions.filter((q) => votes[q.id]?.best).length;
  const label = (key: string) => setups.find((s) => s.key === key)?.label ?? key;
  const med = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] ?? 0;
  const btn = (on: boolean, tone: 'best' | 'worst') =>
    `rounded border px-2 py-0.5 text-xs ${
      on
        ? tone === 'best'
          ? 'border-emerald-600 bg-emerald-600 text-white'
          : 'border-rose-600 bg-rose-600 text-white'
        : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-gray-600 dark:text-gray-300">{judged} of {questions.length} judged</span>
        <button type="button" onClick={() => setRevealed((r) => !r)} className="rounded border border-gray-300 dark:border-gray-700 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-200">
          {revealed ? 'Hide which is which' : 'Reveal which is which'}
        </button>
        {error && <span className="text-xs text-rose-700 dark:text-rose-300">{error}</span>}
      </div>

      {revealed && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm tabular-nums">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs text-gray-500 dark:text-gray-400">
                <th className="py-1.5 pr-3 font-normal">Setup</th>
                <th className="py-1.5 pr-3 text-right font-normal">Picked best</th>
                <th className="py-1.5 pr-3 text-right font-normal">Picked worst</th>
                <th className="py-1.5 pr-3 text-right font-normal">First words</th>
                <th className="py-1.5 pr-3 text-right font-normal">Whole answer</th>
                <th className="py-1.5 text-right font-normal">Length</th>
              </tr>
            </thead>
            <tbody>
              {setups.map((s) => {
                const rows = questions.flatMap((q) => q.answers.filter((a) => a.setup === s.key));
                // The first question of a run also loaded the canon; leave it out of the speed figures.
                const warm = rows.filter((r) => r.cost < 3);
                return (
                  <tr key={s.key} className="border-b border-gray-100 dark:border-gray-900">
                    <td className="py-1.5 pr-3 text-gray-900 dark:text-gray-100">{s.label}</td>
                    <td className="py-1.5 pr-3 text-right">{Object.values(votes).filter((v) => v.best === s.key).length}</td>
                    <td className="py-1.5 pr-3 text-right">{Object.values(votes).filter((v) => v.worst === s.key).length}</td>
                    <td className="py-1.5 pr-3 text-right">{med(warm.map((r) => r.firstWords))}s</td>
                    <td className="py-1.5 pr-3 text-right">{med(warm.map((r) => r.seconds))}s</td>
                    <td className="py-1.5 text-right">{med(rows.map((r) => r.words))} words</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-1 text-xs text-gray-400">Times are medians with the texts already loaded. Four questions ran at once, so each is somewhat slower than a lone question would be.</p>
        </div>
      )}

      <ol className="mt-6 space-y-10">
        {questions.map((q, n) => {
          const at = open[q.id] ?? 0;
          const cur = q.answers[at];
          const v = votes[q.id] ?? { best: null, worst: null };
          return (
            <li key={q.id}>
              <p className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2.5 text-[15px] text-gray-900 dark:text-gray-100">
                <span className="text-xs text-gray-500 dark:text-gray-400">{n + 1}. </span>{q.q}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {q.answers.map((a, i) => (
                  <button
                    key={a.setup}
                    type="button"
                    onClick={() => setOpen((o) => ({ ...o, [q.id]: i }))}
                    className={`rounded-full px-3 py-1 text-sm ${i === at ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
                  >
                    {LETTERS[i]}
                    {v.best === a.setup && ' · best'}
                    {v.worst === a.setup && ' · worst'}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Answer {LETTERS[at]}:</span>
                <button type="button" className={btn(v.best === cur.setup, 'best')} onClick={() => vote(q.id, 'best', cur.setup)}>Best</button>
                <button type="button" className={btn(v.worst === cur.setup, 'worst')} onClick={() => vote(q.id, 'worst', cur.setup)}>Worst</button>
                {revealed && <span className="text-xs text-gray-500 dark:text-gray-400">{label(cur.setup)} · first words {cur.firstWords}s · {cur.words} words</span>}
              </div>
              <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-4">
                <Markdown text={cur.a} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
