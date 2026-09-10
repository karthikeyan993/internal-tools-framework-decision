# Internal tools starter designs

Production-oriented architecture and delivery templates for TypeScript internal websites on GCP Cloud Run, protected by IAP, developed with AI agents.

**This repository primarily contains blueprints and working documentation/skill tooling.** It also contains two runnable evaluation samples; neither is a production-ready application or evidence of provisioned infrastructure. Fastify is the preferred backend; NestJS remains an alternative. SSR is a separate decision.

## Start here

1. Read the [framework recommendation](framework-decision.md).
2. Choose the [Fastify blueprint](docs/blueprints/fastify.md) or [NestJS blueprint](docs/blueprints/nestjs.md), using the [shared architecture](docs/architecture.md).
3. Copy the [application specification](templates/application-spec.md) and fill in the real application requirements.
4. Record consequential choices with the [ADR workflow](docs/adr/README.md).
5. Apply the [design guide](design.md) and [production readiness criteria](docs/production-readiness.md).

## Repository contents

| Path | Purpose |
| --- | --- |
| `AGENTS.md` | Shared instructions for any coding harness |
| `skills/` | Canonical, portable Agent Skills bundles |
| `.pi/settings.json` | Pi discovery configuration |
| `.github/skills/` | Generated Copilot discovery copies; edit the canonical skills instead |
| `design.md` | UI patterns, accessibility, and content style |
| `docs/blueprints/` | Framework-specific production starter designs |
| `docs/adr/` | Decision process and proposed initial records |
| `examples/` | Equivalent runnable Fastify and NestJS comparison monorepos |
| `templates/` | Application, feature, ADR, and operational runbook templates |
| `scripts/` | Dependency-free skill synchronization and documentation validation |

## Local checks

Use Node.js 24. No dependency installation is needed for this documentation repository.

```sh
npm run skills:sync
npm run check
```

Generated Copilot skills are included so discovery does not require a setup command after cloning. Pi reads `skills/` through its project settings after project trust is established. Discovery and model selection are different: a harness may discover a skill without choosing it for a task. See [agent setup and verification](docs/agents.md).

The GitHub workflow runs the same repository checks. Application builds, authorization tests, browser tests, and deployment validation become requirements when a runnable starter is implemented; passing these documentation checks does not establish production readiness.
