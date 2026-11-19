import Link from 'next/link';

// The tutor's answers as rendered prose: paragraphs, short headings, lists,
// quotations, emphasis and links. No hooks, so the live page and the saved
// answer pages (server-rendered) share it.

function inline(text: string, k: number): React.ReactNode {
  return text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={`${k}-${i}`}>{part.slice(2, -2)}</strong>;
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) return <em key={`${k}-${i}`}>{part.slice(1, -1)}</em>;
    const m = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (m) {
      const internal = m[2].startsWith('/');
      return internal ? (
        <Link key={`${k}-${i}`} href={m[2]} target="_blank" className="underline decoration-gray-400 underline-offset-2 hover:decoration-gray-900 dark:hover:decoration-gray-100">{m[1]}</Link>
      ) : (
        <a key={`${k}-${i}`} href={m[2]} target="_blank" rel="noreferrer" className="underline">{m[1]}</a>
      );
    }
    return <span key={`${k}-${i}`}>{part}</span>;
  });
}

export default function Markdown({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  const lines = text.split('\n');
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      out.push(<h3 key={k++} className="mt-5 mb-1.5 font-semibold text-gray-900 dark:text-gray-100">{inline(h[2], k)}</h3>);
      i++; continue;
    }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items: string[] = [];
      while (i < lines.length && (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))) {
        items.push(lines[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, ''));
        i++;
      }
      const L = ordered ? 'ol' : 'ul';
      out.push(
        <L key={k++} className={`my-3 space-y-1.5 pl-5 ${ordered ? 'list-decimal' : 'list-disc'}`}>
          {items.map((it, j) => <li key={j}>{inline(it, k * 100 + j)}</li>)}
        </L>,
      );
      continue;
    }
    if (line.startsWith('>')) {
      const q: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) { q.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push(<blockquote key={k++} className="my-3 border-l-2 border-gray-300 dark:border-gray-600 pl-4 italic">{inline(q.join(' '), k)}</blockquote>);
      continue;
    }
    out.push(<p key={k++} className="mb-3">{inline(line, k)}</p>);
    i++;
  }
  return <div className="font-serif text-[17px] leading-relaxed text-gray-800 dark:text-gray-200">{out}</div>;
}

