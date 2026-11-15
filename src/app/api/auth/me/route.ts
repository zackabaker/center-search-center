import { authConfigured, getUser } from '@/lib/auth';
import { storeAvailable } from '@/lib/user-store';

export const dynamic = 'force-dynamic';

// GET /api/auth/me → { configured, user } — who, if anyone, is signed in.
export function GET(request: Request) {
  const configured = authConfigured() && storeAvailable();
  const user = configured ? getUser(request) : null;
  return Response.json(
    { configured, user: user ? { email: user.email, name: user.name, picture: user.picture ?? null, id: user.sub } : null },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
