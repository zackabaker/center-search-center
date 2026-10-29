// Shared check for the owner's console cookie (set by src/proxy.ts when
// /study is opened with the key). The raw-log GET endpoints use it so the
// data /study renders is only readable WITH the same key that opens /study —
// without this, the gate would protect the furniture but not the files.
// Fails closed when STUDY_KEY is not configured.
export function isOwner(request: Request): boolean {
  const key = process.env.STUDY_KEY;
  if (!key) return false;
  const cookie = request.headers.get('cookie') ?? '';
  return cookie.split(/;\s*/).includes(`csc-study=${key}`);
}
