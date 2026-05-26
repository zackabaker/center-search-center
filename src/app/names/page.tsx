import Link from 'next/link';
import DarkModeToggle from '@/components/DarkModeToggle';
import NamesClient from './NamesClient';
import type { Metadata } from 'next';
import type { NameEntry } from '../api/names/submit/route';

export const metadata: Metadata = {
  title: 'Book of Names',
  description: 'A record of those who have encountered the originary hypothesis and found it worth carrying forward.',
};

export const revalidate = 60;

const FOUNDING: NameEntry[] = [
  { id: 'founding-1', name: 'Adam Katz', submittedAt: '' },
  { id: 'founding-2', name: 'Zack Baker', submittedAt: '' },
];

export default async function NamesPage() {
  let approved: NameEntry[] = [];

  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const { Redis } = await import('@upstash/redis');
      const kv = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      approved = (await kv.get<NameEntry[]>('names:approved')) || [];
    }
  } catch {
    // KV not available — founding names still render
  }

  return (
    <main className="max-w-2xl w-full mx-auto px-4 py-10 sm:py-16">
      <div className="flex items-center justify-between mb-12">
        <Link
          href="/"
          className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          ← Archive
        </Link>
        <DarkModeToggle />
      </div>

      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-5">
          Book of Names
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          A record of those who have encountered the originary hypothesis and found it worth carrying forward.
        </p>
      </header>

      <NamesClient approved={[...FOUNDING, ...approved]} />
    </main>
  );
}
