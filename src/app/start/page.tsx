import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Here — Center Study in 10 Minutes',
  description:
    'The quick on-ramp to Center Study: what it is in two paragraphs, four gateway texts, starter questions for the AI, and topic doors into a corpus of 1,900+ texts. For the full essay-length introduction, see /intro.',
};

// The handful of essays that make the best on-ramp.
const GATEWAY = [
  { step: '01', slug: 'anthropomorphics-origin-and-hypothesis', title: 'Origin and Hypothesis', source: 'Anthropomorphics', why: 'The founding move, stated plainly: how the aborted gesture becomes the first sign.' },
  { step: '02', slug: 'anthropomorphics-the-use-of-a-center', title: 'The Use of a Center', source: 'Anthropomorphics', why: 'What a center is — and why every social scene has one.' },
  { step: '03', slug: 'the-prospects-of-the-hypothesis', title: 'The Prospects of the Hypothesis', source: 'Substack', why: 'What the hypothesis can actually do, from individual desire to geopolitics.' },
  { step: '04', slug: 'there-is-no-economy-pdf', title: 'There Is No Economy but Only the Debt to the Center', source: 'Anthropoetics', why: 'The framework applied end to end: money read as the debt to the center.' },
];

// Clickable starter questions — /ask reads ?q and answers immediately.
const ASK = [
  'What is the originary hypothesis?',
  'How is Center Study different from René Girard?',
  'What does “the center” actually mean?',
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

const MORE = [
  { href: '/intro', label: 'The full Introduction', desc: 'The long-form, in-depth read — the whole picture in one essay.' },
  { href: '/lineage', label: 'The lineage', desc: 'Girard → Gans → Katz, told in their own words.' },
  { href: '/lectures', label: 'Lecture series', desc: 'Five short introductory lectures, in order.' },
  { href: '/guide/reading-paths', label: 'Reading paths', desc: 'Curated sequences for specific topics and fields.' },
  { href: '/concepts', label: 'Concepts & Glossary', desc: 'The vocabulary, defined with passages from the texts.' },
  { href: '/browse', label: 'Browse the archive', desc: 'All 1,900+ texts — blog, essays, the book, threads.' },
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
          <p>
            The{' '}
            <Link href="/guide/concepts/originary-scene" className={linkCls}>Originary Hypothesis</Link> is a
            source of not just ideas, but companies that sit on the boundary between the capitalist — even
            ultra-capitalist — and the no longer quite capitalist order:{' '}
            <Link href="/search?q=betting" className={linkCls}>betting</Link>,{' '}
            <Link href="/search?q=prediction%20markets" className={linkCls}>prediction markets</Link>,{' '}
            <Link href="/search?q=companies" className={linkCls}>employment agencies</Link>,{' '}
            <Link href="/post/tokenization" className={linkCls}>new currencies</Link>, investment inquiries;
            but also a space where well-being, learning, and inquiry are ends in themselves.
          </p>
          <p>
            Center Study, and those working on it and in it, are producing something like a linguistic{' '}
            &ldquo;reserve currency&rdquo; — creating new language, concepts, and terms that work as seed
            phrases for anyone interested in starting and joining companies that secure and strengthen
            civilization in the twilight of Anglo modernity.
          </p>
        </div>

        {/* FAQ highlighted right under the introduction */}
        <Link
          href="/faq"
          className="group mt-8 flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
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

      {/* If you read one thing */}
      <section className="mb-10">
        <p className={sectionLabel}>If you read one thing</p>
        <Link
          href="/post/the-discourse-of-the-center"
          className="group block p-4 rounded-xl border border-gray-900 dark:border-gray-200 bg-gray-900 dark:bg-gray-900 hover:opacity-90 transition-opacity"
        >
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1 font-mono uppercase tracking-widest">GABlog · Adam Katz</p>
          <p className="font-semibold text-white leading-snug group-hover:text-blue-300 dark:group-hover:text-blue-400 transition-colors">
            The Discourse of the Center
          </p>
          <p className="text-sm text-gray-300 dark:text-gray-400 mt-1 leading-relaxed">
            &ldquo;We are beings bound to the center.&rdquo; The clearest single-post statement of the core claim.
          </p>
        </Link>
        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:underline list-none">
            …or the four essays to begin with →
          </summary>
          <div className="space-y-2 mt-3">
            {GATEWAY.map((g) => (
              <Link
                key={g.slug}
                href={`/post/${g.slug}`}
                className="group flex gap-4 items-start p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
              >
                <span className="text-sm font-mono text-gray-300 dark:text-gray-600 pt-0.5 flex-shrink-0">{g.step}</span>
                <span className="min-w-0">
                  <span className="block font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">{g.title}</span>
                  <span className="block text-[11px] font-medium text-gray-400 dark:text-gray-500 mt-0.5">{g.source}</span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{g.why}</span>
                </span>
              </Link>
            ))}
          </div>
        </details>
      </section>

      {/* Or just ask */}
      <section className="mb-10">
        <p className={sectionLabel}>Or just ask</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
          Put any question to the whole corpus — you get a synthesized answer grounded in direct quotes.
        </p>
        <div className="flex flex-wrap gap-2">
          {ASK.map((q) => (
            <Link
              key={q}
              href={`/ask?q=${encodeURIComponent(q)}`}
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

      {/* Everything else */}
      <section className="mb-12">
        <p className={sectionLabel}>Everything else</p>
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
