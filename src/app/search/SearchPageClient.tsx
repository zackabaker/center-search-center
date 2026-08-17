'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link, { useLinkStatus } from 'next/link';
import { ContentSource } from '@/lib/types';
import { logSearch } from '@/lib/log-search';
import {
  SearchEntry,
  SearchResult,
  WordIndex,
  buildWordIndex,
  searchEntries,
  countPostsWithTerm,
  stemWord,
} from '@/lib/search-index';
import FilterTabs from '@/components/FilterTabs';
import TopLoadingBar from '@/components/TopLoadingBar';
import { GLOSSARY_LINK_TERMS } from '@/data/guide/glossary-link-terms';
import { CS_TERMS, TERM_TO_CONCEPT_SLUG, CONCEPT_TITLES } from '@/lib/cs-terms';

// Suggestion pool: concept terms + glossary terms (deduped, lowercased keys)
const SUGGESTION_POOL: string[] = (() => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of [...CS_TERMS.map((x) => x.term), ...GLOSSARY_LINK_TERMS.map((x) => x.term)]) {
    const k = t.toLowerCase();
    if (!seen.has(k)) { seen.add(k); out.push(t); }
  }
  return out;
})();
import SceneMark from '@/components/SceneMark';
import SemanticResults from './SemanticResults';
import { activeExpansions } from '@/lib/vocab';

type FilterOption = 'all' | ContentSource;

// Share the current results: the URL already carries ?q= (and ?mode=meaning),
// so sharing is just surfacing the address — share sheet on mobile, copy-link
// elsewhere.
function ShareResults({ query }: { query: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Center Study search: ${query}`, url });
        return;
      }
    } catch { return; } // user dismissed the sheet
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  return (
    <button
      onClick={share}
      title="Share a link to these results"
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex-shrink-0"
    >
      {copied ? (
        <span className="text-green-600 dark:text-green-400">Link copied</span>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="hidden sm:inline">Share results</span>
          <span className="sm:hidden">Share</span>
        </>
      )}
    </button>
  );
}

const SOURCE_LABELS: Record<ContentSource, string> = {
  substack:  'Substack',
  gablog:    'GABlog',
  book:      'Book',
  pdf:       'Essays & Articles',
  reddit:    'Reddit',
  twitter:   'X / Twitter',
  chronicle: 'Chronicle · Gans',
  ap:        'Anthropoetics · ref',
};
const SOURCE_COLORS: Record<ContentSource, string> = {
  substack:  'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  gablog:    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  book:      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  pdf:       'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  reddit:    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  twitter:   'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300',
  // Reference tier — muted; color (and amber especially) is for Katz sources
  chronicle: 'bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400',
  ap:        'bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400',
};

const RECENT_KEY = 'csc-recent-searches';
const MAX_RECENT = 8;
function getRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function saveRecent(q: string) {
  const r = getRecent().filter((s) => s !== q);
  r.unshift(q);
  localStorage.setItem(RECENT_KEY, JSON.stringify(r.slice(0, MAX_RECENT)));
}

// ── Highlight matching terms in a text node ──────────────────────────────────
// Edit distance capped at 3 — enough to catch typos in GA vocabulary
function editDistance(a: string, b: string, cap = 3): number {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => i);
  for (let j = 1; j <= b.length; j++) {
    let prev = dp[0];
    dp[0] = j;
    for (let i = 1; i <= a.length; i++) {
      const tmp = dp[i];
      dp[i] = Math.min(dp[i] + 1, dp[i - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[a.length];
}

// Vocabulary terms close to a failed query — substring match or a query word
// within edit distance 2 of a term word.
function suggestTerms(q: string, limit = 5): string[] {
  // Strip quotes and operators the search syntax may have added
  const ql = q.toLowerCase().replace(/["'\u201c\u201d]/g, '').replace(/\b(and|or|not)\b/g, ' ').trim();
  if (ql.length < 3) return [];
  const qWords = ql.split(/\s+/).filter((w) => w.length >= 4);
  const scored: { term: string; score: number }[] = [];
  for (const term of SUGGESTION_POOL) {
    const tl = term.toLowerCase();
    let score = 0;
    if (tl.includes(ql) || ql.includes(tl)) score = 3;
    else {
      for (const qw of qWords) {
        for (const tw of tl.split(/\s+/)) {
          const d = editDistance(qw, tw, 2);
          if (d <= 1) score = Math.max(score, 2);
          else if (d === 2 && qw.length >= 6) score = Math.max(score, 1);
        }
      }
    }
    if (score > 0) scored.push({ term, score });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((x) => x.term);
}

const HIGHLIGHT_STOPWORDS = new Set([
  'the', 'of', 'a', 'an', 'and', 'or', 'but', 'to', 'in', 'on', 'at', 'is', 'it',
  'as', 'by', 'for', 'with', 'that', 'this', 'be', 'are', 'was',
]);

function highlight(text: string, query: string) {
  const clean = query.replace(/"/g, '').replace(/\b(AND|OR|NOT)\b/gi, '').trim();
  if (!clean) return text;
  const esc = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const words = clean.split(/\s+/).filter(Boolean);
  const alts: string[] = [];
  // Whole phrase first (ordered alternation → matches "cloud of unknowing" as one
  // unit before any single word does), allowing flexible whitespace between words.
  if (words.length > 1) alts.push(words.map(esc).join('\\s+'));
  // Then individual meaningful terms — skip lone stopwords so a bare "of" or "the"
  // isn't highlighted on its own.
  for (const w of words) if (!HIGHLIGHT_STOPWORDS.has(w.toLowerCase())) alts.push(esc(w));
  // All-stopword query (e.g. a title) → fall back to highlighting every word.
  if (alts.length === 0) alts.push(...words.map(esc));
  const regex = new RegExp(`\\b(${alts.join('|')})\\b`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <mark key={i} className="bg-yellow-200 text-yellow-900 dark:bg-yellow-500/30 dark:text-yellow-200 rounded-sm px-0.5 font-semibold">{part}</mark>
      : part
  );
}

// ── Query commit ─────────────────────────────────────────────────────────────
// A plain query is an AND of its terms (broad, forgiving). Wrapping a query in
// "quotes" makes it a strict exact-phrase search — the contiguous phrase must
// appear in the text. (Previously every query was auto-wrapped as a phrase but
// matched leniently, so "exact phrase" returned loose all-word matches.)
function commitQuery(raw: string): string {
  // Smart quotes (iOS/macOS auto-punctuation, pastes from the site's own
  // typographic text) must count as phrase operators — every downstream
  // consumer (parseQuery, the grep gate, highlighting) expects straight ".
  return raw.trim().replace(/[“”„‟]/g, '"');
}

// ── Transform current query when a syntax hint is clicked ────────────────────
function applySearchSyntax(syntax: string, currentQuery: string): string {
  const base = currentQuery.replace(/"/g, '').replace(/\b(AND|OR|NOT)\b/gi, '').trim();
  const words = base.split(/\s+/).filter(Boolean);
  switch (syntax) {
    case '"exact phrase"':
      return base ? `"${base}"` : '"exact phrase"';
    case 'term AND term':
      if (words.length >= 2) return words.join(' AND ');
      if (words.length === 1) return `${words[0]} AND `;
      return 'term AND term';
    case 'term NOT term':
      if (words.length >= 1) return `${words[0]} NOT `;
      return 'term NOT term';
    case 'term OR term':
      if (words.length >= 2) return words.join(' OR ');
      if (words.length === 1) return `${words[0]} OR `;
      return 'term OR term';
    default:
      return currentQuery;
  }
}

const PAGE_SIZE = 30;

// ── "Did you mean" helpers ────────────────────────────────────────────────────
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const curr = [i];
    for (let j = 1; j <= n; j++) {
      curr[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
    }
    prev.splice(0, prev.length, ...curr);
  }
  return prev[n];
}

function findClosestTerm(term: string, vocab: string[]): string | null {
  if (term.length < 4) return null;
  const stemmed = stemWord(term);
  let best: string | null = null;
  let bestDist = 2; // only suggest if within 2 edits
  for (const w of vocab) {
    if (w.length < 4) continue;
    if (Math.abs(w.length - term.length) > bestDist + 1) continue;
    // Quick first-char filter (most typos don't change first letter)
    if (w[0] !== term[0] && w[0] !== stemmed[0]) continue;
    const d = Math.min(levenshtein(term, w), levenshtein(stemmed, w));
    if (d > 0 && d < bestDist) { bestDist = d; best = w; }
    if (d === 1) break; // can't improve on edit-distance 1
  }
  return best;
}

// Open affordance shown inside each result Link. useLinkStatus reports the
// pending state of the enclosing Link, so a tap gives immediate feedback even
// when the destination (a dynamic post page) takes a moment to load — instead
// of looking like a frozen page on mobile.
function ResultOpen() {
  const { pending } = useLinkStatus();
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium flex-shrink-0 transition-colors ${
      pending ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
    }`}>
      {pending ? (
        <>
          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-90" fill="currentColor" d="M12 2a10 10 0 0110 10h-3a7 7 0 00-7-7V2z" />
          </svg>
          Opening…
        </>
      ) : (
        <>Open<span aria-hidden> →</span></>
      )}
    </span>
  );
}

export default function SearchPageClient({
  entries,
  totalPosts,
}: {
  entries: SearchEntry[];
  totalPosts: number;
}) {
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const liveDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  // ONE search, no modes: keyword results render instantly from the client
  // index and a "Passages by meaning" section streams in below once the query
  // settles (operators suppress it). The old Keyword/Meaning fork is gone;
  // /search?mode=meaning deep links land here and get both.
  // Read the URL directly as a fallback: the loading shell writes ?q=
  // via history.replaceState, which Next's useSearchParams doesn't observe.
  const urlParam = (k: string) => {
    const fromRouter = searchParams.get(k);
    if (fromRouter !== null) return fromRouter;
    if (typeof window !== 'undefined') {
      try { return new URLSearchParams(window.location.search).get(k); } catch {}
    }
    return null;
  };

  const initialQ = urlParam('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [committed, setCommitted] = useState(initialQ ? commitQuery(initialQ) : '');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [page, setPage] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [corpusCount, setCorpusCount] = useState<number | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  // What other readers search — from the anonymous search log (best-effort).
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  // Result ordering: relevance (default) or by publication date.
  const [sort, setSort] = useState<'relevance' | 'newest' | 'oldest'>('relevance');

  // Full-corpus phrase scan (/api/grep). The local index only phrase-matches
  // each text's opening, so phrase queries with thin local results get one
  // server pass over FULL content — keyed to the committed query, never fired
  // per keystroke.
  type GrepData = {
    phrase: string;
    totalPosts: number;
    totalOccurrences: number;
    refPosts?: number;
    refOccurrences?: number;
    posts: { slug: string; title: string; source: string; date: string; count: number; snippet: string }[];
  };
  const [grep, setGrep] = useState<GrepData | null>(null);
  const [grepStatus, setGrepStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  // The meaning section runs on SETTLED queries only (~1s after the last
  // commit), so live typing never hits the embedding endpoint; explicit
  // operators suppress it — power users asked for exactness, not neighbors.
  const [semanticQ, setSemanticQ] = useState('');

  useEffect(() => {
    fetch('/api/search-log')
      .then((r) => (r.ok ? r.json() : { terms: [] }))
      .then((d) => setPopularSearches((d.terms || []).map((t: { q: string }) => t.q).slice(0, 8)))
      .catch(() => {});
  }, []);

  // Source toggles — Reddit/X and Chronicles/AP are off by default and opt-in.
  // Reddit/X are already in the core index (filtered in/out); Chronicles/AP are
  // fetched lazily the first time they're switched on.
  const [includeThreads, setIncludeThreads] = useState(false);
  const [includeArchives, setIncludeArchives] = useState(false);
  const [archiveEntries, setArchiveEntries] = useState<SearchEntry[]>([]);
  const [archiveLoading, setArchiveLoading] = useState(false);

  useEffect(() => {
    try {
      setIncludeThreads(localStorage.getItem('csc-search-threads') === 'on');
      setIncludeArchives(localStorage.getItem('csc-search-archives') === 'on');
    } catch {}
  }, []);

  const toggleThreads = () => setIncludeThreads((v) => { const n = !v; try { localStorage.setItem('csc-search-threads', n ? 'on' : 'off'); } catch {} return n; });
  const toggleArchives = () => setIncludeArchives((v) => { const n = !v; try { localStorage.setItem('csc-search-archives', n ? 'on' : 'off'); } catch {} return n; });

  // Sources searched by meaning (semantic) mode — core (Adam's writing) is always
  // on; Reddit/X and Chronicles/AP are opt-in via the same toggles as keyword, so
  // the Chronicles don't flood meaning results unless explicitly asked for.
  const allowedSources = useMemo(() => {
    const s = ['substack', 'gablog', 'book', 'pdf'];
    if (includeThreads) s.push('reddit', 'twitter');
    if (includeArchives) s.push('chronicle', 'ap');
    return s;
  }, [includeThreads, includeArchives]);

  // Lazy-load the Chronicles + AP index the first time archives are enabled
  useEffect(() => {
    if (!includeArchives || archiveEntries.length > 0 || archiveLoading) return;
    setArchiveLoading(true);
    fetch(`/api/search-index?scope=archives&v=${process.env.NEXT_PUBLIC_INDEX_V}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d) => { if (Array.isArray(d.entries)) setArchiveEntries(d.entries); })
      .catch(() => {})
      .finally(() => setArchiveLoading(false));
  }, [includeArchives, archiveEntries.length, archiveLoading]);

  // Separate inverted indexes for core and archives so the two corpora are
  // searched independently. Built client-side; archive index built only once
  // the archive entries have loaded.
  const coreWordIndex = useMemo<WordIndex>(() => buildWordIndex(entries), [entries]);
  const archiveWordIndex = useMemo<WordIndex>(() => buildWordIndex(archiveEntries), [archiveEntries]);

  useEffect(() => { setRecentSearches(getRecent()); }, []);
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Run search when the query or the active source set changes. Archives are
  // ADDITIVE — core results are computed independently and never displaced by
  // archive matches; archive results (when enabled) are appended after.
  useEffect(() => {
    if (!committed.trim()) {
      setResults([]);
      setCorpusCount(null);
      setIsSearching(false);
      return;
    }
    let found = searchEntries(entries, committed, coreWordIndex).filter((r) => {
      const s = r.entry.source;
      if ((s === 'reddit' || s === 'twitter') && !includeThreads) return false;
      return true;
    });
    if (includeArchives && archiveEntries.length > 0) {
      found = found.concat(searchEntries(archiveEntries, committed, archiveWordIndex));
    }
    const cleanQ = committed.replace(/"/g, '').replace(/\b(AND|OR|NOT)\b/gi, '').trim();
    const firstTerm = cleanQ.split(/\s+/)[0];
    setResults(found);
    setPage(0);
    setCorpusCount(firstTerm ? countPostsWithTerm(entries, firstTerm) : null);
    setIsSearching(false);
  }, [committed, entries, coreWordIndex, archiveEntries, archiveWordIndex, includeThreads, includeArchives]);

  // Sync URL
  useEffect(() => {
    const url = new URL(window.location.href);
    if (committed.trim()) {
      url.searchParams.set('q', committed.trim());
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());
  }, [committed]);

  // Log the settled search query (1.5s after it stops changing) so we can later
  // surface what readers look for. Debounced so live-typing logs the finished
  // query, not every keystroke; once per distinct query+mode. Best-effort.
  const lastLoggedRef = useRef('');
  useEffect(() => {
    const q = committed.trim().replace(/^["']+|["']+$/g, '').trim();
    if (q.length < 2) return;
    const key = `keyword:${q}`;
    if (key === lastLoggedRef.current) return;
    const id = setTimeout(() => {
      lastLoggedRef.current = key;
      logSearch(q, 'keyword');
    }, 1500);
    return () => clearTimeout(id);
  }, [committed]);

  // Immediate commit (Enter, Search button, hint clicks, recent searches)
  const handleSubmit = useCallback((q: string) => {
    const normalized = commitQuery(q.trim());
    if (liveDebounceRef.current) clearTimeout(liveDebounceRef.current);
    setIsSearching(false);
    setCommitted(normalized);
    const raw = q.trim();
    if (raw) { saveRecent(raw); setRecentSearches(getRecent()); }
    // An explicit submit means "show me results" — dismiss the phone keyboard
    // so it stops covering the top of the list.
    if (typeof document !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      (document.activeElement as HTMLElement | null)?.blur?.();
    }
  }, []);

  // Live search: auto-phrase-wrap and commit after 100 ms of inactivity
  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
    if (liveDebounceRef.current) clearTimeout(liveDebounceRef.current);
    if (!value.trim()) {
      setCommitted('');
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    liveDebounceRef.current = setTimeout(() => {
      setCommitted(commitQuery(value.trim()));
    }, 100);
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSubmit(query); }
    if (e.key === 'Escape') { setQuery(''); setCommitted(''); inputRef.current?.blur(); }
  };

  const filtered = useMemo(
    () => filter === 'all' ? results : results.filter((r) => r.entry.source === filter),
    [results, filter]
  );

  // Optional date ordering on top of relevance — 30 years of writing deserves
  // a chronological view. parse handles Chronicle-style ordinal dates.
  const visibleResults = useMemo(() => {
    if (sort === 'relevance') return filtered;
    const t = (d: string | null) => {
      if (!d) return null;
      const cleaned = d.replace(/(\d{1,2})(st|nd|rd|th)\b/gi, '$1');
      const parsed = new Date(cleaned).getTime();
      return isNaN(parsed) ? null : parsed;
    };
    return [...filtered].sort((a, b) => {
      const ta = t(a.entry.date);
      const tb = t(b.entry.date);
      if (ta === null && tb === null) return 0;
      if (ta === null) return 1;
      if (tb === null) return -1;
      return sort === 'newest' ? tb - ta : ta - tb;
    });
  }, [filtered, sort]);

  const totalPages = Math.ceil(visibleResults.length / PAGE_SIZE);
  const pageItems = visibleResults.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const counts: Record<FilterOption, number> = useMemo(() => {
    const by = (s: ContentSource) => results.filter((r) => r.entry.source === s).length;
    return {
      all: results.length,
      substack: by('substack'),
      gablog: by('gablog'),
      book: by('book'),
      pdf: by('pdf'),
      reddit: by('reddit'),
      twitter: by('twitter'),
      chronicle: by('chronicle'),
      ap: by('ap'),
    };
  }, [results]);

  const handleFilterChange = (f: FilterOption) => { setFilter(f); setPage(0); };

  const postUrl = (slug: string) =>
    `/post/${slug}${committed.trim() ? `?q=${encodeURIComponent(committed.trim())}` : ''}`;

  const hasQuery = committed.trim().length > 0;
  const hasResults = visibleResults.length > 0;

  // Whether the current query is an explicit exact-phrase search (quoted)
  const isImplicitPhrase = hasQuery && committed.startsWith('"') && committed.endsWith('"') &&
    committed.length > 2;

  // User-typed operators (mid-query quotes or AND/OR/NOT) suppress the
  // universal meaning section; the zero-result rescue exists ONLY for that
  // suppressed path — gating the rescue on this (not on the semanticQ settle
  // timer) prevents mounting SemanticResults twice for the same query.
  const userOperators =
    (!isImplicitPhrase && /["“”]/.test(committed)) || /\b(AND|OR|NOT)\b/.test(committed);

  // "Did you mean" — only computed when results are empty
  const didYouMean = useMemo(() => {
    if (!committed || visibleResults.length > 0) return null;
    const clean = committed.replace(/"/g, '').replace(/\b(AND|OR|NOT)\b/gi, '').trim();
    const firstTerm = clean.split(/\s+/)[0];
    if (!firstTerm || firstTerm.length < 4) return null;
    return findClosestTerm(firstTerm, coreWordIndex.sortedVocab);
  }, [committed, visibleResults.length, coreWordIndex.sortedVocab]);

  // The bare phrase for the full-text scan and the meaning rescue: the quoted
  // segment if there is one, otherwise the query stripped of operators.
  const grepPhrase = useMemo(() => {
    const m = committed.match(/"([^"]{4,})"/);
    return (m ? m[1] : committed.replace(/\b(AND|OR|NOT)\b/gi, ' ').replace(/["“”]/g, ' '))
      .replace(/\s+/g, ' ')
      .trim();
  }, [committed]);

  // Fire the full-corpus scan for EVERY phrase-bearing query — the local
  // index only phrase-matches each text's opening ~20k chars, so even a
  // healthy-looking local result list silently misses deep-only occurrences
  // (the exact failure the scan exists to fix). Single terms already match
  // full content via the word index, so they skip it.
  useEffect(() => {
    setGrep(null);
    setGrepStatus('idle');
    if (!committed) return;
    if (!(isImplicitPhrase || committed.includes('"'))) return;
    if (grepPhrase.replace(/[^a-z0-9]/gi, '').length < 4) return;
    const ctl = new AbortController();
    setGrepStatus('loading');
    fetch(`/api/grep?q=${encodeURIComponent(grepPhrase)}&archives=${includeArchives ? '1' : '0'}`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { setGrep(d); setGrepStatus('done'); })
      .catch(() => { if (!ctl.signal.aborted) setGrepStatus('error'); });
    return () => ctl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committed, isImplicitPhrase, grepPhrase, includeArchives]);

  // Settle the meaning-section query. User-typed operators (quotes that are
  // not the implicit whole-query wrap, or AND/OR/NOT) suppress it entirely.
  useEffect(() => {
    setSemanticQ('');
    if (!committed) return;
    if (userOperators) return;
    const t = setTimeout(() => setSemanticQ(grepPhrase || committed), 1000);
    return () => clearTimeout(t);
  }, [committed, userOperators, grepPhrase]);

  // Corpus-true occurrence counts by slug (overrides the opening-only N×)
  const grepCounts = useMemo(
    () => new Map((grep?.posts ?? []).map((p) => [p.slug, p.count])),
    [grep]
  );

  // Deep matches not already in the visible list — texts where the phrase
  // appears only past the opening the local index covers. Katz tier renders
  // under the main heading; Gans reference material under its own label.
  const deepMatches = useMemo(() => {
    if (!grep) return [];
    const seen = new Set(visibleResults.map((r) => r.entry.slug));
    return grep.posts.filter((p) => !seen.has(p.slug));
  }, [grep, visibleResults]);
  const deepKatz = useMemo(() => deepMatches.filter((p) => p.source !== 'chronicle' && p.source !== 'ap'), [deepMatches]);
  const deepRef = useMemo(() => deepMatches.filter((p) => p.source === 'chronicle' || p.source === 'ap'), [deepMatches]);

  // Vocabulary expansions in play (shared alias layer) — surfaced for trust.
  const expansions = useMemo(() => activeExpansions(committed), [committed]);

  const SYNTAX_HINTS = ['"exact phrase"', 'term AND term', 'term NOT term', 'term OR term'] as const;

  // Speed: idle=1 (slow, like home), typing=2 (medium), searching=7 (fast)
  const iconSpeed = isSearching ? 7 : query ? 2 : 1;

  // Screen-reader announcement — results were previously silent to AT.
  // Settled states only, debounced so as-you-type re-renders don't spam.
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    if (!committed) { setAnnouncement(''); return; }
    if (isSearching || grepStatus === 'loading') { setAnnouncement('Searching…'); return; }
    const t = setTimeout(() => {
      setAnnouncement(
        hasResults
          ? `${visibleResults.length} result${visibleResults.length === 1 ? '' : 's'} for ${committed}`
          : deepMatches.length > 0
          ? `${grep?.totalPosts ?? deepMatches.length} texts found by full-text scan`
          : `No results for ${committed}`
      );
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committed, isSearching, grepStatus, hasResults, visibleResults.length, deepMatches.length]);

  // Source toggles — shared by keyword and meaning. Reddit/X and Chronicles/AP
  // are off by default and opt-in, so the Chronicles don't flood either search.
  const sourceToggles = (
    <div className="flex items-center gap-2 flex-wrap text-xs">
      <span className="text-gray-400 dark:text-gray-500">Also search:</span>
      <button
        onClick={toggleThreads}
        aria-pressed={includeThreads}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors ${
          includeThreads
            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
            : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-violet-400" />
        Reddit &amp; X
      </button>
      <button
        onClick={toggleArchives}
        aria-pressed={includeArchives}
        title="Reference material by Eric Gans — the Chronicles of Love & Resentment and the Anthropoetics journal"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors ${
          includeArchives
            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
            : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gray-400" />
        Gans reference (Chronicles &amp; AP)
        {includeArchives && archiveLoading && <span className="opacity-70">· loading…</span>}
      </button>
    </div>
  );

  return (
    <main className="max-w-4xl w-full mx-auto px-4 pt-6 pb-24 sm:py-10">
      {/* Always-mounted polite status region for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
      {/* Loading bar while the Chronicles/AP index streams in */}
      {archiveLoading && <TopLoadingBar label="Loading Chronicles & AP" />}
      {/* Search header — mode toggle + input pinned as ONE sticky unit, so
          results scroll under a single clean edge. (A separate sticky strip
          let the input slide up behind it and obscured it on mobile.)
          MUST be a direct child of main: sticky only travels within its
          parent, and main must NOT have overflow-x-hidden (any overflow
          on an ancestor disables position:sticky entirely).
          Solid background: backdrop-filter lags on mobile momentum scroll. */}
      <div className="sticky top-12 z-20 -mx-4 px-4 pt-3 pb-3 bg-[var(--background)] border-b border-gray-100 dark:border-gray-800">
        <div className="relative flex items-center border-2 border-gray-200 focus-within:border-gray-400 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 dark:focus-within:border-gray-500 transition-colors">
          {/* Center study icon — reacts to search state; shared view-transition with home icon */}
          <div
            className="ml-3 flex-shrink-0"
            style={{ viewTransitionName: 'center-icon' } as React.CSSProperties}
          >
            <SceneMark size={24} spin speed={iconSpeed} className="text-gray-400 dark:text-gray-500" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search the archive…"
            className="flex-1 min-w-0 px-3 py-3.5 text-base sm:text-lg outline-none bg-transparent dark:text-white dark:placeholder-gray-500"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setCommitted(''); inputRef.current?.focus(); }}
              className="mr-3 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={() => handleSubmit(query)}
            className="mr-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
          >
            Search
          </button>
        </div>
        {/* Ask stays one tap away — the third verb, quiet under the box */}
        {(query.trim() || committed) && (
          <div className="flex justify-end mt-1.5">
            <Link
              href={`/ask?q=${encodeURIComponent((query.trim() || committed).replace(/["“”]/g, '').replace(/\b(AND|OR|NOT)\b/gi, '').replace(/\s+/g, ' ').trim())}`}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors px-1 py-0.5"
            >
              ✦ Ask AI this question →
            </Link>
          </div>
        )}
      </div>{/* end sticky search header */}

      {/* Below-header extras (scroll away under the sticky unit) */}
      <div className="mb-6">
        {/* Concept hub banner — when the query IS one of the 40 curated concepts,
            offer the quote-first hub above the raw results. */}
        {(() => {
          const norm = (query.trim() || committed).toLowerCase().replace(/["“”]/g, '').trim();
          const conceptSlug = TERM_TO_CONCEPT_SLUG[norm];
          const title = conceptSlug ? CONCEPT_TITLES[conceptSlug] : undefined;
          if (!conceptSlug || !title) return null;
          return (
            <Link
              href={`/guide/concepts/${conceptSlug}`}
              className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-600 transition-colors group"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-500 dark:text-blue-400 flex-shrink-0">Concept</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                {title}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">— the curated hub: verbatim definition, key passages, key texts</span>
              <span className="ml-auto text-blue-500 dark:text-blue-400 text-sm flex-shrink-0">→</span>
            </Link>
          );
        })()}

        {/* Syntax hints — desktop only (clutter on mobile) */}
        {(
        <div className="hidden sm:flex flex-wrap gap-2 mt-3">
          {SYNTAX_HINTS.map((tip) => (
            <button
              key={tip}
              onClick={() => {
                const transformed = applySearchSyntax(tip, query);
                setQuery(transformed);
                handleSubmit(transformed);
                inputRef.current?.focus();
              }}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[11px] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 font-mono transition-colors"
            >
              {tip}
            </button>
          ))}
        </div>
        )}
      </div>

      {/* Results area */}
      {hasQuery && (
        <>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                {hasResults ? (
                  <>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{visibleResults.length}</span>
                    <span>result{visibleResults.length !== 1 ? 's' : ''}</span>
                    {/* Word-level doc counts only make sense for term queries —
                        for phrases the full-text scan line below is the truth */}
                    {corpusCount !== null && !(isImplicitPhrase || committed.includes('"')) && (
                      <span className="text-gray-400 dark:text-gray-500">
                        · in <span className="text-gray-600 dark:text-gray-300">{corpusCount}</span>{' '}of {totalPosts} Katz texts
                      </span>
                    )}
                    {grepStatus === 'done' && grep && grep.totalPosts > 0 && (
                      <span className="text-gray-400 dark:text-gray-500">
                        · {grep.totalOccurrences - (grep.refOccurrences ?? 0)}× in {grep.totalPosts - (grep.refPosts ?? 0)} Katz text{grep.totalPosts - (grep.refPosts ?? 0) !== 1 ? 's' : ''}
                        {(grep.refOccurrences ?? 0) > 0 && (
                          includeArchives ? (
                            ` (+${grep.refOccurrences}× in Gans reference)`
                          ) : (
                            <>
                              {' '}(
                              <button
                                onClick={toggleArchives}
                                className="underline decoration-dotted underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                title="Include Chronicles & Anthropoetics in results"
                              >
                                +{grep.refOccurrences}× in Gans reference — include
                              </button>
                              )
                            </>
                          )
                        )}
                      </span>
                    )}
                    {expansions.length > 0 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        also matching {expansions.flatMap((e) => e.aliases).join(', ')}
                      </span>
                    )}
                    {/* Mode indicator: shows when query was auto-wrapped as phrase */}
                    {isImplicitPhrase && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 font-mono">
                        exact phrase
                      </span>
                    )}
                  </>
                ) : isSearching || grepStatus === 'loading' ? (
                  'Searching…'
                ) : deepMatches.length > 0 ? (
                  <>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{grep?.totalPosts ?? deepMatches.length}</span>
                    <span>
                      text{(grep?.totalPosts ?? 0) !== 1 ? 's' : ''} by full-text scan · {grep?.totalOccurrences}× corpus-wide
                    </span>
                  </>
                ) : (
                  // The dedicated no-results block below carries the message
                  ''
                )}
              </div>
              {hasResults && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <ShareResults query={committed} />
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value as typeof sort); setPage(0); }}
                    aria-label="Sort results"
                    className="text-base sm:text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 flex-shrink-0"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </div>
              )}
            </div>
            {visibleResults.length > 0 && (
              <FilterTabs active={filter} onChange={handleFilterChange} counts={counts} />
            )}
            {/* Source toggles — Reddit/X and Chronicles/AP are off by default */}
            <div className="mt-3">{sourceToggles}</div>
          </div>

          {/* Result list — the whole card is the tap target (mobile-friendly),
              with a pending state so a tap never looks like a frozen page. */}
          {hasResults && (
            <div className="space-y-3">
              {pageItems.map(({ entry, contextSnippet, occurrences }: SearchResult) => (
                <Link
                  key={entry.slug}
                  href={postUrl(entry.slug)}
                  prefetch={false}
                  className="group block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm active:bg-gray-50 dark:active:bg-gray-800/60 transition-all"
                >
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ${SOURCE_COLORS[entry.source]}`}>
                      {SOURCE_LABELS[entry.source]}
                    </span>
                    {entry.date && <span className="text-xs text-gray-400">{entry.date}</span>}
                    <span className="text-xs text-gray-400">{entry.readingTime} min read</span>
                    {(grepCounts.get(entry.slug) ?? occurrences) > 0 && (
                      <span className="text-xs text-gray-400">{grepCounts.get(entry.slug) ?? occurrences}×</span>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5 break-words">
                    {highlight(entry.title, committed)}
                  </p>
                  <p
                    className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed break-words mb-2.5"
                    style={{ fontFamily: 'var(--prose-font-family)' }}
                  >
                    {highlight(contextSnippet, committed)}
                  </p>
                  <div className="flex justify-end">
                    <ResultOpen />
                  </div>
                </Link>
              ))}
            </div>
          )}


          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                className="min-h-[44px] px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                ← Prev
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => {
                  if (i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1) {
                    return (
                      <button key={i} onClick={() => setPage(i)}
                        className={`w-10 h-10 text-sm rounded-xl transition-colors ${i === page ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                        {i + 1}
                      </button>
                    );
                  }
                  if ((i === 1 && page > 3) || (i === totalPages - 2 && page < totalPages - 4)) {
                    return <span key={i} className="px-1 text-gray-400">…</span>;
                  }
                  return null;
                })}
              </div>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                className="min-h-[44px] px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                Next →
              </button>
              <span className="w-full text-center text-xs text-gray-400">
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
            </div>
          )}

          {/* Deeper matches — the full-text scan found the phrase in texts the
              opening-only local index missed (long Chronicles, AP articles). */}
          {grepStatus === 'loading' && hasResults && (
            <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
              Scanning full texts…
            </p>
          )}
          {deepMatches.length > 0 && (
            <div className={hasResults ? 'mt-8' : 'mt-2'}>
              {deepKatz.length > 0 && (
                <>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                    {hasResults ? 'Deeper matches — full-text scan' : 'Found by full-text scan'}
                  </p>
                  <div className="space-y-3">
                    {deepKatz.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/post/${p.slug}?q=${encodeURIComponent(grepPhrase)}`}
                        prefetch={false}
                        className="group block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm active:bg-gray-50 dark:active:bg-gray-800/60 transition-all"
                      >
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ${SOURCE_COLORS[p.source as ContentSource] ?? 'bg-gray-100 text-gray-600'}`}>
                            {SOURCE_LABELS[p.source as ContentSource] ?? p.source}
                          </span>
                          {p.date && <span className="text-xs text-gray-400">{p.date}</span>}
                          <span className="text-xs text-gray-400">{p.count}×</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors mb-1">
                          {p.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                          {p.snippet}
                        </p>
                      </Link>
                    ))}
                  </div>
                </>
              )}
              {/* Gans reference tier — present when the archives toggle is on,
                  always below and labeled, never blended */}
              {deepRef.length > 0 && (
                <div className={deepKatz.length > 0 ? 'mt-6' : ''}>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                    Reference — Eric Gans (Chronicles · Anthropoetics)
                  </p>
                  <div className="space-y-3">
                    {deepRef.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/post/${p.slug}?q=${encodeURIComponent(grepPhrase)}`}
                        prefetch={false}
                        className="group block bg-gray-50/60 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                      >
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
                            {p.source === 'chronicle' ? 'Chronicle · Gans' : 'Anthropoetics · ref'}
                          </span>
                          {p.date && <span className="text-xs text-gray-400">{p.date}</span>}
                          <span className="text-xs text-gray-400">{p.count}×</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors mb-1">
                          {p.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                          {p.snippet}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No results — waits for the full-text scan so we never claim
              "no results" while deeper matches are about to appear. Renders
              BEFORE the meaning section so a zero-hit query is explained
              first — semantic passages without that context read as wrong
              keyword results. */}
          {!hasResults && !isSearching && visibleResults.length === 0 &&
           grepStatus !== 'loading' && deepMatches.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-base mb-2">No results for &ldquo;{committed}&rdquo;</p>
              {didYouMean && (
                <p className="text-sm mb-3">
                  Did you mean{' '}
                  <button
                    onClick={() => { setQuery(didYouMean); handleSubmit(didYouMean); }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {didYouMean}
                  </button>
                  ?
                </p>
              )}
              <p className="text-sm">
                {isImplicitPhrase
                  ? 'Searching as exact phrase. Try switching to "term AND term" for looser matching.'
                  : 'Try removing AND/NOT operators, or use fewer terms.'}
              </p>

              {/* Nearby vocabulary terms */}
              {suggestTerms(committed).length > 0 && (
                <div className="mt-6">
                  <p className="text-xs mb-2">Close vocabulary terms:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestTerms(committed).map((t) => (
                      <button
                        key={t}
                        onClick={() => { setQuery(t); handleSubmit(t); }}
                        className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Escape hatch: this vocabulary rewards questions over keywords */}
              <div className="mt-6">
                <Link
                  href={`/ask?q=${encodeURIComponent(committed.replace(/["\u201c\u201d]/g, ''))}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Ask AI about &ldquo;{(() => { const c = committed.replace(/["\u201c\u201d]/g, ''); return c.length > 40 ? c.slice(0, 40) + '…' : c; })()}&rdquo;
                </Link>
              </div>

              {/* Meaning rescue — only when the universal meaning section is
                  suppressed by operators: an exact search that found nothing
                  still deserves the closest real passages. Gating on
                  userOperators (not the semanticQ settle timer) means exactly
                  ONE SemanticResults ever mounts per query — no double fetch,
                  no heading flip mid-load. */}
              {userOperators && (
                <div className="mt-10 text-left">
                  <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 text-center">
                    Closest passages by meaning
                  </p>
                  <SemanticResults query={grepPhrase || committed} sources={allowedSources} noClientFallback />
                </div>
              )}
              {recentSearches.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs mb-2">Recent searches:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {recentSearches.map((s) => (
                      <button key={s} onClick={() => { setQuery(s); handleSubmit(s); }}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Passages by meaning — the second half of the one search: streams
              in ~1s after the query settles; operators suppress it. Sits after
              the no-results explanation so rescue passages never masquerade
              as keyword matches. */}
          {semanticQ && (
            <div className={hasResults || deepMatches.length > 0 ? 'mt-10' : 'mt-6'}>
              <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                {hasResults || deepMatches.length > 0 ? 'Passages by meaning' : 'Closest passages by meaning'}
              </p>
              <SemanticResults query={semanticQ} sources={allowedSources} noClientFallback />
            </div>
          )}
        </>
      )}

      {/* Empty state — keyword mode */}
      {!hasQuery && (
        <div className="text-center py-8 text-gray-400">
          <div className="flex justify-center mb-6">
            <SceneMark size={88} spin speed={1} className="text-gray-300 dark:text-gray-600" />
          </div>
          <p className="text-sm mb-1 text-gray-500 dark:text-gray-400">
            Search across {totalPosts} Katz texts
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mb-6">
            Substack · GABlog · Books · Essays &amp; Articles
          </p>
          {recentSearches.length > 0 && (
            <div>
              <p className="text-xs mb-3 text-gray-400">Recent searches</p>
              <div className="flex flex-wrap justify-center gap-2">
                {recentSearches.map((s) => (
                  <button key={s} onClick={() => { setQuery(s); handleSubmit(s); }}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {popularSearches.length > 0 && (
            <div className={recentSearches.length > 0 ? 'mt-5' : ''}>
              <p className="text-xs mb-3 text-gray-400">What readers search</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularSearches.map((s) => (
                  <button key={s} onClick={() => { setQuery(s); handleSubmit(s); }}
                    className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-xs text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
