import type { FastifyInstance } from 'fastify';
import { search, readAsset, createAsset, updateAsset, deleteAsset } from '../clients/goledger.js';
import { searchQuerystring, paginationMetadata, errorResponse } from '../schemas/common.schema.js';
import { episodeSchema } from '../schemas/episodes.schema.js';
import { isJunkEpisode } from '../services/data-filter.js';

const seasonRef = {
  type: 'object' as const,
  required: ['@assetType', 'number', 'tvShow'],
  properties: {
    '@assetType': { type: 'string', const: 'seasons' },
    number: { type: 'integer', minimum: 1 },
    tvShow: {
      type: 'object',
      required: ['@assetType', 'title'],
      properties: {
        '@assetType': { type: 'string', const: 'tvShows' },
        title: { type: 'string', minLength: 1 },
      },
    },
  },
};

const createEpisodeBody = {
  type: 'object' as const,
  required: ['season', 'episodeNumber', 'title', 'releaseDate', 'description'],
  properties: {
    season: seasonRef,
    episodeNumber: { type: 'integer', minimum: 1 },
    title: { type: 'string', minLength: 1, maxLength: 200 },
    description: { type: 'string', minLength: 1, maxLength: 2000 },
    releaseDate: { type: 'string', format: 'date-time' },
    rating: { type: 'number', minimum: 0, maximum: 10 },
  },
  additionalProperties: false,
};

const updateEpisodeBody = {
  type: 'object' as const,
  required: ['season', 'episodeNumber'],
  properties: {
    season: seasonRef,
    episodeNumber: { type: 'integer', minimum: 1 },
    title: { type: 'string', minLength: 1, maxLength: 200 },
    description: { type: 'string', minLength: 1, maxLength: 2000 },
    releaseDate: { type: 'string', format: 'date-time' },
    rating: { type: 'number', minimum: 0, maximum: 10 },
  },
  additionalProperties: false,
};

export async function episodesRoutes(server: FastifyInstance): Promise<void> {
  server.get('/episodes', {
    schema: {
      tags: ['episodes'],
      summary: 'List Episodes',
      querystring: searchQuerystring,
      response: {
        200: { type: 'object', properties: { metadata: paginationMetadata, result: { type: 'array', items: episodeSchema } } },
        502: errorResponse,
      },
    },
  }, async (request, reply) => {
    const { limit = 20, bookmark = '' } = request.query as { limit?: number; bookmark?: string };
    try {
      const data = await search({ selector: { '@assetType': 'episodes' }, limit, bookmark });
      const result = data as { metadata: unknown; result: Record<string, unknown>[] };
      return { metadata: result.metadata, result: result.result.filter(e => !isJunkEpisode(e)) };
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  server.get('/episodes/:key', {
    schema: {
      tags: ['episodes'],
      summary: 'Get Episode by key',
      params: { type: 'object', properties: { key: { type: 'string' } }, required: ['key'] },
      response: { 200: episodeSchema, 404: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const { key } = request.params as { key: string };
    try {
      return await readAsset({ '@assetType': 'episodes', '@key': key });
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  server.post('/episodes', {
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    schema: {
      tags: ['episodes'],
      summary: 'Create Episode',
      body: createEpisodeBody,
      response: { 200: episodeSchema, 400: errorResponse, 409: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const body = request.body as Record<string, unknown>;
    try {
      return await createAsset([{ '@assetType': 'episodes', ...body }]);
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  server.put('/episodes', {
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    schema: {
      tags: ['episodes'],
      summary: 'Update Episode',
      body: updateEpisodeBody,
      response: { 200: episodeSchema, 400: errorResponse, 404: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const body = request.body as Record<string, unknown>;
    try {
      return await updateAsset({ '@assetType': 'episodes', ...body });
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  server.delete('/episodes', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    schema: {
      tags: ['episodes'],
      summary: 'Delete Episode',
      body: {
        type: 'object',
        required: ['season', 'episodeNumber'],
        properties: {
          season: seasonRef,
          episodeNumber: { type: 'integer', minimum: 1 },
        },
        additionalProperties: false,
      },
      response: { 200: episodeSchema, 400: errorResponse, 404: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const body = request.body as Record<string, unknown>;
    try {
      return await deleteAsset({ '@assetType': 'episodes', ...body });
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });
}
