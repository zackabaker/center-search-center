// Is the site the cited source? A fixed set of questions people actually ask
// about Generative Anthropology is put to an assistant with web search on,
// and each answer is read for one thing: whether center.study is among the
// sources it cites — and who is cited instead.
//
// The crawler counts say AI systems read the archive; the referral counts
// say their users click through; this is the measure in between, and the one
// the site's mission is stated in. A couple of questions run each day (see
// /api/analytics/daily), so every question is re-asked about once a week
// and no single run is long or costly. Results live in two keys: the latest
// check per question, and a capped log for the trend.
import Anthropic from '@anthropic-ai/sdk';
import { getKV } from './kv';

export const SITE_HOST = 'center.study';

// Claude Opus 5.5 with the server-side web search tool. The thinking depth is
// set low on purpose: this is a lookup, not a hard problem. (Server-side
// refusal fallbacks need a newer SDK than the project pins; a refusal here is
// simply recorded as an error for that question.)
//
// The tool is deliberately the basic `web_search_20250305` variant. The newer
// dynamic-filtering one runs the search inside code execution and returns the
// answer WITHOUT citation markers on its text — and the citation markers are
// the whole measurement here. Verified against live responses 2026-11-17.
const MODEL = 'claude-opus-5-5';
const SEARCH_TOOL = { type: 'web_search_20250305', name: 'web_search', max_uses: 3 } as const;
const SYSTEM =
  'Answer the user’s question. Search the web for current sources before answering, ' +
  'and cite the sources you rely on. Keep the answer under 150 words.';

export const QUESTIONS: { id: string; q: string }[] = [
  { id: 'what-is-ga', q: 'What is generative anthropology?' },
  { id: 'originary-hypothesis', q: 'What is the originary hypothesis in generative anthropology?' },
  { id: 'originary-scene', q: 'What is the originary scene, according to Eric Gans?' },
  { id: 'eric-gans', q: 'Who is Eric Gans and what are his main ideas?' },
  { id: 'dennis-bouvard', q: 'Who is Dennis Bouvard and what has he written about generative anthropology?' },
  { id: 'adam-katz', q: 'Who is Adam Katz, the writer on generative anthropology?' },
  { id: 'anthropomorphics', q: 'What is the book “Anthropomorphics: An Originary Grammar of the Center” about?' },
  { id: 'the-center', q: 'What does “the center” mean in generative anthropology?' },
  { id: 'deferral', q: 'What does “the deferral of violence through representation” mean?' },
  { id: 'originary-grammar', q: 'What are the ostensive, imperative and declarative in Eric Gans’s originary grammar?' },
  { id: 'firstness', q: 'What is “firstness” in generative anthropology?' },
  { id: 'omnicentric', q: 'What does “omnicentric” mean in generative anthropology?' },
  { id: 'center-study', q: 'What is “Center Study” in generative anthropology?' },
  { id: 'ga-vs-girard', q: 'How does generative anthropology differ from René Girard’s mimetic theory?' },
  { id: 'where-to-start', q: 'Where should I start reading about generative anthropology?' },
];

export type CitationCheck = {
  id: string;
  q: string;
  at: number;
  searched: boolean;       // the assistant ran a web search
  cited: boolean;          // center.study is among the sources it cited
  seenRank: number | null; // where center.study first appeared in the results it saw (1 = top)
  ourUrls: string[];       // the center.study pages it cited
  top: { host: string; n: number }[]; // most-cited sites in the answer
  error?: string;
};

const LATEST = 'aicite:latest';
const LOG = 'aicite:log';
const LOG_CAP = 600;

const hostOf = (url: string): string | null => {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
};
const isOurs = (host: string | null) => host === SITE_HOST || !!host?.endsWith(`.${SITE_HOST}`);

async function ask(client: Anthropic, item: { id: string; q: string }): Promise<CitationCheck> {
  const base: CitationCheck = {
    id: item.id, q: item.q, at: Date.now(),
    searched: false, cited: false, seenRank: null, ourUrls: [], top: [],
  };
  try {
    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: item.q }];
    const content: Anthropic.ContentBlock[] = [];
    for (let turn = 0; turn < 3; turn++) {
      const response = await client.messages.create(
        {
          model: MODEL,
          max_tokens: 16000,
          system: SYSTEM,
          output_config: { effort: 'low' },
          tools: [SEARCH_TOOL],
          messages,
        },
        { timeout: 50_000, maxRetries: 0 },
      );
      content.push(...response.content);
      if (response.stop_reason === 'refusal') return { ...base, error: 'refused' };
      // A long server-tool turn pauses; sending the assistant turn back resumes it.
      if (response.stop_reason !== 'pause_turn') break;
      messages.push({ role: 'assistant', content: response.content });
    }

    const seen: string[] = [];
    const citedCount = new Map<string, number>();
    const ourUrls = new Set<string>();
    let error: string | undefined;
    for (const block of content) {
      if (block.type === 'server_tool_use' && block.name === 'web_search') {
        base.searched = true;
      } else if (block.type === 'web_search_tool_result') {
        base.searched = true;
        // A list on success; a single error object otherwise.
        if (Array.isArray(block.content)) {
          for (const r of block.content) seen.push(r.url);
        } else {
          error = block.content.error_code;
        }
      } else if (block.type === 'text') {
        for (const c of block.citations ?? []) {
          if (c.type !== 'web_search_result_location') continue;
          const host = hostOf(c.url);
          if (!host) continue;
          citedCount.set(host, (citedCount.get(host) ?? 0) + 1);
          if (isOurs(host)) {
            try { ourUrls.add(new URL(c.url).pathname); } catch { /* skip */ }
          }
        }
      }
    }
    const rank = seen.findIndex((u) => isOurs(hostOf(u)));
    return {
      ...base,
      cited: ourUrls.size > 0,
      seenRank: rank >= 0 ? rank + 1 : null,
      ourUrls: [...ourUrls].slice(0, 3),
      top: [...citedCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([host, n]) => ({ host, n })),
      ...(error && citedCount.size === 0 ? { error } : {}),
    };
  } catch (e) {
    const error =
      e instanceof Anthropic.RateLimitError ? 'rate limited'
      : e instanceof Anthropic.APIConnectionTimeoutError ? 'timed out'
      : e instanceof Anthropic.APIError ? `api error ${e.status ?? ''}`.trim()
      : 'failed';
    return { ...base, error };
  }
}

function parse<T>(v: unknown): T | null {
  if (v && typeof v === 'object') return v as T;
  if (typeof v === 'string') {
    try { return JSON.parse(v) as T; } catch { return null; }
  }
  return null;
}

async function latestChecks(): Promise<Map<string, CitationCheck>> {
  const out = new Map<string, CitationCheck>();
  const kv = getKV();
  if (!kv) return out;
  const h = ((await kv.hgetall(LATEST)) ?? {}) as Record<string, unknown>;
  for (const [id, raw] of Object.entries(h)) {
    const c = parse<CitationCheck>(raw);
    if (c && typeof c.at === 'number') out.set(id, c);
  }
  return out;
}

/**
 * Re-ask the `n` questions that have gone longest without a check — or, when
 * `ids` names some, exactly those (at most five).
 */
export async function runCitationChecks(n: number, ids?: string[]): Promise<CitationCheck[]> {
  const kv = getKV();
  if (!kv || !process.env.ANTHROPIC_API_KEY) return [];
  const latest = await latestChecks();
  const named = ids?.length ? QUESTIONS.filter((item) => ids.includes(item.id)) : [];
  const due = (named.length
    ? named
    : [...QUESTIONS].sort((a, b) => (latest.get(a.id)?.at ?? 0) - (latest.get(b.id)?.at ?? 0))
  ).slice(0, Math.max(1, Math.min(named.length || n, 5)));

  const client = new Anthropic();
  const results = await Promise.all(
    due.map(async (item) => {
      const check = await ask(client, item);
      // Stored as each one finishes, so a slow sibling can't lose it.
      try {
        const pipe = kv.pipeline();
        pipe.hset(LATEST, { [item.id]: JSON.stringify(check) });
        pipe.lpush(LOG, JSON.stringify({ id: check.id, at: check.at, cited: check.cited, err: check.error ? 1 : undefined }));
        pipe.ltrim(LOG, 0, LOG_CAP - 1);
        await pipe.exec();
      } catch {
        /* the next run re-asks it */
      }
      return check;
    }),
  );
  return results;
}

export type CitationReport = {
  checks: CitationCheck[];                               // latest per question, in QUESTIONS order
  pending: number;                                       // questions never checked yet
  weekly: { week: string; cited: number; total: number }[]; // oldest first
  rivals: { host: string; n: number }[];                 // who gets cited across the latest answers
};

export async function readCitations(): Promise<CitationReport> {
  const empty: CitationReport = { checks: [], pending: QUESTIONS.length, weekly: [], rivals: [] };
  const kv = getKV();
  if (!kv) return empty;
  try {
    const [latest, rawLog] = await Promise.all([latestChecks(), kv.lrange(LOG, 0, LOG_CAP - 1)]);
    const checks = QUESTIONS.flatMap((item) => {
      const c = latest.get(item.id);
      return c ? [{ ...c, q: item.q }] : [];
    });

    const mondayOf = (t: number) => {
      const d = new Date(t);
      const dow = (d.getUTCDay() + 6) % 7;
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - dow)).toISOString().slice(0, 10);
    };
    // Each question counts once per week: the log is newest first, so the
    // first entry seen for a (week, question) is that week's verdict.
    const weeks = new Map<string, { cited: number; total: number }>();
    const counted = new Set<string>();
    for (const raw of rawLog as unknown[]) {
      const e = parse<{ id: string; at: number; cited: boolean; err?: number }>(raw);
      if (!e || typeof e.at !== 'number' || e.err) continue;
      const week = mondayOf(e.at);
      if (counted.has(`${week}|${e.id}`)) continue;
      counted.add(`${week}|${e.id}`);
      const row = weeks.get(week) ?? { cited: 0, total: 0 };
      row.total += 1;
      if (e.cited) row.cited += 1;
      weeks.set(week, row);
    }

    const rivals = new Map<string, number>();
    for (const c of checks) for (const t of c.top) rivals.set(t.host, (rivals.get(t.host) ?? 0) + 1);

    return {
      checks,
      pending: QUESTIONS.length - checks.length,
      weekly: [...weeks.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([week, v]) => ({ week, ...v })),
      rivals: [...rivals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([host, n]) => ({ host, n })),
    };
  } catch {
    return empty;
  }
}
