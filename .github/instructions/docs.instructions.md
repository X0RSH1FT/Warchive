---
name: "Documentation Writing Guidance"
description: "Markdown authoring guidance for Glyphmancer docs under doc/. Use when editing durable docs, repo knowledge, or planning notes in the documentation tree."
applyTo: "doc/**/*.md"
---

# Documentation Writing Guidance

Use these rules when editing Markdown files under `doc/`.

## Ownership By Directory

- `doc/app/` owns durable application and subsystem reference material for shipped behavior.
- `doc/knowledge/` owns repo-level process, quality, customization, and research references.
- `doc/plan/` owns active plans, deferred work, and other unshipped notes.
- Keep `README.md` as the user-facing overview and top-level command index; do not duplicate that role inside `doc/`.

## Authoring Rules

- Write source-anchored prose rather than copying planning language forward.
- State the audience and scope early when a page is durable reference material.
- Verify commands, paths, config keys, and symbol names against the current repository state before concluding.
- Prefer scannable structure: short lead summaries, tables for shared fields, and lists for independent items.
- Avoid unsupported claims, stale quantitative counts, and `TODO` or `TBD` in published documentation.
- Keep operational instructions, durable explanations, and active planning clearly separated.

## Cross-Document Consistency

- Keep `doc/app/architecture.md` aligned with the durable reference suite when adding, moving, or removing durable docs.
- Reconcile sibling links in the same pass when a document moves or ownership changes.
- Promote shipped facts out of `doc/plan/` when an owning durable page now exists.

## Validation

- Use the cheapest available proof for documentation claims: nearby source reads, targeted search, or a focused command.
- When a doc mentions executable commands, prefer the repository's `uv` commands for validation.
- Check diagnostics on touched Markdown files before concluding.