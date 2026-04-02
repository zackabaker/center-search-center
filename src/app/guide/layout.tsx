import Link from 'next/link';
import { CONCEPTS } from '@/data/guide/concepts';
import { READING_PATHS } from '@/data/guide/reading-paths';

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Guide nav strip */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-40 print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-4 overflow-x-auto scrollbar-hide text-sm">
          <Link href="/guide" className="font-semibold text-gray-900 hover:text-blue-600 transition-colors whitespace-nowrap flex-shrink-0">
            Introduction to Center Study
          </Link>
          <span className="text-gray-200 flex-shrink-0">|</span>
          <Link href="/guide/concepts" className="text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap flex-shrink-0">Concepts</Link>
          <Link href="/guide/reading-paths" className="text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap flex-shrink-0">Reading Paths</Link>
          <Link href="/guide/map" className="text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap flex-shrink-0">Concept Map</Link>
          <Link href="/guide/timeline" className="text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap flex-shrink-0">Timeline</Link>
          <span className="flex-1" />
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap flex-shrink-0 text-xs">← Archive</Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
