import { openCors, preflight } from '@/lib/cors';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { semanticChunks, semanticAvailable } from '@/lib/semantic';
import { EMBED_DIM } from '@/lib/vecmath';
import { getPublicPosts } from '@/lib/parser';

// ── Expand mode (Ask excerpts) ───────────────────────────────────────────────
// expand: true enriches each hit with its containing PARAGRAPH from the posts
// cache plus that paragraph's stable reader anchor (p-N). The paragraph split
// MUST mirror PostContent.tsx exactly (split /\n\n+/, drop empties, drop the
// Substack boilerplate) or anchors land on the wrong block.
const STRIP_PATTERNS = [
  /Thanks for reading Center Study Center/,
  /Thanks for reading GA Newsletter/,
  /reader-supported publication/,
  /^Subscribe$/,
  /^Share$/,
];
let _paraCache: Map<string, string[]> | null = null;
function paragraphsFor(slug: string): string[] | undefined {
  if (!_paraCache) _paraCache = new Map();
  if (!_paraCache.has(slug)) {
    const post = getPublicPosts().find((p) => p.slug === slug);
    if (!post) return undefined;
    _paraCache.set(
      slug,
      post.content
        .split(/\n\n+/)
        .filter((p) => p.trim())
        .filter((p) => !STRIP_PATTERNS.some((re) => re.test(p))),
    );
  }
  return _paraCache.get(slug);
}

// Locate the chunk's paragraph; return a readable excerpt (the whole paragraph,
// or a sentence-snapped window around the chunk when the paragraph is huge —
// GABlog posts are often one multi-thousand-word block).
function expandHit(slug: string, chunk: string): { excerpt: string; anchor: string | null } {
  const paras = paragraphsFor(slug);
  if (!paras) return { excerpt: chunk, anchor: null };
  const probe = chunk.length > 80 ? chunk.slice(0, 80) : chunk;
  let idx = paras.findIndex((p) => p.includes(probe));
  if (idx === -1) {
    const norm = (t: string) => t.normalize('NFKC').replace(/\s+/g, ' ').trim();
    const np = norm(probe);
    idx = paras.findIndex((p) => norm(p).includes(np));
  }
  if (idx === -1) return { excerpt: chunk, anchor: null };
  const para = paras[idx];
  const anchor = `p-${idx + 1}`;
  if (para.length <= 1400) return { excerpt: para, anchor };
  // Window around the chunk, snapped outward to sentence boundaries.
  const at = Math.max(0, para.indexOf(probe));
  let start = Math.max(0, at - 400);
  let end = Math.min(para.length, at + chunk.length + 500);
  const back = para.lastIndexOf('. ', start);
  if (back > 0 && start - back < 300) start = back + 2;
  const fwd = para.indexOf('. ', end);
  if (fwd !== -1 && fwd - end < 300) end = fwd + 1;
  const excerpt = (start > 0 ? '…' : '') + para.slice(start, end).trim() + (end < para.length ? '…' : '');
  return { excerpt, anchor };
}

// Semantic search. The browser embeds the query locally (bge-small) and POSTs
// the unit vector here; this endpoint only does cosine over the prebuilt corpus
// vectors and returns the closest passages. No model / onnxruntime runs in this
// function — just float math — so it stays small and fast.
//
// POST { vector: number[384] } → { results: [{slug,title,source,text,score}] }

export function OPTIONS() {
  return preflight(openCors());
}

export async function POST(request: Request) {
  if (!semanticAvailable()) {
    return Response.json({ error: 'Semantic index unavailable' }, { status: 503 });
  }

  let vector: unknown;
  let sources: unknown;
  let q: unknown;
  let full: unknown;
  let expand: unknown;
  try {
    ({ vector, sources, q, full, expand } = await request.json());
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Raw-text mode: embed server-side via the dedicated /api/embed function
  // (model + onnxruntime live there, not here). Lets Meaning search work with
  // zero client download and lets Ask retrieval go hybrid.
  if (!vector && typeof q === 'string' && q.trim().length >= 2) {
    try {
      const origin = new URL(request.url).origin;
      const r = await fetch(`${origin}/api/embed`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', origin },
        // /api/embed validates q at 2-500 chars — slice BEFORE sending or a
        // long combined query (question + synthesis) 400s and surfaces as 503.
        body: JSON.stringify({ q: q.trim().slice(0, 500) }),
      });
      if (r.ok) ({ vector } = await r.json());
    } catch {
      // fall through to the 503 below
    }
    if (!vector) {
      return Response.json({ error: 'Server-side embedding unavailable' }, { status: 503 });
    }
  }

  if (!Array.isArray(vector) || vector.length !== EMBED_DIM || !vector.every((x) => typeof x === 'number')) {
    return Response.json({ error: `vector must be ${EMBED_DIM} numbers` }, { status: 400 });
  }

  // Optional content-source allow-list (the browser excludes the Chronicles &c.
  // by default). Absent/empty → search all sources.
  const allow = Array.isArray(sources) && sources.length > 0
    ? new Set((sources as unknown[]).filter((s): s is string => typeof s === 'string'))
    : undefined;

  // Drop same-title duplicates (e.g. the pdf + ap copies of one article).
  const seenTitle = new Set<string>();
  const results = semanticChunks(Float32Array.from(vector as number[]), 40, true, allow)
    .filter((c) => {
      const key = c.title.trim().toLowerCase();
      if (seenTitle.has(key)) return false;
      seenTitle.add(key);
      return true;
    })
    .slice(0, 24)
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      source: c.source,
      // Trim to a readable snippet for result cards; internal callers (Ask
      // retrieval) pass full: true to get the whole passage for the prompt.
      text: full === true || expand === true || c.text.length <= 360
        ? c.text
        : c.text.slice(0, 360).replace(/\s+\S*$/, '') + '…',
      score: Math.round(c.score * 1000) / 1000,
    }));

  if (expand === true) {
    // Ask excerpts: paragraph-level verbatim excerpts with stable anchors,
    // deduped so two chunks of one paragraph surface once.
    const seen = new Set<string>();
    const expanded = [];
    for (const r of results) {
      const { excerpt, anchor } = expandHit(r.slug, r.text);
      const key = `${r.slug}|${anchor ?? excerpt.slice(0, 60)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      expanded.push({ ...r, text: excerpt, anchor });
      if (expanded.length >= 12) break;
    }
    return Response.json({ results: expanded }, { headers: openCors() });
  }

  return Response.json({ results }, { headers: openCors() });
}
