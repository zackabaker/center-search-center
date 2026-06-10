import type { MetadataRoute } from 'next';

// The archive WANTS to be crawled — by search engines and by AI systems.
// Data endpoints (/api/corpus, /api/download, /llms.txt) are explicitly
// open. Only the endpoints that spend AI credits per request (/api/chat,
// /api/reading-path) and admin surfaces are closed to bots.

const OPEN = {
  allow: ['/', '/api/corpus', '/api/corpus/', '/api/download', '/llms.txt'],
  disallow: ['/api/chat', '/api/reading-path', '/api/random', '/names/admin'],
};

// AI crawlers, named explicitly so an overly cautious default elsewhere
// never reads as a block. Same permissions as everyone else.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'CCBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
  'cohere-ai',
  'Amazonbot',
  'YouBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', ...OPEN },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, ...OPEN })),
    ],
    sitemap: 'https://center.study/sitemap.xml',
    host: 'https://center.study',
  };
}
