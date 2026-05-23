import { getAllPosts } from '@/lib/parser';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const EXCLUDED = new Set(['twitter', 'reddit']);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const n = Math.min(10, Math.max(1, parseInt(url.searchParams.get('n') ?? '3', 10)));

  const posts = getAllPosts().filter((p) => !EXCLUDED.has(p.source));
  const pool = [...posts];
  const picks = [];

  for (let i = 0; i < n && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const post = pool.splice(idx, 1)[0];
    const wordCount = post.content.split(/\s+/).length;
    picks.push({
      slug: post.slug,
      title: post.title,
      source: post.source,
      date: post.date ?? null,
      readingTime: Math.max(1, Math.round(wordCount / 230)),
    });
  }

  return NextResponse.json(picks);
}
