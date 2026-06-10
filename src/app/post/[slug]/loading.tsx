// Shown instantly while the post page renders server-side.
// Instead of a blank skeleton, show a rotating passage from the archive
// so there's something worth reading while waiting.
//
// EVERY quote below is verified VERBATIM against the corpus (normalized
// for curly quotes/dashes only) and attributed to the actual text it
// appears in. Do not add quotes here without checking them against
// posts-cache.json word for word.

const LOADING_QUOTES = [
  {
    text: 'We are beings bound to the center: everything that we say, think or do is homage to the center.',
    source: 'The Discourse of the Center',
  },
  {
    text: 'The originary hypothesis repels the kind of initiatory revelatory "download" that is nevertheless the only way of understanding it.',
    source: 'Originary Hypothesis as Mobius Strip',
  },
  {
    text: 'What is a center? Whatever can invoke and be referenced by an ostensive sign: the center is both cause and product of the sign — as cause it subsists beyond any particular reference, and as product it is continually renewed.',
    source: 'Anthropomorphics',
  },
  {
    text: 'The very operation of all the institutions of information production and provision presupposes an unwavering orientation toward the central authority, regardless of how decentralized things seem.',
    source: 'Event, Origin, Center',
  },
  {
    text: 'A center establishes a hierarchy — at the very least between center and margin. But every other hierarchy is modeled on the hierarchy between center and margin: hierarchies are only possible if there is a center.',
    source: 'Anthropomorphics',
  },
  {
    text: 'All human existence is an exchange with the center. The first message from the center is to defer appropriation.',
    source: 'How Does the Center Speak?',
  },
  {
    text: 'The center is whatever interferes with violent centralization.',
    source: 'Revivalistics',
  },
  {
    text: 'There is always a center whenever humans are arranged in relation to each other, and the center is always occupied, even if only by a sacred carcass.',
    source: 'Scale',
  },
  {
    text: 'The human is that being who is a greater danger to himself than is posed by any external danger.',
    source: 'The Prospects of the Hypothesis',
  },
  {
    text: 'The real danger to our species is the same danger that it came into being to defer: intraspecific violence and the form it assumes in deferral, resentment.',
    source: 'The Clash of the Clash of Civilizations',
  },
];

// Pick a quote deterministically per minute so it changes slowly but consistently
function getQuote() {
  const minuteIndex = Math.floor(Date.now() / 60000);
  return LOADING_QUOTES[minuteIndex % LOADING_QUOTES.length];
}

export default function PostLoading() {
  const quote = getQuote();

  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-6 sm:py-12">
      {/* Top nav skeleton */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="h-9 w-28 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div className="h-8 w-20 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>

      {/* Title skeleton */}
      <div className="space-y-2 mb-10">
        <div className="h-4 w-24 rounded bg-gray-100 dark:bg-gray-800 animate-pulse mb-4" />
        <div className="h-8 w-4/5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="h-8 w-3/5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>

      {/* Quote while loading */}
      <div className="my-10 border-l-2 border-gray-200 dark:border-gray-700 pl-5">
        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed italic mb-3">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600">
          — {quote.source}
        </p>
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        {[100, 90, 95, 85, 92, 78].map((w, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" style={{ width: `${w}%` }} />
            <div className="h-4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" style={{ width: `${w - 8}%` }} />
            {i % 2 === 0 && (
              <div className="h-4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" style={{ width: `${w - 20}%` }} />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
