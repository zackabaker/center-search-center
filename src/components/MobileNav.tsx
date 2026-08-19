'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    // Restored at owner direction (2026-08-18): the wordmark alone wasn't a
    // discoverable way home on mobile — the bar needs a real Home tab.
    href: '/',
    label: 'Home',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    // Labeled what it is: "Start" on desktop goes to /start, so this tab says
    // Guide to avoid one word pointing at two different pages.
    href: '/guide',
    label: 'Guide',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    // One door for both retrieval modes (owner direction, 2026-08-18):
    // /search carries keyword + meaning and hands off to ✦ Ask AI, so Ask
    // no longer needs its own tab. The tab stays lit on /ask pages.
    href: '/search',
    label: 'Search',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    href: '/concepts',
    label: 'Concepts',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: '/browse',
    label: 'Archive',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  // Auto-hide while reading: slide away on scroll-down, return on scroll-up
  // or near the top — the bar shouldn't permanently eat reading height.
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        if (y < 80) setHidden(false);
        else if (delta > 8) setHidden(true);
        else if (delta < -8) setHidden(false);
        lastY.current = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Opaque background (no backdrop-blur): position:fixed + backdrop-filter
  // composites on a separate layer that lags during mobile momentum scroll,
  // making the bar "float" up mid-page. Solid bg avoids that.
  return (
    <nav
      aria-label="Primary"
      className={`fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[var(--background)] border-t border-gray-100 dark:border-gray-800 transition-transform duration-200 ${hidden ? 'translate-y-full' : 'translate-y-0'}`}
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-stretch justify-around">
        {navItems.map(({ href, label, icon }) => {
          const isActive =
            href === '/'
              ? pathname === '/'
              : pathname === href ||
                pathname.startsWith(href + '/') ||
                pathname.startsWith(href + '?') ||
                // Ask folded into the Search tab — keep it lit on /ask pages
                (href === '/search' && (pathname === '/ask' || pathname.startsWith('/ask/')));
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 pt-2 pb-1 px-3 flex-1 transition-colors ${
                isActive
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {icon}
              <span className="text-xs leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
