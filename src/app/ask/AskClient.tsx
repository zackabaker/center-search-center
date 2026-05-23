'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CS_TERMS_SORTED, extractFollowUps } from '@/lib/cs-terms';
import AnimatedSearchIcon from '@/components/AnimatedSearchIcon';

interface Source {
  slug: string;
  title: string;
  source: string;
  snippet?: string;
}

interface Answer {
  content: string;
  sources?: Source[];
  followUps?: string[];
}

const SOURCE_COLORS: Record<string, string> = {
  substack: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  gablog:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  book:     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  pdf:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  reddit:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  twitter:  'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300',
  lecture:  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Substack', gablog: 'GABlog', book: 'Book', pdf: 'PDF', reddit: 'Reddit',
  twitter: 'X / Twitter', lecture: 'Lecture',
};

const SUGGESTED = [
  'What is the originary scene and how does it found language?',
  'How does Katz develop the concept of the juridical?',
  'What is the relationship between resentment and the sacred in Center Study?',
  'How does scenic design relate to the center?',
  'What does succession mean in Center Study?',
  'How does attentionality function as an ethical concept in Center Study?',
];

type FontSize = 'sm' | 'md' | 'lg';

const FONT_SIZES: Record<FontSize, { prose: string; quote: string; list: string; h2: string; h3: string }> = {
  sm: { prose: 'text-sm leading-relaxed',   quote: 'text-sm',   list: 'text-sm',   h2: 'text-base', h3: 'text-sm'  },
  md: { prose: 'text-base leading-relaxed', quote: 'text-base', list: 'text-base', h2: 'text-lg',   h3: 'text-base' },
  lg: { prose: 'text-lg leading-loose',     quote: 'text-lg',   list: 'text-lg',   h2: 'text-xl',   h3: 'text-lg'  },
};

// Build a single regex that matches all CS terms, longest first
const termPattern = CS_TERMS_SORTED.map(t =>
  t.term.replace(/[-/[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
).join('|');
const TERM_REGEX = new RegExp(`\\b(${termPattern})\\b`, 'gi');

function linkTerms(
  text: string,
  onTerm: (query: string, display: string) => void,
  key: number
): React.ReactNode {
  const parts = text.split(TERM_REGEX);
  return parts.map((part, i) => {
    const lower = part.toLowerCase();
    const match = CS_TERMS_SORTED.find(t => t.term.toLowerCase() === lower);
    if (match) {
      return (
        <button
          key={`${key}-${i}`}
          onClick={() => onTerm(match.query, part)}
          title={`Ask the archive about "${part}"`}
          style={{ touchAction: 'manipulation' }}
          className="text-blue-700 dark:text-blue-400 underline decoration-dotted underline-offset-2 hover:decoration-solid hover:text-blue-800 dark:hover:text-blue-300 active:text-blue-900 dark:active:text-blue-200 active:bg-blue-50 dark:active:bg-blue-900/30 rounded px-0.5 -mx-0.5 py-0.5 -my-0.5 transition-colors cursor-pointer"
        >
          {part}
        </button>
      );
    }
    return part;
  });
}

function inlineMarkdown(
  text: string,
  onTerm: (query: string, display: string) => void,
  key: number
): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\[[^\]]+\])/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="font-semibold text-gray-900 dark:text-white">{linkTerms(part.slice(2, -2), onTerm, key * 1000 + i)}</strong>;
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i}>{linkTerms(part.slice(1, -1), onTerm, key * 1000 + i)}</em>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="font-mono text-[0.85em] bg-gray-100 dark:bg-gray-700 px-1 rounded">{part.slice(1, -1)}</code>;
    if (/^\[[^\]]+\]\([^)]+\)$/.test(part)) {
      const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m) return (
        <Link key={i} href={m[2]}
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
          {m[1]}
        </Link>
      );
    }
    if (part.startsWith('[') && part.endsWith(']'))
      return <span key={i} className="text-blue-600 dark:text-blue-400 font-medium">{part}</span>;
    return <span key={i}>{linkTerms(part, onTerm, key * 1000 + i)}</span>;
  });
}

function renderMarkdown(
  text: string,
  fs: FontSize,
  onTerm: (query: string, display: string) => void
): React.ReactNode[] {
  const sz = FONT_SIZES[fs];
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className={`${sz.h2} font-bold mt-6 mb-2 text-gray-900 dark:text-white`}>
          {inlineMarkdown(line.slice(3), onTerm, key)}
        </h2>
      );
      i++; continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className={`${sz.h3} font-semibold mt-4 mb-1 text-gray-800 dark:text-gray-200`}>
          {inlineMarkdown(line.slice(4), onTerm, key)}
        </h3>
      );
      i++; continue;
    }
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote key={key++} className={`border-l-2 border-amber-400 pl-4 my-4 text-gray-700 dark:text-gray-300 italic ${sz.quote}`}>
          {quoteLines.map((ql, qi) => (
            <span key={qi}>{inlineMarkdown(ql, onTerm, key * 100 + qi)}{qi < quoteLines.length - 1 && <br />}</span>
          ))}
        </blockquote>
      );
      continue;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className={`list-disc list-outside pl-5 my-3 space-y-1.5 ${sz.list}`}>
          {items.map((item, ii) => (
            <li key={ii} className="text-gray-700 dark:text-gray-300">
              {inlineMarkdown(item, onTerm, key * 100 + ii)}
            </li>
          ))}
        </ul>
      );
      continue;
    }
    if (line.match(/^---+$/)) {
      elements.push(<hr key={key++} className="border-gray-200 dark:border-gray-700 my-5" />);
      i++; continue;
    }
    if (line.trim() === '') { i++; continue; }
    elements.push(
      <p key={key++} className={`${sz.prose} text-gray-800 dark:text-gray-200 mb-3`}>
        {inlineMarkdown(line, onTerm, key)}
      </p>
    );
    i++;
  }

  return elements;
}

const ASK_COUNT_KEY = 'csc-ask-count';
const NAMES_THRESHOLD = 5;
const NAMES_REGEX = /\b(name|names|naming|book of names|proper name|proper names)\b/i;

// ── Response cache ─────────────────────────────────────────────────────────────
const CACHE_KEY = 'csc-ask-cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry { question: string; answer: Answer; ts: number; }

function getCached(question: string): Answer | null {
  try {
    const entries: CacheEntry[] = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
    const hit = entries.find(e => e.question === question && Date.now() - e.ts < CACHE_TTL);
    return hit?.answer ?? null;
  } catch { return null; }
}

function setCache(question: string, answer: Answer) {
  try {
    const entries: CacheEntry[] = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
    const filtered = entries.filter(e => e.question !== question && Date.now() - e.ts < CACHE_TTL).slice(0, 49);
    filtered.unshift({ question, answer, ts: Date.now() });
    localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
  } catch { /* ignore storage errors */ }
}

export default function AskClient() {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [askCount, setAskCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try { return parseInt(localStorage.getItem(ASK_COUNT_KEY) || '0', 10); } catch { return 0; }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [linkCopied, setLinkCopied] = useState(false);
  // Concept seed: set when arriving from a concept page
  const [conceptSeed, setConceptSeed] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const didAutoSubmit = useRef(false);

  useEffect(() => {
    const q = searchParams.get('q');
    const concept = searchParams.get('concept');
    if (concept) setConceptSeed(concept);
    if (q && !didAutoSubmit.current) {
      didAutoSubmit.current = true;
      submit(q, concept ?? undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  // When a CS term is clicked in a response, submit directly
  function handleTermClick(query: string) {
    submit(query, conceptSeed ?? undefined);
  }

  async function submit(q: string, concept?: string) {
    if (!q.trim() || isLoading) return;
    const question = q.trim();
    setInput('');
    setCurrentQuestion(question);

    // Snap to top for fresh session view
    if (mainRef.current) mainRef.current.scrollTop = 0;

    // Cache hit — serve instantly without hitting the API
    const cached = getCached(question);
    if (cached) {
      setAnswer(cached);
      return;
    }

    setIsLoading(true);
    setAnswer({ content: '' });

    // Increment lifetime ask counter
    try {
      const next = askCount + 1;
      localStorage.setItem(ASK_COUNT_KEY, String(next));
      setAskCount(next);
    } catch {}

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          history: [],
          ...(concept ? { concept } : {}),
        }),
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Failed');

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let content = '';
      let sources: Source[] | undefined;
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.text) {
              content += data.text;
              setAnswer({ content, sources });
            }
            if (data.sources) {
              sources = data.sources;
              setAnswer({ content, sources });
            }
          } catch { /* skip malformed lines */ }
        }
      }

      const followUps = extractFollowUps(content, question);
      const finalAnswer = { content, sources, followUps };
      setAnswer(finalAnswer);
      // Cache the completed answer for instant replay
      setCache(question, finalAnswer);
    } catch (err) {
      setAnswer({
        content: `Error: ${err instanceof Error ? err.message : 'Something went wrong'}`,
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(input); }
  }

  function downloadAnswer() {
    if (!answer?.content || !currentQuestion) return;
    const filename = currentQuestion.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60) + '.md';
    const srcs = answer.sources?.map(s => `- [[${s.title}]] (${SOURCE_LABELS[s.source] || s.source})`).join('\n') || '';
    const md = `# ${currentQuestion}\n\n${answer.content}${srcs ? `\n\n## Sources\n\n${srcs}` : ''}\n`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  const showNamesHint = askCount >= NAMES_THRESHOLD || NAMES_REGEX.test(currentQuestion);

  return (
    <div className="h-screen bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between max-w-4xl mx-auto w-full flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-sm font-semibold text-gray-900 dark:text-white">Ask AI</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Font size */}
          <div className="flex items-center gap-0.5 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {(['sm', 'md', 'lg'] as FontSize[]).map(s => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className={`px-2 py-1 text-xs font-medium transition-colors ${
                  fontSize === s
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className={s === 'sm' ? 'text-xs' : s === 'md' ? 'text-sm' : 'text-base'}>A</span>
              </button>
            ))}
          </div>
          {/* Download */}
          {answer?.content && !isLoading && (
            <button
              onClick={downloadAnswer}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Download as .md"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Save .md
            </button>
          )}
          {/* Share */}
          {currentQuestion && (
            <button
              onClick={async () => {
                const url = `${window.location.origin}/ask?q=${encodeURIComponent(currentQuestion)}`;
                await navigator.clipboard.writeText(url);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
              }}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Copy sharable link"
            >
              {linkCopied ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              )}
              {linkCopied ? 'Copied!' : 'Share'}
            </button>
          )}
          {/* New question */}
          {currentQuestion && (
            <button
              onClick={() => { setCurrentQuestion(''); setAnswer(null); }}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              New
            </button>
          )}
        </div>
      </header>

      {/* Main scroll area */}
      <main ref={mainRef} className="flex-1 overflow-y-auto" style={{ overflowAnchor: 'none' }}>
        <div className="max-w-3xl mx-auto px-4 py-8">

          {!currentQuestion ? (
            /* ── Landing / empty state ── */
            <div className="py-12 text-center">
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Center Study Center</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Ask AI</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
                Describe what you&apos;re looking for and the AI will surface the best direct quotes from the archive — passages you wouldn&apos;t find with keyword search.
              </p>
              <div className="grid sm:grid-cols-2 gap-2 max-w-2xl mx-auto text-left">
                {SUGGESTED.map(q => (
                  <button
                    key={q}
                    onClick={() => submit(q)}
                    className="text-left text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-6">
                Answers download as <code className="font-mono">.md</code> — file into Obsidian to build your own wiki.
              </p>
              {showNamesHint && (
                <div className="mt-6">
                  <Link
                    href="/names"
                    className="text-xs text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500 transition-colors"
                  >
                    there is a book of names
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* ── Question + Answer view ── */
            <div>
              {/* Prominent question heading */}
              {conceptSeed && (
                <div className="mb-3">
                  <Link
                    href={`/guide/concepts/${conceptSeed}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:border-purple-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Concept context: {conceptSeed.replace(/-/g, ' ')}
                  </Link>
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 leading-snug">
                {currentQuestion}
              </h2>

              {/* From the archive — AI content (quotes first, posts below) */}
              <div className="mb-8">
                <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                  From the archive
                </p>
                {answer?.content ? (
                  <div>
                    {renderMarkdown(answer.content, fontSize, handleTermClick)}
                  </div>
                ) : (
                  /* Animated circles while streaming */
                  <div className="flex flex-col items-center py-8 gap-3">
                    <AnimatedSearchIcon size={64} speed={4} />
                    <p className="text-xs text-gray-400 dark:text-gray-600 font-mono tracking-wide">
                      searching the archive…
                    </p>
                  </div>
                )}
              </div>

              {/* Top posts — source cards below the quotes */}
              <div className="mb-8">
                <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                  Top posts
                </p>
                {answer?.sources && answer.sources.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {answer.sources.slice(0, 6).map((src, j) => (
                      <Link
                        key={j}
                        href={`/post/${src.slug}`}
                        className="group block rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${SOURCE_COLORS[src.source] || 'bg-gray-100 text-gray-600'}`}>
                                {SOURCE_LABELS[src.source] || src.source}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-1">
                              {src.title}
                            </p>
                            {src.snippet && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                                {src.snippet}
                              </p>
                            )}
                          </div>
                          <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  /* Skeleton while sources load */
                  <div className="flex flex-col gap-2 animate-pulse">
                    {[1, 2, 3].map(k => (
                      <div key={k} className="rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3">
                        <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-16 mb-2"/>
                        <div className="h-3.5 bg-gray-100 dark:bg-gray-800 rounded w-3/4 mb-1.5"/>
                        <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-full"/>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Follow-up questions */}
              {answer?.followUps && answer.followUps.length > 0 && !isLoading && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mb-6">
                  <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2.5">Go deeper</p>
                  <div className="flex flex-col gap-1.5">
                    {answer.followUps.map((q, j) => (
                      <button
                        key={j}
                        onClick={() => submit(q)}
                        className="text-left text-sm px-3 py-2.5 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-start gap-2 group"
                      >
                        <svg className="w-3 h-3 mt-1 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Book of names hint */}
              {showNamesHint && !isLoading && (
                <div className="py-4 text-center">
                  <Link
                    href="/names"
                    className="text-xs text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500 transition-colors"
                  >
                    there is a book of names
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Input footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything… (Enter to send, Shift+Enter for newline)"
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 overflow-hidden"
          />
          <button
            onClick={() => submit(input)}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium disabled:opacity-40 hover:opacity-80 transition-opacity"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
