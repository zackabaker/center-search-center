import Link from 'next/link';
import type { Metadata } from 'next';
import RoomNav from './RoomNav';

// /analytics — the owner's private console (formerly /study; src/proxy.ts
// 308-redirects the old URL and gates this whole subtree: owner Google
// session, or the legacy key cookie). One screen of overview, then a room
// per question: what to act on, what readers search, where they come from,
// what they read, how visits go, what Ask told them, how the AI systems see
// the site, and who has an account.

export const metadata: Metadata = {
  title: 'Analytics',
  robots: { index: false, follow: false },
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    // w-full matters: auto margins make <main> shrink-to-fit in the root
    // layout's flex column, so without a definite width any table's
    // min-width (even inside its own scroll container) widens the whole
    // page on phones.
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      <header>
        <Link href="/analytics" className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Analytics
        </Link>
        <RoomNav />
      </header>
      <div className="mt-6">{children}</div>
    </main>
  );
}
