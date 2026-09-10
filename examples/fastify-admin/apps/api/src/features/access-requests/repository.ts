import type { AccessRequest, RequestFilters, RequestStatus, ReviewRequestInput, SummaryResponse } from '@comparison/contracts';
import type { AppPrismaClient } from '../../database/prisma.js';
import { conflict, notFound } from '../../common/errors.js';
import type { Prisma } from '../../generated/prisma/client.js';

export interface AccessRequestRepository {
  list(filters: RequestFilters): Promise<{ items: AccessRequest[]; total: number }>;
  findById(id: string): Promise<AccessRequest | null>;
  summary(): Promise<Omit<SummaryResponse, 'generatedAt'>>;
  review(id: string, input: ReviewRequestInput): Promise<AccessRequest>;
}

function toContract(row: {
  id: string; requesterName: string; requesterEmail: string; systemName: string; reason: string;
  status: string; reviewerNote: string | null; createdAt: Date; updatedAt: Date; version: number;
}): AccessRequest {
  return { ...row, status: row.status as RequestStatus, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() };
}

export class PrismaAccessRequestRepository implements AccessRequestRepository {
  constructor(private readonly prisma: AppPrismaClient) {}

  async list(filters: RequestFilters) {
    const where: Prisma.AccessRequestWhereInput = {};
    if (filters.status) where.status = filters.status;
    if (filters.query) {
      where.OR = ['requesterName', 'requesterEmail', 'systemName'].map((field) => ({
        [field]: { contains: filters.query, mode: 'insensitive' }
      }));
    }
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.accessRequest.count({ where }),
      this.prisma.accessRequest.findMany({ where, orderBy: { updatedAt: 'desc' }, skip: (filters.page - 1) * filters.pageSize, take: filters.pageSize })
    ]);
    return { total, items: rows.map(toContract) };
  }

  async findById(id: string) {
    const row = await this.prisma.accessRequest.findUnique({ where: { id } });
    return row ? toContract(row) : null;
  }

  async summary() {
    const rows = await this.prisma.accessRequest.groupBy({ by: ['status'], _count: { _all: true } });
    const counts = { pending: 0, approved: 0, rejected: 0 };
    for (const row of rows) counts[row.status.toLowerCase() as keyof typeof counts] = row._count._all;
    return counts;
  }

  async review(id: string, input: ReviewRequestInput) {
    return this.prisma.$transaction(async (transaction) => {
      const result = await transaction.accessRequest.updateMany({
        where: { id, version: input.version, status: 'PENDING' },
        data: { status: input.decision, reviewerNote: input.note, version: { increment: 1 } }
      });
      if (result.count === 0) {
        const exists = await transaction.accessRequest.count({ where: { id } });
        throw exists === 0 ? notFound() : conflict();
      }
      return toContract(await transaction.accessRequest.findUniqueOrThrow({ where: { id } }));
    });
  }
}
