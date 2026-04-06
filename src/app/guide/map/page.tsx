import Link from 'next/link';
import { Suspense } from 'react';
import ConceptMapClient from './ConceptMapClient';
import { CONCEPTS } from '@/data/guide/concepts';
import { MAP_NODES, MAP_EDGES } from '@/data/guide/concept-map-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Concept Map',
  description: 'Interactive concept map of Center Study — centered on the originary scene, radiating outward through dependency and elaboration.',
};

export default function MapPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/guide" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">← Guide</Link>
        <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-4 mb-2">Layer IV · Visual</p>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">Concept Map</h1>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl text-sm">
          The originary scene is at the center. Every other concept radiates from it through dependency, elaboration, tension, or sequence. Click any node to see its connections and navigate to its concept page. The map is centered — it has a visible center. That is the point.
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6 text-xs text-gray-400 dark:text-gray-500">
        <span><strong className="text-gray-700 dark:text-gray-300">{MAP_NODES.length}</strong> concepts</span>
        <span><strong className="text-gray-700 dark:text-gray-300">{MAP_EDGES.length}</strong> connections</span>
        <span><strong className="text-gray-700 dark:text-gray-300">3</strong> tiers</span>
      </div>

      {/* Interactive map */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
        <Suspense fallback={<div className="h-[500px] flex items-center justify-center text-gray-400 text-sm">Loading map…</div>}>
          <ConceptMapClient width={720} height={520} />
        </Suspense>
      </div>

      {/* All concepts list as fallback / supplement */}
      <section className="mt-10">
        <h2 className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">All Concepts</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {CONCEPTS.map((c) => {
            const node = MAP_NODES.find((n) => n.id === c.slug);
            return (
              <Link
                key={c.slug}
                href={`/guide/concepts/${c.slug}`}
                className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  node?.tier === 'core' ? 'bg-gray-900' :
                  node?.tier === 'primary' ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{c.title}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto hidden sm:block">{c.relations.length} relations</span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
