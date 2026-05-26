import { Post } from './types';

export interface SearchEntry {
  slug: string;
  title: string;
  excerpt: string;
  source: Post['source'];
  date: string | null;
  titleWords: string[];
  /** Unique, non-stop content words — used for term matching and inverted index.
   *  Stopwords excluded to keep payload small; phrase matching uses snippetContent. */
  contentWords: string[];
  /** Up to 8000 chars of content — used for phrase matching and snippet generation. */
  snippetContent: string;
  readingTime: number;
}

export interface SearchResult {
  entry: SearchEntry;
  contextSnippet: string;
  /** Approximate occurrence count of the first search term in snippetContent. */
  occurrences: number;
}

// ── Stopword list ────────────────────────────────────────────────────────────
const STOPWORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with',
  'by','from','up','about','into','through','is','are','was','were','be',
  'been','being','have','has','had','do','does','did','will','would','could',
  'should','may','might','must','can','this','that','these','those','it',
  'its','he','she','they','we','you','i','my','our','your','his','her',
  'their','what','which','who','when','where','how','why','all','any',
  'both','each','few','more','most','other','some','such','no','not',
  'only','same','so','than','too','very','just','as','if','then',
  'also','even','like','get','make','made','take','taken','give','given',
  'come','go','going','said','say','see','think','know','one','two','three',
  'them','him','her','who','that','than','then','thus','here','there',
  'over','after','before','while','since','still','now','new','use','used',
  'way','ways','fact','point','case','first','last','back','well','much',
  'many','long','need','needs','form','part','place','kind','come','means',
  'mean','because','through','rather','whether','without','often','already',
  'simply','around','though','always','never','every','within','between',
  'something','anything','nothing','everything','however','although',
  'while','must','again','another','itself','himself','herself','ourselves',
  'therefore','although','toward','towards','become','becomes','became',
  'actually','perhaps','simply','certain','certainly','different','general',
  'possible','possible','especially','including','however','example',
  'things','thing','make','made','take','takes','taken','give','gives',
  'given','comes','goes','gone','went','come','seems','seem','seemed',
  'let','lets','set','sets','put','puts','keep','keeps','kept',
  'want','wants','wanted','does','done','own','owned','having',
  'under','above','along','among','those','across','against','during',
  'following','including','indeed','instead','less','like','likewise',
  'merely','move','moves','much','neither','next','nor','note','off',
  'once','onto','open','per','rather','really','relatively','seems',
  'since','sometimes','soon','specific','such','tell','told','toward',
  'try','trying','turn','type','upon','various','via','view','views',
]);

// Core vocabulary of Generative Anthropology — used by getSignificantTerms.
export const GA_DOMAIN_VOCAB = new Set([
  'originary','scene','event','hypothesis','aborted','appropriation',
  'sparagmos','victim','exemplary','firstness','secondness','thirdness',
  'iterative','ostensive','declarative','imperative','interrogative',
  'mimesis','mimetic','mimicism','mimism','desire','resentment','violence',
  'deferral','deferred','crisis','scapegoating','scapegoat','sacrificial',
  'sacrifice','ritual','sacred','sacrality','sacral','desacralization',
  'post-sacrificial','victimary','sparagmos',
  'center','centeredness','centering','centerlessness','centered',
  'decentered','omnicentrism','signifying','transcendental','sign',
  'signing','signification','significance','threshold','asymmetric',
  'asymmetrical','presencing','presence','imaginary','representation',
  'representational','scenic','scene',
  'ostensive','declarative','imperative','interrogative','attentional',
  'attentionality','attention','linguistic','language','grammar',
  'construction','syntax','metalanguage','nominalization','logocentrism',
  'performativity','pragmatic','infralinguistic','folding','framing',
  'frame','chunking','utterance','literacy','generative','declarativity',
  'imperativity','intersubjective','intersubjectivity','intentionality',
  'intentional','collective','joint','ostension',
  'anthropology','anthropological','anthropomorphics','culture','cultural',
  'ritual','myth','narrative','mythological','axial','neolithic',
  'paleolithic','hominid','primate','evolution','evolutionary',
  'consciousness','cognition','cognitive','embodied','embodiment',
  'emic','etic','semantic','semiotic','semiotics',
  'power','sovereignty','sovereign','authority','legitimacy','hierarchy',
  'hierarchical','bureaucracy','bureaucratic','chiefdom','tributarianism',
  'tribute','big man','jouvenelian','liberal','liberalism','tyranny',
  'tyrannical','charisma','charismatic','autocracy','autocratic',
  'governance','governance','metapolitics','political','politics',
  'reactionary','leftism','freedom','individualism','universalism',
  'rights','justice','morality','moral','ethics','ethical','law','legal',
  'victimary','victimhood','resentment','nihilism',
  'discipline','disciplinary','disciplinarity','interdisciplinary',
  'transdisciplinary','one-big-discipline','inquiry','explanation',
  'description','thematization','scientism','logocentrism','rationality',
  'wisdom','thinking','pedagogy','pedagogical','teaching','literacy',
  'market','markets','capital','money','economic','economy','exchange',
  'reciprocity','familial','tributarian',
  'aesthetics','aesthetic','esthetic','art','artistic','satire','satiric',
  'originary-satire','high-art','popular','esthetic','contemplation',
  'sublime','beauty','graceful',
  'gans','girard','girardian','derrida','derridean','husserl','peirce',
  'peircean','saussure','chomsky','wittgenstein','jouvenel','hegel',
  'hegelian','nietzsche','nietzschean','darwin','darwinian',
  'originary-scene','originary-event','originary-sign','originary-hypothesis',
  'shared-attention','joint-attention','minimal','minimalism',
  'deferral','deferred-violence','aborted','gesture',
  'transcendental','transcendence','sacred','profane','taboo',
  'totem','totemic','monotheism','monotheistic','polytheism','religion',
  'religious','metaphysics','metaphysical','ontology','ontological',
  'epistemology','epistemological',
  'resentment','cringing','dogma','paradox','pragmatic','practice',
  'embodied','re-embedment','embedment','omnicentrism','verticism',
  'prometheanism','usurpation','charismatic','transgressive','graceful',
  'whig','victimary','nihilism','reactivity','reciprocity','reification',
  'logocentrism','scientism','rationality','consciousness','agency',
  'supplemented','supplementarity','technics','technology','media',
  'sparagmos','centralization','decentralization','asymmetric','symmetric',
  'iteration','iterative','surplus','scarcity','abundance',
]);

// ── Tokeniser ────────────────────────────────────────────────────────────────
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    // Hyphens become spaces so "Hermann-Hoppe" → ["hermann","hoppe"],
    // "post-sacrificial" → ["post","sacrificial"]. Apostrophes kept.
    .replace(/[^a-z0-9\s']/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function uniqueWords(words: string[]): string[] {
  return [...new Set(words)];
}

function calcReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 230));
}

// ── Light stemmer ────────────────────────────────────────────────────────────
// Strips common inflectional suffixes to a shared root. Applied at index-build
// time (each word is indexed under BOTH its original form AND its stem) and at
// query time (the query term is also looked up by stem). This enables
// "resentment" to find posts where only "resent" appears, and vice versa.
export function stemWord(w: string): string {
  const n = w.length;
  if (n <= 4) return w;
  // Longest suffixes first — order is critical
  if (n > 9 && w.endsWith('ically'))  return w.slice(0, -6);
  if (n > 8 && w.endsWith('ations'))  return w.slice(0, -6);
  if (n > 8 && w.endsWith('nesses'))  return w.slice(0, -6);
  if (n > 7 && w.endsWith('ation'))   return w.slice(0, -5);
  if (n > 7 && w.endsWith('ments'))   return w.slice(0, -5);
  if (n > 7 && w.endsWith('iness'))   return w.slice(0, -5);
  if (n > 6 && w.endsWith('ness'))    return w.slice(0, -4);
  if (n > 6 && w.endsWith('ment'))    return w.slice(0, -4);
  if (n > 6 && w.endsWith('ings'))    return w.slice(0, -4);
  if (n > 5 && w.endsWith('ing'))     return w.slice(0, -3);
  if (n > 5 && w.endsWith('ity'))     return w.slice(0, -3);
  if (n > 5 && w.endsWith('ism'))     return w.slice(0, -3);
  if (n > 5 && w.endsWith('ist'))     return w.slice(0, -3);
  if (n > 5 && w.endsWith('ied'))     return w.slice(0, -3) + 'y';
  if (n > 5 && w.endsWith('ies'))     return w.slice(0, -3) + 'y';
  if (n > 4 && w.endsWith('ed'))      return w.slice(0, -2);
  if (n > 5 && w.endsWith('ly'))      return w.slice(0, -2);
  if (n > 5 && w.endsWith('al'))      return w.slice(0, -2);
  if (n > 4 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

export function buildSearchEntries(posts: Post[]): SearchEntry[] {
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    source: post.source,
    date: post.date,
    titleWords: tokenize(post.title),
    // Strip stopwords from content words — reduces payload and index size.
    // Phrase queries still work because they search raw snippetContent text.
    contentWords: uniqueWords(tokenize(post.content)).filter((w) => !STOPWORDS.has(w)),
    // Up to 20000 chars for phrase matching + snippet generation
    snippetContent: post.content.slice(0, 20000),
    readingTime: calcReadingTime(post.content),
  }));
}

// ── Inverted index ───────────────────────────────────────────────────────────

export interface WordIndex {
  /** word → sorted array of entry indices */
  byWord: Map<string, number[]>;
  /** all indexed words, sorted — enables binary-search prefix matching */
  sortedVocab: string[];
}

/** Build once client-side from entries (cheap one-time cost on mount). */
export function buildWordIndex(entries: SearchEntry[]): WordIndex {
  // Use Sets during build to avoid duplicates when adding stemmed forms
  const byWordSet = new Map<string, Set<number>>();

  const add = (word: string, idx: number) => {
    let s = byWordSet.get(word);
    if (!s) { s = new Set(); byWordSet.set(word, s); }
    s.add(idx);
  };

  for (let i = 0; i < entries.length; i++) {
    // Index both content words and title words in the same map
    const words = new Set([...entries[i].contentWords, ...entries[i].titleWords]);
    for (const w of words) {
      add(w, i);
      // Also index under the stem — enables reverse morphological matching
      // (e.g. "resentment" in doc found by querying "resent", and vice versa)
      const s = stemWord(w);
      if (s !== w) add(s, i);
    }
  }

  // Convert sets → sorted arrays (sorted for binary search)
  const byWord = new Map<string, number[]>();
  for (const [w, set] of byWordSet) {
    byWord.set(w, [...set].sort((a, b) => a - b));
  }
  const sortedVocab = [...byWord.keys()].sort();
  return { byWord, sortedVocab };
}

/** Binary-search prefix matching — returns entry indices for all words starting with prefix. */
function getPrefixCandidates(idx: WordIndex, prefix: string): number[] {
  const { sortedVocab, byWord } = idx;
  let lo = 0, hi = sortedVocab.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sortedVocab[mid] < prefix) lo = mid + 1;
    else hi = mid;
  }
  const result: number[] = [];
  for (let i = lo; i < sortedVocab.length && sortedVocab[i].startsWith(prefix); i++) {
    const arr = byWord.get(sortedVocab[i]);
    if (arr) for (const n of arr) result.push(n);
  }
  return result;
}

/** Intersect multiple entry-index arrays → entries that contain ALL terms. */
function intersectCandidates(arrays: number[][]): Set<number> {
  if (arrays.length === 0) return new Set();
  const sets = arrays.map((a) => new Set(a));
  const [smallest] = [...sets].sort((a, b) => a.size - b.size);
  const result = new Set<number>();
  for (const idx of smallest) {
    if (sets.every((s) => s.has(idx))) result.add(idx);
  }
  return result;
}

// ── Query parser ─────────────────────────────────────────────────────────────

export interface ParsedQuery {
  phrases: string[];
  mustTerms: string[];
  notTerms: string[];
  orTerms: string[];
  orMode: boolean;
  raw: string;
}

export function parseQuery(raw: string): ParsedQuery {
  const phrases: string[] = [];
  let remaining = raw.replace(/"([^"]+)"/g, (_, phrase) => {
    phrases.push(phrase.toLowerCase().trim());
    return ' ';
  });

  const notTerms: string[] = [];
  remaining = remaining.replace(/(?:\bNOT\s+|-)(\w[\w'-]*)/gi, (_, term) => {
    notTerms.push(term.toLowerCase());
    return ' ';
  });

  const orMode = /\bOR\b/i.test(remaining);
  remaining = remaining.replace(/\b(?:AND|OR)\b/gi, ' ');

  const allTerms = tokenize(remaining);
  const mustTerms: string[] = [];
  const orTerms: string[] = [];

  if (orMode) {
    orTerms.push(...allTerms);
  } else {
    mustTerms.push(...allTerms);
  }

  const highlightRaw = phrases.length > 0
    ? phrases[0]
    : (mustTerms[0] || orTerms[0] || '');

  return { phrases, mustTerms, notTerms, orTerms, orMode, raw: highlightRaw };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function findMatchingSentence(snippetContent: string, query: string): string | null {
  const lower = snippetContent.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // 1. Exact phrase match within a sentence — fastest path
  const sentences = snippetContent.split(/(?<=[.!?])\s+|(?:\n\n+)/);
  for (const sentence of sentences) {
    if (sentence.toLowerCase().includes(lowerQuery)) {
      const trimmed = sentence.trim();
      if (trimmed.length < 10) continue;
      if (trimmed.length <= 220) return trimmed;
      const matchIndex = trimmed.toLowerCase().indexOf(lowerQuery);
      const start = Math.max(0, matchIndex - 80);
      const end = Math.min(trimmed.length, matchIndex + query.length + 80);
      let snippet = trimmed.slice(start, end);
      if (start > 0) snippet = '...' + snippet;
      if (end < trimmed.length) snippet = snippet + '...';
      return snippet;
    }
  }

  // 2. Proximity search — finds the window where all query words appear
  //    closest together, even when they're not literally adjacent.
  //    e.g. "cities safe" will match "Cities must not be made safe precisely."
  const words = lowerQuery.split(/\s+/).filter((w) => w.length >= 3);
  if (words.length === 0) return null;

  // Collect positions of every query word in the full content
  const allPositions: number[][] = words.map((word) => {
    const positions: number[] = [];
    let pos = 0;
    while ((pos = lower.indexOf(word, pos)) !== -1) {
      positions.push(pos);
      pos += word.length;
    }
    return positions;
  });

  // If any word has no positions at all, no match possible
  if (allPositions.some((p) => p.length === 0)) return null;

  // For each occurrence of the first word, find the closest occurrence of every
  // other word. Pick the anchor position whose total spread is smallest.
  let bestCenter = -1;
  let bestSpread = Infinity;

  for (const anchor of allPositions[0]) {
    let lo = anchor, hi = anchor + words[0].length;
    let valid = true;
    for (let i = 1; i < allPositions.length; i++) {
      const positions = allPositions[i];
      // Binary search for the position closest to anchor
      let left = 0, right = positions.length - 1;
      let closest = positions[0];
      while (left <= right) {
        const mid = (left + right) >> 1;
        if (Math.abs(positions[mid] - anchor) < Math.abs(closest - anchor)) {
          closest = positions[mid];
        }
        if (positions[mid] < anchor) left = mid + 1;
        else right = mid - 1;
      }
      // Give up if the words are too far apart (> 600 chars ≈ one long paragraph)
      if (Math.abs(closest - anchor) > 600) { valid = false; break; }
      lo = Math.min(lo, closest);
      hi = Math.max(hi, closest + words[i].length);
    }
    if (!valid) continue;
    const spread = hi - lo;
    if (spread < bestSpread) {
      bestSpread = spread;
      bestCenter = Math.floor((lo + hi) / 2);
    }
  }

  if (bestCenter === -1) return null;

  // Expand around the cluster center to get a readable ~260-char snippet
  const start = Math.max(0, bestCenter - 130);
  const end = Math.min(snippetContent.length, bestCenter + 130);
  let snippet = snippetContent.slice(start, end).trim();
  if (start > 0) snippet = '…' + snippet;
  if (end < snippetContent.length) snippet = snippet + '…';
  return snippet;
}

/** Count how many times `term` appears in `text` (case-insensitive). */
function countInText(text: string, term: string): number {
  if (!term) return 0;
  const lower = text.toLowerCase();
  const t = term.toLowerCase();
  let count = 0, pos = 0;
  while ((pos = lower.indexOf(t, pos)) !== -1) { count++; pos += t.length; }
  return count;
}

export function countPostsWithTerm(entries: SearchEntry[], term: string): number {
  const lower = term.toLowerCase();
  return entries.filter((e) => {
    if (e.titleWords.some((w) => w.includes(lower))) return true;
    // Check exact and prefix in content words
    if (e.contentWords.some((w) => w === lower || w.startsWith(lower))) return true;
    // Also scan raw snippet for compound / hyphenated occurrences
    return e.snippetContent.toLowerCase().includes(lower);
  }).length;
}

// ── Core search ──────────────────────────────────────────────────────────────

export function searchEntries(
  entries: SearchEntry[],
  query: string,
  wordIndex?: WordIndex,
): SearchResult[] {
  const { phrases, mustTerms, notTerms, orTerms, orMode, raw } = parseQuery(query);
  if (phrases.length === 0 && mustTerms.length === 0 && orTerms.length === 0) return [];

  const snippetQuery = phrases.length > 0 ? phrases[0] : raw;

  // ── Candidate pre-filtering via inverted index ──────────────────────────────
  // Narrows from all 819 entries to only those containing the required terms.
  // For a rare proper noun like "Hoppe" this goes from 819 iterations → 2.
  let indicesToScore: number[];

  if (wordIndex) {
    const getTermIndices = (term: string): number[] => {
      const exact = wordIndex.byWord.get(term) ?? [];
      const stemmed = stemWord(term);
      // Also look up the stem of the query term (catches derived forms in both directions)
      const stemExact = stemmed !== term ? (wordIndex.byWord.get(stemmed) ?? []) : [];
      if (term.length < 4) return [...new Set([...exact, ...stemExact])];
      const prefixed = getPrefixCandidates(wordIndex, term);
      // Prefix-expand the stem too (e.g. query "resentment" → stem "resent" → prefix finds "resentful" etc.)
      const stemPrefixed = (stemmed !== term && stemmed.length >= 4)
        ? getPrefixCandidates(wordIndex, stemmed)
        : [];
      return [...new Set([...exact, ...stemExact, ...prefixed, ...stemPrefixed])];
    };

    if (!orMode && (mustTerms.length > 0 || phrases.length > 0)) {
      // AND / phrase mode: entries must contain ALL required terms
      const required = [
        ...mustTerms,
        ...phrases.flatMap((p) => p.split(/\s+/).filter((w) => w.length >= 3)),
      ];
      if (required.length > 0) {
        indicesToScore = [...intersectCandidates(required.map(getTermIndices))];
      } else {
        indicesToScore = entries.map((_, i) => i);
      }
    } else if (orMode && (orTerms.length > 0 || phrases.length > 0)) {
      // OR mode: union of all term candidates
      const all = new Set<number>();
      [...orTerms, ...phrases.flatMap((p) => p.split(/\s+/).filter((w) => w.length >= 3))]
        .forEach((t) => getTermIndices(t).forEach((i) => all.add(i)));
      indicesToScore = [...all];
    } else {
      indicesToScore = entries.map((_, i) => i);
    }
  } else {
    indicesToScore = entries.map((_, i) => i);
  }

  // ── Scoring ─────────────────────────────────────────────────────────────────
  const scored = indicesToScore.map((entryIdx) => {
    const entry = entries[entryIdx];
    let score = 0;
    const lowerTitle = entry.title.toLowerCase();
    const lowerSnippet = entry.snippetContent.toLowerCase();
    // O(1) exact lookups
    const wordSet = new Set(entry.contentWords);

    // NOT terms — exclude immediately
    for (const notTerm of notTerms) {
      if (lowerTitle.includes(notTerm) || wordSet.has(notTerm) ||
          entry.contentWords.some((w) => w.startsWith(notTerm))) {
        return { entry, score: -1 };
      }
    }

    // Phrase terms
    for (const phrase of phrases) {
      if (lowerTitle.includes(phrase)) score += 600;
      else if (lowerSnippet.includes(phrase)) score += 60;
      // Fallback: all phrase words exist in document (words must be ≥ 3 chars to count)
      else if (phrase.split(/\s+/).every((w) =>
        w.length < 3 || entry.contentWords.some((cw) => cw.startsWith(w))
      )) score += 30;
      else return { entry, score: -1 };
    }

    if (orMode) {
      let anyMatch = false;
      for (const term of orTerms) {
        const inTitle = entry.titleWords.some((w) => w === term) ||
          (term.length >= 4 && entry.titleWords.some((w) => w.startsWith(term)));
        if (inTitle) { score += 100; anyMatch = true; }
        else if (wordSet.has(term)) { score += 10; anyMatch = true; }
        // Prefix expansion only for terms ≥ 4 chars to avoid false positives
        else if (term.length >= 4 && entry.contentWords.some((w) => w.startsWith(term))) {
          score += 5; anyMatch = true;
        }
      }
      if (!anyMatch && phrases.length === 0) return { entry, score: -1 };
    } else {
      for (const term of mustTerms) {
        const inTitle = entry.titleWords.some((w) => w === term) ||
          (term.length >= 4 && entry.titleWords.some((w) => w.startsWith(term)));
        if (inTitle) {
          score += 100;
        } else if (wordSet.has(term)) {
          score += 10;
        } else if (term.length >= 4 && entry.contentWords.some((w) => w.startsWith(term))) {
          // Prefix match only for longer terms — avoids "or"→"originary" false positives
          score += 5;
        } else if (phrases.length === 0) {
          return { entry, score: -1 };
        }
      }
    }

    // Multi-term title bonus: all query terms appear in title → strong relevance signal
    if (mustTerms.length > 1) {
      const allInTitle = mustTerms.every((t) =>
        entry.titleWords.some((w) => w === t || (t.length >= 4 && w.startsWith(t)))
      );
      if (allInTitle) score += 300;
    }

    // Recency boost: recent posts from primary sources ranked slightly higher
    if (entry.date) {
      const daysOld = (Date.now() - new Date(entry.date).getTime()) / 86_400_000;
      if (daysOld < 60) score *= 1.2;
      else if (daysOld < 365) score *= 1.08;
    }

    // Source weight: book is canonical > substack > gablog; tweets and Reddit supplementary
    const SOURCE_WEIGHT: Record<string, number> = {
      book: 1.1, substack: 1.0, gablog: 0.9, pdf: 0.85, reddit: 0.25, twitter: 0.35,
    };
    const weight = SOURCE_WEIGHT[entry.source] ?? 1.0;

    return { entry, score: score * weight };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 60)
    .map((s) => ({
      entry: s.entry,
      contextSnippet:
        findMatchingSentence(s.entry.snippetContent, snippetQuery) || s.entry.excerpt,
      occurrences: countInText(s.entry.snippetContent, snippetQuery),
    }));
}

// ── Concept index ────────────────────────────────────────────────────────────

export function getSignificantTerms(
  entries: SearchEntry[],
  minCount = 2,
  topN = 600
): { term: string; count: number }[] {
  const freq = new Map<string, number>();

  for (const entry of entries) {
    const words = new Set(entry.contentWords);
    for (const word of words) {
      if (word.length < 4) continue;
      if (STOPWORDS.has(word)) continue;
      if (/^\d+$/.test(word)) continue;
      freq.set(word, (freq.get(word) || 0) + 1);
    }
  }

  const results: { term: string; count: number; isDomain: boolean }[] = [];

  const DERIVATION_SUFFIXES = ['s','ed','ing','er','ers','al','ity','ism','ist','ize','izes',
    'ized','tion','tions','ness','ment','ments','ly','ical','ically'];

  function isDomainTerm(term: string): boolean {
    if (GA_DOMAIN_VOCAB.has(term)) return true;
    for (const vocab of GA_DOMAIN_VOCAB) {
      if (vocab.length < 5) continue;
      for (const suffix of DERIVATION_SUFFIXES) {
        if (term === vocab + suffix) return true;
        if (vocab.endsWith('e') && term === vocab.slice(0, -1) + suffix) return true;
      }
    }
    return false;
  }

  for (const [term, count] of freq.entries()) {
    const domain = isDomainTerm(term);
    if (domain && count >= minCount) {
      results.push({ term, count, isDomain: true });
    } else if (!domain && count >= 8 && term.length >= 7) {
      results.push({ term, count, isDomain: false });
    }
  }

  return results
    .sort((a, b) => {
      if (a.isDomain !== b.isDomain) return a.isDomain ? -1 : 1;
      return b.count - a.count;
    })
    .slice(0, topN)
    .map(({ term, count }) => ({ term, count }));
}

export function getRelatedEntries(
  target: SearchEntry,
  allEntries: SearchEntry[],
  limit = 5
): SearchEntry[] {
  const targetWords = new Set(target.contentWords.slice(0, 100));
  const scored = allEntries
    .filter((e) => e.slug !== target.slug)
    .map((entry) => {
      let overlap = 0;
      for (const w of entry.titleWords) {
        if (targetWords.has(w) && !STOPWORDS.has(w)) overlap += 10;
      }
      for (const w of entry.contentWords.slice(0, 100)) {
        if (targetWords.has(w) && !STOPWORDS.has(w)) overlap++;
      }
      return { entry, overlap };
    });

  return scored
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .filter((s) => s.overlap > 5)
    .map((s) => s.entry);
}

/**
 * Compute top terms for a single post — used by the Concordance component.
 * Returns words sorted by: domain terms first, then by frequency.
 */
export function getPostTermFrequency(
  content: string,
  topN = 25
): { word: string; count: number; isDomain: boolean }[] {
  const freq = new Map<string, number>();
  for (const w of tokenize(content)) {
    if (STOPWORDS.has(w) || w.length < 4 || /^\d+$/.test(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  return [...freq.entries()]
    .map(([word, count]) => ({ word, count, isDomain: GA_DOMAIN_VOCAB.has(word) }))
    .filter(({ count, isDomain }) => (isDomain ? count >= 1 : count >= 5))
    .sort((a, b) => {
      if (a.isDomain !== b.isDomain) return a.isDomain ? -1 : 1;
      return b.count - a.count;
    })
    .slice(0, topN);
}
