'use client';
import { useEffect, useState } from 'react';

const MINE_FLAG = 'csc-mine';

export default function MineClient() {
  const [mine, setMine] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setMine(!!localStorage.getItem(MINE_FLAG));
    } catch {
      setMine(false);
    }
  }, []);

  function toggle() {
    try {
      if (localStorage.getItem(MINE_FLAG)) {
        localStorage.removeItem(MINE_FLAG);
        setMine(false);
      } else {
        localStorage.setItem(MINE_FLAG, '1');
        setMine(true);
      }
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <main className="max-w-md w-full mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Owner device</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
        Marks this browser as the site owner&rsquo;s. Searches, views, and
        conversion events from a marked browser are tagged so they can be
        separated from readers&rsquo; in the counters. The flag lives in this
        browser only — set it once per device and browser.
      </p>
      {mine === null ? (
        <p className="text-sm text-gray-400">Checking…</p>
      ) : (
        <>
          <p className="text-sm mb-4">
            This browser is currently:{' '}
            <span className={`font-semibold ${mine ? 'text-amber-700 dark:text-amber-400' : 'text-gray-900 dark:text-white'}`}>
              {mine ? 'marked as the owner' : 'counted as a reader'}
            </span>
          </p>
          <button
            onClick={toggle}
            className="px-5 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {mine ? 'Unmark this device' : 'This is my device'}
          </button>
        </>
      )}
    </main>
  );
}
