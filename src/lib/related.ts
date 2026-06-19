// Precomputed semantic "related essays" — a slug -> nearest-neighbour-slugs map
// built at prebuild (scripts/generate-embeddings.ts). Pure JSON lookup at
// runtime: no model, no vectors, no transformers dependency. Returns [] if the
// index is missing, so callers fall back to lexical relatedness.

import fs from 'fs';
import path from 'path';

let _related: Record<string, { slug: string; score: number }[]> | null | undefined;

function load(): Record<string, { slug: string; score: number }[]> | null {
  if (_related === undefined) {
    try {
      _related = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'related.json'), 'utf-8'));
    } catch {
      _related = null;
    }
  }
  return _related ?? null;
}

export function relatedSlugs(slug: string, limit = 6): string[] {
  const map = load();
  if (!map) return [];
  return (map[slug] ?? []).slice(0, limit).map((r) => r.slug);
}

export function hasRelatedIndex(): boolean {
  return load() !== null;
}
