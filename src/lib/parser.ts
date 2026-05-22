import fs from 'fs';
import path from 'path';
import { Post, ContentSource } from './types';

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&hellip;/g, '…');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function excerpt(content: string, maxLen = 200): string {
  const cleaned = content
    .replace(/Thanks for reading[^]*?Subscribe/g, '')
    .replace(/\*\*.*?\*\*/g, '')
    .trim();
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.slice(0, maxLen).replace(/\s+\S*$/, '') + '...';
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED TEXT NORMALISATION
//
// Three extraction pipelines each lose whitespace differently:
//   GABlog  — HTML inline tags stripped without spaces
//   PDF BLOB (power-and-paradox, generative-anthropology) — extractor joined
//             visual lines without spaces; one giant line per paragraph
//   PDF WRAPPED (all others) — extractor kept column soft-wraps as \n;
//             ~55-char lines must be rejoined into prose paragraphs
//
// fixWordConcatenation() is the shared kernel; cleanPdfText() calls it.
// ─────────────────────────────────────────────────────────────────────────────

// Words safe to split BEFORE when preceded by >= 2 lowercase chars.
//
// SAFETY RULES — a word may only be in this list if:
//   1. It does NOT commonly appear as a suffix of another English word
//      preceded by 2+ lowercase chars (e.g. "call" is banned because
//      "drasti[call]y", "re[call]" fire everywhere).
//   2. The regex also requires a word-boundary lookahead (?=[^a-z]|$)
//      so the match only fires at the END of a lowercase run — but that
//      alone is insufficient for short words that end common words
//      ("recall.", "become.", "reform." all end sentences).
//
// BANNED short-word families:
//   -call  (drastically, locally, critically, recall)
//   -come  (become, income, welcome)
//   -form  (reform, transform, perform)
//   -move  (remove)  -turn (return)  -hold (behold, threshold)
//   -lead  (mislead)  -give (forgive)  -have (behave)
//   -ways  (always)   -role (parole)   -used (abused)
//   -work  (framework, network)  -back (setback)  -take (mistake)
//   -over  (recover, discover)   -each (bleach, preach)
//   -others (brothers)           -having/taking/making/saying/giving/coming
//   -similar (dissimilar)  -systems (ecosystems)
//   -history (prehistory)  -certain (uncertain)  -present (represent)
//   -being (wellbeing)  -where (elsewhere, somewhere)
//   -while (worthwhile) -other (another)  -still (standstill)
//   -place (displace)   -under (blunder)  -order (disorder)
//   -power (empower)    -state (overstate) -given (forgiven)
//   -moral (immoral)    -human (inhuman)   -world (underworld)
//   -think (rethink)    -point (viewpoint, checkpoint)
//
// Sorted longest-first so longer patterns win over shorter prefixes.
const SAFE_SPLIT_WORDS: string[] = [
  // 9-12 chars — very low false-positive risk
  'something', 'everything', 'therefore', 'meanwhile', 'throughout',
  'historical', 'secondary', 'economic', 'rational', 'cultural',
  'original', 'whatever', 'whenever', 'wherever', 'whoever', 'however',
  'although', 'whether',
  // 7-8 chars — verified safe
  'nothing', 'because', 'natural', 'general', 'primary', 'century',
  'reality', 'language', 'structure', 'against', 'without', 'between',
  'through', 'beneath', 'besides', 'towards', 'despite', 'outside',
  'already', 'another', 'further', 'central', 'perhaps',
  'subject', 'crucial',
  'always', 'people', 'modern', 'social', 'within', 'around',
  'beyond', 'across', 'during', 'unless', 'inside', 'toward',
  // 6 chars — verified safe
  'before', 'though', 'little', 'should', 'itself',
  'indeed', 'simply', 'almost', 'things', 'rights',
  'manner', 'became', 'become', 'rather', 'cannot',
  // 5 chars — only words that do NOT end common English words
  'which', 'would', 'could', 'every', 'their', 'there', 'these',
  'those', 'after', 'about', 'again', 'never', 'often',
  'along', 'among', 'above', 'below', 'until', 'maybe',
  'might', 'since', 'aside', 'whose',
  // No 4-letter words — every common 4-letter word appears as a suffix
  // of at least one legitimate English word and causes false splits.
].sort((a, b) => b.length - a.length);

/**
 * Fix word concatenation caused by whitespace-losing text extraction.
 *
 * Pass 1: sentence boundary  "class.Obviously"  -> "class. Obviously"
 * Pass 2: word boundary      "Veblen'sThe"      -> "Veblen's The"
 * Pass 3a: ordinals          "20thcentury"      -> "20th century"
 * Pass 3b: all-lowercase     "rightsbetween"    -> "rights between"
 *
 * Pass 3b uses SAFE_SPLIT_WORDS with a word-end lookahead (?=[^a-z]|$)
 * so the split only fires when the matched word ends a lowercase run
 * (e.g. "humanreality" splits, but "drastically" does not because
 * "call" is now banned and the lookahead would block it anyway).
 */
function fixWordConcatenation(text: string): string {
  let r = text
    .replace(/([a-z])([.!?])([A-Z])/g, '$1$2 $3')       // pass 1
    .replace(/([a-z'"”’\)])([A-Z][a-z])/g, '$1 $2') // pass 2
    .replace(/”([A-Za-z])/g, '” $1')           // pass 2b: curly closing-quote + letter
    .replace(/(\d+(?:st|nd|rd|th))([a-z])/gi, '$1 $2'); // pass 3a

  for (const w of SAFE_SPLIT_WORDS) {                     // pass 3b
    r = r.replace(new RegExp(`([a-z]{2,})(${w})(?=[^a-z]|$)`, 'g'), '$1 $2');
  }
  return r;
}

// GABlog wrapper — kept as named function for parseGABlogPosts clarity
function fixGABlogSpacing(text: string): string {
  return fixWordConcatenation(text);
}

function parseGABlogPosts(text: string): Post[] {
  const posts: Post[] = [];
  const entries = text.split(/\n\nTitle: /);

  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i];
    if (i === 0) {
      // First entry might start with "Title: " directly
      if (entry.startsWith('Title: ')) {
        entry = entry.slice(7);
      } else {
        continue;
      }
    }

    const titleEnd = entry.indexOf('\n');
    if (titleEnd === -1) continue;

    const title = entry.slice(0, titleEnd).trim();
    let content = '';

    const articleMatch = entry.indexOf('Article: ');
    if (articleMatch !== -1) {
      content = entry.slice(articleMatch + 9).trim();
    } else {
      content = entry.slice(titleEnd + 1).trim();
    }

    if (!title || !content) continue;

    const cleanedContent = fixGABlogSpacing(content);
    const slug = 'gablog-' + slugify(title);
    posts.push({
      slug,
      title,
      content: cleanedContent,
      excerpt: excerpt(cleanedContent),
      date: null,
      source: 'gablog' as ContentSource,
    });
  }

  return posts;
}

function parseBook(): Post[] {
  const bookPath = path.join(process.cwd(), 'src', 'data', 'anthropomorphics.md');
  if (!fs.existsSync(bookPath)) return [];

  const content = fs.readFileSync(bookPath, 'utf-8');
  // Strip the markdown title line for the excerpt
  const contentBody = content.replace(/^#[^\n]*\n+/, '').trim();

  return [{
    slug: 'book-anthropomorphics',
    title: 'Anthropomorphics: An Originary Grammar of the Center',
    content: contentBody,
    excerpt: excerpt(contentBody),
    date: null,
    source: 'book' as ContentSource,
  }];
}

function parseSubstackPosts(text: string): Post[] {
  const posts: Post[] = [];
  // Split on markdown headings
  const entries = text.split(/^# /m);

  for (const entry of entries) {
    if (!entry.trim()) continue;

    const lines = entry.split('\n');
    const title = lines[0].trim();
    if (!title) continue;

    let date: string | null = null;
    let likes: number | undefined;
    let contentStart = 1;

    for (let i = 1; i < lines.length && i < 8; i++) {
      const line = lines[i].trim();
      // Date line: **Mon DD, YYYY** or **Month DD, YYYY**
      const dateMatch = line.match(/^\*\*([A-Z][a-z]+ \d{1,2}, \d{4})\*\*$/);
      if (dateMatch) {
        date = dateMatch[1];
        contentStart = i + 1;
        continue;
      }
      // Likes line: **Likes:** N
      const likesMatch = line.match(/^\*\*Likes:\*\*\s*(\d+)/);
      if (likesMatch) {
        likes = parseInt(likesMatch[1], 10);
        contentStart = i + 1;
        continue;
      }
      if (line === '') continue;
      // Once we hit non-metadata content, stop
      if (!line.startsWith('**')) {
        contentStart = i;
        break;
      }
    }

    const content = lines.slice(contentStart).join('\n').trim();
    const substackSlug = slugify(title);

    posts.push({
      slug: 'substack-' + substackSlug,
      title,
      content,
      excerpt: excerpt(content),
      date,
      source: 'substack' as ContentSource,
      likes,
      url: `https://dennisbouvard.substack.com/p/${substackSlug}`,
    });
  }

  return posts;
}

// Custom metadata for PDFs: map filename (without extension) to title and source override
const PDF_METADATA: Record<string, { title: string; source?: ContentSource }> = {
  'the-origin-of-language': {
    title: 'The Origin of Language',
    source: 'book',
  },
  'why-generative-anthropology': {
    title: 'Why Generative Anthropology (Peter Goldman)',
  },
  'the-anthropoetics-of-power': {
    title: 'The Anthropoetics of Power',
  },
  'talk-of-the-center-adam-katz': {
    title: 'Talk of the Center (Adam Katz)',
  },
  'event-origin-center': {
    title: 'Event, Origin, Center (Adam Katz)',
  },
  'originary-technics': {
    title: 'Originary Technics (Adam Katz)',
  },
  'there-is-no-economy': {
    title: 'There Is No Economy but Only the Debt to the Center',
  },
  'linguistic-turn-generative-literacy': {
    title: 'The Linguistic Turn and Generative Literacy (Adam Katz)',
  },
  'esthetic-sacred-originary-modernity': {
    title: 'The Esthetic, the Sacred, and Originary Modernity (Adam Katz)',
  },
  'power-and-paradox': {
    title: 'Power and Paradox (Adam Katz)',
  },
  'generative-anthropology-one-big-discipline': {
    title: 'Generative Anthropology as the One Big Discipline (Adam Katz)',
  },
  'mimesis-center-auto-immunology': {
    title: 'Mimesis, the Center and Auto-Immunology: A Review of Psychopolitical Anaphylaxis (Adam Katz)',
  },
  'nemesis-jouvenelian-liberal-model': {
    title: 'Book Review: Nemesis — The Jouvenelian vs. the Liberal Model of Human Orders (Adam Katz)',
  },
  'introduction-to-disciplinarity': {
    title: 'An Introduction to Disciplinarity (Adam Katz)',
  },
  'attentionality-originary-ethics': {
    title: 'Attentionality and Originary Ethics: Upclining (Adam Katz)',
  },
};

// ── Twitter / X ───────────────────────────────────────────────────────────────
// tweets.json is written by scripts/fetch-tweets.ts.
// Tweets are grouped by conversation_id so threads appear as a single Post.

interface TweetRecord {
  id: string;
  text: string;
  created_at: string;
  conversation_id: string;
  in_reply_to_user_id?: string;
  public_metrics?: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
  };
}

function tweetTitle(text: string, date: string): string {
  // Strip trailing URLs (t.co links) and @mentions at the very start
  const stripped = text
    .replace(/^(@\w+\s+)+/, '')   // leading mentions (replies)
    .replace(/https?:\/\/\S+/g, '')
    .trim();
  if (!stripped || stripped.length < 8) {
    return `Tweet — ${date}`;
  }
  const words = stripped.split(/\s+/);
  if (words.length <= 14) return stripped;
  return words.slice(0, 14).join(' ') + '…';
}

function parseTweets(): Post[] {
  const tweetsPath = path.join(process.cwd(), 'src', 'data', 'tweets.json');
  if (!fs.existsSync(tweetsPath)) return [];

  let data: { author_id: string; tweets: TweetRecord[] };
  try {
    data = JSON.parse(fs.readFileSync(tweetsPath, 'utf-8'));
  } catch { return []; }

  const { author_id, tweets } = data;
  if (!tweets?.length) return [];

  // Group by conversation_id so threads become a single Post.
  // Tweets without conversation_id (shouldn't happen) fall through as singles.
  const threads = new Map<string, TweetRecord[]>();
  for (const t of tweets) {
    const key = t.conversation_id || t.id;
    if (!threads.has(key)) threads.set(key, []);
    threads.get(key)!.push(t);
  }

  const posts: Post[] = [];

  for (const [conversationId, group] of threads) {
    // Sort thread chronologically
    group.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    // Root = the tweet that started the conversation (its own id == conversation_id)
    // If not present (we only have replies), use the earliest tweet.
    const rootTweet = group.find((t) => t.id === conversationId) ?? group[0];

    // Exclude threads whose root is a reply to someone else — unless author_id is known
    // and this thread contains at least one tweet the author sent (always true since we
    // fetched from their timeline). Keep everything.

    // Build content: all tweet texts joined, with subtle separator for multi-tweet threads
    const content = group.length === 1
      ? rootTweet.text
      : group.map((t, i) => (i === 0 ? t.text : `\n${t.text}`)).join('\n');

    const dateObj = new Date(rootTweet.created_at);
    const dateStr = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

    const title = tweetTitle(rootTweet.text, dateStr);
    const totalLikes = group.reduce((s, t) => s + (t.public_metrics?.like_count ?? 0), 0);

    posts.push({
      slug: `twitter-${conversationId}`,
      title,
      content,
      excerpt: excerpt(rootTweet.text),
      date: dateStr,
      source: 'twitter' as ContentSource,
      likes: totalLikes || undefined,
      url: `https://x.com/${author_id ? 'bouvard38829538' : 'i'}/status/${conversationId}`,
    });
  }

  // Newest-first
  posts.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return posts;
}

function parseRedditComments(): Post[] {
  const redditPath = path.join(process.cwd(), 'src', 'data', 'reddit_comments.json');
  if (!fs.existsSync(redditPath)) return [];

  interface RedditComment {
    body: string;
    created_utc: number;
    link_title?: string;
    subreddit?: string;
    permalink?: string;
  }

  const comments: RedditComment[] = JSON.parse(
    fs.readFileSync(redditPath, 'utf-8')
  );

  // Group comments by thread (link_title) so we don't have 641 individual tiny entries
  const threads = new Map<string, RedditComment[]>();
  for (const c of comments) {
    if (!c.body || c.body === '[deleted]' || c.body === '[removed]') continue;
    const key = c.link_title || 'Untitled Thread';
    if (!threads.has(key)) threads.set(key, []);
    threads.get(key)!.push(c);
  }

  const posts: Post[] = [];
  for (const [threadTitle, threadComments] of threads) {
    // Sort comments in a thread chronologically
    threadComments.sort((a, b) => a.created_utc - b.created_utc);

    // Skip threads where all comments are just bare URLs or very short (link-post threads)
    const hasSubstantiveContent = threadComments.some((c) => {
      const trimmed = c.body.trim();
      const isUrl = /^https?:\/\/\S+$/.test(trimmed);
      const wordCount = trimmed.split(/\s+/).length;
      return !isUrl && wordCount >= 10;
    });
    if (!hasSubstantiveContent) continue;

    const content = threadComments
      .map((c) => c.body)
      .join('\n\n---\n\n');

    const earliest = threadComments[0];
    const date = new Date(earliest.created_utc * 1000);
    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

    const subreddit = earliest.subreddit || 'unknown';
    const permalink = earliest.permalink
      ? `https://reddit.com${earliest.permalink}`
      : undefined;

    const excerpt = threadComments[0].body.slice(0, 200) + (threadComments[0].body.length > 200 ? '...' : '');

    posts.push({
      slug: 'reddit-' + slugify(threadTitle),
      title: threadTitle,
      content,
      excerpt,
      date: dateStr,
      source: 'reddit' as ContentSource,
      url: permalink,
    });
  }

  return posts;
}

/**
 * Clean and normalise PDF text extracted from browser-printed PDFs.
 *
 * Two PDF extraction formats exist in this corpus:
 *
 * WRAPPED (most PDFs, avg line ~55 chars):
 *   Each line is a visual column wrap from the PDF page. Paragraph breaks
 *   are blank lines. Lines within a paragraph must be rejoined with a space;
 *   end-of-line hyphens are soft hyphenation that should be removed.
 *
 * BLOB (power-and-paradox, generative-anthropology, avg line >400 chars):
 *   The extractor joined every visual line within a paragraph into one
 *   giant string without spaces. Paragraph breaks (blank lines) survive.
 *   The word-concatenation fix handles the missing spaces.
 *
 * Both formats also suffer from:
 *   - Browser-print headers/footers (date/time stamps, page numbers, URLs)
 *   - Letter-spaced decorative titles ("T a l k   o f   t h e   C e n t e r")
 *   - Word concatenations at extraction boundaries
 */
function cleanPdfText(raw: string): string {
  // ── Step 1: strip browser-print headers and footers ───────────────────────
  const lines = raw.split('\n');
  const filtered: string[] = [];
  for (const line of lines) {
    // "5/9/25, 2:43 PM  The Anthropoetics of Power..."
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4},\s+\d+:\d+\s+[AP]M/.test(line)) continue;
    // "Page 12 of 23https://..."
    if (/^Page \d+ of \d+https?:\/\//.test(line)) continue;
    // Bare URL lines
    if (/^https?:\/\/\S+$/.test(line.trim())) continue;
    filtered.push(line);
  }

  // ── Step 2: detect format ────────────────────────────────────────────────
  const nonEmpty = filtered.filter(l => l.trim().length > 0);
  const avgLineLen = nonEmpty.length
    ? nonEmpty.reduce((s, l) => s + l.length, 0) / nonEmpty.length
    : 0;
  const isBlob = avgLineLen > 400;

  let text = filtered.join('\n');

  // ── Step 3 (WRAPPED only): rejoin visual soft-wraps into prose ───────────
  // Single \n between two non-empty lines = PDF column wrap, not a paragraph
  // break. Join with a space; if the line ended with a hyphen, dehyphenate.
  if (!isBlob) {
    text = text.replace(/([^\n])\n([^\n])/g, (_, before, after) =>
      before.endsWith('-') ? before.slice(0, -1) + after : before + ' ' + after
    );

    // After rejoining, remaining blank lines (\n\n) should be paragraph breaks.
    // Exception: a page break in the middle of a paragraph leaves a spurious
    // blank line between text that doesn't end in terminal punctuation and
    // continuation that starts with a lowercase letter -> merge.
    text = text.replace(/([a-zA-Z0-9"'])\n\n([a-z])/g, '$1 $2');
  }

  // ── Step 4: fix letter-spaced decorative text ────────────────────────────
  // "T a l k   o f   t h e   C e n t e r" -> "Talk of the Center"
  // Pattern: 4+ groups of (single letter + spaces) before a final letter.
  text = text.replace(/([A-Za-z] ){4,}[A-Za-z]/g, m => m.replace(/ /g, ''));

  // ── Step 5: fix word concatenation ───────────────────────────────────────
  // Handles both BLOB (words jammed together across line-joins) and residual
  // WRAPPED artifacts. Uses the shared fixWordConcatenation kernel.
  text = fixWordConcatenation(text);

  // ── Step 6: normalise whitespace ─────────────────────────────────────────
  // Collapse 3+ blank lines to 2 (one paragraph separator).
  // Collapse multiple spaces within lines to one space.
  text = text
    .replace(/ {2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return text;
}

function parsePDFs(): Post[] {
  const pdfDir = path.join(process.cwd(), 'public', 'pdfs');
  if (!fs.existsSync(pdfDir)) return [];

  const posts: Post[] = [];
  const txtFiles = fs.readdirSync(pdfDir).filter((f) => f.endsWith('.txt'));

  for (const txtFile of txtFiles) {
    const raw = fs.readFileSync(path.join(pdfDir, txtFile), 'utf-8');
    const content = cleanPdfText(raw);
    const baseName = txtFile.replace('.txt', '');
    const meta = PDF_METADATA[baseName];
    const title = meta?.title || baseName.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const source = meta?.source || ('pdf' as ContentSource);
    const prefix = source === 'book' ? 'book' : 'pdf';

    posts.push({
      slug: `${prefix}-${slugify(baseName)}`,
      title,
      content,
      excerpt: excerpt(content),
      date: null,
      source,
      url: `/pdfs/${baseName}.pdf`,
    });
  }

  return posts;
}

export function parseAllContent(): Post[] {
  const filePath = path.join(process.cwd(), 'src', 'data', 'ga_context.txt');
  const raw = fs.readFileSync(filePath, 'utf-8');

  const gablogMatch = raw.match(/<generative_anthropology_blog>([\s\S]*?)<\/generative_anthropology_blog>/);
  const substackMatch = raw.match(/<dennis_bouvard_substack>([\s\S]*?)<\/dennis_bouvard_substack>/);

  const allPosts: Post[] = [];

  if (gablogMatch) allPosts.push(...parseGABlogPosts(gablogMatch[1]));
  allPosts.push(...parseBook());
  if (substackMatch) allPosts.push(...parseSubstackPosts(substackMatch[1]));
  allPosts.push(...parseRedditComments());
  allPosts.push(...parsePDFs());
  allPosts.push(...parseTweets());

  // Decode HTML entities in all text fields
  for (const post of allPosts) {
    post.title = decodeHtmlEntities(post.title);
    post.content = decodeHtmlEntities(post.content);
    post.excerpt = decodeHtmlEntities(post.excerpt);
  }

  // Deduplicate slugs
  const seenSlugs = new Map<string, number>();
  for (const post of allPosts) {
    const baseSlug = post.slug;
    const count = seenSlugs.get(baseSlug) || 0;
    if (count > 0) post.slug = `${baseSlug}-${count}`;
    seenSlugs.set(baseSlug, count + 1);
  }

  return allPosts;
}

// Module-level cache — populated on first call and reused for the lifetime
// of the Node.js process. On a cold start, we first try to load the
// pre-serialised JSON cache (generated by scripts/generate-posts-cache.ts
// during prebuild). JSON.parse is ~50x faster than the custom parsing logic,
// cutting cold-start time from ~5 s to <200 ms.
let _postsCache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (_postsCache) return _postsCache;

  // Try the pre-built JSON cache first
  const cachePath = path.join(process.cwd(), 'src', 'data', 'posts-cache.json');
  if (fs.existsSync(cachePath)) {
    try {
      _postsCache = JSON.parse(fs.readFileSync(cachePath, 'utf-8')) as Post[];
      return _postsCache;
    } catch {
      // Corrupt or missing cache — fall through to full parse
    }
  }

  // Fall back to full parse (dev mode / first build)
  _postsCache = parseAllContent();
  return _postsCache;
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}
