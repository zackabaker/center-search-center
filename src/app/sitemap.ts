import { getPublicPosts } from '@/lib/parser';
import { CONCEPTS } from '@/data/guide/concepts';
import { GLOSSARY } from '@/data/guide/glossary';
import { READING_PATHS } from '@/data/guide/reading-paths';
import { parsePostDate } from '@/lib/dates';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://center.study';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublicPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                          lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/generative-anthropology`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE_URL}/start`,               changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/begin`,               changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/avalon`,              changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/about`,               changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/developers`,          changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq`,                 changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/lineage`,             changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/anthropomorphics`,    changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/companies`,           changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/download`,            changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/verify`,              changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/search`,              changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/new`,                 changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE_URL}/trending`,            changeFrequency: 'daily',   priority: 0.6 },
    { url: `${BASE_URL}/guide`,               changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/guide/reading-paths`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/concepts`,            changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/concepts/glossary`,   changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/browse`,              changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/browse/gablog`,       changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/browse/substack`,     changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/browse/pdf`,          changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/browse/book`,          changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/browse/chronicle`,    changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/browse/ap`,           changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/browse/threads`,      changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/browse/all`,          changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE_URL}/author/katz`,         changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/author/bouvard`,      changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/author/gans`,         changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/lectures`,            changeFrequency: 'monthly', priority: 0.6 },
  ];

  const conceptRoutes: MetadataRoute.Sitemap = CONCEPTS.map((c) => ({
    url: `${BASE_URL}/guide/concepts/${c.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Canonical glossary-term pages (concept-linked terms 308 to their hub, so
  // only standalone terms are listed).
  const termRoutes: MetadataRoute.Sitemap = GLOSSARY.filter((e) => !e.concept).map((e) => ({
    url: `${BASE_URL}/guide/glossary/${e.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Quote pages (/q/<id>) are deliberately NOT in the sitemap any more: 961
  // thin stubs duplicating post content dragged the whole site's quality
  // signal down (Search Console: indexed pages collapsed to ~100 while
  // "crawled — currently not indexed" grew past 1,900). They stay live as
  // share permalinks; they just aren't advertised to crawlers, and the pages
  // themselves are noindex,follow.

  const pathRoutes: MetadataRoute.Sitemap = READING_PATHS.map((p) => ({
    url: `${BASE_URL}/guide/reading-paths/${p.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const SOURCE_PRIORITY: Record<string, number> = {
    substack: 0.9,
    book:     0.85,
    gablog:   0.8,
    pdf:      0.65,
  };

  // Only the Katz core goes in the sitemap. The Chronicles/AP reprints and
  // reddit/X thread captures are noindex,follow (duplicates of content whose
  // originals live elsewhere) — advertising ~1,300 of them to Google buried
  // the ~700 pages that should rank. See the coverage collapse note above.
  const CORE_SOURCES = new Set(['substack', 'gablog', 'book', 'pdf']);

  // parsePostDate handles Chronicle-style "July 6th, 1995" ordinals that
  // Date.parse rejects — without it posts fell back to a fake date.
  const fallbackDate = new Date('2024-01-01');
  const safeDate = (dateStr: string | null): Date => parsePostDate(dateStr) ?? fallbackDate;

  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => CORE_SOURCES.has(p.source))
    .map((p) => ({
      url: `${BASE_URL}/post/${p.slug}`,
      lastModified: safeDate(p.date),
      changeFrequency: 'yearly' as const,
      priority: SOURCE_PRIORITY[p.source] ?? 0.6,
    }));

  return [...staticRoutes, ...conceptRoutes, ...termRoutes, ...pathRoutes, ...postRoutes];
}
