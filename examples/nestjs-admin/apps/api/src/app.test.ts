import 'reflect-metadata';
import { afterEach, describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './app.module.js';
import { configureApp } from './configure-app.js';

let app: INestApplication | undefined;
afterEach(async () => app?.close());

describe('NestJS HTTP boundary', () => {
  it('validates review input and preserves JSON API errors', async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    configureApp(app);
    await app.init();

    await request(app.getHttpServer())
      .patch('/api/requests/018f94d8-e6b2-7c91-8f3a-5db144f7d101/review')
      .set('x-demo-role', 'reviewer')
      .send({ decision: 'APPROVED', note: '', version: 1 })
      .expect(400)
      .expect(({ body }) => expect(body).toMatchObject({ error: { code: 'VALIDATION_ERROR' } }));

    await request(app.getHttpServer())
      .get('/api/unknown')
      .expect(404)
      .expect('content-type', /json/)
      .expect(({ body }) => expect(body).toMatchObject({ error: { code: 'NOT_FOUND' } }));
  });
});
