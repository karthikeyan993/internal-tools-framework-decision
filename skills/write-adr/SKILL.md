---
name: write-adr
description: Create or supersede an architecture decision record for a consequential framework, rendering, deployment, identity, data, or shared-contract choice in this repository. Routine implementation edits do not need an ADR.
---

# Write an ADR

Locate the repository root and read `docs/adr/README.md`, the existing index, and records relevant to the decision. Paths here are root-relative regardless of the harness discovery folder.

Copy `templates/adr.md` to the next unused number under `docs/adr/`. Use real constraints and credible alternatives; distinguish evidence from assumptions. Explain the decision, costs, responsibilities, validation, and reversal conditions in terms another maintainer can understand.

Start at Proposed unless the conversation or existing review evidence establishes acceptance. Do not invent an owner, reviewer, benchmark, deployment result, or approval. A recommendation is not automatically an accepted organizational decision.

For supersession, add a new record and cross-link both. Preserve the old reasoning and update status/index consistently. Link the new record from affected design/specification docs. Run `npm run check` and report remaining decision questions without presenting the proposal as implemented behavior.
