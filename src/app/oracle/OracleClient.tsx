'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { fetchAccount, signInUrl, type AccountState } from '@/lib/account-client';
import Markdown from './Markdown';
import TutorWaiting from './TutorWaiting';
import starters from '../../../tutor/starters.json';

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
  /** Id of the kept answer this turn is, or was saved as. */
  kept?: string;
  /** When this answer was first written, if it came from the archive of earlier answers. */
  archived?: number;
  needSignIn?: boolean;
};

const STARTERS = starters as { id: string; q: string }[];
const STORE = 'csc-oracle-thread';

export default function OracleClient() {
  const [account, setAccount] = useState<AccountState | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [waited, setWaited] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchAccount().then(setAccount); }, []);
  // On the visitor's first real input, ask the server to load the texts, so
  // the wait happens while they read and type instead of after they ask.
  useEffect(() => {
    const warm = () => {
      off();
      fetch('/api/tutor/warm', { method: 'POST' }).catch(() => {});
    };
    const events = ['pointerdown', 'keydown', 'touchstart'] as const;
    const off = () => events.forEach((e) => window.removeEventListener(e, warm));
    events.forEach((e) => window.addEventListener(e, warm, { passive: true }));
    return off;
  }, []);
  // Arriving from a saved answer's page ("ask a follow-up"): start the thread with it.
  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get('from');
    if (!from) return;
    fetch(`/api/tutor/kept?id=${encodeURIComponent(from)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.kept) setTurns([{ q: j.kept.q, a: j.kept.a, sources: j.kept.sources ?? [], whole: j.kept.whole ?? [], done: true, kept: j.kept.id }]);
      })
      .catch(() => {});
  }, []);
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

  // `fresh` asks for a new answer to a conversation's first question even
  // though one was written earlier; it restarts the thread with that question.
  const ask = async (question: string, fresh = false) => {
    const q = question.trim();
    if (q.length < 2 || busy) return;
    const prior = fresh ? [] : turns.filter((t) => t.done && t.a);
    const history = prior.flatMap((t) => [
      { role: 'user', content: t.q },
      { role: 'assistant', content: t.a },
    ]);
    const idx = prior.length;
    const patch = (f: (t: Turn) => Turn) => setTurns((ts) => ts.map((t, i) => (i === idx ? f(t) : t)));
    setTurns([...prior, { q, a: '', sources: [], whole: [], done: false }]);
    setInput('');
    setWaited(0);
    setBusy(true);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 50);
    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: q, history, ...(fresh ? { fresh: true } : {}) }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        patch((t) => ({ ...t, error: j.error ?? 'The tutor did not respond. Try again.', needSignIn: j.code === 'signin', done: true }));
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
          else if (ev.sources) patch((t) => ({ ...t, sources: ev.sources as Source[], whole: (ev.whole as Turn['whole']) ?? [], archived: typeof ev.archived === 'number' ? ev.archived : undefined }));
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
  const owner = account?.user?.owner === true;

  // A starter question with a kept answer shows it at once, to anyone; the
  // rest are asked live (which needs an account).
  const start = async (q: string) => {
    if (busy) return;
    try {
      const r = await fetch(`/api/tutor/kept?q=${encodeURIComponent(q)}`);
      if (r.ok) {
        const { kept } = await r.json();
        setTurns([{ q: kept.q, a: kept.a, sources: kept.sources ?? [], whole: kept.whole ?? [], done: true, kept: kept.id }]);
        return;
      }
    } catch { /* ask it live instead */ }
    ask(q);
  };

  // Arriving from the search box's Answer view with a question to carry on.
  const startRef = useRef(start);
  useEffect(() => { startRef.current = start; });
  useEffect(() => {
    if (!account) return;
    const q = new URLSearchParams(window.location.search).get('ask');
    if (!q) return;
    window.history.replaceState(null, '', '/oracle');
    startRef.current(q.slice(0, 600));
  }, [account]);

  const setKept = (i: number, id: string | undefined) => setTurns((ts) => ts.map((t, j) => (j === i ? { ...t, kept: id } : t)));
  const keep = async (i: number) => {
    const t = turns[i];
    const r = await fetch('/api/tutor/kept', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: t.q, a: t.a, sources: t.sources, whole: t.whole }),
    }).catch(() => null);
    if (r?.ok) setKept(i, (await r.json()).kept.id);
    else alert('That did not save. Try again.');
  };
  const unkeep = async (i: number) => {
    const id = turns[i].kept;
    if (!id) return;
    const r = await fetch('/api/tutor/kept', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) }).catch(() => null);
    if (r?.ok) setKept(i, undefined);
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-8 pb-60 sm:pb-44 sm:pt-12">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">The Center Study tutor</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">AI, working from the archive.</p>
      </header>

      {turns.length === 0 && (
        <div className="mt-8">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Somewhere to start</p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {STARTERS.map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => start(s.q)} className="w-full rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2.5 text-left text-sm text-gray-800 hover:border-gray-400 dark:text-gray-200 dark:hover:border-gray-600">
                  {s.q}
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
                <TutorWaiting seconds={waited} found={[...new Set(t.sources.map((x) => x.title))]} />
              )}
              {t.error && !t.needSignIn && <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{t.error}</p>}
              {t.needSignIn && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{t.error}</p>
                  <a href={signInUrl('/oracle')} className="mt-3 inline-block rounded bg-gray-900 px-3 py-2 text-sm text-white dark:bg-gray-100 dark:text-gray-900">Sign in with Google</a>
                </div>
              )}
              {/* Owner only: a reused answer can be replaced with a new one. */}
              {t.done && t.archived && !t.kept && owner && (
                <p className="mt-2 text-xs text-gray-400">
                  Reused from {new Date(t.archived).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.{' '}
                  <button type="button" onClick={() => ask(t.q, true)} className="underline">Write a new one</button>
                </p>
              )}
            </div>
            {/* Owner only: the slips are small (a paragraph off, a word changed) and not worth alarming a reader over. */}
            {owner && t.done && t.check && (t.check.badLinks.length > 0 || t.check.badQuotes.length > 0) && (
              <p className="mt-2 rounded border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-xs text-amber-900 dark:text-amber-200">
                Checked against the archive:{' '}
                {t.check.badQuotes.length > 0 && <>{t.check.badQuotes.length} quotation{t.check.badQuotes.length === 1 ? '' : 's'} could not be found in the paragraph cited. </>}
                {t.check.badLinks.length > 0 && <>{t.check.badLinks.length} link{t.check.badLinks.length === 1 ? '' : 's'} did not lead to a text. </>}
                Treat those with care.
              </p>
            )}
            {owner && t.done && t.check && t.check.quotes > 0 && t.check.badLinks.length === 0 && t.check.badQuotes.length === 0 && (
              <p className="mt-2 text-xs text-gray-400">All {t.check.quotes} quotation{t.check.quotes === 1 ? '' : 's'} found in the paragraphs cited.</p>
            )}
            {t.done && t.a && owner && (
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                {t.kept ? (
                  <>
                    <span>Kept. Served instantly for this question.</span>
                    <Link href={`/oracle/a/${t.kept}`} target="_blank" className="underline">its page →</Link>
                    <button type="button" onClick={() => unkeep(i)} className="underline">stop serving it</button>
                  </>
                ) : (
                  <button type="button" onClick={() => keep(i)} className="rounded border border-gray-300 dark:border-gray-700 px-2 py-0.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    Keep this answer
                  </button>
                )}
              </p>
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

      {account && (
        <form
          onSubmit={(e) => { e.preventDefault(); ask(input); }}
          className="fixed inset-x-0 bottom-[calc(3.6rem+env(safe-area-inset-bottom))] z-30 border-t border-gray-200 dark:border-gray-800 bg-[var(--background)] px-4 py-3 sm:bottom-0 sm:pb-[max(0.75rem,env(safe-area-inset-bottom))]"
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
          {!signedIn && (
            <p className="mx-auto mt-1.5 max-w-3xl text-xs text-gray-500 dark:text-gray-400">
              A couple of questions a day are open to everyone. <a href={signInUrl('/oracle')} className="underline">Sign in with Google</a> for more.
            </p>
          )}
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
