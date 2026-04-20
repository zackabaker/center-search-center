import { Post } from './types';

export interface SearchEntry {
  slug: string;
  title: string;
  excerpt: string;
  source: Post['source'];
  date: string | null;
  titleWords: string[];
  contentWords: string[];
  content: string;
  readingTime: number;
}

export interface SearchResult {
  entry: SearchEntry;
  contextSnippet: string;
}

const STOPWORDS = new Set([
  // Articles, conjunctions, prepositions
  'the','a','an','and','or','but','in','on','at','to','for','of','with',
  'by','from','up','about','into','through','is','are','was','were','be',
  'been','being','have','has','had','do','does','did','will','would','could',
  'should','may','might','must','can','this','that','these','those','it',
  'its','he','she','they','we','you','i','my','our','your','his','her',
  'their','what','which','who','when','where','how','why','all','any',
  'both','each','few','more','most','other','some','such','no','not',
  'only','same','so','than','too','very','just','as','if','then',
  // Common verbs / filler
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

// Core vocabulary of Generative Anthropology — sourced from the GA Glossary.
// The concept index shows ONLY words that match these roots/stems (plus
// domain-adjacent terms discovered from corpus frequency).
export const GA_DOMAIN_VOCAB = new Set([
  // ── Originary / Scene / Event ──────────────────────────────────────────
  'originary','scene','event','hypothesis','aborted','appropriation',
  'sparagmos','victim','exemplary','firstness','secondness','thirdness',
  'iterative','ostensive','declarative','imperative','interrogative',
  // ── Mimesis / Desire ───────────────────────────────────────────────────
  'mimesis','mimetic','mimicism','mimism','desire','resentment','violence',
  'deferral','deferred','crisis','scapegoating','scapegoat','sacrificial',
  'sacrifice','ritual','sacred','sacrality','sacral','desacralization',
  'post-sacrificial','victimary','sparagmos',
  // ── Center / Sign ──────────────────────────────────────────────────────
  'center','centeredness','centering','centerlessness','centered',
  'decentered','omnicentrism','signifying','transcendental','sign',
  'signing','signification','significance','threshold','asymmetric',
  'asymmetrical','presencing','presence','imaginary','representation',
  'representational','scenic','scene',
  // ── Language / Grammar ────────────────────────────────────────────────
  'ostensive','declarative','imperative','interrogative','attentional',
  'attentionality','attention','linguistic','language','grammar',
  'construction','syntax','metalanguage','nominalization','logocentrism',
  'performativity','pragmatic','infralinguistic','folding','framing',
  'frame','chunking','utterance','literacy','generative','declarativity',
  'imperativity','intersubjective','intersubjectivity','intentionality',
  'intentional','collective','joint','ostension',
  // ── Anthropology / Culture ────────────────────────────────────────────
  'anthropology','anthropological','anthropomorphics','culture','cultural',
  'ritual','myth','narrative','mythological','axial','neolithic',
  'paleolithic','hominid','primate','evolution','evolutionary',
  'consciousness','cognition','cognitive','embodied','embodiment',
  'emic','etic','semantic','semiotic','semiotics',
  // ── Power / Politics / Society ────────────────────────────────────────
  'power','sovereignty','sovereign','authority','legitimacy','hierarchy',
  'hierarchical','bureaucracy','bureaucratic','chiefdom','tributarianism',
  'tribute','big man','jouvenelian','liberal','liberalism','tyranny',
  'tyrannical','charisma','charismatic','autocracy','autocratic',
  'governance','governance','metapolitics','political','politics',
  'reactionary','leftism','freedom','individualism','universalism',
  'rights','justice','morality','moral','ethics','ethical','law','legal',
  'victimary','victimhood','resentment','nihilism',
  // ── Discipline / Disciplinarity ───────────────────────────────────────
  'discipline','disciplinary','disciplinarity','interdisciplinary',
  'transdisciplinary','one-big-discipline','inquiry','explanation',
  'description','thematization','scientism','logocentrism','rationality',
  'wisdom','thinking','pedagogy','pedagogical','teaching','literacy',
  // ── Economics / Markets ───────────────────────────────────────────────
  'market','markets','capital','money','economic','economy','exchange',
  'reciprocity','familial','tributarian',
  // ── Aesthetics / Art ─────────────────────────────────────────────────
  'aesthetics','aesthetic','esthetic','art','artistic','satire','satiric',
  'originary-satire','high-art','popular','esthetic','contemplation',
  'sublime','beauty','graceful',
  // ── Gans / GA thinkers ───────────────────────────────────────────────
  'gans','girard','girardian','derrida','derridean','husserl','peirce',
  'peircean','saussure','chomsky','wittgenstein','jouvenel','hegel',
  'hegelian','nietzsche','nietzschean','darwin','darwinian',
  // ── Key compound concepts ─────────────────────────────────────────────
  'originary-scene','originary-event','originary-sign','originary-hypothesis',
  'shared-attention','joint-attention','minimal','minimalism',
  'deferral','deferred-violence','aborted','gesture',
  'transcendental','transcendence','sacred','profane','taboo',
  'totem','totemic','monotheism','monotheistic','polytheism','religion',
  'religious','metaphysics','metaphysical','ontology','ontological',
  'epistemology','epistemological',
  // ── Misc GA concepts ─────────────────────────────────────────────────
  'resentment','cringing','dogma','paradox','pragmatic','practice',
  'embodied','re-embedment','embedment','omnicentrism','verticism',
  'prometheanism','usurpation','charismatic','transgressive','graceful',
  'whig','victimary','nihilism','reactivity','reciprocity','reification',
  'logocentrism','scientism','rationality','consciousness','agency',
  'supplemented','supplementarity','technics','technology','media',
  'sparagmos','centralization','decentralization','asymmetric','symmetric',
  'iteration','iterative','surplus','scarcity','abundance',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
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

export function buildSearchEntries(posts: Post[]): SearchEntry[] {
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    source: post.source,
    date: post.date,
    titleWords: tokenize(post.title),
    contentWords: uniqueWords(tokenize(post.content)),
    content: post.content,
    readingTime: calcReadingTime(post.content),
  }));
}

function findMatchingSentence(content: string, query: string): string | null {
  const lowerQuery = query.toLowerCase();
  const sentences = content.split(/(?<=[.!?])\s+|(?:\n\n+)/);
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
  return null;
}

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

export function countPostsWithTerm(entries: SearchEntry[], term: string): number {
  const lower = term.toLowerCase();
  return entries.filter((e) =>
    e.title.toLowerCase().includes(lower) || e.content.toLowerCase().includes(lower)
  ).length;
}

export function searchEntries(entries: SearchEntry[], query: string): SearchResult[] {
  const { phrases, mustTerms, notTerms, orTerms, orMode, raw } = parseQuery(query);
  if (phrases.length === 0 && mustTerms.length === 0 && orTerms.length === 0) return [];

  const snippetQuery = phrases.length > 0 ? phrases[0] : raw;

  const scored = entries.map((entry) => {
    let score = 0;
    const lowerTitle = entry.title.toLowerCase();
    const lowerContent = entry.content.toLowerCase();

    for (const notTerm of notTerms) {
      if (lowerTitle.includes(notTerm) || lowerContent.includes(notTerm)) {
        return { entry, score: -1 };
      }
    }

    for (const phrase of phrases) {
      if (lowerTitle.includes(phrase)) score += 600;
      else if (lowerContent.includes(phrase)) score += 60;
      else return { entry, score: -1 };
    }

    if (orMode) {
      let anyMatch = false;
      for (const term of orTerms) {
        if (lowerTitle.includes(term)) { score += 100; anyMatch = true; }
        else if (entry.contentWords.some((w) => w === term)) { score += 10; anyMatch = true; }
        else if (entry.contentWords.some((w) => w.startsWith(term))) { score += 5; anyMatch = true; }
      }
      if (!anyMatch && phrases.length === 0) return { entry, score: -1 };
    } else {
      for (const term of mustTerms) {
        if (lowerTitle.includes(term)) {
          score += 100;
        } else if (entry.contentWords.some((w) => w === term)) {
          score += 10;
        } else if (entry.contentWords.some((w) => w.startsWith(term))) {
          score += 5;
        } else if (phrases.length === 0) {
          return { entry, score: -1 };
        }
      }
    }

    // Source priority multiplier: GABlog and Substack are primary sources;
    // Reddit comments are supplementary and should appear well below them.
    const SOURCE_WEIGHT: Record<string, number> = {
      gablog:   1.0,
      substack: 1.0,
      pdf:      0.9,
      book:     0.9,
      reddit:   0.25,
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
      contextSnippet: findMatchingSentence(s.entry.content, snippetQuery) || s.entry.excerpt,
    }));
}

// Returns terms for the concept index. Prioritizes GA domain vocabulary;
// supplements with corpus-frequent longer words that aren't generic English.
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

  // Common suffixes that form valid derivatives of a domain root word
  const DERIVATION_SUFFIXES = ['s','ed','ing','er','ers','al','ity','ism','ist','ize','izes',
    'ized','tion','tions','ness','ment','ments','ly','ical','ically'];

  function isDomainTerm(term: string): boolean {
    if (GA_DOMAIN_VOCAB.has(term)) return true;
    for (const vocab of GA_DOMAIN_VOCAB) {
      if (vocab.length < 5) continue;
      // Allow only clean suffix derivations: vocab + suffix = term
      for (const suffix of DERIVATION_SUFFIXES) {
        if (term === vocab + suffix) return true;
        // Handle e-dropping: "deferr" -> "deferral", "originar" -> "originarily"
        if (vocab.endsWith('e') && term === vocab.slice(0, -1) + suffix) return true;
      }
    }
    return false;
  }

  for (const [term, count] of freq.entries()) {
    const domain = isDomainTerm(term);

    // Include domain terms at lower frequency threshold; generic terms need higher freq + length
    if (domain && count >= minCount) {
      results.push({ term, count, isDomain: true });
    } else if (!domain && count >= 8 && term.length >= 7) {
      results.push({ term, count, isDomain: false });
    }
  }

  return results
    .sort((a, b) => {
      // Domain terms first within the same count band
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
