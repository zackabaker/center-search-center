import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Here | Center Study Center',
  description:
    'New to Center Study? A brief explication of the originary hypothesis in Adam Katz’s own words — mimesis, the sign, the center, and what it can do — then the ways into the archive: the glossary, the FAQ, and the best posts to start with.',
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

export default function StartPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">New here</p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
        Start here
      </h1>
      <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-2xl">
        Center Study is Adam Katz&rsquo;s practical science of the human — worked out across this
        archive, and built on a single hypothesis about where language, and everything language makes
        possible, comes from.
      </p>

      {/* The originary hypothesis, briefly — explication in Adam’s own words */}
      <section className="mb-10">
        <p className={sectionLabel}>The originary hypothesis, briefly</p>
        <div
          className="text-gray-700 dark:text-gray-300 space-y-4"
          style={{ fontFamily: 'var(--prose-font-family)', fontSize: '16px', lineHeight: 1.75 }}
        >
          <p>
            It starts with <em>mimesis</em>. We imitate one another, and imitation breeds rivalry — we
            come to want a thing because someone we model ourselves on wants it. Pushed far enough,
            that turns into crisis:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;mimesis generates rivalry because our model, the more we model ourselves on him,
            becomes our rival for the same object, mimesis leads to crisis.&rdquo;
            <Link href="/post/anthropomorphics-origin-and-hypothesis" className={citeClass}>— Origin and Hypothesis →</Link>
          </blockquote>
          <p>
            At the edge of that crisis the first <em>sign</em> appears — a grasp held back, a gesture
            that points to the object instead of seizing it. The sign defers the violence by
            representing what everyone wants, and in the same stroke it opens a shared <em>center</em>:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;the sign creates the center through deferral, and it is a center that could always be
            decentered — by another center.&rdquo;
            <Link href="/post/generative-anthropology-one-big-discipline" className={citeClass}>— Generative Anthropology as the One Big Discipline →</Link>
          </blockquote>
          <p>
            That is the originary hypothesis in a line — <em>the sign, which defers violence through
            representation</em>. Every institution that follows, from ritual to money to law, is a way
            of keeping that deferral going.
          </p>
          <p>Katz works the hypothesis in two directions at once, and they are two sides of one coin:</p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;Center study assumes that any tracing of any idiom to its possibility and emergence
            will lead us back to the originary hypothesis, while anthropomorphics assumes that the
            originary hypothesis can only find its proof of work and concept in the jarring of an
            idiom.&rdquo;
            <Link href="/post/idiom-and-the-differend" className={citeClass}>— Idiom and the Differend →</Link>
          </blockquote>
          <p>
            Center study reasons from anything — a word, an institution, a crisis — back to the origin;
            anthropomorphics,{' '}
            <Link href="/post/deferral-and-appropriation-property-and-the-center" className="text-blue-600 dark:text-blue-400 hover:underline">&ldquo;the constitution of the human through signs,&rdquo;</Link>{' '}
            carries the origin forward into new idioms.
          </p>
          <p>
            And none of it is a creed to accept. It is a working instrument, kept deliberately at the
            seam between describing the world and acting on it:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;The goal of center study is to stay as close to boundary between diagnosis and
            prescription as possible on the longest timeline imaginable: to always be able to say, this
            is what everyone is already doing and here&rsquo;s how they might&hellip; do it more
            explicitly.&rdquo;
            <Link href="/post/hyperstitching-the-soliciting-of-the-center-and-the-prolonging-of-the-imperative" className={citeClass}>— Hyperstitching the Center →</Link>
          </blockquote>
        </div>
      </section>

      {/* Read further — glossary + FAQ; best intro posts follow below */}
      <section className="mb-12">
        <p className={sectionLabel}>Read further</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
          The glossary defines the vocabulary straight from the texts; the FAQ takes the harder
          questions head-on.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/concepts" className="text-sm px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Concepts &amp; Glossary</Link>
          <Link href="/faq" className="text-sm px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">FAQ</Link>
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

      {/* Honest note */}
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-6">
        A note for newcomers: Center Study is a living discourse, not a finished doctrine, and its
        vocabulary is technical — it rewards patience. You don&rsquo;t have to read in order; start where
        it grabs you and read back into the foundations as you go. Snagged on an objection? The{' '}
        <Link href="/faq" className="text-blue-600 dark:text-blue-400 hover:underline">FAQ</Link>{' '}
        answers the common ones.
      </p>
    </main>
  );
}
