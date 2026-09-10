# ADR 0002: Portable skills with harness-specific discovery

- Status: Proposed
- Date: 2026-09-09
- Decision owner: To be assigned before acceptance
- Scope: Repository instructions and skills
- Supersedes: None
- Superseded by: None

## Context

The repository should support Pi and Copilot without binding application workflows to one harness. Discovery locations vary; the SKILL.md bundle format is shared.

## Options considered

- Maintain separate skills in each harness directory: simple discovery but duplicated authoring.
- Use symlinks: one source but dependent on checkout/platform handling.
- Use canonical bundles with a configured Pi path and generated Copilot copies: portable checkouts, with a synchronization check to prevent drift.

## Decision

Use `skills/` as the canonical source. Configure Pi to read it and commit generated copies under `.github/skills/`. Keep root `AGENTS.md` as the shared instruction entrypoint and a short Copilot pointer. Native skill discovery selects workflows on relevance; the repository does not force every skill into every task.

## Consequences

Skill changes require synchronization. CI detects copy drift. No harness package or model is required by the application. Another harness needs its own supported discovery path or an explicit instruction to read root skills. Third-party skill imports are versioned repository changes, not silent network downloads at startup.

## Validation and reversal

Check bundle metadata, byte-identical copies, Pi path resolution, and documentation links locally. Verify live discovery separately in each installed harness; file checks alone do not prove model invocation. This setup can later use a common native directory if all required harness versions support it and repository policy permits it.

## References

- [Setup and verification](../agents.md)
- [Agent Skills specification](https://agentskills.io/specification)
- [Pi skills](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md)
- [Copilot skills](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills)
