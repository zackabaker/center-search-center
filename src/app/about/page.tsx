import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About this archive',
  description: 'Colophon: contents, counts, sources, corpus version, citation format, contact.',
  alternates: { canonical: 'https://center.study/about' },
};

const H = 'text-xl font-semibold mt-10 mb-3 text-gray-900 dark:text-white';
const LI = 'text-gray-700 dark:text-gray-300 leading-relaxed';
const A = 'text-blue-600 dark:text-blue-400 hover:underline';

export default function AboutPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">About this archive</h1>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-8">
        Archive of Adam Katz&rsquo;s Center Study writing; contemporary work published under the pen
        name Dennis Bouvard.
      </p>

      <h2 className={H}>Contents</h2>
      <ul className="list-disc pl-5 space-y-2 max-w-2xl">
        <li className={LI}>~1,969 texts; 5,000,000+ words; 1995&ndash;present.</li>
        <li className={LI}>
          New Substack essays ingested automatically —{' '}
          <Link href="/new" className={A}>what&rsquo;s new</Link>.
        </li>
      </ul>

      <h2 className={H}>Sources</h2>
      <ul className="list-disc pl-5 space-y-2 max-w-2xl">
        <li className={LI}>GABlog essays (Adam Katz).</li>
        <li className={LI}>
          Substack essays (<a href="https://dennisbouvard.substack.com" target="_blank" rel="noopener noreferrer" className={A}>dennisbouvard.substack.com</a>).
        </li>
        <li className={LI}><em>Anthropomorphics</em>{' '}(Imperium Press, 2020).</li>
        <li className={LI}>Academic papers.</li>
        <li className={LI}>Eric Gans, <em>Chronicles of Love and Resentment</em>{' '}(reference material).</li>
        <li className={LI}><em>Anthropoetics</em>{' '}journal (reference material).</li>
      </ul>

      <h2 className={H}>Corpus edition</h2>
      <ul className="list-disc pl-5 space-y-2 max-w-2xl">
        <li className={LI}>Current release: Center Study Corpus v1.0 (2026).</li>
        <li className={LI}>
          Manifest (per-text SHA-256 checksums, dates, word counts):{' '}
          <a href="/corpus-manifest.json" className={A}>/corpus-manifest.json</a>.
        </li>
        <li className={LI}>
          Paragraph anchors: <code className="text-sm">center.study/post/slug#p-37</code>{' '}(¶ mark on each paragraph).
        </li>
      </ul>

      <h2 className={H}>Citation format</h2>
      <blockquote className="border-l-2 border-gray-300 dark:border-gray-600 pl-4 mb-4 max-w-2xl">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Author, &ldquo;Title,&rdquo; original venue, date; in <em>Center Study Corpus</em>{' '}v1.0
          (2026), center.study/post/slug#p-N.
        </p>
      </blockquote>
      <ul className="list-disc pl-5 space-y-2 max-w-2xl">
        <li className={LI}>Chicago and BibTeX: Cite button on each text page.</li>
      </ul>

      <h2 className={H}>Machine access</h2>
      <ul className="list-disc pl-5 space-y-2 max-w-2xl">
        <li className={LI}><Link href="/developers" className={A}>Developer page</Link></li>
        <li className={LI}><a href="/llms.txt" className={A}>llms.txt</a></li>
      </ul>

      <h2 className={H}>Contact</h2>
      <ul className="list-disc pl-5 space-y-2 max-w-2xl">
        <li className={LI}>
          <a href="https://x.com/centerstudy_" target="_blank" rel="noopener noreferrer" className={A}>X: @centerstudy_</a>
        </li>
        <li className={LI}>
          <a href="https://dennisbouvard.substack.com" target="_blank" rel="noopener noreferrer" className={A}>Substack: dennisbouvard.substack.com</a>
        </li>
      </ul>
    </main>
  );
}
