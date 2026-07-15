import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublicPosts } from '@/lib/parser';
import SceneMark from '@/components/SceneMark';

const AMAZON = 'https://www.amazon.com/Anthropomorphics-Originary-Grammar-Dennis-Bouvard/dp/0648690571';
const FULL_TEXT_SLUG = 'anthropomorphics-book'; // the single-page complete text
const TITLE = 'Anthropomorphics: An Originary Grammar of the Center';

export const metadata: Metadata = {
  title: 'Anthropomorphics — the book',
  description:
    'Anthropomorphics: An Originary Grammar of the Center, by Dennis Bouvard (Adam Katz), Imperium Press, 2020. Read all chapters, cite the edition, or download the full text.',
  alternates: { canonical: 'https://center.study/anthropomorphics' },
};

export default function AnthropomorphicsPage() {
  // Chapters in reading order (posts-cache order is the book's own order);
  // the single-page full text is offered separately, not as a chapter.
  const chapters = getPublicPosts().filter(
    (p) => p.source === 'book' && p.slug !== FULL_TEXT_SLUG
  );

  const bookJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: TITLE,
    author: { '@type': 'Person', name: 'Adam Katz', alternateName: 'Dennis Bouvard' },
    inLanguage: 'en',
    datePublished: '2020',
    publisher: { '@type': 'Organization', name: 'Imperium Press' },
    isbn: '9780648690573',
    url: 'https://center.study/anthropomorphics',
    sameAs: AMAZON,
    numberOfPages: undefined,
    hasPart: chapters.map((c, i) => ({
      '@type': 'Chapter',
      position: i + 1,
      name: c.title,
      url: `https://center.study/post/${c.slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://center.study' },
      { '@type': 'ListItem', position: 2, name: 'Anthropomorphics', item: 'https://center.study/anthropomorphics' },
    ],
  };

  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }} />

      <Link href="/" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
        ← Home
      </Link>

      {/* Title block */}
      <header className="mt-6 mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">The book</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-gray-900 dark:text-white">
          Anthropomorphics
        </h1>
        <p className="font-serif text-xl text-gray-600 dark:text-gray-300 italic mt-1">
          An Originary Grammar of the Center
        </p>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-4">
          by Dennis Bouvard <span className="text-gray-400 dark:text-gray-500">(Adam Katz)</span> · Imperium Press, 2020
        </p>
        <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed mt-5 max-w-2xl">
          The most complete statement of Center Study — twenty-two chapters that build the
          originary grammar of the center from the ground up. Every chapter is here in full;
          the vocabulary it introduces is threaded into the{' '}
          <Link href="/concepts" className="text-blue-600 dark:text-blue-400 hover:underline">concepts and glossary</Link>.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <Link
            href={`/post/${chapters[0]?.slug ?? FULL_TEXT_SLUG}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Start reading →
          </Link>
          <Link
            href={`/post/${FULL_TEXT_SLUG}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            Full text, one page
          </Link>
          <Link
            href="/download"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            Download
          </Link>
          <a
            href={AMAZON}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Buy the print edition ↗
          </a>
        </div>
      </header>

      <div className="flex items-center gap-3 mb-8">
        <SceneMark size={13} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
        <div className="flex-1 border-t border-gray-100 dark:border-gray-800" />
      </div>

      {/* Table of contents */}
      <section aria-labelledby="toc">
        <h2 id="toc" className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
          Contents · {chapters.length} chapters
        </h2>
        <ol className="space-y-1">
          {chapters.map((c, i) => (
            <li key={c.slug}>
              <Link
                href={`/post/${c.slug}`}
                className="group flex items-baseline gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <span className="text-xs font-mono text-gray-400 dark:text-gray-500 tabular-nums w-6 flex-shrink-0 text-right">
                  {i + 1}
                </span>
                <span className="font-serif text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {c.title}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* How to cite */}
      <section className="mt-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40 p-5">
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">How to cite</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
          Bouvard, Dennis. <em>{TITLE}</em>. Imperium Press, 2020.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          Individual chapters carry their own citation and stable per-paragraph links — use the
          Cite button on any chapter page for BibTeX and edition details.
        </p>
      </section>
    </main>
  );
}
