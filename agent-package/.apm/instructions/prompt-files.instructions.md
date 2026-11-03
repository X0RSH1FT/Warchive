---
name: "Prompt File Guidance"
description: "Authoring rules for agent prompt files. Use when creating or editing slash-command entry prompts."
applyTo: "**/*.prompt.md"
---

# Prompt File Guidance

## Ownership

- Prompt files are user-invoked entry points.
- Keep prompts task-scoped and operational.

## Frontmatter

- Keep frontmatter minimal and valid YAML.
- Use `name`, `description`, `argument-hint`, and `agent` by default.
- If `agent` is omitted, the current active agent is used; set `agent` explicitly when routing should be stable.
- Keep `description` as discovery text with clear "Use when" routing intent.

## Body Structure

- Start from one concrete task anchor.
- Require clarifications only when missing decisions change execution.
- Define preferred workflow shape and first validation boundary.
- Include bounded close-out requirements for outputs.
- Add short few-shot examples only when they materially improve output shape.
- Use `${input:...}` variables sparingly and only when they clearly reduce repeated invocation friction.

## Routing Discipline

- If content becomes role-stable or tool-policy-heavy, move that logic to the owning agent file.
- Keep references to agents, prompts, and paths accurate.

## Validation

- Run diagnostics on touched prompt files.
- Verify referenced agent names and paths exist.
- Verify prompt-level examples and output contracts still match the owning workflow.
