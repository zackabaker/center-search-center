import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About this archive',
  description:
    'What the Center Study Center is, how the corpus was assembled, the machine-verified verbatim-quote discipline behind every definition and answer, and how to cite it.',
  alternates: { canonical: 'https://center.study/about' },
};

const H = 'text-xl font-semibold mt-10 mb-3 text-gray-900 dark:text-white';
const P = 'text-gray-700 dark:text-gray-300 leading-relaxed mb-4 max-w-2xl';

export default function AboutPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">About this archive</h1>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-8">
        The editorial method behind center.study — what the corpus contains, how it is
        verified, versioned, and cited.
      </p>

      <h2 className={H}>What this is</h2>
      <p className={P}>
        The Center Study Center is the archive of Adam Katz&rsquo;s Center Study — his development
        of, and beyond, the Generative Anthropology founded by Eric Gans. Katz publishes
        contemporary work under the pen name Dennis Bouvard. The primary corpus is Katz&rsquo;s
        GABlog and Substack essays, the book <em>Anthropomorphics</em>{' '}(2020), and academic papers;
        Gans&rsquo;s <em>Chronicles of Love and Resentment</em>{' '}and the <em>Anthropoetics</em>{' '}
        journal are included as reference material — citable and fully searchable on request, but
        the archive&rsquo;s positions are Katz&rsquo;s. Together: ~1,969 texts and over five million
        words spanning 1995 to the present. New Substack essays are ingested automatically as they
        are published — see <Link href="/new" className="text-blue-600 dark:text-blue-400 hover:underline">what&rsquo;s new</Link>.
      </p>

      <h2 className={H}>The verbatim discipline</h2>
      <p className={P}>
        The archive&rsquo;s editorial rule is that the texts speak for themselves. Every definition
        on the <Link href="/concepts" className="text-blue-600 dark:text-blue-400 hover:underline">concept and glossary pages</Link>{' '}leads
        with a verbatim quote from the corpus, linked to its source. These quotes are not curated by
        trust alone: each one is <strong className="font-semibold text-gray-900 dark:text-white">machine-verified</strong>{' '}—
        checked character-for-character (after typographic normalization) against the full corpus
        before publication. The same pipeline governs the{' '}
        <Link href="/answers" className="text-blue-600 dark:text-blue-400 hover:underline">answer pages</Link>: quoted passages are
        verified against the corpus, and quotes an AI model has silently &ldquo;smoothed&rdquo; are
        repaired back to the author&rsquo;s exact text — including original typos — before a page ships.
        AI-written synthesis, where it appears, is labeled as such and demoted below the primary sources.
      </p>

      <h2 className={H}>Provenance</h2>
      <p className={P}>
        GABlog texts were recovered from the original blog before it went offline; Substack essays
        ingest from the author&rsquo;s feed; the Chronicles and <em>Anthropoetics</em>{' '}articles come
        from their published editions; book chapters from <em>Anthropomorphics</em>{' '}(Imperium Press,
        2020). Each text page links its original venue where one still exists. Corrections are
        welcome — write via{' '}
        <a href="https://x.com/centerstudy_" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">X</a>{' '}
        or{' '}
        <a href="https://dennisbouvard.substack.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Substack</a>.
      </p>

      <h2 className={H}>Versioning &amp; citation</h2>
      <p className={P}>
        The corpus is published as a versioned edition. The current release is{' '}
        <strong className="font-semibold text-gray-900 dark:text-white">Center Study Corpus v1.0 (2026)</strong>, with a
        machine-readable manifest — per-text SHA-256 checksums, dates, and word counts — at{' '}
        <a href="/corpus-manifest.json" className="text-blue-600 dark:text-blue-400 hover:underline">/corpus-manifest.json</a>.
        Every paragraph of every text has a stable anchor (hover a paragraph and use the ¶ mark to
        copy a link of the form <code className="text-sm">center.study/post/slug#p-37</code>), and every text
        page has a Cite button emitting Chicago and BibTeX referencing the edition. Cite a passage as:
      </p>
      <blockquote className="border-l-2 border-gray-300 dark:border-gray-600 pl-4 mb-4 max-w-2xl">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Author, &ldquo;Title,&rdquo; original venue, date; in <em>Center Study Corpus</em>{' '}v1.0
          (2026), center.study/post/slug#p-N.
        </p>
      </blockquote>

      <h2 className={H}>For machines</h2>
      <p className={P}>
        The archive is built to be read by AI systems as first-class citizens: plain-text views of
        every text, a documented API, full structured data, and open feeds. See{' '}
        <Link href="/developers" className="text-blue-600 dark:text-blue-400 hover:underline">the developer page</Link>{' '}and{' '}
        <a href="/llms.txt" className="text-blue-600 dark:text-blue-400 hover:underline">llms.txt</a>.
      </p>

      <h2 className={H}>Who runs this</h2>
      <p className={P}>
        The archive is maintained with the participation of its authors. It is independent
        of any institution; its commitments are to completeness, verbatim fidelity, and permanence.
      </p>
    </main>
  );
}
