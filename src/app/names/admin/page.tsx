import { notFound } from 'next/navigation';
import AdminClient from './AdminClient';
import type { NameEntry } from '../../api/names/submit/route';

export const revalidate = 0;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const secret = process.env.ADMIN_SECRET;

  if (!secret || key !== secret) {
    notFound();
  }

  let pending: NameEntry[] = [];
  let approved: NameEntry[] = [];

  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const { Redis } = await import('@upstash/redis');
      const kv = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      pending = (await kv.get<NameEntry[]>('names:pending')) || [];
      approved = (await kv.get<NameEntry[]>('names:approved')) || [];
    }
  } catch {
    // KV not yet configured
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Book of Names — Admin</h1>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-10">
        {pending.length} pending · {approved.length} approved
      </p>

      <AdminClient pending={pending} approved={approved} adminKey={key!} />
    </main>
  );
}
