'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import DarkModeToggle from '@/components/DarkModeToggle';

const NAV_LINKS = [
  { href: '/start',               label: 'Start' },
  { href: '/guide',               label: 'Guide' },
  { href: '/concepts',            label: 'Glossary' },
  { href: '/search',              label: 'Search' },
  { href: '/guide/reading-paths', label: 'Reading Paths' },
  { href: '/browse',              label: 'Browse' },
  { href: '/download',            label: 'Download' },
];

export default function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Global ⌘K / Ctrl+K → search, from any page
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

  return (
    <nav className="sticky top-0 z-30 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-100 dark:border-gray-800 print:hidden">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight hover:opacity-70 transition-opacity flex-shrink-0"
        >
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
                className={`text-xs whitespace-nowrap transition-colors hidden sm:block ${
                  isActive
                    ? 'text-gray-900 dark:text-white font-medium'
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
