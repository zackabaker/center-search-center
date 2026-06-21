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
    // Live Upstash store is connected with the 'centerstudy' prefix; the
    // unprefixed KV_REST_API_* point at an old deleted DB, so prefer centerstudy_.
    const url = process.env.centerstudy_KV_REST_API_URL || process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.centerstudy_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) {
      const { Redis } = await import('@upstash/redis');
      const kv = new Redis({ url, token });
      pending = (await kv.get<NameEntry[]>('names:pending')) || [];
      approved = (await kv.get<NameEntry[]>('names:approved')) || [];
    }
  } catch {
    // KV not yet configured
  }

  return (
    <main className="max-w-2xl w-full mx-auto px-4 py-10 sm:py-16">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Book of Names — Admin</h1>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-10">
        {pending.length} pending · {approved.length} approved
      </p>

      <AdminClient pending={pending} approved={approved} adminKey={key!} />
    </main>
  );
}
