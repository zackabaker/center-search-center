import { getAllPosts } from '@/lib/parser';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import GoBack from '@/components/GoBack';
import type { ContentSource } from '@/lib/types';

import type { Post } from '@/lib/types';

interface AuthorProfile {
  name: string;
  altName?: string;
  bio: string;
  // Which posts belong to this author. Either by source (the whole corpus is
  // Katz's) or by an explicit byline match (co-authored work).
  selectPosts: (all: Post[]) => Post[];
  sources: ContentSource[];
  links: { label: string; href: string }[];
  /** Reference-tier author — work hosted as source material, not the archive's own voice. */
  tier?: 'reference';
}

// Unified author: Adam Katz writes as himself (GABlog, Essays, Book)
// and as Dennis Bouvard (Substack, Threads). Both names → same page.
const KATZ: AuthorProfile = {
  name: 'Adam Katz',
  altName: 'Dennis Bouvard',
  bio: 'Adam Katz is the author of Center Study. He develops originary grammar across the GABlog (~480 posts since 2007), academic essays and articles, and the book Anthropomorphics. He also writes applied essays on AI, governance, and contemporary politics on Substack under the pen name Dennis Bouvard.',
  sources: ['gablog', 'pdf', 'book', 'substack', 'reddit', 'twitter'] as ContentSource[],
  selectPosts: (all) =>
    all.filter((p) => (['gablog', 'pdf', 'book', 'substack', 'reddit', 'twitter'] as string[]).includes(p.source)),
  links: [
    { label: 'GABlog', href: '/browse/gablog' },
    { label: 'Substack', href: '/browse/substack' },
    { label: 'Essays & Articles', href: '/browse/pdf' },
    { label: 'Threads & Q&A', href: '/browse/threads' },
  ],
};

// Zack Baker — co-author with Adam Katz of "There Is No Economy…" and the
// builder of the Center Study archive. His page collects the work he is
// credited on (matched by byline).
const BAKER: AuthorProfile = {
  name: 'Zack Baker',
  bio: 'Zack Baker is the co-author, with Adam Katz, of “There Is No Economy but Only the Debt to the Center: Money, Capital and the Tributary” (Anthropoetics XXVIII, no. 2, Spring 2023), and the builder of the Center Study archive.',
  sources: ['pdf'] as ContentSource[],
  // Matched by byline. The essay exists in two source-copies (our clean reading
  // copy under `pdf` and the raw Anthropoetics-journal copy under `ap`); show
  // only the canonical `pdf` one so the work isn't listed twice.
  selectPosts: (all) => all.filter((p) => /\bzack baker\b/i.test(p.author ?? '') && p.source !== 'ap'),
  links: [{ label: 'Essays & Articles', href: '/browse/pdf' }],
};

// Eric Gans — founder of Generative Anthropology. His "Chronicles of Love and
// Resentment" (the chronicle source) anchor the field center.study extends.
const GANS: AuthorProfile = {
  name: 'Eric Gans',
  bio: 'Eric Gans is the founder of Generative Anthropology and the originary hypothesis, introduced in The Origin of Language (1981). A student of René Girard, he founded the journal Anthropoetics in 1995 and has written the "Chronicles of Love and Resentment" for over two decades. Center Study develops out of his work.',
  sources: ['chronicle', 'ap'] as ContentSource[],
  selectPosts: (all) => all.filter((p) => p.source === 'chronicle' || /\beric gans\b/i.test(p.author ?? '')),
  links: [
    { label: 'Chronicles of Love and Resentment', href: '/browse/chronicle' },
    { label: 'Anthropoetics Journal', href: '/browse/ap' },
  ],
  tier: 'reference',
};

const PROFILES: Record<string, AuthorProfile> = { katz: KATZ, baker: BAKER, gans: GANS };

const SOURCE_LABELS: Record<ContentSource, string> = {
  substack:  'Substack',
  gablog:    'GABlog',
  book:      'Anthropomorphics',
  pdf:       'Essays & Articles',
  reddit:    'Reddit',
  twitter:   'X / Twitter',
  chronicle: 'Chronicles of Love and Resentment',
  ap:        'Anthropoetics Journal',
};

const SOURCE_COLORS: Record<ContentSource, string> = {
  substack:  'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  gablog:    'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  book:      'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  pdf:       'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  reddit:    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  twitter:   'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300',
  chronicle: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  ap:        'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
};

const SOURCE_PEN_NAME: Partial<Record<ContentSource, string>> = {
  substack: 'as Dennis Bouvard',
  reddit:   'as Dennis Bouvard',
  twitter:  'as Dennis Bouvard',
};

const REDIRECT_HANDLES = ['bouvard', 'katz-bouvard'];
const VALID_HANDLES = [...Object.keys(PROFILES), ...REDIRECT_HANDLES];

export async function generateStaticParams() {
  return VALID_HANDLES.map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  if (REDIRECT_HANDLES.includes(name) || name === 'katz') {
    return {
      title: 'Adam Katz (Dennis Bouvard)',
      description: KATZ.bio,
      alternates: { canonical: 'https://center.study/author/katz' },
    };
  }
  const profile = PROFILES[name];
  if (!profile) return { title: 'Author not found' };
  return {
    title: profile.name,
    description: profile.bio,
    alternates: { canonical: `https://center.study/author/${name}` },
  };
}

export const revalidate = 3600;

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  // Canonicalize — bouvard and katz-bouvard redirect to katz
  if (REDIRECT_HANDLES.includes(name)) {
    redirect('/author/katz');
  }

  const profile = PROFILES[name];
  if (!profile) notFound();

  const allPosts = getAllPosts();

  const posts = profile
    .selectPosts(allPosts)
    .sort((a, b) => {
      if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (a.date) return -1;
      if (b.date) return 1;
      return a.title.localeCompare(b.title);
    });

  // Group by source in the order we care about
  const bySource: [ContentSource, typeof posts][] = profile.sources
    .map((src) => [src, posts.filter((p) => p.source === src)] as [ContentSource, typeof posts])
    .filter(([, ps]) => ps.length > 0);

  const totalCount = posts.length;

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `https://center.study/author/${name}`,
    name: profile.name,
    ...(profile.altName ? { alternateName: profile.altName } : {}),
    description: profile.bio,
    url: `https://center.study/author/${name}`,
  };

  return (
    <main className="max-w-4xl w-full mx-auto px-4 pt-8 pb-24 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }} />
      <div className="mb-6">
        <GoBack fallback="/browse" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors text-sm" />
      </div>

      {/* Author header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">
          {profile.name}
        </h1>
        {profile.tier === 'reference' && (
          <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
            Reference author — center.study is the Adam Katz archive; this work is hosted as source material
          </p>
        )}
        {profile.altName && (
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">
            also writes as <span className="text-gray-600 dark:text-gray-300 font-medium">{profile.altName}</span>
          </p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mb-5">
          {profile.bio}
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
            {totalCount.toLocaleString()} {totalCount === 1 ? 'text' : 'texts'}
          </span>
          {profile.links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Browse {l.label} →
            </Link>
          ))}
        </div>
      </div>

      {/* Posts grouped by source */}
      {bySource.map(([source, sourcePosts]) => (
        <section key={source} className="mb-10">
          <div className="flex items-baseline gap-3 mb-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {SOURCE_LABELS[source]}
            </h2>
            {SOURCE_PEN_NAME[source] && (
              <span className="text-xs text-gray-400 dark:text-gray-500 italic">{SOURCE_PEN_NAME[source]}</span>
            )}
            <span className="text-xs text-gray-400 dark:text-gray-500">{sourcePosts.length}</span>
          </div>
          <div className="space-y-px">
            {sourcePosts.slice(0, 100).map((post) => (
              <Link
                key={post.slug}
                href={`/post/${post.slug}`}
                className="group flex items-start gap-3 py-2.5 min-h-[44px] border-b border-gray-50 dark:border-gray-800/60 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900/40 -mx-2 px-2 rounded transition-colors"
              >
                {post.date && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 w-20 flex-shrink-0 tabular-nums pt-0.5">
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </span>
                )}
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 mt-0.5 ${SOURCE_COLORS[post.source]}`}>
                  {SOURCE_LABELS[post.source]}
                </span>
                <span className="text-sm text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug flex-1 min-w-0">
                  {post.title}
                </span>
              </Link>
            ))}
            {sourcePosts.length > 100 && (
              <Link
                href={`/browse/${source === 'reddit' || source === 'twitter' ? 'threads' : source}`}
                className="block pt-3 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              >
                + {sourcePosts.length - 100} more — browse all →
              </Link>
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
