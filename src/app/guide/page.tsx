import Link from 'next/link';
import type { Metadata } from 'next';
import { CONCEPTS } from '@/data/guide/concepts';
import { READING_PATHS } from '@/data/guide/reading-paths';

export const metadata: Metadata = {
  title: 'Guide | Center Study Center',
  description: 'How to use Center Study Center — the archive, search, Ask, concepts, and reading paths.',
};

export default function GuidePage() {
  const coreConceptSlugs = ['the-center', 'originary-scene', 'deferral', 'ostensive-imperative-declarative', 'the-sacred'];
  const coreConcepts = coreConceptSlugs.map((s) => CONCEPTS.find((c) => c.slug === s)!).filter(Boolean);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 sm:py-16">

      <header className="mb-14">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-6 text-gray-900 dark:text-white">
          How to Use This Site
        </h1>
        <div className="max-w-none space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            Center Study Center is a searchable archive of texts by Eric Gans, Adam Katz, and Dennis Bouvard
            — the GABlog, the Center Study Center Substack, academic PDFs, the book{' '}
            <em>Anthropomorphics</em>, and Reddit discussions from r/Absolutistneoreaction.
            Together they form the primary corpus of Center Study and Generative Anthropology available in one place.
          </p>
          <p>
            New to Center Study? Start with the{' '}
            <Link href="/intro" className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-white transition-colors">Introduction</Link>.
            Already familiar? Use the search bar, browse by source, or ask the archive a question.
            The sections below explain what each part of the site does.
          </p>
        </div>
      </header>

      {/* The Archive */}
      <section className="mb-12">
        <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-5">The Archive</h2>
        <div className="space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            The home page is organized around search and curated entry points. Use{' '}
            <Link href="/search" className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-white transition-colors">Search</Link>{' '}
            to find texts by keyword or phrase, or{' '}
            <Link href="/browse/gablog" className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-white transition-colors">browse by source</Link>{' '}
            to see the full archive for a given collection. The{' '}
            <Link href="/guide/timeline" className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-white transition-colors">Timeline</Link>{' '}
            shows all dated posts in chronological order.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Full-text search</strong> (press{' '}
            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">⌘K</kbd>{' '}
            or{' '}
            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">Ctrl K</kbd>)
            runs across titles and full content in real time. Results are ranked by relevance,
            filtered by source, and show context snippets with highlighted matches.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            {[
              { label: 'GABlog', desc: 'Adam Katz\'s theoretical blog — the main site of originary grammar in development', href: '/browse/gablog', color: 'hover:border-blue-400 dark:hover:border-blue-500' },
              { label: 'Substack', desc: 'Dennis Bouvard\'s applied essays on AI, governance, money, language, and technology', href: '/browse/substack', color: 'hover:border-orange-400 dark:hover:border-orange-500' },
              { label: 'PDFs', desc: 'Academic papers and longer works by Katz, Gans, and collaborators', href: '/browse/pdf', color: 'hover:border-green-400 dark:hover:border-green-500' },
              { label: 'Book', desc: 'Anthropomorphics — a systematic originary grammar of the center', href: '/browse/book', color: 'hover:border-purple-400 dark:hover:border-purple-500' },
            ].map(({ label, desc, href, color }) => (
              <Link
                key={href}
                href={href}
                className={`block p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${color} transition-colors bg-white dark:bg-gray-900`}
              >
                <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ask */}
      <section className="mb-12">
        <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-5">Ask</h2>
        <div className="space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            The <Link href="/ask" className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-white transition-colors">Ask</Link> page
            lets you put a question directly to the archive. Type any question — about a concept,
            a topic, a passage — and the model synthesizes an answer from the full corpus,
            with citations linking back to specific posts. Questions accumulate in a conversation;
            you can follow up, push back, or ask the model to elaborate.
          </p>
          <p>
            Ask is best for: working through a concept you have encountered but do not yet have
            handles on; finding how a topic (sovereignty, money, AI, resentment) is treated
            across sources; generating a first orientation before reading into the archive directly.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              'What is the originary scene?',
              'How does Center Study analyze money and debt?',
              'What is the victimary?',
              'How does GA differ from Girard?',
            ].map(q => (
              <Link
                key={q}
                href={`/ask?q=${encodeURIComponent(q)}`}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-all bg-white dark:bg-gray-900"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Concepts */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest">Concepts</h2>
          <Link href="/guide/concepts" className="text-xs text-blue-500 hover:underline">All {CONCEPTS.length} concepts →</Link>
        </div>
        <div className="space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-5">
          <p>
            The <Link href="/guide/concepts" className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-white transition-colors">Concepts</Link> section
            gives each core term in the Center Study vocabulary its own page: an originary definition,
            how the concept develops across the archive, and links to the texts where it is most fully worked out.
            Five to start with:
          </p>
        </div>
        <div className="space-y-3">
          {coreConcepts.map((concept) => (
            <Link
              key={concept.slug}
              href={`/guide/concepts/${concept.slug}`}
              className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1">
                  {concept.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{concept.definition}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 group-hover:text-blue-400 transition-colors mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* Reading Paths */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest">Reading Paths</h2>
          <Link href="/guide/reading-paths" className="text-xs text-blue-500 hover:underline">All paths →</Link>
        </div>
        <div className="space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-5">
          <p>
            <Link href="/guide/reading-paths" className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-white transition-colors">Reading Paths</Link> are
            curated sequences through the archive — ordered, with brief notes on each text explaining
            what it does for the reader on that path. Each path is built around a question or domain:
            how to start from scratch, how to approach language, how to think about sovereignty or technology.
            The AI-powered path finder can also generate a personalized sequence based on your interests.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {READING_PATHS.slice(0, 4).map((path) => (
            <Link
              key={path.slug}
              href={`/guide/reading-paths/${path.slug}`}
              className="group block p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{path.posture}</span>
                <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
                <span className="text-[10px] text-gray-400">{path.posts.length} texts</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1 text-sm">{path.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{path.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Reading individual posts */}
      <section className="mb-12">
        <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-5">Reading Posts</h2>
        <div className="space-y-3 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            Each post page shows the full text with a reading progress bar, estimated reading time,
            and word count. You can bookmark posts for later, copy a citation in APA or MLA format,
            share a direct link, or open the original source. Related posts appear at the bottom,
            drawn from the same source and topic area.
          </p>
          <p>
            The <strong className="text-gray-900 dark:text-white">Annotations</strong> panel on each
            post lets you add private notes tied to that text — stored locally in your browser,
            not on a server.
          </p>
        </div>
      </section>

      {/* Closing note */}
      <section className="border-t border-gray-100 dark:border-gray-800 pt-10">
        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-3 leading-relaxed">
          <p>
            The archive is the primary thing. This site is a set of tools for entering it —
            search, Ask, concepts, and reading paths are all ways of approaching the same body of work
            from different angles. The best approach depends on where you are:
            a complete newcomer will find the Introduction and a reading path useful;
            someone already inside the discourse will reach for search and Ask.
          </p>
          <p>
            Questions about the archive or suggestions for the site?{' '}
            <Link href="/ask" className="text-blue-400 hover:underline">Ask the archive →</Link>
          </p>
        </div>
      </section>

    </main>
  );
}
