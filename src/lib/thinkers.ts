// Precomputed influence graph (scripts/generate-thinkers.ts). Pure JSON lookup.

import fs from 'fs';
import path from 'path';

export interface ThinkerPost { slug: string; title: string; date: string | null; count: number; }
export interface Thinker {
  name: string;
  note: string;
  mentions: number;
  postCount: number;
  topPosts: ThinkerPost[];
  related: { name: string; count: number }[];
}
export interface ThinkerEdge { a: string; b: string; weight: number; }

let _data: { thinkers: Thinker[]; edges: ThinkerEdge[] } | null | undefined;

export function loadThinkers(): { thinkers: Thinker[]; edges: ThinkerEdge[] } | null {
  if (_data === undefined) {
    try {
      _data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'thinkers.json'), 'utf-8'));
    } catch {
      _data = null;
    }
  }
  return _data ?? null;
}
