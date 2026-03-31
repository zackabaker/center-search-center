'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  // ⌘K / Ctrl+K → go to search page
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        router.push('/search');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    else router.push('/search');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative flex items-center border-2 border-gray-200 focus-within:border-gray-400 rounded-xl bg-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 ml-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the archive…"
          className="flex-1 px-3 py-3 text-base outline-none bg-transparent text-gray-700 placeholder-gray-400"
          autoComplete="off"
        />
        <button
          type="submit"
          className="mr-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
        >
          Search
        </button>
      </div>
    </form>
  );
}
