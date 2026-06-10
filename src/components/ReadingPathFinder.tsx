'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RecommendedPost {
  slug: string;
  source: string;
  title: string;
  note: string;
}

// Infer canonical source name from slug prefix as a fallback
function slugToSource(slug: string): string {
  if (slug.startsWith('gablog'))   return 'GABlog';
  if (slug.startsWith('substack')) return 'Substack';
  if (slug.startsWith('pdf'))      return 'PDF';
  if (slug.startsWith('book'))     return 'Book';
  return '';
}

function parseReadingPath(content: string): { title: string; intro: string; posts: RecommendedPost[]; coda: string } | null {
  // End marker is OPTIONAL — allows parsing during streaming before the marker appears,
  // and handles cases where token limits cut off the closing marker.
  const match = content.match(/---READING PATH START---([\s\S]*?)(?:---READING PATH END---|$)/);
  if (!match) return null;

  const body = match[1].trim();
  const lines = body.split('\n');

  let title = '';
  let intro = '';
  const posts: RecommendedPost[] = [];
  let coda = '';
  let inPosts = false;
  let afterPath = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Title line: **[TITLE]** — for ...
    if (line.startsWith('**') && !inPosts && !afterPath) {
      title = line.replace(/\*\*/g, '');
      continue;
    }

    // Numbered post line: 1. slug | Source | Title
    // Also handles brackets: 1. [slug] | Source | Title
    const postMatch = line.match(/^\d+\.\s+\[?([^\]\s|]+)\]?\s*\|\s*([^|]+)\s*\|\s*(.+)$/);
    if (postMatch) {
      inPosts = true;
      const slug      = postMatch[1].trim();
      const rawSource = postMatch[2].trim();
      // Derive source from slug prefix if the AI used a non-standard label
      const source    = rawSource || slugToSource(slug);
      const postTitle = postMatch[3].trim().replace(/\*\*/g, ''); // strip stray bold markers
      // Look ahead for italic note line
      let note = '';
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (nextLine.startsWith('*') && nextLine.endsWith('*')) {
          note = nextLine.replace(/^\*+|\*+$/g, '').trim();
          i++;
        }
      }
      posts.push({ slug, source, title: postTitle, note });
      continue;
    }

    // Coda line: **After this path:** ...
    if (line.startsWith('**After this path:**') || line.startsWith('After this path:')) {
      coda = line.replace(/\*\*/g, '').replace('After this path:', '').trim();
      afterPath = true;
      continue;
    }

    // Intro paragraph — everything between title and first numbered item
    if (!inPosts && !afterPath) {
      intro += (intro ? ' ' : '') + line;
    }
  }

  return { title, intro, posts, coda };
}

// Map all reasonable source labels the AI might produce to a Tailwind color set.
// Keys cover the exact labels plus common variants.
const SOURCE_COLORS: Record<string, string> = {
  Substack:            'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  'Bouvard Substack':  'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  GABlog:              'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  GAblog:              'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  PDF:                 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  PDFs:                'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  Essays:              'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  'Essays & Articles': 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  Book:                'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  Anthropomorphics:    'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
};

function getSourceColor(source: string, slug: string): string {
  return (
    SOURCE_COLORS[source] ||
    SOURCE_COLORS[slugToSource(slug)] ||
    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  );
}

function ReadingPathDisplay({ content }: { content: string }) {
  const path = parseReadingPath(content);
  const hasStartMarker = content.includes('---READING PATH START---');

  if (!path || path.posts.length === 0) {
    if (hasStartMarker) {
      // Path is being built — title/intro may already be parsed even with no posts yet
      return (
        <div className="space-y-3">
          {path?.title && (
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{path.title}</h2>
              {path.intro && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{path.intro}</p>
              )}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
            Building your reading path…
          </div>
        </div>
      );
    }
    // No start marker — plain assistant message, render as text
    return (
      <div className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm">
        {content}
      </div>
    );
  }

  const firstPost = path.posts[0];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{path.title}</h2>
        {path.intro && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{path.intro}</p>
        )}
      </div>

      <div className="space-y-2 mb-5">
        {path.posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/post/${post.slug}`}
            className="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-white dark:hover:bg-gray-800 transition-all group block"
          >
            <div className="w-6 h-6 rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getSourceColor(post.source, post.slug)}`}>
                  {post.source || slugToSource(post.slug)}
                </span>
              </div>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:underline leading-snug">
                {post.title}
              </p>
              {post.note && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed italic">{post.note}</p>
              )}
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 flex-shrink-0 self-center transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {path.coda && (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-4">{path.coda}</p>
      )}

      {firstPost && (
        <Link
          href={`/post/${firstPost.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
        >
          Start reading
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
        Your path is saved — each text will show the next step, and you can return
        here anytime to see your progress.
      </p>
    </div>
  );
}

interface SavedPath {
  title: string;
  intro: string;
  coda: string;
  posts: RecommendedPost[];
  createdAt: string;
}

export const AI_PATH_KEY = 'csc-ai-path';

export default function ReadingPathFinder() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [streaming, setStreaming]     = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [savedPath, setSavedPath] = useState<SavedPath | null>(null);
  const [readSlugs, setReadSlugs] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  // Restore a previously generated path + read progress. If the page was
  // opened with ?q= (e.g. handed off from Ask AI), start the conversation
  // with that question immediately — unless a saved path already exists.
  const autoStarted = useRef(false);
  useEffect(() => {
    let hasSaved = false;
    try {
      const raw = localStorage.getItem(AI_PATH_KEY);
      if (raw) {
        const p = JSON.parse(raw) as SavedPath;
        if (p?.posts?.length) { setSavedPath(p); hasSaved = true; }
      }
      setReadSlugs(new Set(JSON.parse(localStorage.getItem('csc-read-posts') || '[]')));
    } catch {}

    if (!autoStarted.current && !hasSaved) {
      const q = new URLSearchParams(window.location.search).get('q');
      if (q && q.trim()) {
        autoStarted.current = true;
        send(`I want a reading path about: ${q.trim()}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom when a completed message is added (not during streaming)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setStreaming(true);
    setStreamContent('');

    try {
      const res = await fetch('/api/reading-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error('API error');
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.text) {
              full += parsed.text;
              setStreamContent(full);
            }
          } catch {}
        }
      }

      setMessages([...newMessages, { role: 'assistant', content: full }]);
      setStreamContent('');

      // Persist the generated path so post pages can guide the reader
      // through it and this page can show progress on return visits.
      const parsed = parseReadingPath(full);
      if (parsed && parsed.posts.length > 0) {
        const saved: SavedPath = { ...parsed, createdAt: new Date().toISOString() };
        try { localStorage.setItem(AI_PATH_KEY, JSON.stringify(saved)); } catch {}
        setSavedPath(saved);
      }
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
      setStreamContent('');
    } finally {
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const hasPath = messages.some(
    (m) => m.role === 'assistant' && m.content.includes('---READING PATH START---')
  );

  const PROMPT_SUGGESTIONS = [
    'I work in leadership or institutional design',
    "I'm interested in AI and what it means for human intelligence",
    "I study or practice law",
    "I'm a writer or work with language",
    "I want to understand what money and debt really are",
    "I study religion, ritual, or the sacred",
    "I work in technology or build things",
    "I'm troubled by what's happening to media and journalism",
  ];

  const startOver = () => {
    try { localStorage.removeItem(AI_PATH_KEY); } catch {}
    setSavedPath(null);
    setMessages([]);
    setInput('');
    setStreamContent('');
  };

  const readCount = savedPath
    ? savedPath.posts.filter((p) => readSlugs.has(p.slug)).length
    : 0;
  const nextUnread = savedPath?.posts.find((p) => !readSlugs.has(p.slug));

  return (
    <div className="max-w-2xl mx-auto">
      {/* Returning visitor with a saved path — show progress, not a cold start */}
      {messages.length === 0 && savedPath && (
        <div className="mb-8">
          <div className="flex items-baseline justify-between gap-4 mb-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{savedPath.title}</h2>
            <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums flex-shrink-0">
              {readCount} of {savedPath.posts.length} read
            </span>
          </div>
          {savedPath.intro && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{savedPath.intro}</p>
          )}

          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 mb-5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gray-900 dark:bg-white transition-all"
              style={{ width: `${savedPath.posts.length ? Math.round((readCount / savedPath.posts.length) * 100) : 0}%` }}
            />
          </div>

          <div className="space-y-2 mb-5">
            {savedPath.posts.map((post, i) => {
              const isRead = readSlugs.has(post.slug);
              return (
                <Link
                  key={post.slug}
                  href={`/post/${post.slug}`}
                  className={`flex gap-3 p-3 rounded-lg border transition-all group block ${
                    isRead
                      ? 'bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800'
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                    isRead
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                      : 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
                  }`}>
                    {isRead ? '✓' : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${SOURCE_COLORS[post.source] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {post.source || slugToSource(post.slug)}
                    </span>
                    <p className={`text-sm font-semibold leading-snug mt-0.5 ${
                      isRead
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-blue-600 dark:text-blue-400 group-hover:underline'
                    }`}>
                      {post.title}
                    </p>
                    {post.note && !isRead && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed italic">{post.note}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {nextUnread ? (
              <Link
                href={`/post/${nextUnread.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
              >
                {readCount > 0 ? 'Continue reading' : 'Start reading'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                Path complete — well done.
              </p>
            )}
            <button
              onClick={startOver}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Build a new path
            </button>
          </div>
        </div>
      )}

      {/* Intro block — only shown before any conversation */}
      {messages.length === 0 && !savedPath && (
        <div className="mb-8">
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-6">
            <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
              Experimental · AI-Curated Reading
            </p>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-3">
              This is an experimental page that tries to recommend introductory Center Study reading based on your interests.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Center Study has no limits — whatever you are interested in or working on: institutional design, artificial intelligence, history, leadership, economics, technology, governance, investing, medicine, poetry, and more — there is some thread through the center that connects to your practice. We would like to help you find it.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">
              So: what are you interested in? What are you <em>stuck on</em>?
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {PROMPT_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-all bg-white dark:bg-gray-900"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversation */}
      <div className="space-y-4 mb-6">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'flex justify-end' : ''}>
            {msg.role === 'user' ? (
              <div className="max-w-sm px-4 py-2.5 rounded-2xl rounded-tr-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm leading-relaxed">
                {msg.content}
              </div>
            ) : (
              <div className="text-sm leading-relaxed">
                {msg.content.includes('---READING PATH START---') ? (
                  <ReadingPathDisplay content={msg.content} />
                ) : (
                  <div className="text-gray-800 dark:text-gray-200">{msg.content}</div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Streaming state */}
        {streaming && streamContent && (
          <div className="text-sm leading-relaxed">
            {streamContent.includes('---READING PATH START---') ? (
              <ReadingPathDisplay content={streamContent} />
            ) : (
              <div className="text-gray-800 dark:text-gray-200">{streamContent}</div>
            )}
          </div>
        )}
        {streaming && !streamContent && (
          <div className="flex gap-1 items-center text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input — hidden once a path exists (generated now or saved earlier) */}
      {!hasPath && !(messages.length === 0 && savedPath) && (
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={messages.length === 0 ? "What are you interested in or stuck on?" : "Continue the conversation…"}
            rows={2}
            className="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 pr-12 text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700 transition-all"
            disabled={streaming}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || streaming}
            className="absolute right-3 bottom-3 p-1.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 disabled:opacity-30 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      )}

      {/* Post-path actions */}
      {hasPath && (
        <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-800 items-center">
          <button
            onClick={startOver}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            ← Start over
          </button>
          <Link
            href="/ask"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Ask AI about any of these texts →
          </Link>
        </div>
      )}
    </div>
  );
}
