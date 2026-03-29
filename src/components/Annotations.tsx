'use client';
import { useState } from 'react';
import { useAnnotations } from '@/hooks/useAnnotations';

export default function Annotations({ slug }: { slug: string }) {
  const { note, save } = useAnnotations(slug);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const handleOpen = () => {
    setDraft(note);
    setOpen(true);
  };

  const handleSave = () => {
    save(draft);
    setOpen(false);
  };

  return (
    <div className="mt-10 pt-6 border-t border-gray-200 print:hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Research Notes</h3>
        <button
          onClick={handleOpen}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700 transition-colors"
        >
          {note ? 'Edit notes' : '+ Add notes'}
        </button>
      </div>

      {note ? (
        <div
          onClick={handleOpen}
          className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg p-4 whitespace-pre-wrap cursor-pointer hover:bg-yellow-100 transition-colors"
        >
          {note}
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">
          Your private notes for this post. Stored locally in your browser.
        </p>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="font-semibold text-gray-900">Research Notes</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5">
              <textarea
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Your private notes for this post..."
                className="w-full h-48 text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-blue-400"
              />
              <p className="text-xs text-gray-400 mt-2">Stored only in your browser. Never sent to a server.</p>
            </div>
            <div className="flex justify-end gap-2 px-5 pb-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
