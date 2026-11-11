import Link from 'next/link';

// Standing orientation block shown at the top of /begin and at the beginning
// of every reading path (generated /begin/p/* and curated
// /guide/reading-paths/*). Bare links by owner direction — no articles, no
// descriptions.

const LINKS = [
  { href: '/lineage', label: 'Lineage' },
  { href: '/search', label: 'Search' },
  { href: '/concepts', label: 'Concepts' },
];

export default function PathOrientation() {
  return (
    <section className="mb-10 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
      <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 text-center">
        Before you read
      </p>
      <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
