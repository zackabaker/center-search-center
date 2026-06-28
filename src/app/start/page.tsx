import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Here | Center Study Center',
  description:
    'New to Center Study? The grounding diagnosis and the theoretical spine in eight claims — in Adam Katz’s own words — then the ways into the archive: an essay to read, a question to ask, a topic to follow.',
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

// The minimum theoretical spine — eight claims, grounded in Adam's verbiage
// (quotes verified verbatim against the corpus), each linking into the archive.
const SPINE = [
  {
    claim: 'Language is the deferral of violence through representation.',
    gloss: 'The originary hypothesis: the sign begins as an aborted gesture of appropriation that defers conflict — and every institution is an extension of that originary deferral.',
    href: '/post/the-discourse-of-the-center', source: 'The Discourse of the Center',
  },
  {
    claim: 'The juridical is the irreducibly-human space.',
    gloss: 'Poised between ritual (the originary form) and the disciplinary (the experimental form). Every event is implicitly juridical — composable as claimants before a tribunal.',
    href: '/post/on-the-juridical-disciplinary-line', source: 'On the Juridical/Disciplinary Line',
  },
  {
    claim: 'Singularized succession in perpetuity is the only legitimate measure of governance.',
    gloss: 'Adam puts it flatly —',
    quote: '“there is nothing more to governance than singularized succession in perpetuity”',
    tail: '; consent, natural right, and the common good are subsumed under it or merely apotropaic.',
    href: '/post/nomos-and-transfer-translation', source: 'Nomos and Transfer Translation',
  },
  {
    claim: 'Power is centered ordinality, exercised through judgments.',
    quote: '“You have power insofar as, and to the degree that, contending parties bring their grievances, counter-grievances and defenses to you rather than resort or revert to the vendetta.”',
    href: '/post/a-new-model-of-power', source: 'A New Model of Power',
  },
  {
    claim: 'Credit and succession are the master pair.',
    gloss: 'The economic primitive is the debt to the center; the political primitive is succession — the same thing seen from different angles.',
    href: '/post/credit-and-succession', source: 'Credit and Succession',
  },
  {
    claim: 'Data is the new substrate of property, order, and wealth.',
    gloss: 'Money is already data, and data exchange is replacing monetary exchange:',
    quote: '“all that would need to be done here is make the provision of security real and commensurate to the data taken.”',
    href: '/post/data-exchange', source: 'Data Exchange',
  },
  {
    claim: 'Resentment is monetarily measurable through the juridical.',
    gloss: 'A settlement is an exact measure of resentment —',
    quote: '“$250,000 settles my resentment” gives us an exact measure',
    tail: ' — turning the juridical into a site of knowledge production rather than vague ethics-and-morals talk.',
    href: '/post/nomos-class-action', source: 'Nomos/Class Action',
  },
  {
    claim: 'The Theseus Ship anti-revolution.',
    gloss: 'Complete institutional transformation through linguistic drift — conducted explicitly, plank by plank, without revolution and without anyone particularly noticing.',
    href: '/post/the-theseus-ship-anti-revolution', source: 'The Theseus Ship Anti-Revolution',
  },
] as const;

const sectionLabel = 'text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3';

export default function StartPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">New here</p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
        Start here
      </h1>
      <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3 max-w-2xl">
        Center Study is <em>originary hypothesizing</em> — Adam Katz&rsquo;s extension of the originary
        hypothesis into a complete, practical apparatus for reading any order, from language to money
        to the state to the algorithm, as the holding of a <em>center</em>.
      </p>
      <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-2xl">
        It diagnoses the present as a crisis in the institutions that defer violence — and it is built
        to do something about it. The whole apparatus is worked out across the archive; its minimum
        spine is eight claims.
      </p>

      {/* The theoretical ground — the minimum spine, grounded in Adam’s verbiage */}
      <section className="mb-10 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-5 sm:p-6">
        <p className={sectionLabel}>The theoretical ground — the minimum spine</p>
        <ol className="space-y-4">
          {SPINE.map((s, i) => (
            <li key={s.href} className="flex gap-3 sm:gap-4">
              <span className="font-mono text-sm text-gray-300 dark:text-gray-600 pt-1 flex-shrink-0 w-4 text-right tabular-nums">{i + 1}</span>
              <p
                className="text-gray-700 dark:text-gray-300 min-w-0"
                style={{ fontFamily: 'var(--prose-font-family)', fontSize: '16px', lineHeight: 1.7 }}
              >
                <strong className="text-gray-900 dark:text-white">{s.claim}</strong>{' '}
                {'gloss' in s && s.gloss ? <>{s.gloss} </> : null}
                {'quote' in s && s.quote ? <em className="text-gray-600 dark:text-gray-400">{s.quote}</em> : null}
                {'tail' in s && s.tail ? <>{s.tail}</> : null}{' '}
                <Link href={s.href} className="text-blue-600 dark:text-blue-400 hover:underline" style={{ fontSize: '14px' }}>
                  {s.source} →
                </Link>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-2xl leading-relaxed">
        That&rsquo;s the ground. Here are the ways into the archive:
      </p>

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
