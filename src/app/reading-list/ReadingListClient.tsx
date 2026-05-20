'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useReadingList, SavedPost } from '@/hooks/useReadingList';
import { useReadingHistory } from '@/hooks/useReadingHistory';

const SOURCE_COLORS: Record<string, string> = {
  substack: 'bg-orange-100 text-orange-700',
  gablog:   'bg-blue-100 text-blue-700',
  book:     'bg-purple-100 text-purple-700',
  pdf:      'bg-green-100 text-green-700',
  reddit:   'bg-red-100 text-red-700',
  twitter:  'bg-slate-100 text-slate-600',
};

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Substack', gablog: 'GABlog', book: 'Book', pdf: 'PDF',
  reddit: 'Reddit', twitter: 'X / Twitter',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ReadingListClient() {
  const { list, toggle, clear } = useReadingList();
  const { history, clear: clearHistory } = useReadingHistory();
  const [tab, setTab] = useState<'saved' | 'history'>('saved');
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    if (tab === 'saved') clear();
    else clearHistory();
    setConfirmClear(false);
  };

  const isEmpty = tab === 'saved' ? list.length === 0 : history.length === 0;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">← Archive</Link>
        <h1 className="text-2xl sm:text-3xl font-bold mt-3 mb-1 text-gray-900 dark:text-white">Reading List</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Saved posts and reading history, stored in your browser.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(['saved', 'history'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setConfirmClear(false); }}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors font-medium ${
                tab === t
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t === 'saved' ? `Saved (${list.length})` : `History (${history.length})`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {tab === 'saved' && list.length > 0 && (
            <button
              onClick={() => {
                const data = JSON.stringify({ exported: new Date().toISOString(), posts: list }, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'center-study-saved.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
              title="Export saved posts as JSON"
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
            >
              Export
            </button>
          )}
          {!isEmpty && (
            <button
              onClick={handleClear}
              onBlur={() => setConfirmClear(false)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                confirmClear
                  ? 'border-red-300 text-red-600 bg-red-50 hover:bg-red-100'
                  : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'
              }`}
            >
              {confirmClear ? 'Confirm clear?' : 'Clear'}
            </button>
          )}
        </div>
      </div>

      {isEmpty ? (
        <div className="text-center py-16 text-gray-400">
          {tab === 'saved' ? (
            <>
              <p className="text-base mb-2">No saved posts yet</p>
              <p className="text-sm">Click the bookmark icon on any post to save it here.</p>
            </>
          ) : (
            <>
              <p className="text-base mb-2">No reading history yet</p>
              <p className="text-sm">Posts you open will appear here automatically.</p>
            </>
          )}
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm hover:opacity-80 transition-opacity"
          >
            Browse the archive →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {(tab === 'saved' ? list : history).map((item) => {
            const post = item as SavedPost & { viewedAt?: string };
            return (
              <div
                key={post.slug}
                className="group flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${SOURCE_COLORS[post.source] || 'bg-gray-100 text-gray-600'}`}>
                      {SOURCE_LABELS[post.source] || post.source}
                    </span>
                    {post.date && <span className="text-xs text-gray-400">{post.date}</span>}
                    <span className="text-xs text-gray-400">
                      {tab === 'saved'
                        ? `Saved ${formatDate((post as SavedPost).savedAt)}`
                        : `Read ${formatDate((post as { viewedAt: string }).viewedAt)}`}
                    </span>
                  </div>
                  <Link
                    href={`/post/${post.slug}`}
                    className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug"
                  >
                    {post.title}
                  </Link>
                </div>
                {tab === 'saved' && (
                  <button
                    onClick={() => toggle(post as SavedPost)}
                    title="Remove from saved"
                    className="flex-shrink-0 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
