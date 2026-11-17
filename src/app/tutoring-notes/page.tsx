import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getUser, isOwnerUser } from '@/lib/auth';

// /tutoring-notes — the owner's private study notes (src/data/tutoring-notes.md),
// rendered for reading. Gated twice: src/proxy.ts refuses non-owner requests
// before anything renders, and this component re-checks the session so the
// content cannot render even if the matcher ever drifts.

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tutoring Notes',
  robots: { index: false, follow: false },
};

// ── Minimal markdown for this one document: #–#### headings, -/nested
// bullets (2-space indent per level), --- rules, *italic* spans, paragraphs.

interface Item {
  text: string;
  children: Item[];
}

type Block =
  | { type: 'h'; level: number; text: string }
  | { type: 'hr' }
  | { type: 'p'; text: string }
  | { type: 'list'; items: Item[] };

function parseBlocks(md: string): Block[] {
  const blocks: Block[] = [];
  const lines = md.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }
    const h = line.match(/^(#{1,4}) (.*)$/);
    if (h) {
      blocks.push({ type: 'h', level: h[1].length, text: h[2] });
      i++;
      continue;
    }
    if (/^\s*- /.test(line)) {
      const items: Item[] = [];
      const stack: Item[][] = [items];
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)- (.*)$/);
        if (!m) break;
        const depth = Math.min(Math.floor(m[1].length / 2), 4);
        while (stack.length - 1 > depth) stack.pop();
        while (stack.length - 1 < depth) {
          const siblings = stack[stack.length - 1];
          if (siblings.length === 0) siblings.push({ text: '', children: [] });
          stack.push(siblings[siblings.length - 1].children);
        }
        const item: Item = { text: m[2], children: [] };
        stack[stack.length - 1].push(item);
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }
    blocks.push({ type: 'p', text: line.trim() });
    i++;
  }
  return blocks;
}

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*([^*]+)\*/g;
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<em key={k++}>{m[1]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function BulletList({ items, depth }: { items: Item[]; depth: number }) {
  return (
    <ul className={depth === 0 ? 'list-disc space-y-2 pl-5' : 'mt-2 list-[circle] space-y-2 pl-5'}>
      {items.map((item, i) => (
        <li key={i}>
          {inline(item.text)}
          {item.children.length > 0 && <BulletList items={item.children} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}

const HEADING_CLASS: Record<number, string> = {
  1: 'text-3xl font-semibold text-gray-900 dark:text-gray-100',
  2: 'mt-12 text-2xl font-semibold text-gray-900 dark:text-gray-100',
  3: 'mt-10 text-xl font-semibold text-gray-900 dark:text-gray-100',
  4: 'mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100',
};

export default async function TutoringNotesPage() {
  const h = await headers();
  const user = getUser(new Request('http://internal/', { headers: { cookie: h.get('cookie') ?? '' } }));
  if (!isOwnerUser(user)) notFound();

  const md = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'tutoring-notes.md'), 'utf-8');
  const blocks = parseBlocks(md);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <p className="mb-8 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Private — visible only to your account ·{' '}
        <Link href="/" className="underline underline-offset-4">center.study</Link>
      </p>
      <article className="space-y-4 text-[17px] leading-relaxed text-gray-800 dark:text-gray-200">
        {blocks.map((b, i) => {
          if (b.type === 'hr') return <hr key={i} className="my-8 border-gray-200 dark:border-gray-800" />;
          if (b.type === 'h') {
            const Tag = `h${b.level}` as 'h1' | 'h2' | 'h3' | 'h4';
            return <Tag key={i} className={HEADING_CLASS[b.level]}>{inline(b.text)}</Tag>;
          }
          if (b.type === 'list') return <BulletList key={i} items={b.items} depth={0} />;
          return <p key={i}>{inline(b.text)}</p>;
        })}
      </article>
    </main>
  );
}
