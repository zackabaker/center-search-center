import { redirect } from 'next/navigation';

// Stats have been merged into the Archive/Download page.
export default function StatsPage() {
  redirect('/download');
}
