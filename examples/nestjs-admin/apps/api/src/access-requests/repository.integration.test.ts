import { describe, expect, it } from 'vitest';
import { createPrismaClient } from '../database/prisma.js';
import { PrismaAccessRequestRepository } from './repository.js';

const run = process.env.TEST_DATABASE_URL ? describe : describe.skip;
run('PrismaAccessRequestRepository', () => {
  it('executes list and summary against PostgreSQL', async () => {
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    const prisma = createPrismaClient();
    try {
      const repository = new PrismaAccessRequestRepository(prisma);
      const list = await repository.list({ page: 1, pageSize: 10 });
      const summary = await repository.summary();
      expect(list.total).toBeGreaterThanOrEqual(0);
      expect(summary.pending + summary.approved + summary.rejected).toBe(list.total);
    } finally {
      await prisma.$disconnect();
    }
  });
});
