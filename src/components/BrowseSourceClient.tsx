'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Post } from '@/lib/types';
import { useReadingList } from '@/hooks/useReadingList';

// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 50;

const SOURCE_LABELS: Record<string, string> = {
  gablog: 'GABlog', substack: 'Substack', book: 'Book',
  pdf: 'Essay', reddit: 'Reddit', twitter: 'X',
};
const SOURCE_COLORS: Record<string, string> = {
  gablog:   'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  substack: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  book:     'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  pdf:      'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  reddit:   'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  twitter:  'bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-300',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function wordCount(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

function fmtWords(n: number): string {
  if (n < 1000) return `~${n}w`;
  return `~${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
}

function fmtYear(dateStr: string): number | null {
  try {
    const y = new Date(dateStr).getFullYear();
    return isNaN(y) ? null : y;
  } catch { return null; }
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-700/60 text-yellow-900 dark:text-yellow-100 rounded-sm px-0.5">{part}</mark>
      : part
  );
}

function groupByYear(posts: Post[]): [string, Post[]][] {
  const groups = new Map<string, Post[]>();
  for (const p of posts) {
    const year = p.date ? (fmtYear(p.date)?.toString() ?? 'Undated') : 'Undated';
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(p);
  }
  return [...groups.entries()].sort(([a], [b]) => {
    if (a === 'Undated') return 1;
    if (b === 'Undated') return -1;
    return parseInt(b) - parseInt(a);
  });
}

function compileToText(posts: Post[], wcMap: Map<string, number>): string {
  const header = [
    'CENTER STUDY CENTER — COMPILED READING',
    `Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    `Posts: ${posts.length}`,
    '═'.repeat(56),
    '',
  ].join('\n');

  const sections = posts.map((p) => [
    `Title:  ${p.title}`,
    `Source: ${SOURCE_LABELS[p.source] ?? p.source}`,
    `Date:   ${p.date ?? 'n.d.'}`,
    `Words:  ${fmtWords(wcMap.get(p.slug) ?? 0)}`,
    `URL:    https://center.study/post/${p.slug}`,
    '',
    p.content,
    '',
    '─'.repeat(56),
    '',
  ].join('\n'));

  return header + sections.join('\n');
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  posts: Post[];
  source: string;
  totalCount: number;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BrowseSourceClient({ posts, source, totalCount }: Props) {
  const [query, setQuery]         = useState('');
  const [sortBy, setSortBy]       = useState<'newest' | 'oldest' | 'longest'>('newest');
  const [yearFrom, setYearFrom]   = useState<number | ''>('');
  const [yearTo, setYearTo]       = useState<number | ''>('');
  const [page, setPage]           = useState(0);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected]   = useState<Set<string>>(new Set());

  const { isSaved, toggle: toggleSave } = useReadingList();

  // Pre-compute word counts once
  const wcMap = useMemo(
    () => new Map(posts.map((p) => [p.slug, wordCount(p.content)])),
    [posts]
  );

  // Available years for the range filter
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    posts.forEach((p) => { if (p.date) { const y = fmtYear(p.date); if (y) years.add(y); } });
    return [...years].sort((a, b) => a - b);
  }, [posts]);

  const hasDates = availableYears.length > 0;
  const minYear  = availableYears[0] ?? 2000;
  const maxYear  = availableYears[availableYears.length - 1] ?? new Date().getFullYear();

  // ── Filtering + sorting ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...posts];
    const q = query.trim().toLowerCase();

    if (q) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      );
    }
    if (yearFrom !== '') {
      result = result.filter((p) => {
        if (!p.date) return q === ''; // keep undated only when not text-filtering
        const y = fmtYear(p.date);
        return y !== null && y >= (yearFrom as number);
      });
    }
    if (yearTo !== '') {
      result = result.filter((p) => {
        if (!p.date) return q === '';
        const y = fmtYear(p.date);
        return y !== null && y <= (yearTo as number);
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'longest') {
        return (wcMap.get(b.slug) ?? 0) - (wcMap.get(a.slug) ?? 0);
      }
      const ta = a.date ? new Date(a.date).getTime() : 0;
      const tb = b.date ? new Date(b.date).getTime() : 0;
      if (ta && tb) return sortBy === 'newest' ? tb - ta : ta - tb;
      if (ta) return sortBy === 'newest' ? -1 : 1;
      if (tb) return sortBy === 'newest' ? 1 : -1;
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [posts, query, yearFrom, yearTo, sortBy, wcMap]);

  const isFiltering = query.trim().length > 0 || yearFrom !== '' || yearTo !== '';
  const activeFilterCount = [
    query.trim().length > 0 ? 1 : 0,
    yearFrom !== '' ? 1 : 0,
    yearTo !== '' ? 1 : 0,
    sortBy !== 'newest' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const totalPages = isFiltering ? 1 : Math.ceil(filtered.length / PAGE_SIZE);
  const displayPosts = isFiltering
    ? filtered
    : filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const useYearGroups =
    !isFiltering && sortBy !== 'longest' && hasDates && page === 0;
  const yearGroups = useYearGroups ? groupByYear(displayPosts) : null;

  // ── Selection helpers ────────────────────────────────────────────────────
  const toggleSelect = useCallback((slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }, []);

  const selectAll = () => setSelected(new Set(displayPosts.map((p) => p.slug)));
  const clearSelected = () => setSelected(new Set());

  const exitSelectMode = () => { setSelectMode(false); clearSelected(); };

  const handleDownload = () => {
    const selectedPosts = posts.filter((p) => selected.has(p.slug));
    if (!selectedPosts.length) return;
    const text = compileToText(selectedPosts, wcMap);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `center-study-${selectedPosts.length}-posts.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const selectedPosts = posts.filter((p) => selected.has(p.slug));
    if (!selectedPosts.length) return;
    const text = compileToText(selectedPosts, wcMap);
    const win  = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Center Study — ${selectedPosts.length} posts</title>
      <style>
        body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #111; line-height: 1.7; }
        pre { white-space: pre-wrap; font-family: inherit; font-size: 1rem; }
        @media print { body { margin: 0; } }
      </style></head>
      <body><pre>${text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
      <script>window.print();</script></body></html>
    `);
    win.document.close();
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleQuery = (val: string) => { setQuery(val); setPage(0); };
  const handleSort  = (val: 'newest' | 'oldest' | 'longest') => { setSortBy(val); setPage(0); };
  const handleYearFrom = (val: number | '') => { setYearFrom(val); setPage(0); };
  const handleYearTo   = (val: number | '') => { setYearTo(val);   setPage(0); };

  const clearAll = () => {
    setQuery('');
    setSortBy('newest');
    setYearFrom('');
    setYearTo('');
    setPage(0);
  };

  const backParam = `?back=/browse/${source}`;
  const showSource = source === 'all' || source === 'threads';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>

      {/* ── Toolbar row ── */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {/* Search input */}
        <div className="relative flex-1 min-w-[180px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text" value={query}
            onChange={(e) => handleQuery(e.target.value)}
            placeholder="Filter by title or topic…"
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          />
          {query && (
            <button onClick={() => handleQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-0.5 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value as 'newest' | 'oldest' | 'longest')}
          className="py-2 pl-3 pr-7 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="longest">Longest first</option>
        </select>

        {/* Select mode toggle */}
        <button
          onClick={() => { setSelectMode((v) => !v); clearSelected(); }}
          className={`px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
            selectMode
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-900'
          }`}
        >
          Select
        </button>
      </div>

      {/* ── Date range filter ── */}
      {hasDates && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs text-gray-400 dark:text-gray-500">Year</span>
          <select
            value={yearFrom}
            onChange={(e) => handleYearFrom(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
            className="py-1.5 pl-2 pr-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center' }}
          >
            <option value="">From…</option>
            {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="text-xs text-gray-400 dark:text-gray-600">to</span>
          <select
            value={yearTo}
            onChange={(e) => handleYearTo(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
            className="py-1.5 pl-2 pr-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center' }}
          >
            <option value="">To…</option>
            {[...availableYears].reverse().map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          {activeFilterCount > 0 && (
            <button onClick={clearAll}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline underline-offset-2 transition-colors">
              Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}

      {/* ── Filter result summary ── */}
      {isFiltering && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {filtered.length === 0
            ? 'No posts match current filters'
            : `${filtered.length.toLocaleString()} of ${totalCount.toLocaleString()} posts`}
          {query.trim() && (
            <span className="text-gray-400 dark:text-gray-600"> matching &ldquo;{query.trim()}&rdquo;</span>
          )}
        </p>
      )}

      {/* ── Selection toolbar ── */}
      {selectMode && (
        <div className={`flex items-center gap-3 mb-4 p-3 rounded-xl border transition-all ${
          selected.size > 0
            ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30'
            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
        }`}>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
            {selected.size > 0 ? `${selected.size} selected` : 'Select posts to compile'}
          </span>
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            {selected.size > 0 ? (
              <>
                <button onClick={selectAll}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                  Select all {displayPosts.length}
                </button>
                <button onClick={clearSelected}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-500 hover:border-gray-400 transition-colors">
                  Clear
                </button>
                <button onClick={handleDownload}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-80 transition-opacity font-medium flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download .txt
                </button>
                <button onClick={handlePrint}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
              </>
            ) : (
              <>
                <button onClick={selectAll}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                  Select all {displayPosts.length}
                </button>
                <button onClick={exitSelectMode}
                  className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {displayPosts.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">No posts match current filters</p>
          <button onClick={clearAll}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
            Clear all filters
          </button>
        </div>
      )}

      {/* ── Post list ── */}
      {displayPosts.length > 0 && (
        yearGroups ? (
          // Year-grouped (default view for dated sources)
          <div className="space-y-7">
            {yearGroups.map(([year, yearPosts]) => (
              <div key={year}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    {year}
                  </span>
                  <span className="text-[10px] text-gray-300 dark:text-gray-700">{yearPosts.length}</span>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  {yearPosts.map((post, i) => (
                    <PostRow
                      key={post.slug}
                      post={post}
                      backParam={backParam}
                      wc={wcMap.get(post.slug) ?? 0}
                      query={query}
                      isSelected={selected.has(post.slug)}
                      onToggleSelect={toggleSelect}
                      isSaved={isSaved(post.slug)}
                      onToggleSave={() => toggleSave({ slug: post.slug, title: post.title, source: post.source, date: post.date, savedAt: '' })}
                      isLast={i === yearPosts.length - 1}
                      selectMode={selectMode}
                      showSource={showSource}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Flat list (filtered, sorted by length, or undated source)
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            {displayPosts.map((post, i) => (
              <PostRow
                key={post.slug}
                post={post}
                backParam={backParam}
                wc={wcMap.get(post.slug) ?? 0}
                query={query}
                isSelected={selected.has(post.slug)}
                onToggleSelect={toggleSelect}
                isSaved={isSaved(post.slug)}
                onToggleSave={() => toggleSave({ slug: post.slug, title: post.title, source: post.source, date: post.date, savedAt: '' })}
                isLast={i === displayPosts.length - 1}
                selectMode={selectMode}
                showSource={showSource}
              />
            ))}
          </div>
        )
      )}

      {/* ── Pagination ── */}
      {!isFiltering && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Newer
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Older →
            </button>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Page {page + 1} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}

// ── PostRow ───────────────────────────────────────────────────────────────────

interface PostRowProps {
  post: Post;
  backParam: string;
  wc: number;
  query: string;
  isSelected: boolean;
  onToggleSelect: (slug: string) => void;
  isSaved: boolean;
  onToggleSave: () => void;
  isLast: boolean;
  selectMode: boolean;
  showSource: boolean;
}

function PostRow({
  post, backParam, wc, query, isSelected, onToggleSelect,
  isSaved, onToggleSave, isLast, selectMode, showSource,
}: PostRowProps) {
  return (
    <div className={`group flex items-start gap-3 p-4 bg-white dark:bg-gray-900 transition-colors ${
      isSelected ? 'bg-blue-50 dark:bg-blue-950/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
    } ${isLast ? '' : 'border-b border-gray-100 dark:border-gray-800'}`}>

      {/* Checkbox (select mode) */}
      {selectMode && (
        <button
          onClick={() => onToggleSelect(post.slug)}
          className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded border transition-colors ${
            isSelected
              ? 'bg-blue-600 border-blue-600'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          } flex items-center justify-center`}
          aria-label={isSelected ? 'Deselect' : 'Select'}
        >
          {isSelected && (
            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5l2.5 2.5L8.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      )}

      {/* Main content — clicking goes to post */}
      <Link
        href={`/post/${post.slug}${backParam}`}
        className="flex-1 min-w-0 block"
      >
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {showSource && post.source in SOURCE_LABELS && (
              <span className={`flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium mt-0.5 ${SOURCE_COLORS[post.source] ?? ''}`}>
                {SOURCE_LABELS[post.source]}
              </span>
            )}
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
              {highlightText(post.title, query)}
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
            <span className="hidden sm:inline text-[11px] text-gray-400 dark:text-gray-600 tabular-nums">
              {fmtWords(wc)}
            </span>
            {post.date && (
              <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums whitespace-nowrap">
                {post.date}
              </span>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
          {highlightText(post.excerpt, query)}
        </p>
      </Link>

      {/* Bookmark button */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
        title={isSaved ? 'Remove from reading list' : 'Save to reading list'}
        className={`flex-shrink-0 p-1.5 rounded-lg transition-colors mt-0.5 ${
          isSaved
            ? 'text-blue-500 dark:text-blue-400'
            : 'text-gray-300 dark:text-gray-700 hover:text-gray-500 dark:hover:text-gray-400 opacity-0 group-hover:opacity-100'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isSaved ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    </div>
  );
}
