import Link from 'next/link';
import { Redis } from '@upstash/redis';
import { getPostBySlug } from '@/lib/parser';

// Same KV resolution as /trending (the live store uses the centerstudy_ prefix).
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

// Compact homepage strip surfacing the live view counts that otherwise only
// exist on /trending. Server component; renders nothing when KV is absent.
export default async function MostRead() {
  const kv = getKV();
  if (!kv) return null;

  let entries: { slug: string; count: number }[] = [];
  try {
    const raw = (await kv.zrange('views:counts', 0, 11, { rev: true, withScores: true })) as (string | number)[];
    for (let i = 0; i < raw.length; i += 2) {
      entries.push({ slug: String(raw[i]), count: Number(raw[i + 1]) });
    }
  } catch {
    return null;
  }

  const items = entries
    .map((e) => ({ ...e, post: getPostBySlug(e.slug) }))
    .filter((x): x is typeof x & { post: NonNullable<typeof x.post> } => Boolean(x.post))
    .slice(0, 5);
  if (items.length < 3) return null;

  return (
    <div className="border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Most read</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">What readers are opening across the archive</p>
          </div>
          <Link href="/trending" className="text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0 ml-4">
            All trending →
          </Link>
        </div>
        <ol className="space-y-2">
          {items.map(({ slug, post }, i) => (
            <li key={slug}>
              <Link
                href={`/post/${slug}`}
                className="group flex items-baseline gap-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-900/50 -mx-2 px-2 rounded-lg transition-colors"
              >
                <span className="text-xs text-gray-300 dark:text-gray-600 font-mono w-5 shrink-0 tabular-nums">{i + 1}</span>
                <span className="text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {post.title}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
