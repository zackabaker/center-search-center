import Link from 'next/link';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      {/* Guide nav strip */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] sticky top-0 z-40 print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-4 overflow-x-auto scrollbar-hide text-sm">
          <Link href="/guide" className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap flex-shrink-0">
            Guide
          </Link>
          <span className="text-gray-300 dark:text-gray-700 flex-shrink-0">|</span>
          <Link href="/guide/concepts" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap flex-shrink-0">Concepts</Link>
          <Link href="/guide/reading-paths" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap flex-shrink-0">Reading Paths</Link>
          <Link href="/guide/map" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap flex-shrink-0">Concept Map</Link>
          <span className="flex-1" />
          <Link href="/" className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors whitespace-nowrap flex-shrink-0 text-xs">← Archive</Link>
          <DarkModeToggle />
        </div>
      </nav>
      {children}
    </div>
  );
}
