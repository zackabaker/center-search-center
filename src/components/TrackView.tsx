'use client';
import { useEffect } from 'react';
import { trackView } from '@/hooks/useReadingHistory';

export default function TrackView({ slug, title, source, date }: {
  slug: string; title: string; source: string; date: string | null;
}) {
  useEffect(() => {
    trackView({ slug, title, source, date });
  }, [slug, title, source, date]);
  return null;
}
