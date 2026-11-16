'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signedInHint, signInUrl } from '@/lib/account-client';
import Avatar from '@/components/Avatar';

interface Reader { username: string; hasAvatar: boolean; score: number; readSec: number; searches: number; idioms: number; }

function readingTime(sec: number): string {
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

// The site's most engaged signed-in readers: reading time, searches and saved
// idioms combined into one score. Usernames only — never a real name.
export default function Leaderboard() {
  const [readers, setReaders] = useState<Reader[] | null>(null);
  const [signedIn, setSignedIn] = useState(true);

  useEffect(() => {
    setSignedIn(signedInHint());
    fetch('/api/leaderboard')
      .then((r) => (r.ok ? r.json() : { readers: [] }))
      .then((d) => setReaders(d.readers ?? []))
      .catch(() => setReaders([]));
  }, []);

  if (readers === null) return null;

  return (
    <section aria-label="Most engaged readers" className="text-left">
      <h2 className="text-xs font-mono uppercase tracking-widest text-gray-900 dark:text-gray-100 mb-2">
        Most engaged readers
      </h2>
      {readers.length === 0 ? (
        <p className="py-3.5 border-y border-gray-900 dark:border-gray-200 text-sm text-gray-500 dark:text-gray-400">
          No one is on the board yet.
        </p>
      ) : (
        <ol className="border-t border-gray-900 dark:border-gray-200">
          {readers.map((r, i) => (
            <li key={r.username} className="flex items-center gap-3 py-2.5 border-b border-gray-200 dark:border-gray-700">
              <span className="w-5 text-sm text-gray-500 dark:text-gray-400 tabular-nums text-right flex-shrink-0">{i + 1}</span>
              <Avatar username={r.username} hasAvatar={r.hasAvatar} size={30} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white truncate">{r.username}</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                  {readingTime(r.readSec)} read · {r.searches} {r.searches === 1 ? 'search' : 'searches'} · {r.idioms} {r.idioms === 1 ? 'idiom' : 'idioms'}
                </span>
              </span>
              <span className="font-serif text-xl font-medium text-gray-900 dark:text-white tabular-nums flex-shrink-0">
                {r.score.toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        Minutes read, searches and idioms saved, combined.{' '}
        {signedIn ? (
          <Link href="/profile" className="underline underline-offset-4 text-gray-900 dark:text-gray-100">Your profile</Link>
        ) : (
          <a href={signInUrl('/profile')} className="underline underline-offset-4 text-gray-900 dark:text-gray-100">Sign in to join</a>
        )}
      </p>
    </section>
  );
}
