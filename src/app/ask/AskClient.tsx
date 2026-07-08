'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CS_TERMS_SORTED, extractFollowUps } from '@/lib/cs-terms';
import { logSearch } from '@/lib/log-search';
import AnimatedSearchIcon from '@/components/AnimatedSearchIcon';

interface Source {
  slug: string;
  title: string;
  source: string;
  snippet?: string;
}

interface Passage {
  quote: string;
  title: string;
  slug: string;
  source: string;
  href: string;        // deep link to the post at the quoted passage
  verified?: boolean;  // confirmed verbatim against the corpus
}

interface Answer {
  content: string;
  sources?: Source[];
  followUps?: string[];
  passages?: Passage[];
}

const SOURCE_COLORS: Record<string, string> = {
  substack:  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  gablog:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  book:      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  pdf:       'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  reddit:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  twitter:   'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300',
  lecture:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  ap:        'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
};

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Substack', gablog: 'GABlog', book: 'Book', pdf: 'PDF', reddit: 'Reddit',
  twitter: 'X / Twitter', lecture: 'Lecture', ap: 'AP Journal',
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
          title={`Ask AI about "${part}"`}
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

function sourceFromSlug(slug: string): string {
  const prefix = slug.split('-')[0];
  return SOURCE_LABELS[prefix] ?? prefix;
}

// Split the synthesized prose from the trailing "## Excerpts" block.
function splitAnswer(content: string): { prose: string; excerpts: string } {
  const m = content.match(/\n+(?:---\s*\n+)?##\s+Excerpts\s*\n/i);
  if (!m || m.index === undefined) return { prose: content, excerpts: '' };
  return { prose: content.slice(0, m.index).trim(), excerpts: content.slice(m.index + m[0].length) };
}

// Parse the Excerpts block into structured passages:
//   > "verbatim quote"
//   **Title** · Source
//   [Read →](/post/slug?q=first+four+words)
function parsePassages(content: string): Passage[] {
  const { excerpts } = splitAnswer(content);
  if (!excerpts) return [];
  const out: Passage[] = [];
  let quote = '';
  let title = '';
  const flush = (href: string) => {
    const q = quote.trim().replace(/^["“”']+|["“”']+$/g, '').trim();
    if (q.length >= 20) {
      const slug = href.match(/\/post\/([^?#)]+)/)?.[1] ?? '';
      out.push({ quote: q, title: title.trim() || slug, slug, source: sourceFromSlug(slug), href });
    }
    quote = '';
    title = '';
  };
  for (const raw of excerpts.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('>')) { quote += ' ' + line.replace(/^>\s?/, ''); continue; }
    const titleM = line.match(/\*\*\[?([^*\]]+?)\]?\*\*/);
    if (titleM && !line.includes('](')) { title = titleM[1].trim(); continue; }
    const hrefM = line.match(/\]\((\/post\/[^)\s]+)\)/);
    if (hrefM) flush(hrefM[1]);
  }
  return out.slice(0, 12);
}

async function verifyPassages(passages: Passage[], signal?: AbortSignal): Promise<boolean[] | undefined> {
  if (passages.length === 0) return undefined;
  try {
    const res = await fetch('/api/verify-quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quotes: passages.map((p) => p.quote) }),
      signal,
    });
    if (!res.ok) return undefined;
    const data = await res.json();
    return Array.isArray(data.verified) ? data.verified : undefined;
  } catch {
    return undefined;
  }
}

export default function AskClient() {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState<Answer | null>(null);
  // Start at 0 on both server and client to avoid a hydration mismatch, then
  // hydrate the real lifetime count from localStorage after mount.
  const [askCount, setAskCount] = useState<number>(0);
  useEffect(() => {
    try { setAskCount(parseInt(localStorage.getItem(ASK_COUNT_KEY) || '0', 10)); } catch {}
  }, []);
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
  // Tracks the last question auto-submitted from the URL ?q= param. We compare
  // against it (rather than a one-time boolean) so a *new* ?q= — e.g. a second
  // search from the home box or a clicked term — actually re-runs instead of
  // leaving the previous answer on screen.
  const lastAutoQ = useRef<string | null>(null);
  // Streaming lifecycle: abort the in-flight request and silence late state
  // updates when the user navigates away (clicks a source link, goes back)
  // mid-stream — otherwise the aborted fetch surfaced as a red "Error".
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  // Questions we've already auto-retried once after a network drop, so a genuinely
  // failing request can't loop.
  const retriedRef = useRef<Set<string>>(new Set());
  // ── Conversation memory ──────────────────────────────────────────────────
  // The running thread for this session: history sent to the model (so follow-ups
  // build on prior answers), each completed answer cached by question for instant
  // revisiting, and the ordered list of questions shown as a thread strip.
  const historyRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const sessionAnswersRef = useRef<Map<string, Answer>>(new Map());
  const [sessionQs, setSessionQs] = useState<string[]>([]);
  useEffect(() => {
    // Set true on every (re)mount — not just initial — so a StrictMode or HMR
    // remount doesn't leave it stuck false and silently drop answer completions.
    mountedRef.current = true;
    return () => { mountedRef.current = false; abortRef.current?.abort(); };
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    const concept = searchParams.get('concept');
    if (concept) setConceptSeed(concept);
    if (q && q !== lastAutoQ.current) {
      lastAutoQ.current = q;
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
    if (!q.trim()) return;
    const question = q.trim();
    logSearch(question, 'ask');
    setInput('');
    setCurrentQuestion(question);

    // Snap to top for fresh session view
    if (mainRef.current) mainRef.current.scrollTop = 0;

    // A new question always supersedes whatever is in flight — abort it first
    // so a still-streaming previous answer can't keep updating the screen.
    abortRef.current?.abort();

    // History sent to the model so a follow-up builds on the conversation.
    const sentHistory = historyRef.current.slice(-6);

    // Already answered this exact question in this session → show it instantly.
    const sessionHit = sessionAnswersRef.current.get(question);
    if (sessionHit) {
      abortRef.current = null;
      setAnswer(sessionHit);
      setIsLoading(false);
      return;
    }
    // Cache hit — only for standalone questions. Follow-ups depend on the
    // conversation, so they must not collide with the question-keyed cache.
    if (sentHistory.length === 0) {
      const cached = getCached(question);
      if (cached) {
        abortRef.current = null;
        setAnswer(cached);
        sessionAnswersRef.current.set(question, cached);
        setSessionQs((p) => (p.includes(question) ? p : [...p, question]));
        historyRef.current.push({ role: 'user', content: question }, { role: 'assistant', content: splitAnswer(cached.content).prose });
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);
    setAnswer({ content: '' });

    // Fresh controller for this request
    const ac = new AbortController();
    abortRef.current = ac;

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
          history: sentHistory,
          ...(concept ? { concept } : {}),
        }),
        signal: ac.signal,
      });

      if (!res.ok) {
        let msg = 'Failed';
        try { msg = (await res.json()).error || msg; } catch { /* non-JSON error body */ }
        throw new Error(msg);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');
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
            // Ignore chunks from a request that's been superseded by a newer one
            if (abortRef.current !== ac) continue;
            if (data.text) {
              content += data.text;
              // Parse passages as the Excerpts block streams in so the quotes
              // appear progressively, not only once the whole answer finishes.
              setAnswer({ content, sources, passages: parsePassages(content) });
            }
            if (data.sources) {
              sources = data.sources;
              setAnswer({ content, sources, passages: parsePassages(content) });
            }
          } catch { /* skip malformed lines */ }
        }
      }

      if (!mountedRef.current || abortRef.current !== ac) return;
      const followUps = extractFollowUps(content, question);
      const passages = parsePassages(content);
      const finalAnswer: Answer = { content, sources, followUps, passages };
      setAnswer(finalAnswer);
      // Record the turn: cache standalone answers, remember every answer for the
      // session thread, and append to the model-visible history (prose only, to
      // keep follow-up context lean).
      if (sentHistory.length === 0) setCache(question, finalAnswer);
      sessionAnswersRef.current.set(question, finalAnswer);
      setSessionQs((p) => (p.includes(question) ? p : [...p, question]));
      historyRef.current.push({ role: 'user', content: question }, { role: 'assistant', content: splitAnswer(content).prose });

      // Verify each passage verbatim against the corpus (one cheap request,
      // after streaming — never blocks the answer, aborts on navigation)
      if (passages.length > 0) {
        verifyPassages(passages, ac.signal).then((verified) => {
          if (!verified || !mountedRef.current) return;
          const withVerify: Answer = {
            ...finalAnswer,
            passages: passages.map((p, i) => ({ ...p, verified: verified[i] })),
          };
          setAnswer((prev) => (prev && prev.content === content ? withVerify : prev));
          if (sentHistory.length === 0) setCache(question, withVerify);
          sessionAnswersRef.current.set(question, withVerify);
        });
      }
    } catch (err) {
      // User navigated away / started a new question — not a real error
      if (ac.signal.aborted || (err instanceof Error && err.name === 'AbortError')) return;
      // A bare fetch TypeError means the connection dropped mid-stream — most
      // commonly because a mobile tab was backgrounded and the OS killed the
      // request. Transparently retry once when we're current, instead of
      // stranding the user on a red error that forces a manual re-search.
      const isNetworkDrop = err instanceof TypeError;
      if (isNetworkDrop && abortRef.current === ac && !retriedRef.current.has(question)) {
        retriedRef.current.add(question);
        if (mountedRef.current) submit(question, concept);
        return;
      }
      if (mountedRef.current && abortRef.current === ac) {
        setAnswer({ content: `Error: ${err instanceof Error ? err.message : 'Something went wrong'}` });
      }
    } finally {
      // Only the request that's still current may clear the loading state —
      // a superseded request must not turn off the spinner for the new one.
      if (mountedRef.current && abortRef.current === ac) setIsLoading(false);
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

  // "Top posts" excludes posts already shown as Passages above — no duplication.
  const passageSlugs = new Set((answer?.passages ?? []).map((p) => p.slug));
  const topPosts = (answer?.sources ?? []).filter((s) => !passageSlugs.has(s.slug)).slice(0, 6);

  return (
    <div className="h-screen bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between max-w-4xl mx-auto w-full flex-shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => router.back()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="sr-only">Ask AI</h1>
          {/* Mode switcher — the three search modes are reversible into one
              another; the current question carries over to keyword/meaning. */}
          {(() => {
            const carried = (input.trim() || currentQuestion).trim();
            const qs = carried ? `?q=${encodeURIComponent(carried)}` : '';
            const seg = 'px-2.5 sm:px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap';
            return (
              <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <Link href={`/search${qs}`} className={`${seg} text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300`}>
                  Keyword
                </Link>
                <Link
                  href={carried ? `/search?mode=meaning&q=${encodeURIComponent(carried)}` : '/search?mode=meaning'}
                  title="Find passages by meaning, even when they use different words"
                  className={`${seg} text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300`}
                >
                  ◐ Meaning
                </Link>
                <span className={`${seg} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm`}>
                  ✦ Ask AI
                </span>
              </div>
            );
          })()}
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
          {/* New question — clears the conversation thread */}
          {currentQuestion && (
            <button
              onClick={() => {
                abortRef.current?.abort();
                historyRef.current = [];
                sessionAnswersRef.current.clear();
                setSessionQs([]);
                setCurrentQuestion('');
                setAnswer(null);
              }}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              New
            </button>
          )}
        </div>
      </header>

      {/* Main scroll area */}
      <main ref={mainRef} className="flex-1 overflow-y-auto" style={{ overflowAnchor: 'none' }}>
        {/* Screen-reader status for the async answer (WCAG 4.1.3) */}
        <div className="sr-only" aria-live="polite" role="status">
          {isLoading ? 'Searching the archive…' : answer ? 'Answer ready.' : ''}
        </div>
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
              {/* Conversation thread — prior questions in this session. Click to
                  revisit an answer instantly; new questions build on this context. */}
              {sessionQs.length > 1 && (
                <div className="mb-5 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mr-1">Thread</span>
                  {sessionQs.map((q, qi) => (
                    <button
                      key={qi}
                      onClick={() => { setCurrentQuestion(q); const a = sessionAnswersRef.current.get(q); if (a) { setAnswer(a); if (mainRef.current) mainRef.current.scrollTop = 0; } else { submit(q); } }}
                      title={q}
                      className={`max-w-[14rem] truncate text-[11px] px-2 py-1 rounded-full border transition-colors ${
                        q === currentQuestion
                          ? 'border-gray-400 dark:border-gray-500 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800'
                          : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      {qi + 1}. {q}
                    </button>
                  ))}
                </div>
              )}
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

              {/* AI answer — synthesized from texts */}
              <div className="mb-8">
                <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                  Synthesis
                </p>
                {answer?.content ? (
                  <div>
                    {renderMarkdown(splitAnswer(answer.content).prose, fontSize, handleTermClick)}
                  </div>
                ) : (
                  /* Animated circles while streaming */
                  <div className="flex flex-col items-center py-8 gap-3">
                    <AnimatedSearchIcon size={64} speed={4} />
                    <p className="text-xs text-gray-400 dark:text-gray-600 font-mono tracking-wide">
                      reading the texts…
                    </p>
                  </div>
                )}
              </div>

              {/* Passages from the archive — the verbatim quotes, below the synthesis */}
              {answer?.passages && answer.passages.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                    Passages from the archive
                  </p>
                  <div className="space-y-3">
                    {answer.passages.map((p, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
                      >
                        <blockquote
                          className="text-gray-800 dark:text-gray-200 italic leading-relaxed mb-3"
                          style={{ fontFamily: 'var(--font-lora, Georgia, serif)' }}
                        >
                          &ldquo;{p.quote}&rdquo;
                        </blockquote>
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <Link href={p.href} className="group inline-flex items-center gap-2 min-w-0">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${SOURCE_COLORS[p.slug.split('-')[0]] || 'bg-gray-100 text-gray-600'}`}>
                              {p.source}
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                              {p.title}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-500 flex-shrink-0">Read in context →</span>
                          </Link>
                          {p.verified === true && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 flex-shrink-0" title="Confirmed word-for-word against the archive">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" /></svg>
                              verbatim
                            </span>
                          )}
                          {p.verified === false && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 dark:text-gray-400 flex-shrink-0" title="Couldn’t be matched word-for-word against the archive — open the source to verify">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                              unconfirmed
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top posts — source cards, excluding any already shown as passages */}
              {(!answer?.sources || topPosts.length > 0) && (
              <div className="mb-8">
                <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                  {answer?.passages && answer.passages.length > 0 ? 'More sources' : 'Top posts'}
                </p>
                {answer?.sources && answer.sources.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {topPosts.map((src, j) => (
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
              )}

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
                  {/* Hand off to the reading-path builder with this question */}
                  <Link
                    href={`/guide/reading-paths?q=${encodeURIComponent(currentQuestion)}`}
                    className="mt-3 inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Get a reading path on this topic →
                  </Link>
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
            className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 overflow-hidden"
          />
          <button
            onClick={() => submit(input)}
            disabled={!input.trim()}
            className="flex-shrink-0 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium disabled:opacity-40 hover:opacity-80 transition-opacity"
          >
            {isLoading && !input.trim() ? (
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
