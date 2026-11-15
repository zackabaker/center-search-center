'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DarkModeToggle from '@/components/DarkModeToggle';
import SceneMark from '@/components/SceneMark';

const NAV_LINKS = [
  { href: '/start',    label: 'Start' },
  { href: '/guide',    label: 'Guide' },
  { href: '/concepts', label: 'Concepts' },
  { href: '/search',   label: 'Search' },
  { href: '/ask',      label: 'AI Search' },
  { href: '/browse',   label: 'Archive' },
  { href: '/download', label: 'Download' },
];

export default function SiteNav() {
  const pathname = usePathname();

  // ⌘K opens the global command palette (mounted in the layout).

  return (
    <nav
      // Solid theme-var ground with one heavy ink rule beneath — the deck's
      // masthead. Total height stays 49px (47 + 2): sticky offsets elsewhere
      // (top-12) depend on it.
      className="sticky top-0 z-30 bg-[var(--background)] border-b-2 border-gray-900 dark:border-gray-200 print:hidden"
    >
      <div className="max-w-5xl mx-auto px-4 h-[47px] flex items-center justify-between">
        <Link
          href="/"
          className="scene-hover font-serif text-[19px] font-semibold text-gray-900 dark:text-white tracking-tight hover:opacity-70 transition-opacity flex-shrink-0 flex items-center gap-2"
        >
          <SceneMark size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
          Center Study Center
        </Link>

        <div className="flex items-center gap-4 sm:gap-5 overflow-x-auto no-scrollbar">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive =
              href === '/'
                ? pathname === '/'
                : pathname === href ||
                  pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={`text-sm font-medium whitespace-nowrap transition-colors hidden sm:flex items-center h-[47px] ${
                  isActive
                    ? 'text-gray-900 dark:text-white shadow-[inset_0_-3px_0_var(--foreground)]'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {label}
              </Link>
            );
          })}
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
}
