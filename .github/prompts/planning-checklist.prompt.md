---
name: planning-checklist
description: Create or refresh active checklist-style planning notes that stay clean, current, and actionable in docs/sprint.
argument-hint: "[Task goal, target file or slug, optional scope, validation plan, unresolved groups, and optional mode: strict or keep-history.]"
agent: Planner Agent
---

Create or refresh an active checklist document in `docs/sprint/`.

Document contract:
- Write into `docs/sprint/<slug>.md` unless the user names an existing sprint note explicitly.
- Keep active planning single-purpose: unresolved work only.
- Remove completed implementation history from active sections.
- Keep a short completed summary only when explicitly requested, maximum 5 bullets.

Required sections:
1. Purpose (1-2 lines)
2. Active unresolved checklist items
3. Validation guidance
4. Optional completed summary (maximum 5 bullets, only when explicitly enabled)

Item lifecycle rules:
- Allowed statuses: `open`, `in progress`, `blocked`, `done`.
- Keep only `open`, `in progress`, and `blocked` items in the active unresolved section.
- Remove `done` items from active sections during refresh.
- Delete contradictory next-step notes that point to already completed slices.
- Do not include long dated implementation logs, duplicated selected-slice history, or mixed postmortem plus active planning in active sections.

Workflow:
1. Identify the most concrete task anchor and the intended sprint-note file.
2. Read only enough context to classify content as unresolved, completed, or stale.
3. If the file path, scope, or audience is ambiguous, use `#askQuestions` to summarize the requested planning pass first, then confirm the missing detail before drafting.
4. Apply deterministic cleanup order:
	- Classify
	- Remove stale and completed content
	- Normalize sections
	- Validate
	- Summarize changes
5. Keep unresolved tasks grouped by owning surface where possible.
6. Keep validation guidance compact and focused by surface.
7. When the note already exists, update it in place instead of creating duplicate sprint notes for the same active work.
8. Validate the touched Markdown file before concluding.
9. Hand the completed plan back to `Coordinator Agent` so it can decide and trigger the next workflow step.

Few-shot examples:
- Good checklist item: Replace title-string dispatch with typed discriminant in web section renderer; update related tests.
- Bad checklist item: 2026-05-31: We discussed multiple options, maybe revisit later, likely related to prior refactor notes.
- Clean section layout: Purpose; Active unresolved items; Validation guidance; Optional completed summary (short).

Close-out requirements:
- Summarize the sprint note created or updated.
- Report removed sections or items and why they were removed.
- Report remaining unresolved groups.
- Report assumptions used for ambiguous removals.
- Report the validation run.
- State that the completed planning pass is ready for `Coordinator Agent` to act on.
- State whether the documented plan-derived work is exhausted.
- If work remains, name the next highest-priority planned slice.
- Label any extra idea as a suggestion outside the plan.
- Include a concise, imperative commit message when the note is ready to keep.