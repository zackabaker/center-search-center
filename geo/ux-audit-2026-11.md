# center.study — Interaction & Visual Design Audit (November 2026)

Scope: how the site behaves and looks, measured at phone size (375×812) across 27 routes,
plus a codebase count of repeated visual patterns. Complements `site-audit-v2.md`, which
covers content, IA and SEO. Triggered by the /ask scroll-trap bug: the earlier audits
checked that pages rendered, not that they could be operated with a thumb.

Design proposal that answers the "looks vibecoded" feedback:
https://claude.ai/artifact/KRn9UZdqPA7Nn2ij7XxjaG (private canvas, five boards).

## Shipped during this audit

- /ask on mobile: page was a viewport-height box with an inner scroller and a pinned
  composer that swallowed swipes. Now ordinary document scroll; composer inline at the end.
- /ask: verbatim passages render first, AI synthesis streams below them.
- Post pages: `?q=` is stripped from the address bar after highlighting (shares leaked
  the reader's search query).
- /begin textarea was 15px — iOS zooms the whole page on focus under 16px.
- Reading-list "remove" and browse "bookmark" buttons were hover-only (invisible on touch).
- Archive header read "1,070reference texts" (JSX dropped the space).
- Four page titles doubled the site-name suffix (reading-list, lectures, download, verify).
- Bottom tab bar highlighted Guide on concept pages; now Concepts.

## Open — behavior (ordered by reader impact)

1. **Search results start below the middle of the phone screen.** Before the first
   result: concept card, result count, "in 294 of 973 Katz texts", "also matching", Share,
   sort, a source-chip row that runs off the edge, and an "Also search" chip row. A sticky
   107px search header plus the 49px site nav and 66px tab bar then hold ~27% of the
   viewport for the whole scroll. Collapse the meta into one line; let the header scroll away.
2. **/companies is ~355 phone-screens long** (850 passages, 876 links, one page).
   /concepts/glossary is 55 screens, /author/katz 38. Paginate or collapse by section;
   nobody reaches passage 400 by thumb, and the DOM weight slows low-end phones.
3. **Most text on the site is small and pale.** `text-gray-400` is the single most-used
   text color (463 uses; ≈2.9:1 on white, below the 4.5:1 AA minimum). There are 573 uses
   of ≤12px sizes against 48 of 16px. On /browse 18% of visible characters are under 12px,
   on /author/katz 15%.
4. **Tap targets are undersized almost everywhere.** Post page: 46 of 62 tappable things
   are under 30px tall (reading-mode, "terms", A−/A+ controls are 22–24px). Glossary A–Z
   letters are 28px. Carousel dots are 16×6.
5. **Titles are cut off with ellipses** on /browse source cards, the glossary's source
   lines, and concept pages' passage sources — the same "can't see the whole title"
   complaint already fixed on /ask.
6. **Three more hover-only affordances** remain: paragraph permalink anchors and the
   per-paragraph copy/share glyphs on posts (unreachable on touch).
7. **Page titles change typeface from page to page** — serif on posts, concepts,
   /companies; bold sans on Archive, Concepts & Glossary, Trending, Guide, source pages.
8. **Corpus size is stated four different ways**: "1,900+ texts" (guide, begin, meta),
   "~1,969" (about), "973 by Katz plus 1,070 reference" (archive), "~900" (home JSON-LD).
   Derive one figure from posts-cache.
9. **/guide is five identical cards** each saying "Browse the … →". It duplicates the tab
   bar it sits above. Fold it into /begin or delete it.

## Open — why it reads as generated (counts from `src/`)

- Framework defaults as identity: Geist + Geist Mono (the create-next-app fonts) on the
  stock Tailwind gray scale with `blue-600` links.
- One container for everything: `rounded-xl border` cards ×53, pill chips
  (`rounded-full`) ×57, colored left rails ×24.
- Mono, uppercase, letter-spaced section labels ×63.
- Fourteen accent hues (blue ×308, green ×94, amber ×93, purple ×66, orange ×65, teal ×59 …),
  mostly pastel source badges.
- "→" on 67 links; "✦" marking AI features.
- Every page offers four to six competing ways to go somewhere else.

## Proposed direction (see the canvas)

"A reading room, not a dashboard": the identity of the Avalon talk deck (ink #141414,
hairline #D8D8D4, Prussian accent, heavy black rules) carried onto the site.

- Two families: Newsreader for every title and all reading text; Archivo for interface.
- One accent (Prussian #1B4F6E). Sources named in words, not colored badges.
- No cards, no pills: lists divided by hairlines, 2px corners, ink rules for structure.
- Nothing under 13px; second ink #4F4F4B (8:1 on paper) replaces gray-400.
- Every control 44px or taller.
- AI synthesis collapsed under the passages, labeled plainly as written by AI.

## Suggested order

1. Tokens: fonts, palette, minimum sizes in `globals.css` + layout (whole-site lift, low risk).
2. Search results header and list (highest-traffic surface with the worst density).
3. Home, then post chrome, then archive/browse.
4. Long pages (/companies, glossary, author) — pagination.
