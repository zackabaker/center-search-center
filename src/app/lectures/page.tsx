import { getAllPosts } from '@/lib/parser';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lecture Series — Center Study Center',
  description: 'Five introductory lectures by Adam Katz for Center Study: Origin, Mimetic, Deferral of Violence, The Center, The Sign.',
};

export const revalidate = 3600;

const LECTURE_DESCRIPTIONS: Record<string, string> = {
  'lecture-origin':
    'Why "origin" is unavoidable as a concept despite the modern prohibition on origins discourse. The French Academy ban, the social sciences, Derrida — and what it means to take originary thinking seriously.',
  'lecture-mimetic':
    'Girard\'s mimesis and its implications: rivalry, resentment, the will to deny imitation. Gans\'s decisive step beyond Girard — how the sign arrests rather than accelerates mimetic conflict.',
  'lecture-deferral-of-violence':
    'Why "deferral" is more minimal than postpone, delay, or adjourn. The concept keeps us inside the scene, within the act itself, in all its contingency. On the horizon of any gesture of deferral.',
  'lecture-the-center':
    'Attention vs. intention. The occupied center and the signifying center. How centrality shapes every thought and action — and what it means to "hear" the command of the center today.',
  'lecture-the-sign':
    'Derrida\'s critique of the sign and Gans\'s resolution. Every word as the Name-of-God. Why "sample" may be a better framing than "sign" — and what this implies for disciplinary knowledge.',
};

export default async function LecturesPage() {
  const posts = getAllPosts();
  const lectures = posts
    .filter((p) => p.slug.startsWith('lecture-'))
    .sort((a, b) => {
      // Sort by lecture number embedded in title ("Lecture N: ...")
      const numA = parseInt(a.title.match(/^Lecture (\d+)/)?.[1] ?? '0', 10);
      const numB = parseInt(b.title.match(/^Lecture (\d+)/)?.[1] ?? '0', 10);
      return numA - numB;
    });

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 sm:py-14">

      {/* Header */}
      <div className="mt-4 mb-10">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="inline-block text-[11px] px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
            Essays &amp; Articles
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Adam Katz</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-snug mb-3">
          Introductory Lectures in Center Study
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-2xl">
          Five lectures that unfold the foundational concepts of Generative Anthropology and Center
          Study in sequence — from the unavoidability of origins through mimesis, deferral,
          the center, and the sign.
        </p>
      </div>

      {/* Adam's introduction to the series */}
      <div className="mb-12 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8">
        <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
          Introduction — Adam Katz
        </p>
        <div className="space-y-4 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            I&rsquo;m planning to focus on concepts that are intrinsic to GA or originary thinking, as well as those given a more specific meaning within GA. While I&rsquo;ll be focusing on &ldquo;basic&rdquo; concepts, and you don&rsquo;t need any prior knowledge of GA to follow the discussions, I wouldn&rsquo;t call it a basic course. You can always define terms, and it&rsquo;s helpful to do so, but that&rsquo;s of limited use in <em>thinking with</em> them, and I want to make it possible for more people to think with these concepts.
          </p>
          <p>
            Each concept we&rsquo;re going to work with solves a particular problem, or resolves some anomaly within some intellectual tradition, and creates a new problematic which sets &ldquo;rules&rdquo; (explicit and tacit) for other inquiries and discussions. Thinking with a concept involves retrieving this problematic-forming &ldquo;property,&rdquo; which is always easily forgotten and buried under conventional usage or in the growing complexity of a field of inquiry. Furthermore, concepts are reshaped through their &ldquo;migrations&rdquo; through other problematics, and thinking through these concepts therefore also means thinking against the grain of other ways of thinking, and thereby &ldquo;inflecting&rdquo; those ways of thinking.
          </p>
          <p>
            It&rsquo;s easy to get into the habit of worrying about &ldquo;convincing&rdquo; people, but what is more important and economical is providing them with a language that helps them address their own questions. Adopting and appropriating another&rsquo;s concepts is a more lasting effect than just &ldquo;agreeing&rdquo; with someone. So, &ldquo;treating&rdquo; these concepts in this way is not something to do so one can then move on to more complex structures, but something that always needs to be part of the process of building those structures.
          </p>
        </div>
      </div>

      {/* Lecture list */}
      <ol className="space-y-0">
        {lectures.map((lecture, i) => {
          // Extract the bare concept title ("Lecture N: Title" → "Title")
          const bareTitle = lecture.title.replace(/^Lecture \d+:\s*/, '');
          const description = LECTURE_DESCRIPTIONS[lecture.slug] ?? lecture.excerpt;
          const isLast = i === lectures.length - 1;

          return (
            <li key={lecture.slug} className="relative flex gap-5">
              {/* Vertical connector line */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 border-2 border-green-300 dark:border-green-700 flex items-center justify-center flex-shrink-0 z-10">
                  <span className="text-xs font-bold text-green-700 dark:text-green-400">{i + 1}</span>
                </div>
                {!isLast && (
                  <div className="w-px flex-1 bg-green-200 dark:bg-green-900/30 my-1" />
                )}
              </div>

              {/* Card */}
              <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-6'}`}>
                <Link
                  href={`/post/${lecture.slug}`}
                  className="group block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-green-300 dark:hover:border-green-700 hover:shadow-sm transition-all p-4 sm:p-5"
                >
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors mb-1.5">
                    {bareTitle}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-500 font-medium group-hover:gap-2 transition-all">
                    Read lecture
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Footer note */}
      <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
          These lectures are included in the full-text archive and can be{' '}
          <Link href="/search?q=lecture" className="text-green-600 dark:text-green-500 hover:underline">
            searched alongside all other texts
          </Link>
          . For a broader introduction to the archive, see the{' '}
          <Link href="/guide/reading-paths" className="text-green-600 dark:text-green-500 hover:underline">
            reading paths
          </Link>
          .
        </p>
      </div>

    </main>
  );
}
