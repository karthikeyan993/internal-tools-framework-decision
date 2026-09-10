import type { RequestFilters, ReviewRequestInput } from '@comparison/contracts';
import { forbidden, notFound } from '../../common/errors.js';
import type { Principal } from '../../identity/identity.plugin.js';
import type { AccessRequestRepository } from './repository.js';

export class AccessRequestService {
  constructor(private readonly repository: AccessRequestRepository) {}

  async list(filters: RequestFilters) {
    const result = await this.repository.list(filters);
    return { ...result, page: filters.page, pageSize: filters.pageSize };
  }

  async get(id: string) {
    const request = await this.repository.findById(id);
    if (!request) throw notFound();
    return request;
  }

  async summary() {
    return { ...(await this.repository.summary()), generatedAt: new Date().toISOString() };
  }

  async review(principal: Principal, id: string, input: ReviewRequestInput) {
    if (principal.role !== 'reviewer') throw forbidden();
    return this.repository.review(id, { ...input, note: input.note.trim() });
  }
}
