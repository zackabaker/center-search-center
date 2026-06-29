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
      {/* Introduction — synthesized: approachable + rigorous + hyperlinked, the three quotes woven in */}
      <section className="mb-12">
        <div
          className="text-gray-700 dark:text-gray-300 space-y-5 max-w-2xl"
          style={{ fontFamily: 'var(--prose-font-family)', fontSize: '17px', lineHeight: 1.8 }}
        >
          <p>
            Center Study is a transdisciplinary discourse: it does not so much add a perspective to
            anthropology, linguistics, politics, religion, and economics as ask all of them to begin
            again from a single event. It branches off from Generative Anthropology — the study of
            human society and culture in the light of the{' '}
            <Link href="/guide/concepts/originary-scene" className={linkCls}>originary hypothesis</Link>,
            formulated by Eric Gans in{' '}
            <em><Link href="/post/the-origin-of-language" className={linkCls}>The Origin of Language</Link></em>{' '}
            (1980; new edition 2019). That hypothesis holds that the origin of language is, in the same
            stroke, the origin of the human and of{' '}
            <Link href="/guide/concepts/the-sacred" className={linkCls}>the sacred</Link>. To see why
            one event could be all three at once is to see what is at stake in the whole project.
          </p>
          <p>
            The stakes come into focus against a habit so deep we rarely notice it. As Adam
            Katz&rsquo;s{' '}
            <Link href="/post/the-origin-of-language" className={linkCls}>introduction to the book</Link>{' '}
            puts it, &ldquo;metaphysics is the assumption that the declarative sentence is the primary
            linguistic form.&rdquo; If you assume that language is, at bottom, the making of statements,
            the question of where language came from becomes literally unaskable — you have already
            smuggled in the finished thing you were meant to explain. Gans declines the assumption: he
            treats the declarative as a late arrival and asks the prior question — how did a creature
            that did not yet speak arrive at the very first sign?
          </p>
          <p>
            His answer is a scene. Picture a band of early hominids closing in on a single desirable
            object — a carcass, say, something every one of them wants. Ordinarily a pecking order keeps
            the peace; here the object is too desirable, and the desire is contagious. Each one wants it{' '}
            <em>because</em> the others want it — this is{' '}
            <Link href="/guide/concepts/mimesis" className={linkCls}>mimesis</Link>, the imitative
            desire René Girard described, in which we learn what to want by watching one another. The
            hierarchy that limits violence in animal groups gives way, the whole group converges at
            once, and rivalry threatens to consume everyone: a mimetic crisis. Then someone, at the
            threshold of grabbing, hesitates — and the gesture of grasping turns into a gesture of
            pointing: an aborted appropriation. The others, caught in the same bind, repeat it. For a
            moment no one lunges. Everyone points.
          </p>
          <p>
            That gesture is the{' '}
            <Link href="/guide/concepts/the-sign" className={linkCls}>first sign</Link>. It is not a
            grab and not a grunt; it stands <em>for</em> the object instead of seizing it, and anyone
            can repeat it to mean the same thing. This is why the three origins coincide: the sign
            defers the violence, so it is the origin of the human; the object, pointed to rather than
            devoured, becomes untouchable — charged, set apart, sacred; and the gesture, because it can
            be repeated and refers to something, is the origin of language. None of these is invented
            after the others — they are one event, seen from different angles, in a single act of{' '}
            <Link href="/guide/concepts/deferral" className={linkCls}>deferral</Link>: violence held off
            by a sign. Where Girard&rsquo;s founding scene ends in a murder, Gans&rsquo;s ends in a sign
            — you can{' '}
            <Link href="/post/anthropomorphics-origin-and-hypothesis" className={linkCls}>follow that provenance in full</Link>.
          </p>
          <p>
            This is where Center Study makes its own turn. Generative Anthropology gives us the scene;
            Center Study stays with what the scene leaves behind —{' '}
            <Link href="/guide/concepts/the-center" className={linkCls}>the center</Link>, and its
            persistence in every form of human organization. The scene never really ends; it only
            changes hands. At first the center is a ritual, sacrificial site — a place of exchange with
            the animal consumed and made sacred by the group. Then it is seized by a person: the figure
            anthropologists call the{' '}
            <Link href="/guide/concepts/big-man" className={linkCls}>Big Man</Link>, then chiefs, sacred
            kings, emperors, and finally what we call &ldquo;the state.&rdquo; Read this way, every
            social order — every institution, market, or medium — is an effect of the engagement
            between a periphery and a center. The standing question becomes simply: <em>what is the
            actual center here, and who holds it?</em> — even, especially, where a market or an
            algorithm insists there is no center at all.{' '}
            <Link href="/post/the-discourse-of-the-center" className={linkCls}>The clearest single statement of the claim</Link>.
          </p>
          <p>
            From this follows a second move: rebuilding the vocabularies of the human sciences in terms
            of an{' '}
            <Link href="/guide/concepts/ostensive-imperative-declarative" className={linkCls}>originary grammar</Link>{' '}
            that traces language from that first sign — the ostensive (pointing, naming what is
            present), the imperative (commanding what is absent), the interrogative (the question), and
            finally the declarative (the statement that can speak of what is absent). The wager is that
            we never really think in free-floating ideas — we think in <em>scenes</em>, in which some
            exchange with a central figure is always at stake. Building its terms up from that bottom
            accounts for the discourse&rsquo;s deliberately unfamiliar, self-aware style, and for its
            politics: a steady critique of theories that begin &ldquo;from the bottom&rdquo; — the free
            individual, the people, the social contract — and an insistence on beginning instead from
            the center, where authority and a first distribution are already assumed to have set the
            terms for everything that follows.
          </p>
          <p>
            So what does the work actually <em>do</em> with all this? It holds itself at one precise
            seam, on the longest horizon there is:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;The goal of center study is to stay as close to boundary between diagnosis and
            prescription as possible on the longest timeline imaginable: to always be able to say, this
            is what everyone is already doing and here&rsquo;s how they might, given certain shifts in
            visible trajectories, do it more explicitly and accountably.&rdquo;
            <Link href="/post/hyperstitching-the-soliciting-of-the-center-and-the-prolonging-of-the-imperative" className={citeClass}>— Hyperstitching the Center →</Link>
          </blockquote>
          <p>
            And the same frame that reads a single private desire scales, without changing, all the way
            up to the largest public scenes there are:
          </p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;But scenes directly orchestrated by the center, in collaboration with its closest
            subordinates (these being, today, the major media and tech companies), are of an entirely
            different character: these are spectacles, mass mobilizations, shows of force, sentimental
            morality plays, scapegoating rituals, and so on.&rdquo;
            <Link href="/post/scale" className={citeClass}>— Scale →</Link>
          </blockquote>
          <p>None of it asks to be believed. It asks to be tried:</p>
          <blockquote className={quoteClass} style={{ fontSize: '15px', lineHeight: 1.7 }}>
            &ldquo;it just offers a better way of thinking things through, and thinking things through
            is best done with others.&rdquo;
            <Link href="/post/the-prospects-of-the-hypothesis" className={citeClass}>— The Prospects of the Hypothesis →</Link>
          </blockquote>
          <p>
            That&rsquo;s enough to begin. Center Study is a living discourse rather than a finished
            doctrine, and its vocabulary is technical by design — it rewards patience, and reading back
            into the foundations as you go. You don&rsquo;t have to read in order; start where it grabs
            you. You can hear it laid out in sequence in the{' '}
            <Link href="/lectures" className={linkCls}>lecture series</Link>, look up any term in the{' '}
            <Link href="/concepts" className={linkCls}>concepts glossary</Link>, and when the next
            question arrives — and it will — the{' '}
            <Link href="/faq" className={linkCls}>FAQ</Link> takes up the ones that tend to follow first.
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
