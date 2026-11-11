import Link from 'next/link';

// Standing orientation block shown at the beginning of every reading path
// (generated /begin/p/* paths and the curated /guide/reading-paths/* ones):
// the Lineage situates the authors, Search and Concepts are the two tools a
// reader needs alongside any path.

const LINKS = [
  { href: '/lineage', label: 'The Lineage', hint: 'the writers and the tradition' },
  { href: '/search', label: 'Search', hint: 'the full archive' },
  { href: '/concepts', label: 'Concepts', hint: 'the vocabulary, defined in quotes' },
];

export default function PathOrientation() {
  return (
    <section className="mb-10 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
      <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
        Before you read
      </p>
      <ul className="flex flex-col sm:flex-row gap-2 sm:gap-6">
        {LINKS.map((l) => (
          <li key={l.href} className="text-sm">
            <Link
              href={l.href}
              className="font-medium text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2"
            >
              {l.label}
            </Link>
            <span className="ml-2 text-gray-400 dark:text-gray-500">{l.hint}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
