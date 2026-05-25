import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/names/admin'],
      },
    ],
    sitemap: 'https://center.study/sitemap.xml',
    host: 'https://center.study',
  };
}
