import { getPostBySlug } from '@/lib/parser';
import { NextRequest } from 'next/server';

// Clean, minimal HTML endpoint — no navigation chrome.
// Designed for direct reading, TTS apps (ElevenReader, Voice Dream, etc.), and Safari Reader mode.
// Dark mode toggle + font-size steps stored in localStorage.

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Substack',
  gablog:   'GABlog',
  book:     'Anthropomorphics',
  pdf:      'Essays & Articles',
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
    .filter((p) => {
      const t = p.trim();
      return (
        !t.includes('Thanks for reading') &&
        !t.includes('reader-supported publication') &&
        !t.includes('Subscribe for free to receive new posts') &&
        t !== 'Subscribe' &&
        t !== 'Share'
      );
    });

  // Escape HTML but render markdown links [text](url) as actual <a> tags.
  // Strategy: extract links first, escape everything else, re-insert link HTML.
  function paragraphHtml(raw: string): string {
    // First, extract links, escape everything else, then re-insert links
    const links: string[] = [];
    const withPlaceholders = raw.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, (_, text, url) => {
      links.push(`<a href="${escapeHtml(url)}" rel="noopener">${escapeHtml(text)}</a>`);
      return `\x00${links.length - 1}\x00`;
    });
    const escaped = escapeHtml(withPlaceholders);
    return escaped.replace(/\x00(\d+)\x00/g, (_, idx) => links[parseInt(idx)]);
  }

  const bodyHtml = paragraphs
    .map((p, i) => {
      if (p.startsWith('# '))   return `<h2>${escapeHtml(p.slice(2))}</h2>`;
      if (p.startsWith('## '))  return `<h3>${escapeHtml(p.slice(3))}</h3>`;
      if (p.startsWith('### ')) return `<h4>${escapeHtml(p.slice(4))}</h4>`;
      const cls = i === 0 ? ' class="first-para"' : '';
      return `<p${cls}>${paragraphHtml(p)}</p>`;
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
        var mobile = window.innerWidth <= 600;
        var SIZES = mobile ? ['17px','19px','22px','26px'] : ['18px','21px','25px','29px'];
        var LHS   = mobile ? ['1.8','1.85','1.92','1.98'] : ['1.82','1.9','1.95','2.0'];
        var sz = parseInt(localStorage.getItem('reader-font-step') || '1', 10);
        if (sz < 0 || sz > 3) sz = 1;
        // inline style beats any stylesheet rule — no specificity fight
        document.documentElement.style.setProperty('--fs', SIZES[sz]);
        document.documentElement.style.setProperty('--lh', LHS[sz]);
      } catch (e) {}
    })();
  </script>

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Font size set via JS style.setProperty — no [data-fs] selectors needed ── */
    :root { --fs: 21px; --lh: 1.9; }

    /* ── Light theme — warm paper, not harsh white ── */
    :root {
      --bg:          #f9f6f1;
      --fg:          #1c1917;
      --meta-color:  #8a8278;
      --border:      #e2ddd7;
      --toolbar-bg:  rgba(249,246,241,0.93);
      --toolbar-border: #d8d3cc;
      --btn-hover:   #ede9e3;
      --btn-active:  #e0dbd4;
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
      max-width: min(700px, 100% - 48px);
      margin: 0 auto;
      padding: 80px 0 120px;
      font-family: 'Lora', Palatino, 'Palatino Linotype', Georgia, serif;
      font-size: var(--fs);
      line-height: var(--lh);
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }

    @media (max-width: 600px) {
      body { padding: 48px 0 80px; }
      :root { --fs: 19px; --lh: 1.85; }
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
      padding: 8px 12px;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-weight: 500;
      line-height: 1;
      transition: background .12s;
      min-width: 44px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      -webkit-tap-highlight-color: transparent;
    }
    #toolbar button:hover  { background: var(--btn-hover); }
    #toolbar button:active { background: var(--btn-active); }

    #toolbar .divider {
      width: 1px;
      height: 20px;
      background: var(--toolbar-border);
      margin: 0 2px;
    }

    #btn-theme { font-size: 16px; }

    /* ── Listen note ── */
    .listen-note {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 12px;
      color: var(--meta-color);
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 36px;
      line-height: 1.5;
    }
    .listen-note strong { color: var(--fg); font-weight: 600; }

    /* ── Back link (fixed, mirrors toolbar on the right) ── */
    .back-link {
      position: fixed;
      top: 12px;
      left: 14px;
      display: inline-flex;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: var(--fg);
      text-decoration: none;
      letter-spacing: .01em;
      background: var(--toolbar-bg);
      border: 1px solid var(--toolbar-border);
      border-radius: 10px;
      padding: 6px 11px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 100;
    }
    .back-link:hover  { background: var(--btn-hover); }
    .back-link:active { background: var(--btn-active); }

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
      margin-bottom: 1.7em;
      hanging-punctuation: first last;
    }

    .content p.first-para {
      margin-top: 0;
      text-indent: 1.8em;
    }

    /* ── Inline links (from [text](url) in source) ── */
    .content a {
      color: inherit;
      text-decoration: underline;
      text-decoration-color: var(--meta-color);
      text-underline-offset: 3px;
      text-decoration-thickness: 1px;
    }
    .content a:hover {
      text-decoration-color: var(--fg);
    }

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

    /* ── Share button ── */
    #btn-share-main {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 13px 16px;
      margin-bottom: 28px;
      background: var(--fg);
      color: var(--bg);
      border: none;
      border-radius: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      letter-spacing: -0.01em;
      transition: opacity .15s;
    }
    #btn-share-main:active { opacity: 0.75; }
  </style>
</head>
<body>

  <!-- Toolbar: font size + dark mode -->
  <div id="toolbar" role="toolbar" aria-label="Reading controls">
    <button id="btn-sm" title="Smaller text" aria-label="Decrease font size">A<sup style="font-size:9px">−</sup></button>
    <button id="btn-lg" title="Larger text"  aria-label="Increase font size">A<sup style="font-size:9px">+</sup></button>
    <div class="divider"></div>
    <button id="btn-theme" title="Toggle dark mode" aria-label="Toggle dark mode">☾</button>
  </div>

  <a class="back-link" href="${canonicalUrl}">← center.study</a>

  <button id="btn-share-main" aria-label="Share this post">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
    </svg>
    Share
  </button>

  <div class="listen-note" role="note">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="flex-shrink:0;margin-top:1px">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M12 6a7 7 0 010 12m-3.536-9.536a5 5 0 000 7.072"/>
    </svg>
    <span>This page is designed for listening apps — open it in <strong>ElevenReader</strong>, <strong>Voice Dream</strong>, or tap <strong>Share → ElevenReader</strong> on iPhone. On Safari, tap the <strong>ᴬA</strong> icon then the speaker to use Reader mode.</span>
  </div>

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

      /* ── Share ── */
      var btnShareMain = document.getElementById('btn-share-main');
      var postTitle = ${JSON.stringify(post.title)};
      btnShareMain.addEventListener('click', function () {
        var url = window.location.href;
        if (navigator.share) {
          navigator.share({ title: postTitle, url: url }).catch(function () {});
        } else {
          navigator.clipboard.writeText(url).then(function () {
            btnShareMain.textContent = '✓ Link copied';
            setTimeout(function () {
              btnShareMain.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg> Share';
            }, 2000);
          }).catch(function () {});
        }
      });

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
      var mobile = window.innerWidth <= 600;
      var SIZES = mobile ? ['17px','19px','22px','26px'] : ['18px','21px','25px','29px'];
      var LHS   = mobile ? ['1.8','1.85','1.92','1.98'] : ['1.82','1.9','1.95','2.0'];
      var step = parseInt(localStorage.getItem('reader-font-step') || '1', 10);
      if (step < 0 || step >= SIZES.length) step = 1;

      function applyStep(s) {
        step = Math.max(0, Math.min(SIZES.length - 1, s));
        // inline style.setProperty beats all stylesheet rules — no specificity conflict
        html.style.setProperty('--fs', SIZES[step]);
        html.style.setProperty('--lh', LHS[step]);
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
