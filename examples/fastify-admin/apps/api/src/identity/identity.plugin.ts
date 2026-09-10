import fp from 'fastify-plugin';
import type { DemoRole } from '@comparison/contracts';

export interface Principal {
  email: string;
  role: DemoRole;
}

declare module 'fastify' {
  interface FastifyRequest {
    principal: Principal;
  }
}

export const identityPlugin = fp(async (app) => {
  app.decorateRequest('principal');
  app.addHook('onRequest', async (request) => {
    const requestedRole = request.headers['x-demo-role'];
    const role: DemoRole = requestedRole === 'viewer' ? 'viewer' : 'reviewer';
    request.principal = { email: `${role}@example.test`, role };
  });
}, { name: 'demo-identity' });
