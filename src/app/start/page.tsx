import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Introduction to Center Study | Center Study Center',
  description:
    'Introduction to Center Study: a transdisciplinary discourse descended from Generative Anthropology and the originary hypothesis (Eric Gans) — the origin of language, the human, and the sacred; how it reads the social order from the center; what it diagnoses and prescribes — with links to the FAQ and the best posts to start with.',
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
const quoteClass = 'border-l-2 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-300';
const citeClass = 'not-italic block mt-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline';
const linkCls = 'text-blue-600 dark:text-blue-400 hover:underline';

export default function StartPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
        Introduction to Center Study
      </h1>
      {/* Introduction — short, quote-led, heavily linked (v4): shared origin → scene → method → the center → invitation */}
      <section className="mb-12">
        <div
          className="text-gray-700 dark:text-gray-300 space-y-5 max-w-2xl"
          style={{ fontFamily: 'var(--prose-font-family)', fontSize: '17px', lineHeight: 1.8 }}
        >
          <p>
            Center Study is a{' '}
            <Link href="/post/the-transdisciplinarity-of-the-hypothesis" className={linkCls}>transdisciplinary</Link>{' '}
            discourse descended from Generative Anthropology — the study of human society and culture in
            the light of the{' '}
            <Link href="/guide/concepts/originary-scene" className={linkCls}>originary hypothesis</Link>,
            formulated by Eric Gans in{' '}
            <em><Link href="/post/the-origin-of-language" className={linkCls}>The Origin of Language</Link></em>{' '}
            (1980). It does not add one more specialty; it rethinks the human sciences from a single
            shared origin:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;If the originary hypothesis entails that all human possibilities must be implicit in,
            and therefore traceable back to, the originary scene, then it follows that Generative
            Anthropology must be the human science. And if Generative Anthropology is the human science,
            it must be both incommensurable with and inclusive of all existing human sciences.&rdquo;
            <Link href="/post/generative-anthropology-one-big-discipline" className={citeClass}>— Generative Anthropology as the One Big Discipline →</Link>
          </blockquote>
          <p>
            That origin is a{' '}
            <Link href="/guide/concepts/originary-scene" className={linkCls}>scene</Link>. At the height
            of a{' '}
            <Link href="/guide/concepts/mimesis" className={linkCls}>mimetic</Link> crisis, a hand
            reaching for the contested object falters into a gesture instead:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;This, what Gans calls &lsquo;the gesture of aborted appropriation,&rsquo; is the
            first sign. … the order provided by the animal pecking order is replaced by an order
            mediated by the sign, which defers violence through representation. A new species is born:
            the human, the only species, as Gans puts it, that poses a greater danger to its own
            survival than is posed to it by anything in its environment.&rdquo;
            <Link href="/post/anthropomorphics-origin-and-hypothesis" className={citeClass}>— Origin and Hypothesis →</Link>
          </blockquote>
          <p>
            Because everything human can be{' '}
            <Link href="/post/scale" className={linkCls}>traced back to that scene</Link>, the
            hypothesis becomes a method for reading all of human culture:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;Ultimately, originary thinking is a way of tracing all the frames it comes across
            back to their origins, and through those origins, the origin of language and
            humanity.&rdquo;
            <Link href="/post/within-language" className={citeClass}>— Within Language →</Link>
          </blockquote>
          <p>
            Where Generative Anthropology stays with the origin, Center Study keeps{' '}
            <Link href="/guide/concepts/the-center" className={linkCls}>the center</Link> at the center —
            the enduring thing every social order forms around, from the ritual altar to the sovereign
            to the state:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;We are beings bound to the center: everything that we say, think or do is homage to
            the center.&rdquo;
            <Link href="/post/the-discourse-of-the-center" className={citeClass}>— The Discourse of the Center →</Link>
          </blockquote>
          <p>
            Run anything human back to its origin and its center and you can both diagnose an order and
            prescribe for it. It asks for no belief —
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;it just offers a better way of thinking things through, and thinking things through
            is best done with others.&rdquo;
            <Link href="/post/the-prospects-of-the-hypothesis" className={citeClass}>— The Prospects of the Hypothesis →</Link>
          </blockquote>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Start anywhere: the{' '}
            <Link href="/lectures" className={linkCls}>lectures</Link> lay it out in sequence, the{' '}
            <Link href="/concepts" className={linkCls}>glossary</Link> defines the vocabulary, and the{' '}
            <Link href="/faq" className={linkCls}>FAQ</Link> takes the hard questions.
          </p>
        </div>
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
