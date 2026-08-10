import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// "The Center of Everything" — a Wait But Why-style introduction to Center
// Study, served as a standalone HTML document so it keeps its own visual
// world (Georgia, stick-figure SVGs, blue boxes) instead of the site chrome.
// Credit for the style: Tim Urban / Wait But Why. Drafted by Claude (Fable),
// fact-checked against the corpus before publication.
export const revalidate = 3600;

export async function GET() {
  const html = await readFile(
    join(process.cwd(), 'src/data/the-center-of-everything.html'),
    'utf8'
  );
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
