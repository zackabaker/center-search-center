import { getAllPosts } from '@/lib/parser';
import { CONCEPTS } from '@/data/guide/concepts';
import { READING_PATHS } from '@/data/guide/reading-paths';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://center.study';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/intro`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/ask`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/guide`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/guide/concepts`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/guide/reading-paths`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/guide/map`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/concepts`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/stats`, changeFrequency: 'weekly', priority: 0.4 },
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

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/post/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : new Date('2024-01-01'),
    changeFrequency: 'yearly' as const,
    priority: p.source === 'substack' ? 0.7 : 0.5,
  }));

  return [...staticRoutes, ...conceptRoutes, ...pathRoutes, ...postRoutes];
}
