import type { FastifyInstance } from 'fastify';
import { search, readAsset, createAsset, updateAsset, deleteAsset } from '../clients/goledger.js';
import { searchQuerystring, paginationMetadata, errorResponse } from '../schemas/common.schema.js';
import { seasonSchema } from '../schemas/seasons.schema.js';
import { isJunkSeason } from '../services/data-filter.js';

const tvShowRef = {
  type: 'object' as const,
  required: ['@assetType', 'title'],
  properties: {
    '@assetType': { type: 'string', const: 'tvShows' },
    title: { type: 'string', minLength: 1 },
  },
};

const createSeasonBody = {
  type: 'object' as const,
  required: ['number', 'tvShow', 'year'],
  properties: {
    number: { type: 'integer', minimum: 1 },
    tvShow: tvShowRef,
    year: { type: 'integer', minimum: 1900, maximum: 2100 },
  },
  additionalProperties: false,
};

const updateSeasonBody = {
  type: 'object' as const,
  required: ['number', 'tvShow'],
  properties: {
    number: { type: 'integer', minimum: 1 },
    tvShow: tvShowRef,
    year: { type: 'integer', minimum: 1900, maximum: 2100 },
  },
  additionalProperties: false,
};

export async function seasonsRoutes(server: FastifyInstance): Promise<void> {
  server.get('/seasons', {
    schema: {
      tags: ['seasons'],
      summary: 'List Seasons',
      querystring: searchQuerystring,
      response: {
        200: { type: 'object', properties: { metadata: paginationMetadata, result: { type: 'array', items: seasonSchema } } },
        502: errorResponse,
      },
    },
  }, async (request, reply) => {
    const { limit = 20, bookmark = '' } = request.query as { limit?: number; bookmark?: string };
    try {
      const data = await search({ selector: { '@assetType': 'seasons' }, limit, bookmark });
      const result = data as { metadata: unknown; result: Record<string, unknown>[] };
      return { metadata: result.metadata, result: result.result.filter(s => !isJunkSeason(s)) };
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  server.get('/seasons/:key', {
    schema: {
      tags: ['seasons'],
      summary: 'Get Season by key',
      params: { type: 'object', properties: { key: { type: 'string' } }, required: ['key'] },
      response: { 200: seasonSchema, 404: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const { key } = request.params as { key: string };
    try {
      return await readAsset({ '@assetType': 'seasons', '@key': key });
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  server.post('/seasons', {
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    schema: {
      tags: ['seasons'],
      summary: 'Create Season',
      body: createSeasonBody,
      response: { 200: seasonSchema, 400: errorResponse, 409: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const body = request.body as Record<string, unknown>;
    try {
      return await createAsset([{ '@assetType': 'seasons', ...body }]);
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  server.put('/seasons', {
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    schema: {
      tags: ['seasons'],
      summary: 'Update Season',
      body: updateSeasonBody,
      response: { 200: seasonSchema, 400: errorResponse, 404: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const body = request.body as Record<string, unknown>;
    try {
      return await updateAsset({ '@assetType': 'seasons', ...body });
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  server.delete('/seasons', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    schema: {
      tags: ['seasons'],
      summary: 'Delete Season',
      body: {
        type: 'object',
        required: ['number', 'tvShow'],
        properties: {
          number: { type: 'integer', minimum: 1 },
          tvShow: tvShowRef,
        },
        additionalProperties: false,
      },
      response: { 200: seasonSchema, 400: errorResponse, 404: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const body = request.body as Record<string, unknown>;
    try {
      return await deleteAsset({ '@assetType': 'seasons', ...body });
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });
}
