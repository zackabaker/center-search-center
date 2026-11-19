'use client';

import { useState } from 'react';

type Hit = {
  key: string; title: string; source: string; date: string | null; url: string; text: string;
  score: number; keywordRank: number | null; meaningRank: number | null; cosine: number | null;
};
type Result = {
  status: { paragraphs: number; texts: number; embedded: number };
  meaning: boolean;
  results: Hit[];
};

export default function TutorSearch() {
  const [q, setQ] = useState('');
  const [mode, setMode] = useState<'hybrid' | 'keyword'>('hybrid');
  const [data, setData] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (query: string, m: 'hybrid' | 'keyword') => {
    if (query.trim().length < 2) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/tutor/search?mode=${m}&q=${encodeURIComponent(query.trim())}`);
      if (!res.ok) throw new Error(String(res.status));
      setData(await res.json());
    } catch {
      setError('The search did not come back. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const pill = (on: boolean) =>
    `rounded-full px-2.5 py-1 text-xs transition-colors ${
      on
        ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;

  return (
    <div className="mt-4">
      <form
        onSubmit={(e) => { e.preventDefault(); run(q, mode); }}
        className="flex gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="A question a visitor might ask…"
          aria-label="Test question"
          className="min-w-0 flex-1 rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
        />
        <button type="submit" disabled={busy} className="rounded bg-gray-900 px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900">
          {busy ? 'Searching…' : 'Search'}
        </button>
      </form>
      <div className="mt-2 flex gap-1.5">
        {(['hybrid', 'keyword'] as const).map((m) => (
          <button key={m} type="button" className={pill(mode === m)} onClick={() => { setMode(m); run(q, m); }}>
            {m === 'hybrid' ? 'Keyword + meaning' : 'Keyword only'}
          </button>
        ))}
      </div>
      {error && <p className="mt-3 text-sm text-rose-700 dark:text-rose-300">{error}</p>}
      {data && (
        <>
          <p className="mt-3 text-xs text-gray-400">
            {data.status.paragraphs.toLocaleString('en-US')} paragraphs from {data.status.texts.toLocaleString('en-US')} texts; {data.status.embedded.toLocaleString('en-US')} have a meaning vector.
            {mode === 'hybrid' && !data.meaning && ' Meaning search was unavailable for this query — these are keyword results.'}
          </p>
          <ol className="mt-3 divide-y divide-gray-200 dark:divide-gray-800 border-y border-gray-200 dark:border-gray-800">
            {data.results.map((h, i) => (
              <li key={h.key} className="py-3">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
                  <span className="w-5 shrink-0 text-xs tabular-nums text-gray-400">{i + 1}</span>
                  <a href={h.url} target="_blank" rel="noreferrer" className="font-medium text-gray-900 hover:underline dark:text-gray-100">{h.title}</a>
                  <span className="text-xs text-gray-400">{h.source}{h.date ? ` · ${h.date.slice(0, 10)}` : ''} · ¶{h.key.split('#')[1]}</span>
                </div>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{h.text}</p>
                <p className="mt-1 text-xs tabular-nums text-gray-400">
                  keyword {h.keywordRank ? `#${h.keywordRank}` : '—'} · meaning {h.meaningRank ? `#${h.meaningRank} (${h.cosine})` : '—'} · fused {h.score}
                </p>
              </li>
            ))}
            {data.results.length === 0 && <li className="py-3 text-sm text-gray-400">Nothing matched.</li>}
          </ol>
        </>
      )}
    </div>
  );
}
