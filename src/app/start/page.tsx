import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Here | Center Study Center',
  description:
    'New to Center Study? A short guided path: the core idea, the lineage from Girard to Gans to Katz, and the handful of essays to read first.',
};

const GATEWAY = [
  {
    step: '01',
    title: 'Origin and Hypothesis',
    slug: 'anthropomorphics-origin-and-hypothesis',
    source: 'Anthropomorphics',
    why: 'The founding move, stated plainly: how the aborted gesture becomes the first sign, and where Girard’s account stops short.',
  },
  {
    step: '02',
    title: 'The Use of a Center',
    slug: 'anthropomorphics-the-use-of-a-center',
    source: 'Anthropomorphics',
    why: 'The single concept everything else hangs on — what a center is, and why every social scene has one.',
  },
  {
    step: '03',
    title: 'The Prospects of the Hypothesis',
    slug: 'the-prospects-of-the-hypothesis',
    source: 'Bouvard Substack',
    why: 'What the hypothesis can actually do — the capacity to scale from individual desire to geopolitics.',
  },
  {
    step: '04',
    title: 'There Is No Economy but Only the Debt to the Center',
    slug: 'there-is-no-economy-pdf',
    source: 'Anthropoetics',
    why: 'The framework applied end to end: money and capital read as the debt to the center.',
  },
];

const EXPLORE = [
  { label: 'Ask AI', href: '/ask', desc: 'Put any question to the full corpus and get an answer grounded in direct quotes.' },
  { label: 'Search', href: '/search', desc: 'Find a passage by phrase, concept, or even its opening sentence.' },
  { label: 'Browse the archive', href: '/browse', desc: 'All 1,900+ texts — blog, essays, the book, journal articles, threads.' },
  { label: 'Reading paths', href: '/guide/reading-paths', desc: 'Curated sequences through specific themes.' },
];

export default function StartPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">New here</p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
        Start Here
      </h1>
      <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-2xl">
        Center Study is the most developed branch of Generative Anthropology — a way of reading every
        social order, from language to money to institutions, as an effect of the relation between a
        community and its center. If you&rsquo;re new, don&rsquo;t start in the search box. Take this path.
      </p>

      {/* Step 1: orient */}
      <section className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">First, get oriented</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/intro" className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">The originary scene</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">How language, the sacred, and community begin together — and the center through history.</p>
          </Link>
          <Link href="/lineage" className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">The lineage: Girard &rarr; Gans &rarr; Katz</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">Where the ideas come from, told in the authors&rsquo; own words.</p>
          </Link>
          <Link href="/faq" className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900 sm:col-span-2">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Questions &amp; objections</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">What newcomers ask, and the standard objections — is it falsifiable? how does it differ from Girard and from GA? — answered in the discourse&rsquo;s own words.</p>
          </Link>
        </div>
      </section>

      {/* Step 2: read these first */}
      <section className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">Then read these four</p>
        <div className="space-y-2.5">
          {GATEWAY.map((g) => (
            <Link
              key={g.slug}
              href={`/post/${g.slug}`}
              className="group flex gap-4 items-start p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
            >
              <span className="text-sm font-mono text-gray-300 dark:text-gray-600 pt-0.5 flex-shrink-0">{g.step}</span>
              <span className="min-w-0">
                <span className="block font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">{g.title}</span>
                <span className="block text-[11px] font-medium text-gray-400 dark:text-gray-500 mt-0.5">{g.source}</span>
                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{g.why}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Step 3: explore */}
      <section>
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">Then explore on your own</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {EXPLORE.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="group block p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
            >
              <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{e.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{e.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
