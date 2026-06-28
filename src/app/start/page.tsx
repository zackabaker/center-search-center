import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Introduction to Center Study | Center Study Center',
  description:
    'Introduction to Center Study: a brief, quote-grounded walk through the originary hypothesis — why humans imitate, how deferral founds the human, why the idea is at once simple and powerful, and what it can do — then the glossary, the FAQ, and the best posts to start with.',
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
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
        Introduction to Center Study
      </h1>
      <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4 max-w-2xl">
        Center study is a discipline grounded in the originary hypothesis: a way of tracing anything
        human back to its origin, and through that origin, to the origin of language itself. It reads
        the social order both to diagnose it and to prescribe — to name what we are already doing, so
        that we might do it more deliberately.
      </p>
      <blockquote
        className={`${quoteClass} mb-10 max-w-2xl`}
        style={{ fontFamily: 'var(--prose-font-family)', fontSize: '15px', lineHeight: 1.7 }}
      >
        &ldquo;To know something is to know its origin; even more, it is to participate in its
        origin.&rdquo;
        <Link href="/post/naming-origins-and-the-necessary-self-referentiality-of-social-order-gablog" className={citeClass}>— Naming, Origins and the Necessary Self-Referentiality of Social Order →</Link>
      </blockquote>

      {/* The originary hypothesis, briefly — explication in Adam’s own words */}
      <section className="mb-10">
        <p className={sectionLabel}>The originary hypothesis, briefly</p>
        <div
          className="text-gray-700 dark:text-gray-300 space-y-4"
          style={{ fontFamily: 'var(--prose-font-family)', fontSize: '16px', lineHeight: 1.75 }}
        >
          <p>
            It begins with the one thing humans do first, and most — we imitate. As Aristotle
            observed, it is what sets us apart:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;man differs from the other animals in that he is the most imitative and learns his
            first lessons through imitation.&rdquo;
            <Link href="/post/ap0101-schneid" className={citeClass}>— Aristotle, Poetics →</Link>
          </blockquote>
          <p>
            But the imitation that teaches us also divides us: modeling ourselves on another, we come
            to want what he wants, and the shared object turns us into rivals — a rivalry that,
            unchecked, ends in violence.
          </p>
          <p>
            At the brink of that crisis the decisive human thing happens — and it is not an act but a
            holding-back. A hand reaching for the object stops:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;The first signifier need not know what he is doing: he aborts his gesture of
            appropriation, which is to say he stops or hesitates.&rdquo;
            <Link href="/post/more-problems-in-the-concept-of-imitation" className={citeClass}>— More Problems in the Concept of Imitation →</Link>
          </blockquote>
          <p>
            That hesitation is the first sign, and the first freedom — not free will so much as{' '}
            <em>free won&rsquo;t</em>: a space of restraint, a non-instinctual attention, opened
            between us and what we want. It is at once the smallest thing and the largest:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;All that differentiates us fundamentally from the machines, and for the better, is
            deferral — the deferral of appropriation, which is the source of all human creation.&rdquo;
            <Link href="/post/brute-force-computation-and-the-debt-to-the-center" className={citeClass}>— Brute Force Computation and the Debt to the Center →</Link>
          </blockquote>
          <p>
            Everything in center study unfolds from that one scene, and it asks almost nothing of you
            to begin:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;The originary hypothesis is easily summed up in a couple of paragraphs, at most, and
            all it really assumes is that human beings are mimetic creatures.&rdquo;
            <Link href="/post/the-originary-hypothesis-in-itself" className={citeClass}>— The Originary Hypothesis in Itself →</Link>
          </blockquote>
          <p>
            From that single premise, everything human follows — which is what makes it powerful. One
            frame scales from a private desire to a geopolitical fracture, and it does not merely
            describe the order but points past its impasses:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;only the mode of thinking enabled by the originary hypothesis helps us to identify
            these problems and provides us with the means of seeking solutions or transformations that
            will &lsquo;deactivate&rsquo; what are now, in the absence of any shared ritual order,
            unsolveable problems.&rdquo;
            <Link href="/post/the-transdisciplinarity-of-the-hypothesis" className={citeClass}>— The Transdisciplinarity of the Hypothesis →</Link>
          </blockquote>
          <p>And it is meant to be taken up, not believed:</p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;it just offers a better way of thinking things through, and thinking things through
            is best done with others.&rdquo;
            <Link href="/post/the-prospects-of-the-hypothesis" className={citeClass}>— The Prospects of the Hypothesis →</Link>
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
