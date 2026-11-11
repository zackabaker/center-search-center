import Anthropic from '@anthropic-ai/sdk';
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit';
import { getKV } from '@/lib/kv';
import { READING_PATHS } from '@/data/guide/reading-paths';

// /begin generation: takes the visitor's interests (chips + free text), pulls
// verbatim paragraph excerpts from the semantic index, has the model SELECT
// from them (by number) and order a reading path — the model never writes or
// edits excerpt text, the server substitutes the retrieved paragraph, so every
// excerpt on the saved page is verbatim by construction. The result is saved
// to KV under a short random id and served at /begin/p/<id>.

export const maxDuration = 60;

const anthropic = new Anthropic();

// Same gate battery as /api/chat: this endpoint spends Anthropic credits.
const BOT_UA = /(?<!cu)bot|crawl|spider|slurp|headless|scrape|lighthouse/i;

// The canonical chip list — the client renders exactly these; anything else
// in `interests` is dropped server-side (typed interests belong in `text`).
const INTERESTS = new Set([
  'currency', 'economics', 'prediction markets', 'companies', 'social theory',
  'power & politics', 'leadership', 'philosophy', 'language', 'the sacred',
  'AI & technology', 'literature & aesthetics',
]);

// Chip → curated reading-path slugs, used for the deterministic "continue
// with a curated path" block on the saved page (no AI involved).
const CHIP_PATHS: Record<string, string> = {
  'currency': 'debt-credit-economic',
  'economics': 'debt-credit-economic',
  'prediction markets': 'debt-credit-economic',
  'companies': 'debt-credit-economic',
  'social theory': 'foundation',
  'power & politics': 'political',
  'leadership': 'political',
  'philosophy': 'self-referential',
  'language': 'language-and-grammar',
  'the sacred': 'sacred-and-social',
  'AI & technology': 'technology-and-scenic-design',
  'literature & aesthetics': 'start-here',
};

interface Candidate {
  slug: string;
  title: string;
  source: string;
  text: string;          // verbatim paragraph excerpt from the index
  anchor: string | null; // stable p-N reader anchor when located
}

async function retrieve(origin: string, q: string): Promise<Candidate[]> {
  try {
    const r = await fetch(`${origin}/api/semantic`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin },
      body: JSON.stringify({
        q: q.slice(0, 500),
        expand: true,
        // Tweets make poor reading-list entries; chronicles/ap stay the
        // archival background here, as in Ask retrieval.
        sources: ['substack', 'gablog', 'book', 'pdf'],
      }),
    });
    if (!r.ok) return [];
    const { results } = await r.json();
    if (!Array.isArray(results)) return [];
    return results
      .filter((x) => x && typeof x.slug === 'string' && typeof x.text === 'string')
      .map((x) => ({
        slug: x.slug,
        title: String(x.title ?? x.slug),
        source: String(x.source ?? ''),
        text: x.text,
        anchor: typeof x.anchor === 'string' ? x.anchor : null,
      }));
  } catch {
    return [];
  }
}

const SYSTEM_PROMPT = `You curate reading paths into the Center Study archive (the work of Adam Katz / Dennis Bouvard, building on Eric Gans's originary hypothesis).

You are given a reader's stated interests and a numbered list of candidate passages retrieved from the archive. Choose 5 to 7 candidates that best serve this reader as a first path into the archive, in a sensible reading ORDER (more accessible or foundational first), and write one short orientation note.

Rules:
- Respond with ONLY a JSON object, no markdown fence, no prose around it.
- Shape: {"note": string, "items": [{"index": number, "why": string}]}
- "index" must be one of the candidate numbers. Never invent posts or quote text — the site attaches the passages itself.
- Pick at most one candidate per post (candidates from the same post share a slug).
- "why" is one sentence (under 25 words) saying what this reader will find in this text, in plain language, addressed to them.
- "note" is 2-3 sentences (under 80 words) orienting this reader: how their interests meet the archive, and how to read the path. Plain, direct, no hype.`;

function parseModelJson(text: string): { note?: unknown; items?: unknown } | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try { return JSON.parse(text.slice(start, end + 1)); } catch { return null; }
}

export async function POST(request: Request) {
  // ── Gates (same battery as /api/chat: credits are spent per request) ──
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (BOT_UA.test(request.headers.get('user-agent') ?? '')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  const limited = rateLimit(`begin:${clientIp(request)}`, 5, 10 * 60_000);
  if (!limited.ok) {
    return Response.json(
      { error: 'Too many requests', retryAfterSeconds: limited.retryAfterSeconds },
      { status: 429 },
    );
  }

  let body: { interests?: unknown; text?: unknown; sid?: unknown; mine?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const interests = Array.isArray(body.interests)
    ? body.interests.filter((x): x is string => typeof x === 'string' && INTERESTS.has(x)).slice(0, 12)
    : [];
  const text = typeof body.text === 'string' ? body.text.trim().slice(0, 600) : '';
  // Same anonymous-session conventions as the search/activity logs: sid is the
  // ephemeral per-tab token (joins this generation to its /study session
  // trail), mine flags the owner's own browser so his tests can be filtered.
  const sid = typeof body.sid === 'string' ? body.sid.slice(0, 64) : undefined;
  const mine = body.mine === true;

  if (interests.length === 0 && text.length < 3) {
    return Response.json({ error: 'Pick an interest or describe your background first.' }, { status: 400 });
  }

  const kv = getKV();
  if (!kv) {
    return Response.json({ error: 'Saving is unavailable right now.' }, { status: 503 });
  }

  // ── Retrieval: verbatim paragraph excerpts from the semantic index ──
  const origin = new URL(request.url).origin;
  const queries: string[] = [];
  if (text) queries.push(text);
  if (interests.length > 0) queries.push(interests.join(', '));
  // A combined query catches the intersection the separate ones miss.
  if (text && interests.length > 0) queries.push(`${text} — ${interests.join(', ')}`);

  const batches = await Promise.all(queries.map((q) => retrieve(origin, q)));
  const candidates: Candidate[] = [];
  const seen = new Set<string>();
  for (const batch of batches) {
    for (const c of batch) {
      const key = `${c.slug}|${c.anchor ?? c.text.slice(0, 60)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      candidates.push(c);
      if (candidates.length >= 20) break;
    }
    if (candidates.length >= 20) break;
  }

  if (candidates.length < 4) {
    return Response.json({ error: 'Retrieval is unavailable right now.' }, { status: 503 });
  }

  // ── Selection: the model picks candidate NUMBERS; it never writes excerpts ──
  const candidateBlock = candidates
    .map((c, i) => `[${i + 1}] "${c.title}" (${c.source})\n${c.text}`)
    .join('\n\n');
  const readerBlock = [
    interests.length > 0 ? `Interests: ${interests.join(', ')}` : null,
    text ? `In their own words: ${text}` : null,
  ].filter(Boolean).join('\n');

  let note = '';
  let picked: { index: number; why: string }[] = [];
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `The reader:\n${readerBlock}\n\nCandidate passages:\n\n${candidateBlock}`,
      }],
    });
    const raw = msg.content[0]?.type === 'text' ? msg.content[0].text : '';
    const parsed = parseModelJson(raw);
    if (parsed && Array.isArray(parsed.items)) {
      note = typeof parsed.note === 'string' ? parsed.note.slice(0, 800) : '';
      const usedSlugs = new Set<string>();
      for (const it of parsed.items) {
        const idx = typeof it?.index === 'number' ? Math.floor(it.index) : NaN;
        if (!(idx >= 1 && idx <= candidates.length)) continue;
        const cand = candidates[idx - 1];
        if (usedSlugs.has(cand.slug)) continue;
        usedSlugs.add(cand.slug);
        picked.push({ index: idx, why: typeof it.why === 'string' ? it.why.slice(0, 300) : '' });
        if (picked.length >= 7) break;
      }
    }
  } catch (err) {
    console.error('begin: model call failed', err);
  }

  // Degrade without a dead end: if the model failed or picked too few, take
  // the top-scored candidates directly (they're already relevance-ordered).
  let fallback = false;
  if (picked.length < 4) {
    fallback = true;
    note = '';
    picked = [];
    const usedSlugs = new Set<string>();
    for (let i = 0; i < candidates.length && picked.length < 6; i++) {
      if (usedSlugs.has(candidates[i].slug)) continue;
      usedSlugs.add(candidates[i].slug);
      picked.push({ index: i + 1, why: '' });
    }
  }

  const items = picked.map(({ index, why }) => {
    const c = candidates[index - 1];
    return { slug: c.slug, title: c.title, source: c.source, excerpt: c.text, anchor: c.anchor, why };
  });

  // Deterministic curated-path suggestions from the chips (no AI).
  const pathSlugs = [...new Set(interests.map((i) => CHIP_PATHS[i]).filter(Boolean))].slice(0, 3);
  const paths = READING_PATHS
    .filter((p) => pathSlugs.includes(p.slug))
    .map((p) => ({ slug: p.slug, title: p.title }));

  // ── Persist ──
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 10);
  const record = {
    id,
    createdAt: new Date().toISOString(),
    interests,
    text,
    note,
    items,
    paths,
  };
  try {
    await kv.set(`begin:${id}`, record);
    // Full anonymous usage trace for the /study console — everything the
    // visitor entered (interests + free text), what came back, and the same
    // sid/mine conventions as the search log. Best-effort, capped.
    await kv.lpush('begin:log', JSON.stringify({
      id,
      interests,
      ...(text ? { text: text.slice(0, 300) } : {}),
      n: items.length,
      ...(fallback ? { fb: true } : {}),
      ...(sid ? { sid } : {}),
      ...(mine ? { mine: true } : {}),
      t: Date.now(),
    }));
    await kv.ltrim('begin:log', 0, 1999);
  } catch (err) {
    console.error('begin: KV write failed', err);
    return Response.json({ error: 'Saving failed — please try again.' }, { status: 503 });
  }

  return Response.json({ id });
}
