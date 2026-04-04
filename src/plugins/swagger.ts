import type { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

export async function swaggerPlugin(server: FastifyInstance) {
  const { default: scalarApiReference } = await import('@scalar/fastify-api-reference');

  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'GoLedger BFF API',
        description: 'API intermediaria entre o frontend e a blockchain GoLedger',
        version: '1.0.0',
      },
      tags: [
        { name: 'health', description: 'Verificacao de saude da API' },
        { name: 'tvShows', description: 'CRUD de series de TV' },
        { name: 'seasons', description: 'CRUD de temporadas' },
        { name: 'episodes', description: 'CRUD de episodios' },
        { name: 'watchlist', description: 'CRUD de listas de exibicao' },
        { name: 'cleanup', description: 'Limpeza de dados sujos/invalidos' },
      ],
    },
  });

  await server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });

  await server.register(scalarApiReference, {
    routePrefix: '/reference',
  });
}
