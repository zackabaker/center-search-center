// The site's stopword lists, gathered in one place. The sets differ on
// purpose — each is tuned to where it filters — so they are exported
// separately rather than merged; every set here moved verbatim from the file
// that now imports it, preserving behavior exactly.
//
// Two more inline lists still live in files owned by the open renderer PR
// (src/lib/lexical-passages.ts STOP ≈ RETRIEVAL_STOPWORDS + domain terms;
// src/components/HighlightedContent.tsx HIGHLIGHT_STOPWORDS ⊇ the base
// HIGHLIGHT_STOPWORDS below) — fold them in once that PR lands.

/** Aggressive list for the lexical search index: stripped from indexed
 *  content words (payload size) and from required query terms. */
export const STOPWORDS = new Set([
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

/** Filtered out of /api/chat retrieval query terms to reduce noise.
 *  Three-letters-and-up only; the caller already drops 1-char tokens. */
export const RETRIEVAL_STOPWORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one',
  'our', 'out', 'had', 'has', 'his', 'him', 'its', 'who', 'did', 'get', 'how', 'may',
  'say', 'she', 'use', 'way', 'also', 'back', 'been', 'does', 'from', 'have', 'here',
  'into', 'just', 'know', 'like', 'look', 'made', 'make', 'more', 'most', 'move',
  'much', 'need', 'only', 'over', 'said', 'same', 'than', 'that', 'them', 'then',
  'they', 'this', 'time', 'very', 'what', 'when', 'with', 'will', 'your', 'about',
  'after', 'again', 'being', 'could', 'doing', 'every', 'first', 'going', 'great',
  'other', 'right', 'since', 'some', 'still', 'there', 'these', 'think', 'those',
  'through', 'under', 'where', 'which', 'while', 'would', 'their', 'does', 'both',
  'each', 'even', 'from', 'give', 'good', 'help', 'high', 'keep', 'last', 'lets',
  'long', 'look', 'make', 'many', 'mean', 'might', 'must', 'next', 'often', 'play',
  'real', 'seem', 'show', 'such', 'talk', 'tell', 'turn', 'upon', 'used', 'well',
  'were', 'whether', 'within', 'without',
]);

/** Base highlight-skip list: words too common to light up on their own in a
 *  search-result snippet. */
export const HIGHLIGHT_STOPWORDS = new Set([
  'the', 'of', 'a', 'an', 'and', 'or', 'but', 'to', 'in', 'on', 'at', 'is', 'it',
  'as', 'by', 'for', 'with', 'that', 'this', 'be', 'are', 'was',
]);

/** Highlight-skip list for /ask excerpts: the base list plus question
 *  scaffolding ("what does … mean", "how do X and Y relate") and the site's
 *  own name, none of which say why a passage matched. */
export const ASK_HIGHLIGHT_STOPWORDS = new Set([
  ...HIGHLIGHT_STOPWORDS,
  'were', 'been', 'what', 'how', 'why', 'who', 'does', 'do', 'did',
  'these', 'those', 'its', 'about', 'from', 'can', 'not', 'his', 'her', 'their',
  'between', 'mean', 'meaning', 'relate', 'relationship', 'center', 'study',
]);
