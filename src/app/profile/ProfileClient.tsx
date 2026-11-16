'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAccount, signInUrl, type AccountState } from '@/lib/account-client';
import { IDIOMS_EVENT, loadIdioms, passageHref, rememberPassage, type Idiom } from '@/lib/idioms';

interface Profile { username: string; createdAt: string; }
interface Stats { readSec: number; searches: number; idioms: number; }
interface Me { profile: Profile; stats: Stats; score: number; }

const LABEL = 'text-xs font-mono uppercase tracking-widest text-gray-900 dark:text-gray-100';
const QUIET_BTN =
  'h-11 px-4 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-gray-900 dark:hover:border-gray-200 rounded-sm transition-colors';
const INK_BTN =
  'h-11 px-5 text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 rounded-sm transition-colors disabled:opacity-40';

export function readingTime(sec: number): string {
  const m = Math.floor(sec / 60);
  if (m < 1) return '0m';
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

export default function ProfileClient() {
  const [account, setAccount] = useState<AccountState | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [name, setName] = useState('');
  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [idioms, setIdioms] = useState<Idiom[]>([]);

  useEffect(() => {
    fetchAccount(true).then((a) => {
      setAccount(a);
      if (!a.user) return;
      fetch('/api/me/profile')
        .then((r) => (r.ok ? r.json() : null))
        .then((d: Me | null) => { if (d) { setMe(d); setName(d.profile.username); } })
        .catch(() => {});
    });
    const refresh = () => setIdioms(loadIdioms());
    refresh();
    window.addEventListener(IDIOMS_EVENT, refresh);
    window.addEventListener(`${IDIOMS_EVENT}-applied`, refresh);
    return () => {
      window.removeEventListener(IDIOMS_EVENT, refresh);
      window.removeEventListener(`${IDIOMS_EVENT}-applied`, refresh);
    };
  }, []);

  const patch = async (body: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> => {
    setBusy(true);
    try {
      const r = await fetch('/api/me/profile', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) return { ok: false, error: d.error || 'That did not save. Try again.' };
      setMe(d as Me);
      return { ok: true };
    } catch {
      return { ok: false, error: 'That did not save. Check your connection and try again.' };
    } finally {
      setBusy(false);
    }
  };

  const saveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameMsg(null);
    const res = await patch({ username: name.trim() });
    setNameMsg(res.ok ? { ok: true, text: 'Saved.' } : { ok: false, text: res.error! });
  };

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    window.location.href = '/';
  };

  const user = account?.user ?? null;

  if (account && !user) {
    return (
      <main className="max-w-2xl mx-auto w-full px-4 py-10 min-h-screen">
        <h1 className="text-4xl font-medium text-gray-900 dark:text-white mb-3">Your profile</h1>
        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          Sign in to keep your idiom archive on every device and a record of what you read.
          You get a random username you can change; your name and email are never shown.
        </p>
        {account.configured ? (
          <a href={signInUrl('/profile')} className={`${INK_BTN} inline-flex items-center`}>Continue with Google</a>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Sign-in is not available right now.</p>
        )}
      </main>
    );
  }

  if (!me) return <main className="max-w-2xl mx-auto w-full px-4 py-10 min-h-screen" />;

  const { profile, stats } = me;

  return (
    <main className="max-w-2xl mx-auto w-full px-4 py-10 min-h-screen">
      <h1 className="text-4xl font-medium text-gray-900 dark:text-white mb-8">Your profile</h1>

      {/* ── Username ─────────────────────────────────────────────── */}
      <section className="border-t-2 border-gray-900 dark:border-gray-200 pt-6 pb-8">
        <form onSubmit={saveName}>
          <label htmlFor="username" className={`${LABEL} block mb-2`}>Username</label>
          <div className="flex gap-2">
            <input
              id="username"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameMsg(null); }}
              maxLength={20}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="flex-1 min-w-0 h-11 px-3 text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-[1.5px] border-gray-900 dark:border-gray-300 rounded-sm"
            />
            <button type="submit" disabled={busy || name.trim() === profile.username} className={INK_BTN}>Save</button>
          </div>
          <p className={`mt-2 text-sm ${nameMsg && !nameMsg.ok ? 'text-red-700 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {nameMsg ? nameMsg.text : '3 to 20 letters, numbers or underscores. You were given a random one; change it whenever you like.'}
          </p>
        </form>

        <p className="mt-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Your Google name, photo and email
          {user ? <> (<span className="break-all">{user.email}</span>)</> : null} are never shown to anyone.
        </p>
      </section>

      {/* ── Reading record ───────────────────────────────────────── */}
      <section className="border-t border-gray-900 dark:border-gray-200 pt-6 pb-8">
        <h2 className={`${LABEL} mb-4`}>Your reading record</h2>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5">
          {[
            ['Time reading', readingTime(stats.readSec)],
            ['Searches', stats.searches.toLocaleString()],
            ['Idioms saved', stats.idioms.toLocaleString()],
            ['Score', me.score.toLocaleString()],
          ].map(([label, value]) => (
            <div key={label}>
              <dd className="font-serif text-3xl font-medium text-gray-900 dark:text-white tabular-nums">{value}</dd>
              <dt className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Score = minutes spent reading, plus 2 for each new search, plus 5 for each idiom saved.
          Other readers cannot see any of this. The person who runs the site can see usernames
          with these totals.
        </p>
      </section>

      {/* ── Idiom archive ────────────────────────────────────────── */}
      <section className="border-t border-gray-900 dark:border-gray-200 pt-6 pb-8">
        <div className="flex items-baseline justify-between gap-4 mb-2">
          <h2 className={LABEL}>Your idiom archive{idioms.length > 0 ? ` · ${idioms.length}` : ''}</h2>
          <Link href="/idioms" className="text-sm font-medium text-blue-600 dark:text-blue-400 underline underline-offset-4">
            Open the archive
          </Link>
        </div>
        {idioms.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Passages you save appear here. Save one from an AI search result, or select any text
            while reading and choose Save idiom.
          </p>
        ) : (
          <div>
            {idioms.slice(0, 3).map((x) => (
              <Link
                key={x.id}
                href={passageHref(x.slug, x.anchor, x.text)}
                onClick={() => rememberPassage(x.slug, x.text)}
                className="group block py-4 border-b border-gray-200 dark:border-gray-700"
              >
                <span className="block font-serif text-[1.0625rem] leading-[1.5] text-gray-900 dark:text-gray-100 line-clamp-3">
                  {x.text}
                </span>
                <span className="block mt-1.5 text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {x.title}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-gray-900 dark:border-gray-200 pt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={signOut} className={QUIET_BTN}>Sign out</button>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Reading history, past queries and account deletion are on the{' '}
          <Link href="/idioms" className="underline underline-offset-4">idiom archive</Link> page.
        </p>
      </section>
    </main>
  );
}
