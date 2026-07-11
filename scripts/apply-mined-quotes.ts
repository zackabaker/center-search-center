// Apply the 6 freshly mined defining quotes (2026-07-11 mining workflow) to
// glossary.ts. Unlike fix-glossary-quotes.ts these come from OUTSIDE the
// entries' passages: the old defining quote is demoted to the head of the
// passages array; the mined quote (verbatim, verified by the miner and
// re-verified here at serialization time by audit-glossary-quotes) leads.
// Usage: npx tsx scripts/apply-mined-quotes.ts
import { GLOSSARY } from '../src/data/guide/glossary';
import { getAllPosts } from '../src/lib/parser';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const MINED: Record<string, { quote: string; sourceSlug: string }> = {
  'centeredness': {
    quote: 'What makes GA, or more specifically “anthropomorphics” scientific here is that it posits, demonstrates and draws the conclusions from the inexorable centeredness of all human being.',
    sourceSlug: 'scenic-technics',
  },
  'contemplation': {
    quote: 'To “contemplate,” in grammatical terms, means to try out new “comments” along with the topic. These might be comments or predicates more likely to gain us access to the topic, or at least so we hope, but they might be comments or predicates that place the topic even further beyond our original desire.',
    sourceSlug: 'declarative-imaginary',
  },
  'legitimacy': {
    quote: 'Now we can speak of something equivalent to “legitimacy,” or the intrinsic relation between ostensive and imperative, as residing in the more specific origin of any community. The communist or liberal or revolutionary or usurpationist origin of the country where you find your obligations, then, cannot be “illegitimate.”',
    sourceSlug: 'center-and-origin-the-name-of-the-center-and-centered-names',
  },
  'rationality': {
    quote: 'The Otherness of the Trojans invades the world of the  Iliad  as an incentive to rationality, that is, the substitution of market for ritual exchange.',
    sourceSlug: 'clr-330',
  },
  'reliability': {
    quote: 'Michael Tomasello argues that the earliest declarative sentences—utterances beyond the imperative—concerned commentary on the reliability of other individuals as potential participants in common activity. That is, the earliest “vocation” of sentences was to establish reputation and authority—the very thing needed to authorize the sentence itself.',
    sourceSlug: 'the-sovereign-remembering-of-names',
  },
  'signifying-center': {
    quote: 'So, the "signifying center" is the meaning with which we imbue the occupied center and all its branches.',
    sourceSlug: 'adam-katz-how-do-you-define-the-concept-of-the-center',
  },
};

const posts = getAllPosts();
const bySlug = new Map(posts.map((p) => [p.slug, p]));
const SOURCE_LABEL: Record<string, string> = {
  substack: 'Substack', gablog: 'GABlog', book: 'Book', pdf: 'Essay',
  chronicle: 'Chronicles', ap: 'AP Journal', reddit: 'Substack', twitter: 'Substack',
};

let applied = 0;
const next = GLOSSARY.map((e) => {
  const m = MINED[e.slug];
  if (!m) return e;
  const post = bySlug.get(m.sourceSlug);
  if (!post) {
    console.error(`SKIP ${e.slug}: source post ${m.sourceSlug} not found`);
    return e;
  }
  // Sanity: the mined quote must be verbatim in its claimed source.
  const norm = (s: string) =>
    s.normalize('NFKC').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[—–]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();
  if (!norm(post.content).includes(norm(m.quote))) {
    console.error(`SKIP ${e.slug}: mined quote NOT verbatim in ${m.sourceSlug}`);
    return e;
  }
  applied++;
  const demoted = {
    text: e.definitionQuote,
    slug: e.definitionSlug,
    title: e.definitionSource,
    source: SOURCE_LABEL[bySlug.get(e.definitionSlug)?.source ?? ''] ?? 'Substack',
  };
  return {
    ...e,
    definitionQuote: m.quote,
    definitionSource: post.title,
    definitionSlug: post.slug,
    passages: [demoted, ...e.passages],
  };
});

// Same faithful serializer as fix-glossary-quotes.ts
const lit = (o: Record<string, unknown>) =>
  '{ ' +
  Object.entries(o)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join(', ') +
  ' }';
const litArr = (arr: Record<string, unknown>[]) => '[' + arr.map(lit).join(', ') + ']';
function serialize(e: (typeof next)[number]): string {
  const parts = [`term: ${JSON.stringify(e.term)}`, `slug: ${JSON.stringify(e.slug)}`];
  if (e.concept) parts.push(`concept: ${JSON.stringify(e.concept)}`);
  parts.push(
    `definitionQuote: ${JSON.stringify(e.definitionQuote)}`,
    `definitionSource: ${JSON.stringify(e.definitionSource)}`,
    `definitionSlug: ${JSON.stringify(e.definitionSlug)}`,
    `posts: ${e.posts}`,
    `passages: ${litArr(e.passages as unknown as Record<string, unknown>[])}`,
    `sources: ${litArr(e.sources as unknown as Record<string, unknown>[])}`
  );
  return `  { ${parts.join(', ')} },`;
}

const FILE = join(__dirname, '../src/data/guide/glossary.ts');
const raw = readFileSync(FILE, 'utf8');
const headerEnd = raw.indexOf('export const GLOSSARY: GlossaryEntry[] = [');
if (headerEnd === -1) throw new Error('GLOSSARY marker not found');
writeFileSync(
  FILE,
  raw.slice(0, headerEnd) +
    'export const GLOSSARY: GlossaryEntry[] = [\n' +
    next.map(serialize).join('\n') +
    '\n];\n'
);
console.log(`Applied ${applied}/6 mined defining quotes.`);
