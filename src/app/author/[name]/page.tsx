import { getAllPosts } from '@/lib/parser';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import GoBack from '@/components/GoBack';
import type { ContentSource } from '@/lib/types';

// Unified author: Adam Katz writes as himself (GABlog, Essays, Book)
// and as Dennis Bouvard (Substack, Threads). Both names → same page.
const AUTHOR = {
  name: 'Adam Katz',
  altName: 'Dennis Bouvard',
  bio: 'Adam Katz is the author of Center Study. He develops originary grammar across the GABlog (~480 posts since 2007), academic essays and articles, and the book Anthropomorphics. He also writes applied essays on AI, governance, and contemporary politics on Substack under the pen name Dennis Bouvard.',
  sources: ['gablog', 'pdf', 'book', 'substack', 'reddit', 'twitter'] as ContentSource[],
  links: [
    { label: 'GABlog', href: '/browse/gablog' },
    { label: 'Substack', href: '/browse/substack' },
    { label: 'Essays & Articles', href: '/browse/pdf' },
    { label: 'Threads & Q&A', href: '/browse/threads' },
  ],
};

const SOURCE_LABELS: Record<ContentSource, string> = {
  substack:  'Substack',
  gablog:    'GABlog',
  book:      'Anthropomorphics',
  pdf:       'Essays & Articles',
  reddit:    'Reddit',
  twitter:   'X / Twitter',
  chronicle: 'Chronicles of Love and Resentment',
  ap:        'Anthropoetics Journal',
};

const SOURCE_COLORS: Record<ContentSource, string> = {
  substack:  'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  gablog:    'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  book:      'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  pdf:       'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  reddit:    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  twitter:   'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300',
  chronicle: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  ap:        'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
};

const SOURCE_PEN_NAME: Partial<Record<ContentSource, string>> = {
  substack: 'as Dennis Bouvard',
  reddit:   'as Dennis Bouvard',
  twitter:  'as Dennis Bouvard',
};

const VALID_HANDLES = ['katz', 'bouvard', 'katz-bouvard'];

export async function generateStaticParams() {
  return VALID_HANDLES.map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  if (!VALID_HANDLES.includes(name)) return { title: 'Author not found' };
  return {
    title: `Adam Katz (Dennis Bouvard) | Center Study Center`,
    description: AUTHOR.bio,
    alternates: { canonical: 'https://center.study/author/katz' },
  };
}

export const revalidate = 3600;

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  // Canonicalize — bouvard and katz-bouvard redirect to katz
  if (name === 'bouvard' || name === 'katz-bouvard') {
    redirect('/author/katz');
  }

  if (name !== 'katz') notFound();

  const allPosts = getAllPosts();

  const posts = allPosts
    .filter((p) => (AUTHOR.sources as readonly string[]).includes(p.source))
    .sort((a, b) => {
      if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (a.date) return -1;
      if (b.date) return 1;
      return a.title.localeCompare(b.title);
    });

  // Group by source in the order we care about
  const bySource: [ContentSource, typeof posts][] = AUTHOR.sources
    .map((src) => [src, posts.filter((p) => p.source === src)] as [ContentSource, typeof posts])
    .filter(([, ps]) => ps.length > 0);

  const totalCount = posts.length;

  return (
    <main className="max-w-4xl w-full mx-auto px-4 pt-8 pb-24 sm:py-12">
      <div className="mb-6">
        <GoBack fallback="/browse" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors text-sm" />
      </div>

      {/* Author header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">
          {AUTHOR.name}
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">
          also writes as <span className="text-gray-600 dark:text-gray-300 font-medium">Dennis Bouvard</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mb-5">
          {AUTHOR.bio}
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
            {totalCount.toLocaleString()} texts
          </span>
          {AUTHOR.links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Browse {l.label} →
            </Link>
          ))}
        </div>
      </div>

      {/* Posts grouped by source */}
      {bySource.map(([source, sourcePosts]) => (
        <section key={source} className="mb-10">
          <div className="flex items-baseline gap-3 mb-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {SOURCE_LABELS[source]}
            </h2>
            {SOURCE_PEN_NAME[source] && (
              <span className="text-xs text-gray-400 dark:text-gray-500 italic">{SOURCE_PEN_NAME[source]}</span>
            )}
            <span className="text-xs text-gray-400 dark:text-gray-500">{sourcePosts.length}</span>
          </div>
          <div className="space-y-px">
            {sourcePosts.slice(0, 100).map((post) => (
              <Link
                key={post.slug}
                href={`/post/${post.slug}`}
                className="group flex items-start gap-3 py-2.5 min-h-[44px] border-b border-gray-50 dark:border-gray-800/60 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900/40 -mx-2 px-2 rounded transition-colors"
              >
                {post.date && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 w-20 flex-shrink-0 tabular-nums pt-0.5">
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </span>
                )}
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 mt-0.5 ${SOURCE_COLORS[post.source]}`}>
                  {SOURCE_LABELS[post.source]}
                </span>
                <span className="text-sm text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug flex-1 min-w-0">
                  {post.title}
                </span>
              </Link>
            ))}
            {sourcePosts.length > 100 && (
              <Link
                href={`/browse/${source === 'reddit' || source === 'twitter' ? 'threads' : source}`}
                className="block pt-3 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              >
                + {sourcePosts.length - 100} more — browse all →
              </Link>
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
