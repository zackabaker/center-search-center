import Link from 'next/link';
import { CONCEPTS } from '@/data/guide/concepts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Concept Map | Center Study Center',
  description:
    'The vocabulary of Center Study, organized by theme — each concept with a plain definition, how it connects to the others, and a passage from the texts.',
};

// Concepts grouped thematically, in a learning order (scene → language → order →
// practice → critique). Mirrors the glossary tiers.
const TIERS: { label: string; blurb: string; slugs: string[] }[] = [
  {
    label: 'The Scene and Its Elements',
    blurb: 'The originary hypothesis and what the founding scene contains.',
    slugs: ['originary-scene', 'the-center', 'deferral', 'the-sacred', 'mimesis', 'desire', 'ritual', 'sparagmos'],
  },
  {
    label: 'Language and Grammar',
    blurb: 'How the sign works and the grammar that grows from it.',
    slugs: ['ostensive-imperative-declarative', 'originary-grammar', 'the-sign', 'idiom'],
  },
  {
    label: 'Order and Distribution',
    blurb: 'How the center is held, passed on, and paid — from the first big man to money.',
    slugs: ['nomos', 'succession', 'the-juridical', 'debt-and-credit', 'big-man', 'omnicentrism'],
  },
  {
    label: 'Practice and Institution',
    blurb: 'Working the scene: design, personhood, attention.',
    slugs: ['scenic-design', 'anthropomorphics', 'pointman-uninsurable', 'attentionality'],
  },
  {
    label: 'Pathology and Critique',
    blurb: 'What goes wrong when the center is denied.',
    slugs: ['resentment-victimary'],
  },
];

export default function ConceptMapPage() {
  const bySlug = new Map(CONCEPTS.map((c) => [c.slug, c]));
  const grouped = new Set(TIERS.flatMap((t) => t.slugs));
  const leftovers = CONCEPTS.filter((c) => !grouped.has(c.slug)).map((c) => c.slug);
  const tiers = leftovers.length
    ? [...TIERS, { label: 'More', blurb: '', slugs: leftovers }]
    : TIERS;

  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10 pb-24">
      <div className="mb-8">
        <Link href="/guide" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">← Guide</Link>
        <h1 className="text-2xl sm:text-3xl font-bold mt-4 mb-3 text-gray-900 dark:text-white">Concept Map</h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
          The whole vocabulary, grouped by theme and in a rough learning order. Each concept gets a plain
          definition, the ideas it connects to, and a line from the texts. Read top to bottom for an
          orientation, or jump around by following the connections.
        </p>
      </div>

      {/* Quick jump */}
      <nav className="flex flex-wrap gap-2 mb-10">
        {tiers.map((t) => (
          <a key={t.label} href={`#${t.label.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-xs px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            {t.label}
          </a>
        ))}
      </nav>

      {tiers.map((tier) => (
        <section key={tier.label} id={tier.label.replace(/\s+/g, '-').toLowerCase()} className="mb-12 scroll-mt-20">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">{tier.label}</h2>
          {tier.blurb && <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">{tier.blurb}</p>}
          <div className="space-y-6">
            {tier.slugs.map((slug) => {
              const c = bySlug.get(slug);
              if (!c) return null;
              const passage = c.passages?.[0]?.text?.replace(/^["“”']+|["“”']+$/g, '').trim();
              return (
                <div key={slug} id={slug} className="scroll-mt-20 border-l-2 border-gray-100 dark:border-gray-800 pl-4">
                  <Link href={`/guide/concepts/${slug}`} className="group inline-flex items-baseline gap-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{c.title}</h3>
                    <span className="text-xs text-gray-300 dark:text-gray-600 group-hover:text-blue-400">read →</span>
                  </Link>
                  <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed mt-1">{c.definition}</p>
                  {passage && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed mt-2 border-l border-gray-200 dark:border-gray-700 pl-3" style={{ fontFamily: 'var(--prose-font-family)' }}>
                      &ldquo;{passage.length > 240 ? passage.slice(0, 240).replace(/\s+\S*$/, '') + '…' : passage}&rdquo;
                    </p>
                  )}
                  {c.relations.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">Connects to</span>
                      {c.relations.filter((r) => bySlug.has(r)).map((r) => (
                        <a key={r} href={`#${r}`} className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                          {bySlug.get(r)!.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
