// Shared JSON Schemas for Fastify route validation and OpenAPI docs

export const searchQuerystring = {
  type: 'object' as const,
  properties: {
    limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
    bookmark: { type: 'string', default: '' },
  },
};

export const paginationMetadata = {
  type: 'object' as const,
  properties: {
    bookmark: { type: 'string' },
    fetched_records_count: { type: 'integer' },
  },
};

export const errorResponse = {
  type: 'object' as const,
  properties: {
    error: { type: 'string' },
    statusCode: { type: 'integer' },
  },
};
