import Link from 'next/link';
import { getPublicPosts } from '@/lib/parser';
import { parsePostDate } from '@/lib/dates';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New in the archive',
  description:
    'The latest texts added to the Center Study archive — new Substack essays and additions across Adam Katz’s corpus, updated automatically.',
  alternates: { canonical: 'https://center.study/new' },
};

// The corpus refreshes on deploy (Substack ingestion runs at build time, on a
// twice-weekly schedule); revalidate keeps the page honest between deploys.
export const revalidate = 3600;

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Substack', gablog: 'GABlog', book: 'Anthropomorphics', pdf: 'Essay',
  reddit: 'Thread', twitter: 'Thread', chronicle: 'Chronicle', ap: 'Anthropoetics', lecture: 'Lecture',
};
const SOURCE_COLORS: Record<string, string> = {
  substack: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  gablog: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  chronicle: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  twitter: 'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300',
  ap: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
};

function monthKey(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function NewPage() {
  const posts = getPublicPosts()
    .map((p) => ({ p, d: parsePostDate(p.date) }))
    .filter((x): x is { p: (typeof x)['p']; d: Date } => x.d !== null)
    .sort((a, b) => b.d.getTime() - a.d.getTime())
    .slice(0, 30);

  // Group by month, newest first
  const groups: { label: string; items: typeof posts }[] = [];
  for (const item of posts) {
    const label = monthKey(item.d);
    const g = groups.find((x) => x.label === label);
    if (g) g.items.push(item);
    else groups.push({ label, items: [item] });
  }

  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
        New in the archive
      </h1>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-6">
        The corpus is alive — new essays land here automatically as they are published.
        The latest thirty texts, newest first.
      </p>


      <div className="space-y-10">
        {groups.map(({ label, items }) => (
          <section key={label}>
            <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
              {label}
            </h2>
            <div className="space-y-5">
              {items.map(({ p }) => (
                <Link key={p.slug} href={`/post/${p.slug}`} className="group block">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${SOURCE_COLORS[p.source] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {SOURCE_LABELS[p.source] || p.source}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{p.date}</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {p.title}
                  </p>
                  {p.excerpt && (
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1 line-clamp-2 max-w-2xl"
                      style={{ fontFamily: 'var(--prose-font-family)' }}
                    >
                      &ldquo;{p.excerpt.replace(/…$|\.\.\.$/, '')}…&rdquo;
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
