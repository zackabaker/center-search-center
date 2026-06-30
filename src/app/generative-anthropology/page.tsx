import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublicPosts } from '@/lib/parser';

// Live corpus size, rounded down to a round number so phrasing stays honest as it grows.
const CORPUS = Math.floor(getPublicPosts().length / 100) * 100;

// Canonical "What is Generative Anthropology" surface — center.study owns the
// head term directly. Answer-first (AI-extractable), then an FAQ with FAQPage
// schema, then GA's mirrored assets (intro video, lectures, books, essays), then
// a funnel into the archive. generativeanthropology.com canonicals/redirects here.

const UPDATED = 'June 2026';
const VIDEO_ID = 'FkwR5QYyvWk'; // GA and the Originary Scene — 8-min introduction

export const metadata: Metadata = {
  title: 'What is Generative Anthropology?',
  description:
    'Generative Anthropology (GA) is Eric Gans’s theory of the origin of the human: language, the sacred, and community all begin in a single scene that defers violence through representation. The complete archive, the originary hypothesis, key thinkers, and where to read more.',
  alternates: { canonical: 'https://center.study/generative-anthropology' },
  openGraph: {
    title: 'What is Generative Anthropology?',
    description:
      'Eric Gans’s theory of the origin of the human — the originary hypothesis, the originary scene, the center, and the complete searchable archive.',
    type: 'article',
    url: 'https://center.study/generative-anthropology',
  },
};

const linkCls = 'text-blue-600 dark:text-blue-400 hover:underline';

// FAQ — answer-first, each reusable as an extractable Q&A and as FAQPage schema.
const FAQ: { q: string; a: string }[] = [
  {
    q: 'Who founded Generative Anthropology?',
    a: 'Eric Gans founded Generative Anthropology in his 1981 book The Origin of Language. It develops out of René Girard’s mimetic theory, which Gans extends with a hypothesis about the origin of the sign itself.',
  },
  {
    q: 'What is the originary hypothesis?',
    a: 'The originary hypothesis proposes that language, the human, and the sacred all originate in a single event. At the height of a mimetic crisis over a contested object, a member of the group aborts the gesture of appropriation; that withheld gesture becomes the first sign, deferring violence by representing the object instead of seizing it.',
  },
  {
    q: 'What is the originary scene?',
    a: 'The originary scene is that hypothetical first event — the minimal hinge between animal appetite and the human sign. It is not a historical claim to be excavated but a minimal hypothesis from which the structure of language, culture, and institutions can be derived.',
  },
  {
    q: 'Who are the key thinkers?',
    a: 'Eric Gans is the founder. Adam Katz develops the discipline of Center Study and, under the pen name Dennis Bouvard, its applied writing. Peter Goldman, Richard van Oort, and the contributors to the journal Anthropoetics are among the other principal figures.',
  },
  {
    q: 'What is Center Study, and how does it relate to GA?',
    a: 'Center Study is the discipline Adam Katz develops out of Generative Anthropology. It keeps the center — the shared object of attention founded on the originary scene — at the heart of every analysis, reading any social order as the engagement between a periphery and its center.',
  },
  {
    q: 'Where can I read more?',
    a: `This site is the complete searchable archive — over ${CORPUS.toLocaleString()} texts and more than five million words by Adam Katz and Dennis Bouvard, plus the foundational works. Start with the introduction, the concept glossary, the lecture series, or search the corpus directly.`,
  },
];

const sectionLabel = 'text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3';

export default function GenerativeAnthropologyPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://center.study/generative-anthropology#faq',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What is Generative Anthropology?',
    url: 'https://center.study/generative-anthropology',
    mainEntityOfPage: 'https://center.study/generative-anthropology',
    dateModified: '2026-06-29',
    author: [
      { '@type': 'Person', name: 'Adam Katz', '@id': 'https://center.study/author/katz' },
    ],
    about: {
      '@type': 'DefinedTerm',
      name: 'Generative Anthropology',
      description:
        'A theory of the origin of the human founded by Eric Gans, holding that language, the sacred, and community originate in a single scene that defers violence through representation.',
      sameAs: ['https://en.wikipedia.org/wiki/Generative_anthropology', 'https://www.generativeanthropology.com'],
    },
    isPartOf: { '@id': 'https://center.study/#website' },
    publisher: { '@type': 'Organization', name: 'Center Study Center', url: 'https://center.study' },
  };

  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }} />

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5 text-gray-900 dark:text-white">
        What is Generative Anthropology?
      </h1>

      {/* Answer-first — the extractable definition */}
      <div
        className="text-gray-700 dark:text-gray-300 space-y-4 max-w-2xl"
        style={{ fontFamily: 'var(--prose-font-family)', fontSize: '17px', lineHeight: 1.8 }}
      >
        <p>
          <strong className="text-gray-900 dark:text-white">Generative Anthropology (GA)</strong> is a
          theory of the origin and nature of the human, founded by Eric Gans in his 1981 book{' '}
          <em><Link href="/post/the-origin-of-language" className={linkCls}>The Origin of Language</Link></em>.
          Its central claim — the{' '}
          <Link href="/guide/concepts/originary-scene" className={linkCls}>originary hypothesis</Link> —
          is that language, the sacred, and human community all begin in a single event: a group&rsquo;s
          conversion of a violent grasping gesture into a{' '}
          <Link href="/guide/concepts/the-sign" className={linkCls}>sign</Link> that defers conflict by
          representing the contested object rather than seizing it. From that{' '}
          <Link href="/guide/concepts/originary-scene" className={linkCls}>originary scene</Link>, GA
          reads all of human culture as organized around a{' '}
          <Link href="/guide/concepts/the-center" className={linkCls}>center</Link>.
        </p>
        <p>
          <Link href="/start" className={linkCls}>Center Study</Link> is the discipline developed by{' '}
          <Link href="/author/katz" className={linkCls}>Adam Katz</Link> — who also writes as{' '}
          <Link href="/author/bouvard" className={linkCls}>Dennis Bouvard</Link> — that extends GA by
          keeping the center at the heart of every analysis. This site is the complete searchable
          archive of that work.
        </p>
      </div>

      {/* Video — mirrored from generativeanthropology.com */}
      <section className="mt-10">
        <p className={sectionLabel}>A short introduction</p>
        <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700" style={{ aspectRatio: '16 / 9' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
            title="Generative Anthropology and the Originary Scene"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          GA and the originary scene (8 min). For the longer treatment, hear the{' '}
          <Link href="/lectures" className={linkCls}>lecture series</Link>.
        </p>
      </section>

      {/* FAQ — answer-first Q&A, mirrored as FAQPage schema */}
      <section className="mt-12">
        <p className={sectionLabel}>Frequently asked</p>
        <div className="space-y-6">
          {FAQ.map((f) => (
            <div key={f.q}>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-1.5">{f.q}</h2>
              <p
                className="text-gray-700 dark:text-gray-300"
                style={{ fontFamily: 'var(--prose-font-family)', fontSize: '16px', lineHeight: 1.7 }}
              >
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The texts — books + foundational essays */}
      <section className="mt-12">
        <p className={sectionLabel}>The texts</p>
        <ul className="space-y-2.5 text-[15px] leading-relaxed">
          <li>
            <Link href="/post/the-origin-of-language" className={`font-medium ${linkCls}`}>The Origin of Language</Link>
            <span className="text-gray-500 dark:text-gray-400"> — Eric Gans (1981; new edition 2019), the founding text. </span>
            <a href="https://www.amazon.com/Origin-Language-New-Eric-Gans/dp/1949966135/" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Amazon ↗</a>
          </li>
          <li>
            <Link href="/post/anthropomorphics-book" className={`font-medium ${linkCls}`}>Anthropomorphics: An Originary Grammar of the Center</Link>
            <span className="text-gray-500 dark:text-gray-400"> — Dennis Bouvard. </span>
            <a href="https://www.amazon.com/Anthropomorphics-Originary-Grammar-Dennis-Bouvard/dp/0648690571" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Amazon ↗</a>
          </li>
          <li>
            <Link href="/post/why-generative-anthropology" className={`font-medium ${linkCls}`}>Why Generative Anthropology?</Link>
            <span className="text-gray-500 dark:text-gray-400"> — Peter Goldman&rsquo;s introduction to the field.</span>
          </li>
          <li>
            <Link href="/post/the-originary-hypothesis-in-itself" className={`font-medium ${linkCls}`}>The Originary Hypothesis in Itself</Link>
            <span className="text-gray-500 dark:text-gray-400"> — Dennis Bouvard, the hypothesis stated minimally.</span>
          </li>
          <li>
            <a href="https://dennisbouvard.substack.com" target="_blank" rel="noopener noreferrer" className={`font-medium ${linkCls}`}>Dennis Bouvard on Substack ↗</a>
            <span className="text-gray-500 dark:text-gray-400"> — the ongoing applied writing (mirrored in the archive).</span>
          </li>
        </ul>
      </section>

      {/* Funnel into the archive */}
      <section className="mt-12">
        <p className={sectionLabel}>Explore the archive</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { href: '/start', label: 'Introduction to Center Study', desc: 'The discipline, its lineage, and what it can do.' },
            { href: '/concepts', label: 'Concepts & Glossary', desc: 'Every key term, defined in the texts’ own words.' },
            { href: '/search', label: 'Search the corpus', desc: `Keyword and meaning search across ${CORPUS.toLocaleString()}+ texts.` },
            { href: '/download', label: 'Download the full corpus', desc: 'The complete archive as JSON and plain text.' },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
              <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{c.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-12">Last updated {UPDATED}.</p>
    </main>
  );
}
