import { getUser, isOwnerUser } from '@/lib/auth';
import { getKV } from '@/lib/kv';
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit';
import { canonSlugs, canonText, estTokens, indexText, postBySlug, promptText, renderWholeText } from '@/lib/tutor/context';
import { embedQuestion } from '@/lib/tutor/embed-query';
import { streamTutor, tutorCost, TUTOR_MODEL } from '@/lib/tutor/model';
import { tutorRetrieve, type TutorHit } from '@/lib/tutor/retrieve';
import { checkAnswer } from '@/lib/tutor/verify';

// The tutor. A signed-in visitor's question, with the thread so far, goes to
// the model together with the canon and index (cached), the paragraphs of the
// archive that best match it, and in full any further texts those paragraphs
// point to. The answer streams back as newline-delimited JSON:
//   { sources, whole }   what was retrieved, before any text
//   { text }             the answer, as it is written
//   { check }            links and quotations checked against the archive
//   { error }            if something went wrong mid-answer
//
// POST { message, history: [{ role, content }] }

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const PER_DAY = Number(process.env.TUTOR_USER_PER_DAY) || 40;
const MONTHLY_USD = Number(process.env.TUTOR_MONTHLY_USD) || 300;
const WHOLE_BUDGET = 70_000; // tokens of further whole texts per question
const HISTORY_BUDGET = 40_000;
const BOT_UA = /(?<!cu)bot|crawl|spider|slurp|headless|scrape|lighthouse/i;

function furtherTexts(hits: TutorHit[]): { slug: string; title: string; text: string }[] {
  const out: { slug: string; title: string; text: string }[] = [];
  let spent = 0;
  for (const h of hits) {
    if (out.length >= 4) break;
    if (canonSlugs.has(h.slug) || out.some((o) => o.slug === h.slug)) continue;
    if (h.source === 'twitter' || h.source === 'reddit') continue;
    const post = postBySlug(h.slug);
    if (!post) continue;
    const text = renderWholeText(post);
    const cost = estTokens(text);
    if (spent + cost > WHOLE_BUDGET) continue;
    spent += cost;
    out.push({ slug: h.slug, title: post.title, text });
  }
  return out;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (BOT_UA.test(request.headers.get('user-agent') ?? '')) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (!rateLimit(`tutor:${clientIp(request)}`, 8, 60_000).ok) {
    return Response.json({ error: 'Too many questions at once. Give it a minute.' }, { status: 429 });
  }
  const user = getUser(request);
  if (!user) return Response.json({ error: 'Sign in to talk with the tutor.', code: 'signin' }, { status: 401 });
  const owner = isOwnerUser(user);

  let body: { message?: unknown; history?: unknown };
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 4000) : '';
  if (message.length < 2) return Response.json({ error: 'Ask a question.' }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: 'The tutor is not configured.' }, { status: 500 });

  // ── Limits: this visitor's day, and the month's spending ─────────────────
  const kv = getKV();
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const monthKey = `tutor:spend:${day.slice(0, 7)}`;
  if (kv) {
    try {
      const spent = Number(await kv.get(monthKey)) || 0;
      if (spent >= MONTHLY_USD) {
        return Response.json({ error: 'The tutor has reached its limit for this month. It will be back next month.', code: 'month' }, { status: 429 });
      }
      if (!owner) {
        const userKey = `tutor:n:${day}:${user.sub}`;
        const n = await kv.incr(userKey);
        if (n === 1) await kv.expire(userKey, 60 * 60 * 48);
        if (n > PER_DAY) {
          return Response.json({ error: `That is ${PER_DAY} questions today, which is the daily limit. Come back tomorrow.`, code: 'day' }, { status: 429 });
        }
      }
    } catch { /* the store being down must not take the tutor down */ }
  }

  // ── The thread so far, newest kept, within a budget ──────────────────────
  const history: { role: 'user' | 'assistant'; content: string }[] = [];
  if (Array.isArray(body.history)) {
    let room = HISTORY_BUDGET;
    for (const m of [...body.history].reverse()) {
      const r = m as { role?: unknown; content?: unknown };
      if ((r.role !== 'user' && r.role !== 'assistant') || typeof r.content !== 'string' || !r.content.trim()) continue;
      const content = r.content.slice(0, 40_000);
      room -= estTokens(content);
      if (room < 0) break;
      history.unshift({ role: r.role, content });
    }
    while (history.length && history[0].role !== 'user') history.shift();
  }

  // ── Retrieval ────────────────────────────────────────────────────────────
  // A short follow-up ("why?", "say more about that") means little on its
  // own, so it is searched together with the question before it.
  const lastAsked = [...history].reverse().find((m) => m.role === 'user')?.content ?? '';
  const query = message.length < 80 && lastAsked ? `${lastAsked.slice(0, 300)} ${message}` : message;
  const vec = await embedQuestion(query, new URL(request.url).origin, 12_000);
  const hits = tutorRetrieve(query, vec, { limit: 18, perText: 2 });
  const whole = furtherTexts(hits);
  const cosines = hits.map((h) => h.cosine ?? 0);
  const strength =
    `closest match by meaning ${vec ? Math.max(0, ...cosines).toFixed(2) : 'unavailable'}` +
    `; ${cosines.filter((c) => c >= 0.62).length} of ${hits.length} paragraphs match closely` +
    `; ${hits.filter((h) => h.keywordRank !== null && h.keywordRank <= 20).length} match strongly on wording`;

  const turn =
    `<archive_match strength="${strength}">\n` +
    'How to read the strength: a closest match near 0.70 or above with several close paragraphs means the archive ' +
    'treats this directly; around 0.60 or below with few close paragraphs usually means it does not, whatever ' +
    'words happen to overlap.\n\n' +
    hits.map((h) => `<passage title=${JSON.stringify(h.title)} url="${h.url}">\n${h.text}\n</passage>`).join('\n\n') +
    '\n</archive_match>\n\n' +
    (whole.length
      ? `<further_texts note="texts outside the canon that this question points to, in full">\n${whole.map((w) => w.text).join('\n\n')}\n</further_texts>\n\n`
      : '') +
    `The visitor writes:\n${message}`;

  const sources = hits.slice(0, 10).map((h) => ({ title: h.title, url: h.url, source: h.source, snippet: h.text.slice(0, 200) }));
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (o: unknown) => controller.enqueue(encoder.encode(JSON.stringify(o) + '\n'));
      let answer = '';
      try {
        send({ sources, whole: whole.map((w) => ({ title: w.title, url: `/post/${w.slug}` })) });
        let cost = 0;
        let usage: unknown = null;
        let stop: string | null = null;
        for await (const ev of streamTutor({
          stable: [canonText(), `${indexText()}\n\n---\n\n${promptText()}`],
          messages: [...history, { role: 'user', content: turn }],
        })) {
          if (ev.type === 'text') { answer += ev.text; send({ text: ev.text }); }
          else { cost = tutorCost(ev.model, ev.usage); usage = ev.usage; stop = ev.stop; }
        }
        if (stop === 'refusal' && !answer) send({ text: 'The tutor could not answer that one. Try asking it another way.' });
        if (stop === 'max_tokens') send({ truncated: true });
        const check = checkAnswer(answer);
        send({ check, ...(owner ? { cost: Math.round(cost * 100) / 100, usage } : {}) });
        // Awaited before close: once the stream ends the function may freeze.
        if (kv) {
          try {
            await kv.incrbyfloat(monthKey, cost);
            await kv.expire(monthKey, 60 * 60 * 24 * 70);
            await kv.lpush('tutor:log', JSON.stringify({
              q: message.slice(0, 600),
              a: answer.slice(0, 8000),
              turn: history.filter((m) => m.role === 'user').length + 1,
              passages: hits.map((h) => h.key),
              whole: whole.map((w) => w.slug),
              strength,
              badLinks: check.badLinks,
              badQuotes: check.badQuotes.length,
              model: TUTOR_MODEL,
              cost: Math.round(cost * 1000) / 1000,
              t: Date.now(),
            }));
            await kv.ltrim('tutor:log', 0, 1999);
          } catch { /* logging must never break the answer */ }
        }
      } catch (err) {
        console.error('Tutor error:', err);
        send({ error: 'The tutor ran into a problem. Try again in a moment.' });
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
}
