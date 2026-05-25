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
  // REMOVED: 'rational'  → false-splits 'generational', 'operational'
  // REMOVED: 'cultural'  → false-splits 'agricultural', 'multicultural'
  // REMOVED: 'historical' → false-splits 'ahistorical', 'prehistorical'
  // REMOVED: 'original'  → false-splits 'unoriginal'
  // REMOVED: 'economic'  → false-splits 'macroeconomic', 'socioeconomic'
  // REMOVED: 'natural'   → false-splits 'supernatural', 'unnatural'
  // REMOVED: 'structure' → false-splits 'infrastructure', 'superstructure'
  // REMOVED: 'reality'   → false-splits 'unreality', 'hyperreality'
  // REMOVED: 'social'    → false-splits 'antisocial'
  // REMOVED: 'modern'    → false-splits 'postmodern'
  // REMOVED: 'language'  → false-splits 'metalanguage'
  'something', 'everything', 'therefore', 'meanwhile', 'throughout',
  'secondary', 'whatever', 'whenever', 'wherever', 'whoever', 'however',
  'although', 'whether',
  // 7-8 chars — verified safe
  'nothing', 'because', 'general', 'primary', 'century',
  'against', 'without', 'between',
  'through', 'beneath', 'besides', 'towards', 'despite', 'outside',
  'already', 'another', 'further', 'central', 'perhaps',
  'subject', 'crucial',
  'always', 'people', 'within', 'around',
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
    .replace(/([a-z])([.!?])([A-Z])/g, '$1$2 $3')
    .replace(/([a-z'””'\\)])([A-Z][a-z])/g, '$1 $2')
    .replace(/”([A-Za-z])/g, '” $1')
    .replace(/(\d+(?:st|nd|rd|th))([a-z])/gi, '$1 $2')
    // digit immediately before a title-case word: “1991Rights” → “1991 Rights”
    .replace(/(\d)([A-Z][a-z])/g, '$1 $2');

  for (const w of SAFE_SPLIT_WORDS) {
    r = r.replace(new RegExp('([a-z]{2,})(' + w + ')(?=[^a-z]|$)', 'g'), '$1 $2');
  }
  return r;
}

// GABlog wrapper — restores paragraph structure lost during HTML scraping.
//
// The gablog HTML stored each article as <p>...</p><p>...</p> blocks.
// When those tags were stripped without inserting whitespace, paragraph
// boundaries collapsed into sentence-runs like "...terrain.I would like..."
//
// fixWordConcatenation pass 1 adds a SPACE at "[a-z].[A-Z]" boundaries.
// Here we go further and promote those to DOUBLE-NEWLINES so the page
// renderer can split them back into proper paragraph elements.
//
// Only .[A-Z] boundaries that had NO original space (i.e. were genuine
// paragraph-break artifacts) are affected — within-paragraph sentence
// transitions like "strong. However" already had spaces and are untouched.
function fixGABlogSpacing(text: string): string {
  // Step 1: fix inline word concatenations (all passes)
  let r = fixWordConcatenation(text);

  // Step 2 (removed): sentence-boundary → paragraph-break conversion was
  // incorrectly splitting every sentence into its own paragraph. The original
  // ga_context.txt stores each post as a single block of prose with no
  // paragraph markers, so converting “. Capital” → “\n\n” destroys readability.
  // The text already reads as coherent prose after word-concat fixes; we don't
  // try to reconstruct paragraph structure heuristically.

  // Step 3: fix colon-word joins “:the” -> “: the” (not paragraph breaks,
  // just missing punctuation space within a sentence).
  r = r.replace(/([a-z]):([a-z])/g, '$1: $2');

  return r;
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

    // Extract optional Date: YYYY-MM field (appears between Title and Article lines)
    let date: string | null = null;
    const dateLineMatch = entry.match(/\nDate:\s*(\d{4}-\d{2})/);
    if (dateLineMatch) {
      const [yr, mo] = dateLineMatch[1].split('-');
      const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const moIdx = parseInt(mo, 10) - 1;
      if (moIdx >= 0 && moIdx < 12) {
        date = `${MONTHS[moIdx]} ${yr}`;
      }
    }

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
      date,
      source: 'gablog' as ContentSource,
    });
  }

  return posts;
}

function parseBook(): Post[] {
  const bookPath = path.join(process.cwd(), 'src', 'data', 'anthropomorphics.md');
  if (!fs.existsSync(bookPath)) return [];

  const content = fs.readFileSync(bookPath, 'utf-8');
  const contentBody = content.replace(/^#[^\n]*\n+/, '').trim();
  const lines = contentBody.split('\n');

  const posts: Post[] = [];

  // Detect chapter boundaries: lines matching exactly _Chapter Title_
  const chapters: { title: string; line: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].trim().match(/^_([^_\n]{3,60})_$/);
    if (m) chapters.push({ title: m[1], line: i });
  }

  if (chapters.length > 0) {
    // One post per chapter — each is short enough for full phrase matching
    for (let i = 0; i < chapters.length; i++) {
      const { title, line } = chapters[i];
      const endLine = i + 1 < chapters.length ? chapters[i + 1].line : lines.length;
      const chapterContent = lines.slice(line + 1, endLine).join('\n').trim();
      if (!chapterContent) continue;

      posts.push({
        slug: 'book-anthropomorphics-' + slugify(title),
        title,
        content: chapterContent,
        excerpt: excerpt(chapterContent),
        date: null,
        source: 'book' as ContentSource,
        // Link back to the full book for the "View original" button
        url: 'https://adamkatz.substack.com/p/anthropomorphics-an-originary-grammar',
      });
    }
  }

  // Full book entry — kept for backward compat (concept page links, intro page, etc.)
  // Its search value is mostly as an overview; chapters handle specific queries.
  posts.push({
    slug: 'book-anthropomorphics',
    title: 'Anthropomorphics: An Originary Grammar of the Center',
    content: contentBody,
    excerpt: excerpt(contentBody),
    date: null,
    source: 'book' as ContentSource,
  });

  return posts;
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
    let explicitUrl: string | null = null;
    let contentStart = 1;

    for (let i = 1; i < lines.length && i < 10; i++) {
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
      // URL override: **URL:** https://... (used when Substack slug differs from title-derived slug)
      const urlMatch = line.match(/^\*\*URL:\*\*\s*(https?:\/\/\S+)/);
      if (urlMatch) {
        explicitUrl = urlMatch[1];
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
      url: explicitUrl ?? `https://dennisbouvard.substack.com/p/${substackSlug}`,
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
  'writing-pedagogy-katz': {
    title: 'From Novice to Apprentice: A Pedagogy of "Academic Discourse" (Adam Katz)',
  },
  'writing-pedagogy-katz2': {
    title: 'AI and Writing — Book Review (Adam Katz)',
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

/** Minimum word count for a tweet thread to be published */
const TWEET_MIN_WORDS = 150;

function parseTweets(): Post[] {
  const tweetsPath = path.join(process.cwd(), 'src', 'data', 'tweets.json');
  if (!fs.existsSync(tweetsPath)) return [];

  let data: { author_id: string; tweets: TweetRecord[] };
  try {
    data = JSON.parse(fs.readFileSync(tweetsPath, 'utf-8'));
  } catch { return []; }

  const { author_id, tweets } = data;
  if (!tweets?.length) return [];

  // Load AI-generated titles if available (produced by scripts/generate-tweet-titles.mjs)
  const titlesPath = path.join(process.cwd(), 'src', 'data', 'tweet_titles.json');
  const aiTitles: Record<string, string> = fs.existsSync(titlesPath)
    ? JSON.parse(fs.readFileSync(titlesPath, 'utf-8'))
    : {};

  // Group by conversation_id so threads become a single Post.
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
    const rootTweet = group.find((t) => t.id === conversationId) ?? group[0];

    // ── Quality filter ────────────────────────────────────────────────────────
    // 1. Skip threads whose root is a reply to a different user (not Bouvard's
    //    own thread — these are one-off replies with no self-contained narrative).
    if (rootTweet.in_reply_to_user_id && rootTweet.in_reply_to_user_id !== author_id) {
      continue;
    }

    // Build full content: all tweet texts in the thread joined with newlines.
    // Strip t.co tracking URLs that add no content.
    const rawContent = group
      .map(t => t.text.replace(/https:\/\/t\.co\/\S+/g, '').trim())
      .filter(t => t.length > 0)
      .join('\n\n');

    // 2. Skip short single tweets or threads under the word floor.
    const wordCount = rawContent.split(/\s+/).filter(Boolean).length;
    if (wordCount < TWEET_MIN_WORDS) continue;

    // 3. Skip threads that are almost entirely URLs (link-share posts).
    const urlFraction = (group.reduce((s, t) => s + (t.text.match(/https:\/\/t\.co\/\S+/g)?.length ?? 0), 0))
      / Math.max(group.length, 1);
    if (urlFraction > 0.6 && wordCount < 200) continue;

    const dateObj = new Date(rootTweet.created_at);
    const dateStr = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

    // Title: prefer AI-generated, fall back to first words of root tweet
    const title = aiTitles[conversationId] || tweetTitle(rawContent, dateStr);
    const totalLikes = group.reduce((s, t) => s + (t.public_metrics?.like_count ?? 0), 0);

    posts.push({
      slug:    `twitter-${conversationId}`,
      title,
      content: rawContent,
      excerpt: excerpt(rootTweet.text),
      date:    dateStr,
      source:  'twitter' as ContentSource,
      likes:   totalLikes || undefined,
      url:     `https://x.com/bouvard38829538/status/${conversationId}`,
    });
  }

  // Newest-first
  posts.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return posts;
}

// ── Reddit / r/GABlog + r/Absolutistneoreaction ───────────────────────────────
//
// PRIMARY PATH (preferred): src/data/reddit_threads.json
//   Generated by scripts/fetch-reddit-threads.mjs.
//   Contains full dialogue chains: question → Bouvard reply → follow-up → …
//   Each post is a formatted Q&A dialogue with both sides of the conversation.
//
// FALLBACK PATH: src/data/reddit_comments.json
//   Only Bouvard's own comments, no context. Used if reddit_threads.json
//   hasn't been generated yet.

interface RedditChain {
  bouvard_body:  string;
  bouvard_words: number;
  questioner?:   string;
  question?:     string;
  is_op_reply?:  boolean;
}

interface RedditThread {
  thread_id:             string;
  subreddit:             string;
  title:                 string;
  op_author?:            string;
  op_text?:              string;
  chains:                RedditChain[];
  total_words:           number;
  bouvard_comment_count: number;
  generated_title?:      string; // set by scripts/generate-reddit-titles.mjs
  fetched_at?:           string;
  fetch_error?:          string;
}

/** Minimum word count for a Bouvard response to be included in a post */
const REDDIT_MIN_CHAIN_WORDS = 80;
/** Minimum total Bouvard words in a thread to publish it */
const REDDIT_MIN_THREAD_WORDS = 150;

/**
 * Render Reddit markdown to plain text suitable for our reader.
 *
 * Reddit uses a subset of markdown (bold, italic, links, block-quotes,
 * code, horizontal rules). We convert the most common patterns so posts
 * read naturally in the PostContent renderer.
 */
function renderRedditMarkdown(text: string): string {
  return text
    // Headings (rare in comments, but present in r/GABlog posts)
    .replace(/^#{1,6}\s+(.+)$/gm, '**$1**')
    // Bold/italic — leave **…** and *…* as-is (PostContent handles them)
    // Strike-through: ~~text~~ → text (no equivalent in our renderer)
    .replace(/~~([^~]+)~~/g, '$1')
    // Inline code: `code` → code (strip backticks)
    .replace(/`([^`]+)`/g, '$1')
    // Code blocks: ```…``` → (strip fences, indent)
    .replace(/```[\w]*\n?([\s\S]*?)```/g, '$1')
    // Block quotes: "> text" — keep but strip the ">" (our renderer doesn't style them)
    .replace(/^&gt;\s?/gm, '> ')
    // Reddit's escaped HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Horizontal rules: various Reddit forms
    .replace(/^(?:---+|\*\*\*+|___+)\s*$/gm, '---')
    // Superscript ^text → text
    .replace(/\^(\w+)/g, '$1')
    // Trailing whitespace
    .replace(/[ \t]+$/gm, '')
    .trim();
}

/**
 * Format a thread's dialogue chains into readable post content.
 *
 * Each chain is rendered as:
 *   > [questioner's question, in a callout block]
 *
 *   [Bouvard's response]
 *
 * Chains with no question context (replies to OP or orphaned comments)
 * are rendered as solo Bouvard paragraphs.
 */
function formatRedditThread(thread: RedditThread): string {
  const blocks: string[] = [];

  // Optional: include OP context if the first chain doesn't have a question
  // (and the OP text is substantive)
  const firstSubstantive = thread.chains.find(c => c.bouvard_words >= REDDIT_MIN_CHAIN_WORDS);
  if (firstSubstantive?.is_op_reply && thread.op_text && thread.op_text.trim().length > 50) {
    // OP text already included as chain.question; skip separate OP block
  }

  for (const chain of thread.chains) {
    if (chain.bouvard_words < REDDIT_MIN_CHAIN_WORDS) continue;

    const bouvardText = renderRedditMarkdown(chain.bouvard_body);

    if (chain.question) {
      const questioner = chain.questioner && chain.questioner !== '[deleted]'
        ? chain.questioner
        : 'Reader';
      const questionText = renderRedditMarkdown(chain.question).slice(0, 800);
      // Indent the question as a block-quote style citation
      const quotedQuestion = questionText
        .split('\n')
        .map(line => `> ${line}`)
        .join('\n');
      blocks.push(`**${questioner}:** ${questionText}\n\n${bouvardText}`);
    } else {
      blocks.push(bouvardText);
    }
  }

  return blocks.join('\n\n---\n\n');
}

function parseRedditComments(): Post[] {
  // ── Primary path: enriched thread data with full dialogue context ──────────
  const threadsPath = path.join(process.cwd(), 'src', 'data', 'reddit_threads.json');
  if (fs.existsSync(threadsPath)) {
    const threads: RedditThread[] = JSON.parse(fs.readFileSync(threadsPath, 'utf-8'));
    const posts: Post[] = [];

    for (const thread of threads) {
      if (thread.fetch_error && thread.chains.length === 0) continue;
      if (thread.total_words < REDDIT_MIN_THREAD_WORDS) continue;

      // Filter chains to only substantive ones
      const goodChains = thread.chains.filter(c => c.bouvard_words >= REDDIT_MIN_CHAIN_WORDS);
      if (goodChains.length === 0) continue;

      const content = formatRedditThread(thread);
      if (!content.trim()) continue;

      // Title: prefer AI-generated title, otherwise use thread title
      const title = thread.generated_title || thread.title;

      // Derive a stable date from the first comment's timestamp if available
      // (reddit_threads.json stores fetched_at not the original date; we use
      //  what reddit_comments.json has for the earliest comment in this thread)
      const permalink = `https://www.reddit.com/r/${thread.subreddit}/comments/${thread.thread_id}/`;

      const wordCount = content.split(/\s+/).length;
      const firstGoodChain = goodChains[0];
      const excerptText = firstGoodChain.bouvard_body.slice(0, 200) +
        (firstGoodChain.bouvard_body.length > 200 ? '...' : '');

      posts.push({
        slug:    'reddit-' + slugify(thread.title),
        title,
        content,
        excerpt: excerptText,
        date:    null, // dates added below from original comments file
        source:  'reddit' as ContentSource,
        url:     permalink,
      });
    }

    // Backfill dates from the original comments file (reddit_threads.json
    // doesn't store comment timestamps directly).
    try {
      const rawPath = path.join(process.cwd(), 'src', 'data', 'reddit_comments.json');
      if (fs.existsSync(rawPath)) {
        interface RawComment { link_id: string; created_utc: number; }
        const raw: RawComment[] = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));
        const earliest = new Map<string, number>();
        for (const c of raw) {
          const prev = earliest.get(c.link_id);
          if (!prev || c.created_utc < prev) earliest.set(c.link_id, c.created_utc);
        }
        for (const post of posts) {
          const slug = post.slug.replace('reddit-', '');
          // Match by thread_id embedded in permalink
          const thread = threads.find(t => slugify(t.title) === slug);
          if (thread) {
            const ts = earliest.get('t3_' + thread.thread_id);
            if (ts) {
              const d = new Date(ts * 1000);
              post.date = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
            }
          }
        }
      }
    } catch { /* non-fatal */ }

    return posts;
  }

  // ── Fallback path: original flat comments file (no dialogue context) ───────
  const redditPath = path.join(process.cwd(), 'src', 'data', 'reddit_comments.json');
  if (!fs.existsSync(redditPath)) return [];

  interface RedditComment {
    body: string;
    created_utc: number;
    link_title?: string;
    subreddit?: string;
    permalink?: string;
  }

  const comments: RedditComment[] = JSON.parse(fs.readFileSync(redditPath, 'utf-8'));

  const threadMap = new Map<string, RedditComment[]>();
  for (const c of comments) {
    if (!c.body || c.body === '[deleted]' || c.body === '[removed]') continue;
    const key = c.link_title || 'Untitled Thread';
    if (!threadMap.has(key)) threadMap.set(key, []);
    threadMap.get(key)!.push(c);
  }

  const posts: Post[] = [];
  for (const [threadTitle, threadComments] of threadMap) {
    threadComments.sort((a, b) => a.created_utc - b.created_utc);
    const hasSubstantive = threadComments.some(c => {
      const t = c.body.trim();
      return !/^https?:\/\/\S+$/.test(t) && t.split(/\s+/).length >= 80;
    });
    if (!hasSubstantive) continue;

    const content = threadComments.map(c => c.body).join('\n\n---\n\n');
    const earliest = threadComments[0];
    const dateStr = new Date(earliest.created_utc * 1000).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: '2-digit',
    });

    posts.push({
      slug:    'reddit-' + slugify(threadTitle),
      title:   threadTitle,
      content,
      excerpt: threadComments[0].body.slice(0, 200),
      date:    dateStr,
      source:  'reddit' as ContentSource,
      url:     earliest.permalink ? `https://reddit.com${earliest.permalink}` : undefined,
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
    const t = line.trim();
    // "5/9/25, 2:43 PM  The Anthropoetics of Power..."  (date at start)
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4},\s+\d+:\d+\s+[AP]M/.test(t)) continue;
    // "The Anthropoetics of Power – … 5/9/25, 2:43 PM"  (date at end)
    if (/\d{1,2}\/\d{1,2}\/\d{2,4},\s+\d+:\d+\s+[AP]M$/.test(t)) continue;
    // "Page 12 of 23https://..."
    if (/^Page \d+ of \d+https?:\/\//.test(t)) continue;
    // "https://example.com/path/ Page 12 of 23"  (URL then page number)
    if (/^https?:\/\/\S+\s+Page \d+ of \d+/.test(t)) continue;
    // Bare URL lines
    if (/^https?:\/\/\S+$/.test(t)) continue;
    // Website nav artifacts: "Share | Subscribe to…"
    if (/^Share\s*\|/.test(t)) continue;
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

// ── Lectures ──────────────────────────────────────────────────────────────────
// src/data/lectures.md — 5 Adam Katz introductory lectures for Center Study.
// Format: sections separated by "# Title" headings (top-level markdown headers).

const LECTURE_ORDER = [
  'origin',
  'mimetic',
  'deferral-of-violence',
  'the-center',
  'the-sign',
];

function parseLectures(): Post[] {
  const lecturesPath = path.join(process.cwd(), 'src', 'data', 'lectures.md');
  if (!fs.existsSync(lecturesPath)) return [];
  const raw = fs.readFileSync(lecturesPath, 'utf-8');

  // Split on top-level headings: lines starting with "# " (single #)
  const sections = raw.split(/^# /m).filter(Boolean);

  const posts: Post[] = [];
  let lectureNum = 0;

  for (const section of sections) {
    const firstNewline = section.indexOf('\n');
    if (firstNewline === -1) continue;
    const title = section.slice(0, firstNewline).trim();
    const body = section.slice(firstNewline + 1).trim();
    if (!title || !body) continue;

    lectureNum += 1;
    const slug = 'lecture-' + slugify(title);

    posts.push({
      slug,
      title: `Lecture ${lectureNum}: ${title}`,
      content: body,
      excerpt: excerpt(body),
      date: null,
      source: 'lecture' as ContentSource,
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
  allPosts.push(...parseLectures());

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
