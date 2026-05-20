import Link from 'next/link';
import DarkModeToggle from '@/components/DarkModeToggle';
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
    desc: 'Animal dominance hierarchies limit mimetic rivalry. No sign, no deferral.',
  },
  {
    era: 'Origin',
    label: 'Ritual center',
    icon: '🔥',
    desc: 'A sacred object at the center. Aborted appropriation becomes the first sign. Language, the human, and the sacred are born together.',
  },
  {
    era: 'Early human',
    label: 'Big Man',
    icon: '🤲',
    desc: 'The first human to seize the center. Authority is personal, temporary, redistributive.',
  },
  {
    era: 'Chiefdoms',
    label: 'Chief',
    icon: '⚔️',
    desc: 'Authority becomes heritable. The center is now a position, not just a person.',
  },
  {
    era: 'Archaic states',
    label: 'Sacred king',
    icon: '👑',
    desc: 'The king mediates between human and divine. Sacrifice is now a royal prerogative.',
  },
  {
    era: 'Empires / States',
    label: 'Sovereign state',
    icon: '🏛',
    desc: 'The center is institutionalized. Law, bureaucracy, and money displace personal sacrality — without eliminating it.',
  },
  {
    era: 'Modernity',
    label: 'Market / Algorithm',
    icon: '📡',
    desc: 'The center claims to be absent — "the market," "the procedure," "the platform." Center Study asks: what is the actual center here, and who occupies it?',
  },
];

export default function IntroPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 pt-6 pb-24 sm:py-12 overflow-x-hidden">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-10 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <DarkModeToggle />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-gray-900 dark:text-white">
        Introduction to Center Study
      </h1>
      <p className="text-sm text-gray-400 dark:text-gray-500 italic mb-12 leading-relaxed">
        &ldquo;The originary hypothesis repels the kind of initiatory revelatory &lsquo;download&rsquo; that is nevertheless the only way of understanding it.&rdquo;
      </p>

      {/* ── Intellectual Lineage ─────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
          Intellectual lineage
        </h2>

        <div className="relative">
          <div className="absolute left-6 top-16 bottom-16 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />

          <div className="space-y-2">

            {/* Girard */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-700 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-lg z-10">
                G
              </div>
              <div className="flex-1 pb-6 border-b border-gray-100 dark:border-gray-800">
                <p className="font-semibold text-gray-900 dark:text-white">René Girard</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Mimetic Theory · <em>Violence and the Sacred</em> (1972)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Humans are fundamentally imitative. Imitation generates rivalry; rivalry generates collective violence; violence is discharged onto a scapegoat whose expulsion restores peace. The scapegoat becomes sacred. The founding murder generates religion, culture, and institutions.
                </p>
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
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-lg z-10">
                GA
              </div>
              <div className="flex-1 pb-6 border-b border-gray-100 dark:border-gray-800">
                <p className="font-semibold text-gray-900 dark:text-white">Generative Anthropology</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Eric Gans · <em>The Origin of Language</em> (1980 / 2nd ed. 2019)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                  If humans are mimetic all the way down, can one set a limit to imitation? The originary hypothesis says yes: the gesture of grasping converts into a gesture of pointing. Aborted appropriation becomes the first sign. It is <em>symbolic</em> — iterable and referring — not merely <em>indexical</em> (Peirce). In that single movement, language, the human, the sacred, and community are born together.
                </p>
                {/* Peirce inset */}
                <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-lg px-4 py-3 mb-3 text-xs">
                  <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Peirce's distinction</p>
                  <div className="flex gap-4">
                    <div>
                      <p className="font-medium text-blue-700 dark:text-blue-400">Indexical sign</p>
                      <p className="text-blue-600/80 dark:text-blue-500">Points to something present (smoke → fire). Animal.</p>
                    </div>
                    <div className="w-px bg-blue-200 dark:bg-blue-800" />
                    <div>
                      <p className="font-medium text-blue-700 dark:text-blue-400">Symbolic sign</p>
                      <p className="text-blue-600/80 dark:text-blue-500">Iterable and referential. Can name the absent. Human.</p>
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
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Adam Katz &amp; Dennis Bouvard · GABlog, Substack, <em>Anthropomorphics</em></p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Takes GA&rsquo;s originary hypothesis and keeps the center in view across all human organization — from the first ritual scene through kingship, the state, money, media, and code. Reads every social order as an effect of the engagement between periphery and center. Rebuilds the vocabularies of the human sciences from originary grammar. Always asks: <em>who actually holds the center here, and on what terms?</em>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['the center', 'originary grammar', 'succession', 'imperative exchange', 'scenic design'].map((t) => (
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
      </section>

      {/* ── The Originary Scene ─────────────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          The Originary Scene
        </h2>

        {/* Scene diagram */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-5">
          <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">The scene</p>
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-sm mb-1.5">👥</div>
              <p className="text-[10px] text-gray-500">group</p>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" /></svg>
              <p className="text-[9px] text-gray-400 italic">converge on</p>
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
              <p className="text-[9px] text-gray-400 italic">gives rise to</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-700 flex items-center justify-center text-sm mb-1.5">🌐</div>
              <p className="text-[10px] text-gray-500">language · humanity · sacred · community</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            The originary hypothesis posits that language originates in a gesture issued in the midst of a mimetic crisis: the entire group is converging on a single object, breaking down the pecking order that limits violence in animal groups. Each participant reaches for the object; each perceives the others reaching; the gesture of grasping converts into one of aborted appropriation — pointing.
          </p>
          <p>
            This first sign is <em>symbolic</em> in Peirce&rsquo;s sense: it is iterable and has a referent. It can be re-issued and understood by anyone in the group. It defers the violence of direct appropriation by substituting representation for the act. In this single movement — and not sequentially — language, the human, the sacred, and community all come into existence together.
          </p>
          <p>
            If you accept that human beings are mimetic, can you set a limit to imitation? And how could one deny the elegance of the solution — a form of imitation, on the boundary between attention and intention, that reverses the trajectory of an appropriative gesture by converting it into one of aborted appropriation?
          </p>
        </div>
      </section>

      {/* ── The Center Through History ──────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold mb-2 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          The Center Through History
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          The center is never absent from human activity. What changes is who holds it and on what terms. Center Study follows this thread.
        </p>

        {/* Horizontal scrollable timeline */}
        <div className="overflow-x-auto pb-3 -mx-4 px-4">
          <div className="flex gap-3 min-w-max">
            {CENTER_STAGES.map((stage, i) => (
              <div key={stage.label} className="relative flex flex-col w-44">
                {/* Connector line (not last) */}
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

        <div className="mt-5 space-y-3 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            The center is initially a ritual, sacrificial center — a site of exchange with the animal consumed and deified by the group. But the center is eventually seized by a human: first the &ldquo;Big Man,&rdquo; who redistributes wealth without institutionalized authority; then chiefs, whose authority is heritable; then sacred kings, who mediate between the human and the divine; then the imperial and modern state.
          </p>
          <p>
            The diagnostic question Center Study always asks is: <em>what is the actual center here, and who occupies it?</em> This question applies to markets, algorithms, platforms, and legal procedures as much as to kings. When an institution claims to be centerless, Center Study looks for what it is displacing.
          </p>
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
              { label: 'Ostensive', note: '"This" — names the sacred center', example: '☝️' },
              { label: 'Imperative', note: '"Give me this" — issues a command', example: '👋' },
              { label: 'Interrogative', note: '"Is this?" — asks about the real', example: '❓' },
              { label: 'Declarative', note: '"This is so" — states the world', example: '💬' },
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
            Center Study is the work of remaking the vocabularies of the human sciences in terms of this grammar. Tracing language from the earliest ostensive sign through the imperative, interrogative, and declarative means that every concept must eventually be grounded in a <em>scene</em> — there are no ideas, only scenes in which some kind of exchange with some &ldquo;metaperson&rdquo; (a being charged with inhabiting the center) is enacted.
          </p>
          <p>
            There is a necessary self-reflexivity here. We are always discussing things from within some scene and therefore simultaneously referring, at least implicitly, to that scene and its relation to the center. This is not a flaw in the method; it is the method. Every analysis of a social form must account for its own position within a scenic order.
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
              Starts from the bottom: the free subject, the people, the social contract, natural rights. Authority must justify itself upward from individual consent.
            </p>
          </div>
          <div className="bg-gray-900 dark:bg-white border border-gray-900 dark:border-white rounded-xl p-4">
            <p className="text-xs font-semibold text-white dark:text-gray-900 mb-1.5">Center Study</p>
            <p className="text-sm text-gray-300 dark:text-gray-700 leading-relaxed">
              Starts from the center: from where authority and an originary distribution has already taken place, setting the terms for all future distributions and exchanges.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            The problem of politics, seen from the center, is the problem of <em>succession</em>: how power is transferred from one central figure to the next without collapsing into the mimetic violence that the center was always meant to defer. Much of democratic politics is organized around directing resentment toward the figure at the center. We have become accustomed to see this as harmless. More recently we have noticed that the rules governing the replacement of one central figure by another may be more fragile than we realized.
          </p>
          <p>
            Center Study tracks how sacrality persists, migrates, or attenuates as institutional forms evolve from ritual into law, into money, into code. The algorithm is a supplementary medium for the internet — scenic design without the ritual scene. Every automated decision defers some rivalry over the terms on which that decision is made, while empowering one center over another. The question is not sacred versus secular. That distinction is derived and unstable. The question is always how the center is held.
          </p>
        </div>
      </section>

      {/* ── The Paradox ─────────────────────────────────────────────────── */}
      <section className="mb-14">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 italic mb-4">
            The originary hypothesis cannot claim the clarity of a system or the comfort of a tradition. It finds itself in that uncomfortable zone between all available positions — atheist to believers, speculative to philosophers, transdisciplinary to every discipline it touches. It is like a perfectly materialist refutation of materialism.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            So, maybe that&rsquo;s enough for starters. The archive is always ready to take on questions.
          </p>
        </div>
      </section>

      {/* ── Start reading ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Start reading
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/guide/concepts" className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Key Concepts</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Center, deferral, resentment, the sacred — defined and placed</p>
          </Link>
          <Link href="/ask" className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Ask the Archive</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">AI-synthesized answers grounded in the full corpus</p>
          </Link>
          <Link href="/browse/gablog" className="group block p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">GABlog — Katz</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">~480 posts developing originary grammar and Center Study theory</p>
          </Link>
          <Link href="/browse/substack" className="group block p-4 rounded-xl border border-orange-100 dark:border-orange-900/40 hover:border-orange-400 dark:hover:border-orange-600 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Substack — Bouvard</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">~127 essays on AI, governance, money, and contemporary politics</p>
          </Link>
          <Link href="/guide/timeline" className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Timeline</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">All dated posts by year — see the archive as a history</p>
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
