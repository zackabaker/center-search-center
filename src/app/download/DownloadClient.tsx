'use client';

import { useState } from 'react';
import { ContentSource } from '@/lib/types';

interface SourceInfo {
  id: ContentSource;
  label: string;
  count: number;
  wordCount: number;
  color: string;
  description: string;
  /** If true, unchecked by default and shown with an "archival" note */
  optional?: boolean;
}

interface Props {
  sources: SourceInfo[];
  totalCount: number;
  totalWords: number;
}

const FORMAT_OPTIONS = [
  {
    id: 'json' as const,
    label: 'JSON',
    description: 'Structured data — slug, title, source, date, URL, content. Best for programmatic use.',
  },
  {
    id: 'txt' as const,
    label: 'Plain Text',
    description: 'Human-readable. Each post separated by headers. Best for reading or Ctrl+F search.',
  },
];

function fmtWords(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M words`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K words`;
  return `${n} words`;
}

function fmtCount(n: number) {
  return n.toLocaleString();
}

export default function DownloadClient({ sources, totalCount, totalWords }: Props) {
  const [selected, setSelected] = useState<Set<ContentSource>>(
    // Optional sources (e.g. chronicles) are unchecked by default
    new Set(sources.filter((s) => !s.optional).map((s) => s.id))
  );
  const [format, setFormat] = useState<'json' | 'txt'>('json');

  const toggle = (id: ContentSource) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(sources.map((s) => s.id)));
  const selectNone = () => setSelected(new Set());

  const selectedSources = sources.filter((s) => selected.has(s.id));
  const selectedCount = selectedSources.reduce((s, x) => s + x.count, 0);
  const selectedWords = selectedSources.reduce((s, x) => s + x.wordCount, 0);

  const downloadUrl = selected.size === 0
    ? null
    : `/api/download?sources=${Array.from(selected).join(',')}&format=${format}`;

  return (
    <div className="space-y-8">
      {/* Source selector */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Sources</h2>
          <div className="flex gap-3 text-sm">
            <button
              onClick={selectAll}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              All
            </button>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <button
              onClick={selectNone}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              None
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          {sources.map((src) => {
            const checked = selected.has(src.id);
            return (
              <label
                key={src.id}
                className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors select-none ${
                  checked
                    ? 'bg-white dark:bg-gray-900'
                    : 'bg-gray-50 dark:bg-gray-900/50 opacity-60'
                } hover:bg-gray-50 dark:hover:bg-gray-800/50`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(src.id)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-gray-900 focus:ring-gray-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${src.color}`}>
                      {src.label}
                    </span>
                    {src.optional && (
                      <span className="text-xs px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500">
                        archival
                      </span>
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {src.description}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {fmtCount(src.count)} posts
                  </div>
                  <div className="text-xs text-gray-400">{fmtWords(src.wordCount)}</div>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* Format selector */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Format</h2>
        <div className="grid grid-cols-2 gap-3">
          {FORMAT_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={`flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                format === opt.id
                  ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="format"
                  value={opt.id}
                  checked={format === opt.id}
                  onChange={() => setFormat(opt.id)}
                  className="h-4 w-4"
                />
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  {opt.label}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-6">
                {opt.description}
              </p>
            </label>
          ))}
        </div>
      </section>

      {/* Summary + download */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Selected</div>
            {selected.size === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">No sources selected</p>
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {fmtCount(selectedCount)}{' '}
                  <span className="text-base font-normal text-gray-500">posts</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{fmtWords(selectedWords)}</p>
              </>
            )}
          </div>

          {downloadUrl ? (
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download {format.toUpperCase()}
            </a>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm font-semibold cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </button>
          )}
        </div>
      </section>

      {/* Usage note */}
      <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
        The archive is provided for personal research and study. All texts remain the property
        of their respective authors. Large downloads may take a moment to generate — the full
        archive is several megabytes.
      </p>
    </div>
  );
}
