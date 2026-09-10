export const requestStatuses = ['PENDING', 'APPROVED', 'REJECTED'] as const;
export type RequestStatus = (typeof requestStatuses)[number];

export const decisions = ['APPROVED', 'REJECTED'] as const;
export type ReviewDecision = (typeof decisions)[number];

export type DemoRole = 'viewer' | 'reviewer';

export interface AccessRequest {
  id: string;
  requesterName: string;
  requesterEmail: string;
  systemName: string;
  reason: string;
  status: RequestStatus;
  reviewerNote: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface RequestFilters {
  query?: string;
  status?: RequestStatus;
  page: number;
  pageSize: number;
}

export interface RequestListResponse {
  items: AccessRequest[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ReviewRequestInput {
  decision: ReviewDecision;
  note: string;
  version: number;
}

export interface SummaryResponse {
  pending: number;
  approved: number;
  rejected: number;
  generatedAt: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    requestId?: string;
    fields?: Record<string, string>;
  };
}
