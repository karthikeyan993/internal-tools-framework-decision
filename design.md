# Internal tools design guide

Status: proposed baseline for applications built from these templates. This guide covers UI and content; backend architecture lives in [docs/architecture.md](docs/architecture.md).

## Product principles

Make the current task, available action, and result clear. Prefer familiar forms and tables over decorative dashboards. Show only metrics that support a user decision. Internal users still need accessible controls, understandable errors, and reliable feedback.

## Visual foundation

Use these as initial semantic tokens, not a claim that every resulting combination is accessible. Verify actual component states and contrast during implementation.

| Token | Starting value | Use |
| --- | --- | --- |
| Canvas | `#F8FAFC` | Page background |
| Surface | `#FFFFFF` | Forms and panels |
| Text | `#0F172A` | Main text |
| Muted text | `#475569` | Supporting text |
| Border | `#CBD5E1` | Separators; not sufficient alone for every control boundary |
| Action | `#1D4ED8` | Links, primary buttons, focus ring |
| Danger | `#B91C1C` | Destructive actions and errors |
| Success | `#166534` | Success text with an icon/label |

- Use the system sans-serif stack, a 16px body baseline, 14px compact table text, and tabular numerals for numeric columns. Preserve browser zoom.
- Use a 4px spacing scale: 4, 8, 12, 16, 24, 32, 48. Default panel radius: 8px. Keep shadows subtle and optional.
- Define tokens once in the UI package; avoid per-screen color literals. Build one coherent light theme first unless dark mode is required.
- Use a single component system per app family. Choose it during implementation and record consequential dependencies; no component library is selected here.

## Page templates

| Pattern | Layout | Required behavior |
| --- | --- | --- |
| App shell | Navigation, page title, employee/account menu, content | Clear current location; responsive navigation; skip link |
| List | Title + primary action, search/filters, results table, pagination | Sort/filter in URL where useful; bounded pagination; distinguish no data from no matching results |
| Detail | Breadcrumb, title/status, actions, grouped facts, history | Clear status label; permission-aware actions; latest update timestamp |
| Edit | Title, grouped labelled fields, validation, save/cancel | Preserve input on failure; prevent duplicate submission; define dirty-form navigation behavior |
| Dashboard | Useful summary metrics, filters, chart/table detail | Date range and timezone shown; definitions and freshness visible; accessible tabular equivalent where needed |

On wide screens, use a 240px navigation rail and 24px content padding as starting values. On narrow screens, collapse navigation and retain a usable primary action. Forms should usually stay around 640–800px wide; tables may use the full content area. Avoid fixed page widths and whole-page horizontal scrolling.

## States are part of the component

Implement loading, empty, success, validation failure, permission denied, unavailable service, and retry states. Never show a failed request as an empty successful list. Do not render fake zero metrics while data is loading.

For mutations, indicate progress at the action, preserve the user's context, and show the result. Use optimistic updates only where rollback and conflict behavior are understood. Confirm destructive or hard-to-reverse actions with the object name and a precise verb; ordinary saves need no confirmation dialog.

IAP session expiry may surface during an API request. Define a sign-in recovery path without discarding unsaved work, and test it in staging. Do not invent a second login form for an IAP-only app.

## Accessibility

Target WCAG 2.2 AA. Use semantic HTML, visible keyboard focus, labelled controls, associated error messages, accessible dialog focus handling, and status announcements. Do not rely on color alone. Verify normal text contrast of at least 4.5:1 and applicable UI/focus contrast requirements; decorative separators and interactive boundaries have different roles.

Test keyboard-only operation, 200% zoom, narrow layouts, long labels, and representative screen-reader behavior. Automated checks are useful but cannot establish accessibility alone. See [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Content and formatting

- Use sentence case and precise verbs: “Save changes”, “Approve request”, “Export CSV”.
- Errors explain the problem and next action, without internal stack traces. Show a support/request identifier for unexpected failures.
- State timezone and currency where ambiguity matters. Store timestamps consistently and format intentionally for the user.
- Explain unavailable actions when useful, while enforcing permissions on the server regardless of UI visibility.
- Keep framework names, agent instructions, and deployment details out of ordinary product screens.

## Review evidence

For a new pattern or material layout change, capture the implemented screen at representative desktop and narrow widths and exercise error/loading states and keyboard navigation. Record observations in the PR. A mockup is not evidence that the implemented UI works.
