import { getAllPosts } from '@/lib/parser';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { ContentSource } from '@/lib/types';

const AUTHORS = {
  katz: {
    name: 'Adam Katz',
    handle: 'katz',
    sources: ['gablog', 'pdf', 'book'] as ContentSource[],
    bio: 'Adam Katz is the author of Center Study. Through the GABlog (~480 posts since 2007), academic PDFs, and Anthropomorphics, he develops originary grammar and applies it to language, power, juridical order, and the nature of the center. He also writes applied essays on AI, governance, and contemporary politics on Substack under the pen name Dennis Bouvard.',
    color: 'blue',
    colorClasses: {
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      border: 'border-blue-100 dark:border-blue-900/40 hover:border-blue-400 dark:hover:border-blue-600',
      accent: 'text-blue-600 dark:text-blue-400',
    },
    links: [
      { label: 'GABlog', href: '/browse/gablog' },
      { label: 'PDFs', href: '/browse/pdf' },
    ],
  },
  bouvard: {
    name: 'Dennis Bouvard',
    handle: 'bouvard',
    sources: ['substack'] as ContentSource[],
    bio: 'Dennis Bouvard is the pen name used by Adam Katz for his Substack writing. These ~127 essays apply the originary framework to contemporary questions of technology, governance, currency, and AI — tracing how Center Study concepts illuminate the digital economy, political succession, and the anthropology of the algorithm.',
    color: 'orange',
    colorClasses: {
      badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
      border: 'border-orange-100 dark:border-orange-900/40 hover:border-orange-400 dark:hover:border-orange-600',
      accent: 'text-orange-600 dark:text-orange-400',
    },
    links: [
      { label: 'Substack', href: '/browse/substack' },
    ],
  },
} as const;

type AuthorHandle = keyof typeof AUTHORS;

const SOURCE_LABELS: Record<ContentSource, string> = {
  substack: 'Substack',
  gablog: 'GABlog',
  book: 'Book',
  pdf: 'PDF',
  reddit: 'Reddit',
  twitter: 'X / Twitter',
  lecture: 'Lecture Series',
};

const SOURCE_COLORS: Record<ContentSource, string> = {
  substack: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  gablog: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  book: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  pdf: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  reddit: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  twitter: 'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300',
  lecture: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
};

export async function generateStaticParams() {
  return Object.keys(AUTHORS).map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  if (!(name in AUTHORS)) return { title: 'Author not found' };
  const author = AUTHORS[name as AuthorHandle];
  return {
    title: `${author.name} | Center Study Center`,
    description: author.bio,
  };
}

export const revalidate = 3600;

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  if (!(name in AUTHORS)) notFound();

  const author = AUTHORS[name as AuthorHandle];
  const allPosts = getAllPosts();

  const posts = allPosts
    .filter((p) => (author.sources as readonly string[]).includes(p.source))
    .sort((a, b) => {
      if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (a.date) return -1;
      if (b.date) return 1;
      return a.title.localeCompare(b.title);
    });

  const bySource: Record<string, typeof posts> = {};
  for (const p of posts) {
    if (!bySource[p.source]) bySource[p.source] = [];
    bySource[p.source].push(p);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 pt-8 pb-24 sm:py-12">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        {/* Other author */}
        {name === 'katz' && (
          <Link href="/author/bouvard" className="text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Bouvard →
          </Link>
        )}
        {name === 'bouvard' && (
          <Link href="/author/katz" className="text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Katz →
          </Link>
        )}
      </div>

      {/* Author header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">
          {author.name}
        </h1>
        {name === 'bouvard' && (
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">
            pen name of <Link href="/author/katz" className="underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Adam Katz</Link>
          </p>
        )}
        {name === 'katz' && (
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">
            also writes as <Link href="/author/bouvard" className="underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Dennis Bouvard</Link>
          </p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mb-4">
          {author.bio}
        </p>
        <div className="flex flex-wrap gap-2">
          {posts.length > 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
              {posts.length} texts
            </span>
          )}
          {author.links.map((l) => (
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

      {/* Posts by source */}
      {Object.entries(bySource).map(([source, sourcePosts]) => (
        <section key={source} className="mb-10">
          <div className="flex items-baseline gap-3 mb-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {SOURCE_LABELS[source as ContentSource] ?? source}
            </h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">{sourcePosts.length} posts</span>
          </div>
          <div className="space-y-px">
            {sourcePosts.map((post) => (
              <Link
                key={post.slug}
                href={`/post/${post.slug}`}
                className="group flex items-start gap-3 py-3 min-h-[44px] border-b border-gray-50 dark:border-gray-800/60 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900/40 -mx-2 px-2 rounded transition-colors"
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
          </div>
        </section>
      ))}
    </main>
  );
}
