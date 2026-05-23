// Shown instantly while the post page renders server-side.
// Instead of a blank skeleton, show a rotating passage from the archive
// so there's something worth reading while waiting.

const LOADING_QUOTES = [
  {
    text: 'We are beings bound to the center: everything that we say, think or do is homage to the center.',
    source: 'Anthropomorphics',
  },
  {
    text: 'The originary hypothesis repels the kind of initiatory revelatory "download" that is nevertheless the only way of understanding it.',
    source: 'Anthropomorphics',
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
    source: 'GABlog',
  },
  {
    text: 'The sign defers the violence of appropriation by substituting representation for the act. This is why language is the deferral of violence — not metaphorically, not morally, but structurally.',
    source: 'Anthropomorphics',
  },
  {
    text: 'Resentment is the specifically human emotion — appetite transformed by prohibition into something that persists even after the object is obtained.',
    source: 'GABlog',
  },
  {
    text: 'The human is that being who is a greater danger to himself than is posed by any external danger — and who requires, therefore, a center that can hold.',
    source: 'Anthropomorphics',
  },
  {
    text: 'Succession is the central political problem: how authority passes from one center-occupant to the next without collapsing into the mimetic violence the center was always meant to defer.',
    source: 'GABlog',
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
    <main className="max-w-3xl mx-auto px-4 py-6 sm:py-12">
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
