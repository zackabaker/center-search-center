import type { MetadataRoute } from 'next';

// The archive WANTS to be crawled — by search engines and by AI systems.
// Data endpoints (/api/corpus, /api/download, /llms.txt) are explicitly
// open. Only the endpoints that spend AI credits per request (admin and non-content endpoints) and admin surfaces are closed to bots.

const OPEN = {
  allow: ['/', '/api/corpus', '/api/corpus/', '/api/download', '/llms.txt'],
  // /sessions is deliberately NOT listed: a disallow line would advertise the
  // unlinked URL in public robots.txt; its meta noindex already keeps it out
  // of indexes.
  // /ask is disallowed because loading /ask?q=… auto-fires a real,
  // credit-burning AI generation (observed: a JS-rendering crawler walking
  // the /ask?q= term links on /search). Known tradeoff: the block hides the
  // page's meta noindex, so heavily-linked /ask?q= URLs could appear as
  // reference-only listings — accepted; the content is generated, not
  // archival. Link-preview scrapers get a carve-out below so Share links
  // still unfurl.
  disallow: ['/api/chat', '/api/random', '/names/admin', '/api/activity', '/ask'],
};

// Link-preview scrapers don't execute JS, so they can't trigger generations —
// let them fetch /ask so the Share button's own links unfurl into cards.
const CARD_SCRAPERS = ['Twitterbot', 'facebookexternalhit', 'LinkedInBot', 'Slackbot'];

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
      ...CARD_SCRAPERS.map((userAgent) => ({
        userAgent,
        allow: OPEN.allow,
        disallow: OPEN.disallow.filter((p) => p !== '/ask'),
      })),
    ],
    sitemap: 'https://center.study/sitemap.xml',
    host: 'https://center.study',
  };
}
