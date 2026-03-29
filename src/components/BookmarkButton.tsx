'use client';
import { useReadingList, SavedPost } from '@/hooks/useReadingList';

export default function BookmarkButton({ post }: { post: SavedPost }) {
  const { isSaved, toggle } = useReadingList();
  const saved = isSaved(post.slug);

  return (
    <button
      onClick={() => toggle(post)}
      title={saved ? 'Remove from reading list' : 'Save to reading list'}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors print:hidden ${
        saved
          ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
