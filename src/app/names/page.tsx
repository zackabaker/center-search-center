import { Redis } from '@upstash/redis';

const kv = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
import Link from 'next/link';
import DarkModeToggle from '@/components/DarkModeToggle';
import NamesClient from './NamesClient';
import type { Metadata } from 'next';
import type { NameEntry } from '../api/names/submit/route';

export const metadata: Metadata = {
  title: 'Book of Names',
  description: 'A record of those interested in and participating in Center Study.',
};

export const revalidate = 60;

export default async function NamesPage() {
  let approved: NameEntry[] = [];

  try {
    approved = (await kv.get<NameEntry[]>('names:approved')) || [];
  } catch {
    // KV not configured yet — show empty list
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
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
        <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
          Center Study Center
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-5">
          Book of Names
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
          A record of those who have encountered the originary hypothesis and found it worth carrying forward.
          Every name here is a commemoration of a deferred violence — a sign emitted in recognition of a shared center.
        </p>
      </header>

      <NamesClient approved={approved} />

      <footer className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
          Names are displayed as submitted and approved by the editors.{' '}
          <Link href="/intro" className="hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2 transition-colors">
            New to Center Study?
          </Link>
        </p>
      </footer>
    </main>
  );
}
