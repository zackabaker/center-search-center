// Shared check for access to the owner's console (/analytics) and the raw-log
// GET endpoints. Two doors, either opens:
//   1. The owner's Google session — the signed csc-session cookie whose email
//      matches the owner account (src/lib/auth.ts isOwnerUser).
//   2. The legacy key cookie (set by src/proxy.ts when /analytics is opened
//      with ?key=), kept so key-based bookmarks and curl keep working.
// Fails closed when neither STUDY_KEY nor auth is configured.
import { getUser, isOwnerUser } from './auth';

export function isOwner(request: Request): boolean {
  if (isOwnerUser(getUser(request))) return true;
  const key = process.env.STUDY_KEY;
  if (!key) return false;
  const cookie = request.headers.get('cookie') ?? '';
  return cookie.split(/;\s*/).includes(`csc-study=${key}`);
}
