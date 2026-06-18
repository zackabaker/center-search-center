import fs from 'fs';
import path from 'path';
import { Post, ContentSource, HIDDEN_SOURCES } from './types';

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

// ── Corpus cleaning ───────────────────────────────────────────────────────────
// Two artifact classes found in the source data:
//  1. Comment spam scraped into a few old GABlog posts — walls of pharma/porn
//     keywords. Detected by keyword DENSITY (3+ high-signal spam terms in one
//     paragraph), which never occurs in real prose; a lone scholarly mention
//     (e.g. "Viagra was distributed to fighters" in an AP essay) is safe.
//  2. Substack subscription boilerplate ("Thanks for reading … Subscribe",
//     bare "Subscribe", "Share") appended to ~half the Substack posts. The post
//     page hid these at render, but they polluted search, AI excerpts, the
//     corpus API, exports, and word counts — so strip them at the source.
const SPAM_TERMS = /\b(buy soma|cheap soma|tenuate|tramadol|buy xanax|cheap xanax|ultram|cialis|phentermine|animal porn|adult clips|glory hole|blowjobs?|facial cumshots?|casino online|payday loans?|replica watch)\b/gi;

// Some sources arrive as giant unbroken blocks — PDF "blob" extractions, and
// the lectures (one paragraph each in source). The text is correct but reads as
// a wall. Split any over-long plain-prose paragraph at sentence boundaries into
// ~900-char paragraphs. Headings (#), blockquotes (>), dividers, speaker labels,
// and already-reasonable paragraphs are left untouched, so well-formatted posts
// are unaffected. Breaks land between sentences, so they read naturally even
// though they may not match the author's original paragraphing.
// Katz/Bouvard routinely write 250–300-word paragraphs that read as a wall on
// screen. Split anything over ~1100 chars (~180 words) into ~620-char (~100-word)
// chunks at sentence boundaries — comfortable reading length without shredding
// shorter, already-readable paragraphs.
const PARAGRAPH_SPLIT_THRESHOLD = 1100;
const PARAGRAPH_TARGET = 620;

function paragraphizeLongBlocks(content: string): string {
  return content
    .split(/\n\n+/)
    .flatMap((para) => {
      const t = para.trim();
      if (t.length <= PARAGRAPH_SPLIT_THRESHOLD) return [t];
      if (/^(#{1,3}\s|>\s|>$|---$|\[Q:|\[ADAM\])/.test(t)) return [t]; // structural lines
      // Split into sentences; regroup to ~PARAGRAPH_TARGET chars.
      const sentences = t.split(/(?<=[.!?]["'”’)]?)\s+(?=[“"'(A-Z])/);
      const out: string[] = [];
      let buf = '';
      for (const s of sentences) {
        buf = buf ? `${buf} ${s}` : s;
        if (buf.length >= PARAGRAPH_TARGET) { out.push(buf); buf = ''; }
      }
      if (buf) {
        // Fold a short trailing remnant into the previous paragraph
        if (out.length && buf.length < 250) out[out.length - 1] += ' ' + buf;
        else out.push(buf);
      }
      return out.length ? out : [t];
    })
    .join('\n\n');
}

function cleanCorpusContent(content: string, source: ContentSource): string {
  const paras = content.split(/\n\n+/);
  const kept = paras.filter((para) => {
    const t = para.trim();
    if (!t) return false;

    // Spam paragraph: high density of spam signatures
    const spamHits = (t.match(SPAM_TERMS) || []).length;
    if (spamHits >= 3) return false;

    // Substack subscription boilerplate
    if (source === 'substack') {
      const flat = t.replace(/\s+/g, ' ').trim();
      // bare "Subscribe" / "Share" / "Subscribe now", possibly repeated
      if (/^(subscribe( now)?|share)(\s+(subscribe|share))*$/i.test(flat)) return false;
      if (/^thanks for reading\b.{0,80}\bsubscribe\b/i.test(flat)) return false;
      if (/\breader-supported publication\b.{0,80}\bsubscriber\b/i.test(flat)) return false;
      if (/^(share|leave a comment|give a gift( subscription)?)$/i.test(flat)) return false;
    }
    return true;
  });
  return kept.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
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
      // The book markdown carries page-break artifacts (3+ newlines splitting
      // sentences mid-paragraph) — same fix as the PDF pipeline.
      const chapterContent = mergeSpuriousParagraphBreaks(
        lines.slice(line + 1, endLine).join('\n').trim()
      );
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
  const mergedBody = mergeSpuriousParagraphBreaks(contentBody);
  posts.push({
    slug: 'book-anthropomorphics',
    title: 'Anthropomorphics: An Originary Grammar of the Center',
    content: mergedBody,
    excerpt: excerpt(mergedBody),
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
const PDF_METADATA: Record<string, { title: string; source?: ContentSource; url?: string; date?: string; author?: string; preCleaned?: boolean }> = {
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
    title: 'There Is No Economy but Only the Debt to the Center: Money, Capital and the Tributary',
    author: 'Adam Katz & Zack Baker',
    date: 'Spring 2023',
    url: 'https://anthropoetics.ucla.edu/ap2802/ap2802katzbaker/',
    // Source .txt is the clean canonical text from the Anthropoetics journal
    // (the PDF extraction was multi-column garble); skip PDF cleanup.
    preCleaned: true,
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
  // NER & JCRT articles (extracted from GABlog cross-posts)
  'constitutionalism-political-thinking-center': {
    title: 'Constitutionalism: A Political Thinking of the Center (Adam Katz)',
    url: 'https://www.newenglishreview.org/articles/constitutionalism-a-political-thinking-of-the-center/',
    date: 'Jan 2007',
  },
  'calculus-of-covenants-fifth-generation-warfare': {
    title: 'A Calculus of Covenants; or, Fifth Generation Warfare (Adam Katz)',
    url: 'https://www.newenglishreview.org/articles/a-calculus-of-covenants-or-fifth-generation-warfare/',
    date: 'May 2007',
  },
  'habit-and-errors-and-composition': {
    title: 'Habit and Errors and Composition (Adam Katz)',
    url: 'https://jcrt.org/archives/10.4/katz.pdf',
    date: 'Apr 2009',
  },
  'indicative-culture-katz': {
    title: 'Indicative Culture (Adam Katz)',
    url: 'http://jcrt.typepad.com/jcrt_live/2009/06/indicative-culture.html',
    date: 'Jun 2009',
  },
  'idioms-of-inquiry-katz': {
    title: 'Another Version of "Idioms of Inquiry" Despite the Changed Title (Adam Katz)',
    url: 'http://jcrt.typepad.com/jcrt_live/2009/08/',
    date: 'Aug 2009',
  },
  'jousse-review-double-helix': {
    title: 'Book Review: Memory, Memorization and Memorizers — Marcel Jousse (Adam Katz)',
    url: 'https://wacclearinghouse.org/docs/double-helix/v7/katz.pdf',
    date: 'Jan 2019',
  },
  'double-helix-v1-farmer-review': {
    title: 'Book Review: After the Public Turn — Frank Farmer (Adam Katz)',
    url: 'https://wacclearinghouse.org/docs/double-helix/v1/katz.pdf',
    date: 'Jan 2013',
  },
  'double-helix-v2-tomasello-review': {
    title: 'Book Review: A Natural History of Human Thinking — Michael Tomasello (Adam Katz)',
    url: 'https://wacclearinghouse.org/docs/double-helix/v2/katz.pdf',
    date: 'Jan 2014',
  },
  'double-helix-v3-bury-review': {
    title: 'Book Review: Exercises in Criticism — Louis Bury (Adam Katz)',
    url: 'https://wacclearinghouse.org/docs/double-helix/v3/katz.pdf',
    date: 'Jan 2015',
  },
  'double-helix-v4-becker-ho-review': {
    title: 'Book Review: The Essence of Jargon — Alice Becker-Ho (Adam Katz)',
    url: 'https://wacclearinghouse.org/docs/double-helix/v4/katz.pdf',
    date: 'Jan 2016',
  },
  'double-helix-v6-praxis-of-entry': {
    title: 'A Praxis of Entry: First-Year Writing as the Critical Thinking Course (Adam Katz)',
    url: 'https://wacclearinghouse.org/docs/double-helix/v6/katz.pdf',
    date: 'Jan 2018',
  },
  'double-helix-v8-natures-of-data-review': {
    title: 'Book Review: Natures of Data — Fischer et al. (Adam Katz)',
    url: 'https://wacclearinghouse.org/docs/double-helix/v8/katz.pdf',
    date: 'Jan 2020',
  },
  'double-helix-v9-teaching-machines-review': {
    title: 'Book Review: Teaching Machines — Audrey Watters (Adam Katz)',
    url: 'https://wacclearinghouse.org/docs/double-helix/v9/katz.pdf',
    date: 'Jan 2021',
  },
  'double-helix-v10-amerika-review': {
    title: 'Book Review: My Life as an Artificial Creative Intelligence — Mark Amerika (Adam Katz)',
    url: 'https://wacclearinghouse.org/docs/double-helix/v10/katz.pdf',
    date: 'Jan 2022',
  },
  // Standalone threads / Q&A pieces (sourced as 'reddit' so they appear in Threads & Q&A)
  'ga-vs-center-study-thread': {
    title: 'GA vs. Center Study (Adam Katz)',
    source: 'reddit' as ContentSource,
  },
  'prosecuting-the-nomos-qa': {
    title: 'Prosecuting the Nomos: Q&A (Adam Katz)',
    source: 'reddit' as ContentSource,
  },
  'anglo-modernity-limits-thread': {
    title: 'Anglo Modernity Reaching Its Limits (Adam Katz)',
    source: 'reddit' as ContentSource,
  },
  // Anthropoetics journal articles
  'anthropoetics-redemption-of-hostages': {
    title: 'The Redemption of Hostages (Adam Katz)',
    url: 'https://anthropoetics.ucla.edu/ap1801/1801katz/',
    date: 'Sep 2012',
  },
  'anthropoetics-originary-mistakenness': {
    title: 'Originary Mistakenness, Defilement and Modernity (Adam Katz)',
    url: 'https://anthropoetics.ucla.edu/ap1601/1601katz/',
    date: 'Sep 2010',
  },
  'anthropoetics-marginalist-politics': {
    title: 'Marginalist Politics, Political Grammar (Adam Katz)',
    url: 'https://anthropoetics.ucla.edu/ap1401/1401katz/',
    date: 'Jun 2008',
  },
  'anthropoetics-from-habit-to-maxim': {
    title: 'From Habit to Maxim: Gertrude Stein and Originary Language (Adam Katz)',
    url: 'https://anthropoetics.ucla.edu/ap1502/1502katz/',
    date: 'Mar 2010',
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

  // Does this thread have any genuine Q&A exchanges? If so, use threaded format.
  const hasQuestions = thread.chains.some(
    c => c.question && c.bouvard_words >= REDDIT_MIN_CHAIN_WORDS
  );

  for (const chain of thread.chains) {
    if (chain.bouvard_words < REDDIT_MIN_CHAIN_WORDS) continue;

    const bouvardText = renderRedditMarkdown(chain.bouvard_body);

    if (chain.question) {
      const questioner = chain.questioner && chain.questioner !== '[deleted]'
        ? chain.questioner
        : 'Reader';
      const questionText = renderRedditMarkdown(chain.question).slice(0, 1000);
      // Flatten multi-paragraph questions to a single line for the question card
      const questionFlat = questionText.replace(/\n{2,}/g, ' ').replace(/\n/g, ' ').trim();
      // Use special markers that PostContent recognises and renders as conversation cards
      blocks.push(`[Q:${questioner}] ${questionFlat}\n\n[ADAM]\n\n${bouvardText}`);
    } else if (hasQuestions) {
      // Solo Bouvard comment in a thread that also has Q&A — label it consistently
      blocks.push(`[ADAM]\n\n${bouvardText}`);
    } else {
      // Thread is all Bouvard's own commentary — no speaker labels needed
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
// Normalise text for title comparison: lowercase, alphanumerics only
function normForTitleMatch(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Merge paragraph breaks that are page-break artifacts, not real breaks.
// Page breaks in PDF extraction (and in the book markdown) leave blank lines
// mid-sentence — often as 3+ newlines or blank lines containing spaces, so
// blank-line normalisation MUST happen before the merge pattern runs.
// Heuristic: a real paragraph never ends with a connective character
// (dash, comma, semicolon, colon, open paren) and rarely starts lowercase;
// both together = split sentence. Dashes/hyphens rejoin without a space
// ("risk-" + "driven" → "risk-driven", "so—" + "the" → "so—the").
// Academic block quotations are set off from a lowercase lead-in ("Sapir
// noted that in certain tribes," + quote) and end with a page citation
// ("(191)", "(p. 66)"). Mark them as blockquotes so the paragraph-merge
// step doesn't inline them back into the lead-in. Idempotent.
function markBlockQuotes(text: string): string {
  return text
    .split('\n\n')
    .map((para) => {
      const t = para.trim();
      return /^[a-z]/.test(t) && /\((?:pp?\.?\s?)?\d{1,4}\)$/.test(t)
        ? '> ' + para
        : para;
    })
    .join('\n\n');
}

function mergeSpuriousParagraphBreaks(text: string): string {
  // Collapse ANY run of 2+ newlines (with blank padding) to exactly \n\n in
  // one pass — sequential replaces miss overlapping runs like "\n \n \n".
  text = text.replace(/\n(?:[ \t]*\n)+/g, '\n\n');
  // Protect real block quotations before merging
  text = markBlockQuotes(text);
  return text.replace(
    /([a-zA-Z0-9"'’”—–,;:()/-])\n\n([a-z])/g,
    (_, before, after) =>
      before === '—' || before === '–' || before === '-'
        ? before + after
        : before + ' ' + after
  );
}

function cleanPdfText(raw: string, expectedTitle?: string): string {
  // ── Step 1: strip browser-print headers and footers ───────────────────────
  const lines = raw.split('\n');

  // Running headers/footers repeat identically on every page ("Double Helix,
  // Vol 12 (2024)" between every pair of pages). Count identical trimmed
  // lines; a line of 6-120 chars appearing 3+ times, sitting alone between
  // blank lines, and not ending like a sentence is page furniture. The
  // blank-flank requirement protects wrapped prose lines that happen to
  // repeat; the punctuation guard protects deliberate one-line refrains.
  const lineCounts = new Map<string, number>();
  for (const line of lines) {
    const t = line.trim();
    if (t.length >= 6 && t.length <= 120) {
      lineCounts.set(t, (lineCounts.get(t) ?? 0) + 1);
    }
  }
  const isPageFurniture = (t: string, i: number): boolean => {
    if (t.length < 6 || t.length > 120) return false;
    if ((lineCounts.get(t) ?? 0) < 3) return false;
    if (/[.!?…]["'”’)\]]*$/.test(t)) return false;
    const prevBlank = i === 0 || !lines[i - 1].trim();
    const nextBlank = i === lines.length - 1 || !lines[i + 1].trim();
    return prevBlank && nextBlank;
  };

  const filtered: string[] = [];
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
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
    // Bare page numbers on their own line
    if (/^\d{1,3}$/.test(t)) continue;
    // Anthropoetics end-matter: "ap@humnet.ucla.edu Last updated: ..."
    if (/Last updated:/i.test(t) && t.length < 80) continue;
    // Bare email lines
    if (/^\S+@\S+\.\S+$/.test(t)) continue;
    // Journal footers: "Double Helix, Vol 12 (2024)" — short docs repeat
    // them too few times for the page-furniture counter to catch
    if (/^.{0,60}Vol\.?\s?\d+\s?\(\d{4}\)$/.test(t)) continue;
    // Running header/footer (repeated, blank-flanked, non-sentence line)
    if (isPageFurniture(t, li)) continue;
    // Trailing whitespace breaks end-of-line hyphen detection during rejoin
    filtered.push(line.replace(/\s+$/, ''));
  }

  // ── Step 1.5: strip the leading title line(s) ─────────────────────────────
  // Most PDF extractions start with the document title (sometimes soft-wrapped
  // across 2-3 lines). The post page renders the title as an H1, so keeping it
  // in the content duplicates it. Consume leading lines while their accumulated
  // normalised text remains a prefix of the known title.
  if (expectedTitle) {
    const normTitle = normForTitleMatch(expectedTitle);
    // Skip leading blank lines
    let start = 0;
    while (start < filtered.length && !filtered[start].trim()) start++;

    let acc = '';
    let consumed = 0;
    for (let i = start; i < Math.min(start + 4, filtered.length); i++) {
      const candidate = acc + normForTitleMatch(filtered[i]);
      if (candidate.length > 0 && (normTitle.startsWith(candidate) || candidate.startsWith(normTitle))) {
        acc = candidate;
        consumed = i - start + 1;
        if (candidate.startsWith(normTitle)) break; // full title consumed
      } else {
        break;
      }
    }
    // Only strip if the match is substantial (avoids nuking short real prose)
    if (consumed > 0 && acc.length >= 8) {
      filtered.splice(start, consumed);
    } else if (
      // Book reviews: metadata title is often shortened ("Book Review: X —
      // Reviewer") while the document line carries the full subtitle, so
      // prefix matching fails. If both start with "Book Review", the first
      // line is certainly the title — strip it. Prose never starts that way.
      normTitle.startsWith('bookreview') &&
      start < filtered.length &&
      normForTitleMatch(filtered[start]).startsWith('bookreview')
    ) {
      filtered.splice(start, 1);
    }

    // Byline lines directly under the title ("by Adam Katz (May 2007)",
    // "by Chris B May 2, 2017" / "by Bouvard" across wrapped lines) — the
    // page header already shows the author, so drop them all.
    for (;;) {
      let bstart = 0;
      while (bstart < filtered.length && !filtered[bstart].trim()) bstart++;
      if (bstart < filtered.length && /^by [A-Z][^\n]{1,60}$/.test(filtered[bstart].trim())) {
        filtered.splice(bstart, 1);
      } else {
        break;
      }
    }
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

    // After rejoining, remaining blank lines should be paragraph breaks —
    // except page-break splits, handled by the shared merge helper (which
    // also normalises 3+ newlines and blank-lines-with-spaces first).
    text = mergeSpuriousParagraphBreaks(text);
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

  // Mark block quotations in BLOB documents too (the wrapped branch already
  // did this inside mergeSpuriousParagraphBreaks; the call is idempotent).
  text = markBlockQuotes(text);

  // ── Step 7: mark an opening epigraph as a blockquote ─────────────────────
  // Many essays open with a short quotation attributed via an em dash
  // ("…quote text — Author Name"). Render it as a blockquote (epigraph)
  // rather than a plain first paragraph. First paragraph only; must be
  // short and end with the attribution pattern.
  const paraBreak = text.indexOf('\n\n');
  const firstPara = paraBreak === -1 ? text : text.slice(0, paraBreak);
  if (
    firstPara.length > 0 &&
    firstPara.length < 500 &&
    !firstPara.startsWith('>') &&
    /[—–]\s*[A-Z][A-Za-z.'’À-ſ ]{1,60}$/.test(firstPara)
  ) {
    text = '> ' + firstPara + (paraBreak === -1 ? '' : text.slice(paraBreak));
  }

  // ── Step 8: late title repeats and orphaned subtitle fragments ──────────
  if (expectedTitle) {
    const normTitle = normForTitleMatch(expectedTitle);
    if (normTitle.length >= 12) {
      // A short early paragraph that begins with the title text and doesn't
      // end like a sentence is a cover line / running header that escaped
      // the line-level filters (e.g. it only occurs twice in the document).
      const paras = text.split('\n\n');
      const kept = paras.filter((para, i) => {
        const t = para.trim();
        return !(
          i < 6 &&
          t.length < 150 &&
          !/[.!?…]["'”’)\]]*$/.test(t) &&
          normForTitleMatch(t).startsWith(normTitle.slice(0, 25))
        );
      });
      text = kept.join('\n\n');
    }

    // Title-stripping can orphan a subtitle tail (doc title "…: A Review of
    // Daniel Ross's …" minus the metadata title leaves "of Daniel Ross's …").
    // Render the leftover as italic front matter under the H1.
    const pb2 = text.indexOf('\n\n');
    const first2 = pb2 === -1 ? text : text.slice(0, pb2);
    if (/^[a-z]/.test(first2) && first2.length < 250) {
      text = '_…' + first2 + '_' + (pb2 === -1 ? '' : text.slice(pb2));
    }
  }

  return text;
}

function parsePDFs(): Post[] {
  const pdfDir = path.join(process.cwd(), 'public', 'pdfs');
  if (!fs.existsSync(pdfDir)) return [];

  const posts: Post[] = [];
  const txtFiles = fs.readdirSync(pdfDir).filter((f) => f.endsWith('.txt'));

  for (const txtFile of txtFiles) {
    const raw = fs.readFileSync(path.join(pdfDir, txtFile), 'utf-8');
    const baseName = txtFile.replace('.txt', '');
    const meta = PDF_METADATA[baseName];
    const title = meta?.title || baseName.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    // Pre-cleaned sources (clean canonical text, e.g. from the journal HTML)
    // bypass the PDF-extraction repair pipeline, which would re-mangle them.
    const content = meta?.preCleaned
      ? raw.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
      : cleanPdfText(raw, title);
    const source = meta?.source || ('pdf' as ContentSource);
    const prefix = source === 'book' ? 'book' : 'pdf';

    // For articles that have no real PDF, use the external URL from metadata (or omit)
    const pdfExists = fs.existsSync(path.join(pdfDir, baseName + '.pdf'));
    const postUrl = meta?.url ?? (pdfExists ? `/pdfs/${baseName}.pdf` : undefined);

    posts.push({
      slug: `${prefix}-${slugify(baseName)}`,
      title,
      content,
      excerpt: excerpt(content),
      date: meta?.date ?? null,
      source,
      ...(postUrl ? { url: postUrl } : {}),
      ...(meta?.author ? { author: meta.author } : {}),
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
      source: 'pdf' as ContentSource,
    });
  }

  return posts;
}

// ── Anthropoetics Journal ────────────────────────────────────────────────────
// Stored in src/data/ap_articles.json — populated by scripts/scrape-ap-articles.mjs
// Articles by Van Oort, Bartlett, Dennis, Ludwigs, and all other GA scholars.
// source:'ap' is public and included in all browse/search features.
function parseAPArticles(): Post[] {
  const apPath = path.join(process.cwd(), 'src', 'data', 'ap_articles.json');
  if (!fs.existsSync(apPath)) return [];
  try {
    const raw: Array<{
      slug: string;
      issueCode: string;
      volume: number;
      issue: number;
      author: string;
      title: string;
      date: string | null;
      content: string;
      url: string;
    }> = JSON.parse(fs.readFileSync(apPath, 'utf-8'));

    return raw.map((entry) => ({
      slug: entry.slug,
      title: entry.title,
      content: entry.content,
      excerpt: excerpt(entry.content),
      date: entry.date,
      source: 'ap' as ContentSource,
      author: entry.author,
      url: entry.url,
    }));
  } catch {
    return [];
  }
}

// ── Eric Gans: Chronicles of Love and Resentment ─────────────────────────────
// Stored in src/data/chronicles.json — populated by scripts/scrape-chronicles.mjs
// These posts use source:'chronicle' and are excluded from all public search/browse
// listings. They appear only on the /downloads page.
function parseChronicles(): Post[] {
  const chroniclePath = path.join(process.cwd(), 'src', 'data', 'chronicles.json');
  if (!fs.existsSync(chroniclePath)) return [];
  try {
    const raw: Array<{
      num: number;
      vwSlug?: string;
      title: string;
      date: string | null;
      content: string;
      url: string;
    }> = JSON.parse(fs.readFileSync(chroniclePath, 'utf-8'));

    return raw.map((entry) => ({
      slug: `chronicle-clr-${entry.num}`,
      title: entry.title || `Chronicle of Love and Resentment #${entry.num}`,
      content: entry.content,
      excerpt: excerpt(entry.content),
      date: entry.date,
      source: 'chronicle' as ContentSource,
      url: entry.url,
    }));
  } catch {
    return [];
  }
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
  allPosts.push(...parseChronicles());
  allPosts.push(...parseAPArticles());

  // Decode HTML entities, then strip spam + subscription boilerplate, then
  // regenerate the excerpt from the cleaned content (so search/AI/exports/word
  // counts all see clean text).
  for (const post of allPosts) {
    post.title = decodeHtmlEntities(post.title);
    post.content = paragraphizeLongBlocks(cleanCorpusContent(decodeHtmlEntities(post.content), post.source));
    post.excerpt = excerpt(post.content);
  }

  // Drop exact-duplicate posts: same source + URL + (near-)identical body.
  // The source dumps occasionally contain a post twice (e.g. a Substack entry
  // captured on two fetches, differing only in stray markdown). We key on
  // alphanumeric-only content so trivial formatting diffs still collapse, while
  // the book chapters — which legitimately share the single book URL but have
  // wholly different bodies — are kept. Posts without a URL are never touched.
  const seenContent = new Set<string>();
  const deduped: Post[] = [];
  for (const post of allPosts) {
    if (post.url) {
      const key = `${post.source}|${post.url}|${post.content.replace(/[^a-z0-9]+/gi, '').toLowerCase()}`;
      if (seenContent.has(key)) continue;
      seenContent.add(key);
    }
    deduped.push(post);
  }
  allPosts.length = 0;
  allPosts.push(...deduped);

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

/**
 * Returns all posts EXCEPT those from hidden sources (chronicle, etc.).
 * Use this for search, browse, related posts, and any public-facing feature.
 * Use getAllPosts() only when you intentionally need hidden content (e.g. /downloads).
 */
export function getPublicPosts(): Post[] {
  return getAllPosts().filter((p) => !HIDDEN_SOURCES.includes(p.source));
}
