import path from 'node:path';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { AppError } from './common/errors.js';
import { createPrismaClient } from './database/prisma.js';
import { accessRequestRoutes } from './features/access-requests/routes.js';
import { MemoryAccessRequestRepository } from './features/access-requests/memory.repository.js';
import { PrismaAccessRequestRepository, type AccessRequestRepository } from './features/access-requests/repository.js';
import { identityPlugin } from './identity/identity.plugin.js';

export interface BuildAppOptions {
  repository?: AccessRequestRepository;
  serveWeb?: boolean;
}

export async function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify({ logger: { level: process.env.LOG_LEVEL ?? 'info', redact: ['req.headers.authorization', 'req.headers.x-goog-iap-jwt-assertion'] } });
  await app.register(identityPlugin);

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ error: { code: error.code, message: error.message, requestId: request.id, ...(error.fields ? { fields: error.fields } : {}) } });
    }
    if (typeof error === 'object' && error !== null && 'validation' in error && error.validation) {
      return reply.code(400).send({ error: { code: 'VALIDATION_ERROR', message: 'Check the submitted fields and try again.', requestId: request.id } });
    }
    request.log.error({ err: error }, 'Unhandled request error');
    return reply.code(500).send({ error: { code: 'INTERNAL_ERROR', message: 'The service could not complete the request.', requestId: request.id } });
  });

  let repository = options.repository;
  if (!repository && (process.env.DATABASE_MODE ?? 'memory') === 'memory') repository = new MemoryAccessRequestRepository();
  if (!repository) {
    const prisma = createPrismaClient();
    await prisma.$connect();
    app.addHook('onClose', async () => prisma.$disconnect());
    repository = new PrismaAccessRequestRepository(prisma);
  }

  await app.register(accessRequestRoutes, { prefix: '/api', repository });
  app.get('/health/live', async () => ({ ok: true }));

  if (options.serveWeb !== false) {
    const root = process.env.WEB_DIST_DIR ?? path.join(import.meta.dirname, '../../web/dist');
    await app.register(fastifyStatic, { root, wildcard: false, maxAge: '30d', immutable: true });
    app.setNotFoundHandler((request, reply) => {
      if (request.url.startsWith('/api/')) return reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'API route not found.', requestId: request.id } });
      if (request.method === 'GET') return reply.sendFile('index.html', { maxAge: 0, immutable: false });
      return reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Route not found.', requestId: request.id } });
    });
  }

  return app;
}
