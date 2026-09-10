# Portable agent setup

The source of truth is `skills/<name>/SKILL.md`, using the open Agent Skills format. Skills contain repository workflows rather than harness tool names, model choices, credentials, or global configuration. Shared instructions live in [AGENTS.md](../AGENTS.md).

## Discovery

| Harness | Repository configuration | Behavior |
| --- | --- | --- |
| Pi | `.pi/settings.json` with `skills: ["../skills"]` | Loads canonical bundles from the configured path after project trust permits project settings |
| Copilot | Committed `.github/skills/<name>/SKILL.md` copies | Discovers repository skills in supported Copilot agent environments |
| Other harness | Read `AGENTS.md`; configure its supported skill search path to `skills/` | Skill content is portable; discovery must be configured for that harness |

Start Pi at the repository root. Paths in its project settings resolve relative to `.pi`, so `../skills` points to the canonical directory. Project trust and disabled-skill settings can affect discovery. Copilot's `.github/copilot-instructions.md` points to the shared repository instructions.

The generated Copilot copies are committed regular files rather than symlinks. They work without running setup after cloning. This is automatic discovery of bundled skills, not automatic downloading of arbitrary external skills. A harness decides whether to invoke a discovered skill based on the task and description; explicit invocation may still be needed.

## Included workflows

- `internal-tool-feature`: implement a vertical slice using the chosen backend, contracts, permissions, and meaningful tests.
- `internal-tool-ui`: implement screens using the design guide and verify relevant UI states.
- `write-adr`: document a consequential choice without inventing acceptance or evidence.

## Add or update a skill

1. Create/edit `skills/<name>/SKILL.md` with YAML `name` and `description`, following the Agent Skills standard. Names must match directory names.
2. Keep supporting files inside that skill bundle. Refer to those files relative to the bundle; refer to shared project documents explicitly from the repository root.
3. Run `npm run skills:sync`, then `npm run check`. Commit canonical and generated files together.
4. For a rename/removal, remove the corresponding generated bundle explicitly too. The synchronizer refuses unexpected generated files rather than deleting unrelated work.

The checker validates the repository's simple name/description frontmatter convention, copy consistency, and local Markdown file links. It is not a complete YAML parser or a proof of skill quality. Do not add symlinks within bundles; the synchronizer rejects them.

For an external skill, copy the reviewed bundle into `skills/` and record its upstream URL, immutable revision, license, and local modifications in a supporting provenance file. Retain license notices. Updates are explicit repository changes. Neither Pi nor Copilot is a universal skills registry, and this repository does not silently copy personal skills or install packages on startup.

## Verify discovery in your actual harness

1. Run `npm run check` to verify metadata, copies, and the Pi path.
2. In a trusted Pi session launched at the root, invoke `/skill:write-adr` with a small decision-writing request. Confirm the root documentation is read and the proposed ADR format is used.
3. In Copilot agent mode/CLI, ask it to use `write-adr` for the same task and inspect its skill-use output or loaded context. Ensure the installed product supports Agent Skills and repository instructions are enabled.
4. Try a UI task and confirm the UI skill reads `design.md` without loading unrelated deployment instructions.

Live invocation is a separate acceptance check. The repository can verify files and configuration without launching a model session; it cannot guarantee every harness/version will select a skill automatically.

Sources checked 2026-09-09: [Pi skills](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md), [Pi settings](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/settings.md), [Copilot skills](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills), [Copilot instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions), and [Agent Skills format](https://agentskills.io/specification).
