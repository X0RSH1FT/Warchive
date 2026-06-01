---
name: "Instruction File Guidance"
description: "Authoring rules for scoped instruction files under .github/instructions. Use when editing applyTo-driven policy files."
applyTo: ".github/instructions/**/*.md"
---

# Instruction File Guidance

Use this file with [agent-customization.instructions.md](agent-customization.instructions.md) when editing instruction files.

## Ownership

- Instruction files provide durable scoped policy through `applyTo`.
- Keep one coherent concern per instruction file.
- Do not use instruction files as task-entry workflows.

## Frontmatter

- Keep frontmatter valid and minimal.
- Include clear `description` and accurate `applyTo` pattern.
- Keep `applyTo` narrow enough that ownership is obvious.

## Content Design

- State what the target file type owns, what to avoid, and validation expectations.
- Favor concise, operational guidance over long narrative duplication.
- Link to related owning instructions instead of repeating large shared sections.

## Overlap Control

- Avoid broad catch-all `applyTo` patterns when a narrower scope can own the policy.
- If overlap is intentional, ensure each file contributes distinct guidance.

## Validation

- Run diagnostics on touched instruction files.
- Verify referenced prompts, agents, skills, and paths exist.
- After changing scope boundaries, check neighboring instruction files for drift.
