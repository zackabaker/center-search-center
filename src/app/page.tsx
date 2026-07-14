import HomeSearch from '@/components/HomeSearch';
import RandomPostButton from '@/components/RandomPostButton';
import Link from 'next/link';
import { getAllPosts, getPublicPosts } from '@/lib/parser';
import { ARCHIVAL_SOURCES } from '@/lib/types';
import { parsePostDate } from '@/lib/dates';
import type { Metadata } from 'next';

// Self-canonical so indexable ?ref=/?from= variants consolidate to the root.
export const metadata: Metadata = {
  alternates: { canonical: 'https://center.study' },
};

// Revalidate daily — "on this day" section needs to refresh
export const revalidate = 86400;

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Substack',
  gablog: 'GABlog',
  pdf: 'Essay',
  book: 'Book',
  chronicle: 'Chronicle · Gans',
  ap: 'Anthropoetics · ref',
};

const SOURCE_COLORS: Record<string, string> = {
  substack: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  gablog:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  pdf:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  book:     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  // Reference tier — deliberately muted; color is reserved for Katz sources
  chronicle: 'bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400',
  ap:        'bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400',
};

// Curated entry points grouped by reader interest
const FEATURED_GROUPS = [
  {
    label: 'New to Center Study',
    description: 'Start here',
    posts: [
      {
        slug: 'the-discourse-of-the-center',
        title: 'The Discourse of the Center',
        source: 'gablog',
        description: 'The foundational statement: we are beings bound to the center. Everything else follows from here.',
      },
      {
        slug: 'the-prospects-of-the-hypothesis',
        title: 'The Prospects of the Hypothesis',
        source: 'substack',
        description: 'What it means to carry the originary hypothesis forward, and what kind of thinking it demands.',
      },
      {
        slug: 'the-transdisciplinarity-of-the-hypothesis',
        title: 'The Transdisciplinarity of the Hypothesis',
        source: 'substack',
        description: 'Why the originary hypothesis cuts across every discipline — and why that is not a weakness.',
      },
    ],
  },
  {
    label: 'Political Theory',
    description: 'Center, sovereignty, succession',
    posts: [
      {
        slug: 'power-and-paradox-pdf',
        title: 'Power and Paradox',
        source: 'pdf',
        description: 'The anthropology of power: how authority arises from the originary scene and cannot escape its founding paradox.',
      },
      {
        slug: 'sovereign-commands-anarchistic-demands-gablog',
        title: 'Sovereign Commands, Anarchistic Demands',
        source: 'gablog',
        description: 'The originary distinction between command and demand, and its consequences for political order.',
      },
      {
        slug: 'singularized-succession-in-perpetuity',
        title: 'Singularized Succession in Perpetuity',
        source: 'substack',
        description: 'The central political problem: how power passes without violence. Center Study\'s most urgent proposal.',
      },
    ],
  },
  {
    label: 'AI, Money, Governance',
    description: 'Contemporary applications',
    posts: [
      {
        slug: 'data-exchange',
        title: 'Data Exchange',
        source: 'substack',
        description: 'Converting assets into data: the political economy of the center in the age of AI.',
      },
      {
        slug: 'a-new-model-of-power',
        title: 'A New Model of Power',
        source: 'substack',
        description: 'A concrete proposal for new institutions grounded in the originary hypothesis.',
      },
      {
        slug: 'learncoin',
        title: 'Learncoin',
        source: 'substack',
        description: 'On AI, currency, and the anthropology of value — Center Study applied to the digital economy.',
      },
    ],
  },
];

export default function Home() {
  // "On this day" — posts published on today's month/day in any past year
  const today = new Date();
  const allPosts = getPublicPosts();

  // Katz entries lead; Gans material renders below under a labeled reference
  // subsection (the dated pool is 55% Chronicles — unpartitioned, the module
  // would wear a majority-Gans face on the Katz archive's front door).
  const onThisDayAll = allPosts.filter((p) => {
    const d = parsePostDate(p.date);
    return !!d && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  });
  let onThisDay = onThisDayAll.filter((p) => !ARCHIVAL_SOURCES.includes(p.source));
  const onThisDayRef = onThisDayAll.filter((p) => ARCHIVAL_SOURCES.includes(p.source)).slice(0, 4);

  // ~45% of days have no Katz post on the exact date, which used to leave the
  // module 100% reference-shelf — Gans leading the Katz archive's front door.
  // Fall back to Katz posts from this WEEK in past years (±3 days), labeled
  // honestly below via onThisDayIsWeek.
  const onThisDayIsWeek = onThisDay.length === 0;
  if (onThisDayIsWeek) {
    const DAY = 24 * 60 * 60 * 1000;
    onThisDay = allPosts
      .filter((p) => {
        if (ARCHIVAL_SOURCES.includes(p.source)) return false;
        const d = parsePostDate(p.date);
        if (!d) return false;
        const thisYear = new Date(today.getFullYear(), d.getMonth(), d.getDate());
        return Math.abs(thisYear.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) <= 3 * DAY;
      })
      .slice(0, 3);
  }

  // sameAs identity graph — consolidates Adam Katz / Dennis Bouvard across the web
  // and lists generativeanthropology.com as an alternate of the same project.
  // NOTE: never put anthropoetics.ucla.edu here — sameAs asserts IDENTITY, and
  // that is Gans's journal, not Katz. It is referenced from the catalog node.
  const SAMEAS = [
    'https://dennisbouvard.substack.com',
    'https://www.amazon.com/Anthropomorphics-Originary-Grammar-Dennis-Bouvard/dp/0648690571',
    'https://www.reddit.com/user/bouvard1',
    'https://x.com/centerstudy_',
    'https://www.generativeanthropology.com',
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['WebSite', 'DataCatalog'],
        '@id': 'https://center.study/#website',
        url: 'https://center.study',
        name: 'Center Study Center',
        alternateName: 'Center Study',
        description: 'The Adam Katz (Dennis Bouvard) archive — Center Study and Generative Anthropology: ~900 texts by Katz on the originary hypothesis, the center, deferral, and sovereignty, with Eric Gans\'s Chronicles of Love & Resentment and Anthropoetics included as reference material.',
        hasPart: {
          '@type': 'Collection',
          name: 'Reference: Chronicles of Love & Resentment and Anthropoetics',
          creator: { '@type': 'Person', name: 'Eric Gans', url: 'https://center.study/author/gans', sameAs: 'http://anthropoetics.ucla.edu/' },
        },
        inLanguage: 'en',
        about: {
          '@type': 'DefinedTerm',
          name: 'Generative Anthropology',
          sameAs: ['https://en.wikipedia.org/wiki/Generative_anthropology', 'https://www.generativeanthropology.com'],
        },
        creator: [{ '@id': 'https://center.study/author/katz' }],
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: 'https://center.study/search?q={search_term_string}' },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Person',
        '@id': 'https://center.study/author/katz',
        name: 'Adam Katz',
        alternateName: 'Dennis Bouvard',
        url: 'https://center.study/author/katz',
        mainEntityOfPage: 'https://center.study/author/katz',
        description: 'Originary thinker; founder of Center Study and author of Anthropomorphics and the GABlog. Writes applied work under the pen name Dennis Bouvard.',
        knowsAbout: ['Generative Anthropology', 'the originary hypothesis', 'the center', 'deferral', 'sovereignty', 'political theology'],
        sameAs: SAMEAS,
      },
      {
        '@type': 'Person',
        '@id': 'https://center.study/author/bouvard',
        name: 'Dennis Bouvard',
        alternateName: 'Adam Katz',
        url: 'https://center.study/author/bouvard',
        mainEntityOfPage: 'https://center.study/author/bouvard',
        description: 'Pen name for Adam Katz\'s applied Center Study writing on Substack.',
        sameAs: SAMEAS,
      },
      {
        '@type': 'Book',
        '@id': 'https://center.study/post/anthropomorphics-book#book',
        name: 'Anthropomorphics: An Originary Grammar of the Center',
        author: { '@id': 'https://center.study/author/bouvard' },
        url: 'https://center.study/post/anthropomorphics-book',
        sameAs: 'https://www.amazon.com/Anthropomorphics-Originary-Grammar-Dennis-Bouvard/dp/0648690571',
        inLanguage: 'en',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    <main className="min-h-screen">

      {/* Hero */}
      <header className="max-w-2xl mx-auto px-4 pt-16 pb-10 text-center">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
          Center Study Center
        </h1>

        <div className="w-10 border-t-2 border-amber-600 dark:border-amber-500 mx-auto mb-5" aria-hidden />
        <blockquote
          className="mb-6 px-2 max-w-lg mx-auto"
          style={{ fontFamily: 'var(--font-lora, Georgia, serif)' }}
        >
          {/* Upright (non-italic) serif — italic Lora is too ornate to read comfortably */}
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            &ldquo;The originary hypothesis repels the kind of initiatory revelatory &lsquo;download&rsquo; that is nevertheless the only way of understanding it&rdquo;
          </p>
        </blockquote>

        {/* Primary action for newcomers — the Start launchpad */}
        <div className="flex items-center justify-center mb-7">
          <Link
            href="/start"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
          >
            New here? Start here
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Search — directly under the CTA so it's visible on mobile too */}
        <HomeSearch />

        {/* Corpus stats */}
        <div className="flex items-center justify-center gap-3 mt-5 text-sm text-gray-400 dark:text-gray-500">
          <span>900+ texts by Katz</span>
          <span className="text-gray-200 dark:text-gray-700">·</span>
          <span>1,000+ reference texts</span>
          <span className="text-gray-200 dark:text-gray-700">·</span>
          <span>5M+ words</span>
        </div>

        {/* Discover — mobile only, just below search (favorite mobile feature) */}
        <div className="sm:hidden text-left mt-10">
          <RandomPostButton />
        </div>
      </header>


      {/* Discover — desktop position */}
      <div className="hidden sm:block max-w-xl mx-auto px-4 pb-10">
        <RandomPostButton />
      </div>

      {/* Featured posts — grouped by reader interest */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Start reading</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Curated entry points — wherever your interest already is</p>
            </div>
            <Link href="/browse" className="text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0 ml-4">
              Full archive →
            </Link>
          </div>

          <div className="space-y-10">
            {FEATURED_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {group.label}
                  </h3>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                  <span className="text-xs text-gray-400 dark:text-gray-600">{group.description}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.posts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/post/${post.slug}`}
                      className="group flex flex-col gap-3 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${SOURCE_COLORS[post.source]}`}>
                          {SOURCE_LABELS[post.source]}
                        </span>
                      </div>
                      <p className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {post.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {post.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* On this day — the one dynamic module without a canonical page of its
          own (/new and /trending carry recently-added and most-read). The
          per-source hubs and author pages live in the site footer. */}
      {(onThisDay.length > 0 || onThisDayRef.length > 0) && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {onThisDayIsWeek ? 'This week' : 'On this day'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {onThisDayIsWeek
                  ? `Published around ${today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} in past years`
                  : `Published on ${today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} in past years`}
              </p>
            </div>
            <div className="space-y-2">
              {onThisDay.map((post) => (
                <Link
                  key={post.slug}
                  href={`/post/${post.slug}`}
                  className="group flex items-center gap-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-900/50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <span className="text-xs text-gray-400 w-10 shrink-0 font-mono">
                    {post.date!.match(/\b(19|20)\d{2}\b/)?.[0] ?? ''}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${SOURCE_COLORS[post.source] || 'bg-gray-100 text-gray-600'}`}>
                    {SOURCE_LABELS[post.source] || post.source}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {post.title}
                  </span>
                </Link>
              ))}
            </div>
            {/* Reference shelf — Gans material, present but subordinate */}
            {onThisDayRef.length > 0 && (
              <div className={onThisDay.length > 0 ? 'mt-6 pt-4 border-t border-gray-100 dark:border-gray-800' : ''}>
                <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                  From the reference shelf — Eric Gans
                </p>
                <div className="space-y-1">
                  {onThisDayRef.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/post/${post.slug}`}
                      className="group flex items-center gap-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-900/50 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <span className="text-xs text-gray-400 w-10 shrink-0 font-mono">
                        {post.date!.match(/\b(19|20)\d{2}\b/)?.[0] ?? ''}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors leading-snug">
                        {post.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </main>
    </>
  );
}
