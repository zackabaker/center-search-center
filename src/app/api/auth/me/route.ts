import { authConfigured, getUser } from '@/lib/auth';
import { getProfile, storeAvailable } from '@/lib/user-store';

export const dynamic = 'force-dynamic';

// GET /api/auth/me → { configured, user } — who, if anyone, is signed in.
export async function GET(request: Request) {
  const configured = authConfigured() && storeAvailable();
  const user = configured ? getUser(request) : null;
  // The profile's username is what the site shows; it is created
  // with a random username on the reader's first signed-in request.
  const profile = user ? await getProfile(user.sub).catch(() => null) : null;
  return Response.json(
    {
      configured,
      user: user
        ? {
            email: user.email, name: user.name, picture: user.picture ?? null, id: user.sub,
            username: profile?.username ?? null,
          }
        : null,
    },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
