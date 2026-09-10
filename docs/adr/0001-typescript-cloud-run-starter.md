# ADR 0001: TypeScript Cloud Run starter

- Status: Proposed
- Date: 2026-09-09
- Decision owner: To be assigned before acceptance
- Scope: Future internal websites
- Supersedes: None
- Superseded by: None

## Context

The team builds company-only tools and dashboards, primarily using GCP Cloud Run and functions with IAP. Application code is restricted to TypeScript and developed through AI agents. Fastify is the frontrunner; NestJS remains under consideration. SSR has been discussed conditionally, not adopted as a requirement.

## Options considered

- Fastify with a reviewed starter: integrated API foundations and flexible structure; the team owns conventions.
- NestJS: prescribed modules/controllers/services and dependency injection; more framework concepts.
- Hono: small HTTP interface and typed client option; more application conventions to assemble.
- Next.js or React Router Framework Mode if React SSR is required: combines rendering and server capabilities, changing the scope of the backend decision.

## Decision

Propose React + Vite with Fastify for a CSR application, using one repository and one Cloud Run service initially. Keep NestJS as the documented alternative. Separate websites into independently deployable apps only when access, ownership, or release requirements justify it.

## Consequences

The team must maintain a shared starter, schema/contract approach, authorization pattern, and meaningful checks. AI-generated code does not remove these responsibilities. Rendering, database choice, actual IAM policies, and capacity limits still require application-specific decisions.

## Validation and reversal

No application benchmark or deployment has been performed. Implement one real workflow and assess maintainability, permissions, production build, and operational behavior. Reconsider NestJS if architectural variation becomes costly. Revisit the rendering decision if SSR becomes mandatory.

## References

- [Framework recommendation](../../framework-decision.md)
- [Shared architecture](../architecture.md)
- [Fastify blueprint](../blueprints/fastify.md)
- [NestJS blueprint](../blueprints/nestjs.md)
