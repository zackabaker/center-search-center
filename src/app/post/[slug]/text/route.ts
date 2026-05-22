import { getPostBySlug } from '@/lib/parser';
import { NextRequest } from 'next/server';

// Clean, minimal HTML endpoint — no navigation chrome.
// Designed for TTS apps (ElevenReader, Voice Dream, etc.) and Safari Reader mode.
// Share this URL directly to any listen app for the best experience.
// Dark mode toggle stores preference in localStorage; respects prefers-color-scheme by default.

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

  <!-- Apply saved dark-mode preference before first paint to avoid flash -->
  <script>
    (function () {
      try {
        var pref = localStorage.getItem('reader-theme');
        if (pref === 'dark' || (!pref && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {}
    })();
  </script>

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Light theme (default) ── */
    :root {
      --bg: #faf9f7;
      --fg: #1a1a1a;
      --meta: #666;
      --border: #ddd;
      --btn-bg: rgba(0,0,0,.06);
      --btn-hover: rgba(0,0,0,.11);
    }

    /* ── Dark theme ── */
    html.dark {
      --bg: #131310;
      --fg: #e6e3db;
      --meta: #888;
      --border: #2e2e2b;
      --btn-bg: rgba(255,255,255,.08);
      --btn-hover: rgba(255,255,255,.14);
    }

    html, body {
      background: var(--bg);
      color: var(--fg);
    }

    body {
      max-width: min(720px, 100% - 40px);
      margin: 0 auto;
      padding: 52px 0 96px;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 21px;
      line-height: 1.8;
    }

    @media (max-width: 640px) {
      body { font-size: 19px; padding: 36px 0 72px; }
    }

    /* ── Dark-mode toggle button ── */
    #theme-toggle {
      position: fixed;
      top: 14px;
      right: 16px;
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: var(--btn-bg);
      color: var(--fg);
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background .15s;
      z-index: 10;
    }
    #theme-toggle:hover { background: var(--btn-hover); }

    /* ── Nav link ── */
    .back-link {
      display: inline-block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      color: var(--meta);
      text-decoration: none;
      margin-bottom: 36px;
    }
    .back-link:hover { color: var(--fg); }

    /* ── Header ── */
    h1.title {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: clamp(24px, 5vw, 34px);
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: -0.02em;
      margin-bottom: 14px;
      color: var(--fg);
    }

    .meta {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      color: var(--meta);
      margin-bottom: 40px;
    }

    /* ── Body copy ── */
    .content p {
      margin-bottom: 1.35em;
    }

    .content h1, .content h2, .content h3 {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-weight: 700;
      margin: 2em 0 0.65em;
      line-height: 1.3;
      color: var(--fg);
    }
    .content h1 { font-size: 1.35em; }
    .content h2 { font-size: 1.15em; }
    .content h3 { font-size: 1.05em; }

    /* ── Footer ── */
    .source-link {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      color: var(--meta);
      text-decoration: none;
      margin-top: 56px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
    }
    .source-link:hover { color: var(--fg); }
  </style>
</head>
<body>

  <!-- Dark / light toggle -->
  <button id="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode">
    <span id="theme-icon"></span>
  </button>

  <a class="back-link" href="${canonicalUrl}">← Back to center.study</a>

  <h1 class="title">${escapeHtml(post.title)}</h1>
  <div class="meta">${escapeHtml(metaParts)}</div>

  <div class="content">
    ${bodyHtml}
  </div>

  ${post.url ? `<a class="source-link" href="${escapeHtml(post.url)}" rel="noopener">View original →</a>` : ''}

  <script>
    (function () {
      var html = document.documentElement;
      var btn  = document.getElementById('theme-toggle');
      var icon = document.getElementById('theme-icon');

      function isDark() { return html.classList.contains('dark'); }

      function setIcon() { icon.textContent = isDark() ? '☀' : '☾'; }
      setIcon();

      btn.addEventListener('click', function () {
        html.classList.toggle('dark');
        try { localStorage.setItem('reader-theme', isDark() ? 'dark' : 'light'); } catch (e) {}
        setIcon();
      });
    })();
  </script>

</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
