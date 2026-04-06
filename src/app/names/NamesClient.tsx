'use client';

import { useState } from 'react';

interface NameEntry {
  id: string;
  name: string;
  location?: string;
  note?: string;
  submittedAt: string;
}

export default function NamesClient({ approved }: { approved: NameEntry[] }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/names/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, location, note }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('done');
      } else {
        setErrorMsg(data.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Could not reach the server.');
      setStatus('error');
    }
  }

  return (
    <div>
      {/* The list */}
      {approved.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 italic text-sm">No names yet.</p>
      ) : (
        <ol className="space-y-4">
          {approved.map((entry, i) => (
            <li key={entry.id} className="flex items-baseline gap-4 group">
              <span className="text-xs font-mono text-gray-300 dark:text-gray-600 w-6 text-right flex-shrink-0 select-none">
                {i + 1}
              </span>
              <div>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{entry.name}</span>
                {entry.location && (
                  <span className="text-gray-400 dark:text-gray-500 text-sm ml-2">— {entry.location}</span>
                )}
                {entry.note && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 italic">&ldquo;{entry.note}&rdquo;</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {/* Request to add your name */}
      <div className="mt-14 border-t border-gray-100 dark:border-gray-800 pt-10">
        {!showForm && status !== 'done' && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors underline underline-offset-2"
          >
            Request to add your name
          </button>
        )}

        {showForm && status !== 'done' && (
          <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Names are reviewed before appearing here.
            </p>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Name <span className="text-gray-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={80}
                placeholder="Your name"
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Location or affiliation <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={100}
                placeholder="City, institution, practice…"
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                A note <span className="text-gray-400 font-normal">(optional, max 300 chars)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={300}
                rows={2}
                placeholder="What draws you to Center Study…"
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors resize-none"
              />
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-500">{errorMsg}</p>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm hover:opacity-80 transition-opacity disabled:opacity-40"
              >
                {status === 'submitting' ? 'Submitting…' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {status === 'done' && (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            Received. Your name will appear here once approved.
          </p>
        )}
      </div>
    </div>
  );
}
