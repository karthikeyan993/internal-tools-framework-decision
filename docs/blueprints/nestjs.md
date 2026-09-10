# NestJS starter blueprint

Status: design only. Intended for React + Vite dashboards with a NestJS TypeScript API, following the [shared architecture](../architecture.md).

## Application shape

```text
apps/admin/
  web/src/
    app/
    features/employees/
  api/src/
    main.ts                 # bootstrap, listen, shutdown hooks
    app.module.ts           # composition root
    config/                 # validated server configuration
    identity/
      identity.module.ts
      iap.guard.ts          # verify assertion, attach principal
    common/
      errors.filter.ts      # public error contract
      request-logging.interceptor.ts
    employees/
      employees.module.ts
      employees.controller.ts
      employees.service.ts
      employees.repository.ts
      dto/
        update-employee.dto.ts
    health/
  api/test/
    employees.e2e-spec.ts
    identity.e2e-spec.ts
  Dockerfile
packages/contracts/
```

## Establish these conventions once

1. Each business feature owns a module. Controllers translate HTTP; services hold use cases and permissions. Export only services intended for other modules. Avoid a catch-all shared module and circular dependencies.
2. Choose the HTTP adapter explicitly. Express is Nest's default; Fastify is optional. The Fastify adapter does not automatically enable Fastify route-schema validation for Nest DTOs. Verify adapter support for every plugin, static-serving mechanism, and middleware integration.
3. Use global `ValidationPipe` configuration with the chosen DTO validation dependencies. Proposed baseline: reject unknown fields and avoid broad implicit type conversion; explicitly parse query parameters. TypeScript annotations alone do not validate requests.
4. Apply a global identity guard with narrow, explicit probe exemptions. Business services still check action and record permissions. HTTP guards alone do not protect calls from jobs or another service method.
5. Use an exception filter for public errors and explicit mapping for response DTOs. A return type annotation does not strip confidential entity fields. Choose one browser-safe contract strategy, such as a generated client from verified OpenAPI, rather than importing server DTO classes into the frontend.
6. Add structured request logging and audit events deliberately. Nest's application logger is not an automatic complete request/audit logging system.

References: [Nest architecture](https://docs.nestjs.com/), [validation](https://docs.nestjs.com/techniques/validation), [Fastify adapter](https://docs.nestjs.com/techniques/performance), and [OpenAPI](https://docs.nestjs.com/openapi/introduction).

## Reference workflow to implement first

Use the same employee list → detail → edit acceptance criteria as the [Fastify blueprint](fastify.md), so framework choice does not change required behavior. Test permission rules in the service and HTTP enforcement in an initialized application. Test fixtures may replace external dependencies; do not replace the production guard in every test and then claim identity verification is covered.

Include missing/invalid assertions, denied record scope, DTO validation, response privacy, stale edits, database transaction behavior, and an actual browser workflow against the production build. Avoid making the initial suite mostly generated controller-existence tests. See [Nest testing](https://docs.nestjs.com/fundamentals/testing).

## Delivery

Build frontend assets and backend into one image initially. Keep `/api` JSON routing separate from the SPA fallback. Configure `0.0.0.0`, `PORT`, shutdown hooks, bounded connection pools, and a non-root runtime. Validate configuration before serving requests. Do not run migrations concurrently during instance startup.

Complete the [application spec](../../templates/application-spec.md), [runbook](../../templates/runbook.md), and [readiness criteria](../production-readiness.md) before claiming production readiness.

## Tradeoff

Nest supplies a vocabulary and structure that can reduce variation between generated features. It adds framework concepts to inspect and debug. It still requires team rules for module boundaries, contracts, permissions, data access, and testing. It is not a React SSR framework.
