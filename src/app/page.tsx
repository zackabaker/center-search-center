import HomeSearch from '@/components/HomeSearch';
import RandomPostButton from '@/components/RandomPostButton';
import WelcomeBack from '@/components/WelcomeBack';
import Link from 'next/link';
import { getAllPosts, getPublicPosts } from '@/lib/parser';

// Revalidate daily — "on this day" section needs to refresh
export const revalidate = 86400;

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Substack',
  gablog: 'GABlog',
  pdf: 'Essay',
  book: 'Book',
};

const SOURCE_COLORS: Record<string, string> = {
  substack: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  gablog:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  pdf:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  book:     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
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

const BROWSE_SOURCES = [
  { source: 'gablog',    label: 'GABlog',          description: "Katz's theoretical blog — originary grammar in development", color: 'hover:border-blue-400 dark:hover:border-blue-600',   href: '/browse/gablog' },
  { source: 'substack',  label: 'Substack',        description: "Bouvard's applied essays on AI, governance, and technology",  color: 'hover:border-orange-400 dark:hover:border-orange-600', href: '/browse/substack' },
  { source: 'pdf',       label: 'Essays & Articles', description: 'Academic papers, journal articles, and lectures',          color: 'hover:border-green-400 dark:hover:border-green-600',   href: '/browse/pdf' },
  { source: 'book',      label: 'Book',              description: 'Anthropomorphics — systematic originary grammar',            color: 'hover:border-purple-400 dark:hover:border-purple-600', href: '/browse/book' },
  { source: 'threads',   label: 'Threads & Q&A',    description: 'Reddit dialogues and X threads — applied and conversational', color: 'hover:border-violet-400 dark:hover:border-violet-600', href: '/browse/threads' },
];

export default function Home() {
  // "On this day" — posts published on today's month/day in any past year
  const today = new Date();
  const allPosts = getPublicPosts();

  const onThisDay = allPosts.filter((p) => {
    if (!p.date) return false;
    try {
      const d = new Date(p.date);
      return d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
    } catch { return false; }
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://center.study/#website',
        url: 'https://center.study',
        name: 'Center Study Center',
        description: 'Complete searchable archive of Adam Katz and Dennis Bouvard — Center Study writings.',
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
        url: 'https://center.study/author/katz',
        description: 'Originary thinker and author of Anthropomorphics and the GABlog.',
      },
      {
        '@type': 'Person',
        '@id': 'https://center.study/author/bouvard',
        name: 'Dennis Bouvard',
        alternateName: 'Adam Katz',
        url: 'https://center.study/author/bouvard',
        description: 'Pen name for Adam Katz\'s applied Center Study writing on Substack.',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* Hero */}
      <header className="max-w-2xl mx-auto px-4 pt-16 pb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-5 leading-tight">
          Center Study Center
        </h1>

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
          <span>1,900+ texts</span>
          <span className="text-gray-200 dark:text-gray-700">·</span>
          <span>5M+ words</span>
          <span className="text-gray-200 dark:text-gray-700">·</span>
          <span>1995&ndash;present</span>
        </div>

        {/* Discover — mobile only, just below search (favorite mobile feature) */}
        <div className="sm:hidden text-left mt-10">
          <RandomPostButton />
        </div>
      </header>

      {/* Returning readers: continue path / saved texts (localStorage) */}
      <WelcomeBack />

      {/* Discover — desktop position */}
      <div className="hidden sm:block max-w-xl mx-auto px-4 pb-10">
        <RandomPostButton />
      </div>

      {/* Navigation cards — desktop only. Intro & Reading Path live in the hero CTAs. */}
      <div className="hidden sm:block max-w-3xl mx-auto px-4 pb-14">
        <div className="grid grid-cols-4 gap-3">
          {[
            { href: '/ask', label: 'Ask AI', sub: 'Narrative Q&A', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> },
            { href: '/concepts', label: 'Concepts', sub: 'Key vocabulary', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /> },
            { href: '/browse', label: 'Archive', sub: '1,900+ texts', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /> },
            { href: '/download', label: 'Download', sub: 'Full corpus', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /> },
          ].map(({ href, label, sub, icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-2.5 py-5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {icon}
              </svg>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
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

      {/* Browse by source — desktop only */}
      <div className="hidden sm:block border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Browse by source</h2>
            <Link href="/author/katz" className="text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Adam Katz →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BROWSE_SOURCES.map(({ source, label, description, color, href }) => (
              <Link
                key={source}
                href={href}
                className={`group block p-5 rounded-xl border border-gray-200 dark:border-gray-700 ${color} hover:shadow-sm transition-all bg-white dark:bg-gray-900`}
              >
                <p className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5">{label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* On this day */}
      {onThisDay.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">On this day</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Published on {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} in past years
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
          </div>
        </div>
      )}

    </div>
    </>
  );
}
