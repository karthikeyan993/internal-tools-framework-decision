# Application specification: Access review comparison

Status: Draft | Owner: To be assigned | Last reviewed: 2026-09-10

## Problem and users

Reviewers need to inspect pending internal-system access requests and approve or reject them. This sample exists to compare framework structure, not to model a real company's access policy or production data.

## Architecture choices

- Backend: Fastify, following the repository Fastify blueprint.
- Rendering: React + Vite client-side rendering.
- Packages: `apps/web`, `apps/api`, and `packages/contracts`; one container and one Cloud Run service.
- Persistence: Prisma with PostgreSQL for Cloud SQL; an explicitly non-production memory adapter supports evaluation without infrastructure.
- Identity: demo headers only. Production IAP assertion verification is intentionally not claimed or implemented.

## Permissions

| Principal/role | Action | Record scope | Denied behavior |
| --- | --- | --- | --- |
| viewer | list/read | all demo records | mutation returns 403 |
| reviewer | list/read/review | all demo records | stale or completed review returns 409 |

## Primary workflow

Users filter and select requests, then reviewers approve or reject a pending request with a required note. The API validates input and uses the record version plus pending status for optimistic conflict detection. This sample does not define production audit retention, IAP, or CSRF controls.

## UI

One responsive list/detail screen includes loading, empty, no-result, error, denied, mutation-progress, success, and conflict recovery states.

## Operational expectations

Unknown until measured. Terraform demonstrates bounded Cloud Run instances and a bounded per-instance database pool; values are examples requiring review.

## Acceptance evidence

Planned: lint, strict type checks, service/HTTP tests, production build, PostgreSQL repository integration test, responsive browser check, and Terraform validation. Results belong in the sample README and must distinguish executed from unexecuted checks.
