'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: { slug: string; title: string; source: string }[];
}

const SOURCE_COLORS: Record<string, string> = {
  substack: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  gablog: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  book: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  pdf: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  glossary: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
};

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Substack',
  gablog: 'GABlog',
  book: 'Book',
  pdf: 'PDF',
  glossary: 'Glossary',
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userMessage },
    ];
    setMessages(newMessages);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: newMessages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to get response');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let assistantContent = '';
      let sources: ChatMessage['sources'] = undefined;

      // Add empty assistant message that we'll stream into
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '', sources: undefined },
      ]);

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.text) {
              assistantContent += data.text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: assistantContent,
                  sources,
                };
                return updated;
              });
            }
            if (data.sources) {
              sources = data.sources;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: assistantContent,
                  sources,
                };
                return updated;
              });
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong';
      setMessages((prev) => [
        ...prev.filter((m) => m.role !== 'assistant' || m.content),
        {
          role: 'assistant',
          content: `Error: ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function renderMessageContent(content: string) {
    // Split by quoted text and render with styling
    const parts = content.split(/("(?:[^"\\]|\\.)*")/g);

    return parts.map((part, i) => {
      if (part.startsWith('"') && part.endsWith('"')) {
        return (
          <span
            key={i}
            className="bg-amber-50 dark:bg-amber-900/20 text-gray-900 dark:text-amber-100 border-l-2 border-amber-400 pl-2 inline"
          >
            {part}
          </span>
        );
      }
      // Handle [Source Title] citations
      const citeParts = part.split(/(\[[^\]]+\])/g);
      return citeParts.map((cp, j) => {
        if (cp.startsWith('[') && cp.endsWith(']')) {
          return (
            <span
              key={`${i}-${j}`}
              className="text-blue-600 dark:text-blue-400 text-sm font-medium"
            >
              {cp}
            </span>
          );
        }
        return <span key={`${i}-${j}`}>{cp}</span>;
      });
    });
  }

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label={isOpen ? 'Close chat' : 'Open GA assistant'}
      >
        {isOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                GA Research Assistant
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Answers with direct quotes from the archive
              </p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <p className="text-sm mb-3">
                  Ask me anything about Generative Anthropology.
                </p>
                <p className="text-xs">
                  I'll answer using only direct quotes from the archive.
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    'What is the originary scene?',
                    'How does Gans define resentment?',
                    'What is the role of the center?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q);
                        inputRef.current?.focus();
                      }}
                      className="block w-full text-left text-xs px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                    >
                      &ldquo;{q}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="whitespace-pre-wrap">
                      {renderMessageContent(msg.content)}
                      {msg.content === '' && isLoading && (
                        <span className="animate-pulse">Searching archive...</span>
                      )}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}

                  {/* Source links */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                        Sources:
                      </p>
                      <div className="space-y-1">
                        {msg.sources.map((src, j) => (
                          <Link
                            key={j}
                            href={`/post/${src.slug}`}
                            target="_blank"
                            className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${SOURCE_COLORS[src.source] || ''}`}
                            >
                              {SOURCE_LABELS[src.source] || src.source}
                            </span>
                            <span className="truncate">{src.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about GA..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 max-h-24"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium disabled:opacity-40 hover:opacity-80 transition-opacity flex-shrink-0"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 text-center">
              Powered by Claude. Answers only from archive sources.
            </p>
          </form>
        </div>
      )}
    </>
  );
}
