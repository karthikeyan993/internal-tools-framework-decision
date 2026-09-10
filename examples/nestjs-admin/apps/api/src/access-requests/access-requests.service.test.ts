import { describe, expect, it } from 'vitest';
import { AccessRequestsService } from './access-requests.service.js';
import { MemoryAccessRequestRepository } from './memory.repository.js';

describe('AccessRequestsService', () => {
  it('allows a reviewer to approve a pending request', async () => {
    const service = new AccessRequestsService(new MemoryAccessRequestRepository());
    const result = await service.review({ email: 'reviewer@example.test', role: 'reviewer' }, '018f94d8-e6b2-7c91-8f3a-5db144f7d101', { decision: 'APPROVED', note: 'Required for assigned duties.', version: 1 });
    expect(result.status).toBe('APPROVED');
    expect(result.version).toBe(2);
  });

  it('denies mutation to a viewer', async () => {
    const service = new AccessRequestsService(new MemoryAccessRequestRepository());
    await expect(service.review({ email: 'viewer@example.test', role: 'viewer' }, '018f94d8-e6b2-7c91-8f3a-5db144f7d101', { decision: 'REJECTED', note: 'Not authorized.', version: 1 })).rejects.toMatchObject({ code: 'FORBIDDEN', statusCode: 403 });
  });
});
