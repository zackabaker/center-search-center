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

function monthKey(offset = 0): string {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() + offset);
  return `views:counts:${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export default async function TrendingPage() {
  const kv = getKV();
  const entries: { slug: string; count: number }[] = [];
  // Prefer the rolling ~60-day window (current + previous month) so the list
  // reflects what readers open NOW; fall back to all-time until the monthly
  // keys have accumulated enough data.
  let windowed = false;
  if (kv) {
    try {
      const [cur, prev] = await Promise.all([
        kv.zrange(monthKey(0), 0, 99, { rev: true, withScores: true }) as Promise<(string | number)[]>,
        kv.zrange(monthKey(-1), 0, 99, { rev: true, withScores: true }) as Promise<(string | number)[]>,
      ]);
      const merged = new Map<string, number>();
      for (const raw of [cur, prev]) {
        for (let i = 0; i < raw.length; i += 2) {
          const slug = String(raw[i]);
          merged.set(slug, (merged.get(slug) ?? 0) + Number(raw[i + 1]));
        }
      }
      const recent = [...merged.entries()].sort((a, b) => b[1] - a[1]);
      if (recent.length >= 10) {
        windowed = true;
        for (const [slug, count] of recent.slice(0, 60)) entries.push({ slug, count });
      }
    } catch {
      // fall through to all-time
    }
    if (!windowed) {
      try {
        const raw = (await kv.zrange('views:counts', 0, 59, { rev: true, withScores: true })) as (string | number)[];
        for (let i = 0; i < raw.length; i += 2) {
          entries.push({ slug: String(raw[i]), count: Number(raw[i + 1]) });
        }
      } catch {
        // KV hiccup — fall through to the empty state.
      }
    }
  }

  const items = entries
    .map((e) => ({ ...e, post: getPostBySlug(e.slug) }))
    .filter((x): x is typeof x & { post: NonNullable<typeof x.post> } => Boolean(x.post))
    // Reference-tier downweight (mirrors search's convention): Gans material
    // can trend, but raw view counts shouldn't let it lead the Katz archive's
    // most-read page by default.
    .sort((a, b) =>
      b.count * (b.post.source === 'chronicle' || b.post.source === 'ap' ? 0.7 : 1) -
      a.count * (a.post.source === 'chronicle' || a.post.source === 'ap' ? 0.7 : 1)
    )
    .slice(0, 30);

  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">Trending</h1>
      <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-2xl">
        {windowed
          ? 'The most-read texts over the past two months. A live snapshot of what readers are finding.'
          : 'The most-read texts in the archive. A live snapshot of what readers are finding.'}
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
