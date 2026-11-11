import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getKV } from '@/lib/kv';

// A saved /begin reading path. Server-rendered from KV; the URL is the
// visitor's returnable/shareable copy. Unlisted: noindex, not in the sitemap.
// Every excerpt shown here was substituted server-side from the semantic
// index at generation time — verbatim by construction; the AI note and the
// per-item "why" lines are the only AI text, and they are labeled.

export const dynamic = 'force-dynamic';

interface SavedItem {
  slug: string;
  title: string;
  source: string;
  excerpt: string;
  anchor: string | null;
  why: string;
}

interface SavedPath {
  id: string;
  createdAt: string;
  interests: string[];
  text: string;
  note: string;
  items: SavedItem[];
  paths: { slug: string; title: string }[];
}

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Bouvard',
  gablog: 'GABlog',
  book: 'Book',
  pdf: 'Essay',
  chronicle: 'CLR',
  ap: 'AP Journal',
  twitter: 'X / Twitter',
};

async function load(id: string): Promise<SavedPath | null> {
  if (!/^[a-z0-9]{6,32}$/i.test(id)) return null;
  const kv = getKV();
  if (!kv) return null;
  try {
    const record = await kv.get<SavedPath>(`begin:${id}`);
    if (!record || !Array.isArray(record.items)) return null;
    return record;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const saved = await load(id);
  return {
    title: saved ? 'Your reading path' : 'Reading path',
    robots: { index: false, follow: false },
  };
}

// A short distinctive phrase from the start of the excerpt, for the reader's
// ?q= highlight when they open the post.
function highlightPhrase(excerpt: string): string {
  return excerpt.replace(/^…/, '').trim().split(/\s+/).slice(0, 7).join(' ');
}

export default async function SavedPathPage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const saved = await load(id);
  if (!saved) notFound();

  const created = new Date(saved.createdAt);
  const createdLabel = isNaN(created.getTime())
    ? null
    : created.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10 pb-24">
      <header className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
          A reading path into Center Study
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
          Your reading path
        </h1>
        {saved.interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {saved.interests.map((interest) => (
              <span
                key={interest}
                className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
          {saved.items.length} texts chosen for you{createdLabel ? ` on ${createdLabel}` : ''}.
          Every excerpt below is quoted verbatim from the archive. This page lives at
          this address &mdash; bookmark it or share the link to come back.
        </p>
      </header>

      {saved.note && (
        <section className="mb-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5">
          <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
            AI orientation note
          </p>
          <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed">
            {saved.note}
          </p>
        </section>
      )}

      <ol className="space-y-10 mb-12">
        {saved.items.map((item, i) => {
          const q = highlightPhrase(item.excerpt);
          const href = `/post/${item.slug}?q=${encodeURIComponent(q)}${item.anchor ? `#${item.anchor}` : ''}`;
          return (
            <li key={`${item.slug}-${i}`}>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-mono text-sm text-gray-400 dark:text-gray-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  <Link
                    href={href}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {item.title}
                  </Link>
                </h2>
                {SOURCE_LABELS[item.source] && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 whitespace-nowrap">
                    {SOURCE_LABELS[item.source]}
                  </span>
                )}
              </div>
              {item.why && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 ml-8">
                  {item.why}
                </p>
              )}
              <figure className="ml-8 border-l-2 border-gray-300 dark:border-gray-600 pl-5">
                <blockquote className="font-serif text-[16px] leading-[1.8] text-gray-800 dark:text-gray-200">
                  {item.excerpt}
                </blockquote>
                <figcaption className="mt-2">
                  <Link
                    href={href}
                    className="text-sm text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2"
                  >
                    Read in context &rarr;
                  </Link>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ol>

      {saved.paths.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
            Continue with a curated path
          </h2>
          <div className="flex flex-wrap gap-2">
            {saved.paths.map((p) => (
              <Link
                key={p.slug}
                href={`/guide/reading-paths/${p.slug}`}
                className="px-3 py-1.5 rounded-full text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-400 transition-colors"
              >
                {p.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        <Link href="/begin" className="text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2">
          Generate another path
        </Link>
        {' '}&middot;{' '}
        <Link href="/guide" className="text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2">
          All the ways into the archive
        </Link>
      </section>
    </main>
  );
}
