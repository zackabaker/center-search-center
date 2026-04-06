'use client';

import { useState } from 'react';

interface NameEntry {
  id: string;
  name: string;
  location?: string;
  note?: string;
  submittedAt: string;
}

export default function AdminClient({
  pending: initialPending,
  approved: initialApproved,
  adminKey,
}: {
  pending: NameEntry[];
  approved: NameEntry[];
  adminKey: string;
}) {
  const [pending, setPending] = useState(initialPending);
  const [approved, setApproved] = useState(initialApproved);
  const [loading, setLoading] = useState<string | null>(null);

  async function act(id: string, action: 'approve' | 'reject') {
    setLoading(id);
    const res = await fetch(`/api/names/admin?key=${adminKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    const data = await res.json();
    if (data.success) {
      const entry = pending.find((e) => e.id === id)!;
      setPending((p) => p.filter((e) => e.id !== id));
      if (action === 'approve') setApproved((a) => [...a, entry]);
    }
    setLoading(null);
  }

  return (
    <div className="space-y-12">
      {/* Pending */}
      <section>
        <h2 className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5">
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">No pending submissions.</p>
        ) : (
          <div className="space-y-4">
            {pending.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{entry.name}</p>
                    {entry.location && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{entry.location}</p>
                    )}
                    {entry.note && (
                      <p className="text-sm text-gray-400 dark:text-gray-500 italic mt-1">&ldquo;{entry.note}&rdquo;</p>
                    )}
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
                      {new Date(entry.submittedAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => act(entry.id, 'approve')}
                      disabled={loading === entry.id}
                      className="px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => act(entry.id, 'reject')}
                      disabled={loading === entry.id}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 hover:border-red-300 dark:hover:border-red-700 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-40"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Approved */}
      <section>
        <h2 className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5">
          Approved ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">No approved names yet.</p>
        ) : (
          <ol className="space-y-2">
            {approved.map((entry, i) => (
              <li key={entry.id} className="flex items-baseline gap-3 text-sm">
                <span className="text-xs font-mono text-gray-300 dark:text-gray-600 w-5 text-right flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-gray-800 dark:text-gray-200">{entry.name}</span>
                {entry.location && (
                  <span className="text-gray-400 dark:text-gray-500">— {entry.location}</span>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
