'use client';

import { useRouter } from 'next/navigation';

export default function RandomPostButton({ slugs }: { slugs: string[] }) {
  const router = useRouter();

  function handleClick() {
    if (slugs.length === 0) return;
    const slug = slugs[Math.floor(Math.random() * slugs.length)];
    router.push(`/post/${slug}`);
  }

  return (
    <button
      onClick={handleClick}
      className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
    >
      <span className="text-xl">🎲</span>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-900 dark:text-white">Surprise me</p>
        <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">Random post from the archive</p>
      </div>
    </button>
  );
}
