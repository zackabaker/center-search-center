import { getPublicPosts } from '@/lib/parser';
import { buildEpub, EpubChapter } from '@/lib/epub';

// Compile selected texts into a downloadable booklet.
// GET /api/booklet?slugs=a,b,c&title=My%20Seminar&format=epub|html|txt
//   epub (default) — for e-readers and listening apps (ElevenReader etc.)
//   html           — single self-contained readable file
//   txt            — plain text
// Capped at 25 texts; public posts only. Used by the reading list and
// saved reading paths — not a bulk exporter (that's /api/download).

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Bouvard Substack',
  gablog: 'GABlog',
  book: 'Anthropomorphics',
  pdf: 'Essays & Articles',
  reddit: 'Reddit',
  twitter: 'X / Twitter',
  chronicle: 'Chronicles of Love and Resentment',
  ap: 'Anthropoetics Journal',
};

function authorFor(source: string, author?: string): string {
  if (source === 'ap') return author ?? 'Various authors';
  if (source === 'chronicle') return 'Eric Gans';
  if (source === 'substack' || source === 'reddit' || source === 'twitter') return 'Dennis Bouvard (Adam Katz)';
  return 'Adam Katz';
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slugsParam = searchParams.get('slugs');
  const title = (searchParams.get('title') || 'Center Study Reading').slice(0, 120);
  const format = searchParams.get('format') || 'epub';

  if (!slugsParam) {
    return Response.json({ error: 'slugs parameter is required' }, { status: 400 });
  }
  const slugs = slugsParam.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 25);

  const bySlug = new Map(getPublicPosts().map((p) => [p.slug, p]));
  const posts = slugs.map((s) => bySlug.get(s)).filter((p) => p !== undefined);
  if (posts.length === 0) {
    return Response.json({ error: 'No matching texts' }, { status: 404 });
  }

  const filenameBase = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'center-study';

  const chapters: EpubChapter[] = posts.map((p) => ({
    title: p.title,
    author: authorFor(p.source, p.author),
    sourceLabel: SOURCE_LABELS[p.source] ?? p.source,
    date: p.date ?? null,
    content: p.content,
  }));

  if (format === 'epub') {
    const epub = buildEpub(title, chapters);
    return new Response(epub as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/epub+zip',
        'Content-Disposition': `attachment; filename="${filenameBase}.epub"`,
        'Cache-Control': 'no-store',
      },
    });
  }

  if (format === 'html') {
    const toc = chapters
      .map((ch, i) => `<li><a href="#ch${i}">${esc(ch.title)}</a></li>`)
      .join('\n');
    const body = chapters
      .map((ch, i) => {
        const paras = ch.content
          .split(/\n\n+/)
          .map((x) => x.trim())
          .filter(Boolean)
          .map((x) => {
            if (x === '---') return '<hr/>';
            const h = x.match(/^(#{1,3})\s+([\s\S]*)$/);
            if (h) return `<h${h[1].length + 2}>${esc(h[2])}</h${h[1].length + 2}>`;
            if (x.startsWith('> ')) return `<blockquote><p>${esc(x.slice(2))}</p></blockquote>`;
            return `<p>${esc(x)}</p>`;
          })
          .join('\n');
        return `<article id="ch${i}">
<h2>${i + 1}. ${esc(ch.title)}</h2>
<p class="meta">${esc(ch.author)} · ${esc(ch.sourceLabel)}${ch.date ? ` · ${esc(ch.date)}` : ''}</p>
${paras}
</article>`;
      })
      .join('\n<hr class="chapter-break"/>\n');

    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(title)}</title>
<style>
body { font-family: Georgia, 'Times New Roman', serif; max-width: 42em; margin: 3em auto; padding: 0 1.5em; line-height: 1.65; color: #1a1a1a; }
h1 { font-size: 1.8em; } h2 { font-size: 1.35em; margin-top: 0; }
.meta { color: #666; font-size: 0.85em; margin-bottom: 2em; }
nav { margin: 2em 0 3em; padding: 1.5em; background: #f7f7f5; border-radius: 8px; }
blockquote { margin: 1em 1.5em; font-style: italic; color: #444; }
hr.chapter-break { border: none; border-top: 1px solid #ddd; margin: 4em 20%; }
@media print { nav { background: none; } article { page-break-before: always; } }
</style></head>
<body>
<h1>${esc(title)}</h1>
<p class="meta">${chapters.length} texts · compiled from <a href="https://center.study">center.study</a></p>
<nav><strong>Contents</strong><ol>${toc}</ol></nav>
${body}
</body></html>`;
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filenameBase}.html"`,
        'Cache-Control': 'no-store',
      },
    });
  }

  // txt
  const divider = '─'.repeat(64);
  const txt = [
    title,
    `${chapters.length} texts · compiled from center.study`,
    '',
    'CONTENTS',
    ...chapters.map((ch, i) => `${i + 1}. ${ch.title}`),
    '',
    divider,
    '',
    ...chapters.flatMap((ch, i) => [
      `${i + 1}. ${ch.title}`,
      `${ch.author} · ${ch.sourceLabel}${ch.date ? ` · ${ch.date}` : ''}`,
      '',
      ch.content.trim(),
      '',
      divider,
      '',
    ]),
  ].join('\n');
  return new Response(txt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filenameBase}.txt"`,
      'Cache-Control': 'no-store',
    },
  });
}
