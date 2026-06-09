import { getAllPosts, getPublicPosts } from '@/lib/parser';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Discover only shows curated editorial sources — not threads, archives, or the book
const DISCOVER_SOURCES = new Set(['gablog', 'substack', 'pdf']);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const n = Math.min(10, Math.max(1, parseInt(url.searchParams.get('n') ?? '3', 10)));

  const posts = getPublicPosts().filter((p) => DISCOVER_SOURCES.has(p.source));
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
