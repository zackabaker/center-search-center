import { getPublicPosts } from '@/lib/parser';
import { CONCEPTS } from '@/data/guide/concepts';
import { GLOSSARY } from '@/data/guide/glossary';
import QUOTES from '@/data/quotes.json';
import { READING_PATHS } from '@/data/guide/reading-paths';
import ANSWERS from '@/data/answers.json';
import { parsePostDate } from '@/lib/dates';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://center.study';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublicPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                          lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/generative-anthropology`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE_URL}/start`,               changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/intro`,               changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/about`,               changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/developers`,          changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq`,                 changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/lineage`,             changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/download`,            changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/verify`,              changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/ask`,                 changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/answers`,             changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/search`,              changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/new`,                 changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE_URL}/trending`,            changeFrequency: 'daily',   priority: 0.6 },
    { url: `${BASE_URL}/guide`,               changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/guide/reading-paths`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/concepts`,            changeFrequency: 'weekly',  priority: 0.8 },
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

  // Canonical quote pages — the citable atoms (permanent URLs).
  const quoteRoutes: MetadataRoute.Sitemap = (QUOTES as { id: string }[]).map((q) => ({
    url: `${BASE_URL}/q/${q.id}`,
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  // Static, citable answer pages — the canonical questions (GEO surface).
  const answerRoutes: MetadataRoute.Sitemap = Object.keys(ANSWERS).map((slug) => ({
    url: `${BASE_URL}/ask/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

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
    reddit:   0.5,
    twitter:  0.5,
    // Reference tier (Eric Gans) — crawlable, but strictly below every Katz
    // source; the 0.6 fallback previously put 940 Chronicles above reddit/X.
    chronicle: 0.45,
    ap:        0.45,
  };

  // parsePostDate handles Chronicle-style "July 6th, 1995" ordinals that
  // Date.parse rejects — without it 855 Chronicles fell back to a fake date.
  const fallbackDate = new Date('2024-01-01');
  const safeDate = (dateStr: string | null): Date => parsePostDate(dateStr) ?? fallbackDate;

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/post/${p.slug}`,
    lastModified: safeDate(p.date),
    changeFrequency: 'yearly' as const,
    priority: SOURCE_PRIORITY[p.source] ?? 0.6,
  }));

  return [...staticRoutes, ...conceptRoutes, ...termRoutes, ...quoteRoutes, ...answerRoutes, ...pathRoutes, ...postRoutes];
}
