/**
 * Data filter — heuristics to detect junk/test data from the shared blockchain API.
 *
 * The GoLedger API is shared among all candidates, so anyone can create garbage
 * entries (titles like "123123", "BB", descriptions like "LKAJDASLKJDAS").
 * This module provides per-entity filter functions used in GET routes to omit
 * junk records before they reach the frontend.
 */

const JUNK_PATTERNS: RegExp[] = [
  /\btest\b/i,
  /\bteste\b/i,
  /\d{5,}/,                         // 5+ digit sequences: "123123", "99999"
  /^[a-z]{1,3}$/i,                  // 1-3 char titles: "BB", "ab", "x"
  /^(.)\1{2,}$/i,                   // repeated char 3+: "aaa", "xxx"
  /^[^a-zA-Z0-9\u00C0-\u024F]+$/,  // no letters/digits (symbols only)
  /^(asdf|qwer|zxcv|wasd)/i,       // keyboard mashing
  /^(foo|bar|baz|lorem|ipsum)/i,    // classic placeholders
  /[A-Z]{5,}/,                      // 5+ uppercase in a row: "LKAJDASLKJDAS"
];

/**
 * Detects gibberish by checking vowel ratio.
 * Normal text has ~35-40% vowels; gibberish like "LKJDSLKJ" has < 15%.
 */
function isGibberish(text: string): boolean {
  const letters = text.replace(/[^a-zA-Z]/g, '').toLowerCase();
  if (letters.length < 4) return false;
  const vowels = letters.replace(/[^aeiou]/g, '').length;
  const ratio = vowels / letters.length;
  return ratio < 0.15;
}

export function isJunkText(text: string): boolean {
  if (!text || typeof text !== 'string') return true;
  const trimmed = text.trim();
  if (trimmed.length === 0) return true;
  if (JUNK_PATTERNS.some((p) => p.test(trimmed))) return true;
  if (isGibberish(trimmed)) return true;
  return false;
}

// ── Per-entity filters ──────────────────────────────────────────────

export function isJunkTvShow(show: Record<string, unknown>): boolean {
  return isJunkText(show.title as string);
}

export function isJunkSeason(season: Record<string, unknown>): boolean {
  const tvShow = season.tvShow as { title?: string } | undefined;
  return isJunkText(tvShow?.title ?? '');
}

export function isJunkEpisode(episode: Record<string, unknown>): boolean {
  const season = episode.season as { tvShow?: { title?: string } } | undefined;
  return isJunkText(season?.tvShow?.title ?? '');
}

export function isJunkWatchlist(wl: Record<string, unknown>): boolean {
  return isJunkText(wl.title as string);
}
