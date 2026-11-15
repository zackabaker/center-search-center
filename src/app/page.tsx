import HomeSearch from '@/components/HomeSearch';
import RotatingEpigraph from '@/components/RotatingEpigraph';
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
        <h1 className="font-serif text-[2.75rem] sm:text-6xl font-medium text-gray-900 dark:text-white mb-7 leading-[1.04] tracking-tight">
          Center Study Center
        </h1>

        <RotatingEpigraph />

        {/* Search — directly under the epigraph so it's visible on mobile too */}
        <HomeSearch />

        {/* Start here — the three ways in for a newcomer, as a ruled list.
            Replaces the single "Getting started" button (its first row). */}
        <nav aria-label="Start here" className="text-left mt-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-900 dark:text-gray-100 mb-2">
            Start here
          </h2>
          <Link
            href="/begin"
            className="group flex flex-col gap-0.5 py-3.5 border-t border-gray-900 dark:border-gray-200"
          >
            <span className="font-serif text-[1.375rem] leading-[1.2] font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Getting started
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              The introduction, then a reading path built for you
            </span>
          </Link>
          <Link
            href="/intro-center-study-zack-baker"
            className="group flex flex-col gap-0.5 py-3.5 border-t border-gray-200 dark:border-gray-700"
          >
            <span className="font-serif text-[1.375rem] leading-[1.2] font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Introduction to Center Study
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Zack Baker&rsquo;s talk at the Avalon Institute, slides and transcript
            </span>
          </Link>
          <Link
            href="/concepts"
            className="group flex flex-col gap-0.5 py-3.5 border-y border-gray-200 dark:border-gray-700"
          >
            <span className="font-serif text-[1.375rem] leading-[1.2] font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Concepts
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              The vocabulary, each term defined in the author&rsquo;s own words
            </span>
          </Link>
        </nav>

        {/* Discover — mobile only, just below search (favorite mobile feature) */}
        <div className="sm:hidden text-left mt-10">
          <RandomPostButton />
        </div>
      </header>



      {/* Discover — desktop position */}
      <div className="hidden sm:block max-w-xl mx-auto px-4 pb-10">
        <RandomPostButton />
      </div>

    </main>
    </>
  );
}
