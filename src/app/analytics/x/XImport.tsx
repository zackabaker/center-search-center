'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Upload one or both of X's analytics exports (the "Download CSV" button on
// the Overview and Content tabs of x.com/i/account_analytics, signed in as
// the account). The files are told apart by their header row, and importing
// the same days or posts again simply replaces them.

type Result = { kind: 'overview' | 'content'; rows: number; from: string; to: string };

export default function XImport() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [lines, setLines] = useState<string[]>([]);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    const out: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const csv = await file.text();
        const res = await fetch('/api/analytics/x-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csv }),
        });
        const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; result?: Result } | null;
        if (res.ok && json?.ok && json.result) {
          const r = json.result;
          out.push(`${file.name}: ${r.rows} ${r.kind === 'content' ? 'posts' : 'days'} imported, ${r.from} to ${r.to}.`);
        } else {
          out.push(`${file.name}: ${json?.error ?? 'not imported.'}`);
        }
      } catch {
        out.push(`${file.name}: could not be read or sent.`);
      }
    }
    setLines(out);
    setBusy(false);
    router.refresh();
  };

  return (
    <div className="mt-3 text-sm">
      <label className="inline-flex min-h-9 cursor-pointer items-center rounded border border-gray-300 dark:border-gray-600 px-3 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-200">
        {busy ? 'Importing…' : 'Upload X exports (CSV)'}
        <input
          id="x-import-files"
          type="file"
          accept=".csv,text/csv"
          multiple
          disabled={busy}
          className="sr-only"
          onChange={(e) => { void upload(e.target.files); e.target.value = ''; }}
        />
      </label>
      {lines.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-gray-600 dark:text-gray-300" aria-live="polite">
          {lines.map((l) => <li key={l}>{l}</li>)}
        </ul>
      )}
    </div>
  );
}
