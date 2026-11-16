'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

// Footer "Feedback": a small form whose notes are read back on /study.
export default function FeedbackButton({ className }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    boxRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setState('sending');
    try {
      const r = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text, page: pathname || '/' }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setError(d.error || 'That did not send. Try again.'); setState('idle'); return; }
      setState('sent');
      setText('');
    } catch {
      setError('That did not send. Check your connection and try again.');
      setState('idle');
    }
  };

  return (
    <>
      <button type="button" onClick={() => { setOpen(true); setState('idle'); setError(null); }} className={className}>
        Feedback
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4 print:hidden"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            className="w-full sm:max-w-md bg-[var(--background)] border-t-2 sm:border-2 border-gray-900 dark:border-gray-200 p-5 text-left"
          >
            <h2 id="feedback-title" className="text-2xl font-medium text-gray-900 dark:text-white mb-1">Send feedback</h2>
            {state === 'sent' ? (
              <>
                <p className="text-base text-gray-700 dark:text-gray-300 mt-3 mb-5">Sent. Thank you.</p>
                <button type="button" onClick={() => setOpen(false)} className="h-11 px-5 text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-sm">
                  Close
                </button>
              </>
            ) : (
              <form onSubmit={send}>
                <label htmlFor="feedback-text" className="block text-sm text-gray-600 dark:text-gray-300 mb-3">
                  What is broken, confusing or missing? It goes straight to the person who runs the site.
                </label>
                <textarea
                  id="feedback-text"
                  ref={boxRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  maxLength={2000}
                  className="w-full p-3 text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-[1.5px] border-gray-900 dark:border-gray-300 rounded-sm resize-y"
                />
                {error && <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error}</p>}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={state === 'sending' || text.trim().length < 3}
                    className="h-11 px-5 text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-sm disabled:opacity-40"
                  >
                    {state === 'sending' ? 'Sending' : 'Send'}
                  </button>
                  <button type="button" onClick={() => setOpen(false)} className="h-11 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
