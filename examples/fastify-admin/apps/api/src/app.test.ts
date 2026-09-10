import { afterEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from './app.js';
import { MemoryAccessRequestRepository } from './features/access-requests/memory.repository.js';

let app: FastifyInstance | undefined;
afterEach(async () => app?.close());

describe('Fastify HTTP boundary', () => {
  it('validates review input and preserves JSON API errors', async () => {
    app = await buildApp({ repository: new MemoryAccessRequestRepository(), serveWeb: false });
    const invalid = await app.inject({
      method: 'PATCH',
      url: '/api/requests/018f94d8-e6b2-7c91-8f3a-5db144f7d101/review',
      headers: { 'x-demo-role': 'reviewer' },
      payload: { decision: 'APPROVED', note: '', version: 1 }
    });
    expect(invalid.statusCode).toBe(400);
    expect(invalid.json()).toMatchObject({ error: { code: 'VALIDATION_ERROR' } });

    const missing = await app.inject({ method: 'GET', url: '/api/unknown' });
    expect(missing.statusCode).toBe(404);
    expect(missing.headers['content-type']).toContain('application/json');
  });
});
