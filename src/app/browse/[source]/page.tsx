import { getAllPosts } from '@/lib/parser';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ContentSource } from '@/lib/types';
import BrowseSourceClient from '@/components/BrowseSourceClient';

export const revalidate = 3600;

const REAL_SOURCES = ['substack', 'gablog', 'book', 'pdf', 'reddit', 'twitter'] as const;
type RealSource = typeof REAL_SOURCES[number];

const VALID_SOURCES = [...REAL_SOURCES, 'threads', 'all'] as const;
type ValidSource = typeof VALID_SOURCES[number];

interface SourceMeta {
  label: string;
  description: string;
  color: string; // badge color
  dot: string;   // accent color for breadcrumb
}

const SOURCE_META: Record<ValidSource, SourceMeta> = {
  substack: {
    label: 'Bouvard Substack',
    description: 'Applied essays on AI, governance, money, language, and technology — written under the pen name Dennis Bouvard',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    dot: 'text-orange-600 dark:text-orange-400',
  },
  gablog: {
    label: 'GABlog',
    description: "Adam Katz's theoretical blog — originary grammar in development across 25+ years",
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    dot: 'text-blue-600 dark:text-blue-400',
  },
  book: {
    label: 'Anthropomorphics',
    description: "The systematic treatment — an originary grammar of the center, deriving language, personhood, and institutions from the originary scene",
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    dot: 'text-purple-600 dark:text-purple-400',
  },
  pdf: {
    label: 'Essays & Articles',
    description: 'Academic papers, journal articles, introductory lectures, and longer works — including NER, JCRT publications and the five Center Study lectures',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    dot: 'text-green-600 dark:text-green-400',
  },
  reddit: {
    label: 'Reddit Threads',
    description: 'Long-form responses and Q&A dialogues from Reddit — reconstructed with full question context',
    color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
    dot: 'text-violet-600 dark:text-violet-400',
  },
  twitter: {
    label: 'X Threads',
    description: 'Long-form tweet threads — self-started threads with 150+ words, filtered from 1,400+ posts',
    color: 'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300',
    dot: 'text-slate-600 dark:text-slate-400',
  },
  threads: {
    label: 'Threads & Q&A',
    description: 'Reddit dialogues and X threads — applied thinking, Q&A exchanges, and long-form responses across social media',
    color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
    dot: 'text-violet-600 dark:text-violet-400',
  },
  all: {
    label: 'All Sources',
    description: 'Every text in the archive — GABlog, Substack, Essays & Articles, Anthropomorphics, Reddit, and X — sorted chronologically. Use the year filter and sort controls to navigate.',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-300',
    dot: 'text-gray-500 dark:text-gray-400',
  },
};

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
}: {
  params: Promise<{ source: string }>;
}) {
  const { source } = await params;

  if (!VALID_SOURCES.includes(source as ValidSource)) notFound();

  const src = source as ValidSource;
  const meta = SOURCE_META[src];

  const allPosts = getAllPosts();

  // Virtual sources
  const sourcePosts =
    src === 'threads' ? allPosts.filter((p) => p.source === 'reddit' || p.source === 'twitter') :
    src === 'all'     ? allPosts :
    allPosts.filter((p) => p.source === (src as ContentSource));

  // Sort: dated posts newest-first, then undated alphabetically
  const sorted = [...sourcePosts].sort((a, b) => {
    if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return a.title.localeCompare(b.title);
  });

  const totalCount = sorted.length;

  // Sub-counts for virtual sources
  const redditCount  = (src === 'threads' || src === 'all') ? allPosts.filter(p => p.source === 'reddit').length : 0;
  const twitterCount = (src === 'threads' || src === 'all') ? allPosts.filter(p => p.source === 'twitter').length : 0;

  return (
    <main className="max-w-4xl mx-auto px-4 pt-8 pb-24 sm:py-12">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link
          href="/browse"
          className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          Archive
        </Link>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-300 dark:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.color}`}>
          {meta.label}
        </span>
      </div>

      {/* Header */}
      <div className="mb-7">
        <div className="flex items-baseline gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {meta.label}
          </h1>
          <span className="text-sm text-gray-400 dark:text-gray-500 tabular-nums">
            {totalCount.toLocaleString()} {totalCount === 1 ? 'post' : 'posts'}
            {src === 'threads' && (
              <span className="ml-1 text-[11px] text-gray-300 dark:text-gray-700">
                ({redditCount} Reddit · {twitterCount} X)
              </span>
            )}
            {src === 'all' && (
              <span className="ml-1 text-[11px] text-gray-300 dark:text-gray-700">
                across all sources
              </span>
            )}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
          {meta.description}
        </p>
      </div>

      {/* Searchable post list (client component) */}
      <BrowseSourceClient posts={sorted} source={src} totalCount={totalCount} />

    </main>
  );
}
