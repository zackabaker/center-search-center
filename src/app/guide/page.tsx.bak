import Link from 'next/link';
import type { Metadata } from 'next';
import { CONCEPTS } from '@/data/guide/concepts';
import { READING_PATHS } from '@/data/guide/reading-paths';

export const metadata: Metadata = {
  title: 'Introduction to Center Study',
  description: 'A comprehensive, hyperlinked guide to the concepts, reading paths, and intellectual architecture of Center Study — drawn from the complete archive.',
};

export default function GuidePage() {
  const coreConceptSlugs = ['the-center', 'originary-scene', 'deferral', 'ostensive-imperative-declarative', 'the-sacred'];
  const coreConcepts = coreConceptSlugs.map((s) => CONCEPTS.find((c) => c.slug === s)!).filter(Boolean);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 sm:py-16">

      {/* Entry point — ostensive mode. Points. Does not explain. */}
      <header className="mb-16">
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">
          Layer I · Entry Point · Ostensive
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-6">
          Introduction to Center Study
        </h1>
        <div className="prose-guide max-w-none space-y-5 text-gray-700 leading-relaxed">
          <p className="text-lg">
            <strong>This.</strong> A group of beings converge on an object. Each reaches for it. Each perceives the others reaching. The gesture aborts. The aborted gesture, emitted to all and received from all as the same sign, is the first sign: <em>this</em>. The scene that produced it is the originary scene. The binding force that made the sign work for everyone simultaneously is the sacred. The object that organized the scene is the center. What you are reading is an attempt to make those three concepts — scene, sacred, center — available to a reader encountering them for the first time.
          </p>
          <p>
            Center Study is not a theory to be evaluated from outside. It is a disciplinary practice — a set of concepts, methods, and orientations that you either enter or do not. This guide is a door. Whether you walk through it depends on whether the concepts it opens do what concepts are supposed to do: make things visible that were invisible, name what was already present but unnamed, give you handles on problems that had no handles before.
          </p>
          <p>
            The major axes are these: <strong>center / periphery</strong> — every human scene has a center; every participant is on the periphery until they occupy it. <strong>Ostensive / imperative / declarative</strong> — the three forms of language, in originary order; getting the order right changes everything. <strong>Sacred / secular</strong> — not a theological distinction but a functional one; the sacred is whatever makes a sign bind everyone on the scene simultaneously. <strong>Deferral / violence</strong> — language defers violence; all institutions are modes of deferral; when deferral fails, violence returns. <strong>Nomos / succession</strong> — the originary distribution and its perpetuation; how the center passes is how the center is. <strong>Debt / credit</strong> — the primary economic relation is not exchange but obligation to the center that constituted you as social.
          </p>
          <p>
            There is a paradox here that is not a problem but a method. Center Study holds that there is no metalanguage — no position outside language from which language can be described neutrally. Any introduction to Center Study is therefore already inside Center Study. This guide cannot stand above its subject and explain it from a neutral vantage. It must teach by exemplifying. The concepts it defines are used in the way they demand to be used; the structure it employs is itself a performance of the sequence it describes.
          </p>
          <p>
            The entry point is ostensive: <em>this</em>. What follows are imperatives: attend to this concept, follow this reading path, orient toward this archive. At the end, if the guide has done its work, you will be in a position to make declarative claims — to say things about the structure of human experience that you could not have said before, with the precision that the archive demands. That is what Center Study offers.
          </p>
          <p className="text-gray-500 italic border-l-2 border-gray-200 pl-4">
            "The only thing we are ever talking about is how we are going about deferring violence." — Adam Katz, <em>The Linguistic Turn and Generative Literacy</em>
          </p>
        </div>
      </header>

      {/* Navigation to layers */}
      <section className="mb-16">
        <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-6">Navigate the Guide</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              href: '/guide/concepts',
              label: 'Concept Pages',
              layer: 'Layer II · Imperative',
              desc: `${CONCEPTS.length} core concepts — each with originary definition, archive development, and exemplary passages.`,
              color: 'border-blue-200 hover:border-blue-400',
            },
            {
              href: '/guide/reading-paths',
              label: 'Reading Paths',
              layer: 'Layer III · Declarative',
              desc: `${READING_PATHS.length} curated sequences through the archive — ordered, bridged, and contextualized.`,
              color: 'border-green-200 hover:border-green-400',
            },
            {
              href: '/guide/map',
              label: 'Concept Map',
              layer: 'Layer IV · Visual',
              desc: 'Interactive graph of concept dependencies — centered on the originary scene, radiating outward.',
              color: 'border-purple-200 hover:border-purple-400',
            },
            {
              href: '/guide/timeline',
              label: 'Archive Timeline',
              layer: 'Layer V · Chronological',
              desc: 'The complete archive in chronological order — Center Study as it actually unfolded in time.',
              color: 'border-orange-200 hover:border-orange-400',
            },
          ].map(({ href, label, layer, desc, color }) => (
            <Link
              key={href}
              href={href}
              className={`group block p-5 rounded-xl border-2 ${color} transition-all hover:shadow-sm bg-white`}
            >
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">{layer}</p>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Core concepts preview */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest">Five Core Concepts</h2>
          <Link href="/guide/concepts" className="text-xs text-blue-500 hover:underline">All {CONCEPTS.length} concepts →</Link>
        </div>
        <div className="space-y-3">
          {coreConcepts.map((concept) => (
            <Link
              key={concept.slug}
              href={`/guide/concepts/${concept.slug}`}
              className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all bg-white"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                  {concept.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{concept.definition}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 group-hover:text-blue-400 transition-colors mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* Begin reading */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest">Start Reading</h2>
          <Link href="/guide/reading-paths" className="text-xs text-blue-500 hover:underline">All paths →</Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {READING_PATHS.slice(0, 4).map((path) => (
            <Link
              key={path.slug}
              href={`/guide/reading-paths/${path.slug}`}
              className="group block p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all bg-white"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  {path.posture}
                </span>
                <span className="text-[10px] text-gray-300">·</span>
                <span className="text-[10px] text-gray-400">{path.posts.length} texts</span>
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 text-sm">{path.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{path.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* What this guide is not */}
      <section className="border-t border-gray-100 pt-10">
        <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">What This Guide Is Not</h2>
        <div className="text-sm text-gray-500 space-y-3 leading-relaxed">
          <p>
            This is not a summary of Center Study. A summary substitutes for the thing it summarizes; this guide is designed to make the thing more accessible, not to replace it. The archive is the thing. This is a map of the archive — and a map that teaches you how to read the territory.
          </p>
          <p>
            This is not a glossary. A glossary defines terms from outside the discourse in which they have meaning. The definitions here are written from inside — they use the concepts they are defining in the way those concepts demand to be used. If the definitions seem to require the concepts they are trying to introduce, that is not a failure of exposition but a feature of the subject matter.
          </p>
          <p>
            This is not neutral. There is no neutral vantage on Center Study. The guide speaks from inside the discourse, with fidelity to the archive, without pretending to evaluate Center Study from a position that would require the very metalanguage Center Study denies.
          </p>
          <p className="text-gray-400">
            Every post in the archive is referenced somewhere in this guide.{' '}
            <Link href="/search" className="text-blue-400 hover:underline">Search the full archive →</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
