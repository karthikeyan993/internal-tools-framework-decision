---
name: internal-tool-feature
description: Design or implement a backend-backed feature for this repository's TypeScript internal tools, following the selected Fastify or NestJS blueprint, IAP permissions, contracts, and behavioral verification.
---

# Internal tool feature

Locate the repository root using its AGENTS.md and package.json. All project paths below are relative to that root, including when this skill is loaded from a generated harness directory.

Read `docs/architecture.md`, the app's specification and relevant ADRs, and the selected blueprint in `docs/blueprints/`. Check whether an implementation actually exists. Do not substitute a proposed blueprint for evidence of working code or create both backends by default.

Use `templates/feature-spec.md` when the requested feature needs a written specification. Follow the nearest implemented feature, preserving browser/server boundaries and existing contract conventions. Keep record-scope and action permissions in the use case, with verified IAP identity at the HTTP boundary.

Implement a complete slice: input validation, authorized behavior, public response/error shape, data-integrity rules, and relevant UI handling. Define retry/conflict behavior for mutations. Use the existing database/test setup rather than inventing successful mocks for material database behavior.

Verify meaningful allowed/denied access, invalid input, and relevant failure paths. Run actual app checks and report what ran. For deployment work, consult `docs/production-readiness.md` and the app runbook; completing code does not establish deployment success. Propose an ADR only for a consequential architecture change.
