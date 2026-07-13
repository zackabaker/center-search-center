// ONE site-wide theme model: 'normal' | 'sepia' | 'night'.
//
// History: the moon toggle managed `.dark` while the reading controls managed
// `data-reading-mode` — two independent axes. Certain sequences (Sepia →
// Night → moon off) stranded the night background CSS under light-rendered
// components: dark page, white cards, unreadable headings. Now every control
// writes THIS model, and `.dark` is always DERIVED (night ⇔ .dark), so a
// half-state is unrepresentable. The layout <head> script mirrors this logic
// for first paint — keep them in sync.

export type ThemeMode = 'normal' | 'sepia' | 'night';

export function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  if (mode === 'normal') root.removeAttribute('data-reading-mode');
  else root.setAttribute('data-reading-mode', mode);
  root.classList.toggle('dark', mode === 'night');
  try {
    localStorage.setItem('csc-reading-mode', mode);
    // Legacy key kept in sync for anything that still reads it.
    localStorage.setItem('csc-dark-mode', String(mode === 'night'));
  } catch {}
  window.dispatchEvent(new CustomEvent('csc-theme-changed', { detail: mode }));
}

export function currentTheme(): ThemeMode {
  const attr = document.documentElement.getAttribute('data-reading-mode');
  if (attr === 'sepia' || attr === 'night') return attr;
  return document.documentElement.classList.contains('dark') ? 'night' : 'normal';
}
