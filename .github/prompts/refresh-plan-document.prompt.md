---
name: refresh-plan-document
description: Refresh a planning document in docs/plan by removing completed or stale planning notes while preserving unresolved, actionable work and concise validation guidance.
argument-hint: "[Target markdown planning document path under docs/plan. Optional modes: strict, keep-history, normalize-headings.]"
agent: Documentation Agent
---

Use this prompt as `/refresh-plan-document` to keep sprint or planning documents lean, current, and actionable.

Workflow scope:
- Accept a target Markdown planning document path as input.
- Optional modes:
  - `strict`: remove all completed history.
  - `keep-history`: retain a minimal completed-work summary.
  - `normalize-headings`: rebuild the document structure consistently.
- Stay within `docs/plan` unless the user explicitly authorizes another path.

Instruction hierarchy:
- Prioritize repository instruction files and checklist hygiene rules over style preferences.

Operating rules:
1. Read only enough context to classify each section or item as:
   - active unresolved work
   - completed historical work
   - stale or contradictory planning notes
   - still-needed reference context
2. Remove completed checklist items and obsolete execution logs unless `keep-history` mode is enabled.
3. Remove contradictory next-step notes that point to already completed slices.
4. Keep unresolved tasks grouped by owning surface when present, such as: Collection, CLI, Persistence, Rendering, Web, Cross-layer, and Testability.
5. Keep a short validation section with focused commands by surface.
6. Preserve factual, still-actionable constraints and exclusions.
7. Avoid TODO/TBD filler and avoid unsupported claims.

Item lifecycle rules:
- Allowed statuses: `open`, `in progress`, `blocked`, `done`.
- Keep only `open`, `in progress`, and `blocked` items in active unresolved sections.
- Remove `done` items from active sections during refresh.

Deterministic cleanup order:
1. Classify
2. Remove stale and completed content
3. Normalize sections
4. Validate
5. Summarize changes

Output contract:
1. Update the same target file in place.
2. Provide a short summary that includes:
   - what was removed
   - what unresolved groups remain
   - assumptions used for ambiguous removals
3. If no actionable unresolved tasks remain, state that explicitly.
4. If ambiguity prevents safe cleanup, ask concise clarification questions before editing.

Validation requirements:
- Run Markdown diagnostics only on the touched target file.
- Report the diagnostics result.
- Do not run broad repository checks unless the user requests them.

Style requirements for the refreshed document:
- Use scannable headings, compact bullets, and no redundant narrative.
- Keep only current unresolved tasks and concise validation guidance.
- Keep wording implementation-ready and specific to real file or module ownership.

Required active checklist structure:
1. Purpose (1-2 lines)
2. Active unresolved checklist items
3. Validation guidance
4. Optional completed summary (maximum 5 bullets, only when `keep-history` is enabled)

Forbidden content:
- Long dated implementation logs
- Duplicated selected-slice history
- Mixed postmortem plus active planning in the same active checklist

Safety and boundaries:
- Never delete unrelated files.
- Never rewrite outside the target document unless explicitly requested.
- Prefer minimal, surgical edits when possible.

Few-shot examples:
- Good checklist item: Replace title-string dispatch with typed discriminant in web section renderer; update related tests.
- Bad checklist item: 2026-05-31: We discussed multiple options, maybe revisit later, likely related to prior refactor notes.
- Clean section layout: Purpose; Active unresolved items; Validation guidance; Optional completed summary (short).

Suggested invocation examples:
1. Refresh a single tech-debt inventory in strict mode:
   - `/refresh-plan-document docs/plan/tech-debt-inventory.md --mode strict`
2. Refresh with keep-history mode:
   - `/refresh-plan-document docs/plan/tech-debt-inventory.md --mode keep-history`
3. Refresh and normalize headings:
   - `/refresh-plan-document docs/plan/tech-debt-inventory.md --mode normalize-headings`
