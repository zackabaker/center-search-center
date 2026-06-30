# GEO/SEO program — center.study as the canonical GA source

Goal: make **center.study** the single canonical, most-cited source for Generative
Anthropology / the originary hypothesis / the center / deferral / sovereignty across AI
engines, with **generativeanthropology.com (GA)** funneling in and later redirecting.

## Shipped on center.study (this repo — pushed to `main`, auto-deploys on Vercel)

| Task | What | Commit |
|---|---|---|
| A1+A2 | New canonical head-term page **/generative-anthropology** — answer-first definition, FAQ (FAQPage schema), Article+dateModified schema; mirrors GA's assets (intro video embed, lectures, books, Goldman essay, Bouvard Substack); funnels into the archive | `3975b35` |
| B5 | Homepage JSON-LD: consolidated **sameAs identity graph** (Katz/Bouvard → Substack, Amazon, Anthropoetics, Reddit u/bouvard1, X @centerstudy_, generativeanthropology.com as alternate); WebSite+DataCatalog typing with `about`=Generative Anthropology; Book entity for *Anthropomorphics* | `3975b35` |
| B4 | Sitemap: added /generative-anthropology, /start, /faq, /lineage, /download | `3975b35` |
| B8 | Search Console + Bing verification via env vars (`GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`) — set tokens in Vercel, no code change | `3975b35` |
| B3 | **Verified live** robots.txt already allows every AI crawler (GPTBot, OAI-SearchBot, ClaudeBot, anthropic-ai, CCBot, PerplexityBot, Google-Extended, Bingbot via `*`) + sitemap referenced — **nothing blocked** | (already correct) |
| B6 | Concept pages already lead with answer-first content: the glossary overhaul (prior work) gives each concept a verbatim defining quote + plain subtitle + linked passages — strong AI-extractable surfaces. New terms not yet in /concepts (katechon, idiomclining, singularized succession as its own page): flagged below | `08d7a42` |
| B7 | Visible "Last updated" on /generative-anthropology; dateModified in its schema | `3975b35` |

## Prepared (in this folder)

**Paste-ready, fact-checked artifacts** (copy these verbatim):
- `wikidata-statements.md` — exact statement set + click-through to create "Center Study" and edit GA/Gans/Katz. Verified QIDs: **Generative anthropology = Q5532622**, **Eric Gans = Q5386556**; **no Adam Katz item exists** (with the list of unrelated Adam Katzes to avoid). Wikidata permits disclosed COI edits.
- `wikipedia-talk-posts.md` — ready-to-paste, COI-disclosed Talk posts for *Talk:Generative anthropology* and *Talk:Eric Gans* (Talk pages only; expect possible WP:ELNO pushback on a self-owned single-author archive — don't re-add if declined).
- `reddit-drafts.md` — one seed self-post **with an explicit ownership disclosure** (Reddit self-promo rules) + 5 in-context comment templates + per-sub etiquette.
- `outreach-emails.md` — 10 personalized emails (COV&R/Imitatio, Anthropoetics/GASC, Substacks, podcasts, PhilPapers, Goodreads, YouTube…), each with a value-to-them ask.

**Strategy overviews:**
- `ga-funnel.md` — GA Phase-1 funnel blocks (paste-ready Notion), cross-domain canonical map (Super), Phase-2 301 redirect map (hold for your go-ahead).
- `entity-establishment.md` — entity strategy + COI handling (the paste-ready version is `wikidata-statements.md` / `wikipedia-talk-posts.md`).
- `offsite-distribution.md` — off-site strategy (the paste-ready version is `reddit-drafts.md` / `outreach-emails.md`).
- `measurement-baseline.csv` — 25 prompts × 5 engines tracking grid (seed today's baseline; expect Perplexity 2–4 wks, ChatGPT 6–12 wks lag).

## Ordered list — only you can do these
1. **Set verification tokens** in Vercel env: `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` (from Search Console + Bing Webmaster Tools), then redeploy. Submit sitemaps:
   - `https://center.study/sitemap.xml` → Google Search Console + Bing Webmaster Tools.
2. **GA funnel (Phase 1)** — Super dashboard: add the funnel callout to GA's two pages and set each page's canonical to its center.study equivalent (`ga-funnel.md`). Or connect the Notion workspace so I add the content blocks.
3. **Wikidata / Wikipedia** — create the "Center Study" Wikidata item + post the Talk-page proposals (`entity-establishment.md`). COI: Talk pages only, never direct article edits.
4. **Reddit + placements** — approve/post from u/bouvard1; I can draft each (`offsite-distribution.md`).
5. **Phase 2 GA 301** — give the go-ahead once canonicals are indexed; then enable the redirects in `ga-funnel.md`.

## Sequencing respected
Destination built first (`/generative-anthropology` live) → then GA canonical → then (on your go) GA 301. Do not redirect into a gap; the gap is now filled.
