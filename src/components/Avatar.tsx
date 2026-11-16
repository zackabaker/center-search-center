// A reader's picture, or a monogram tile when they have none. The picture is
// the one they uploaded — never their Google photo.
export default function Avatar({
  username, hasAvatar, size = 32, version,
}: { username: string; hasAvatar: boolean; size?: number; version?: number }) {
  const box = { width: size, height: size } as const;
  if (hasAvatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/api/avatar/${encodeURIComponent(username)}${version ? `?v=${version}` : ''}`}
        alt=""
        width={size}
        height={size}
        style={box}
        className="flex-shrink-0 object-cover rounded-sm bg-gray-100 dark:bg-gray-800"
      />
    );
  }
  return (
    <span
      aria-hidden
      style={{ ...box, fontSize: Math.round(size * 0.46) }}
      className="flex-shrink-0 inline-flex items-center justify-center rounded-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-serif font-semibold uppercase leading-none"
    >
      {username.slice(0, 1)}
    </span>
  );
}
