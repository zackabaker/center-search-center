# GA → center.study funnel (Task C)

`generativeanthropology.com` (Notion + Super) is being deprecated. It keeps the domain
but funnels all authority/traffic into center.study. **Sequencing: the destination
already exists** — `https://center.study/generative-anthropology` (shipped) — so Phase 1
(funnel + canonical) is safe to run now; Phase 2 (301) waits for your go-ahead.

GA is a thin site: essentially two head pages plus an asset list. Every asset it hosts
is already mirrored on center.study, so nothing is orphaned when it redirects.

## Phase 1a — above-the-fold funnel links (Notion content, paste-ready)

Add this as the FIRST block (callout) at the top of **both** GA pages, above the existing
intro text. In Notion: `/callout`, paste, then make the links real Notion links.

> 📖 **The complete Generative Anthropology archive is now at center.study.**
> Read the full introduction → **https://center.study/generative-anthropology**
> Search ~1,900 texts by Adam Katz & Dennis Bouvard → **https://center.study/search**
> The concept glossary → **https://center.study/concepts**

(If the Notion workspace is connected to me as a connector, say so and I'll add these
blocks directly instead of you pasting.)

## Phase 1b — cross-domain canonical (Super dashboard)

Point each GA page's canonical at its center.study equivalent. Two ways in Super:

- **Preferred (per-page):** Super dashboard → the page → **Settings → SEO → Canonical URL**.
  Set the values from the map below.
- **Fallback (code injection):** Super dashboard → **Settings → Code → Head**, per page, add:
  ```html
  <link rel="canonical" href="https://center.study/generative-anthropology" />
  ```
  Do NOT set one site-wide canonical for all pages — each page must canonical to its own
  equivalent (see map), or you'll collapse them onto one URL.

Confirm Super's sitemap URL (usually `https://www.generativeanthropology.com/sitemap.xml`)
and that it's submitted to Bing/Google (Task B8).

## Canonical + Phase 2 redirect map (GA URL → center.study URL)

| GA page | center.study canonical (Phase 1) | 301 target (Phase 2) |
|---|---|---|
| `/` (home) | `/generative-anthropology` | `/generative-anthropology` |
| `/introduction-to-generative-anthropology` | `/generative-anthropology` | `/generative-anthropology` |

Asset references on GA (already mirrored — no orphan on redirect):

| GA asset | center.study equivalent |
|---|---|
| GA intro video (YouTube `FkwR5QYyvWk`) | embedded on `/generative-anthropology` |
| GA Podcast (Katz lectures on the originary scene) | `/lectures` |
| "The Originary Hypothesis in Itself" (Bouvard Substack) | `/post/the-originary-hypothesis-in-itself` |
| "Why Generative Anthropology?" (Peter Goldman) | `/post/why-generative-anthropology` |
| *The Origin of Language* (Gans) | `/post/the-origin-of-language` |
| *Anthropomorphics* (Bouvard) | `/post/anthropomorphics-book` |
| Dennis Bouvard Substack | mirrored throughout the archive (substack source) |

## Phase 2 — 301 redirects (DO NOT ENABLE until you say so)

When you give the go-ahead, in Super → **Settings → Redirects** (or DNS/host-level if
Super can't 301), add:

```
/                                          301 → https://center.study/generative-anthropology
/introduction-to-generative-anthropology   301 → https://center.study/generative-anthropology
```

Keep the domain registered as a permanent redirect asset. Verify canonicals have been
live for a few weeks first, and that center.study/generative-anthropology is indexed in
Bing + Google, before flipping the 301.

## What needs you

- Super dashboard logins for canonical/redirect/sitemap (or connect the Notion workspace so I can do the content blocks).
- The Phase 2 redirect go-ahead.
