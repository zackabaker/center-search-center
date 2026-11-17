import type { SessionView } from './data';
import { aiReferrer } from '@/lib/ai-agents';

// Pure derivations over the session episodes the data layer already builds —
// the "what's working / what isn't" questions the raw trails can answer
// without any extra capture: which sources send readers who stay, where
// visits land and die, which searches end without anything opened, what
// gets read together, how far a generated reading path carries someone.
//
// Everything here runs over READER episodes (the owner's own and likely
// crawlers are dropped first) and only covers the retained raw-log window —
// a few weeks — so these are "lately" figures, not all-time.

export type Ref = { label: string; href?: string };

export type SourceRow = {
  name: string;
  ai: boolean;
  visits30: number; // arrivals in the daily aggregates (durable)
  visits7: number;
  sessions: number; // arrivals still in the raw trail window
  stayed: number;   // …that did more than land
  read: number;     // …that read a text (≥50% + 90s)
};
export type LandingRow = Ref & { sessions: number; stayed: number; read: number };
export type CoRead = { a: Ref; b: Ref; n: number };
export type BeginFunnel = { generated: number; opened: number; read: number; returned: number };
export type NoClick = { q: string; t: number; times: number; anchor: string };
export type SearchOutcome = { searches: number; opened: number; noClick: NoClick[] };
export type Insight = { text: string; href?: string; tone?: 'up' | 'down' };

export const readerSessions = (sessions: SessionView[]): SessionView[] =>
  sessions.filter((s) => s.kind === 'live' && !s.mine && !s.crawler);

/** Friendly grouping for referrer hostnames ("t.co" and "x.com" are one source). */
export function sourceName(host: string): string {
  const h = host.toLowerCase().replace(/^www\./, '');
  const ai = aiReferrer(h);
  if (ai) return ai;
  if (/(^|\.)google\.[a-z.]+$/.test(h) || h === 'com.google.android.googlequicksearchbox') return 'Google';
  if (h === 't.co' || h === 'x.com' || h === 'twitter.com' || h.endsWith('.twitter.com')) return 'X';
  if (h === 'substack.com' || h.endsWith('.substack.com')) return 'Substack';
  if (/(^|\.)bing\.com$/.test(h)) return 'Bing';
  if (/(^|\.)duckduckgo\.com$/.test(h)) return 'DuckDuckGo';
  if (/(^|\.)reddit\.com$/.test(h)) return 'Reddit';
  if (/(^|\.)facebook\.com$/.test(h)) return 'Facebook';
  if (/(^|\.)youtube\.com$/.test(h) || h === 'youtu.be') return 'YouTube';
  if (/(^|\.)linkedin\.com$/.test(h) || h === 'lnkd.in') return 'LinkedIn';
  if (/(^|\.)brave\.com$/.test(h)) return 'Brave Search';
  if (/(^|\.)yandex\.[a-z.]+$/.test(h)) return 'Yandex';
  if (h.endsWith('.ycombinator.com')) return 'Hacker News';
  return h;
}

const didRead = (s: SessionView) => s.events.some((e) => e.type === 'read');

/** Per source: how many arrivals stayed and how many read. */
export function deriveSourceQuality(sessions: SessionView[]): Map<string, { sessions: number; stayed: number; read: number }> {
  const out = new Map<string, { sessions: number; stayed: number; read: number }>();
  for (const s of sessions) {
    if (!s.ref) continue;
    const name = sourceName(s.ref);
    const row = out.get(name) ?? { sessions: 0, stayed: 0, read: 0 };
    row.sessions += 1;
    if (s.eventsTotal >= 2) row.stayed += 1;
    if (didRead(s)) row.read += 1;
    out.set(name, row);
  }
  return out;
}

/** Where visits begin, and whether that page holds anyone. */
export function deriveLandings(sessions: SessionView[], cap = 14): LandingRow[] {
  const rows = new Map<string, LandingRow>();
  for (const s of sessions) {
    const first = s.events.find((e) => e.type === 'page');
    if (!first) continue;
    const key = first.href ?? first.label;
    const row = rows.get(key) ?? { label: first.label, href: first.href, sessions: 0, stayed: 0, read: 0 };
    row.sessions += 1;
    if (s.eventsTotal >= 2) row.stayed += 1;
    if (didRead(s)) row.read += 1;
    rows.set(key, row);
  }
  return [...rows.values()].sort((a, b) => b.sessions - a.sessions).slice(0, cap);
}

/** Texts read in the same visit — "readers of X also read Y". */
export function deriveCoReads(sessions: SessionView[], cap = 10): CoRead[] {
  const pairs = new Map<string, CoRead>();
  for (const s of sessions) {
    const reads = new Map<string, Ref>();
    for (const e of s.events) {
      if (e.type === 'read') reads.set(e.href ?? e.label, { label: e.label, href: e.href });
    }
    if (reads.size < 2 || reads.size > 12) continue;
    const keys = [...reads.keys()].sort();
    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        const k = `${keys[i]}\n${keys[j]}`;
        const row = pairs.get(k) ?? { a: reads.get(keys[i])!, b: reads.get(keys[j])!, n: 0 };
        row.n += 1;
        pairs.set(k, row);
      }
    }
  }
  return [...pairs.values()].filter((p) => p.n >= 2).sort((a, b) => b.n - a.n).slice(0, cap);
}

/** Generated a reading path → opened a text → read one → came back later. */
export function deriveBeginFunnel(sessions: SessionView[]): BeginFunnel {
  const lastStartBySid = new Map<string, number>();
  for (const s of sessions) {
    if (s.sid) lastStartBySid.set(s.sid, Math.max(lastStartBySid.get(s.sid) ?? 0, s.start));
  }
  const out: BeginFunnel = { generated: 0, opened: 0, read: 0, returned: 0 };
  for (const s of sessions) {
    const i = s.events.findIndex((e) => e.type === 'begin');
    if (i < 0) continue;
    out.generated += 1;
    const after = s.events.slice(i + 1);
    const read = after.some((e) => e.type === 'read');
    if (read || after.some((e) => e.type === 'page' && e.href?.startsWith('/post/'))) out.opened += 1;
    if (read) out.read += 1;
    const returned =
      s.badges.some((b) => b.startsWith('returning')) ||
      (s.sid !== undefined && (lastStartBySid.get(s.sid) ?? 0) > s.end);
    if (returned) out.returned += 1;
  }
  return out;
}

const WENT_SOMEWHERE = /^\/(post|concepts|glossary|begin\/p)\//;

/**
 * Keyword searches and what came of them. A search "opened something" when
 * the visit's next move — before another search, within ten minutes — is a
 * picked result, a text, or a concept page. Queries that are only a typing
 * prefix of the next one (logged mid-pause) are not counted at all.
 */
export function deriveSearchOutcomes(sessions: SessionView[], since: number, cap = 30): SearchOutcome {
  let searches = 0;
  let opened = 0;
  const miss = new Map<string, NoClick>();
  for (const s of sessions) {
    const ev = s.events;
    for (let i = 0; i < ev.length; i++) {
      const e = ev[i];
      if (e.type !== 'search' || e.mode === 'ask' || e.t < since) continue;
      const next = ev.slice(i + 1).find((x) => x.type === 'search');
      if (
        next && next.t - e.t < 90_000 &&
        next.label.toLowerCase().startsWith(e.label.toLowerCase())
      ) continue;
      searches += 1;
      let hit = false;
      for (let j = i + 1; j < ev.length; j++) {
        const x = ev[j];
        if (x.type === 'search' || x.t - e.t > 10 * 60_000) break;
        if (x.type === 'pick' || x.type === 'read' || (x.type === 'page' && WENT_SOMEWHERE.test(x.href ?? ''))) {
          hit = true;
          break;
        }
      }
      if (hit) {
        opened += 1;
        continue;
      }
      const key = e.label.toLowerCase().replace(/\s+/g, ' ').trim();
      const row = miss.get(key) ?? { q: e.label, t: 0, times: 0, anchor: `#s-${s.id}` };
      row.times += 1;
      if (e.t > row.t) {
        row.t = e.t;
        row.anchor = `#s-${s.id}`;
      }
      miss.set(key, row);
    }
  }
  const noClick = [...miss.values()].sort((a, b) => b.t - a.t).slice(0, cap);
  return { searches, opened, noClick };
}

const pct = (cur: number, prev: number): number | null =>
  prev > 0 ? Math.round(((cur - prev) / prev) * 100) : null;
const signed = (p: number) => `${p > 0 ? '+' : ''}${p}%`;

/**
 * "This week", in sentences: the things the charts don't say on their own.
 * Rule-based on purpose — every line is a number the console can show its
 * working for, never a model's gloss.
 */
export function buildInsights(input: {
  movers: { label: string; slug: string; cur: number; prev: number }[];
  aiRef: { total7: number; prev7: number; byProduct: { name: string; n: number }[] };
  crawlers: { family: string; kind: string | null; d7: number }[];
  search: SearchOutcome;
  begin: BeginFunnel;
  returns7: number;
  returnsPrev7: number;
  follows7: number;
  followsPrev7: number;
  newAccounts7: number;
  topJourney: SessionView | null;
  completion: { n: number; reach75: number } | null;
}): Insight[] {
  const out: Insight[] = [];
  const { movers, aiRef, crawlers, search, begin } = input;

  const top = movers[0];
  if (top && top.cur >= 3) {
    const p = pct(top.cur, top.prev);
    out.push({
      text:
        `Most-opened text: “${top.label}” — ${top.cur} views` +
        (p !== null ? ` (${signed(p)} vs. the week before)` : top.prev === 0 ? ' (none the week before)' : ''),
      href: `/analytics/post/${top.slug}`,
      tone: p !== null ? (p >= 0 ? 'up' : 'down') : 'up',
    });
  }
  const fresh = movers.find((m) => m !== top && m.prev === 0 && m.cur >= 4);
  if (fresh) {
    out.push({
      text: `New on the radar: “${fresh.label}” — ${fresh.cur} views this week, none the week before`,
      href: `/analytics/post/${fresh.slug}`,
      tone: 'up',
    });
  }

  if (aiRef.total7 > 0) {
    const who = aiRef.byProduct.slice(0, 3).map((b) => `${b.name} ${b.n}`).join(', ');
    out.push({
      text:
        `${aiRef.total7} reader${aiRef.total7 === 1 ? '' : 's'} arrived from AI assistants this week` +
        (aiRef.prev7 > 0 ? ` (${aiRef.prev7} the week before)` : '') +
        (who ? ` — 30-day mix: ${who}` : ''),
      href: '#sources',
      tone: aiRef.total7 >= aiRef.prev7 ? 'up' : 'down',
    });
  } else {
    out.push({
      text: 'No AI-referred readers this week (a floor, not a count — the assistants’ mobile apps hide the referrer)',
      href: '#sources',
    });
  }

  const fetched = crawlers.reduce((a, c) => a + c.d7, 0);
  if (fetched > 0) {
    const live = crawlers.filter((c) => c.kind === 'live').reduce((a, c) => a + c.d7, 0);
    out.push({
      text:
        `AI agents fetched ${fetched.toLocaleString('en-US')} page${fetched === 1 ? '' : 's'} this week` +
        (live > 0 ? ` — ${live} of them live lookups, an assistant answering someone right then` : ''),
      href: '#ai-systems',
    });
  }

  if (search.searches >= 5) {
    const missed = search.searches - search.opened;
    const share = Math.round((missed / search.searches) * 100);
    const eg = search.noClick[0]?.q;
    out.push({
      text:
        `${missed} of ${search.searches} keyword searches ended without opening anything (${share}%)` +
        (eg ? ` — latest: “${eg}”` : ''),
      href: '#no-click',
      tone: share > 50 ? 'down' : undefined,
    });
  }

  if (begin.generated > 0) {
    out.push({
      text:
        `Reading paths: ${begin.generated} generated → ${begin.opened} opened a text → ${begin.read} read one` +
        (begin.returned > 0 ? ` → ${begin.returned} came back` : ''),
      href: '#begin',
    });
  }

  if (input.completion && input.completion.n >= 10) {
    const share = Math.round((input.completion.reach75 / input.completion.n) * 100);
    out.push({ text: `Readers get at least three-quarters through ${share}% of the texts they open`, href: '#reading' });
  }

  if (input.returns7 > 0 || input.returnsPrev7 > 0) {
    const p = pct(input.returns7, input.returnsPrev7);
    out.push({
      text: `${input.returns7} returning visit${input.returns7 === 1 ? '' : 's'} this week` + (p !== null ? ` (${signed(p)})` : ''),
      tone: p !== null ? (p >= 0 ? 'up' : 'down') : undefined,
    });
  }
  if (input.follows7 > 0) {
    const p = pct(input.follows7, input.followsPrev7);
    out.push({
      text: `${input.follows7} follow click${input.follows7 === 1 ? '' : 's'} out to Substack / X / RSS` + (p !== null ? ` (${signed(p)})` : ''),
      href: '#reading',
      tone: p !== null ? (p >= 0 ? 'up' : 'down') : undefined,
    });
  }
  if (input.newAccounts7 > 0) {
    out.push({ text: `${input.newAccounts7} new account${input.newAccounts7 === 1 ? '' : 's'} this week`, href: '#readers', tone: 'up' });
  }

  const j = input.topJourney;
  if (j && j.texts > 0) {
    const reads = j.events.filter((e) => e.type === 'read').length;
    out.push({
      text:
        `Deepest visit: ${j.mins} min, ${reads > 0 ? `${reads} text${reads === 1 ? '' : 's'} read` : `${j.texts} text${j.texts === 1 ? '' : 's'} opened`}` +
        (j.ref ? `, arriving from ${sourceName(j.ref)}` : ''),
      href: `#s-${j.id}`,
    });
  }
  return out;
}
