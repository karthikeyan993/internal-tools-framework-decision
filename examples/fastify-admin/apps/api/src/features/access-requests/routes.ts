import type { FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';
import type { RequestFilters, ReviewRequestInput } from '@comparison/contracts';
import type { AccessRequestRepository } from './repository.js';
import { AccessRequestService } from './service.js';

const Status = Type.Union([Type.Literal('PENDING'), Type.Literal('APPROVED'), Type.Literal('REJECTED')]);

export const accessRequestRoutes: FastifyPluginAsync<{ repository: AccessRequestRepository }> = async (app, options) => {
  const service = new AccessRequestService(options.repository);

  app.get('/requests', {
    schema: {
      querystring: Type.Object({
        query: Type.Optional(Type.String({ maxLength: 120 })),
        status: Type.Optional(Status),
        page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
        pageSize: Type.Optional(Type.Integer({ minimum: 1, maximum: 50, default: 20 }))
      }, { additionalProperties: false })
    }
  }, async (request) => {
    const query = request.query as Partial<RequestFilters>;
    return service.list({ page: query.page ?? 1, pageSize: query.pageSize ?? 20, ...(query.query ? { query: query.query } : {}), ...(query.status ? { status: query.status } : {}) });
  });

  app.get('/requests/:id', {
    schema: { params: Type.Object({ id: Type.String({ format: 'uuid' }) }, { additionalProperties: false }) }
  }, async (request) => service.get((request.params as { id: string }).id));

  app.get('/summary', async () => service.summary());

  app.patch('/requests/:id/review', {
    schema: {
      params: Type.Object({ id: Type.String({ format: 'uuid' }) }, { additionalProperties: false }),
      body: Type.Object({
        decision: Type.Union([Type.Literal('APPROVED'), Type.Literal('REJECTED')]),
        note: Type.String({ minLength: 3, maxLength: 500 }),
        version: Type.Integer({ minimum: 1 })
      }, { additionalProperties: false })
    }
  }, async (request) => service.review(request.principal, (request.params as { id: string }).id, request.body as ReviewRequestInput));
};
