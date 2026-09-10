---
name: internal-tool-ui
description: Create or revise internal-tool screens, forms, tables, and dashboards using this repository's design guide, including permission, loading, empty, error, and responsive states.
---

# Internal tool UI

Locate the repository root. Read `design.md`, the app specification, and the nearest implemented screen. Project paths are root-relative even when this skill is loaded from `.github/skills/`.

Use the app's selected component system and shared tokens. Choose the applicable list/detail/edit/dashboard pattern. Define the user's task and primary action before adding metrics or decoration. Do not introduce a second component system for one feature.

Include loading, no-data, no-results, permission-denied, validation, and downstream-failure states as applicable. Preserve edits after failure, show mutation progress, and make conflict/session-expiry recovery explicit. Hiding controls must not replace backend permissions.

Validate actual implemented screens at desktop and narrow widths, with keyboard navigation and representative long content. Use available browser or accessibility tools and capture evidence where useful. If visual verification cannot run, report it as unverified rather than describing the layout as tested. Do not add deployment or architecture work unless the UI task needs it.
