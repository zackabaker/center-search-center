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

// Fix spacing artifacts from HTML-to-text conversion on GABlog posts.
// When tags like <em>, <a>, <strong> are stripped, surrounding spaces disappear:
//   "Veblen's<em>The Theory</em>Obviously" → "Veblen'sThe TheoryObviously"
// Two patterns to catch:
//   1. Period/!/? directly before a capital → missing sentence space
//      "class.Obviously" → "class. Obviously"
//   2. Lowercase/quote directly before a capital → missing word space
//      "Veblen'sThe" → "Veblen's The"
//      "classObviously" → "class Obviously"
function fixGABlogSpacing(text: string): string {
  return text
    // Sentence boundary: lowercase char + punctuation + UPPERCASE (no space)
    // e.g. "class.Obviously" → "class. Obviously"
    .replace(/([a-z])([.!?])([A-Z])/g, '$1$2 $3')
    // Word boundary: lowercase/closing-quote/closing-paren + UPPERCASE (no space)
    // e.g. "Veblen'sThe" → "Veblen's The", "theoryObviously" → "theory Obviously"
    // Excludes runs that look like camelCase abbreviations by requiring prev char is
    // a common word-ending character.
    .replace(/([a-z'"\)])([A-Z][a-z])/g, '$1 $2');
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

// Clean browser-printed PDF artifacts:
//   "5/9/25, 2:43 PMThe Anthropoetics of Power – ..."  (date/time + title header)
//   "Page 12 of 23https://..."                          (page number + URL footer)
// Then rejoin sentences that were split across page boundaries.
function cleanPdfText(raw: string): string {
  const lines = raw.split('\n');
  const cleaned: string[] = [];

  for (const line of lines) {
    // Browser print header: date/time stamp followed by doc title
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4},\s+\d+:\d+\s+[AP]M/.test(line)) continue;
    // Page footer: "Page N of M" immediately followed by a URL (no space)
    if (/^Page \d+ of \d+https?:\/\//.test(line)) continue;
    // Standalone URL line
    if (/^https?:\/\/\S+$/.test(line.trim())) continue;
    cleaned.push(line);
  }

  // Rejoin sentences split across page breaks.
  // After header removal a page break leaves: "...fragment\n\ncontinuation..."
  // Signature: previous non-blank line ends without terminal punctuation,
  // next non-blank line starts with a lowercase letter.
  const result: string[] = [];
  for (let i = 0; i < cleaned.length; i++) {
    const line = cleaned[i];
    if (line.trim() === '' && result.length > 0) {
      const prev = result[result.length - 1];
      const next = (cleaned[i + 1] || '').trim();
      if (
        prev.trim() !== '' &&
        !/[.!?:;"')\]—]$/.test(prev.trim()) &&
        /^[a-z]/.test(next)
      ) {
        // Page-break continuation — drop the blank line; text will merge naturally
        continue;
      }
    }
    result.push(line);
  }

  // Collapse runs of 3+ blank lines down to 2 (one paragraph break)
  return result.join('\n').replace(/\n{3,}/g, '\n\n').trim();
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

export function getAllPosts(): Post[] {
  return parseAllContent();
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}
