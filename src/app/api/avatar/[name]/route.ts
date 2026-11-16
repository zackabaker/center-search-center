import { getAvatar, subForUsername } from '@/lib/user-store';

export const dynamic = 'force-dynamic';

// GET /api/avatar/<username> — a reader's public picture, as an image.
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[A-Za-z][A-Za-z0-9_]{2,19}$/.test(name)) return new Response(null, { status: 404 });
  const sub = await subForUsername(name);
  const dataUrl = sub ? await getAvatar(sub) : null;
  const m = dataUrl ? /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(dataUrl) : null;
  if (!m) return new Response(null, { status: 404 });
  return new Response(Buffer.from(m[2], 'base64'), {
    headers: {
      'Content-Type': m[1],
      'Cache-Control': 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
