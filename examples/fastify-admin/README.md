# Fastify admin comparison

An evaluation monorepo showing React + Vite and a Fastify API in one Cloud Run container. It implements the same access-review workflow as the NestJS sample.

## Explore the structure

```text
apps/web/                         React admin UI
apps/api/src/app.ts               Fastify composition and lifecycle
apps/api/src/identity/            shared request hook
apps/api/src/features/            route → service → repository slice
apps/api/src/database/            Prisma/Cloud SQL construction
apps/api/prisma/                  schema, migration, and demo seed
packages/contracts/               browser-safe API types
infra/                            Cloud Run + Cloud SQL Terraform
```

The framework-specific idea is explicit composition: plugins add cross-cutting behavior, route plugins own HTTP mapping, services own permissions/use cases, and repository implementations own persistence.

## Run without a database

```bash
cp apps/api/.env.example apps/api/.env
npm install
npm run dev
```

Open `http://localhost:5173`. `DATABASE_MODE=memory` is deliberately non-production and resets on API restart.

## Run with local PostgreSQL

```bash
docker compose up -d
DATABASE_URL=postgresql://admin:admin@localhost:5432/admin npm run db:migrate
DATABASE_URL=postgresql://admin:admin@localhost:5432/admin npm run db:seed
DATABASE_MODE=prisma DATABASE_URL=postgresql://admin:admin@localhost:5432/admin npm run dev
```

Run `npm run check` for lint, strict types, tests, and production builds. Set `TEST_DATABASE_URL` to include the opt-in repository integration test.

## Single deployment

The multi-stage Dockerfile builds both workspaces and copies the Vite output beside the API. Fastify serves `/api/*`, `/health/live`, static assets, and the SPA fallback from one `PORT`.

Terraform under `infra/` demonstrates a private-by-default Cloud Run service, PostgreSQL Cloud SQL instance, Secret Manager password, least-purpose runtime service account, bounded instance count, and a Cloud SQL socket mount. It intentionally does not grant public invocation or configure IAP. Review cost, availability, deletion protection, IAM, IAP, migrations, and secret-version rollout before applying it.

This is not production-ready: demo identity headers are not authentication, browser-write CSRF is not implemented, and operational values are illustrative.

### Dependency audit note

On 2026-09-10, `npm audit --omit=dev` reported four high-severity findings through Prisma CLI/configuration transitive dependencies. The affected configuration merge path consumes trusted build configuration in this sample, but the dependency graph is not clean and must be re-evaluated before deployment. No forced transitive overrides are included because the patched dependency majors have not been compatibility-tested by Prisma 7.10.0.
