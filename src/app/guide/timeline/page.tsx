import { getAllPosts } from '@/lib/parser';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ContentSource } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Archive Timeline — Introduction to Center Study',
  description: 'The complete Center Study archive in chronological order — as it actually unfolded in time.',
};

const SOURCE_LABELS: Record<ContentSource, string> = {
  substack: 'Substack', gablog: 'GABlog', book: 'Book', pdf: 'PDF', reddit: 'Reddit',
};
const SOURCE_COLORS: Record<ContentSource, string> = {
  substack: 'bg-orange-100 text-orange-700',
  gablog:   'bg-blue-100 text-blue-700',
  book:     'bg-purple-100 text-purple-700',
  pdf:      'bg-green-100 text-green-700',
  reddit:   'bg-red-100 text-red-700',
};

// Concept tags by rough keyword matching — used to label posts
const CONCEPT_KEYWORDS: [string, string][] = [
  ['center', 'The Center'],
  ['originary scene', 'Originary Scene'],
  ['deferral', 'Deferral'],
  ['sacred', 'The Sacred'],
  ['nomos', 'Nomos'],
  ['succession', 'Succession'],
  ['juridical', 'The Juridical'],
  ['debt', 'Debt/Credit'],
  ['scenic design', 'Scenic Design'],
  ['resentment', 'Resentment'],
  ['victimary', 'Victimary'],
  ['imperative', 'Imperative'],
  ['ostensive', 'Ostensive'],
  ['declarative', 'Declarative'],
  ['sovereignty', 'Sovereignty'],
  ['liberalism', 'Liberalism'],
  ['mimesis', 'Mimesis'],
  ['language', 'Language'],
  ['technics', 'Technics'],
];

function getConceptTags(text: string): string[] {
  const lower = text.toLowerCase();
  return CONCEPT_KEYWORDS
    .filter(([kw]) => lower.includes(kw))
    .map(([, label]) => label)
    .slice(0, 4);
}

export default function TimelinePage() {
  const allPosts = getAllPosts();

  // Separate dated and undated
  const dated = allPosts
    .filter((p) => p.date && /^\d{4}/.test(p.date))
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());

  const undated = allPosts.filter((p) => !p.date || !/^\d{4}/.test(p.date));

  // Group dated by year
  const byYear: Record<string, typeof dated> = {};
  for (const post of dated) {
    const year = post.date!.slice(0, 4);
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(post);
  }
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10">
        <Link href="/guide" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">← Introduction</Link>
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mt-4 mb-2">Layer V · Chronological</p>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">Archive Timeline</h1>
        <p className="text-gray-500 leading-relaxed max-w-2xl text-sm">
          Center Study as it actually unfolded — not a static system but a practice in time. {allPosts.length} posts, {dated.length} dated. Read chronologically to watch the concepts develop, complicate, and sharpen.
        </p>
      </div>

      {/* Summary counts */}
      <div className="flex flex-wrap gap-3 mb-8">
        {(Object.entries(SOURCE_LABELS) as [ContentSource, string][]).map(([src, label]) => {
          const count = allPosts.filter((p) => p.source === src).length;
          if (!count) return null;
          return (
            <span key={src} className={`text-xs px-2 py-1 rounded-full ${SOURCE_COLORS[src]}`}>
              {label} · {count}
            </span>
          );
        })}
      </div>

      {/* Dated posts by year */}
      <div className="space-y-10">
        {years.map((year) => (
          <section key={year}>
            <h2 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-3">
              {year}
              <span className="text-sm font-normal text-gray-400">{byYear[year].length} posts</span>
            </h2>
            <div className="space-y-2">
              {byYear[year].map((post) => {
                const tags = getConceptTags(post.title + ' ' + post.excerpt);
                return (
                  <Link
                    key={post.slug}
                    href={`/post/${post.slug}`}
                    className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${SOURCE_COLORS[post.source]}`}>
                        {SOURCE_LABELS[post.source]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-xs text-gray-400 flex-shrink-0">{post.date}</span>
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{post.title}</span>
                      </div>
                      {post.excerpt && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{post.excerpt}</p>
                      )}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        {/* Undated posts */}
        {undated.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-3">
              Undated
              <span className="text-sm font-normal text-gray-400">{undated.length} posts</span>
            </h2>
            <div className="space-y-2">
              {undated
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((post) => {
                  const tags = getConceptTags(post.title + ' ' + post.excerpt);
                  return (
                    <Link
                      key={post.slug}
                      href={`/post/${post.slug}`}
                      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                    >
                      <div className="flex-shrink-0 pt-0.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${SOURCE_COLORS[post.source]}`}>
                          {SOURCE_LABELS[post.source]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{post.title}</span>
                        {post.excerpt && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{post.excerpt}</p>
                        )}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tags.map((tag) => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
            </div>
          </section>
        )}
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100 text-sm">
        <Link href="/search" className="text-blue-500 hover:underline">Search across all {allPosts.length} posts →</Link>
      </div>
    </main>
  );
}
