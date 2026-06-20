'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { embedQueryClient, modelLoaded } from '@/lib/embed-client';

interface Res { slug: string; title: string; source: string; text: string; score: number; }

const SOURCE_COLORS: Record<string, string> = {
  substack: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  gablog: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  book: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  pdf: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  reddit: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  twitter: 'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300',
  chronicle: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  ap: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
};
const SOURCE_LABELS: Record<string, string> = {
  substack: 'Substack', gablog: 'GABlog', book: 'Anthropomorphics', pdf: 'Essay',
  reddit: 'Reddit', twitter: 'X', chronicle: 'Chronicle', ap: 'AP Journal',
};

type Status = 'idle' | 'loading-model' | 'searching' | 'done' | 'error';

export default function SemanticResults({ query }: { query: string }) {
  const [results, setResults] = useState<Res[] | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const reqId = useRef(0);

  useEffect(() => {
    const q = query.trim();
    if (!q) { setResults(null); setStatus('idle'); return; }
    const id = ++reqId.current;
    (async () => {
      try {
        setStatus(modelLoaded() ? 'searching' : 'loading-model');
        const vec = await embedQueryClient(q, (p) => { if (id === reqId.current) setProgress(p); });
        if (id !== reqId.current) return;
        setStatus('searching');
        const r = await fetch('/api/semantic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vector: vec }),
        });
        if (id !== reqId.current) return;
        if (!r.ok) throw new Error('unavailable');
        const data = await r.json();
        if (id !== reqId.current) return;
        setResults(data.results || []);
        setStatus('done');
      } catch {
        if (id === reqId.current) setStatus('error');
      }
    })();
  }, [query]);

  if (status === 'idle') return null;

  if (status === 'loading-model') {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Loading the semantic model…</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">~30&nbsp;MB, downloaded once and cached in your browser</p>
        <div className="max-w-xs mx-auto h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all" style={{ width: `${Math.round(progress)}%` }} />
        </div>
      </div>
    );
  }
  if (status === 'searching') {
    return <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">Searching by meaning…</p>;
  }
  if (status === 'error') {
    return (
      <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Meaning search isn&rsquo;t available right now.</p>
        <p className="mt-1 text-xs">Try Keyword Search, or ask the question in Ask AI.</p>
      </div>
    );
  }
  if (!results || results.length === 0) {
    return <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">No passages found.</p>;
  }

  return (
    <div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        {results.length} passages by meaning — closest first
      </p>
      <div className="flex flex-col gap-2.5">
        {results.map((r, i) => (
          <Link
            key={`${r.slug}-${i}`}
            href={`/post/${r.slug}`}
            className="group block rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all px-4 py-3"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${SOURCE_COLORS[r.source] || 'bg-gray-100 text-gray-600'}`}>
                {SOURCE_LABELS[r.source] || r.source}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                {r.title}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">{r.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
