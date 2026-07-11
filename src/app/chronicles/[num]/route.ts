import { NextRequest } from 'next/server';

// Scholarly aliases for the numbered series: scholars cite "Chronicle 500",
// so /chronicles/500 resolves — as a permanent redirect onto the canonical
// /post/clr-500 page (NO canonical flip: the /post/ URLs are the already
// indexed, already AI-cited addresses).
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ num: string }> }
) {
  const { num } = await params;
  if (!/^\d{1,3}$/.test(num) || Number(num) < 1 || Number(num) > 999) {
    return new Response('Not found', { status: 404 });
  }
  return Response.redirect(`https://center.study/post/clr-${Number(num)}`, 308);
}
