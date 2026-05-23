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

function parseReadingPath(content: string): { title: string; intro: string; posts: RecommendedPost[]; coda: string } | null {
  const match = content.match(/---READING PATH START---([\s\S]*?)---READING PATH END---/);
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
    if (line.startsWith('**') && line.includes('**') && !inPosts) {
      title = line.replace(/\*\*/g, '');
      continue;
    }

    // Numbered post line: 1. slug | Source | Title
    const postMatch = line.match(/^\d+\.\s+([^\s|]+)\s*\|\s*([^|]+)\s*\|\s*(.+)$/);
    if (postMatch) {
      inPosts = true;
      const slug = postMatch[1].trim();
      const source = postMatch[2].trim();
      const postTitle = postMatch[3].trim();
      // Look ahead for italic note
      let note = '';
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (nextLine.startsWith('*') && nextLine.endsWith('*')) {
          note = nextLine.replace(/^\*|\*$/g, '').trim();
          i++;
        }
      }
      posts.push({ slug, source, title: postTitle, note });
      continue;
    }

    // After path coda
    if (line.startsWith('**After this path:**')) {
      coda = line.replace('**After this path:**', '').trim();
      afterPath = true;
      continue;
    }

    // Intro paragraph (before numbered posts)
    if (!inPosts && !afterPath) {
      intro += (intro ? ' ' : '') + line;
    }
  }

  return { title, intro, posts, coda };
}

const SOURCE_COLORS: Record<string, string> = {
  Substack: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  GABlog:   'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  PDF:      'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  Book:     'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
};

function ReadingPathDisplay({ content }: { content: string }) {
  const path = parseReadingPath(content);

  if (!path || path.posts.length === 0) {
    // Fallback: render raw markdown-ish text
    return (
      <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-sm">
        {content}
      </div>
    );
  }

  const handleDownload = () => {
    const text = [
      path.title,
      '',
      path.intro,
      '',
      ...path.posts.map((p, i) =>
        `${i + 1}. ${p.title} [${p.source}]\n   ${p.note}\n   https://center.study/post/${p.slug}`
      ),
      '',
      path.coda ? `Next: ${path.coda}` : '',
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'center-study-reading-path.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

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
          <div key={post.slug} className="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${SOURCE_COLORS[post.source] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                  {post.source}
                </span>
              </div>
              <Link
                href={`/post/${post.slug}`}
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                target="_blank"
              >
                {post.title}
              </Link>
              {post.note && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed italic">{post.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {path.coda && (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-4">{path.coda}</p>
      )}

      <button
        onClick={handleDownload}
        className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
      >
        ↓ Download reading list
      </button>
    </div>
  );
}

export default function ReadingPathFinder() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Only scroll when a completed message is added — NOT during streaming.
  // This lets users read from the top of the response as it arrives.
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
      const reader = res.body!.getReader();
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
    } catch (err) {
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

  return (
    <div className="max-w-2xl mx-auto">
      {/* Intro block */}
      {messages.length === 0 && (
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

        {/* Streaming */}
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

      {/* Input */}
      {!hasPath && (
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={messages.length === 0 ? "What are you interested in or stuck on?" : "Continue the conversation..."}
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

      {/* After path is generated */}
      {hasPath && (
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => {
              setMessages([]);
              setInput('');
              setStreamContent('');
            }}
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
