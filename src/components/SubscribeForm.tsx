'use client';

import { useState } from 'react';

// Minimal owned email capture for the weekly digest. One field, one line of
// promise, no tracking. Compact variant for footers/end-of-article.
export default function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'busy' || state === 'done') return;
    setState('busy');
    try {
      const r = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        setError(d.error || 'Something went wrong — try again.');
        setState('error');
        return;
      }
      setState('done');
    } catch {
      setError('Something went wrong — try again.');
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <p className={`text-sm text-gray-600 dark:text-gray-300 ${compact ? '' : 'py-2'}`}>
        You&rsquo;re on the list — one email a week when new texts arrive.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className={compact ? '' : 'max-w-md'}>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
          placeholder="you@example.com"
          aria-label="Email address"
          className="flex-1 min-w-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3.5 py-2 text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
        />
        <button
          type="submit"
          disabled={state === 'busy'}
          className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex-shrink-0"
        >
          {state === 'busy' ? '…' : 'Subscribe'}
        </button>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
        {state === 'error' ? <span className="text-red-500">{error}</span> : 'New texts, once a week. Unsubscribe anytime.'}
      </p>
    </form>
  );
}
