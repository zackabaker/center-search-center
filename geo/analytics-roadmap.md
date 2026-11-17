# Analytics roadmap — what we aren't capturing, and how to show it

*2026-11-17. Companion to `site-audit.md` / `ux-audit-2026-11.md`. The console
(/analytics) answers "what happened"; this roadmap is about making it answer
the owner's actual questions: what are people reading, what's working, what
isn't, and what to change.*

## Status — all three batches shipped 2026-11-17

Everything below is built and live except where noted here.

- **Works from day one** (derived from data already stored): the "This
  week" block, sources + quality, AI-referred readers, landings, searches
  that opened nothing, the reading-path funnel, texts read together, follow
  attribution, most-opened-this-week, per-text stats pages
  (`/analytics/post/<slug>`), chart annotations.
- **Filling in from 2026-11-17** (new capture): read depth + dwell, per-text
  read series, AI crawler/agent fetches, result picks, device + language,
  404s. Each display shows a "began Nov 17" note until it has data.
- **One deviation from the plan (2b):** AI crawlers don't run JavaScript, so
  they never reach `/api/activity`. They are counted in `src/proxy.ts`
  instead, behind a matcher entry conditioned on the user-agent — only AI
  agents are routed through the proxy; readers and search engines still
  skip it, so ISR caching is untouched.
- **Weekly digest:** a Vercel cron (`vercel.json`, Mondays 13:00 UTC)
  snapshots the week into KV; past weeks are listed under "This week".
  No email — the site has no mail provider.
- **Needs the owner — Search Console (4d).** The importer and its console
  block are live but idle until a key exists:
  1. Google Cloud console → create a project (or reuse one) → enable the
     **Google Search Console API**.
  2. IAM → Service accounts → create one → Keys → add a **JSON** key.
  3. Search Console → Settings → Users and permissions → add the service
     account's email (…@….iam.gserviceaccount.com) as a **Restricted** user
     on the center.study property.
  4. Vercel → Project → Settings → Environment Variables → add
     `GSC_SERVICE_ACCOUNT_JSON` (Production) with the whole JSON file as
     its value; redeploy. The daily cron (09:00 UTC) fills the block, or
     open `/api/analytics/gsc-sync` while signed in to run it at once.
- **Optional hardening:** set a `CRON_SECRET` env var in Vercel and the two
  cron routes will require it (Vercel sends it automatically); until then
  they accept Vercel's cron user-agent, which is safe here because both
  jobs are idempotent and reveal nothing.
- **Verifying capture:** `/api/analytics/peek?k=crawler|depth|fof|activity`
  (owner-only) reads the raw day-hashes.

## Baseline: what is captured today

Per-tab session trails (pages, searches with result counts, reads, follows
with destination+placement, /begin generations, first-visit/return stamps),
referrer hostname on a session's first event, daily aggregate counters
(views/visitors/searches/opens/reads/follows/returns, 400d TTL), all-time and
two-month per-post view ZSETs, accounts + engagement scores + the new
`acct:index` signup registry, feedback notes, Ask Q+A pairs. Sessions split
into 30-min episodes. Bots are dropped at ingest. No IPs, ever; the owner's
own usage is server-side excluded from reader views.

Two structural limits shape everything below: the raw logs are capped
(activity ≈ a few weeks at current volume), so **anything we want to see
long-term must land in a daily aggregate at ingest**; and "read" is binary
(≥50% depth + ≥90s), so we know *that* texts get read but not *how far*
people get or where they give up.

---

## Q1 — What are people reading?

**1a. Read-depth buckets + dwell (capture).** ConvertTracker already watches
scroll position; additionally record the *max* depth bucket (25/50/75/100)
and a dwell bucket, sent once per post view via `navigator.sendBeacon` on
`visibilitychange → hidden`. Ingest into a per-day hash (`depth:<day>`,
field `<slug>:<bucket>`). Industry convention is exactly these buckets, read
alongside time-on-page; "completion rate" = share of views reaching ≥75%.
Display: a small funnel per post (opened → 25 → 50 → 75 → 100), the
Yandex-Metrica "read vs. merely scrolled" idea — dwell distinguishes reading
from flicking. This is the single highest-value capture gap: it turns "views"
into "where do readers give up on this text".

**1b. Per-post daily series (capture).** `postday:<day>` hash slug→views and
`readday:<day>` slug→reads at ingest (400d TTL). Enables sparklines beside
top-content rows and the drill-down below. Cheap: two HINCRBYs per view.

**1c. Per-post drill-down (display).** `/analytics/post/[slug]`: views and
reads over time, completion funnel, top referrers *for this text*, searches
that led to it, and what readers opened next. Clicking any post title in the
console goes here. This is the "is this text working?" page.

**1d. Co-read pairs (derive — no new capture).** From existing trails: texts
read in the same visit → "readers of X also read Y". A console insight first;
later possibly a site feature (behavior-based related reading, to compare
against the embedding-based related list).

## Q2 — What's working?

**2a. AI-referred readers (display only — data already captured).** Classify
stored ref hostnames: chatgpt.com / chat.openai.com, perplexity.ai,
claude.ai, gemini.google.com, copilot.microsoft.com → a "via AI" badge on
sessions/journeys and an AI-referrals trend line. Caveats from research: web
chats pass the referrer but the mobile apps strip it (so this is a lower
bound, the rest lands in "direct"), and Search Console reports *zero* AI-chat
traffic — our own log is the only window. Directly measures the GEO mission.

**2b. AI-crawler panel (capture).** `/api/activity` currently drops bot UAs
on the floor. Keep dropping them from visitor data, but first classify the UA
family (GPTBot, OAI-SearchBot, ClaudeBot/anthropic-ai, PerplexityBot,
Googlebot, Bingbot, CCBot, Bytespider…) and increment `crawler:day:<day>`
per family, plus a small per-family path ZSET. Display: "AI systems reading
the archive" — which texts the models themselves fetch, trending over time.
For a site whose goal is to be the most-cited GA source, this is the supply
side of GEO and it's currently invisible.

**2c. Referrer quality table (derive).** Per referrer hostname: sessions,
engaged share, reads. Volume vs. quality — does X send skimmers while
Substack sends readers?

**2d. Search→click→read funnel (capture).** We log queries and result counts
but not which result (if any) was clicked. Log clicks (query, rank, slug) —
a `pick:<rank>` trail event plus a per-day aggregate. Queries where readers
got results and clicked *nothing* are ranking failures — the real successor
to the retired zero-results list. Also makes trails richer ("searched →
picked #3 → read it").

**2e. /begin funnel + follow attribution (derive).** Generated a path →
opened a text from it → read it → returned later; all in trails already,
just needs the aggregation. Likewise follows per *post* (events carry
destination+placement): which texts convert readers into Substack followers.

## Q3 — What isn't working?

**3a. Landing/exit aggregation (derive).** Top landing paths with engaged
rate; "landed and left" (single-event sessions) per path — pages that get
traffic but hold nobody. The visitors chart counts them; nothing names them.

**3b. High-traffic / low-completion texts (derive, needs 1a).** Sort posts by
completion rate ascending — the Plausible pattern of sorting top pages by
scroll depth to find weak content.

**3c. Unanswered Asks (derive).** Flag truncated and "can't answer"-shaped
answers in ask:log — unmet demand on the Ask side.

**3d. 404 log (capture, tiny).** Fire a beacon from the not-found page:
broken links in the wild and misspelled inbound URLs.

## Q4 — How to improve the site? (the meta-layer)

**4a. "This week" insights block (derive).** A computed narrative at the top
of the console — biggest movers vs. last week, notable journeys, new
accounts, AI referrals — as sentences with links, not more charts. (The
minimal-analytics products all converged on one-screen summaries + a
periodic report; this is ours.) Rule-based, not AI-written.

**4b. Chart annotations (capture, tiny).** Owner-only input: mark dated
events ("posted on X", "Avalon talk") into a KV list; render markers on the
trend charts. Cause and effect becomes visible.

**4c. Weekly digest (automation).** A scheduled task that writes the week's
summary (same computations as 4a) — the console comes to you instead of you
visiting it.

**4d. Search Console import (integration).** Daily cron pulls GSC
queries/impressions/CTR into KV (`gsc:day`), shown next to on-site search —
Google-side demand vs. on-site demand in one place. Needs a Google service
account; the one item here with real setup friction.

**4e. Device class + language (capture, one byte each).** `m`/`d` from
viewport width and the primary language subtag (`pt`, `de`…) per session.
Prioritizes mobile work with data and shows international readership
(the Brazilian canonical reader is likely not alone). Coarse on purpose: no
geo-IP, no user-agent storage.

## Privacy guardrails (unchanged, non-negotiable)

No IPs stored; no fingerprinting; coarse buckets over precise values;
referrer hostnames only; signed-in identity never joined to anonymous
trails; the owner excluded from reader views; nothing here weakens the
"never unmask a reader" posture.

## Priority

- **Batch A — display-only, no new capture (one session):** 2a AI referrals,
  2c referrer quality, 3a landing/exit, 1d co-reads, 2e funnels, 4a insights
  block v1.
- **Batch B — light capture (tracker edits + day-hashes):** 1a depth+dwell,
  1b/1c per-post series + drill-down, 2b AI-crawler panel, 2d search clicks,
  4e device/language, 3d 404s. (Each needs a few days of data before it
  shows anything.)
- **Batch C — automation/integrations:** 4b annotations, 4c weekly digest,
  4d GSC import.
