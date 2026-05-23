import { redirect } from 'next/navigation';

// The guide hub page has been merged into /intro.
// Keep this redirect so old links don't 404.
export default function GuidePage() {
  redirect('/intro');
}
