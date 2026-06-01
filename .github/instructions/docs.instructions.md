---
name: "Documentation Writing Guidance"
description: "Markdown authoring guidance for knowledge-base docs under docs/. Use when editing durable references, research notes, or planning notes in the documentation tree."
applyTo: "docs/**/*.md"
---

# Documentation Writing Guidance

Use these rules when editing Markdown files under `docs/`.

## Ownership By Directory

- `docs/research/` owns durable research, customization, and reference material for this knowledge-base repository.
- `docs/sprint/` owns checklist-style planning notes, implementation notes, active sprint checklists, and other in-flight work tracking for this repository.
- Keep other doc buckets aligned with the repository's current docs layout; ask before introducing new durable, planning, or canonical directories when no existing home is obvious.
- Keep `README.md` as the user-facing overview and top-level navigation when it already serves that role; do not duplicate that role inside `docs/`.

## Authoring Rules

- Write source-anchored prose rather than copying planning language forward.
- State the audience and scope early when a page is durable reference material.
- Verify commands, paths, config keys, and symbol names against the current repository state before concluding.
- Prefer scannable structure: short lead summaries, tables for shared fields, and lists for independent items.
- Avoid unsupported claims, stale quantitative counts, and `TODO` or `TBD` in published documentation.
- Keep operational instructions, durable explanations, and active planning clearly separated.

## Cross-Document Consistency

- Keep any top-level docs indexes or neighboring overview pages aligned when adding, moving, or removing durable docs.
- Reconcile sibling links in the same pass when a document moves or ownership changes.
- Promote settled facts out of temporary notes when an owning durable page now exists.

## Validation

- Use the cheapest available proof for documentation claims: nearby source reads, targeted search, or a focused command.
- When a doc mentions executable commands, prefer the repository's native commands for validation instead of assuming a specific toolchain.
- Check diagnostics on touched Markdown files before concluding.

## Checklist Hygiene Rules

Apply these rules to active checklist and planning docs in `docs/sprint/` and `docs/plan/`.

- Prioritize repository instruction files and these checklist hygiene rules over style preferences.
- Keep active checklist documents single-purpose: unresolved work only.
- Remove completed implementation history from active sections, or keep only a short completed summary when explicitly requested.
- Use this fixed structure in active checklist docs:
	1. Purpose (1-2 lines)
	2. Active unresolved checklist items
	3. Validation guidance
	4. Optional completed summary (maximum 5 bullets, only when explicitly enabled)
- Allowed item statuses are `open`, `in progress`, `blocked`, and `done`.
- Remove `done` items from the active unresolved section during refresh.
- Delete contradictory next-step notes as soon as they conflict with completed slices.
- Do not keep long dated implementation logs, duplicated selected-slice history, or mixed postmortem plus active planning in the same active checklist.
- Use narrow context reads: inspect only enough content to classify each item as unresolved, completed, or stale.
- Follow this deterministic cleanup order:
	1. Classify
	2. Remove stale and completed content
	3. Normalize sections
	4. Validate
	5. Summarize changes
- Cleanup summaries must report removed sections or items, remaining unresolved groups, and assumptions used for ambiguous removals.

Few-shot examples:
- Good checklist item: Replace title-string dispatch with typed discriminant in web section renderer; update related tests.
- Bad checklist item: 2026-05-31: We discussed multiple options, maybe revisit later, likely related to prior refactor notes.
- Clean section layout: Purpose; Active unresolved items; Validation guidance; Optional completed summary (short).