---
name: planning-checklist
description: Create or refresh checklist-style implementation notes in docs/sprint. Use when a task needs an active planning document, execution notes, or a tracked implementation checklist in the repository's sprint-notes surface.
argument-hint: "[Task goal, target file or slug, optional scope, acceptance criteria, risks, validation plan, and any known completed or remaining checklist items.]"
agent: Planner Agent
---

Create or refresh a checklist-style implementation note in `docs/sprint/`.

Document contract:
- Write into `docs/sprint/<slug>.md` unless the user names an existing sprint note explicitly.
- Keep the note checklist-shaped and execution-oriented rather than durable-reference prose.
- Preserve existing progress history when updating a current sprint note.

Required sections:
1. High-Level Notes
2. Issues
3. Completed Work
4. Remaining Checklist Items
5. Validation
6. Related Next Steps

Workflow:
1. Identify the most concrete task anchor and the intended sprint-note file.
2. Retrieve only enough context to record the current scope, acceptance criteria, risks, and validation path accurately.
3. If the file path, scope, or audience is ambiguous, use `#askQuestions` to summarize the requested planning pass first, then confirm the missing detail before drafting.
4. Write concise checklist-style notes that another pass can act on directly.
5. Keep completed work and remaining checklist items clearly separated.
6. Keep validation entries factual and source-backed.
7. When the note already exists, update it in place instead of creating duplicate sprint notes for the same active work.
8. Validate the touched Markdown file before concluding.
9. Hand the completed plan back to `Coordinator Agent` so it can decide and trigger the next workflow step.

Close-out requirements:
- Summarize the sprint note created or updated.
- Report the validation run.
- State that the completed planning pass is ready for `Coordinator Agent` to act on.
- State whether the documented plan-derived work is exhausted.
- If work remains, name the next highest-priority planned slice.
- Label any extra idea as a suggestion outside the plan.
- Include a concise, imperative commit message when the note is ready to keep.