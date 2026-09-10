# Framework comparison samples

These are two independent, copyable monorepos implementing the same access-request admin workflow:

- [`fastify-admin`](fastify-admin/README.md): Fastify plugins, hooks, schemas, and explicit dependency construction.
- [`nestjs-admin`](nestjs-admin/README.md): NestJS modules, providers, guards, pipes, and exception filters.

Both samples contain a React + Vite frontend, a TypeScript API, shared browser-safe contracts, Prisma ORM for PostgreSQL-compatible Cloud SQL, a memory adapter for zero-setup evaluation, a single-image Docker build, and Terraform for one Cloud Run service plus Cloud SQL.

They are evaluation applications, not production-ready starters. Compare the framework-specific `apps/api/src` directories; the product behavior and web application are intentionally equivalent.

## Verification snapshot

On 2026-09-10:

- `npm run check` passed in both samples: lint, strict types, three executed tests, and production builds.
- Each built API process served both the Vite SPA and `/api/summary` from one port in memory mode.
- The narrow responsive UI, semantic accessibility tree, and reviewer approval workflow were exercised in a browser.
- Each PostgreSQL integration suite contains one test that was skipped because no test database was available.
- Docker image builds, Terraform validation/apply, desktop-width visual QA, real PostgreSQL behavior, IAP, and deployed Cloud Run behavior were not verified in this environment.
- Dated npm audit findings are documented in each sample README and must be resolved or assessed before deployment.
