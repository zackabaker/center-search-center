import HomeSearch from '@/components/HomeSearch';
import RandomPostButton from '@/components/RandomPostButton';
import Link from 'next/link';
import type { Metadata } from 'next';

// Self-canonical so indexable ?ref=/?from= variants consolidate to the root.
export const metadata: Metadata = {
  alternates: { canonical: 'https://center.study' },
};

export default function Home() {
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
            New to Center Study? Start
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


      {/* The Center of Everything — the featured introduction */}
      <div className="max-w-xl mx-auto px-4 pb-10">
        <Link
          href="/the-center-of-everything"
          className="group block p-6 sm:p-7 rounded-2xl bg-gray-900 dark:bg-gray-900 dark:border dark:border-gray-700 hover:opacity-90 transition-opacity"
        >
          <p className="text-[10px] text-gray-400 mb-2 font-mono uppercase tracking-widest">Featured</p>
          <p className="font-serif text-2xl sm:text-[1.7rem] font-bold text-white leading-tight group-hover:text-blue-300 transition-colors">
            The Center of Everything
          </p>
          <p className="text-sm text-gray-300 dark:text-gray-400 mt-2 leading-relaxed">
            The playful full introduction, stick figures included — in the style of Wait But Why.
          </p>
        </Link>
      </div>

      {/* Discover — desktop position */}
      <div className="hidden sm:block max-w-xl mx-auto px-4 pb-10">
        <RandomPostButton />
      </div>

    </main>
    </>
  );
}
