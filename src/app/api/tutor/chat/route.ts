import crypto from 'crypto';
import { getUser, isOwnerUser } from '@/lib/auth';
import { getKV } from '@/lib/kv';
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit';
import { canonText, estTokens, indexText, promptText } from '@/lib/tutor/context';
import { embedQuestion } from '@/lib/tutor/embed-query';
import { streamTutor, tutorCost, TUTOR_MODEL } from '@/lib/tutor/model';
import { buildTurn, sourcesOf } from '@/lib/tutor/turn';
import { checkAnswer } from '@/lib/tutor/verify';
import { keptIdFor } from '@/lib/tutor/kept';

// The tutor. A visitor's question, with the thread so far, goes to
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

// Who may ask, and how much may be spent. Signed-in readers get a real daily
// allowance; a signed-out visitor gets a couple of answers a day (by a hash of
// their address, never the address itself) and is then asked to sign in. The
// day's and the month's spending each have a ceiling, so a burst of abuse
// costs a bounded amount whatever else fails.
const PER_DAY = Number(process.env.TUTOR_USER_PER_DAY) || 40;
const ANON_PER_DAY = Number(process.env.TUTOR_ANON_PER_DAY) || 2;
const DAILY_USD = Number(process.env.TUTOR_DAILY_USD) || 150;
const MONTHLY_USD = Number(process.env.TUTOR_MONTHLY_USD) || 1000;
const ARCHIVE = 'tutor:archive'; // first answers by question, reused for the same question

function addressHash(request: Request): string {
  const pepper = process.env.AUTH_SECRET || process.env.STUDY_KEY || 'center-study';
  return crypto.createHash('sha256').update(`${pepper}:tutor:${clientIp(request)}`).digest('hex').slice(0, 24);
}
const HISTORY_BUDGET = 40_000;
const BOT_UA = /(?<!cu)bot|crawl|spider|slurp|headless|scrape|lighthouse/i;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (BOT_UA.test(request.headers.get('user-agent') ?? '')) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (!rateLimit(`tutor:${clientIp(request)}`, 8, 60_000).ok) {
    return Response.json({ error: 'Too many questions at once. Give it a minute.' }, { status: 429 });
  }
  const user = getUser(request);
  const owner = isOwnerUser(user);

  let body: { message?: unknown; history?: unknown; fresh?: unknown };
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 4000) : '';
  if (message.length < 2) return Response.json({ error: 'Ask a question.' }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: 'The tutor is not configured.' }, { status: 500 });

  const kv = getKV();
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const monthKey = `tutor:spend:${day.slice(0, 7)}`;
  const dayKey = `tutor:spend:day:${day}`;
  const firstTurn = !Array.isArray(body.history) || body.history.length === 0;
  const archiveId = keptIdFor(message);
  const encoder = new TextEncoder();

  // ── An answer already written for this exact question ────────────────────
  // Only for a conversation's first question (a follow-up depends on its
  // thread), and never when the visitor asked for a fresh one. Costs nothing
  // and counts against no one's allowance.
  if (kv && firstTurn && body.fresh !== true) {
    try {
      const hit = await kv.hget<{ a: string; sources: unknown[]; whole: unknown[]; t: number } | string>(ARCHIVE, archiveId);
      const saved = typeof hit === 'string' ? JSON.parse(hit) : hit;
      if (saved?.a) {
        const lines = [
          { sources: saved.sources ?? [], whole: saved.whole ?? [], archived: saved.t },
          { text: saved.a },
          { check: checkAnswer(saved.a) },
        ];
        return new Response(encoder.encode(lines.map((l) => JSON.stringify(l)).join('\n') + '\n'), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
    } catch { /* no archive: answer it live */ }
  }

  // ── Limits: this visitor's day, then the day's and month's spending ──────
  if (!user && !kv) return Response.json({ error: 'Sign in to talk with the tutor.', code: 'signin' }, { status: 401 });
  if (kv) {
    try {
      const [month, today] = await Promise.all([kv.get(monthKey), kv.get(dayKey)]);
      if ((Number(month) || 0) >= MONTHLY_USD) {
        return Response.json({ error: 'The tutor has reached its limit for this month. It will be back next month.', code: 'month' }, { status: 429 });
      }
      if ((Number(today) || 0) >= DAILY_USD && !owner) {
        return Response.json({ error: 'The tutor has answered as much as it can today. It will be back tomorrow.', code: 'today' }, { status: 429 });
      }
      if (!owner) {
        const who = user ? `tutor:n:${day}:${user.sub}` : `tutor:anon:${day}:${addressHash(request)}`;
        const n = await kv.incr(who);
        if (n === 1) await kv.expire(who, 60 * 60 * 48);
        if (!user && n > ANON_PER_DAY) {
          return Response.json({ error: 'Sign in to keep going. It is free, and it is how the tutor stays open to people and closed to bots.', code: 'signin' }, { status: 401 });
        }
        if (user && n > PER_DAY) {
          return Response.json({ error: `That is ${PER_DAY} questions today, which is the daily limit. Come back tomorrow.`, code: 'day' }, { status: 429 });
        }
      }
    } catch {
      // The store being down must not take the tutor down for readers with an
      // account; without it there is no way to meter a signed-out visitor.
      if (!user) return Response.json({ error: 'Sign in to talk with the tutor.', code: 'signin' }, { status: 401 });
    }
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
  const { content: turn, hits, whole, strength } = buildTurn(message, query, vec);
  const sources = sourcesOf(hits);
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
            await kv.incrbyfloat(dayKey, cost);
            await kv.expire(dayKey, 60 * 60 * 24 * 40);
            // A clean first answer is kept for the next person who asks the same thing.
            if (firstTurn && stop === 'end_turn' && answer.length > 400 && check.badLinks.length === 0 && check.badQuotes.length === 0) {
              await kv.hset(ARCHIVE, { [archiveId]: JSON.stringify({
                a: answer, sources, whole: whole.map((w) => ({ title: w.title, url: `/post/${w.slug}` })), t: Date.now(),
              }) });
            }
            await kv.lpush('tutor:log', JSON.stringify({
              q: message.slice(0, 600),
              a: answer.slice(0, 8000),
              turn: history.filter((m) => m.role === 'user').length + 1,
              passages: hits.map((h) => h.key),
              whole: whole.map((w) => w.slug),
              strength,
              badLinks: check.badLinks,
              badQuotes: check.badQuotes.length,
              who: user ? 'account' : 'visitor',
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
