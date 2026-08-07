import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Here — Center Study in 10 Minutes',
  description:
    'The quick on-ramp to Center Study: what it is in one paragraph, the lineage it descends from, starter questions with reviewed answers, and topic doors into a corpus of 1,900+ texts. For the full essay-length introduction, see /intro.',
};

// Clickable starter questions — each links to a human-reviewed, quote-verified
// static answer (instant, no LLM burn) rather than firing a fresh generation.
const ASK = [
  { q: 'What is the originary hypothesis?', slug: 'what-is-the-originary-hypothesis' },
  { q: 'How is Center Study different from René Girard?', slug: 'center-study-vs-girard' },
  { q: 'What does “the center” actually mean?', slug: 'what-does-the-center-mean' },
];

// Topic doors — each runs a search across the corpus.
const INTERESTS = [
  { label: 'Language & the sign', q: 'the originary scene' },
  { label: 'AI & data', q: 'artificial intelligence data' },
  { label: 'Money & value', q: 'money debt to the center' },
  { label: 'Sovereignty & succession', q: 'sovereignty succession' },
  { label: 'Religion & the sacred', q: 'the sacred' },
  { label: 'Resentment', q: 'resentment victimary' },
];

// Deliberately three: the funnel's next steps. Concepts, Browse, and Reading
// Paths live in the nav and on /guide — this grid is not a second site map.
const MORE = [
  { href: '/intro', label: 'The full Introduction', desc: 'The long-form, in-depth read — the whole picture in one essay.' },
  { href: '/lectures', label: 'Lecture series', desc: 'Five short introductory lectures, in order.' },
];

const sectionLabel = 'text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3';
const linkCls = 'text-blue-600 dark:text-blue-400 hover:underline';

export default function StartPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
        Start Here
      </h1>
      {/* Introduction — owner's practical/ambition framing (companies, prediction markets, currencies, civilization), hyperlinked */}
      <section className="mb-12">
        <div
          className="text-gray-700 dark:text-gray-300 space-y-5 max-w-2xl"
          style={{ fontFamily: 'var(--prose-font-family)', fontSize: '17px', lineHeight: 1.8 }}
        >
          <p>
            Center Study branches off from René Girard&rsquo;s Mimetic Theory and Eric
            Gans&rsquo;s <Link href="/generative-anthropology" className={linkCls}>Generative Anthropology</Link> to create a
            new discipline grounded in the{' '}
            <Link href="/guide/concepts/originary-scene" className={linkCls}>Originary Hypothesis</Link>: the
            hypothetical origin of humanity in the{' '}
            <Link href="/guide/concepts/deferral" className={linkCls}>deferral of violence</Link> via
            representation (language).
          </p>
        </div>
      </section>

      {/* Read this next — the lineage tells the descent in the authors' own
          words; the clearest single next step for a newcomer. */}
      <section className="mb-10">
        <p className={sectionLabel}>Read this next</p>
        <Link
          href="/lineage"
          className="group block p-4 rounded-xl border border-gray-900 dark:border-gray-200 bg-gray-900 dark:bg-gray-900 hover:opacity-90 transition-opacity"
        >
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1 font-mono uppercase tracking-widest">The Lineage</p>
          <p className="font-semibold text-white leading-snug group-hover:text-blue-300 dark:group-hover:text-blue-400 transition-colors">
            Girard → Gans → Katz
          </p>
          <p className="text-sm text-gray-300 dark:text-gray-400 mt-1 leading-relaxed">
            Where Center Study comes from, told in passages drawn directly from the texts — mimesis, the originary scene, the center.
          </p>
        </Link>
      </section>

      {/* Or just ask */}
      <section className="mb-10">
        <p className={sectionLabel}>Or just ask</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
          Put any question to the whole corpus — you get a synthesized answer grounded in direct quotes.
        </p>
        <div className="flex flex-wrap gap-2">
          {ASK.map(({ q, slug }) => (
            <Link
              key={slug}
              href={`/ask/${slug}`}
              className="text-sm px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {q}
            </Link>
          ))}
          <Link
            href="/ask"
            className="text-sm px-3 py-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:opacity-90 transition-opacity"
          >
            Ask anything →
          </Link>
        </div>
      </section>

      {/* Or follow an interest */}
      <section className="mb-12">
        <p className={sectionLabel}>Or follow an interest</p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((t) => (
            <Link
              key={t.label}
              href={`/search?q=${encodeURIComponent(t.q)}`}
              className="text-sm px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </section>

      {/* For the skeptical — after the reader has seen what to read and ask */}
      <section className="mb-10">
        <Link
          href="/faq"
          className="group flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
        >
          <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <span className="font-semibold text-gray-900 dark:text-white">New, or skeptical?</span> The
            FAQ takes the common questions and objections head-on — is it falsifiable, how does it differ
            from Girard and GA, and more.
          </span>
          <span className="text-xs font-medium text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0">
            FAQ →
          </span>
        </Link>
      </section>

      {/* Everything else */}
      <section className="mb-12">
        <p className={sectionLabel}>Go deeper</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {MORE.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
            >
              <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{m.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{m.desc}</p>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
