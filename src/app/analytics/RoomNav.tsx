'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// The console's rooms. The overview is one screen; everything else has a
// page of its own, and a text or a visit opens under the room it belongs to.

const ROOMS: [href: string, label: string, alsoUnder?: string][] = [
  ['/analytics', 'Overview'],
  ['/analytics/opportunities', 'Opportunities'],
  ['/analytics/searches', 'Searches'],
  ['/analytics/sources', 'Sources'],
  ['/analytics/x', 'X'],
  ['/analytics/reading', 'Reading', '/analytics/post/'],
  ['/analytics/journeys', 'Journeys'],
  ['/analytics/answers', 'Answers'],
  ['/analytics/ai', 'AI'],
  ['/analytics/sessions', 'Visits', '/analytics/session/'],
  ['/analytics/people', 'People'],
];

export default function RoomNav() {
  const pathname = usePathname() ?? '';
  return (
    <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-b border-gray-200 dark:border-gray-800 pb-2 text-sm">
      {ROOMS.map(([href, label, alsoUnder]) => {
        const active =
          href === '/analytics'
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`) || (!!alsoUnder && pathname.startsWith(alsoUnder));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={
              active
                ? 'font-semibold text-gray-900 dark:text-gray-100'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
