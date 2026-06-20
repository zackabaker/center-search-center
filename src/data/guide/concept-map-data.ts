// The concept map is DERIVED from the glossary (concepts.ts) so it always covers
// every concept and stays in sync. The originary scene sits at the center;
// foundational concepts form an inner ring; the rest form an outer ring. Edges
// come from each concept's `relations`.

import { CONCEPTS } from './concepts';

export interface MapNode {
  id: string;
  label: string;
  x: number;  // normalized 0-1
  y: number;
  tier: 'core' | 'primary' | 'secondary';
  description: string;
}

export interface MapEdge {
  source: string;
  target: string;
  type: 'dependency' | 'elaboration' | 'tension' | 'sequence';
  label?: string;
}

const CORE = ['originary-scene'];
const PRIMARY = [
  'the-center', 'deferral', 'the-sacred', 'ostensive-imperative-declarative',
  'mimesis', 'nomos', 'resentment-victimary', 'originary-grammar',
];

const bySlug = new Map(CONCEPTS.map((c) => [c.slug, c]));
const has = (s: string) => bySlug.has(s);

function tierOf(slug: string): MapNode['tier'] {
  if (CORE.includes(slug)) return 'core';
  if (PRIMARY.includes(slug)) return 'primary';
  return 'secondary';
}

const primary = PRIMARY.filter(has);
const secondary = CONCEPTS.map((c) => c.slug).filter((s) => !CORE.includes(s) && !primary.includes(s));

// Place a list of slugs evenly around a ring of the given radius.
function ring(slugs: string[], radius: number, phase = 0): { slug: string; x: number; y: number }[] {
  return slugs.map((slug, i) => {
    const a = phase + (i / Math.max(1, slugs.length)) * Math.PI * 2 - Math.PI / 2;
    return { slug, x: 0.5 + radius * Math.cos(a), y: 0.5 + radius * Math.sin(a) };
  });
}

const placed = [
  ...CORE.filter(has).map((slug) => ({ slug, x: 0.5, y: 0.5 })),
  ...ring(primary, 0.2),
  ...ring(secondary, 0.4, 0.22),
];
const placedSet = new Set(placed.map((p) => p.slug));

export const MAP_NODES: MapNode[] = placed.map(({ slug, x, y }) => {
  const c = bySlug.get(slug)!;
  return {
    id: slug,
    label: c.title,
    x, y,
    tier: tierOf(slug),
    description: c.subtitle || c.definition.slice(0, 90),
  };
});

// Edges from each concept's relations — undirected, de-duplicated. Links to the
// scene/center read as "dependency" (solid grey); everything else "elaboration".
const seen = new Set<string>();
export const MAP_EDGES: MapEdge[] = [];
for (const c of CONCEPTS) {
  if (!placedSet.has(c.slug)) continue;
  for (const r of c.relations) {
    if (!placedSet.has(r)) continue;
    const key = [c.slug, r].sort().join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    const touchesCore = c.slug === 'originary-scene' || r === 'originary-scene' || c.slug === 'the-center' || r === 'the-center';
    MAP_EDGES.push({ source: c.slug, target: r, type: touchesCore ? 'dependency' : 'elaboration' });
  }
}
