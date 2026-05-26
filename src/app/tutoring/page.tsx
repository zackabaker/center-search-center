import { readFileSync } from 'fs';
import { join } from 'path';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tutoring Notes | Center Study Center',
  description:
    "Zack Baker's personal notes from tutoring sessions with Adam Katz, December 2020 – March 2023. Covers originary scene, mimetic desire, exemplary victimhood, resentment, technics, regime analysis, and originary grammar.",
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface BulletLine {
  text: string;
  level: number; // 0 = top, 1 = one indent (2 spaces), etc.
}

type SessionLine =
  | { kind: 'bullet'; text: string; level: number }
  | { kind: 'subsection'; name: string };

interface Session {
  name: string;
  anchor: string;
  intro: string | null;
  lines: SessionLine[];
}

interface MonthSection {
  name: string;
  anchor: string;
  sessions: Session[];
}

interface ParsedNotes {
  title: string;
  disclaimer: string[];
  months: MonthSection[];
}

// ── Parser ────────────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseNotes(content: string): ParsedNotes {
  const lines = content.split('\n');
  let title = '';
  const disclaimer: string[] = [];
  const months: MonthSection[] = [];

  let currentMonth: MonthSection | null = null;
  let currentSession: Session | null = null;
  let inDisclaimer = true;
  let sessionHasBullets = false;

  const pushSession = () => {
    if (currentSession && currentMonth) {
      currentMonth.sessions.push(currentSession);
    }
    currentSession = null;
    sessionHasBullets = false;
  };

  for (const line of lines) {
    // Title
    if (line.startsWith('# ')) {
      title = line.slice(2).trim();
      continue;
    }

    // Month
    if (line.startsWith('## ')) {
      inDisclaimer = false;
      pushSession();
      const name = line.slice(3).trim();
      currentMonth = { name, anchor: slugify(name), sessions: [] };
      months.push(currentMonth);
      continue;
    }

    // Session
    if (line.startsWith('### ')) {
      inDisclaimer = false;
      pushSession();
      const name = line.slice(4).trim();
      currentSession = {
        name,
        anchor: slugify(name),
        intro: null,
        lines: [],
      };
      continue;
    }

    // Subsection (H4)
    if (line.startsWith('#### ')) {
      if (currentSession) {
        sessionHasBullets = true;
        currentSession.lines.push({ kind: 'subsection', name: line.slice(5).trim() });
      }
      continue;
    }

    // Separators / blank lines
    if (line.trim() === '---' || line.trim() === '') continue;

    // Italic paragraph (whole line wrapped in *)
    // Matches *...* where the * are the very first and last chars
    if (line.startsWith('*') && line.endsWith('*') && line.length > 2 && !line.startsWith('**')) {
      const inner = line.slice(1, -1);
      if (inDisclaimer) {
        disclaimer.push(inner);
      } else if (currentSession && !sessionHasBullets) {
        // Session intro — can be multiple consecutive italic paragraphs
        currentSession.intro = currentSession.intro
          ? currentSession.intro + ' ' + inner
          : inner;
      }
      continue;
    }

    // Bullet lines: optional spaces, dash, space, content
    const bulletMatch = line.match(/^( *)-\s(.+)$/);
    if (bulletMatch && currentSession) {
      sessionHasBullets = true;
      const indent = bulletMatch[1].length;
      const level = Math.floor(indent / 2);
      currentSession.lines.push({ kind: 'bullet', text: bulletMatch[2], level });
      continue;
    }
  }

  pushSession();

  return { title, disclaimer, months };
}

// ── Inline renderer ───────────────────────────────────────────────────────────

// Converts *em*, **strong**, `code` markers inside a string into React nodes.
// Returns an array safe to spread into JSX.
function renderInlineParts(text: string): (string | React.ReactElement)[] {
  const parts: (string | React.ReactElement)[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let k = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const raw = match[0];
    if (raw.startsWith('**')) {
      parts.push(<strong key={k++}>{raw.slice(2, -2)}</strong>);
    } else if (raw.startsWith('*')) {
      parts.push(<em key={k++}>{raw.slice(1, -1)}</em>);
    } else {
      parts.push(
        <code
          key={k++}
          className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs font-mono"
        >
          {raw.slice(1, -1)}
        </code>,
      );
    }
    lastIndex = match.index + raw.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function Inline({ text }: { text: string }) {
  return <>{renderInlineParts(text)}</>;
}

// ── Indentation helper ────────────────────────────────────────────────────────

const INDENT_CLASSES: Record<number, string> = {
  0: '',
  1: 'ml-5',
  2: 'ml-10',
  3: 'ml-14',
};

function indentClass(level: number): string {
  return INDENT_CLASSES[Math.min(level, 3)] ?? 'ml-14';
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TutoringPage() {
  const raw = readFileSync(
    join(process.cwd(), 'src/data/tutoring-notes.md'),
    'utf-8',
  );
  const { title, disclaimer, months } = parseNotes(raw);

  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12 overflow-x-hidden">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-2">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
          Personal archive
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          December 2020 – March 2023 · {months.reduce((n, m) => n + m.sessions.length, 0)} sessions
        </p>
      </div>

      {/* ── Disclaimer ─────────────────────────────────────────────────────── */}
      {disclaimer.length > 0 && (
        <div className="my-6 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-4 space-y-2">
          {disclaimer.map((para, i) => (
            <p
              key={i}
              className="text-sm text-amber-900 dark:text-amber-200 italic leading-relaxed"
            >
              <Inline text={para} />
            </p>
          ))}
        </div>
      )}

      {/* ── Table of contents ──────────────────────────────────────────────── */}
      <nav className="mb-10 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
          Contents
        </p>
        <div className="space-y-3">
          {months.map((month) => (
            <div key={month.anchor}>
              <a
                href={`#${month.anchor}`}
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {month.name}
              </a>
              {month.sessions.length > 0 && (
                <div className="mt-1 ml-3 space-y-0.5 border-l border-gray-200 dark:border-gray-700 pl-3">
                  {month.sessions.map((session) => (
                    <a
                      key={session.anchor}
                      href={`#${month.anchor}-${session.anchor}`}
                      className="block text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-relaxed"
                    >
                      {session.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="space-y-16">
        {months.map((month) => (
          <section key={month.anchor} id={month.anchor}>

            {/* Month header */}
            <div className="flex items-center gap-3 mb-7">
              <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {month.name}
              </h2>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="space-y-12">
              {month.sessions.map((session) => (
                <article
                  key={session.anchor}
                  id={`${month.anchor}-${session.anchor}`}
                  className="scroll-mt-6"
                >
                  {/* Session title */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 leading-snug">
                    {session.name}
                  </h3>

                  {/* Session intro */}
                  {session.intro && (
                    <div className="mb-4 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed">
                        <Inline text={session.intro} />
                      </p>
                    </div>
                  )}

                  {/* Session body */}
                  {session.lines.length > 0 && (
                    <div className="space-y-1">
                      {session.lines.map((line, li) => {
                        if (line.kind === 'subsection') {
                          return (
                            <p
                              key={li}
                              className="mt-4 mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                            >
                              {line.name}
                            </p>
                          );
                        }
                        return (
                          <div
                            key={li}
                            className={`flex gap-2 ${indentClass(line.level)}`}
                          >
                            <span className="flex-shrink-0 mt-1 text-gray-300 dark:text-gray-600 select-none text-xs">
                              {line.level === 0 ? '—' : '·'}
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              <Inline text={line.text} />
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

    </main>
  );
}
