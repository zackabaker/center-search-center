// What the tutor is handed with one question: the matching paragraphs, any
// further texts in full, and a note on how strongly the archive matched.
// One definition, used by the site's endpoint and the command-line scripts.
import { canonSlugs, estTokens, postBySlug, renderWholeText } from './context';
import { tutorRetrieve, type TutorHit } from './retrieve';

const WHOLE_BUDGET = 70_000; // tokens of further whole texts per question

export interface TutorTurnContext {
  content: string; // the user message as the model sees it
  hits: TutorHit[];
  whole: { slug: string; title: string }[];
  strength: string;
}

export function buildTurn(message: string, query: string, vec: Float32Array | null): TutorTurnContext {
  const hits = tutorRetrieve(query, vec, { limit: 18, perText: 2 });
  const whole: { slug: string; title: string; text: string }[] = [];
  let spent = 0;
  for (const h of hits) {
    if (whole.length >= 4) break;
    if (canonSlugs.has(h.slug) || whole.some((w) => w.slug === h.slug)) continue;
    if (h.source === 'twitter' || h.source === 'reddit') continue;
    const post = postBySlug(h.slug);
    if (!post) continue;
    const text = renderWholeText(post);
    const cost = estTokens(text);
    if (spent + cost > WHOLE_BUDGET) continue;
    spent += cost;
    whole.push({ slug: h.slug, title: post.title, text });
  }
  const cosines = hits.map((h) => h.cosine ?? 0);
  const strength =
    `closest match by meaning ${vec ? Math.max(0, ...cosines).toFixed(2) : 'unavailable'}` +
    `; ${cosines.filter((c) => c >= 0.62).length} of ${hits.length} paragraphs match closely` +
    `; ${hits.filter((h) => h.keywordRank !== null && h.keywordRank <= 20).length} match strongly on wording`;
  const content =
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
  return { content, hits, whole: whole.map(({ slug, title }) => ({ slug, title })), strength };
}

export const sourcesOf = (hits: TutorHit[]) =>
  hits.slice(0, 10).map((h) => ({ title: h.title, url: h.url, source: h.source, snippet: h.text.slice(0, 200) }));
