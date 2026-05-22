import { getPostBySlug } from '@/lib/parser';
import { NextRequest } from 'next/server';

// Clean, minimal HTML endpoint — no navigation chrome.
// Designed for direct reading, TTS apps (ElevenReader, Voice Dream, etc.), and Safari Reader mode.
// Dark mode toggle + font-size steps stored in localStorage.

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
      if (p.startsWith('# '))   return `<h2>${escapeHtml(p.slice(2))}</h2>`;
      if (p.startsWith('## '))  return `<h3>${escapeHtml(p.slice(3))}</h3>`;
      if (p.startsWith('### ')) return `<h4>${escapeHtml(p.slice(4))}</h4>`;
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
  <meta property="og:title"   content="${escapeHtml(post.title)}" />
  <meta property="og:type"    content="article" />
  <meta property="og:url"     content="${canonicalUrl}" />
  ${post.date ? `<meta property="article:published_time" content="${post.date}" />` : ''}

  <!-- Quality reading serif — loads fast, cached across sessions -->
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />

  <!-- Apply saved theme + font-size before first paint (no FOUC) -->
  <script>
    (function () {
      try {
        var pref = localStorage.getItem('reader-theme');
        if (pref === 'dark' || (!pref && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
        var sz = parseInt(localStorage.getItem('reader-font-step') || '1', 10);
        if (sz >= 0 && sz <= 3) document.documentElement.dataset.fs = sz;
      } catch (e) {}
    })();
  </script>

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Font-size steps: 0=small 1=default 2=large 3=xl ── */
    :root                    { --fs: 20px; --lh: 1.85; }
    [data-fs="0"]            { --fs: 17px; --lh: 1.8;  }
    [data-fs="1"]            { --fs: 20px; --lh: 1.85; }
    [data-fs="2"]            { --fs: 23px; --lh: 1.9;  }
    [data-fs="3"]            { --fs: 26px; --lh: 1.95; }

    /* ── Light theme ── */
    :root {
      --bg:          #ffffff;
      --fg:          #111111;
      --meta-color:  #888;
      --border:      #e8e8e8;
      --toolbar-bg:  rgba(255,255,255,0.92);
      --toolbar-border: #e0e0e0;
      --btn-hover:   #f0f0f0;
      --btn-active:  #e4e4e4;
    }

    /* ── Dark theme — warm, easy on eyes, Kindle-inspired ── */
    html.dark {
      --bg:          #1c1917;
      --fg:          #cec9c0;
      --meta-color:  #6e6861;
      --border:      #2d2a26;
      --toolbar-bg:  rgba(28,25,23,0.95);
      --toolbar-border: #3a3630;
      --btn-hover:   #2a2724;
      --btn-active:  #333028;
    }

    html, body { background: var(--bg); color: var(--fg); }

    body {
      max-width: min(660px, 100% - 48px);
      margin: 0 auto;
      padding: 64px 0 100px;
      font-family: 'Lora', Palatino, 'Palatino Linotype', Georgia, serif;
      font-size: var(--fs);
      line-height: var(--lh);
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }

    @media (max-width: 600px) {
      body { padding: 48px 0 80px; }
      :root    { --fs: 18px; }
      [data-fs="0"] { --fs: 16px; }
      [data-fs="1"] { --fs: 18px; }
      [data-fs="2"] { --fs: 21px; }
      [data-fs="3"] { --fs: 24px; }
    }

    /* ── Toolbar ── */
    #toolbar {
      position: fixed;
      top: 12px;
      right: 14px;
      display: flex;
      align-items: center;
      gap: 2px;
      background: var(--toolbar-bg);
      border: 1px solid var(--toolbar-border);
      border-radius: 10px;
      padding: 4px 6px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 100;
    }

    #toolbar button {
      border: none;
      background: transparent;
      color: var(--fg);
      cursor: pointer;
      border-radius: 6px;
      padding: 5px 9px;
      font-size: 13px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-weight: 500;
      line-height: 1;
      transition: background .12s;
      min-width: 32px;
    }
    #toolbar button:hover  { background: var(--btn-hover); }
    #toolbar button:active { background: var(--btn-active); }

    #toolbar .divider {
      width: 1px;
      height: 18px;
      background: var(--toolbar-border);
      margin: 0 3px;
    }

    #btn-theme { font-size: 15px; padding: 5px 8px; }

    /* ── Back link ── */
    .back-link {
      display: inline-block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      color: var(--meta-color);
      text-decoration: none;
      margin-bottom: 40px;
      letter-spacing: .01em;
    }
    .back-link:hover { color: var(--fg); }

    /* ── Title ── */
    h1.title {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: clamp(26px, 6vw, 40px);
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: -0.025em;
      margin-bottom: 14px;
      color: var(--fg);
    }

    /* ── Meta ── */
    .meta {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      color: var(--meta-color);
      letter-spacing: .02em;
      text-transform: uppercase;
      margin-bottom: 48px;
    }

    /* ── Body copy ── */
    .content p {
      margin-bottom: 1.6em;
      hanging-punctuation: first last;
    }

    /* First paragraph — slightly larger cap or drop feel isn't possible in plain HTML,
       but we can remove the top margin so it flows directly from the divider */
    .content p:first-child { margin-top: 0; }

    .content h2, .content h3, .content h4 {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-weight: 700;
      margin: 2.2em 0 0.7em;
      line-height: 1.25;
      color: var(--fg);
      letter-spacing: -0.01em;
    }
    .content h2 { font-size: 1.3em; }
    .content h3 { font-size: 1.12em; }
    .content h4 { font-size: 1.0em; letter-spacing: .04em; text-transform: uppercase; }

    /* ── Footer source link ── */
    .source-link {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      color: var(--meta-color);
      text-decoration: none;
      margin-top: 64px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
      letter-spacing: .01em;
    }
    .source-link:hover { color: var(--fg); }
  </style>
</head>
<body>

  <!-- Toolbar: font size + dark mode -->
  <div id="toolbar" role="toolbar" aria-label="Reading controls">
    <button id="btn-sm" title="Smaller text" aria-label="Decrease font size">A−</button>
    <button id="btn-lg" title="Larger text"  aria-label="Increase font size">A+</button>
    <div class="divider"></div>
    <button id="btn-theme" title="Toggle dark mode" aria-label="Toggle dark mode">☾</button>
  </div>

  <a class="back-link" href="${canonicalUrl}">← center.study</a>

  <h1 class="title">${escapeHtml(post.title)}</h1>
  <div class="meta">${escapeHtml(metaParts)}</div>

  <div class="content">
    ${bodyHtml}
  </div>

  ${post.url ? `<a class="source-link" href="${escapeHtml(post.url)}" rel="noopener">View original →</a>` : ''}

  <script>
    (function () {
      var html = document.documentElement;
      var STEPS = 4;

      /* ── Theme ── */
      var btnTheme = document.getElementById('btn-theme');
      function isDark() { return html.classList.contains('dark'); }
      function setThemeIcon() { btnTheme.textContent = isDark() ? '☀' : '☾'; }
      setThemeIcon();
      btnTheme.addEventListener('click', function () {
        html.classList.toggle('dark');
        try { localStorage.setItem('reader-theme', isDark() ? 'dark' : 'light'); } catch (e) {}
        setThemeIcon();
      });

      /* ── Font size ── */
      var step = parseInt(html.dataset.fs || '1', 10);
      function applyStep(s) {
        step = Math.max(0, Math.min(STEPS - 1, s));
        html.dataset.fs = step;
        try { localStorage.setItem('reader-font-step', step); } catch (e) {}
      }
      document.getElementById('btn-sm').addEventListener('click', function () { applyStep(step - 1); });
      document.getElementById('btn-lg').addEventListener('click', function () { applyStep(step + 1); });
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
