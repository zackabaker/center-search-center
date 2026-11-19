'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { fetchAccount, signInUrl, type AccountState } from '@/lib/account-client';

type Source = { title: string; url: string; source: string; snippet: string };
type Check = { links: number; badLinks: string[]; quotes: number; badQuotes: { quote: string; href: string; inText: boolean }[] };
type Turn = {
  q: string;
  a: string;
  sources: Source[];
  whole: { title: string; url: string }[];
  check?: Check;
  cost?: number;
  error?: string;
  done: boolean;
};

const STARTERS = [
  'I’m new to this. What is the originary hypothesis, and why does it matter?',
  'What does Center Study mean by “the center”?',
  'How does Katz think about money and debt?',
  'What is an idiom, and what is idiomclining?',
  'Apply Center Study to how AI language models are changing writing.',
  'Why does succession matter so much for judging a social order?',
];
const STORE = 'csc-oracle-thread';

function inline(text: string, k: number): React.ReactNode {
  return text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={`${k}-${i}`}>{part.slice(2, -2)}</strong>;
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) return <em key={`${k}-${i}`}>{part.slice(1, -1)}</em>;
    const m = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (m) {
      const internal = m[2].startsWith('/');
      return internal ? (
        <Link key={`${k}-${i}`} href={m[2]} target="_blank" className="underline decoration-gray-400 underline-offset-2 hover:decoration-gray-900 dark:hover:decoration-gray-100">{m[1]}</Link>
      ) : (
        <a key={`${k}-${i}`} href={m[2]} target="_blank" rel="noreferrer" className="underline">{m[1]}</a>
      );
    }
    return <span key={`${k}-${i}`}>{part}</span>;
  });
}

function Markdown({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  const lines = text.split('\n');
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      out.push(<h3 key={k++} className="mt-5 mb-1.5 font-semibold text-gray-900 dark:text-gray-100">{inline(h[2], k)}</h3>);
      i++; continue;
    }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items: string[] = [];
      while (i < lines.length && (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))) {
        items.push(lines[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, ''));
        i++;
      }
      const L = ordered ? 'ol' : 'ul';
      out.push(
        <L key={k++} className={`my-3 space-y-1.5 pl-5 ${ordered ? 'list-decimal' : 'list-disc'}`}>
          {items.map((it, j) => <li key={j}>{inline(it, k * 100 + j)}</li>)}
        </L>,
      );
      continue;
    }
    if (line.startsWith('>')) {
      const q: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) { q.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push(<blockquote key={k++} className="my-3 border-l-2 border-gray-300 dark:border-gray-600 pl-4 italic">{inline(q.join(' '), k)}</blockquote>);
      continue;
    }
    out.push(<p key={k++} className="mb-3">{inline(line, k)}</p>);
    i++;
  }
  return <div className="font-serif text-[17px] leading-relaxed text-gray-800 dark:text-gray-200">{out}</div>;
}

export default function OracleClient() {
  const [account, setAccount] = useState<AccountState | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [waited, setWaited] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchAccount().then(setAccount); }, []);
  useEffect(() => {
    // After mount (not during render) so the server and first client render agree.
    Promise.resolve().then(() => {
      try {
        const saved = JSON.parse(sessionStorage.getItem(STORE) ?? '[]') as Turn[];
        if (Array.isArray(saved) && saved.length) setTurns(saved.filter((t) => t.done && t.a));
      } catch { /* no saved thread */ }
    });
  }, []);
  useEffect(() => {
    if (busy) return;
    try { sessionStorage.setItem(STORE, JSON.stringify(turns.filter((t) => t.done && t.a))); } catch { /* best-effort */ }
  }, [turns, busy]);
  useEffect(() => {
    if (!busy) return;
    const id = setInterval(() => setWaited((w) => w + 1), 1000);
    return () => clearInterval(id);
  }, [busy]);

  const ask = async (question: string) => {
    const q = question.trim();
    if (q.length < 2 || busy) return;
    const history = turns.filter((t) => t.done && t.a).flatMap((t) => [
      { role: 'user', content: t.q },
      { role: 'assistant', content: t.a },
    ]);
    const idx = turns.length;
    const patch = (f: (t: Turn) => Turn) => setTurns((ts) => ts.map((t, i) => (i === idx ? f(t) : t)));
    setTurns((ts) => [...ts, { q, a: '', sources: [], whole: [], done: false }]);
    setInput('');
    setWaited(0);
    setBusy(true);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 50);
    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: q, history }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        patch((t) => ({ ...t, error: j.error ?? 'The tutor did not respond. Try again.', done: true }));
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.trim()) continue;
          let ev: Record<string, unknown>;
          try { ev = JSON.parse(line); } catch { continue; }
          if (typeof ev.text === 'string') { const add = ev.text; patch((t) => ({ ...t, a: t.a + add })); }
          else if (ev.sources) patch((t) => ({ ...t, sources: ev.sources as Source[], whole: (ev.whole as Turn['whole']) ?? [] }));
          else if (ev.check) patch((t) => ({ ...t, check: ev.check as Check, cost: ev.cost as number | undefined }));
          else if (typeof ev.error === 'string') { const e = ev.error; patch((t) => ({ ...t, error: e })); }
        }
      }
      patch((t) => ({ ...t, done: true }));
    } catch {
      patch((t) => ({ ...t, error: 'The connection dropped before the answer finished. Try again.', done: true }));
    } finally {
      setBusy(false);
    }
  };

  const signedIn = !!account?.user;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-8 pb-40 sm:pt-12">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">The Center Study tutor</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          An AI tutor that has read Adam Katz’s lectures, <em>Anthropomorphics</em>, and his essays, and answers from them. It quotes and links the texts it draws on, and says when the archive has little on a question. It is not Katz, and it can be wrong: follow the links and read the passages yourself.
        </p>
      </header>

      {account && !signedIn && (
        <div className="mt-8 rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-5">
          <p className="text-sm text-gray-700 dark:text-gray-300">The tutor is open to readers with an account. Sign in to start.</p>
          <a href={signInUrl('/oracle')} className="mt-3 inline-block rounded bg-gray-900 px-3 py-2 text-sm text-white dark:bg-gray-100 dark:text-gray-900">
            Sign in with Google
          </a>
        </div>
      )}

      {signedIn && turns.length === 0 && (
        <div className="mt-8">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Somewhere to start</p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {STARTERS.map((s) => (
              <li key={s}>
                <button type="button" onClick={() => ask(s)} className="w-full rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2.5 text-left text-sm text-gray-800 hover:border-gray-400 dark:text-gray-200 dark:hover:border-gray-600">
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 space-y-10">
        {turns.map((t, i) => (
          <article key={i}>
            <p className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2.5 text-[15px] text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{t.q}</p>
            <div className="mt-4">
              {t.a ? <Markdown text={t.a} /> : !t.error && (
                <p className="text-sm text-gray-500 dark:text-gray-400" role="status">
                  {waited < 6 ? 'Finding the passages…' : `Reading the texts… ${waited}s. The first answer of a session can take a minute or more.`}
                </p>
              )}
              {t.error && <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{t.error}</p>}
            </div>
            {t.done && t.check && (t.check.badLinks.length > 0 || t.check.badQuotes.length > 0) && (
              <p className="mt-2 rounded border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-xs text-amber-900 dark:text-amber-200">
                Checked against the archive:{' '}
                {t.check.badQuotes.length > 0 && <>{t.check.badQuotes.length} quotation{t.check.badQuotes.length === 1 ? '' : 's'} could not be found in the paragraph cited. </>}
                {t.check.badLinks.length > 0 && <>{t.check.badLinks.length} link{t.check.badLinks.length === 1 ? '' : 's'} did not lead to a text. </>}
                Treat those with care.
              </p>
            )}
            {t.done && t.check && t.check.quotes > 0 && t.check.badLinks.length === 0 && t.check.badQuotes.length === 0 && (
              <p className="mt-2 text-xs text-gray-400">All {t.check.quotes} quotation{t.check.quotes === 1 ? '' : 's'} found in the paragraphs cited.</p>
            )}
            {t.cost !== undefined && <p className="mt-1 text-xs text-gray-400">This answer cost ${t.cost.toFixed(2)} (shown to you only).</p>}
            {t.sources.length > 0 && (
              <details className="mt-3">
                <summary className="cursor-pointer text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Sources · {t.sources.length} passages retrieved{t.whole.length > 0 ? `, ${t.whole.length} further text${t.whole.length === 1 ? '' : 's'} read in full` : ''}
                </summary>
                <ol className="mt-2 space-y-2 text-sm">
                  {t.sources.map((s) => (
                    <li key={s.url}>
                      <Link href={s.url} target="_blank" className="font-medium text-gray-900 hover:underline dark:text-gray-100">{s.title}</Link>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">{s.snippet}…</span>
                    </li>
                  ))}
                  {t.whole.map((w) => (
                    <li key={w.url} className="text-xs text-gray-500 dark:text-gray-400">
                      Read in full: <Link href={w.url} target="_blank" className="underline">{w.title}</Link>
                    </li>
                  ))}
                </ol>
              </details>
            )}
          </article>
        ))}
        <div ref={endRef} />
      </div>

      {signedIn && (
        <form
          onSubmit={(e) => { e.preventDefault(); ask(input); }}
          className="fixed inset-x-0 bottom-0 border-t border-gray-200 dark:border-gray-800 bg-[var(--background)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input); } }}
              rows={2}
              placeholder={turns.length ? 'Ask a follow-up…' : 'Ask about a concept, a text, or your own example…'}
              aria-label="Your question"
              className="min-w-0 flex-1 resize-none rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-base text-gray-900 dark:text-gray-100"
            />
            <button type="submit" disabled={busy || input.trim().length < 2} className="rounded bg-gray-900 px-4 py-2.5 text-sm text-white disabled:opacity-40 dark:bg-gray-100 dark:text-gray-900">
              {busy ? 'Answering…' : 'Ask'}
            </button>
          </div>
          {turns.length > 0 && !busy && (
            <div className="mx-auto mt-1.5 max-w-3xl">
              <button type="button" onClick={() => { setTurns([]); try { sessionStorage.removeItem(STORE); } catch { /* ignore */ } }} className="text-xs text-gray-500 underline">
                Start a new conversation
              </button>
            </div>
          )}
        </form>
      )}
    </main>
  );
}
