// Slim slug → post-metadata lookup, backed by src/data/post-meta.json
// (generated at prebuild by scripts/generate-posts-cache.ts). ~600 KB versus
// the 30+ MB posts-cache — use this wherever a page only needs to LINK to
// posts (title/source/date/excerpt/readingTime), never their content.
// Returns undefined per slug if the map is missing, so callers can fall back.

import fs from 'fs';
import path from 'path';
import { ContentSource } from './types';

export interface PostMeta {
  title: string;
  source: ContentSource;
  date: string | null;
  excerpt: string;
  readingTime: number;
}

let _meta: Record<string, PostMeta> | null | undefined; // undefined = not tried

function load(): Record<string, PostMeta> | null {
  if (_meta === undefined) {
    try {
      _meta = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'post-meta.json'), 'utf-8')
      );
    } catch {
      _meta = null;
    }
  }
  return _meta ?? null;
}

export function getPostMeta(slug: string): PostMeta | undefined {
  return load()?.[slug];
}

export function hasPostMeta(): boolean {
  return load() !== null;
}
