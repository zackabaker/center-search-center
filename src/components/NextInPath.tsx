import { READING_PATHS } from '@/data/guide/reading-paths';
import NextInPathPicker, { PathCandidate } from './NextInPathPicker';

interface Props {
  slug: string;
}

// Server component: reduces READING_PATHS to a small candidates array (one
// entry per path claiming this slug — 16 of ~42 curated texts sit in 2+
// paths) so the client picker can thread by the reader's ACTIVE path without
// shipping the full path prose to the browser. Candidate order preserves the
// historical first-match behavior as the no-JS/SEO fallback.
export default function NextInPath({ slug }: Props) {
  const candidates: PathCandidate[] = [];

  for (const path of READING_PATHS) {
    const idx = path.posts.findIndex((p) => p.slug === slug);
    if (idx === -1) continue;

    const isLast = idx === path.posts.length - 1;
    const nextPost = isLast ? null : path.posts[idx + 1];
    const continuePath = isLast
      ? path.opensOnto.map((s) => READING_PATHS.find((p) => p.slug === s)).find(Boolean) ?? null
      : null;

    candidates.push({
      pathSlug: path.slug,
      pathTitle: path.title,
      isLast,
      nextSlug: nextPost?.slug ?? null,
      nextTitle: nextPost?.title ?? null,
      continuePathSlug: continuePath?.slug ?? null,
      continuePathTitle: continuePath?.title ?? null,
    });
  }

  if (candidates.length === 0) return null;

  return <NextInPathPicker candidates={candidates} />;
}
