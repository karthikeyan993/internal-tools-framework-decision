import type { AccessRequest, RequestFilters, ReviewRequestInput } from '@comparison/contracts';
import { conflict, notFound } from '../../common/errors.js';
import type { AccessRequestRepository } from './repository.js';

const now = new Date().toISOString();
const seed: AccessRequest[] = [
  { id: '018f94d8-e6b2-7c91-8f3a-5db144f7d101', requesterName: 'Asha Nair', requesterEmail: 'asha@example.com', systemName: 'Finance Console', reason: 'Quarter-end reconciliation and variance investigation.', status: 'PENDING', reviewerNote: null, createdAt: now, updatedAt: now, version: 1 },
  { id: '018f94d8-e6b2-7c91-8f3a-5db144f7d102', requesterName: 'Mateo Silva', requesterEmail: 'mateo@example.com', systemName: 'Customer Data Hub', reason: 'Support escalation analysis for enterprise accounts.', status: 'PENDING', reviewerNote: null, createdAt: now, updatedAt: now, version: 1 },
  { id: '018f94d8-e6b2-7c91-8f3a-5db144f7d103', requesterName: 'Priya Raman', requesterEmail: 'priya@example.com', systemName: 'Vendor Portal', reason: 'Review and approve onboarding documentation.', status: 'APPROVED', reviewerNote: 'Approved for the procurement rotation.', createdAt: now, updatedAt: now, version: 2 }
];

export class MemoryAccessRequestRepository implements AccessRequestRepository {
  private readonly rows = seed.map((row) => ({ ...row }));

  async list(filters: RequestFilters) {
    const query = filters.query?.toLowerCase();
    const filtered = this.rows.filter((row) =>
      (!filters.status || row.status === filters.status) &&
      (!query || [row.requesterName, row.requesterEmail, row.systemName].some((value) => value.toLowerCase().includes(query)))
    );
    const offset = (filters.page - 1) * filters.pageSize;
    return { total: filtered.length, items: filtered.slice(offset, offset + filters.pageSize).map((row) => ({ ...row })) };
  }

  async findById(id: string) {
    const row = this.rows.find((candidate) => candidate.id === id);
    return row ? { ...row } : null;
  }

  async summary() {
    return {
      pending: this.rows.filter((row) => row.status === 'PENDING').length,
      approved: this.rows.filter((row) => row.status === 'APPROVED').length,
      rejected: this.rows.filter((row) => row.status === 'REJECTED').length
    };
  }

  async review(id: string, input: ReviewRequestInput) {
    const row = this.rows.find((candidate) => candidate.id === id);
    if (!row) throw notFound();
    if (row.version !== input.version || row.status !== 'PENDING') throw conflict();
    row.status = input.decision;
    row.reviewerNote = input.note;
    row.version += 1;
    row.updatedAt = new Date().toISOString();
    return { ...row };
  }
}
