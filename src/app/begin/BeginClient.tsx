'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// The /begin form: interest chips + one free-text field. No PII is asked for
// or stored — the API drops anything beyond the canonical chips and the capped
// free text. Submitting generates a saved reading path and navigates to it.

const INTERESTS = [
  'currency', 'economics', 'prediction markets', 'companies', 'social theory',
  'power & politics', 'leadership', 'philosophy', 'language', 'the sacred',
  'AI & technology', 'literature & aesthetics',
];

const STAGES = [
  'Searching 1,900+ texts…',
  'Reading candidate passages…',
  'Choosing and ordering your path…',
  'Saving your page…',
];

export default function BeginClient() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grow, setGrow] = useState(false);
  const [stage, setStage] = useState(0);

  // Drive the progress bar + stage captions while a generation is running.
  // The bar eases toward 95% over ~18s (CSS transition does the work); it
  // never claims completion — navigation to the saved page is the real finish.
  useEffect(() => {
    if (!busy) {
      setGrow(false);
      setStage(0);
      return;
    }
    const raf = requestAnimationFrame(() => setGrow(true));
    const timer = setInterval(
      () => setStage((s) => Math.min(s + 1, STAGES.length - 1)),
      4500,
    );
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, [busy]);

  function toggle(interest: string) {
    setSelected((prev) =>
      prev.includes(interest) ? prev.filter((x) => x !== interest) : [...prev, interest],
    );
  }

  async function submit() {
    if (busy) return;
    if (selected.length === 0 && text.trim().length < 3) {
      setError('Pick at least one interest, or say a little about yourself.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/begin', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ interests: selected, text: text.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.id) {
        setError(
          typeof data.error === 'string'
            ? data.error
            : 'Something went wrong — please try again in a moment.',
        );
        setBusy(false);
        return;
      }
      router.push(`/begin/p/${data.id}`);
      // keep busy=true during navigation so the button doesn't flicker back
    } catch {
      setError('Something went wrong — please try again in a moment.');
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 sm:p-6">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        What are you interested in?
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {INTERESTS.map((interest) => {
          const on = selected.includes(interest);
          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggle(interest)}
              aria-pressed={on}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                on
                  ? 'bg-gray-900 text-white border-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:border-gray-100'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 dark:hover:border-gray-400'
              }`}
            >
              {interest}
            </button>
          );
        })}
      </div>

      <label htmlFor="begin-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Your intellectual background and interests{' '}
        <span className="font-normal text-gray-400 dark:text-gray-500">(optional, in your own words)</span>
      </label>
      <textarea
        id="begin-text"
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 600))}
        rows={3}
        placeholder={'e.g. “I come from economics and I’m curious how money relates to language and ritual”'}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-[15px] text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-500 dark:focus:border-gray-400 resize-y"
      />

      {!busy && (
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={submit}
            className="px-5 py-2.5 rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Generate my reading path
          </button>
          <span className="text-xs text-gray-400 dark:text-gray-500 max-w-[22rem]">
            AI selects the texts; every excerpt is quoted verbatim.
            About 15 seconds.
          </span>
        </div>
      )}

      {busy && (
        <div className="mt-5" role="status" aria-live="polite">
          <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gray-900 dark:bg-gray-100"
              style={{
                width: grow ? '95%' : '2%',
                transition: 'width 18s cubic-bezier(0.15, 0.6, 0.3, 1)',
              }}
            />
          </div>
          <p className="mt-2.5 text-sm text-gray-500 dark:text-gray-400">
            {STAGES[stage]}
          </p>
        </div>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
