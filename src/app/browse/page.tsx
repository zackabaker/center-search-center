import { getAllPosts } from '@/lib/parser';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Browse the complete Center Study archive: GABlog, Substack, Essays & Articles, Anthropomorphics, Threads & Q&A, Chronicles of Love and Resentment, and the Anthropoetics Journal.',
  alternates: { canonical: 'https://center.study/browse' },
};

export const revalidate = 3600;

const CORE_SOURCES = [
  {
    slug: 'gablog',
    label: 'GABlog',
    author: 'Adam Katz',
    description: 'The primary theoretical blog — originary grammar, the center through history, scenic design, and succession. 25+ years of continuous development.',
    dot: 'bg-blue-400',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    ring: 'hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-700',
    accent: 'border-l-4 border-blue-400',
  },
  {
    slug: 'substack',
    label: 'Substack',
    author: 'Dennis Bouvard (Adam Katz)',
    description: 'Applied Center Study: AI, governance, money, media, succession, and contemporary politics. Written under the pen name Dennis Bouvard.',
    dot: 'bg-orange-400',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    ring: 'hover:ring-2 hover:ring-orange-300 dark:hover:ring-orange-700',
    accent: 'border-l-4 border-orange-400',
  },
  {
    slug: 'pdf',
    label: 'Essays & Articles',
    author: 'Adam Katz',
    description: 'Academic papers, journal articles, introductory lectures, and longer works — including NER, JCRT publications, and the five Center Study lectures.',
    dot: 'bg-green-400',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    ring: 'hover:ring-2 hover:ring-green-300 dark:hover:ring-green-700',
    accent: 'border-l-4 border-green-400',
  },
  {
    slug: 'book',
    label: 'Anthropomorphics',
    author: 'Adam Katz',
    description: 'The systematic treatment — an originary grammar of the center. Derives language, personhood, institutions, and the human sciences from the originary scene.',
    dot: 'bg-purple-400',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    ring: 'hover:ring-2 hover:ring-purple-300 dark:hover:ring-purple-700',
    accent: 'border-l-4 border-purple-400',
  },
  {
    slug: 'threads',
    label: 'Threads & Q&A',
    author: 'Dennis Bouvard (Adam Katz)',
    description: 'Reddit dialogues and X threads — long-form responses, Q&A exchanges with full question context, and applied thinking across social media.',
    dot: 'bg-violet-400',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
    ring: 'hover:ring-2 hover:ring-violet-300 dark:hover:ring-violet-700',
    accent: 'border-l-4 border-violet-400',
    isVirtual: true,
  },
] as const;

const ARCHIVE_SOURCES = [
  {
    slug: 'chronicle',
    label: 'Chronicles of Love and Resentment',
    shortLabel: 'Chronicles',
    author: 'Eric Gans',
    description: "Eric Gans's weekly column on culture, desire, and the originary hypothesis — published every week from 1996 to 2019. An essential running commentary on contemporary thought through the lens of Generative Anthropology.",
    dot: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    ring: 'hover:ring-2 hover:ring-amber-300 dark:hover:ring-amber-700',
    accent: 'border-l-4 border-amber-400',
  },
  {
    slug: 'ap',
    label: 'Anthropoetics Journal',
    shortLabel: 'AP Journal',
    author: 'Van Oort, Bartlett, Dennis, Gans, and others',
    description: "The peer-reviewed journal of Generative Anthropology, founded by Eric Gans at UCLA. Published 1995–2024 (Vols 1–30), featuring essays by Van Oort, Bartlett, Dennis, Ludwigs, McKenna, Goldman, Eshelman, Gans, and others.",
    dot: 'bg-teal-400',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
    ring: 'hover:ring-2 hover:ring-teal-300 dark:hover:ring-teal-700',
    accent: 'border-l-4 border-teal-400',
  },
] as const;

const TOPIC_SHORTCUTS = [
  'the center', 'resentment', 'deferral', 'sovereignty', 'succession',
  'the sacred', 'scapegoating', 'language', 'AI', 'media', 'money',
  'power', 'originary', 'governance', 'technology',
];

const DECADE_LINKS = [
  { label: '1990s', from: 1995, to: 1999 },
  { label: '2000s', from: 2000, to: 2009 },
  { label: '2010s', from: 2010, to: 2019 },
  { label: '2020s', from: 2020, to: 2029 },
];

export default async function BrowsePage() {
  const posts = getAllPosts();

  const countsBySource = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.source] = (acc[p.source] ?? 0) + 1;
    return acc;
  }, {});

  const threadsCount = (countsBySource['reddit'] ?? 0) + (countsBySource['twitter'] ?? 0);
  const totalAll = posts.length;

  // Most recent 3 posts per source
  const recentBySource: Record<string, typeof posts> = {};
  for (const s of CORE_SOURCES) {
    if (s.slug === 'threads') {
      recentBySource['threads'] = posts
        .filter((p) => p.source === 'reddit' || p.source === 'twitter')
        .sort((a, b) => {
          if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
          return 0;
        })
        .slice(0, 3);
    } else {
      recentBySource[s.slug] = posts
        .filter((p) => p.source === s.slug)
        .sort((a, b) => {
          if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
          return 0;
        })
        .slice(0, 3);
    }
  }
  for (const s of ARCHIVE_SOURCES) {
    recentBySource[s.slug] = posts
      .filter((p) => p.source === s.slug)
      .sort((a, b) => {
        if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
        return 0;
      })
      .slice(0, 2);
  }

  return (
    <main className="max-w-5xl w-full mx-auto px-4 py-8 sm:py-12 pb-24 sm:pb-12">

      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mt-2 mb-2 text-gray-900 dark:text-white">Archive</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          {totalAll.toLocaleString()} texts across 7 venues — browse by source, topic, or year
        </p>
        {/* Utility links */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <Link href="/browse/all" className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            All chronologically
          </Link>
          <span className="text-gray-200 dark:text-gray-800">·</span>
          <Link href="/search" className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Full-text search
          </Link>
          <span className="text-gray-200 dark:text-gray-800">·</span>
          <Link href="/concepts?view=glossary" className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Glossary
          </Link>
          <span className="text-gray-200 dark:text-gray-800">·</span>
          <Link href="/reading-list" className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            Reading list
          </Link>
          <span className="text-gray-200 dark:text-gray-800">·</span>
          <Link href="/download" className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download corpus
          </Link>
        </div>
      </div>

      {/* ── Browse by topic ── */}
      <section className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Browse by topic</p>
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 min-w-max flex-wrap sm:flex-nowrap">
            {TOPIC_SHORTCUTS.map((topic) => (
              <Link
                key={topic}
                href={`/search?q=${encodeURIComponent(topic)}`}
                className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all whitespace-nowrap bg-white dark:bg-gray-900"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by decade ── */}
      <section className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Browse by decade</p>
        <div className="grid grid-cols-4 gap-2">
          {DECADE_LINKS.map(({ label, from, to }) => (
            <Link
              key={label}
              href={`/browse/all?from=${from}&to=${to}`}
              className="flex flex-col items-center justify-center py-3 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all text-center group"
            >
              <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{label}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5 font-mono">{from}–{to}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Browse by source — core ── */}
      <section className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Browse by source</p>
        <div className="space-y-3">
          {CORE_SOURCES.map((source) => {
            const count = source.slug === 'threads' ? threadsCount : (countsBySource[source.slug] ?? 0);
            const recent = recentBySource[source.slug] ?? [];

            return (
              <Link
                key={source.slug}
                href={`/browse/${source.slug}`}
                className={`group block rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all overflow-hidden ${source.ring}`}
              >
                <div className={`${source.accent} pl-4 pr-5 py-4 sm:py-5`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${source.dot}`} />
                        <span className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {source.label}
                        </span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${source.badge}`}>
                          {count.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">{source.author}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                        {source.description}
                      </p>

                      {/* Recent post titles */}
                      {recent.length > 0 && (
                        <div className="mt-3 space-y-0.5">
                          {recent.map((post) => (
                            <div key={post.slug} className="flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
                              <span className="text-xs text-gray-500 dark:text-gray-400 truncate leading-relaxed">
                                {post.title}
                              </span>
                              {post.date && (
                                <span className="text-[10px] text-gray-300 dark:text-gray-700 flex-shrink-0 tabular-nums ml-auto">
                                  {post.date.match(/\b(19|20)\d{2}\b/)?.[0] ?? ''}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Arrow */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 dark:text-gray-700 group-hover:text-gray-500 dark:group-hover:text-gray-400 flex-shrink-0 mt-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Archives ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500">Archives</p>
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          <p className="text-[10px] text-gray-400 dark:text-gray-600">Not shown in search by default</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {ARCHIVE_SOURCES.map((source) => {
            const count = countsBySource[source.slug] ?? 0;
            const recent = recentBySource[source.slug] ?? [];

            return (
              <Link
                key={source.slug}
                href={`/browse/${source.slug}`}
                className={`group block rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all overflow-hidden ${source.ring}`}
              >
                <div className={`${source.accent} pl-4 pr-4 py-4`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${source.dot}`} />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                          {source.shortLabel}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${source.badge}`}>
                          {count.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-1.5">{source.author}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                        {source.description}
                      </p>
                      {recent.length > 0 && (
                        <div className="mt-2 space-y-0.5">
                          {recent.map((post) => (
                            <div key={post.slug} className="flex items-center gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
                              <span className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{post.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 dark:text-gray-700 group-hover:text-gray-400 dark:group-hover:text-gray-500 flex-shrink-0 mt-0.5 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </main>
  );
}
