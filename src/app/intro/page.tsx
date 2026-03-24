import Link from 'next/link';
import DarkModeToggle from '@/components/DarkModeToggle';

export const metadata = {
  title: 'Introduction to Center Study | Center Search Center',
  description:
    'An overview of Center Study, Generative Anthropology, and the originary hypothesis.',
};

export default function IntroPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-6 sm:py-12 overflow-x-hidden">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Search
        </Link>
        <DarkModeToggle />
      </div>

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
          Introduction to Center Study
        </h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            Center Study Overview
          </h2>

          <div className="space-y-5 text-base sm:text-lg leading-relaxed text-gray-800 dark:text-gray-200">
            <p>
              Center Study branches off from Generative Anthropology, which is
              the study of human society and culture in the light of the
              originary hypothesis, formulated by Eric Gans in{' '}
              <em>The Origin of Language</em> (1980; New Edition 2019). The
              originary hypothesis is a hypothesis about the origin of language,
              which is also the origin of the human, religion, community,
              morality, and the sacred.
            </p>

            <p>
              The OH posits that language originates in a gesture, issued in the
              midst of a mimetic crisis in which the entire group of hominids is
              converging on a single object, breaking down the pecking order that
              limits violence in animal groups. This gesture&mdash;a gesture of
              aborted appropriation, or grasping converted into
              pointing&mdash;is the first sign because it is iterable and has a
              referent&mdash;it is &ldquo;symbolic&rdquo; and not merely
              &ldquo;indexical,&rdquo; to use Charles Sanders Peirce&rsquo;s
              categories.
            </p>

            <p>
              Center Study departs from Generative Anthropology by staying
              focused on the enduring nature of the center to any form of human
              organization or sociality. This is initially a ritual, sacrificial
              center, a site of exchange with the animal consumed and deified by
              the group, but the center is eventually seized by a human, first
              of all what anthropologists call the &ldquo;Big Man,&rdquo; but
              then chiefs, sacred kings, emperors, and &ldquo;the state.&rdquo;
            </p>

            <p>
              So center study follows this thread, and &ldquo;reads&rdquo; the
              social order as an effect of the engagement between periphery and
              center. Beyond this, center study is the work of remaking the
              vocabularies of the human sciences in terms of the &ldquo;originary
              grammar&rdquo; first developed in <em>The Origin of Language</em>,
              which traces language from the earliest, ostensive, sign, through
              the imperative, the interrogative and finally the declarative.
            </p>

            <p>
              This means we are always thinking in terms of scenes&mdash;no
              ideas or concepts but on scenes in which some kind of exchange with
              some &ldquo;metaperson&rdquo; is involved. This insistence on
              building a new vocabulary of thinking from the bottom up, so to
              speak, accounts for the stylistic features you refer to, which
              involve resisting familiar phrases and reworking everything in
              terms of center study fundamentals.
            </p>

            <p>
              There is a necessary self-reflexivity here, as we are always
              discussing things from within some scene and therefore
              simultaneously referring, at least implicitly, to that scene (and
              its relation to the center).
            </p>

            <p>
              Politically, this involves a critique of political theories that
              start from the &ldquo;bottom&rdquo; (the free subject, the people,
              etc.) insisting on starting from the center, from where authority
              and an originary distribution is assumed to have taken place and
              set the terms for future distributions and exchanges.
            </p>

            <p className="text-gray-500 dark:text-gray-400 italic">
              So, maybe that&rsquo;s enough for starters. We&rsquo;re always
              ready to take on questions.
            </p>
          </div>
        </section>

        <section className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Explore Further
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/?filter=glossary"
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500 transition-colors no-underline"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Glossary
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Key terms and definitions
              </p>
            </Link>
            <Link
              href="/?filter=substack"
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 transition-colors no-underline"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Center Study Center (Substack)
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The latest essays and explorations
              </p>
            </Link>
            <Link
              href="/?filter=gablog"
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors no-underline"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                GABlog Archive
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The full Generative Anthropology blog archive
              </p>
            </Link>
            <Link
              href="/?filter=book"
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-colors no-underline"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Books &amp; PDFs
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Longer works and published papers
              </p>
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
