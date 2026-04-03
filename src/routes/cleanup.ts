import type { FastifyInstance } from 'fastify';
import { search, deleteAsset } from '../clients/goledger.js';
import { isJunkTvShow, isJunkSeason, isJunkEpisode, isJunkWatchlist } from '../services/data-filter.js';

async function fetchAll(assetType: string): Promise<Record<string, unknown>[]> {
  const data = await search({ selector: { '@assetType': assetType }, limit: 200 });
  const result = data as { result?: Record<string, unknown>[] };
  return result.result ?? [];
}

async function deleteMany(
  items: Record<string, unknown>[],
  assetType: string,
  keyBuilder: (item: Record<string, unknown>) => Record<string, unknown>,
  logger: { info: (msg: string) => void; warn: (msg: string) => void },
): Promise<string[]> {
  const deleted: string[] = [];
  for (const item of items) {
    try {
      await deleteAsset({ '@assetType': assetType, ...keyBuilder(item) });
      const label = (item.title as string) || (item['@key'] as string) || 'unknown';
      deleted.push(label);
      logger.info(`[cleanup] Deleted dirty ${assetType}: "${label}"`);
    } catch (err: any) {
      logger.warn(`[cleanup] Failed to delete ${assetType}: ${err.message}`);
    }
  }
  return deleted;
}

const cleanupResponseSchema = {
  type: 'object' as const,
  properties: {
    deleted: { type: 'array', items: { type: 'string' } },
    count: { type: 'integer' },
  },
};

const errorSchema = {
  type: 'object' as const,
  properties: {
    error: { type: 'string' },
    statusCode: { type: 'integer' },
  },
};

export async function cleanupRoutes(server: FastifyInstance): Promise<void> {
  // ── Existing: clean dirty TV Shows ─────────────────────────────────
  server.post('/cleanup/dirty-shows', {
    config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
    schema: {
      tags: ['cleanup'],
      summary: 'Delete TV shows with junk titles',
      response: { 200: cleanupResponseSchema, 502: errorSchema },
    },
  }, async (_request, reply) => {
    try {
      const allShows = await fetchAll('tvShows');
      const dirty = allShows.filter((show) => isJunkTvShow(show));
      const deleted = await deleteMany(dirty, 'tvShows', (s) => ({ title: s.title }), server.log);
      return { deleted, count: deleted.length };
    } catch (err: any) {
      reply.status(502);
      return { error: err.message, statusCode: 502 };
    }
  });

  // ── New: clean all 4 entities in cascade ───────────────────────────
  server.post('/cleanup/all', {
    config: { rateLimit: { max: 3, timeWindow: '1 minute' } },
    schema: {
      tags: ['cleanup'],
      summary: 'Delete junk data across all entities (tvShows, seasons, episodes, watchlist)',
      response: {
        200: {
          type: 'object',
          properties: {
            tvShows: cleanupResponseSchema,
            seasons: cleanupResponseSchema,
            episodes: cleanupResponseSchema,
            watchlist: cleanupResponseSchema,
          },
        },
        502: errorSchema,
      },
    },
  }, async (_request, reply) => {
    try {
      // 1. TV Shows
      const allShows = await fetchAll('tvShows');
      const dirtyShows = allShows.filter((s) => isJunkTvShow(s));
      const deletedShows = await deleteMany(dirtyShows, 'tvShows', (s) => ({ title: s.title }), server.log);

      // 2. Seasons (whose parent show is junk)
      const allSeasons = await fetchAll('seasons');
      const dirtySeasons = allSeasons.filter((s) => isJunkSeason(s));
      const deletedSeasons = await deleteMany(dirtySeasons, 'seasons', (s) => ({
        number: s.number,
        tvShow: s.tvShow,
      }), server.log);

      // 3. Episodes (whose parent show is junk)
      const allEpisodes = await fetchAll('episodes');
      const dirtyEpisodes = allEpisodes.filter((e) => isJunkEpisode(e));
      const deletedEpisodes = await deleteMany(dirtyEpisodes, 'episodes', (e) => ({
        season: e.season,
        episodeNumber: e.episodeNumber,
      }), server.log);

      // 4. Watchlists
      const allWatchlists = await fetchAll('watchlist');
      const dirtyWatchlists = allWatchlists.filter((w) => isJunkWatchlist(w));
      const deletedWatchlists = await deleteMany(dirtyWatchlists, 'watchlist', (w) => ({ title: w.title }), server.log);

      return {
        tvShows: { deleted: deletedShows, count: deletedShows.length },
        seasons: { deleted: deletedSeasons, count: deletedSeasons.length },
        episodes: { deleted: deletedEpisodes, count: deletedEpisodes.length },
        watchlist: { deleted: deletedWatchlists, count: deletedWatchlists.length },
      };
    } catch (err: any) {
      reply.status(502);
      return { error: err.message, statusCode: 502 };
    }
  });
}
