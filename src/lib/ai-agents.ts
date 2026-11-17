// Shared vocabulary for "AI systems" on both sides of the site:
//
//  - user-agents of AI crawlers and agents. They fetch pages without running
//    JavaScript, so the client trackers never see them; src/proxy.ts counts
//    them where the page request arrives. The proxy's matcher repeats these
//    tokens as a static literal (matcher entries can't reference a constant)
//    — keep the two lists in step.
//  - referrer hostnames of AI chat products, classified at read time on
//    /analytics from the hostnames the activity log already stores.

export type AiAgentKind = 'live' | 'search' | 'training';

// Order matters: the specific tokens precede the generic ones they contain.
const FAMILIES: [RegExp, string, AiAgentKind][] = [
  // "live": a person asked the assistant something and it fetched the page
  // right then — a citation in progress.
  [/ChatGPT-User/, 'ChatGPT-User', 'live'],
  [/Claude-User/, 'Claude-User', 'live'],
  [/Perplexity-User/, 'Perplexity-User', 'live'],
  [/MistralAI-User/, 'MistralAI-User', 'live'],
  // "search": indexers behind the assistants' search features.
  [/OAI-SearchBot/, 'OAI-SearchBot', 'search'],
  [/Claude-SearchBot/, 'Claude-SearchBot', 'search'],
  [/PerplexityBot/, 'PerplexityBot', 'search'],
  [/DuckAssistBot/, 'DuckAssistBot', 'search'],
  [/YouBot/, 'YouBot', 'search'],
  // "training": bulk collection for model training.
  [/GPTBot/, 'GPTBot', 'training'],
  [/ClaudeBot|anthropic-ai|Claude-Web/, 'ClaudeBot', 'training'],
  [/meta-externalagent/, 'Meta-AI', 'training'],
  [/Amazonbot/, 'Amazonbot', 'training'],
  [/Bytespider/, 'Bytespider', 'training'],
  [/CCBot/, 'CCBot', 'training'],
  [/cohere-ai/, 'cohere-ai', 'training'],
  [/Diffbot/, 'Diffbot', 'training'],
];

export function aiCrawlerFamily(ua: string | null | undefined): string | null {
  if (!ua) return null;
  for (const [re, name] of FAMILIES) if (re.test(ua)) return name;
  return null;
}

export function aiAgentKind(family: string): AiAgentKind | null {
  return FAMILIES.find(([, name]) => name === family)?.[2] ?? null;
}

const REFERRERS: [RegExp, string][] = [
  [/(^|\.)chatgpt\.com$|(^|\.)chat\.openai\.com$/, 'ChatGPT'],
  [/(^|\.)perplexity\.ai$/, 'Perplexity'],
  [/(^|\.)claude\.ai$/, 'Claude'],
  [/^gemini\.google\.com$/, 'Gemini'],
  [/^copilot\.microsoft\.com$/, 'Copilot'],
  [/(^|\.)deepseek\.com$/, 'DeepSeek'],
  [/(^|\.)grok\.com$|^x\.ai$/, 'Grok'],
  [/(^|\.)meta\.ai$/, 'Meta AI'],
  [/(^|\.)you\.com$/, 'You.com'],
  [/(^|\.)phind\.com$/, 'Phind'],
];

/** True for a product name aiReferrer() can return ("ChatGPT", "Claude"…). */
export const isAiProduct = (name: string): boolean => REFERRERS.some(([, n]) => n === name);

/** The AI product a referrer hostname belongs to, or null. */
export function aiReferrer(host: string | null | undefined): string | null {
  if (!host) return null;
  const h = host.toLowerCase();
  for (const [re, name] of REFERRERS) if (re.test(h)) return name;
  return null;
}
