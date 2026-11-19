import { isOwner } from '@/lib/analytics-auth';
import { tutorRetrieve, tutorIndexStatus } from '@/lib/tutor/retrieve';
import { embedQuestion } from '@/lib/tutor/embed-query';

// Owner-only window onto the tutor's retrieval, for judging search quality
// before any model is attached. Everyone else gets the console's 404.
//
// GET ?q=...&mode=hybrid|keyword → { status, meaning, results: TutorHit[] }

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(request: Request) {
  if (!isOwner(request)) return new Response('Not found', { status: 404 });
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  const status = tutorIndexStatus();
  if (q.length < 2) return Response.json({ status, meaning: false, results: [] });
  const vec = url.searchParams.get('mode') === 'keyword' ? null : await embedQuestion(q, url.origin);
  return Response.json({ status, meaning: !!vec, results: tutorRetrieve(q, vec, { limit: 30 }) });
}
