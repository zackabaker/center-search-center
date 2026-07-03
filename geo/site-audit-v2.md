# center.study — Excellence Audit v2 (July 2026)

Second full-site audit, run after the June roadmap (`site-audit.md`) was ~fully executed
(ISR, schema, RSS, /trending, CTAs, 13 new concept hubs, A–Z index + concept map deleted).
Eight parallel auditors covered: architecture/IA, entry funnel, concepts & glossary, reading
experience, discovery, technical/SEO, a fresh-eyes first-visitor walkthrough, and roadmap
reconciliation + an "excellence bar" comparison against SEP / gwern.net / Standard Ebooks.
~100 raw findings, deduplicated below into ~45 items across 7 tracks.

**The headline:** the site's bones are excellent — quote-first editorial discipline, no dead
ends in the reading loop, world-class machine-facing plumbing (llms.txt, /text views, corpus
API, JSON-LD entity graph), instant keyword search. The gap between good and excellent is
now mostly **wiring, not building**: features that exist but aren't linked, data that's
collected but never shown, maps that drifted out of sync with the content they map.

---

## Track 1 — Outright bugs (fix first; all verified live)

1. **Anthropomorphics chapters navigate alphabetically.** All 24 book chapters have
   `date: null`, so prev/next falls back to `title.localeCompare` — "Next" from a chapter
   goes to the alphabetically-next title, not the next chapter. The posts-cache order IS the
   book order; preserve corpus order when `source === 'book'`. `src/app/post/[slug]/page.tsx:184-191`.
2. **`sovereignty` term-links point at the wrong concept.** `src/lib/cs-terms.ts:166` still maps
   `sovereignty → nomos` even though `/guide/concepts/sovereignty` exists.
3. **Three glossary definitions are truncated mid-word on the live site** (Firstness
   "…spatio-tempor.", Metaphysics "…de-sacra.", Sign "…split into two parts: the.") plus the
   "succeded" typo in Originary Event. `src/data/guide/glossary.ts`. Add a lint: gloss must end in punctuation.
4. **Soft-404s + hidden article bodies — one fix.** Garbage `/post/*` slugs return cached
   HTTP 200; and every post ships its body inside `<div hidden id="S:0">` with a duplicate
   `<main>` from the loading skeleton — hostile to the non-JS AI crawlers the site courts.
   Both are caused by `src/app/post/[slug]/loading.tsx` flushing a 200 shell before
   `notFound()` runs. Delete it (pages are edge-cached; the skeleton adds nothing on HITs).
5. **Title double-suffix.** `/start`, `/intro`, `/lineage`, `/guide` hardcode "| Center Study
   Center" on top of layout's `title.template` → "… | Center Study Center | Center Study Center".
6. **Reading-mode cycle bug:** cycling Sepia→Night→Default strands dark-mode users in light
   theme, and the reader background ignores the sepia/night palettes.
7. **Chronicle date handling:** "Thursday, July 6..." strings break prev/next ordering and
   render raw (and wrongly ordered) in the concept pages' "Across the Corpus" timeline.
8. **`the-event` / `the-market` → 404.** The rename shipped without redirects; the old slugs
   were briefly in the sitemap. Add two 308s (next.config redirects).
9. **Reading-path "conclusion" paragraphs are authored in `reading-paths.ts` but never rendered.**

## Track 2 — Naming & funnel coherence (all small; labels/metadata only — the protected /start and /intro prose is untouched)

10. **One "Start."** Today: header Start→`/start`, footer Start→`/intro`, mobile Start→`/guide`,
    guide's "Start here" card→reading-paths, homepage "Start here"→`/start`. Make `/start` the
    single target of every "Start" label; relabel footer link "Introduction", mobile tab "Guide",
    guide card "Build a reading path".
11. **Differentiate the twin titles:** `/start` → "Start Here — Center Study in 10 Minutes"
    (title/eyebrow only); `/intro` keeps "Introduction to Center Study". Distinct meta descriptions.
12. **Kill the stale "700+ texts" everywhere** — layout meta description ×2, OG image, /intro
    body line. Interpolate the real count from posts-cache so it never rots again.
13. **Nav label honesty:** header/mobile "Glossary" lands on Core Concepts tab — either label it
    "Concepts" or point it at `?view=glossary` like the footer does. Unify "Browse" vs "Archive".
14. **Homepage 5-second test:** add one server-rendered plain-language line above the fold —
    the FAQ already has the perfect sentence ("A way of reading every social order as an attempt
    to hold, occupy, or deny a center — the most developed branch of Eric Gans's Generative
    Anthropology"). The hero currently leads with an insider paradox-quote.
15. **Katz/Bouvard one-liner** on the homepage Browse-by-source block ("Written by Adam Katz —
    publishing contemporary work as Dennis Bouvard"), so the pen name reads deliberate, not evasive.
16. **Header nav: swap "Reading Paths" slot for "Ask AI"** (reading paths is already /guide's hero card).
17. **De-orphan `/generative-anthropology`** (sitemap priority 0.95, exactly one inbound link):
    footer link + /guide card + links from /intro and /lineage.
18. **De-orphan `/trending`:** footer link + a compact "Most read" strip on the homepage.
19. **Mobile has no path to FAQ/Follow/Trending/RSS** — footer is `display:none` below `sm`.
    Add a "More" sheet to the mobile tab bar or a slim mobile footer.
20. `/guide` should list FAQ, Lectures, Lineage, and Generative Anthropology (it claims to be the hub).
21. **/lineage:** add the missing Gans → Katz step — the site exists to justify that succession.
22. **FAQ:** add the one objection first-timers actually arrive with ("is this reactionary
    politics?") — answered in the archive's own terms.

## Track 3 — Concepts & glossary power-ups (the owner's "most powerful part of the site")

23. **Merge the two divergent `TERM_TO_CONCEPT_SLUG` maps** (`src/lib/cs-terms.ts:136`, 58 keys;
    `src/data/guide/concepts.ts:2318`, 63 keys; 71 keys exist in only one). Single source of truth.
24. **Wire the 17 unreachable hubs into in-post term links** — katechon, idiomclining,
    scapegoating, sovereignty, power, money, media, technology, event, charisma, narrative,
    capital, firstness, market, disciplinarity, justice, liberalism currently get zero inbound
    links from the reading surface.
25. **Add the 19 missing `concept:` links in glossary.ts** so glossary entries link up to their
    concept hubs (only 9 of 28 do today).
26. **Symmetrize Related Concepts** — 165 of 219 relation edges are one-way.
27. **/concepts index cards should show the curated defining quote**, not a random passage.
28. **Search should surface concept hubs** — querying "deferral" returns posts but never the
    deferral concept page. Boost concepts to the top as a distinct result type.
29. **Beef up the four thin overviews** (katechon, sovereignty, idiomclining, scapegoating —
    4-5× thinner than the rest; katechon has 2 passages and repeats its defining quote).
30. **Vary the 75 repeated "Develops the concept." key-text notes** on the 13 new hubs
    (one-line specific notes; the mining pipeline can generate them from the passages).
31. **Per-concept OG images** (currently generic sitewide fallback) — the defining quote makes
    a perfect card.
32. **Concept pages: add "every mention" chronological feed link** (search deep-link is enough
    to start) and a link to the relevant reading path.
33. **BIG — glossary goes quote-first.** The 135-term glossary still leads with paraphrase
    adapted from an external blog (where all the truncations/typos live) while verbatim
    passages sit below. Flip it with the proven concept-mining pipeline: verbatim defining
    sentence first, paraphrase demoted. This finishes the site's editorial thesis.
34. **BIG — hover definition cards on every term link.** Dotted-underline links currently
    navigate away mid-reading. A popover with the verbatim defining quote + "View concept →"
    turns all ~1,969 texts into a self-glossing hypertext. All data is already client-ready.

## Track 4 — Reading experience (the serious-reading bar)

35. **Fix the measure: ~82-86ch → ~65ch.** `.prose { max-width: 65ch }` exists in globals.css
    but PostContent never uses it. The site's own /text route gets it right (≈62ch). Single
    biggest typographic gap vs Standard Ebooks/gwern.
36. **"More from chronicle" → "More from the Chronicles of Love & Resentment"** — raw source
    keys render on 1,070+ pages in the prev/next header.
37. **Pick one paragraph convention** — currently BOTH first-line indents and 1.75rem gaps
    (and an indented first paragraph).
38. **In-page ToC for long texts** — the 52,630-word full-book page is a bare scroll; heading
    data already exists (real h2/h3 shipped in June).
39. **Footnote support** — Anthropoetics endnote markers are dead text; bibliographies collapse
    into a paragraph blob.
40. **Mobile: auto-hide the bottom tab bar on scroll-down** (reappear on scroll-up) — it
    permanently eats reading height today.
41. **BIG — reading-position memory.** For 30–200-minute texts: throttled scroll-position save
    keyed to paragraph anchors (`p-N`, robust to font changes), "Resume at ¶43 — about 18 min
    left" pill on revisit, and make "read" mean read (MarkPostRead currently fires on mount).
    The single most differentiating serious-reading feature available.

## Track 5 — Discovery wiring

42. **Read the search log** (it's still write-only): GET endpoint over `search:terms` +
    "What readers search" chips on the /search empty state. Unblocks /answers, ranks head-term
    pages, feeds TERM_SYNONYMS. Cheapest unlock on the board.
43. **Semantic search: make it linkable** (`?mode=meaning&q=` deep links), give it zero-result
    recovery + an Ask handoff, and explain what "Meaning" mode does.
44. **Search page first-paint:** SSR the input + suggestions (currently a bare "Loading the
    search index…" for up to 30s on slow connections); split the 5.1MB index — small
    title/keyword index first, full index lazily.
45. **Date filter / sort for search** — 25 years of writing is undifferentiated.
46. **Browse topic chips should route to concept hubs**, not keyword search.
47. **Reading-paths index must list the curated paths** — 8+ hand-built paths with bridge prose
    are invisible behind the AI finder (also fixes the weakest page in the funnel).
48. **Trending: add a rolling window** (30-day ZSET alongside all-time) before the list ossifies.
49. **BIG — server-side query embedding, used twice.** Embed the query server-side (bge-small
    already in /models), fuse with lexical via RRF: (a) Ask retrieval finally becomes hybrid
    (the June item that was deliberately deferred); (b) /search Meaning mode works without the
    30MB client model download. One investment, both flagship features.

## Track 6 — Technical hygiene

50. Sitemap: remove duplicate `/guide`, drop redirecting `/guide/concepts`, raise `/concepts`,
    add `/follow`, `/browse/threads`, `/browse/all`; real `lastModified` on static routes.
51. Meta descriptions: never hard-clip mid-word (slice at word boundary + ellipsis) — concepts
    and glossary both do this today.
52. Security headers: add a CSP (report-only first), `includeSubDomains; preload` on HSTS,
    drop `X-XSS-Protection`; make www→apex a 308.
53. Prerender the head of the corpus (top ~100 posts by views) so first views aren't cold renders.
54. Homepage `<main>` landmark.
55. CI health gate: Lighthouse budgets + JSON-LD validation + sitemap/canonical/status contract
    tests on every deploy (protects everything above from regressing).

## Track 7 — Ambitious bets (pick 1–2; ordered by fit)

56. **Citable answer pages — `/ask/[slug]`.** Pre-render the ~20 canonical starter questions
    (every FAQ heading, the /start starters, one per major concept) as static, QAPage-schema,
    verbatim-cited answer pages. This is the held `/answers` item, sharpened: it converts the
    site's best asset (Ask) from ephemeral JS into exactly the pages LLMs cite. Gate the list
    on the search-log read (#42).
57. **Corpus trends explorer — "Ngrams for GA."** Per-year relative frequency of any of the
    175 vocabulary terms, split Gans vs Katz/Bouvard, 1995→present. No single-corpus site has
    this; this corpus (two authors in dialogue, 5M words, 30 years) is uniquely suited.
58. **Scholarly colophon per text** (SEP standard): original venue + Wayback link for dead
    GABlog originals, precise dates (fix the 47 undated texts — book chapters should carry
    2020), word count, stable citation line using the existing paragraph anchors.
59. **Versioned corpus releases with a DOI** (Zenodo) — make center.study citable as a dataset.
60. **Execute the drafted off-site program** (Wikidata item, Wikipedia Talk posts, outreach) —
    every artifact in geo/ is paste-ready; the measurement baseline CSV is still empty.
    On-site excellence can't substitute for this half. (Needs account access / owner action.)

---

### Suggested execution order

1. **Batch A — bugs** (Track 1): one deploy, all verified fixable in an afternoon.
2. **Batch B — naming & funnel** (Track 2): one deploy; label/metadata only; needs owner
   sign-off on the specific labels since naming is owner-sensitive.
3. **Batch C — concepts wiring** (Track 3 #23-32): mostly mechanical; huge compounding value.
4. **Batch D — reading polish** (Track 4 #35-40).
5. **Batch E — discovery wiring** (Track 5 #42-48).
6. Then the three bigs in value order: **hover cards (#34) → hybrid embedding (#49) →
   reading-position memory (#41) → glossary flip (#33)**, and one ambitious bet (#56 first).

Full raw findings (127KB, per-dimension, with evidence): session scratchpad `audit-v2-full.txt`.
