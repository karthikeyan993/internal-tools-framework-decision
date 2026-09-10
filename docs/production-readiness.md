# Production readiness

These are acceptance criteria for a future application, not controls already implemented by this repository. Record evidence and any accepted exceptions in the application's [runbook](../templates/runbook.md).

## Required before the first release

| Area | Evidence to produce |
| --- | --- |
| Ownership | Named service owner, support route, data classification, intended IAP group, and release/incident responsibilities |
| Identity | Deployed IAP enforcement; expected assertion audience; rejected missing/invalid tokens; no alternate route bypass; local identity cannot activate in production |
| Permissions | Allowed and denied actions, cross-record access tests, export rules, and service-to-service identity where applicable |
| Browser writes | Documented and tested CSRF protection appropriate to the actual cookie/origin setup |
| Contracts | Invalid inputs, size limits, unknown fields, pagination, response privacy, and API 404/error shape verified |
| Data integrity | Migration rehearsal, transaction/conflict behavior, pool sizing, and retry/idempotency rules for relevant side effects |
| Secrets | Secret Manager/service identity configuration; no keys in browser bundles, image layers, repo, or logs |
| Build | Lockfile-based reproducible install; strict types; lint; relevant tests; production image smoke test; supported runtime/dependencies |
| UI | Representative browser workflow, keyboard checks, required states, responsive behavior, and session-expiry recovery |
| Operations | Health probes, graceful shutdown, structured error logs, sensitive-action audit trail, useful alerts, and owner-selected latency/error targets |
| Capacity/cost | Measured representative load, startup behavior, concurrency, request/downstream timeouts, pool limits and instance limits |
| Recovery | Previous image/revision recorded; rollback rehearsal; backward-compatible migration strategy; backup/restore evidence appropriate to the data |

## Release shape

Build once and promote the same immutable image digest. Run checks and migrations in a controlled release process. Deploy to staging, test an allowed and denied identity plus the core workflow, then follow the team's production release policy. CI should use short-lived cloud credentials with least privilege; application service identities should be separate from deployment identities.

Maintain a minimal unauthenticated probe only if required by the platform, with no business data or detailed diagnostics. Use startup/liveness probes appropriately; avoid restarting every instance simply because a shared database has a transient failure.

Do not perform critical background work after returning an HTTP response and assume the instance will finish it. Use a durable execution mechanism for work that must survive instance termination. Keep its authorization, retries, and idempotency explicit.

## Verification depth

Prefer behavioral tests of permissions, contracts, transactions, and user workflows. A route-exists test, coverage percentage, successful TypeScript build, or AI review alone does not prove the application is correct. Test actual database behavior where mocks would conceal material risks.

A documentation-only change normally needs repository checks, not a complete application release. Scale verification to what changed and its reverse dependencies.

References: [Cloud Run runtime contract](https://docs.cloud.google.com/run/docs/container-contract), [Cloud Run IAP](https://docs.cloud.google.com/run/docs/securing/identity-aware-proxy-cloud-run).
