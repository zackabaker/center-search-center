import { getAllPosts } from '@/lib/parser';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ContentSource } from '@/lib/types';
import BrowseSourceClient from '@/components/BrowseSourceClient';

export const revalidate = 3600;

const REAL_SOURCES = ['substack', 'gablog', 'book', 'pdf', 'reddit', 'twitter'] as const;
type RealSource = typeof REAL_SOURCES[number];

// Archival sources rendered on demand (excluded from generateStaticParams to avoid ISR size limits)
const ARCHIVAL_SOURCES = ['chronicle', 'ap'] as const;

const VALID_SOURCES = [...REAL_SOURCES, 'threads', 'all', ...ARCHIVAL_SOURCES] as const;
type ValidSource = typeof VALID_SOURCES[number];

interface SourceMeta {
  label: string;
  description: string;
  color: string; // badge color
  dot: string;   // accent color for breadcrumb
}

// ── Source tab strip data ─────────────────────────────────────────────────────

const CORE_TABS = [
  { slug: 'gablog',   label: 'GABlog',          dot: 'bg-blue-400'   },
  { slug: 'substack', label: 'Substack',         dot: 'bg-orange-400' },
  { slug: 'threads',  label: 'Threads & Q&A',    dot: 'bg-violet-400' },
  { slug: 'pdf',      label: 'Essays',           dot: 'bg-green-400'  },
  { slug: 'book',     label: 'Anthropomorphics', dot: 'bg-purple-400' },
  { slug: 'all',      label: 'All',              dot: 'bg-gray-400'   },
] as const;

const ARCHIVE_TABS = [
  { slug: 'chronicle', label: 'Chronicles', dot: 'bg-amber-400' },
  { slug: 'ap',        label: 'AP Journal', dot: 'bg-teal-400'  },
] as const;

const SOURCE_TABS = [...CORE_TABS, ...ARCHIVE_TABS];

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
    description: 'Every text in the archive — GABlog, Substack, Essays & Articles, Anthropomorphics, Reddit, X, Chronicles, and AP Journal — sorted chronologically. Use the year filter and sort controls to navigate.',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-300',
    dot: 'text-gray-500 dark:text-gray-400',
  },
  chronicle: {
    label: 'Chronicles of Love and Resentment',
    description: "Eric Gans's weekly column on culture, desire, and the originary hypothesis — published every week from 1996 to 2019. An essential running commentary on contemporary thought through the lens of Generative Anthropology.",
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    dot: 'text-amber-600 dark:text-amber-400',
  },
  ap: {
    label: 'Anthropoetics Journal',
    description: "The peer-reviewed journal of Generative Anthropology, founded by Eric Gans at UCLA. Published 1995–2024 (Vols 1–30), featuring essays by Van Oort, Bartlett, Dennis, Ludwigs, McKenna, Goldman, Eshelman, Gans, Girard, and others.",
    color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
    dot: 'text-teal-600 dark:text-teal-400',
  },
};

export function generateStaticParams() {
  // Exclude 'all', 'threads', and archival sources — aggregated/large pages
  // would exceed Vercel's 19 MB ISR fallback limit. They render on demand.
  return REAL_SOURCES.map((source) => ({ source }));
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
    <main className="max-w-4xl w-full mx-auto px-4 pt-4 pb-24 sm:pt-8 sm:py-12">

      {/* ── Source tab strip — scrollable on mobile ─────────────────────────── */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 mb-6">
        <div className="flex items-center gap-2 min-w-max">
          {/* Core sources */}
          {CORE_TABS.map((tab) => {
            const isActive = src === tab.slug;
            return (
              <Link
                key={tab.slug}
                href={`/browse/${tab.slug}`}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tab.dot}`} />
                {tab.label}
              </Link>
            );
          })}

          {/* Divider + Archives label */}
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 flex-shrink-0 mx-1" />
          <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-600 font-medium flex-shrink-0 pr-0.5">
            Archives
          </span>

          {/* Archive sources */}
          {ARCHIVE_TABS.map((tab) => {
            const isActive = src === tab.slug;
            return (
              <Link
                key={tab.slug}
                href={`/browse/${tab.slug}`}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-400'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tab.dot}`} />
                {tab.label}
              </Link>
            );
          })}
        </div>
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
