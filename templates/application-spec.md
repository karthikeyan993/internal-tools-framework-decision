# Application specification: <name>

Status: Draft | Owner: <name> | Last reviewed: <date>

## Problem and users

Which employee task is improved? Who uses it, how often, and what makes the result successful? State non-goals and data sensitivity.

## Architecture choices

- Backend and reason: <Fastify or NestJS; link decision>
- Rendering: <CSR or SSR and concrete reason>
- Repository packages and deployment boundary: <paths and Cloud Run service>
- Persistence and integrations: <actual systems; consistency/transaction needs>
- IAP mode, allowed group, assertion audience configuration: <values or configuration references>

## Permissions

| Principal/role | Action | Record scope | Denied behavior |
| --- | --- | --- | --- |
| <role> | <read/edit/approve/export> | <which records> | <403 or chosen policy> |

## Primary workflow

Describe the complete success path, invalid input, unauthorized access, concurrent edits, downstream failure, and retry behavior. Specify API contracts and relevant audit events. Identify the browser-write CSRF strategy.

## UI

List screens and their list/detail/edit/dashboard patterns. Follow the repository design guide. Include loading, empty, error, and permission states; state timezone, freshness, and export requirements.

## Operational expectations

Record expected concurrency, data size, latency/error targets, startup tolerance, budget, support owner, and recovery expectations. Mark unknowns and how to measure them rather than inventing numbers.

## Acceptance evidence

List meaningful permission/contract/data/browser tests, staging validation, runbook, and linked ADRs. Clearly distinguish planned checks from completed results.
