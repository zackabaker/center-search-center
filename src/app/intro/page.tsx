import Link from 'next/link';
import DarkModeToggle from '@/components/DarkModeToggle';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Introduction to Center Study | Center Study Center',
  description:
    'Center Study is a transdisciplinary discourse descended from Generative Anthropology. It stays focused on the enduring nature of the center to any form of human organization.',
};

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

      {/* ── Lineage diagram ─────────────────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
          Intellectual lineage
        </h2>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-6 top-16 bottom-16 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />

          <div className="space-y-2">

            {/* Node 1 — Girard */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-700 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-lg z-10">
                G
              </div>
              <div className="flex-1 pb-6 border-b border-gray-100 dark:border-gray-800">
                <p className="font-semibold text-gray-900 dark:text-white">René Girard</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Mimetic Theory · <em>Violence and the Sacred</em> (1972)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Humans are fundamentally imitative. Imitation leads to rivalry over the same objects; rivalry generates collective violence; violence is discharged onto a scapegoat, whose expulsion temporarily restores peace. The scapegoat becomes sacred — the founding murder generates religion, culture, and institutions.
                </p>
              </div>
            </div>

            {/* Arrow label */}
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
                Gans accepts mimesis but relocates the founding moment — deferral, not murder
              </p>
            </div>

            {/* Node 2 — Gans / GA */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-lg z-10">
                GA
              </div>
              <div className="flex-1 pb-6 border-b border-gray-100 dark:border-gray-800">
                <p className="font-semibold text-gray-900 dark:text-white">Generative Anthropology</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Eric Gans · <em>The Origin of Language</em> (1980)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Language originates in a gesture — the aborted appropriation of a central object during mimetic crisis. Each participant reaches for the object; each perceives the others reaching; the gesture of grasping converts into a gesture of pointing. This first sign defers violence by substituting representation for appropriation. The sign is iterable and has a referent: it is symbolic, not merely indexical. In this moment language, the human, the sacred, and community are all born together.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['originary scene', 'deferral', 'the sacred', 'mimesis', 'ostensive sign'].map((t) => (
                    <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
                      className="px-2 py-0.5 text-[11px] rounded-full border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Arrow label */}
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
                Center Study stays focused on the enduring nature of the center
              </p>
            </div>

            {/* Node 3 — Center Study */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-900 dark:bg-white border-2 border-gray-900 dark:border-white flex items-center justify-center text-white dark:text-gray-900 font-bold text-lg z-10">
                CS
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">Center Study</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Adam Katz &amp; Dennis Bouvard · GABlog, Substack, <em>Anthropomorphics</em></p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Takes GA's originary hypothesis and keeps the center in view across all human organization — from the first ritual scene through kingship, the state, money, media, and code. Rebuilds the vocabularies of the human sciences from originary grammar. Reads every social order as an effect of the engagement between periphery and center.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['the center', 'originary grammar', 'succession', 'imperative exchange', 'debt to the center'].map((t) => (
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
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          The Originary Scene
        </h2>
        <div className="space-y-4 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            The originary hypothesis posits that language originates in a gesture, issued in the midst of a mimetic crisis in which the entire group of hominids is converging on a single object, breaking down the pecking order that limits violence in animal groups. This gesture — a gesture of aborted appropriation, or grasping converted into pointing — is the first sign because it is iterable and has a referent. It is &ldquo;symbolic&rdquo; and not merely &ldquo;indexical,&rdquo; to use Charles Sanders Peirce&rsquo;s categories.
          </p>
          <p>
            If you accept that human beings are mimetic, can you set a limit to imitation? If we are mimetic all the way down, can anyone deny that imitation leads to rivalry? And how could one deny the elegance of the solution — a form of imitation, on the boundary between attention and intention, that reverses the trajectory of an appropriative gesture by converting it into one of aborted appropriation?
          </p>
          <p>
            The aborted gesture, emitted to all and received from all as the same sign, defers the violence that would otherwise have torn the group apart. In this single movement: language, the human, the sacred, and community come into existence together — not separately, not sequentially, but at once.
          </p>
        </div>
      </section>

      {/* ── The Center ──────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          The Center
        </h2>
        <div className="space-y-4 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            Center Study stays focused on the enduring nature of the center to any form of human organization or sociality. This is initially a ritual, sacrificial center — a site of exchange with the animal consumed and deified by the group. But the center is eventually seized by a human: first the &ldquo;Big Man,&rdquo; then chiefs, sacred kings, emperors, and the state. Center Study follows this thread, reading the social order as an effect of the engagement between periphery and center.
          </p>
          <p>
            One significant difference from Girard: whereas Girard places the scapegoating mechanism at the origin of the human, Gans places it here — in the centrality of the human charged with mediating between the divine and the human. Much of democratic politics is organized around directing resentment toward the figure at the center. We have become accustomed to see this as harmless. More recently we have noticed that the rules governing the replacement of one central figure by another may be more fragile than we realized.
          </p>
          <p>
            The center is never absent from human activity. Where it appears absent, it has been displaced — into institutions that disavow their centrality, into procedures that pretend to be centerless, into &ldquo;the market&rdquo; or &ldquo;the conversation&rdquo; or &ldquo;the process.&rdquo; The diagnostic question is always: <em>what is the actual center here, and who occupies it?</em>
          </p>
        </div>
      </section>

      {/* ── Originary Grammar ───────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          Originary Grammar
        </h2>
        <div className="space-y-4 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            Center Study is the work of remaking the vocabularies of the human sciences in terms of the &ldquo;originary grammar&rdquo; first developed in <em>The Origin of Language</em>. This grammar traces language from the earliest ostensive sign through the imperative, the interrogative, and finally the declarative.
          </p>

          {/* Grammar sequence diagram */}
          <div className="my-6 flex flex-wrap items-center gap-2 text-sm">
            {[
              { label: 'Ostensive', note: 'this' },
              { label: 'Imperative', note: 'give me this' },
              { label: 'Interrogative', note: 'is this?' },
              { label: 'Declarative', note: 'this is so' },
            ].map((item, i, arr) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <span className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium text-xs">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5 italic">{item.note}</span>
                </div>
                {i < arr.length - 1 && (
                  <svg className="h-3 w-3 text-gray-300 flex-shrink-0 mb-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          <p>
            This means we are always thinking in terms of scenes — no ideas or concepts, but scenes in which some kind of exchange with some &ldquo;metaperson&rdquo; is involved. There is a necessary self-reflexivity here: we are always discussing things from within some scene and therefore simultaneously referring, at least implicitly, to that scene and its relation to the center.
          </p>
        </div>
      </section>

      {/* ── Politics from the Center ────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          Politics from the Center
        </h2>
        <div className="space-y-4 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            Politically, Center Study involves a critique of theories that start from the &ldquo;bottom&rdquo; — the free subject, the people, the social contract — insisting on starting from the center: from where authority and an originary distribution is assumed to have taken place and set the terms for future distributions and exchanges.
          </p>
          <p>
            The question is not sacred versus secular — that distinction is derived and unstable. The question is how sacrality persists, migrates, or attenuates as institutional forms evolve from ritual into law, into money, into code. The algorithm is a supplementary medium for the internet — scenic design without the ritual scene. Every automated decision defers some rivalry over the terms on which that decision is made, while empowering one center over another.
          </p>
          <p>
            The problem of the center is the problem of thematizing and performing social continuity — which ultimately means staging the succession from one central figure to the next. Only in this way can power be united with responsibility in transgenerational ways.
          </p>
        </div>
      </section>

      {/* ── The Paradox ─────────────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 italic mb-3">
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
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">GABlog</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Katz&rsquo;s theoretical archive — originary grammar in development</p>
          </Link>
          <Link href="/browse/substack" className="group block p-4 rounded-xl border border-orange-100 dark:border-orange-900/40 hover:border-orange-400 dark:hover:border-orange-600 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Substack</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Bouvard&rsquo;s applied essays on AI, governance, and technology</p>
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
