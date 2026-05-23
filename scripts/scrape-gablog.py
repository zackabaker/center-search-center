#!/usr/bin/env python3
"""
scrape-gablog.py — Re-scrape the GABlog from the Wayback Machine.

The live site (gablog.cdh.ucla.edu) is down. This script fetches all
archived posts via the Wayback Machine CDX API and web interface, parses
the WordPress HTML correctly (preserving paragraph breaks), and rewrites
the <generative_anthropology_blog> section of ga_context.txt.

Usage:
    python3 scripts/scrape-gablog.py [--dry-run] [--limit N] [--resume]

Options:
    --dry-run   Fetch and parse but don't write to ga_context.txt
    --limit N   Only fetch first N posts (for testing)
    --resume    Skip posts whose title already exists in ga_context.txt
"""

import sys
import re
import time
import json
import argparse
from html import unescape
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

# ── Config ────────────────────────────────────────────────────────────────────

CDX_API = "http://web.archive.org/cdx/search/cdx"
WAYBACK_BASE = "http://web.archive.org/web"
GABLOG_BASE = "http://gablog.cdh.ucla.edu"
DATA_FILE = Path("src/data/ga_context.txt")
DELAY_SECS = 1.5   # be polite to archive.org

# ── HTTP helpers ──────────────────────────────────────────────────────────────

def fetch(url: str, retries: int = 3):
    """Fetch URL, retry on transient errors, return text or None."""
    headers = {"User-Agent": "Mozilla/5.0 (compatible; center-study-scraper/1.0)"}
    for attempt in range(retries):
        try:
            req = Request(url, headers=headers)
            with urlopen(req, timeout=30) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except HTTPError as e:
            if e.code in (429, 503) or attempt < retries - 1:
                wait = (attempt + 1) * 3
                print(f"  HTTP {e.code}, waiting {wait}s …", file=sys.stderr)
                time.sleep(wait)
            else:
                print(f"  HTTP {e.code} for {url}", file=sys.stderr)
                return None
        except URLError as e:
            if attempt < retries - 1:
                time.sleep((attempt + 1) * 2)
            else:
                print(f"  URLError: {e.reason} for {url}", file=sys.stderr)
                return None
        except Exception as e:
            print(f"  Error: {e} for {url}", file=sys.stderr)
            return None
    return None

# ── CDX: get all post URLs ────────────────────────────────────────────────────

def get_all_post_urls() -> list[tuple[str, str]]:
    """
    Return list of (original_url, best_timestamp) for all individual gablog posts.

    Strategy: fetch ALL CDX rows (no collapse), then pick the best snapshot per URL.
    "Best" = a snapshot from 2019-2022 when the site had its stable final theme
    (storycontent / storytitle divs). Fall back to most-recent if none in that range.
    """
    print("Fetching post URL list from CDX API …")
    # Get all snapshots (no collapse) so we can pick the best timestamp per URL
    cdx_url = (
        f"{CDX_API}?url=gablog.cdh.ucla.edu"
        "&matchType=domain"
        "&output=json"
        "&fl=original,timestamp,statuscode"
        "&filter=statuscode:200"
        "&limit=50000"
    )
    raw = fetch(cdx_url)
    if not raw:
        print("ERROR: Could not reach CDX API", file=sys.stderr)
        sys.exit(1)

    data = json.loads(raw)

    # Post URLs: /YYYY/MM/slug-name/ where slug starts with a letter
    post_re = re.compile(
        r"^http://gablog\.cdh\.ucla\.edu/\d{4}/\d{2}/[a-z][^/]+/$"
    )
    skip_terms = {"feed", "/page/", "comment", "?"}

    # Collect all snapshots per URL
    all_snaps: dict[str, list[str]] = {}
    for row in data[1:]:
        url, ts = row[0], row[1]
        if not post_re.match(url):
            continue
        if any(t in url for t in skip_terms):
            continue
        all_snaps.setdefault(url, []).append(ts)

    # Pick best timestamp: prefer 2019-01 – 2022-12 (stable theme)
    posts: dict[str, str] = {}
    for url, snaps in all_snaps.items():
        snaps_sorted = sorted(snaps, reverse=True)  # newest first
        preferred = [t for t in snaps_sorted if "2019" <= t[:4] <= "2022"]
        posts[url] = preferred[0] if preferred else snaps_sorted[0]

    # Sort chronologically by the URL's publication date (year/month in URL)
    def url_date(item):
        m = re.search(r"/(\d{4})/(\d{2})/", item[0])
        return (m.group(1), m.group(2)) if m else ("0000", "00")

    results = sorted(posts.items(), key=url_date)
    print(f"Found {len(results)} unique post URLs in CDX archive")
    return results

# ── HTML parsing ──────────────────────────────────────────────────────────────

def html_to_paragraphs(html: str) -> str:
    """
    Convert WordPress post HTML to clean plain text with double-newline paragraph breaks.
    Uses SPACE not empty-string for inline tag removal to prevent word concatenation.
    """
    # Remove script, style, noscript blocks entirely
    html = re.sub(r"<(script|style|noscript)[^>]*>.*?</\1>", "", html, flags=re.DOTALL)
    # Remove Wayback Machine toolbar/injected markup
    html = re.sub(r"<!-- BEGIN WAYBACK.*?<!-- END WAYBACK[^>]*-->", "", html, flags=re.DOTALL)

    # Block-level elements → paragraph breaks
    html = re.sub(r"</p\s*>", "\n\n", html, flags=re.IGNORECASE)
    html = re.sub(r"<p[^>]*>", "", html, flags=re.IGNORECASE)
    html = re.sub(r"</?(div|section|article|header|footer|blockquote|li|ul|ol)[^>]*>",
                  "\n\n", html, flags=re.IGNORECASE)
    html = re.sub(r"<h[1-6][^>]*>(.*?)</h[1-6]>",
                  lambda m: "\n\n" + re.sub(r"<[^>]+>", " ", m.group(1)).strip() + "\n\n",
                  html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r"<br\s*/?>", "\n", html, flags=re.IGNORECASE)

    # Inline elements → space (prevents concatenation)
    html = re.sub(r"<[^>]+>", " ", html)

    # Decode HTML entities (including &nbsp; → space)
    text = unescape(html)

    # Normalise whitespace (including non-breaking spaces \xa0)
    text = text.replace("\xa0", " ")              # non-breaking space → regular space
    text = re.sub(r"[ \t]{2,}", " ", text)        # collapse horizontal whitespace
    text = re.sub(r" *\n *", "\n", text)           # trim spaces around newlines
    text = re.sub(r"\n{3,}", "\n\n", text)          # collapse excess blank lines
    return text.strip()


def parse_post(html: str, url: str):
    """Extract title, author, date, and content from a WordPress gablog page."""

    # ── Title ──────────────────────────────────────────────────────────────────
    # The gablog used class="storytitle" for the post heading
    title = None
    for pat in [
        r'<h[23][^>]*class="storytitle"[^>]*>\s*<a[^>]*>(.*?)</a>',
        r'<h[23][^>]*class="storytitle"[^>]*>(.*?)</h[23]>',
        r'<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>(.*?)</h1>',
    ]:
        m = re.search(pat, html, re.DOTALL | re.IGNORECASE)
        if m:
            title = unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip()
            break

    if not title:
        return None

    # ── Author / date from meta div ────────────────────────────────────────────
    # Format:  "Filed under: GA —  ericgans @ 12:31 am"
    author = None
    date_str = None
    meta_m = re.search(r'<div[^>]*class="meta"[^>]*>(.*?)</div>', html, re.DOTALL | re.IGNORECASE)
    if meta_m:
        meta = unescape(re.sub(r"<[^>]+>", " ", meta_m.group(1)))
        # Author handle after "—"
        a_m = re.search(r"[—–]\s+(\w+)\s*@", meta)
        if a_m:
            author = a_m.group(1).strip()
        # Date from the URL itself is reliable
        d_m = re.search(r"/(\d{4})/(\d{2})/", url)
        if d_m:
            date_str = f"{d_m.group(1)}-{d_m.group(2)}"

    # ── Content from storycontent div ──────────────────────────────────────────
    content_m = re.search(
        r'<div[^>]*class="storycontent"[^>]*>(.*?)(?=<div[^>]*class="|<div[^>]*id="respond")',
        html, re.DOTALL | re.IGNORECASE
    )
    if not content_m:
        # Fallback: try entry-content
        content_m = re.search(
            r'<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>(.*?)(?=<div[^>]*class="[^"]*(?:entry-footer|post-nav|respond))',
            html, re.DOTALL | re.IGNORECASE
        )
    if not content_m:
        return None

    content = html_to_paragraphs(content_m.group(1))

    # Filter noise
    if not content or len(content) < 50:
        return None

    return {
        "title": title,
        "author": author,
        "date": date_str,
        "content": content,
        "url": url,
    }

# ── Format for ga_context.txt ─────────────────────────────────────────────────

def format_entry(post: dict) -> str:
    lines = [f"Title: {post['title']}"]
    if post.get("author"):
        lines.append(f"Author: {post['author']}")
    if post.get("date"):
        lines.append(f"Date: {post['date']}")
    lines.append(f"Article: {post['content']}")
    return "\n".join(lines)

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true",
                        help="Parse but don't write to ga_context.txt")
    parser.add_argument("--limit", type=int, default=0,
                        help="Only process first N posts (0 = all)")
    parser.add_argument("--resume", action="store_true",
                        help="Skip posts already in ga_context.txt")
    args = parser.parse_args()

    # Load existing titles if resuming
    existing_titles: set[str] = set()
    if args.resume and DATA_FILE.exists():
        existing = DATA_FILE.read_text(encoding="utf-8")
        existing_titles = {m.group(1).strip().lower()
                           for m in re.finditer(r"^Title: (.+)$", existing, re.MULTILINE)}
        print(f"Resume mode: {len(existing_titles)} existing titles loaded")

    # Get all post URLs from CDX
    all_urls = get_all_post_urls()
    if args.limit:
        all_urls = all_urls[: args.limit]

    print(f"Processing {len(all_urls)} posts …\n")

    scraped: list[dict] = []
    failed: list[str] = []

    for i, (orig_url, timestamp) in enumerate(all_urls, 1):
        slug = orig_url.rstrip("/").split("/")[-1]
        print(f"[{i:3}/{len(all_urls)}] {slug[:55]}", end="", flush=True)

        wayback_url = f"{WAYBACK_BASE}/{timestamp}/{orig_url}"
        html = fetch(wayback_url)
        if not html:
            print(" ✗ fetch failed")
            failed.append(orig_url)
            time.sleep(DELAY_SECS)
            continue

        post = parse_post(html, orig_url)
        if not post:
            print(" ✗ parse failed")
            failed.append(orig_url)
            time.sleep(DELAY_SECS)
            continue

        if args.resume and post["title"].lower() in existing_titles:
            print(f" → skip (already exists)")
            time.sleep(0.3)
            continue

        scraped.append(post)
        author_tag = f"[{post['author']}] " if post.get("author") else ""
        print(f" ✓ {author_tag}{len(post['content'])} chars")
        time.sleep(DELAY_SECS)

    print(f"\n─── Done: {len(scraped)} scraped, {len(failed)} failed ───")

    if args.dry_run:
        print("DRY RUN — not writing to ga_context.txt")
        if scraped:
            print("\nSample output (first post):\n")
            print(format_entry(scraped[0])[:800])
        return

    if not scraped:
        print("Nothing to write.")
        return

    # Build new gablog section
    entries = "\n\n".join(format_entry(p) for p in scraped)
    new_section = f"<generative_anthropology_blog>\n{entries}\n</generative_anthropology_blog>"

    # Replace in ga_context.txt
    data = DATA_FILE.read_text(encoding="utf-8")
    start = data.find("<generative_anthropology_blog>")
    end = data.find("</generative_anthropology_blog>")
    if start == -1 or end == -1:
        print("ERROR: Could not find <generative_anthropology_blog> tags in ga_context.txt")
        sys.exit(1)
    end += len("</generative_anthropology_blog>")

    new_data = data[:start] + new_section + data[end:]
    DATA_FILE.write_text(new_data, encoding="utf-8")
    print(f"Wrote {len(scraped)} posts to {DATA_FILE}")

    if failed:
        print(f"\nFailed URLs ({len(failed)}):")
        for u in failed:
            print(f"  {u}")


if __name__ == "__main__":
    main()
