import { getPostBySlug } from '@/lib/parser';
import { NextRequest } from 'next/server';

// Clean, minimal HTML endpoint — no JS, no navigation chrome.
// Designed for TTS apps (ElevenReader, Voice Dream, etc.) and Safari Reader mode.
// Share this URL directly to any listen app for the best experience.

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Substack',
  gablog:   'GABlog',
  book:     'Anthropomorphics',
  pdf:      'PDF',
  reddit:   'Reddit',
  twitter:  'X / Twitter',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new Response('Post not found', { status: 404 });
  }

  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 230));
  const sourceLabel = SOURCE_LABELS[post.source] ?? post.source;

  // Filter out subscribe prompts and newsletter footers
  const paragraphs = post.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20)
    .filter((p) =>
      !p.includes('Thanks for reading Center Study Center') &&
      !p.match(/^Subscribe$/) &&
      !p.match(/^Share$/)
    );

  const bodyHtml = paragraphs
    .map((p) => {
      // Preserve heading structure if the paragraph starts with # markers
      if (p.startsWith('# '))  return `<h1>${escapeHtml(p.slice(2))}</h1>`;
      if (p.startsWith('## ')) return `<h2>${escapeHtml(p.slice(3))}</h2>`;
      if (p.startsWith('### ')) return `<h3>${escapeHtml(p.slice(4))}</h3>`;
      return `<p>${escapeHtml(p)}</p>`;
    })
    .join('\n');

  const metaParts = [sourceLabel, post.date, `${readingTime} min read`]
    .filter(Boolean)
    .join(' · ');

  const canonicalUrl = `https://center.study/post/${slug}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(post.title)}</title>
  <meta name="description" content="${escapeHtml(paragraphs[0]?.slice(0, 160) ?? '')}" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(post.title)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonicalUrl}" />
  ${post.date ? `<meta property="article:published_time" content="${post.date}" />` : ''}

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      max-width: 680px;
      margin: 0 auto;
      padding: 48px 20px 80px;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 19px;
      line-height: 1.75;
      color: #1a1a1a;
      background: #fff;
    }

    @media (prefers-color-scheme: dark) {
      body { background: #111; color: #e8e8e8; }
      .back-link { color: #aaa; }
      .back-link:hover { color: #eee; }
      .meta { color: #888; }
      .source-link { color: #888; }
      .divider { border-color: #333; }
    }

    @media (max-width: 640px) {
      body { font-size: 17px; padding: 32px 16px 64px; }
    }

    .back-link {
      display: inline-block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      color: #666;
      text-decoration: none;
      margin-bottom: 32px;
    }
    .back-link:hover { color: #333; }

    h1.title {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: clamp(22px, 5vw, 30px);
      font-weight: 700;
      line-height: 1.25;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
      color: inherit;
    }

    .meta {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      color: #666;
      margin-bottom: 36px;
    }

    .divider {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 36px 0;
    }

    .content p {
      margin-bottom: 1.2em;
    }

    .content h1, .content h2, .content h3 {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-weight: 700;
      margin: 1.8em 0 0.6em;
      line-height: 1.3;
      color: inherit;
    }
    .content h1 { font-size: 1.4em; }
    .content h2 { font-size: 1.2em; }
    .content h3 { font-size: 1.05em; }

    .source-link {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      color: #888;
      text-decoration: none;
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
    }
    .source-link:hover { color: #333; }
  </style>
</head>
<body>

  <a class="back-link" href="${canonicalUrl}">← Back to center.study</a>

  <h1 class="title">${escapeHtml(post.title)}</h1>
  <div class="meta">${escapeHtml(metaParts)}</div>

  <div class="content">
    ${bodyHtml}
  </div>

  ${post.url ? `<a class="source-link" href="${escapeHtml(post.url)}" rel="noopener">View original →</a>` : ''}

</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
