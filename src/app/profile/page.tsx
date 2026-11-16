import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
  title: 'Your profile',
  description: 'Your Center Study username, picture, reading record and idiom archive.',
  // Personal, per-reader page — nothing here for a search engine.
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProfileClient />
    </Suspense>
  );
}
