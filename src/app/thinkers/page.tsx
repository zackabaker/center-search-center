import Link from 'next/link';
import type { Metadata } from 'next';
import { loadThinkers } from '@/lib/thinkers';

export const metadata: Metadata = {
  title: 'The Influence Graph | Center Study Center',
  description:
    'The thinkers Center Study engages — Girard, Gans, Derrida, and the wider network — mapped by how often and where they appear across the corpus, and which appear together.',
};

export const revalidate = 3600;

function year(d: string | null): string {
  if (!d) return '';
  const x = new Date(d);
  return isNaN(x.getTime()) ? '' : String(x.getFullYear());
}

export default function ThinkersPage() {
  const data = loadThinkers();
  const thinkers = data?.thinkers ?? [];
  const edges = data?.edges ?? [];

  // ── Constellation layout: top 16 by mentions on a ring ──────────────────────
  const N = Math.min(16, thinkers.length);
  const top = thinkers.slice(0, N);
  const cx = 380, cy = 300, R = 232;
  const maxMentions = top[0]?.mentions || 1;
  const pos = new Map<string, { x: number; y: number; r: number; a: number }>();
  top.forEach((t, i) => {
    const a = -Math.PI / 2 + (i / N) * Math.PI * 2;
    const r = 7 + Math.min(26, Math.sqrt(t.mentions) * 0.45);
    pos.set(t.name, { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), r, a });
  });
  const topNames = new Set(top.map((t) => t.name));
  const ringEdges = edges.filter((e) => topNames.has(e.a) && topNames.has(e.b)).slice(0, 34);
  const maxW = ringEdges[0]?.weight || 1;

  return (
    <main className="max-w-4xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">The network</p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
        The Influence Graph
      </h1>
      <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-2xl">
        The thinkers Center Study reads with and against. Node size is how often each appears across the
        corpus; lines connect thinkers who turn up in the same essays. Girard and Gans are the gravitational
        center; everyone else is positioned relative to that conversation.
      </p>

      {thinkers.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">The influence graph is being generated.</p>
      ) : (
        <>
          {/* Constellation */}
          <div className="mb-12 -mx-2 text-gray-700 dark:text-gray-300">
            <svg viewBox="0 0 760 600" className="w-full h-auto" role="img" aria-label="Network of thinkers">
              {ringEdges.map((e, i) => {
                const p = pos.get(e.a)!, q = pos.get(e.b)!;
                const op = 0.06 + 0.42 * (e.weight / maxW);
                return <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="currentColor" strokeOpacity={op} strokeWidth={0.5 + 2 * (e.weight / maxW)} />;
              })}
              {top.map((t) => {
                const p = pos.get(t.name)!;
                const right = Math.cos(p.a) >= -0.01;
                const lx = p.x + (p.r + 7) * (right ? 1 : -1);
                return (
                  <a key={t.name} href={`#${t.name}`}>
                    <circle cx={p.x} cy={p.y} r={p.r} style={{ fill: '#3b82f6', fillOpacity: 0.85 }} />
                    <text x={lx} y={p.y + 4} textAnchor={right ? 'start' : 'end'} fill="currentColor" style={{ fontSize: 13, fontWeight: 600 }}>
                      {t.name}
                    </text>
                  </a>
                );
              })}
            </svg>
          </div>

          {/* Ranked list */}
          <div className="space-y-5">
            {thinkers.map((t) => (
              <div key={t.name} id={t.name} className="scroll-mt-20 border-t border-gray-100 dark:border-gray-800 pt-5">
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t.name}</h2>
                  <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums flex-shrink-0">
                    {t.mentions.toLocaleString()} mentions · {t.postCount} texts
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t.note}</p>
                <div className="grid sm:grid-cols-[1fr_auto] gap-x-8 gap-y-3">
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">Most in</p>
                    <ul className="space-y-1">
                      {t.topPosts.slice(0, 4).map((p) => (
                        <li key={p.slug} className="flex items-baseline gap-2">
                          <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums w-9 flex-shrink-0">{year(p.date)}</span>
                          <Link href={`/post/${p.slug}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline leading-snug">{p.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {t.related.length > 0 && (
                    <div className="sm:text-right">
                      <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">Appears with</p>
                      <div className="flex flex-wrap gap-1.5 sm:justify-end">
                        {t.related.map((r) => (
                          <a key={r.name} href={`#${r.name}`} className="text-xs px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                            {r.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Link href={`/search?q=${encodeURIComponent(t.name)}`} className="inline-block mt-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  All {t.postCount} appearances →
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
