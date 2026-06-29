import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Introduction to Center Study | Center Study Center',
  description:
    'Introduction to Center Study: the originary hypothesis in brief — the origin of language, the human, and the sacred in a single scene (after Eric Gans and René Girard), what it diagnoses and prescribes, and how far it scales — then the glossary, the FAQ, and the best posts to start with.',
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

// Cultural artifacts that stage or name the originary scene — a light coda.
const ECHOES = [
  { title: 'Gospel of John 1:1', gloss: '“In the beginning was the Word” — origin, God, and the sign collapsed into a single line.', href: 'https://en.wikipedia.org/wiki/John_1:1', external: true },
  { title: 'The Beatles, “Let It Be”', gloss: 'the unresentful letting-be of the object — in Katz’s phrase, a direct line back to the scene.', href: 'https://en.wikipedia.org/wiki/Let_It_Be_(Beatles_song)', external: true },
  { title: '2001: A Space Odyssey', gloss: 'the Dawn of Man — hominids gather at a central object, desirable and dangerous, and take up the first tool.', href: 'https://en.wikipedia.org/wiki/2001:_A_Space_Odyssey_(film)', external: true },
  { title: 'Genesis — “Let there be…”', gloss: 'the pure imperative: a not-yet-existing world commanded into being.', href: '/post/why-the-law-is-enough', external: false },
  { title: 'The myth of Prometheus', gloss: 'the origin-gift of fire and tools — and the founding violence fobbed off onto the gods.', href: '/post/event-origin-center', external: false },
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
        human back to its origin — where the origin of language proves to be the origin of the human,
        of the sacred, of everything.
      </p>
      <blockquote
        className={`${quoteClass} mb-6 max-w-2xl`}
        style={{ fontFamily: 'var(--prose-font-family)', fontSize: '15px', lineHeight: 1.7 }}
      >
        &ldquo;The originary hypothesis finds the origin of the human, of language, and of the sacred
        in a single gesture.&rdquo;
        <Link href="/post/secular-thinking" className={citeClass}>— Secular Thinking →</Link>
      </blockquote>
      <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4 max-w-2xl">
        And it is built to be used — a way of reading the social order that both diagnoses and
        prescribes, on the longest horizon imaginable:
      </p>
      <blockquote
        className={`${quoteClass} mb-10 max-w-2xl`}
        style={{ fontFamily: 'var(--prose-font-family)', fontSize: '15px', lineHeight: 1.7 }}
      >
        &ldquo;The goal of center study is to stay as close to boundary between diagnosis and
        prescription as possible on the longest timeline imaginable: to always be able to say, this is
        what everyone is already doing and here&rsquo;s how they might, given certain shifts in visible
        trajectories, do it more explicitly and accountably.&rdquo;
        <Link href="/post/hyperstitching-the-soliciting-of-the-center-and-the-prolonging-of-the-imperative" className={citeClass}>— Hyperstitching the Center →</Link>
      </blockquote>

      {/* The hypothesis in brief — provenance (Gans + Girard) + one Adam outline chunk, then a learn-more link */}
      <section className="mb-10">
        <p className={sectionLabel}>The hypothesis, in brief</p>
        <div
          className="text-gray-700 dark:text-gray-300 space-y-4"
          style={{ fontFamily: 'var(--prose-font-family)', fontSize: '16px', lineHeight: 1.75 }}
        >
          <p>
            The hypothesis is not Katz&rsquo;s own. It was advanced by Eric Gans, building on Ren&eacute;
            Girard&rsquo;s account of mimesis:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;The originary hypothesis, advanced by Eric Gans in his <em>The Origin of Language</em>{' '}
            in 1981, posits a singular event within which language, or the sign, originates.
            Gans&rsquo;s starting point is Rene Girard&rsquo;s understanding of the conflictual nature
            of mimesis: as humans are the most mimetic species, and mimesis generates rivalry because
            our model, the more we model ourselves on him, becomes our rival for the same object,
            mimesis leads to crisis, in which the continued existence of the community can be at
            stake.&rdquo;
            <Link href="/post/anthropomorphics-origin-and-hypothesis" className={citeClass}>— Origin and Hypothesis →</Link>
          </blockquote>
          <p>What breaks the crisis is not an act but a hesitation:</p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;However, within the group, some member hesitates, presumably out of something like
            terror (&lsquo;anxiety&rsquo; would not be quite right here), is seen by others to hesitate,
            and is imitated by others. The gesture indicates a renunciation, perhaps momentary (but
            that is enough), of the desired object. This, what Gans calls &lsquo;the gesture of aborted
            appropriation,&rsquo; is the first sign. The rivalrous imitation that first propels the
            group toward center and potentially cataclysmic violence is converted into a pacifying
            imitation that de-escalates the crisis; the order provided by the animal pecking order is
            replaced by an order mediated by the sign, which defers violence through representation. A
            new species is born: the human, the only species, as Gans puts it, that poses a greater
            danger to its own survival than is posed to it by anything in its environment.&rdquo;
            <Link href="/post/anthropomorphics-origin-and-hypothesis" className={citeClass}>— Origin and Hypothesis →</Link>
          </blockquote>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            That single event — the originary scene — is the whole of it; everything else unfolds from
            there. New to it? The{' '}
            <Link href="/lectures" className="text-blue-600 dark:text-blue-400 hover:underline">lectures</Link>{' '}
            and the{' '}
            <Link href="/concepts" className="text-blue-600 dark:text-blue-400 hover:underline">glossary</Link>{' '}
            walk through the scene step by step.
          </p>
        </div>
      </section>

      {/* The reach — scale + contra-liberalism + invitational close */}
      <section className="mb-10">
        <p className={sectionLabel}>The reach</p>
        <div
          className="text-gray-700 dark:text-gray-300 space-y-4"
          style={{ fontFamily: 'var(--prose-font-family)', fontSize: '16px', lineHeight: 1.75 }}
        >
          <p>
            Because it begins from the one thing every human shares, the same frame scales without
            limit. Most thinking never leaves the small group; this reads a private desire and a
            geopolitical fracture with one instrument — up to the largest scenes there are:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;But scenes directly orchestrated by the center, in collaboration with its closest
            subordinates (these being, today, the major media and tech companies), are of an entirely
            different character: these are spectacles, mass mobilizations, shows of force, sentimental
            morality plays, scapegoating rituals, and so on.&rdquo;
            <Link href="/post/scale" className={citeClass}>— Scale →</Link>
          </blockquote>
          <p>It is a way of seeing the center that liberalism, by design, cannot:</p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;Liberalism has infiltrated all institutions, but it can never completely conquer
            them because liberalism is intrinsically parasitic: it needs a center to be
            de-centered.&rdquo;
            <Link href="/post/the-counter-inquisition-gablog" className={citeClass}>— The Counter-Inquisition →</Link>
          </blockquote>
          <p>None of it asks for belief. It is an invitation:</p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;it just offers a better way of thinking things through, and thinking things through
            is best done with others.&rdquo;
            <Link href="/post/the-prospects-of-the-hypothesis" className={citeClass}>— The Prospects of the Hypothesis →</Link>
          </blockquote>
        </div>
      </section>

      {/* Echoes of the scene — cultural artifacts */}
      <section className="mb-12">
        <p className={sectionLabel}>Echoes of the scene</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed max-w-2xl">
          The scene is older than the theory; cultures have been staging it all along.
        </p>
        <ul className="space-y-3">
          {ECHOES.map((e) => (
            <li key={e.title} className="text-sm leading-relaxed">
              <a
                href={e.href}
                target={e.external ? '_blank' : undefined}
                rel={e.external ? 'noopener noreferrer' : undefined}
                className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {e.title} {e.external ? '↗' : '→'}
              </a>
              <span className="text-gray-500 dark:text-gray-400"> — {e.gloss}</span>
            </li>
          ))}
        </ul>
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
