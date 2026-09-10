# Feature: <name>

Status: Draft | App: <name> | Owner: <name>

## Outcome

Describe the employee task and observable result. Include non-goals.

## Existing pattern

Link the nearest implemented feature to follow, or identify the new pattern being introduced. Name affected app/packages and reverse dependencies.

## Behavior and contracts

- Routes, request/response shape, validation, pagination, and error codes.
- Who can perform each action on which records.
- Transaction, conflict, retry, and idempotency behavior as applicable.
- Sensitive data handling and audit requirements.
- UI states and design-guide patterns.

## Verification

Specify success, denied action/record access, invalid input, and relevant failure scenarios. Separate unit/HTTP/database/browser evidence. Include rollout and rollback if runtime behavior changes.

## Decision impact

Link an ADR if the feature changes a durable architectural choice. Otherwise state why the current design covers it.
