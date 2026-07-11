// One vocabulary layer shared by keyword search and Ask retrieval.
//
// These are CONSERVATIVE alias groups — true synonyms, spelling variants, and
// morphology the stemmer's prefix rule can't reach (prefix matching only works
// when the typed term is a prefix of the corpus word, not the reverse).
// Ask's own TERM_SYNONYMS map stays deliberately recall-tuned (an LLM filters
// noise downstream); a human scanning keyword results cannot, so nothing
// loose belongs here. Single-word aliases only — keyword scoring matches
// against tokenized word sets.

export const SEARCH_ALIASES: Record<string, string[]> = {
  // GA's founding trio of terms for the same phenomenon
  mimesis: ['mimetic', 'imitation'],
  mimetic: ['mimesis', 'imitation'],
  imitation: ['mimesis', 'mimetic'],
  // Nietzsche's spelling appears throughout the corpus
  resentment: ['ressentiment'],
  ressentiment: ['resentment'],
  // Spelling variants (the corpus spans venues and decades)
  center: ['centre'],
  centre: ['center'],
  judgment: ['judgement'],
  judgement: ['judgment'],
  aesthetic: ['esthetic'],
  esthetic: ['aesthetic'],
  // Morphology the prefix rule can't reach (typed term is longer than the stem)
  deferral: ['defer'],
  sovereignty: ['sovereign'],
  sacrifice: ['sacrificial'],
  sacrificial: ['sacrifice'],
  metaphysics: ['metaphysical'],
  metaphysical: ['metaphysics'],
  hierarchy: ['hierarchical'],
  hierarchical: ['hierarchy'],
};

/** Aliases for a (lowercased) query term; [] when none. */
export function aliasesFor(term: string): string[] {
  return SEARCH_ALIASES[term] ?? [];
}

/**
 * Display helper: which expansions would apply to this raw query?
 * Returns e.g. [{ term: 'imitation', aliases: ['mimesis', 'mimetic'] }].
 */
export function activeExpansions(rawQuery: string): { term: string; aliases: string[] }[] {
  const words = rawQuery
    .toLowerCase()
    .replace(/["“”]/g, '')
    .replace(/\b(and|or|not)\b/gi, ' ')
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3);
  const seen = new Set<string>();
  const out: { term: string; aliases: string[] }[] = [];
  for (const w of words) {
    if (seen.has(w)) continue;
    seen.add(w);
    const a = aliasesFor(w);
    if (a.length) out.push({ term: w, aliases: a });
  }
  return out;
}
