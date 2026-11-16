'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { fetchAccount, signInUrl, type AccountState } from '@/lib/account-client';
import { IDIOMS_EVENT, loadIdioms, passageHref, rememberPassage, removeIdiom, type Idiom } from '@/lib/idioms';

interface ReadEvent { slug: string; title: string; at: string; }
interface QueryEvent { q: string; kind: 'ask' | 'search'; at: string; }

const LABEL = 'text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest';
const SMALL_BTN =
  'text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors';

function day(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function IdiomsClient() {
  const params = useSearchParams();
  const signinError = params.get('signin');
  const [idioms, setIdioms] = useState<Idiom[] | null>(null);
  const [account, setAccount] = useState<AccountState | null>(null);
  const [reads, setReads] = useState<ReadEvent[]>([]);
  const [queries, setQueries] = useState<QueryEvent[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const refresh = () => setIdioms(loadIdioms());
    refresh();
    window.addEventListener(IDIOMS_EVENT, refresh);
    // AccountSync applying the account's copy fires the "-applied" variant.
    window.addEventListener(`${IDIOMS_EVENT}-applied`, refresh);
    return () => {
      window.removeEventListener(IDIOMS_EVENT, refresh);
      window.removeEventListener(`${IDIOMS_EVENT}-applied`, refresh);
    };
  }, []);

  const loadEvents = useCallback(() => {
    fetch('/api/me/events')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) { setReads(d.reads ?? []); setQueries(d.queries ?? []); } })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchAccount().then((a) => { setAccount(a); if (a.user) loadEvents(); });
  }, [loadEvents]);

  const user = account?.user ?? null;

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    window.location.reload();
  };
  const deleteAccount = async () => {
    await fetch('/api/me/account', { method: 'DELETE' }).catch(() => {});
    window.location.reload();
  };
  const clearList = async (what: 'reads' | 'queries') => {
    await fetch(`/api/me/events?what=${what}`, { method: 'DELETE' }).catch(() => {});
    if (what === 'reads') setReads([]); else setQueries([]);
  };
  const copy = (x: Idiom) => {
    const url = `https://center.study/post/${x.slug}${x.anchor ? `#${x.anchor}` : ''}`;
    navigator.clipboard.writeText(`“${x.text}” — ${x.title}\n${url}`).then(() => {
      setCopied(x.id);
      setTimeout(() => setCopied((c) => (c === x.id ? null : c)), 1500);
    }).catch(() => {});
  };

  return (
    <main className="max-w-2xl mx-auto w-full px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Idiom archive</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
        The passages you have kept. Save one from an AI search result, or select any text while
        reading a post and choose <span className="font-medium text-gray-700 dark:text-gray-300">Save idiom</span>.
      </p>

      {/* ── Account ─────────────────────────────────────────────── */}
      {account && !user && (
        <div className="rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 p-4 mb-8">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
            These idioms are saved in this browser only.
          </p>
          <p className="text-sm text-amber-800 dark:text-amber-300/90 leading-relaxed">
            You will lose them if you clear your browser data or switch to another phone or computer
            {account.configured
              ? ' — unless you create an account. An account also keeps your reading history and your queries.'
              : '.'}
          </p>
          {account.configured && (
            <a
              href={signInUrl('/idioms')}
              className="mt-3 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-800 dark:text-gray-100 hover:border-gray-500 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z" />
                <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 010-4.2V7.06H2.18a11 11 0 000 9.88l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 002.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
              </svg>
              Continue with Google
            </a>
          )}
          {signinError && (
            <p className="mt-3 text-xs text-red-700 dark:text-red-400">
              {signinError === 'unavailable' ? 'Sign-in is not available right now.' : 'Sign-in did not complete. Please try again.'}
            </p>
          )}
        </div>
      )}

      {user && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-8">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm text-gray-700 dark:text-gray-300 min-w-0 break-words">
              Signed in as <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>.
              Your idioms, reading history and queries are kept with your account.{' '}
              <Link href="/profile" className="underline underline-offset-4">Your profile</Link>
            </p>
            <button onClick={signOut} className={SMALL_BTN}>Sign out</button>
          </div>
        </div>
      )}

      {/* ── Idioms ──────────────────────────────────────────────── */}
      <p className={`${LABEL} mb-3`}>Saved idioms{idioms && idioms.length > 0 ? ` · ${idioms.length}` : ''}</p>
      {idioms === null ? (
        <div className="h-24" />
      ) : idioms.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Nothing saved yet.{' '}
          <Link href="/ask" className="text-blue-600 dark:text-blue-400 hover:underline">Ask a question</Link>{' '}
          and save an excerpt, or open any post, select a phrase and choose Save idiom.
        </div>
      ) : (
        <div className="border-t border-gray-900 dark:border-gray-200">
          {idioms.map((x) => (
            <div key={x.id} className="py-5 border-b border-gray-200 dark:border-gray-700">
              <blockquote
                className="font-serif text-[1.1875rem] leading-[1.5] text-gray-900 dark:text-gray-100 mb-3 break-words"
              >
                {x.text}
              </blockquote>
              <div className="flex items-end justify-between gap-3 flex-wrap">
                <Link
                  href={passageHref(x.slug, x.anchor, x.text)}
                  onClick={() => rememberPassage(x.slug, x.text)}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug min-w-0"
                >
                  {x.title} <span aria-hidden>→</span>
                  <span className="block text-xs font-normal text-gray-400 dark:text-gray-500 mt-0.5">Saved {day(x.savedAt)}</span>
                </Link>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => copy(x)} className={SMALL_BTN}>{copied === x.id ? '✓ Copied' : 'Copy'}</button>
                  <button onClick={() => removeIdiom(x.id)} className={SMALL_BTN}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── History & queries (account only) ────────────────────── */}
      {user && (
        <>
          <div className="flex items-center justify-between mt-10 mb-3">
            <p className={LABEL}>Reading history{reads.length > 0 ? ` · ${reads.length}` : ''}</p>
            {reads.length > 0 && <button onClick={() => clearList('reads')} className={SMALL_BTN}>Clear</button>}
          </div>
          {reads.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Posts you open while signed in will appear here.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800 border-y border-gray-100 dark:border-gray-800">
              {reads.map((r) => (
                <li key={r.slug}>
                  <Link href={`/post/${r.slug}`} className="flex items-baseline justify-between gap-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                    <span className="min-w-0">{r.title}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{day(r.at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-between mt-10 mb-3">
            <p className={LABEL}>Queries{queries.length > 0 ? ` · ${queries.length}` : ''}</p>
            {queries.length > 0 && <button onClick={() => clearList('queries')} className={SMALL_BTN}>Clear</button>}
          </div>
          {queries.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Searches and questions you run while signed in will appear here.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800 border-y border-gray-100 dark:border-gray-800">
              {queries.map((q) => (
                <li key={`${q.kind}-${q.q}`}>
                  <Link
                    href={`${q.kind === 'ask' ? '/ask' : '/search'}?q=${encodeURIComponent(q.q)}`}
                    className="flex items-baseline justify-between gap-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <span className="min-w-0 break-words">{q.q}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                      {q.kind === 'ask' ? 'AI search' : 'Keyword'} · {day(q.at)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800">
            {confirmDelete ? (
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Erase everything stored for your account? This cannot be undone.
                </p>
                <button onClick={deleteAccount} className="text-xs px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">Erase and sign out</button>
                <button onClick={() => setConfirmDelete(false)} className={SMALL_BTN}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 underline py-2">
                Delete my account data
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}
