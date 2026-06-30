import Link from 'next/link';
import { Redis } from '@upstash/redis';
import { getPostBySlug } from '@/lib/parser';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trending',
  description: 'The most-read texts in the Center Study archive right now.',
  alternates: { canonical: 'https://center.study/trending' },
};

// Reads live view counts — cache for 10 minutes.
export const revalidate = 600;

// Same KV resolution as /api/view (the live store uses the centerstudy_ prefix).
function getKV(): Redis | null {
  const url =
    process.env.centerstudy_KV_REST_API_URL ||
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.centerstudy_KV_REST_API_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const SOURCE_LABEL: Record<string, string> = {
  substack: 'Substack', gablog: 'GABlog', book: 'Anthropomorphics', pdf: 'Essay',
  reddit: 'Thread', twitter: 'Thread', chronicle: 'Chronicle', ap: 'Anthropoetics', lecture: 'Lecture',
};

export default async function TrendingPage() {
  const kv = getKV();
  const entries: { slug: string; count: number }[] = [];
  if (kv) {
    try {
      const raw = (await kv.zrange('views:counts', 0, 59, { rev: true, withScores: true })) as (string | number)[];
      for (let i = 0; i < raw.length; i += 2) {
        entries.push({ slug: String(raw[i]), count: Number(raw[i + 1]) });
      }
    } catch {
      // KV hiccup — fall through to the empty state.
    }
  }

  const items = entries
    .map((e) => ({ ...e, post: getPostBySlug(e.slug) }))
    .filter((x): x is typeof x & { post: NonNullable<typeof x.post> } => Boolean(x.post))
    .slice(0, 30);

  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">Trending</h1>
      <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-2xl">
        The most-read texts in the archive lately. A live snapshot of what readers are finding.
      </p>

      {items.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nothing trending yet. Start anywhere —{' '}
            <Link href="/start" className="text-blue-600 dark:text-blue-400 hover:underline">the introduction</Link>,{' '}
            <Link href="/browse" className="text-blue-600 dark:text-blue-400 hover:underline">the archive</Link>, or{' '}
            <Link href="/search" className="text-blue-600 dark:text-blue-400 hover:underline">search</Link>.
          </p>
        </div>
      ) : (
        <ol className="space-y-1">
          {items.map((it, i) => (
            <li key={it.slug}>
              <Link
                href={`/post/${it.slug}`}
                className="group flex items-baseline gap-3 rounded-lg px-3 py-2.5 -mx-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <span className="text-sm font-mono text-gray-300 dark:text-gray-600 w-6 text-right shrink-0">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{it.post.title}</span>
                  <span className="block text-xs text-gray-400 dark:text-gray-500 mt-0.5">{SOURCE_LABEL[it.post.source] || it.post.source}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
