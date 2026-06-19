/**
 * Influence graph. Scans the corpus for the thinkers Katz engages, counting
 * mentions, the essays where each appears most, and which thinkers co-occur
 * (shared essays) — the edges of the intellectual network. Pure text scan, no
 * embeddings, so it's a fast build step. Writes src/data/thinkers.json.
 */
import fs from 'fs';
import path from 'path';

interface Post { slug: string; title: string; content: string; source: string; date: string | null; }

const DATA = path.join(process.cwd(), 'src', 'data');

// Curated — name plus an optional explicit match pattern. Excludes thinkers with
// too few mentions to be meaningful.
const THINKERS: { name: string; match?: string; note: string }[] = [
  { name: 'Girard', note: 'Mimetic theory — the grandfather of the tradition' },
  { name: 'Gans', note: 'Generative Anthropology; the originary hypothesis' },
  { name: 'Derrida', note: 'Deconstruction; the center that "is not the center"' },
  { name: 'Nietzsche', note: 'Resentment, genealogy, the death of God' },
  { name: 'Rousseau', note: 'The social contract and originary equality' },
  { name: 'Plato', note: 'Metaphysics and the form of the Good' },
  { name: 'Marx', note: 'Capital, value, and ideology critique' },
  { name: 'Freud', note: 'Desire, the unconscious, the primal horde' },
  { name: 'Durkheim', note: 'The sacred and collective effervescence' },
  { name: 'Kant', note: 'The transcendental and the moral law' },
  { name: 'Hegel', note: 'Recognition, master and slave, the dialectic' },
  { name: 'Heidegger', note: 'Being, technology, and presence' },
  { name: 'Hobbes', note: 'The state of nature and the sovereign' },
  { name: 'Aristotle', note: 'Mimesis, ethics, the political animal' },
  { name: 'Bataille', note: 'Expenditure, sacrifice, the accursed share' },
  { name: 'Darwin', note: 'Evolution and the emergence of the human' },
  { name: 'Peirce', note: 'The sign: symbol, index, icon' },
  { name: 'Strauss', match: 'Strauss', note: 'Esotericism and the ancients' },
  { name: 'Foucault', note: 'Power, discipline, discourse' },
  { name: 'Chomsky', note: 'Universal grammar and the language faculty' },
  { name: 'Goldman', note: 'Generative anthropology of literature' },
  { name: 'Burke', note: 'Tradition and the sublime' },
  { name: 'Voegelin', note: 'Order, gnosticism, the sacred in politics' },
  { name: 'Arendt', note: 'Action, natality, the public realm' },
  { name: 'Saussure', note: 'The arbitrary sign and structural linguistics' },
  { name: 'Graeber', note: 'Debt and the origins of money' },
  { name: 'Lacan', note: 'The symbolic, desire of the Other' },
  { name: 'Wittgenstein', note: 'Language games and use' },
  { name: 'Mauss', note: 'The gift and reciprocal exchange' },
  { name: 'Jouvenel', note: 'Power and its self-expansion' },
];

function rx(t: { name: string; match?: string }): RegExp {
  return new RegExp(`\\b${(t.match ?? t.name).replace(/[-]/g, '\\-')}\\b`, 'g');
}

function main() {
  const posts: Post[] = JSON.parse(fs.readFileSync(path.join(DATA, 'posts-cache.json'), 'utf-8'));

  // Per-thinker per-post counts, and the set of posts each appears in.
  const appearsIn: Record<string, Set<string>> = {};
  const out = THINKERS.map((t) => {
    const re = rx(t);
    const perPost: { slug: string; title: string; date: string | null; count: number }[] = [];
    const inPosts = new Set<string>();
    let mentions = 0;
    for (const p of posts) {
      const n = (p.content.match(re) || []).length;
      if (n > 0) { mentions += n; inPosts.add(p.slug); perPost.push({ slug: p.slug, title: p.title, date: p.date, count: n }); }
    }
    appearsIn[t.name] = inPosts;
    perPost.sort((a, b) => b.count - a.count);
    return { name: t.name, note: t.note, mentions, postCount: inPosts.size, topPosts: perPost.slice(0, 6) };
  }).filter((t) => t.mentions >= 40).sort((a, b) => b.mentions - a.mentions);

  // Co-occurrence (shared essays) → network edges and per-thinker affinities.
  const names = out.map((t) => t.name);
  const edges: { a: string; b: string; weight: number }[] = [];
  const cooccur: Record<string, { name: string; count: number }[]> = {};
  for (const a of names) cooccur[a] = [];
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      let shared = 0;
      const sa = appearsIn[names[i]], sb = appearsIn[names[j]];
      const [small, big] = sa.size < sb.size ? [sa, sb] : [sb, sa];
      for (const s of small) if (big.has(s)) shared++;
      if (shared > 0) {
        edges.push({ a: names[i], b: names[j], weight: shared });
        cooccur[names[i]].push({ name: names[j], count: shared });
        cooccur[names[j]].push({ name: names[i], count: shared });
      }
    }
  }
  for (const n of names) cooccur[n].sort((x, y) => y.count - x.count);

  const thinkers = out.map((t) => ({ ...t, related: cooccur[t.name].slice(0, 5) }));
  edges.sort((a, b) => b.weight - a.weight);

  fs.writeFileSync(path.join(DATA, 'thinkers.json'), JSON.stringify({ thinkers, edges }));
  console.log(`✓ wrote thinkers.json (${thinkers.length} thinkers, ${edges.length} edges)`);
}

main();
