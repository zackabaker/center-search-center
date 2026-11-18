// Opportunities for /analytics: the unmet-demand signals the console already
// collects — Google queries that show the site but earn no click, on-site
// searches that open nothing, Ask answers that came up empty, texts readers
// abandon, links that 404 — merged into one list of things worth doing, each
// with what the evidence is and what kind of fix it points to.
//
// The list is derived fresh on every read; only the owner's verdicts are
// stored (done / not relevant), keyed by a stable id, so a handled item stays
// handled while its signal is still in the data.
import crypto from 'crypto';
import { getKV } from './kv';
import type { GscSnapshot } from './gsc';
import type { StudyData } from '@/app/analytics/data';
import { getPublicPosts } from './parser';
import { contentWordsOf } from './search-index';

// A "0 results" search log is only true of the moment it happened — the
// corpus or the search code may have moved on since (a page added, a search
// bug fixed). Re-checking it keeps resolved gaps from haunting this list
// forever. A cheap substring/AND-of-words scan over the already-cached raw
// posts — not the full search-index build (contentWords + snippets for the
// whole corpus), which costs over a second and has no business running on
// every /analytics load just to recheck a handful of old queries.
let _lowerContents: string[] | null = null;
function stillEmpty(query: string): boolean {
  if (!_lowerContents) _lowerContents = getPublicPosts().map((p) => p.content.toLowerCase());
  const phrase = query.toLowerCase().trim();
  const words = contentWordsOf(query);
  if (words.length === 0) return false;
  return !_lowerContents.some((c) => c.includes(phrase) || words.every((w) => c.includes(w)));
}

export type OppKind = 'google' | 'search' | 'ask' | 'depth' | 'broken';
export type OppStatus = 'done' | 'ignored';
export type Opp = {
  id: string;
  kind: OppKind;
  title: string;
  evidence: string;
  fix: string;
  weight: number;
  links: { label: string; href: string }[];
};

export const KIND_LABEL: Record<OppKind, string> = {
  google: 'On Google',
  search: 'Site search',
  ask: 'Ask',
  depth: 'Reading',
  broken: 'Broken link',
};

const STATUS_KEY = 'opps:status';

const idFor = (kind: OppKind, key: string) =>
  `${kind}-${crypto.createHash('sha1').update(key.toLowerCase().replace(/\s+/g, ' ').trim()).digest('hex').slice(0, 12)}`;

export function buildOpportunities(data: StudyData, gsc: GscSnapshot | null): Opp[] {
  const out: Opp[] = [];

  // Shown on Google, never (or almost never) clicked.
  for (const q of gsc?.queries ?? []) {
    if (q.impressions < 5 || q.position > 20 || q.clicks > 0) continue;
    const near = q.position <= 5;
    out.push({
      id: idFor('google', q.key),
      kind: 'google',
      title: q.key,
      evidence: `Shown ${q.impressions} times on Google at about position ${q.position.toFixed(1)}, no clicks (28 days)`,
      fix: near
        ? 'You already rank near the top and nobody clicks — the page title and snippet aren’t selling it.'
        : 'Within reach of the first results — worth checking whether an existing page targets this phrase directly, or needs to.',
      weight: q.impressions,
      links: [
        { label: 'see the results', href: `https://www.google.com/search?q=${encodeURIComponent(q.key)}` },
        { label: 'search the site', href: `/search?q=${encodeURIComponent(q.key)}` },
      ],
    });
  }

  // Searched on the site, nothing opened. Operator-heavy queries are a power
  // user at work, not a content gap.
  for (const m of data.searchOutcome.noClick) {
    if (/\bOR\b|\bAND\b|"/.test(m.q) || m.q.trim().length < 3) continue;
    // A query that stops on a function word was cut off mid-phrase.
    if (/\b(a|an|the|of|to|in|and|or|is|for|with|between|that|as|by|on)$/i.test(m.q.trim())) continue;
    const empty = m.results === 0;
    // Logged as 0 results at the time, but the corpus or the search code may
    // have moved on since — re-check against the live index rather than
    // repeat a gap that's already closed.
    if (empty && !stillEmpty(m.q)) continue;
    out.push({
      id: idFor('search', m.q),
      kind: 'search',
      title: m.q,
      evidence:
        `Searched ${m.times === 1 ? 'once' : `${m.times} times`} on the site` +
        (typeof m.results === 'number' ? `, ${m.results} result${m.results === 1 ? '' : 's'}` : '') +
        ', nothing opened',
      fix: empty
        ? 'The search finds nothing for this — a vocabulary or coverage gap (a concept page, or a synonym the index should know).'
        : 'Results came back and none was opened — look at what ranks first for it.',
      weight: m.times * 4 + (empty ? 4 : 0),
      links: [
        { label: 'try the search', href: `/search?q=${encodeURIComponent(m.q)}` },
        { label: 'the visit', href: `/analytics/session/${m.id}` },
      ],
    });
  }

  // Ask couldn't answer from the archive.
  const seenAsk = new Set<string>();
  for (const a of data.askAnswers) {
    if (!a.weak) continue;
    const key = a.q.toLowerCase().trim();
    if (seenAsk.has(key)) continue;
    seenAsk.add(key);
    out.push({
      id: idFor('ask', a.q),
      kind: 'ask',
      title: a.q,
      evidence: 'Ask answered that the archive doesn’t cover this',
      fix: 'Either the corpus has nothing on it, or retrieval didn’t find what it has — read the answer to tell which.',
      weight: 6,
      links: [{ label: 'the answers', href: '/analytics/answers' }],
    });
  }

  // Opened, then abandoned early.
  for (const p of data.depthPosts) {
    if (p.n < 8 || p.reach50 / p.n >= 0.3) continue;
    out.push({
      id: idFor('depth', p.slug),
      kind: 'depth',
      title: p.title,
      evidence: `${p.n} readers opened it; ${Math.round((p.reach50 / p.n) * 100)}% got halfway`,
      fix: 'People arrive and leave early — check what sends them here and whether the opening delivers on it.',
      weight: p.n,
      links: [{ label: 'its stats', href: `/analytics/post/${p.slug}` }],
    });
  }

  // Missing pages people actually hit.
  for (const m of data.missing) {
    if (m.n < 2) continue;
    out.push({
      id: idFor('broken', m.path),
      kind: 'broken',
      title: m.path,
      evidence: `Hit ${m.n} times in 14 days and there is no such page`,
      fix: 'Add a redirect to the right page, or fix the link that points here.',
      weight: m.n * 2,
      links: [],
    });
  }

  return out.sort((a, b) => b.weight - a.weight);
}

export async function oppStatuses(): Promise<Record<string, OppStatus>> {
  const kv = getKV();
  if (!kv) return {};
  try {
    const h = ((await kv.hgetall(STATUS_KEY)) ?? {}) as Record<string, unknown>;
    const out: Record<string, OppStatus> = {};
    for (const [id, v] of Object.entries(h)) if (v === 'done' || v === 'ignored') out[id] = v;
    return out;
  } catch {
    return {};
  }
}

/** Record the owner's verdict; null reopens the item. */
export async function setOppStatus(id: string, status: OppStatus | null): Promise<void> {
  const kv = getKV();
  if (!kv || !/^[a-z]+-[0-9a-f]{12}$/.test(id)) return;
  if (status) await kv.hset(STATUS_KEY, { [id]: status });
  else await kv.hdel(STATUS_KEY, id);
}
