import { getAllPosts } from '@/lib/parser';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const baseUrl = 'https://centersearchcenter.com';

  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date('2024-01-01'),
    changeFrequency: 'monthly' as const,
    priority: post.source === 'substack' ? 0.8 : 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...postEntries,
  ];
}
