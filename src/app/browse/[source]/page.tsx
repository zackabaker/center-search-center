import { getAllPosts } from '@/lib/parser';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ContentSource } from '@/lib/types';

export const revalidate = 3600;

const VALID_SOURCES = ['substack', 'gablog', 'book', 'pdf', 'reddit', 'twitter'] as const;
type ValidSource = typeof VALID_SOURCES[number];

const SOURCE_META: Record<ValidSource, { label: string; description: string; color: string }> = {
  substack: {
    label: 'Bouvard Substack',
    description: 'Applied essays on AI, governance, money, language, and technology',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  },
  gablog: {
    label: 'GABlog',
    description: "Adam Katz's theoretical blog — originary grammar in development",
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  },
  book: {
    label: 'Anthropomorphics',
    description: "Eric Gans's systematic originary grammar of the center",
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  },
  pdf: {
    label: 'PDFs',
    description: 'Academic papers, lectures, and longer works',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  },
  reddit: {
    label: 'Reddit',
    description: 'Discussions from r/Absolutistneoreaction',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  },
  twitter: {
    label: 'X / Twitter',
    description: 'Threads and notes from X (formerly Twitter)',
    color: 'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300',
  },
};

const PAGE_SIZE = 40;

export function generateStaticParams() {
  return VALID_SOURCES.map((source) => ({ source }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ source: string }>;
}): Promise<Metadata> {
  const { source } = await params;
  if (!VALID_SOURCES.includes(source as ValidSource)) return {};
  const meta = SOURCE_META[source as ValidSource];
  return {
    title: `${meta.label} — Center Study Center`,
    description: meta.description,
  };
}

export default async function BrowseSourcePage({
  params,
  searchParams,
}: {
  params: Promise<{ source: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ source }, { page: pageParam }] = await Promise.all([params, searchParams]);

  if (!VALID_SOURCES.includes(source as ValidSource)) notFound();

  const src = source as ValidSource;
  const meta = SOURCE_META[src];

  const allPosts = getAllPosts().filter((p) => p.source === (src as ContentSource));

  // Sort: dated posts newest-first, then undated alphabetically
  const sorted = [...allPosts].sort((a, b) => {
    if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return a.title.localeCompare(b.title);
  });

  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.max(1, Math.min(totalPages, parseInt(pageParam ?? '1', 10) || 1));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagePosts = sorted.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <main className="max-w-4xl mx-auto px-4 pt-8 pb-24 sm:py-12">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          &larr; Home
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${meta.color}`}>
            {meta.label}
          </span>
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {totalCount} {totalCount === 1 ? 'post' : 'posts'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          {meta.label}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{meta.description}</p>
      </div>

      {/* Post list */}
      <div className="space-y-px border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        {pagePosts.map((post) => (
          <Link
            key={post.slug}
            href={`/post/${post.slug}`}
            className="group flex flex-col gap-1.5 p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug flex-1">
                {post.title}
              </h2>
              {post.date && (
                <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5">
                  {post.date}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>

      {/* Pagination — full-width rows on mobile, side-by-side on desktop */}
      {totalPages > 1 && (
        <div className="mt-6 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          {/* Prev / Next stacked on mobile */}
          <div className="flex gap-2">
            {currentPage > 1 ? (
              <Link
                href={`/browse/${src}?page=${currentPage - 1}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 min-h-[44px] px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
              >
                ← Newer
              </Link>
            ) : (
              <span className="flex-1 sm:flex-none" />
            )}

            {currentPage < totalPages ? (
              <Link
                href={`/browse/${src}?page=${currentPage + 1}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 min-h-[44px] px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
              >
                Older →
              </Link>
            ) : (
              <span className="flex-1 sm:flex-none" />
            )}
          </div>

          <span className="block text-center sm:text-right text-xs text-gray-400 dark:text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </main>
  );
}
