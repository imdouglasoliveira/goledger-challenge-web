import type { FastifyInstance } from 'fastify';
import { search, readAsset, createAsset, updateAsset, deleteAsset } from '../clients/goledger.js';
import { searchQuerystring, paginationMetadata, errorResponse } from '../schemas/common.schema.js';
import { tvShowSchema } from '../schemas/tvshows.schema.js';
import { loadImageCache, getShowImages, fetchAndCacheImage } from '../services/image-cache.js';
import { isJunkTvShow } from '../services/data-filter.js';

const createTvShowBody = {
  type: 'object' as const,
  required: ['title', 'description', 'recommendedAge'],
  properties: {
    title: { type: 'string', minLength: 2, maxLength: 200 },
    description: { type: 'string', minLength: 10, maxLength: 2000 },
    recommendedAge: { type: 'integer', minimum: 0, maximum: 18 },
  },
  additionalProperties: false,
};

const updateTvShowBody = {
  type: 'object' as const,
  required: ['title'],
  properties: {
    title: { type: 'string', minLength: 2, maxLength: 200 },
    description: { type: 'string', minLength: 10, maxLength: 2000 },
    recommendedAge: { type: 'integer', minimum: 0, maximum: 18 },
  },
  additionalProperties: false,
};

function sanitizeTvShowPayload(payload: Record<string, unknown>) {
  const sanitized = { ...payload };

  if (typeof sanitized.title === 'string') {
    sanitized.title = sanitized.title.trim();
  }

  if (typeof sanitized.description === 'string') {
    sanitized.description = sanitized.description.trim();
  }

  return sanitized;
}

function validateTvShowPayload(
  payload: Record<string, unknown>,
  options: { requireDescription: boolean },
) {
  const { requireDescription } = options;

  if (typeof payload.title !== 'string' || payload.title.length < 2 || payload.title.length > 200) {
    return 'Titulo deve ter entre 2 e 200 caracteres';
  }

  if (requireDescription || payload.description !== undefined) {
    if (
      typeof payload.description !== 'string' ||
      payload.description.length < 10 ||
      payload.description.length > 2000
    ) {
      return 'Descricao deve ter entre 10 e 2000 caracteres';
    }
  }

  if (payload.recommendedAge !== undefined) {
    if (
      typeof payload.recommendedAge !== 'number' ||
      !Number.isInteger(payload.recommendedAge) ||
      payload.recommendedAge < 0 ||
      payload.recommendedAge > 18
    ) {
      return 'Idade deve ser um numero inteiro entre 0 e 18';
    }
  }

  return null;
}

function enrichWithImages(show: Record<string, unknown>): Record<string, unknown> {
  const title = show.title as string;
  const images = getShowImages(title);
  return {
    ...show,
    posterUrl: images?.posterUrl || null,
    backdropUrl: images?.backdropUrl || null,
  };
}

export async function tvShowsRoutes(server: FastifyInstance): Promise<void> {
  loadImageCache();
  // LIST
  server.get('/tvshows', {
    schema: {
      tags: ['tvShows'],
      summary: 'List TV Shows',
      querystring: searchQuerystring,
      response: {
        200: {
          type: 'object',
          properties: {
            metadata: paginationMetadata,
            result: { type: 'array', items: tvShowSchema },
          },
        },
        502: errorResponse,
      },
    },
  }, async (request, reply) => {
    const { limit = 20, bookmark = '' } = request.query as { limit?: number; bookmark?: string };
    try {
      const data = await search({ selector: { '@assetType': 'tvShows' }, limit, bookmark });
      const result = data as { metadata: unknown; result: Record<string, unknown>[] };

      const clean = result.result.filter(show => !isJunkTvShow(show));
      const enriched = clean.map(show => {
        const enrichedShow = enrichWithImages(show);
        if (!enrichedShow.posterUrl && typeof show.title === 'string') {
          fetchAndCacheImage(show.title).catch(() => {});
        }
        return enrichedShow;
      });

      return {
        metadata: result.metadata,
        result: enriched,
      };
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  // GET BY KEY
  server.get('/tvshows/:key', {
    schema: {
      tags: ['tvShows'],
      summary: 'Get TV Show by key',
      params: {
        type: 'object',
        properties: { key: { type: 'string' } },
        required: ['key'],
      },
      response: { 200: tvShowSchema, 404: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const { key } = request.params as { key: string };
    try {
      const show = await readAsset({ '@assetType': 'tvShows', '@key': key });
      const enrichedShow = enrichWithImages(show as Record<string, unknown>);
      if (!enrichedShow.posterUrl && typeof enrichedShow.title === 'string') {
        fetchAndCacheImage(enrichedShow.title).catch(() => {});
      }
      return enrichedShow;
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  // CREATE
  server.post('/tvshows', {
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    schema: {
      tags: ['tvShows'],
      summary: 'Create TV Show',
      body: createTvShowBody,
      response: { 200: tvShowSchema, 400: errorResponse, 409: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const body = sanitizeTvShowPayload(request.body as Record<string, unknown>) as {
      title: string;
      description: string;
      recommendedAge: number;
    };
    try {
      const validationError = validateTvShowPayload(body, { requireDescription: true });
      if (validationError) {
        reply.status(400);
        return { error: validationError, statusCode: 400 };
      }

      const existing = await search({
        selector: { '@assetType': 'tvShows', title: body.title },
        limit: 1,
      }) as { result?: unknown[] };
      if (existing.result && existing.result.length > 0) {
        reply.status(409);
        return { error: `TV Show "${body.title}" já existe`, statusCode: 409 };
      }
      const created = await createAsset([{ '@assetType': 'tvShows', ...body }]);

      fetchAndCacheImage(body.title).catch(() => {});

      return created;
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  // UPDATE
  server.put('/tvshows', {
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    schema: {
      tags: ['tvShows'],
      summary: 'Update TV Show',
      body: updateTvShowBody,
      response: { 200: tvShowSchema, 400: errorResponse, 404: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const body = sanitizeTvShowPayload(request.body as Record<string, unknown>);
    try {
      const validationError = validateTvShowPayload(body, { requireDescription: false });
      if (validationError) {
        reply.status(400);
        return { error: validationError, statusCode: 400 };
      }

      return await updateAsset({ '@assetType': 'tvShows', ...body });
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });

  // DELETE
  server.delete('/tvshows', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    schema: {
      tags: ['tvShows'],
      summary: 'Delete TV Show',
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 1 },
        },
        additionalProperties: false,
      },
      response: { 200: tvShowSchema, 400: errorResponse, 404: errorResponse, 502: errorResponse },
    },
  }, async (request, reply) => {
    const { title } = request.body as { title: string };
    try {
      return await deleteAsset({ '@assetType': 'tvShows', title });
    } catch (err: any) {
      reply.status(err.status || 502);
      return { error: err.message, statusCode: err.status || 502 };
    }
  });
}
