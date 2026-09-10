# Fastify versus NestJS sample map

Start both samples in memory mode and perform the same workflow. Then compare these equivalent responsibilities:

| Responsibility | Fastify | NestJS |
| --- | --- | --- |
| Composition root | `fastify-admin/apps/api/src/app.ts` | `nestjs-admin/apps/api/src/app.module.ts` |
| HTTP mapping | `features/access-requests/routes.ts` | `access-requests/access-requests.controller.ts` |
| Business rules | `features/access-requests/service.ts` | `access-requests/access-requests.service.ts` |
| Dependency binding | Constructor options and plugin registration | Module provider token and constructor injection |
| Identity boundary | Shared `onRequest` hook | Global `CanActivate` guard and parameter decorator |
| Validation | Route-local TypeBox schema | DTO decorators and global `ValidationPipe` |
| Error mapping | Registered Fastify error handler | Global Nest exception filter |
| Lifecycle | `onClose` hook | `OnModuleInit` / `OnModuleDestroy` service |
| Static React build | `@fastify/static` and explicit SPA fallback | `ServeStaticModule` |
| HTTP test | Fastify `inject()` without a socket | Nest testing module plus Supertest/Express |

## What this comparison can answer

- Which request path is easier for the team to trace and debug?
- Does Nest's explicit module/provider vocabulary reduce variation enough to justify its additional files and decorators?
- Is Fastify's plugin encapsulation understandable after one complete feature?
- Which validation and dependency-replacement approach is clearer in tests?

## What it cannot answer

The samples do not establish production security, Cloud Run or Cloud SQL performance, IAP behavior, database recovery, operational cost, or long-term maintainability. The PostgreSQL repository integration test, Terraform validation/apply, container build, and deployed IAP workflow still require an environment that provides those systems.
