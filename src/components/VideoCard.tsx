'use client';

import { useState } from 'react';

// Click-to-load YouTube embed: shows the static thumbnail (no third-party
// requests beyond the image) until the reader chooses to play, then swaps in
// the privacy-enhanced youtube-nocookie iframe. Keeps the page fast and the
// tracking opt-in.
export default function VideoCard({
  videoId,
  title,
  caption,
}: {
  videoId: string;
  title: string;
  caption?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="my-8">
      <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-black aspect-video">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 w-full h-full"
            aria-label={`Play video: ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              loading="lazy"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center justify-center w-16 h-11 rounded-xl bg-black/70 group-hover:bg-black/85 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
            <span className="absolute bottom-0 inset-x-0 px-4 py-2.5 bg-gradient-to-t from-black/80 to-transparent text-left">
              <span className="text-sm text-white font-medium leading-snug">{title}</span>
            </span>
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
