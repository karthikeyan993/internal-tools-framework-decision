# Architecture decision records

An ADR records a consequential choice and its tradeoffs so future developers and agents can understand why it exists.

## When to write one

Use an ADR for framework/rendering choice, deployment boundaries, authentication model, persistence strategy, shared contract strategy, or a significant cross-app dependency. Routine endpoints, naming changes, bug fixes, and local refactors usually do not need one.

## Add a record

1. Copy [the template](../../templates/adr.md) into this directory as `NNNN-short-title.md`, using the next unused four-digit number. Check open branches/PRs for collisions before merging.
2. Start as **Proposed**. State the context, real alternatives, decision, consequences, evidence, and reconsideration trigger. Fill the owner before acceptance; do not invent approval.
3. Link the proposal from this index and the related implementation/specification. Review it with the decision owner as part of the existing review process.
4. Mark **Accepted** only when the owner has accepted the choice, recording the date and review reference. Use **Rejected** for a declined proposal.
5. When replacing an accepted decision, add a new ADR. Mark the older one **Superseded**, link both records, and preserve the original reasoning. Editorial corrections are fine; do not silently rewrite historical decisions.

An ADR documents a decision; it does not independently authorize deployment or external actions. A proposal does not become accepted merely because an agent generated code for it.

## Index

| ID | Decision | Status |
| --- | --- | --- |
| [0001](0001-typescript-cloud-run-starter.md) | TypeScript Cloud Run starter and framework default | Proposed |
| [0002](0002-portable-agent-skills.md) | Portable skills with harness-specific discovery | Proposed |
