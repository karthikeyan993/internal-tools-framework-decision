# Fastify starter blueprint

Status: design only. Intended for React + Vite dashboards with a Fastify TypeScript API, following the [shared architecture](../architecture.md).

## Application shape

```text
apps/admin/
  web/src/
    app/                    # router, providers, shell
    features/employees/     # list, details, editor
  api/src/
    app.ts                  # construct app; no listen side effect
    server.ts               # configuration, listen, shutdown
    plugins/
      identity.ts           # verified principal on request
      errors.ts             # public error contract
      database.ts           # one bounded pool per instance
    features/employees/
      routes.ts             # route schemas and HTTP mapping
      service.ts            # edit/list use cases and permissions
      repository.ts         # database operations where needed
    health.ts               # minimal probe endpoints
  api/test/
    employees.test.ts
    identity.test.ts
  Dockerfile                # builds web + api; one service image
packages/contracts/src/employees.ts
```

## Establish these conventions once

1. Select one schema system. The proposed baseline is TypeBox with the compatible Fastify type provider: route validation and TypeScript inference derive from schemas. Pin and verify compatible versions during implementation. Do not maintain unrelated handwritten interfaces and schemas for the same payload.
2. Register configuration and infrastructure before dependent feature plugins. Understand plugin encapsulation; make shared decorations available deliberately instead of depending on registration order accidentally.
3. Verify identity in a shared hook before feature handlers; apply action/record authorization in the use case so another entrypoint cannot accidentally bypass it.
4. Use request schemas and explicit response schemas. Serialization controls output shape but is not a complete business-correctness check. Be deliberate about coercion, defaults, and unknown properties; prove the chosen behavior with representative inputs.
5. Enable structured Pino logging and redact assertion/auth headers and sensitive fields. Map severity and trace fields deliberately for Cloud Logging; do not assume default JSON output establishes trace correlation.
6. Register `/api` routes separately from static frontend fallback. Handle unexpected errors through one formatter; preserve useful server diagnostics without leaking them to callers.

These mechanisms are documented in [Fastify validation](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/), [type providers](https://fastify.dev/docs/latest/Reference/Type-Providers/), [plugins](https://fastify.dev/docs/latest/Reference/Plugins/), and [logging](https://fastify.dev/docs/latest/Reference/Logging/).

## Reference workflow to implement first

Build employee list → detail → edit as the representative slice, replacing the example domain with real requirements before implementation. Specify who can read/edit which records. A valid edit checks the record version, validates editable fields, updates atomically, writes the required audit record, and returns the public contract.

Tests should demonstrate invalid input rejection, denied action and record scope, missing/invalid identity, stale-edit conflicts, absence of private response fields, and no HTML fallback for missing API routes. Inject test dependencies through app construction. Use Fastify request injection for HTTP behavior and a real test database when transactions/queries are material. Exercise at least one browser workflow against the built application. See [Fastify testing](https://fastify.dev/docs/latest/Guides/Testing/).

## Delivery

The final image contains compiled API code, production dependencies, and built frontend assets. Run as a non-root user; no dev server or development identity in production. `SIGTERM` should close the server and data clients within Cloud Run's shutdown window. Keep migrations out of every instance's startup; use a controlled release step with backward-compatible schema changes.

Complete the [application spec](../../templates/application-spec.md), [runbook](../../templates/runbook.md), and [readiness criteria](../production-readiness.md) before calling the implementation production-ready.

## Tradeoff

The starter owns architecture, error shapes, and authorization conventions. Prefer existing feature patterns; do not let each generated feature invent a new framework inside the app. Reconsider NestJS if maintaining those conventions becomes a recurring problem.
