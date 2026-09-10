# Runbook: <service>

Status: Draft — fill and rehearse before production use.

## Ownership and access

Service owner, support/escalation route, GCP project/region, Cloud Run service, IAP policy owner and group, service identity, source and artifact locations. Link configuration; never paste secrets or tokens.

## Deploy

Record the real CI workflow, image digest selection, staging checks, migration ordering, production release policy, and post-release smoke checks. Add tested commands with exact environment-selection safeguards once infrastructure exists.

## Observe

Link logs, metrics, traces, audit records, dashboards, and alerts. Define normal operation, target latency/error rates, capacity limits, and what triggers investigation. Document how to locate a failed request using its request ID.

## Diagnose

| Symptom | First evidence | Response |
| --- | --- | --- |
| IAP denial | Access policy and affected identity | Check intended group membership and IAP configuration |
| Application 403 | Verified principal, action and record policy | Investigate permissions without bypassing authentication |
| 5xx spike | Revision, sanitized error logs, downstream health | Identify regression or dependency failure |
| Latency/pool exhaustion | Concurrency, instances, database connections | Diagnose before changing limits |

Replace these starting points with service-specific investigation steps; do not log assertions to diagnose identity.

## Rollback and data recovery

Record the previous known-good revision/image, tested traffic rollback steps, compatibility with current schema, and verification after rollback. State when rollback is unsafe and the forward-fix process. Document backup location, restore procedure, owner, recovery objectives, and most recent rehearsal where relevant.

## Scheduled maintenance

Runtime/dependency updates, access reviews, secret lifecycle, retention and deletion, and recurring recovery exercises appropriate to the service. Record actual owners and cadence.

## Evidence

Date, environment, revision, test/rehearsal result, operator, and unresolved limitations. Do not mark readiness items complete without evidence.
