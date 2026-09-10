# Repository instructions

Be concise except when teaching. Verify claims using files, official documentation, or execution. State what could not be verified.

## Scope and decisions

- This is a blueprint repository, not a working application. Do not describe proposed folders, commands, integrations, or controls as implemented.
- The current scope is TypeScript, internal websites, Cloud Run, and IAP. Fastify is preferred; NestJS is an alternative. SSR has not been mandated.
- Read `framework-decision.md` and relevant records in `docs/adr/` before architecture changes. A proposed ADR is not an accepted decision.
- Keep business logic independent of the AI harness. Put durable conventions in repository docs, and portable workflows in `skills/`.

## Task routing

- For app or endpoint work, use `skills/internal-tool-feature/SKILL.md` and the selected framework blueprint.
- For UI work, use `skills/internal-tool-ui/SKILL.md` and `design.md`.
- For consequential decisions, use `skills/write-adr/SKILL.md` and `docs/adr/README.md`.
- Skill paths above are relative to the repository root. Read only the relevant skill; discovery is not a requirement to load every skill.

## Editing and verification

- Edit skills in `skills/`, then run `npm run skills:sync`. `.github/skills/` is generated.
- Keep templates visibly distinguishable from completed specifications. Never invent owners, approval, measurements, or deployment evidence.
- Run `npm run check` after documentation or skill changes. For application code, run checks appropriate to the changed behavior and report exact outcomes.
- Preserve existing user changes. Record significant tradeoffs through the ADR process; routine implementation choices do not need an ADR.
