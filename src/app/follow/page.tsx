import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Follow Center Study | Center Study Center',
  description: 'Follow Center Study on X for new writing and notes — or get new essays by email.',
};

export default function FollowPage() {
  return (
    <main className="max-w-xl w-full mx-auto px-4 pt-10 pb-24 sm:py-16">
      <Link href="/" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
        ← Archive
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-4 mb-3 text-gray-900 dark:text-white">
        Follow along
      </h1>
      <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-md">
        New writing, notes, and threads — most of it goes out on X first. That&rsquo;s the best place to
        keep up.
      </p>

      {/* Primary: X */}
      <a
        href="https://x.com/centerstudy_"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Follow @centerstudy_ on X
      </a>

      {/* Secondary, quieter: email via the Substack */}
      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
          Or by email
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 max-w-md">
          Prefer your inbox? New essays go out through the Substack — subscribe there.
        </p>
        <iframe
          src="https://dennisbouvard.substack.com/embed"
          title="Subscribe by email"
          width="100%"
          height="150"
          loading="lazy"
          style={{ border: '1px solid #e5e7eb', borderRadius: 12, background: 'white', maxWidth: 480 }}
          frameBorder={0}
          scrolling="no"
        />
      </div>
    </main>
  );
}
