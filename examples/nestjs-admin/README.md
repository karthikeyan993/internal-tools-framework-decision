# NestJS admin comparison

An evaluation monorepo showing React + Vite and a NestJS API in one Cloud Run container. It implements the same access-review workflow as the Fastify sample.

## Explore the structure

```text
apps/web/                         React admin UI
apps/api/src/app.module.ts        Nest composition root
apps/api/src/identity/            global guard and principal decorator
apps/api/src/access-requests/     module/controller/service/repository slice
apps/api/src/database/            provider token and Prisma lifecycle
apps/api/prisma/                  schema, migration, and demo seed
packages/contracts/               browser-safe API types
infra/                            Cloud Run + Cloud SQL Terraform
```

The framework-specific idea is dependency injection: modules declare boundaries, providers are bound to tokens, controllers own HTTP mapping, guards authorize entry, pipes validate DTOs, and exception filters map errors.

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

The multi-stage Dockerfile builds both workspaces and copies the Vite output beside the API. `ServeStaticModule` serves the SPA while controllers own `/api/*`; both use one `PORT`.

Terraform under `infra/` demonstrates a private-by-default Cloud Run service, PostgreSQL Cloud SQL instance, Secret Manager password, least-purpose runtime service account, bounded instance count, and a Cloud SQL socket mount. It intentionally does not grant public invocation or configure IAP. Review cost, availability, deletion protection, IAM, IAP, migrations, and secret-version rollout before applying it.

This is not production-ready: demo identity headers are not authentication, browser-write CSRF is not implemented, and operational values are illustrative.

### Dependency audit note

On 2026-09-10, `npm audit --omit=dev` reported eight high-severity findings: the same Prisma CLI/configuration transitive findings as the Fastify sample, plus findings through Nest's Express adapter dependency on Multer 2.2.0. This sample does not register file-upload routes, but the dependency graph is not clean and must be resolved or formally assessed before deployment. No forced transitive overrides are included because Nest 12.0.1 pins that Multer version exactly.
