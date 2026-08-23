---
name: "Documentation Writing Guidance"
description: "Markdown authoring guidance for docs under docs/. Use when editing durable docs, exploratory notes, sprint planning notes, or checklists."
applyTo: "docs/**/*.md"
---

# Documentation Writing Guidance

Use these rules when editing Markdown files under `docs/`.

## Ownership By Directory

- `docs/app/` owns durable reference material for shipped behavior and stable project guidance.
- `docs/model/` owns the domain model, data structures, and other shared abstractions.
- `docs/research/` owns exploratory reviews, comparisons, and design notes that are not the canonical shipped reference.
- `docs/sprint/` owns active plans, deferred work, and other in-flight notes.
- Keep `README.md` as the user-facing overview; do not duplicate that role inside `docs/`.

## Authoring Rules

- Write source-anchored prose.
- State the audience and scope early when a page is durable reference material.
- Verify commands, paths, config keys, and symbol names against the current repository state.
- Prefer scannable structure: short lead summaries, tables for shared fields, and lists for independent items.
- Avoid unsupported claims, stale quantitative counts, and `TODO` or `TBD` in published documentation.

## Cross-Document Consistency

- Reconcile links when a document moves or ownership changes.
- Update `.github/copilot-instructions.md` and `AGENTS.md` when documentation suite changes materially.

## Validation

- Use the cheapest available proof for documentation claims: nearby source reads, targeted search, or a focused command.
- Check diagnostics on touched Markdown files before concluding.

# Document type specific guidance

## Checklist - Hygiene Rules

Apply these rules to active checklist in `docs/sprint/`.

- Keep active checklist documents single-purpose: unresolved work only.
- Capture details at the bottom if a checklist item was closed (`done` or `cancelled`).
- Do not add any planning or other extraneous notes.
- Maintain this fixed structure:
	1. Objective
	2. Active items
	3. Validation guidance
	4. Completion notes (Optional)
- Allowed item statuses are `open`, `in progress`, `blocked`, `cancelled`, and `done`.
- Remove `done` items from the active unresolved section during refresh.
- Use narrow context scans: inspect only enough content to classify each item as unresolved, completed, or stale.
- Follow this deterministic cleanup order:
	1. Classify checklist item state
	2. Remove stale, completed and/or extraneous content
	3. Normalize sections
	4. Validate
	5. Summarize changes
