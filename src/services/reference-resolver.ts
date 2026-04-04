/**
 * Reference resolver — enriches GoLedger references with human-readable fields.
 *
 * GoLedger stores asset references as `{ "@assetType": "tvShows", "@key": "tvShows:uuid" }`
 * without the `title`/`number` fields the frontend expects. This module fetches related assets
 * and injects missing properties into every reference found in seasons and episodes.
 */

import { search } from '../clients/goledger.js';

interface TvShowRecord {
  '@key': string;
  '@assetType': string;
  title: string;
  [k: string]: unknown;
}

interface SeasonRecord {
  '@key': string;
  '@assetType': string;
  number: number;
  tvShow: { '@key': string; '@assetType': string; title?: string };
  [k: string]: unknown;
}

/** Fetch all TV shows and build a @key → title map. */
async function buildShowMap(): Promise<Map<string, string>> {
  const data = await search({ selector: { '@assetType': 'tvShows' }, limit: 200 });
  const result = data as { result: TvShowRecord[] };
  const map = new Map<string, string>();
  for (const show of result.result ?? []) {
    if (show['@key'] && show.title) {
      map.set(show['@key'], show.title);
    }
  }
  return map;
}

/** Fetch all seasons and build a @key → { number, tvShowKey } map. */
async function buildSeasonMap(): Promise<Map<string, { number: number; tvShowKey: string }>> {
  const data = await search({ selector: { '@assetType': 'seasons' }, limit: 500 });
  const result = data as { result: SeasonRecord[] };
  const map = new Map<string, { number: number; tvShowKey: string }>();
  for (const season of result.result ?? []) {
    if (season['@key'] && season.number != null && season.tvShow?.['@key']) {
      map.set(season['@key'], { number: season.number, tvShowKey: season.tvShow['@key'] });
    }
  }
  return map;
}

/** Enrich a tvShow reference object in-place if it has @key but no title. */
function enrichTvShowRef(ref: Record<string, unknown>, showMap: Map<string, string>): void {
  if (ref && ref['@key'] && !ref.title) {
    const title = showMap.get(ref['@key'] as string);
    if (title) ref.title = title;
  }
}

/** Resolve tvShow references in a list of season records. */
export async function resolveSeasonRefs(seasons: Record<string, unknown>[]): Promise<void> {
  if (seasons.length === 0) return;
  const needsResolving = seasons.some(
    (s) => s.tvShow && typeof s.tvShow === 'object' && !(s.tvShow as Record<string, unknown>).title,
  );
  if (!needsResolving) return;

  const showMap = await buildShowMap();
  for (const season of seasons) {
    if (season.tvShow && typeof season.tvShow === 'object') {
      enrichTvShowRef(season.tvShow as Record<string, unknown>, showMap);
    }
  }
}

/**
 * Resolve season+tvShow references in episode records.
 *
 * Episodes from GoLedger have `season: { "@assetType": "seasons", "@key": "..." }` —
 * a flat reference with no `number` or `tvShow`. We need to:
 * 1. Fetch seasons to get number + tvShow @key
 * 2. Fetch tvShows to get title
 * 3. Rebuild the season object with full data
 */
export async function resolveEpisodeRefs(episodes: Record<string, unknown>[]): Promise<void> {
  if (episodes.length === 0) return;

  // Check if any episode's season is a flat reference (has @key but no number)
  const needsResolving = episodes.some((e) => {
    const season = e.season as Record<string, unknown> | undefined;
    return season && season['@key'] && season.number == null;
  });
  if (!needsResolving) return;

  const [seasonMap, showMap] = await Promise.all([buildSeasonMap(), buildShowMap()]);

  for (const episode of episodes) {
    const season = episode.season as Record<string, unknown> | undefined;
    if (!season?.['@key']) continue;

    const seasonData = seasonMap.get(season['@key'] as string);
    if (!seasonData) continue;

    // Inject number
    if (season.number == null) season.number = seasonData.number;

    // Inject/enrich tvShow
    if (!season.tvShow || typeof season.tvShow !== 'object') {
      season.tvShow = { '@assetType': 'tvShows', '@key': seasonData.tvShowKey };
    }
    const tvShowRef = season.tvShow as Record<string, unknown>;
    if (!tvShowRef['@key']) tvShowRef['@key'] = seasonData.tvShowKey;
    enrichTvShowRef(tvShowRef, showMap);
  }
}

/** Resolve tvShow references in watchlist records. */
export async function resolveWatchlistRefs(watchlists: Record<string, unknown>[]): Promise<void> {
  if (watchlists.length === 0) return;

  const needsResolving = watchlists.some((w) => {
    const shows = w.tvShows as Record<string, unknown>[] | undefined;
    return shows?.some((ref) => ref['@key'] && !ref.title);
  });
  if (!needsResolving) return;

  const showMap = await buildShowMap();
  for (const wl of watchlists) {
    const shows = wl.tvShows as Record<string, unknown>[] | undefined;
    if (!shows) continue;
    for (const ref of shows) {
      enrichTvShowRef(ref, showMap);
    }
  }
}
