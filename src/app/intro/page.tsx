import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Introduction to Center Study | Center Study Center',
  description:
    'Center Study is a transdisciplinary discourse descended from Generative Anthropology. It reads every social order as an effect of the engagement between periphery and center.',
};

const CENTER_STAGES = [
  {
    era: 'Pre-human',
    label: 'Pecking order',
    icon: '🐾',
    desc: 'Animal dominance hierarchies manage mimetic rivalry. No sign, no deferral — violence is limited by status alone.',
  },
  {
    era: 'Origin',
    label: 'Ritual center',
    icon: '🔥',
    desc: 'The originary scene. Aborted appropriation becomes the first sign. Language, the human, the sacred, and community emerge together.',
  },
  {
    era: 'Early human',
    label: 'Big Man',
    icon: '🤲',
    desc: 'The first human to occupy the center. Authority is personal, provisional, redistributive. Before this, every member was equal before the center.',
  },
  {
    era: 'Chiefdoms',
    label: 'Chief',
    icon: '⚔️',
    desc: 'Authority becomes heritable. The center is now a position, not just a person. Sacrality begins to institutionalize.',
  },
  {
    era: 'Archaic states',
    label: 'Sacred king',
    icon: '👑',
    desc: 'The king mediates between human and divine. Sacrifice is a royal prerogative. The center is explicitly sacred.',
  },
  {
    era: 'Empires / States',
    label: 'Sovereign state',
    icon: '🏛',
    desc: 'Law, bureaucracy, and money displace personal sacrality — without eliminating it. The center claims to be institutional.',
  },
  {
    era: 'Modernity',
    label: 'Market / Algorithm',
    icon: '📡',
    desc: 'The center claims to be absent — "the market," "the algorithm," "the procedure." Center Study asks: what is the actual center here, and who holds it?',
  },
];

const SCENE_CONSEQUENCES = [
  {
    label: 'Language',
    desc: 'The sign is iterable — re-issuable by anyone, referring to the same object. This is language: representation in place of appropriation.',
  },
  {
    label: 'The sacred',
    desc: 'The central object, deferred rather than consumed, becomes charged, untouchable — sacred. The center and the sacred are the same thing at origin.',
  },
  {
    label: 'Community',
    desc: 'The group constituted by shared attention to the sign is the first human community. To share a sign is to belong to the same scene.',
  },
  {
    label: 'Originary equality',
    desc: 'All are equal before the sign — equal in their capacity to emit and receive it, regardless of physical position.',
  },
  {
    label: 'Debt',
    desc: 'The object was left at the center — an unconsumed desire. The community is indebted to the center that deferred violence. Ritual is the repayment.',
  },
  {
    label: 'Resentment',
    desc: 'Desire for the prohibited object generates resentment. This is the specifically human emotion — appetite transformed by prohibition.',
  },
];

export default function IntroPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12 overflow-x-hidden">

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 mt-4 text-gray-900 dark:text-white">
        Introduction to Center Study
      </h1>

      {/* Epigraph */}
      <div className="mb-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
        <p
          className="text-base text-gray-500 dark:text-gray-400 italic leading-relaxed"
          style={{ fontFamily: 'var(--prose-font-family)' }}
        >
          &ldquo;We are beings bound to the center: everything that we say, think or do is homage to the center.&rdquo;
        </p>
      </div>

      {/* On this page — jump links */}
      <nav className="mb-12 flex flex-wrap gap-2 text-xs">
        {[
          ['#five-minute', 'Introduction'],
          ['#lineage', 'Lineage'],
          ['#originary-scene', 'The originary scene'],
          ['#how-to-read', 'How to read'],
          ['#start-reading', 'Explore'],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* ── The five-minute version ─────────────────────────────────────── */}
      <section id="five-minute" className="mb-16 scroll-mt-20">
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
          Introduction
        </h2>
        <div
          className="space-y-5 text-gray-800 dark:text-gray-200"
          style={{
            fontFamily: 'var(--prose-font-family)',
            fontSize: 'var(--prose-font-size, 17px)',
            lineHeight: 'var(--prose-line-height, 1.85)',
          }}
        >
          <p>
            Center Study is a transdisciplinary discourse descended from Generative Anthropology — the study of human society and culture in the light of the originary hypothesis, formulated by Eric Gans in <em>The Origin of Language</em> (1980). The originary hypothesis is of the origin of language, which is also the origin of the human and the sacred.
          </p>
          <p>
            The hypothesis: a group of hominids is converging on a single central object. Mimetic desire has broken down the pecking order that limits violence in animal groups — everyone wants the same thing, and they are closing in on it together. At the moment of crisis, someone converts the grasping gesture into a pointing gesture. Appropriation becomes sign. This is the first word: iterable, addressed to all the others, referring to the shared object — symbolic rather than merely indexical. From this single scene, language, community, and the sacred emerge simultaneously. The object, deferred rather than consumed, becomes the first sacred thing. The group, constituted by shared attention, becomes the first human community.
          </p>
          <p>
            Center Study departs from Generative Anthropology by staying focused on the <em>enduring</em> nature of the center — not just its origin but its ongoing operation in every subsequent form of human social life. That first ritual, sacrificial center eventually gets seized: first by the Big Man, then the chief, the sacred king, the emperor, the state. Center Study follows this thread and reads any social order as an effect of the engagement between periphery and center. Every institution, every political form, every medium of exchange is an attempt to hold the center, occupy it, or deny that any center exists.
          </p>
          <p>
            This means thinking always in terms of scenes and an originary grammar — ostensive (pointing, naming), imperative (demand), interrogative (question), declarative (proposition) — tracing every concept back to a scene in which some exchange with the center is at stake. Politically, it produces a critique of any theory that starts from &ldquo;the bottom&rdquo; — from the free individual, the social contract, natural rights — insisting instead on starting from the center, from where authority was established and the terms of all future exchange were set.
          </p>
        </div>

        {/* Go-deeper cue — the on-ramp (what to read first, by interest, etc.) lives on /start */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          <p className="text-xs text-gray-400 dark:text-gray-500">
            That&rsquo;s the core. Read on for the full picture — or see the{' '}
            <Link href="/start" className="text-blue-600 dark:text-blue-400 hover:underline">
              best places to start
            </Link>.
          </p>
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
        </div>
      </section>

      {/* ── Intellectual Lineage ─────────────────────────────────────────── */}
      <section id="lineage" className="mb-16 scroll-mt-20">
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
          Intellectual lineage
        </h2>

        <div className="relative">
          <div className="absolute left-6 top-16 bottom-16 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />

          <div className="space-y-2">

            {/* Girard */}
            <div id="girard" className="flex gap-4 items-start scroll-mt-20">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-700 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-lg z-10">
                G
              </div>
              <div className="flex-1 pb-6 border-b border-gray-100 dark:border-gray-800">
                <p className="font-semibold text-gray-900 dark:text-white">René Girard</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Mimetic Theory · <em>Violence and the Sacred</em> (1972)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Humans are fundamentally imitative. Imitation generates rivalry; rivalry generates collective violence; violence is discharged onto a scapegoat whose expulsion restores peace. The scapegoat becomes sacred. Girard&rsquo;s founding violence generates religion, culture, and institutions — but it gives us a corpse where Center Study finds a sign.
                </p>
                <blockquote className="mt-3 mb-2 border-l-2 border-amber-200 dark:border-amber-800 pl-3 text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed">
                  &ldquo;You can test the seriousness of any social theory by the seriousness with which it takes mimesis. Mimesis is obviously a very ancient concept, prominent in Plato and Aristotle, but as far as I know until René Girard it was never pursued all the way down — it&rsquo;s one thing to say humans are mimetic beings, but it&rsquo;s another to say that mimesis makes the human.&rdquo;
                  <cite className="not-italic block mt-1 text-gray-400 dark:text-gray-500">
                    — Adam Katz, <Link href="/post/mimetic" className="text-blue-500 hover:underline">Lecture 2: Mimetic</Link>
                  </cite>
                </blockquote>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['mimesis', 'scapegoat', 'sacrifice', 'violence'].map((t) => (
                    <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
                      className="px-2 py-0.5 text-[11px] rounded-full border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors">
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex gap-4 items-center pl-2 sm:pl-0">
              <div className="w-12 flex justify-center flex-shrink-0">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
                  <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 14l-5-5h10l-5 5z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                Gans accepts mimesis but relocates the founding moment — deferral, not murder; a sign, not a corpse
              </p>
            </div>

            {/* Gans / GA */}
            <div id="gans" className="flex gap-4 items-start scroll-mt-20">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-lg z-10">
                GA
              </div>
              <div className="flex-1 pb-6 border-b border-gray-100 dark:border-gray-800">
                <p className="font-semibold text-gray-900 dark:text-white">Generative Anthropology</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Eric Gans · <em>The Origin of Language</em> (1980 / 2nd ed. 2019) · <em>Chronicles of Love and Resentment</em> (ongoing)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                  If humans are mimetic all the way down, can one set a limit to imitation? The originary hypothesis says yes: the gesture of grasping converts into a gesture of pointing. Aborted appropriation becomes the first sign. It is <em>symbolic</em> in Peirce&rsquo;s sense — iterable and referring — not merely <em>indexical</em>. In that single movement, language, the human, the sacred, and community are born together. Not sequentially. Together.
                </p>
                {/* Peirce inset */}
                <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-lg px-4 py-3 mb-3 text-xs">
                  <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Peirce&rsquo;s distinction (why it matters)</p>
                  <div className="flex gap-4">
                    <div>
                      <p className="font-medium text-blue-700 dark:text-blue-400">Indexical sign</p>
                      <p className="text-blue-600/80 dark:text-blue-500">Points to something present (smoke → fire). Animal communication stays here.</p>
                    </div>
                    <div className="w-px bg-blue-200 dark:bg-blue-800" />
                    <div>
                      <p className="font-medium text-blue-700 dark:text-blue-400">Symbolic sign</p>
                      <p className="text-blue-600/80 dark:text-blue-500">Iterable and referential. Can name the absent. Language begins here. Only humans have this.</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['originary scene', 'deferral', 'the sacred', 'ostensive sign', 'aborted appropriation'].map((t) => (
                    <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
                      className="px-2 py-0.5 text-[11px] rounded-full border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex gap-4 items-center pl-2 sm:pl-0">
              <div className="w-12 flex justify-center flex-shrink-0">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
                  <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 14l-5-5h10l-5 5z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                Center Study keeps the center always in view — rebuilding the human sciences around it
              </p>
            </div>

            {/* Center Study */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-900 dark:bg-white border-2 border-gray-900 dark:border-white flex items-center justify-center text-white dark:text-gray-900 font-bold text-lg z-10">
                CS
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">Center Study</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Adam Katz · GABlog (~480 posts) · as Dennis Bouvard on Substack (~130 essays) · <em>Anthropomorphics</em> (book)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                  Takes GA&rsquo;s originary hypothesis and keeps the center in view across all of human organization — from the first ritual scene through kingship, law, money, media, and code. Reads every social form as an effect of the engagement between periphery and center. Develops the vocabulary: <em>scenic design</em>, <em>anthropomorphics</em>, <em>attentionality</em>, <em>pointman</em>, <em>omnicentrism</em>, the full grammar of ostensive, imperative, and declarative forms.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  On GABlog, Katz develops the theory: originary grammar, succession, the metapersonal structure of institutions, the center through history. On Substack, as Dennis Bouvard, he applies Center Study to contemporary life — AI, money, governance, media, the algorithmic center. The diagnostic question is always the same: <em>who actually holds the center here, and on what terms?</em>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['the center', 'originary grammar', 'succession', 'scenic design', 'anthropomorphics'].map((t) => (
                    <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
                      className="px-2 py-0.5 text-[11px] rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        <Link
          href="/lineage"
          className="mt-8 group flex items-center justify-between gap-4 p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">The lineage, in their own words</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Girard → Gans → Katz, told through exact passages from the corpus — the missing account of language, and why it scales to money, institutions, and machines</p>
          </div>
          <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0">→</span>
        </Link>
      </section>

      {/* ── The Originary Scene ─────────────────────────────────────────── */}
      <section id="originary-scene" className="mb-14 scroll-mt-20">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          The Originary Scene
        </h2>

        {/* Scene diagram */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-5">
          <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">The scene</p>
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-sm mb-1.5">👥</div>
              <p className="text-[10px] text-gray-500">group converges</p>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" /></svg>
              <p className="text-[9px] text-gray-400 italic">mimetic crisis</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-400 dark:border-blue-600 flex items-center justify-center text-sm mb-1.5">✦</div>
              <p className="text-[10px] text-gray-500">central object</p>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" /></svg>
              <p className="text-[9px] text-gray-400 italic">grasp → point</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700 flex items-center justify-center text-sm mb-1.5">☝️</div>
              <p className="text-[10px] text-gray-500">first sign</p>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" /></svg>
              <p className="text-[9px] text-gray-400 italic">simultaneously</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-700 flex items-center justify-center text-sm mb-1.5">🌐</div>
              <p className="text-[10px] text-gray-500 text-center">language · sacred<br/>community · equality</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            The originary hypothesis posits a scene. A group of proto-humans converges on a single central object — prey, food, some object of intense collective desire. Mimetic desire escalates: everyone wants it because everyone else wants it, and the pecking order that normally manages competition breaks down. Each participant reaches toward the object; each perceives the others also reaching; the gesture of grasping hesitates and converts into one of <em>aborted appropriation</em> — pointing.
          </p>
          <p>
            Why does the gesture abort? Because mutual perception of simultaneous appropriation makes appropriation lethal. Anyone who grabs will face the entire group. Precisely at the threshold of collective violence, the grasping gesture becomes a designating gesture. It is still directed at the object — but now it names the object rather than seizing it. This is the first sign. It works because everyone emits it at the same moment, and everyone understands it because everyone else emits it too.
          </p>
          <p>
            The sign is <em>symbolic</em> in Peirce&rsquo;s sense: iterable, having a referent. It can be re-issued by anyone in the group to designate the same object even when the object is absent. Deferral, GA&rsquo;s key term, names this function: language defers the violence of appropriation by substituting representation for the act.
          </p>
          <p>
            What follows from this single scene — not sequentially, but simultaneously:
          </p>
        </div>

        {/* What follows from the scene */}
        <div className="mt-5 mb-6 grid sm:grid-cols-2 gap-2">
          {SCENE_CONSEQUENCES.map((item) => (
            <div key={item.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">{item.label}</p>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            The elegance of the hypothesis is that none of these are separate inventions. They are the same event seen from different angles. The center that is signed is already sacred; the community that shares the sign is constituted by that sharing; the debt incurred by leaving the object unconsumed will eventually be discharged in ritual consumption — the sparagmos, the originary meal. The whole of human culture is the elaboration of this first scene.
          </p>
        </div>
      </section>

      {/* ── The Center Through History ──────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold mb-2 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          The Center Through History
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          The center is never absent from human activity. What changes is who holds it and on what terms. Center Study follows this thread from the originary scene to the present.
        </p>

        {/* Horizontal scrollable timeline */}
        <div className="overflow-x-auto pb-3 -mx-4 px-4">
          <div className="flex gap-3 min-w-max">
            {CENTER_STAGES.map((stage, i) => (
              <div key={stage.label} className="relative flex flex-col w-44">
                {i < CENTER_STAGES.length - 1 && (
                  <div className="absolute top-5 left-full w-3 h-px bg-gray-300 dark:bg-gray-600 z-10" />
                )}
                <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{stage.icon}</span>
                    <div>
                      <p className="text-[10px] font-mono text-gray-400 leading-none">{stage.era}</p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{stage.label}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-4 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            The center begins as a ritual, sacrificial center: a sacred object around which the community is constituted by its shared sign. The first human to seize the center — the Big Man — does so through a different kind of exchange: production and redistribution rather than inherited status. Authority is personal, provisional, and requires constant renewal through generosity. Over time this personal authority becomes heritable (chief), then sacralized in the person of the king, then institutionalized in law, bureaucracy, and money, and finally claimed to be absent altogether.
          </p>
          <p>
            The diagnostic question Center Study always asks is: <em>what is the actual center here, and who occupies it?</em> This applies to markets, algorithms, legal procedures, and platforms as much as to kings and priests. When an institution claims to be centerless — run by procedure, by code, by the market — Center Study looks for what it is displacing, and for the actual authority to which claims are made and against which resentment accumulates.
          </p>
          <blockquote className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 text-sm text-gray-500 dark:text-gray-400 italic">
            &ldquo;We are beings bound to the center: everything that we say, think or do is homage to the center.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* ── Originary Grammar ───────────────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          Originary Grammar
        </h2>

        {/* Grammar sequence */}
        <div className="my-5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">Language forms in order of emergence</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Ostensive', note: 'Names the sacred center: "this." The first sign, directed at the central object on the scene.', example: '☝️' },
              { label: 'Imperative', note: 'Commands action toward or from the center: "give this," "do this." Derived from the ostensive.', example: '👋' },
              { label: 'Interrogative', note: 'Arises when an imperative cannot be directly fulfilled — asks what to do. Opens the space of the as-yet-unknown.', example: '❓' },
              { label: 'Declarative', note: 'Speaks of something detached from its physical presence. The fullest language form; makes the absent present in representation.', example: '💬' },
            ].map((item, i, arr) => (
              <div key={item.label} className="relative">
                {i < arr.length - 1 && (
                  <div className="hidden sm:block absolute top-5 -right-1.5 text-gray-300 dark:text-gray-600 text-xs z-10">›</div>
                )}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 h-full">
                  <div className="text-lg mb-1">{item.example}</div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">{item.label}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug italic">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            The originary sign is <em>ostensive</em>: it designates something present on the scene. From this, three further forms derive. The <em>imperative</em> requests or commands action toward or from the center. The <em>interrogative</em> arises when an imperative cannot be directly fulfilled, opening the space of the not-yet-known. The <em>declarative</em> — the fullest and most distinctly human form — makes statements about what is absent from the immediate scene; it is representation freed from the requirement of presence.
          </p>
          <p>
            Center Study treats this as more than historical sequence. Every utterance can be analyzed through these forms, and every social institution can be understood as a scene organized around some version of the ostensive-imperative exchange. We are always, as Katz puts it, &ldquo;trying to get word from the center&rdquo; — and the center is always, in some sense, speaking back. The declarative that appears to describe a neutral world is always embedded in some scene that is more fundamental.
          </p>
          <p>
            There is a necessary self-reflexivity here. We are always discussing things from within some scene, and therefore simultaneously referring, at least implicitly, to that scene and its relation to the center. This is not a flaw in the method; it is the method. Every analysis must account for its own position within a scenic order.
          </p>
        </div>
      </section>

      {/* ── Politics from the Center ────────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          Politics from the Center
        </h2>

        {/* Top-down vs bottom-up contrast */}
        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1.5">Most political theory</p>
            <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed">
              Starts from the bottom: the free subject, the people, the social contract, natural rights. Authority must justify itself upward from individual consent. The center is a problem to be explained away or constrained.
            </p>
          </div>
          <div className="bg-gray-900 dark:bg-white border border-gray-900 dark:border-white rounded-xl p-4">
            <p className="text-xs font-semibold text-white dark:text-gray-900 mb-1.5">Center Study</p>
            <p className="text-sm text-gray-300 dark:text-gray-700 leading-relaxed">
              Starts from the center: from where authority and an originary distribution has already taken place, setting the terms for all future distributions and exchanges. The center is given first.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            The central political problem, seen from the center, is <em>succession</em>: how power is transferred from one central figure to the next without collapsing into the mimetic violence the center was always meant to defer. Succession requires a frame — a shared understanding of what constitutes a legitimate transition — and Center Study attends carefully to when those frames hold and when they begin to crack.
          </p>
          <p>
            Much of democratic politics has been organized around directing resentment toward the figure at the center, which keeps the center accountable while constantly testing the succession frame. We have become accustomed to see this as harmless or even healthy. More recently we have noticed that the rules governing the replacement of one central figure by another may be more fragile than we assumed — that the frame itself requires something to hold it in place.
          </p>
          <p>
            Center Study tracks how sacrality persists, migrates, or attenuates as institutional forms evolve from ritual into law, into money, into code. The algorithm is not neutral: it is scenic design without the ritual scene — a mechanism for deferring rivalry over the terms of decision while empowering whoever controls the mechanism. The question is not sacred versus secular; that distinction is derived and unstable. The question is always how the center is held, and by whom.
          </p>
        </div>
      </section>

      {/* ── What makes this hard ────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          What makes this hard
        </h2>
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-5 mb-4">
          <p className="text-sm text-amber-900 dark:text-amber-200 font-medium mb-1.5">The hypothesis repels the download it demands</p>
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            &ldquo;The originary hypothesis repels the kind of initiatory revelatory &lsquo;download&rsquo; that is nevertheless the only way of understanding it.&rdquo; This is not a warning about difficulty in the usual sense — it is a structural feature of the discourse. You cannot understand Center Study from the outside; you can only begin from within a particular text, and extend from there.
          </p>
        </div>
        <div
          className="space-y-4 text-gray-700 dark:text-gray-300"
          style={{ fontFamily: 'var(--prose-font-family)', fontSize: 'var(--prose-font-size, 17px)', lineHeight: 'var(--prose-line-height, 1.85)' }}
        >
          <p>
            <strong className="text-gray-800 dark:text-gray-200">The vocabulary is technical and self-referential.</strong> Terms like <em>originary</em>, <em>scenic</em>, <em>deferral</em>, <em>attentionality</em> don&rsquo;t map cleanly onto existing frameworks. The Key Concepts section below defines them with real passages from the texts — that is probably the most direct entry.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">The hypothesis sits between all available positions.</strong> It cannot claim the clarity of a system or the comfort of a tradition. It finds itself in an uncomfortable zone — atheist to believers, too speculative to philosophers, transdisciplinary to every discipline it touches. It is, as Katz puts it, like a perfectly materialist refutation of materialism.
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">The best entry point varies by reader.</strong> Some find the originary scene immediately clarifying. Others find the political applications — succession, sovereignty, the algorithmic center — more tractable first. Start where it grabs you and read back into the foundations as needed.
          </p>
        </div>
        <Link
          href="/faq"
          className="mt-4 group flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Questions &amp; objections</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Is it falsifiable? Just a just-so story? How does it differ from Girard? — the standard objections, answered in the discourse&rsquo;s own words.</p>
          </div>
          <span className="text-gray-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0">→</span>
        </Link>
      </section>

      {/* ── How to use this site ──────────────────────────────────────── */}
      <section className="mb-12">
        <h2 id="how-to-read" className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white scroll-mt-20">
          How to read Center Study
        </h2>
        <div
          className="space-y-4 text-gray-700 dark:text-gray-300"
          style={{ fontFamily: 'var(--prose-font-family)', fontSize: 'var(--prose-font-size, 17px)', lineHeight: 'var(--prose-line-height, 1.85)' }}
        >
          <p>
            Center Study is a living discourse, not a completed doctrine. It spans 25+ years of writing across three main venues: <strong className="text-gray-800 dark:text-gray-200">GABlog</strong> (theoretical development — originary grammar, succession, the center through history, the grammar of institutions); <strong className="text-gray-800 dark:text-gray-200">Substack</strong> as Dennis Bouvard (contemporary applications — AI, money, governance, politics, the algorithmic center); and the <strong className="text-gray-800 dark:text-gray-200"><em>Anthropomorphics</em> book</strong> (a systematic treatment of the metapersonal structure of culture).
          </p>
          <p>
            Reading strategies differ. Some begin with concept definitions and follow the links; others start with a contemporary topic — AI, sovereignty, money — and read back into the theoretical foundations as needed. <em>Ask AI</em> synthesizes answers from across the full corpus and surfaces passages you would not find with keyword search. <em>Key Concepts</em> defines the vocabulary precisely. <em>Reading Paths</em> offer curated sequences for specific interests and fields.
          </p>
          <p>
            The difficulty of Center Study is not obscurantism — it is that the hypothesis genuinely repels easy summary. The only way to understand it is to encounter it in the texts themselves.
          </p>
        </div>
      </section>

      {/* ── Start reading ───────────────────────────────────────────────── */}
      <section>
        <h2 id="start-reading" className="text-xl font-semibold mb-4 text-gray-900 dark:text-white scroll-mt-20">
          Explore the archive
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/concepts" className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Key Concepts</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Center, deferral, resentment, the sacred — defined with passages from the texts</p>
          </Link>
          <Link href="/ask" className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Ask AI</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Ask any question — get synthesized answers grounded in the full corpus</p>
          </Link>
          <Link href="/browse/gablog" className="group block p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">GABlog — Katz</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">~480 posts developing originary grammar and Center Study theory</p>
          </Link>
          <Link href="/browse/substack" className="group block p-4 rounded-xl border border-orange-100 dark:border-orange-900/40 hover:border-orange-400 dark:hover:border-orange-600 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Substack — Bouvard</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">~130 essays on AI, governance, money, and contemporary politics</p>
          </Link>
          <Link href="/guide/reading-paths" className="group block p-4 rounded-xl border border-green-100 dark:border-green-900/40 hover:border-green-400 dark:hover:border-green-600 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Reading Paths</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Curated sequences for specific topics and interests</p>
          </Link>
          <Link href="/lectures" className="group block p-4 rounded-xl border border-amber-100 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Lecture Series</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Five introductory lectures: Origin → Mimetic → Deferral → Center → Sign</p>
          </Link>
          <Link href="/search" className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Full-text search</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Search 700+ texts by keyword, phrase, or concept</p>
          </Link>
        </div>
      </section>

    </main>
  );
}
