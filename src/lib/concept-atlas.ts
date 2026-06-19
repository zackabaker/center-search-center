// Precomputed Concept Atlas — for each concept, the passages across the corpus
// that express it most directly, ordered by date (built by
// scripts/generate-concept-passages.ts). Pure JSON lookup at runtime; no model.

import fs from 'fs';
import path from 'path';

export interface AtlasPassage {
  slug: string;
  title: string;
  date: string | null;
  text: string;
  score: number;
}

let _atlas: Record<string, AtlasPassage[]> | null | undefined;

function load(): Record<string, AtlasPassage[]> | null {
  if (_atlas === undefined) {
    try {
      _atlas = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'concept-passages.json'), 'utf-8'));
    } catch {
      _atlas = null;
    }
  }
  return _atlas ?? null;
}

export function atlasPassages(conceptSlug: string): AtlasPassage[] {
  const a = load();
  return a?.[conceptSlug] ?? [];
}
