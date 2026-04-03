import Fastify from 'fastify';
import { env } from './config/env.js';
import { securityPlugins } from './plugins/security.js';
import { swaggerPlugin } from './plugins/swagger.js';
import { healthRoutes } from './routes/health.js';
import { tvShowsRoutes } from './routes/tvshows.js';
import { seasonsRoutes } from './routes/seasons.js';
import { episodesRoutes } from './routes/episodes.js';
import { watchlistRoutes } from './routes/watchlist.js';
import { cleanupRoutes } from './routes/cleanup.js';

async function buildServer() {
  const server = Fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'info' : 'debug',
      redact: ['req.headers.authorization'],
    },
    bodyLimit: 1048576,
    connectionTimeout: 10000,
  });

  await securityPlugins(server);
  await swaggerPlugin(server);

  await server.register(async (api) => {
    await api.register(healthRoutes);
    await api.register(tvShowsRoutes);
    await api.register(seasonsRoutes);
    await api.register(episodesRoutes);
    await api.register(watchlistRoutes);
    await api.register(cleanupRoutes);
  }, { prefix: '/api' });

  return server;
}

async function start() {
  try {
    const server = await buildServer();
    await server.listen({ port: env.PORT, host: '0.0.0.0' });
    server.log.info(`Server running on port ${env.PORT}`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
