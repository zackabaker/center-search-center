Confirmed: browser-side semantic (`embed-client.ts`) and `/api/semantic` are shipped; homepage uses `summary_large_image` while posts use `summary`. All findings ground out. Producing the roadmap now.

---

# center.study — Site-Improvement Roadmap

## Executive summary

center.study is a technically mature GA archive whose machine-discoverability foundations (robots, sitemap, homepage @graph, the `/generative-anthropology` head term, clean slugs) are already shipped and solid — but three avoidable regressions are quietly bleeding its core asset, the ~1,900 post pages: every post title double-prints the `| Center Study Center` suffix, every post serves uncached (`no-store` SSR) because the slug-redirect proxy opts `/post/*` out of ISR, and every shared post link renders as a tiny Twitter card despite a built 1200×630 image. The biggest *latent* levers are assets the site already paid for but never reads: the prebuilt embeddings (used for related-posts but never for Ask retrieval or default search) and the write-only Redis logs (view counts + search terms accumulating with zero read path). The single highest-ROI theme is **"turn already-built infrastructure on"** — schema serialization of existing Q&A/glossary data, semantic retrieval into Ask, and mining the search log into a citable `/answers` page.

---

## Quick wins (high impact, ≤ S/M effort)

| Recommendation | Dimension | Impact | Effort | One-line why/how (file) |
|---|---|---|---|---|
| Strip hardcoded `\| Center Study Center` from titles | Tech SEO | High | S | Template double-appends on ~1,900 posts + hubs; remove suffix at `post/[slug]/page.tsx:113`, `author/[name]:97,105`, `concepts:11`, `browse:6`, `browse/[source]:122` |
| Post Twitter card → `summary_large_image` | Growth | High | S | Posts have a 1200×630 image but render as a thumbnail; one-line at `post/[slug]/page.tsx:127` + set OG image alt to post title |
| FAQPage JSON-LD on `/faq` | GEO | High | S | 48 hand-written Q&A pairs ship zero schema; map existing `items[].q/.lead` to FAQPage, copying the proven pattern in `generative-anthropology/page.tsx:59-68` |
| Add GANS author profile | Content/IA | High | S | 855 chronicle posts have inert "Eric Gans" bylines, `/author/gans` 404s; add GANS to `PROFILES` in `author/[name]/page.tsx:52`, map handle in `post/[slug]/page.tsx`, add Person JSON-LD + sitemap |
| Render markdown headings as real `<h2>/<h3>` | A11y | High | S | All long essays are one flat heading-less block; flip `isHeading` branch from `<p>` to `<h2/h3>` (level already computed) at `PostContent.tsx:322-340` + add ids for TOC anchors |
| Fix Sepia/Night FOUC | Reading | High | S | Anti-flash IIFE only restores dark mode; extend `layout.tsx:89-93` to also read `csc-reading-mode` before paint, mirroring `ReadingControls.tsx` applyMode |
| Self-canonical on hub pages | Tech SEO | Medium | S | Home/`/concepts`/`/browse`/`/search`/concept pages emit no canonical, accept indexable `?view=`/`?from=` variants; add `alternates.canonical` like `/author` does |
| `noindex,follow` on `/search` + `/ask` | Tech SEO | Medium | S | Unlimited `?q=` result pages are crawlable/indexable thin content; add `robots:{index:false,follow:true}` to both page metadata |
| `aria-current="page"` on nav | A11y | Low | S | Active tab marked by color only; one line each in `MobileNav.tsx:76` and `SiteNav.tsx:52` |
| `prefers-reduced-motion` global guard | A11y | Medium | S | Infinite spinner + smooth-scroll + view-transitions have no opt-out (WCAG 2.3.3); add one `@media` block in `globals.css` |
| Surface failed quote verification in Ask | Discovery | Medium | S | `verified===false` shows nothing — fabricated quotes look identical to unchecked; render a "couldn't confirm" marker at `AskClient.tsx:749` |
| Delete dead `/api/rebuild` cron | Perf | Low | S | Fires into a 404 weekly; remove `crons` block from `vercel.json` (GitHub Action already redeploys) |
| Cache per-post OG image | Perf | Medium | S | Regenerated + loads 31MB corpus every unfurl; add `export const revalidate = 86400` to `opengraph-image.tsx` |
| Per-source RSS feeds | Growth | Medium | S | One firehose feed only; add `feed/[source]/route.ts` reusing 90% of `feed.xml/route.ts` + autodiscovery `<link>` on `/browse/[source]` |
| De-stale hardcoded corpus counts | GEO | Low | S | "~1,900" vs live 1,969; interpolate `getPublicPosts().length` into `generative-anthropology/page.tsx:52` |

---

## High-impact projects (M/L)

**Get post pages back on the edge cache (the single biggest perf issue).** Every one of ~1,900 posts — the entire reason the site exists — serves `cache-control: private, no-store` with `x-vercel-cache: MISS`, ~2× the TTFB of cached routes, and re-runs `getPublicPosts()` + `buildSearchEntries()` on every hit. The cause is the slug-redirect proxy whose matcher `['/post/:slug', ...]` (`src/proxy.ts:28`) opts the route out of ISR; every *other* dynamic route (concepts, author, browse) correctly returns `x-nextjs-prerender:1` + HIT. Move the 308 redirect logic out of the proxy — express `slug-redirects.json` (98KB) as `next.config` redirects, or narrow the matcher to legacy-prefixed slugs only so canonical URLs skip the proxy entirely. Verify `/post/<slug>` returns prerender + HIT afterward.

**Wire the prebuilt embeddings into Ask retrieval (hybrid RAG).** Ask is the GEO money-maker (it emits deep-linked verbatim quotes that engines cite), yet `retrieveChunks()` in `api/chat/route.ts` is 100% lexical — keyword counts + a hand-maintained `TERM_SYNONYMS` map, zero semantic. Meanwhile a 17,676-chunk embedding index already loads server-side and powers `/api/semantic`. Add a server-side query embedding via the already-bundled `embed.ts::embedQuery` (bge-small, offline, no API cost) and fuse top-40 lexical + top-40 semantic via Reciprocal Rank Fusion before the existing source-diversity quotas. ~100-300ms added against the Sonnet stream; reuses three already-shipped pieces (`embed.ts`, `semantic.ts`, the vectors file). This is the biggest answer-quality and citation-accuracy win available.

**Mine the write-only Redis logs (view counts + search terms).** Both `api/view/route.ts` (`views:counts`) and `api/search-log/route.ts` (`search:terms` + zero-result `search:log`) explicitly note "No UI uses this yet" — and a grep confirms nothing reads them. This is the cheapest growth/content data the site already collects and discards. Build two thin reads: (1) a "Most read" / `/trending` strip backed by `zrange(views:counts, rev)` — creates fresh internal links to popular pages; (2) an owner-gated read of top queries + zero-result misses to drive a content-gap worklist (feed misses straight into `TERM_SYNONYMS` and concept stubs).

**DefinedTerm schema across the 135 concept pages + concept JSON-LD.** `/guide/concepts/[slug]` is the strongest citability asset (verbatim defining quote + attributed source) but emits zero JSON-LD. Add a `DefinedTerm` block per page from data already on the page (name, description=definitionQuote, `inDefinedTermSet` → `/concepts#glossary`, `citation` → source post) plus a `DefinedTermSet` ItemList on `/concepts`. Turns 135 pages into a machine-readable controlled vocabulary keyed to sourced quotes.

**Blend semantic into default search (retire the binary toggle).** Default `/search` is lexical-only; semantic recall is hidden behind a non-default "Meaning" tab that *replaces* keyword results. Worse, lexical phrase-match only covers the first 20,000 chars (`search-index.ts:186`), so verbatim phrases in long essays' back halves are unfindable. Lowest-effort first step: in the keyword empty-state (`SearchPageClient.tsx:711`), auto-run `/api/semantic` and show top 3-4 meaning matches — converts dead-end searches into discovery using components (`SemanticResults`, `vecCache`) that already exist.

**Add BreadcrumbList schema + visible breadcrumbs.** Zero `BreadcrumbList` anywhere across 1,900 pages forfeits free SERP breadcrumb rich results and a hierarchy signal. Emit a second ld+json on `/post/[slug]` (Home → Source → Post), `/guide/concepts/[slug]`, and `/browse/[source]` — the source label and URL are already computed.

**End-of-article conversion CTA (source-aware).** Every essay dead-ends into related links; the Amazon book URL exists *only* in JSON-LD `sameAs` (invisible to humans), and there's no Substack/lectures/email CTA at the point of highest intent. Add a `print:hidden` end-of-read block in `post/[slug]/page.tsx` after `PostNavigation`: book-source → "Get Anthropomorphics," substack-source → "Subscribe," always a quiet `/follow` line. The single biggest conversion gap.

**aria-live for search/Ask results.** No `aria-live` region anywhere (WCAG 4.1.3) — screen-reader users get no notice that results appeared or that the streamed Ask answer finished. Add a `sr-only aria-live="polite"` div announcing "{n} results for {query}" and "Answer ready," updated in existing state effects.

**Promote Scapegoating + Sovereignty (and add katechon/idiomclining) to full concepts.** "scapegoat" occurs 1,075× and "sovereign*" is a featured homepage theme, yet both are thin glossary glosses, not the deep sitemap-prioritized concept hubs. Separately, signature terms `idiomclining` (Bouvard's own coinage — center.study could own it outright) and `katechon` have zero presence in `/concepts` or the glossary. Add full Concept entries per the `concepts.ts` interface and register link-terms; this also fills the near-empty "Pathology and Critique" tier (1 of 23).

---

## Bigger bets

**Topic hub pages (`/topics/[slug]`).** The 15 browse-by-topic shortcuts all route to ephemeral `/search?q=` — no citable destination for "GA on AI," "generative anthropology money," etc. Build 4-5 static topic hubs (intro + linked concepts + canonical posts) reusing the `FEATURED_GROUPS` shape. **Trade-off:** highest IA-leverage for discoverability but L effort and ongoing curation; mine the search log to rank which themes to build first so effort follows real demand.

**A public `/answers` page from the search log + Ask synthesis.** Take the top ~40-60 real recurring questions (especially `mode==='ask'` natural-language queries), pre-run each through Ask at build time, and render a crawlable Q&A page with FAQPage schema and deep-linked cited passages. This is the strongest GEO play in the audit — it makes the *live demand signal* into the canonical GA Q&A surface, the same playbook that worked for the `/generative-anthropology` FAQ. **Trade-off:** depends on the semantic-Ask and log-read work landing first, and build-time synthesis adds cost; gate to a curated, verified subset.

**Move semantic query-embedding server-side.** The "Phase 2" browser path *is* shipped (`embed-client.ts` downloads a ~30MB model from jsDelivr/HF per visitor — a heavy, abandon-prone toll on mobile, plus two third-party dependencies). Since the function already loads the 27MB vector file and the model is bundled in `/models`, fold text-embedding into `/api/semantic` so first-use Meaning search is instant, shareable via `?q=` URL, and dependency-free. **Trade-off:** adds ~30MB ONNX to the function cold start (paid once per warm instance vs once per user) — net win, but keep the browser path as progressive enhancement for offline/repeat users.

**First-party email capture + conversion instrumentation.** The site owns no audience list — the only capture is a buried Substack iframe on footer-only `/follow`, and analytics is pageviews-only (no events on cite/share/booklet/CTA clicks). Decide a channel of record, embed capture on the homepage hero + new post CTA, and add `track()` calls (SDK already a dependency) on cite-copied/quote-shared/CTA-clicked. **Trade-off:** light "monetization"/retention foundation, low effort, but only pays off once the CTA and trending surfaces drive traffic to it — sequence after the post-cache and CTA fixes.

**Head-term landing pages for the top GA queries.** `/generative-anthropology` is an excellent schema-rich answer-first template but it's the *only* one; "the originary hypothesis," "the center," "deferral," "Girard vs Gans" have only quote-first concept pages. Clone the template into 3-5 routes ranked by the search log. **Trade-off:** L effort and some thin-content risk if over-produced — build only the demonstrably high-volume terms, and link them from `llms.txt` + sitemap.

---

## Top 7, ranked

1. **Strip the duplicated title suffix** — global title-quality regression on ~1,900 posts + hubs; S effort, one-line per file (`post/[slug]/page.tsx:113` et al).
2. **Restore ISR/edge caching on `/post/*`** — the site's core pages are the only route type uncached; fix the proxy matcher (`src/proxy.ts:28`).
3. **Post Twitter card → `summary_large_image`** — upgrades every shared essay from thumbnail to full banner; one line at `post/[slug]/page.tsx:127`.
4. **FAQPage schema on `/faq` + GANS author profile** — two S-effort serializations of existing data that close the biggest GEO/entity gaps (48 Q&A made machine-readable; 855 Gans posts linked).
5. **Hybrid semantic+lexical retrieval in Ask** — biggest answer-quality/citation win; reuses the already-built embeddings via RRF in `api/chat/route.ts`.
6. **Render real `<h2>/<h3>` headings + add aria-live** — fixes the top a11y failure and the document outline on all essays in one small change, plus screen-reader status on search/Ask.
7. **Mine the Redis logs → `/trending` + a content-gap/`/answers` pipeline** — turns already-collected, currently-discarded demand data into internal links and the strongest GEO Q&A surface.

**Verified against code:** title double-suffix (`layout.tsx:32-33` template + `post/[slug]/page.tsx:113`), `twitter: card: 'summary'` on posts vs `summary_large_image` on home, `revalidate=3600`+`dynamicParams` with proxy matcher covering `/post/:slug`, zero JSON-LD on `/faq` and concept pages, only KATZ/BAKER author profiles, no `/api/rebuild` route, dead `crons` block in `vercel.json`, zero semantic usage in `api/chat/route.ts`, no readers of `search:terms`/`views:counts`, and `embed-client.ts`+`/api/semantic` shipped (the browser-side "Phase 2" exists; server-side query embedding does not).
