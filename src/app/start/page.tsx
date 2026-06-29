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
      {/* Introduction (v7): lineage (Girard→Gans→CS) → what it is (diagnosis/prescription) → method → the center → user-selected implications montage */}
      <section className="mb-12">
        <div
          className="text-gray-700 dark:text-gray-300 space-y-5 max-w-2xl"
          style={{ fontFamily: 'var(--prose-font-family)', fontSize: '17px', lineHeight: 1.8 }}
        >
          <p>
            Center Study is a{' '}
            <Link href="/post/the-transdisciplinarity-of-the-hypothesis" className={linkCls}>transdisciplinary</Link>{' '}
            discourse. It descends from René Girard&rsquo;s account of mimetic desire and Eric
            Gans&rsquo;s discovery — or invention — of the{' '}
            <Link href="/guide/concepts/originary-scene" className={linkCls}>originary hypothesis</Link>,
            that language and the human begin together in a singular event. Center Study radicalizes it,
            pulling the whole articulation toward{' '}
            <Link href="/guide/concepts/the-center" className={linkCls}>the center</Link>.
          </p>
          <p>
            That, put plainly, is the work — a discipline poised at the seam between diagnosing an order
            and prescribing for it, on the longest horizon there is:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;The goal of center study is to stay as close to boundary between diagnosis and
            prescription as possible on the longest timeline imaginable: to always be able to say, this
            is what everyone is already doing and here&rsquo;s how they might, given certain shifts in
            visible trajectories, do it more explicitly and accountably.&rdquo;
            <Link href="/post/hyperstitching-the-soliciting-of-the-center-and-the-prolonging-of-the-imperative" className={citeClass}>— Hyperstitching the Center →</Link>
          </blockquote>
          <p>Its method is to trace anything human back to where it begins —</p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;originary thinking is a way of tracing all the frames it comes across back to their
            origins, and through those origins, the origin of language and humanity.&rdquo;
            <Link href="/post/within-language" className={citeClass}>— Within Language →</Link>
          </blockquote>
          <p>— and what it keeps finding there is the center:</p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;We are beings bound to the center: everything that we say, think or do is homage to
            the center.&rdquo;
            <Link href="/post/the-discourse-of-the-center" className={citeClass}>— The Discourse of the Center →</Link>
          </blockquote>
          <p>
            From there the implications run far — across{' '}
            <Link href="/search?q=prediction%20markets" className={linkCls}>prediction markets</Link>,{' '}
            <Link href="/post/tokenization" className={linkCls}>currencies</Link>,{' '}
            <Link href="/post/there-is-no-economy-pdf" className={linkCls}>derivatives</Link>,{' '}
            <Link href="/search?q=capital%20markets" className={linkCls}>capital markets</Link>,{' '}
            <Link href="/post/idiomatic-intelligence-and-the-black-box" className={linkCls}>artificial intelligence</Link>,{' '}
            <Link href="/search?q=institutional%20design" className={linkCls}>institutional design</Link>, and{' '}
            <Link href="/post/securing-sovereignty" className={linkCls}>meta-politics</Link> — and its
            diagnoses are not cautious:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;There is no &lsquo;economy.&rsquo; There is only, as there always has been, ritual
            distribution from the center.&rdquo;
            <Link href="/post/will-have-been-the-same-future-perfectism-or-derivatives-of-the-tributary" className={citeClass}>— Derivatives of the Tributary →</Link>
          </blockquote>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;The space of the derivative is the true capitalist church.&rdquo;
            <Link href="/post/there-is-no-economy-pdf" className={citeClass}>— There Is No Economy but Only the Debt to the Center →</Link>
          </blockquote>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;Questions of money are ultimately questions of sovereignty&hellip;&rdquo;
            <Link href="/post/options-on-succession" className={citeClass}>— Options on Succession →</Link>
          </blockquote>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;Sovereignty is always passed off—to be sovereign is to decide upon one&rsquo;s
            successor.&rdquo;
            <Link href="/post/securing-sovereignty" className={citeClass}>— Securing Sovereignty →</Link>
          </blockquote>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;All that differentiates us fundamentally from the machines, and for the better, is
            deferral—the deferral of appropriation, which is the source of all human creation.&rdquo;
            <Link href="/post/brute-force-computation-and-the-debt-to-the-center" className={citeClass}>— Brute Force Computation and the Debt to the Center →</Link>
          </blockquote>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Start anywhere: the{' '}
            <Link href="/lectures" className={linkCls}>lectures</Link>, the{' '}
            <Link href="/concepts" className={linkCls}>glossary</Link>, the{' '}
            <Link href="/faq" className={linkCls}>FAQ</Link>.
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
