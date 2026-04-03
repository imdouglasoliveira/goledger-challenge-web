import type { FastifyInstance } from 'fastify';
import { search, readAsset, createAsset, updateAsset, deleteAsset } from '../clients/goledger.js';
import { searchQuerystring, paginationMetadata, errorResponse } from '../schemas/common.schema.js';
import { watchlistSchema } from '../schemas/watchlist.schema.js';
import { isJunkWatchlist } from '../services/data-filter.js';

const tvShowRef = {
  type: 'object' as const,
  required: ['@assetType', 'title'],
  properties: {
    '@assetType': { type: 'string', const: 'tvShows' },
    title: { type: 'string', minLength: 1 },
  },
};

const createWatchlistBody = {
  type: 'object' as const,
  required: ['title'],
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 200 },
    description: { type: 'string', maxLength: 2000 },
    tvShows: { type: 'array', items: tvShowRef },
  },
  additionalProperties: false,
};

const updateWatchlistBody = {
  type: 'object' as const,
  required: ['title'],
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 200 },
    description: { type: 'string', maxLength: 2000 },
    tvShows: { type: 'array', items: tvShowRef },
  },
  additionalProperties: false,
};

export async function watchlistRoutes(server: FastifyInstance): Promise<void> {
  server.get('/watchlist', {
    schema: {
      tags: ['watchlist'],
      summary: 'List Watchlists',
      querystring: searchQuerystring,
      response: {
        200: { type: 'object', properties: { metadata: paginationMetadata, result: { type: 'array', items: watchlistSchema } } },
        502: errorResponse,
      },
    },
  }, async (request, reply) => {
    const { limit = 20, bookmark = '' } = request.query as { limit?: number; bookmark?: string };
    try {
      const data = await search({ selector: { '@assetType': 'watchlist' }, limit, bookmark });
      const result = data as { metadata: unknown; result: Record<string, unknown>[] };
      return { metadata: result.metadata, result: result.result.filter(w => !isJunkWatchlist(w)) };
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  server.get('/watchlist/:key', {
    schema: {
      tags: ['watchlist'],
      summary: 'Get Watchlist by key',
      params: { type: 'object', properties: { key: { type: 'string' } }, required: ['key'] },
      response: { 200: watchlistSchema, 404: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const { key } = request.params as { key: string };
    try {
      return await readAsset({ '@assetType': 'watchlist', '@key': key });
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  server.post('/watchlist', {
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    schema: {
      tags: ['watchlist'],
      summary: 'Create Watchlist',
      body: createWatchlistBody,
      response: { 200: watchlistSchema, 400: errorResponse, 409: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const body = request.body as Record<string, unknown>;
    try {
      return await createAsset([{ '@assetType': 'watchlist', ...body }]);
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  server.put('/watchlist', {
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    schema: {
      tags: ['watchlist'],
      summary: 'Update Watchlist',
      body: updateWatchlistBody,
      response: { 200: watchlistSchema, 400: errorResponse, 404: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const body = request.body as Record<string, unknown>;
    try {
      return await updateAsset({ '@assetType': 'watchlist', ...body });
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  server.delete('/watchlist', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    schema: {
      tags: ['watchlist'],
      summary: 'Delete Watchlist',
      body: {
        type: 'object',
        required: ['title'],
        properties: { title: { type: 'string', minLength: 1 } },
        additionalProperties: false,
      },
      response: { 200: watchlistSchema, 400: errorResponse, 404: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const { title } = request.body as { title: string };
    try {
      return await deleteAsset({ '@assetType': 'watchlist', title });
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });
}
