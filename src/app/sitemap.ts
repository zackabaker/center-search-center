import { getPublicPosts } from '@/lib/parser';
import { CONCEPTS } from '@/data/guide/concepts';
import { READING_PATHS } from '@/data/guide/reading-paths';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://center.study';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublicPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                          lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/intro`,               changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/ask`,                 changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/search`,              changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/guide`,               changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/guide/concepts`,      changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/guide/reading-paths`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/guide/map`,           changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/concepts`,            changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE_URL}/browse`,              changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/browse/gablog`,       changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/browse/substack`,     changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/browse/pdf`,          changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/browse/book`,          changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/browse/chronicle`,    changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/browse/ap`,           changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/author/katz`,         changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/author/bouvard`,      changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/lectures`,            changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/stats`,               changeFrequency: 'weekly',  priority: 0.3 },
  ];

  const conceptRoutes: MetadataRoute.Sitemap = CONCEPTS.map((c) => ({
    url: `${BASE_URL}/guide/concepts/${c.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
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
  };

  const fallbackDate = new Date('2024-01-01');
  const safeDate = (dateStr: string | null): Date => {
    if (!dateStr) return fallbackDate;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? fallbackDate : d;
  };

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/post/${p.slug}`,
    lastModified: safeDate(p.date),
    changeFrequency: 'yearly' as const,
    priority: SOURCE_PRIORITY[p.source] ?? 0.6,
  }));

  return [...staticRoutes, ...conceptRoutes, ...pathRoutes, ...postRoutes];
}
