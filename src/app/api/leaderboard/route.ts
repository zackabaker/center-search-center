import { topEngaged } from '@/lib/user-store';

export const dynamic = 'force-dynamic';

// GET /api/leaderboard → { readers } — the most engaged signed-in readers who
// have not opted out. Public: usernames, pictures and counts only — never an
// email or a real name.
export async function GET() {
  const readers = await topEngaged(10).catch(() => []);
  return Response.json(
    { readers },
    { headers: { 'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=60' } },
  );
}
