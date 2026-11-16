'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAccount, signedInHint, signInUrl, type Account } from '@/lib/account-client';

// Top-right of the masthead: "Sign in" for a visitor; once signed in, their
// username (with its initial as a tile) linking to their profile. A signed-out visitor
// makes no account request — the hint cookie is checked first.
export default function AccountButton() {
  const [user, setUser] = useState<Account | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!signedInHint()) { setChecked(true); return; }
    fetchAccount().then((a) => { setUser(a.user); setChecked(true); });
  }, []);

  if (!checked) return <span className="w-[68px] h-9" aria-hidden />;

  if (user && user.username) {
    return (
      <Link
        href="/profile"
        className="flex items-center gap-2 h-9 pl-1 pr-2.5 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm transition-colors flex-shrink-0"
        title="Your profile"
      >
        <span
          aria-hidden
          className="w-[26px] h-[26px] flex-shrink-0 inline-flex items-center justify-center rounded-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-serif text-xs font-semibold uppercase leading-none"
        >
          {user.username.slice(0, 1)}
        </span>
        <span className="max-w-[9rem] truncate hidden sm:inline">{user.username}</span>
      </Link>
    );
  }

  return (
    <a
      href={signInUrl('/profile')}
      className="flex items-center h-9 px-3.5 text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 rounded-sm transition-colors flex-shrink-0 whitespace-nowrap"
    >
      Sign in
    </a>
  );
}
