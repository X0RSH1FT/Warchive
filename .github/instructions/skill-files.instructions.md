---
name: "Skill File Guidance"
description: "Authoring rules for skills under .github/skills, including SKILL.md and bundled supporting assets."
applyTo: ".github/skills/**/*.md"
---

# Skill File Guidance

Use this file with [agent-customization.instructions.md](agent-customization.instructions.md) when editing skills.

## Ownership

- Use skills for reusable capabilities that benefit from bundled assets.
- Prefer prompts for thin entrypoints and agents for persistent role boundaries.

## Naming and Layout

- Skill names must be lowercase letters, numbers, and hyphens.
- Skill directory name must match `name` exactly.
- Keep `SKILL.md` at the skill root and place scripts/templates/examples adjacent in the same directory tree.

## SKILL.md Requirements

- Keep frontmatter minimal: `name`, `description`, optional `argument-hint`.
- Explain when to use the skill, boundaries, and safe execution workflow.
- Reference every required supporting file with a concrete relative path.
- Include validation expectations and stop conditions.

## Bundled Assets

- Keep scripts and templates scoped, explicit, and safely bounded.
- Prefer read-first and approval-gated patterns for destructive workflows.
- Do not reference assets that do not exist.

## Validation

- Run diagnostics on touched `SKILL.md` files.
- Verify skill-name and directory-name match.
- Verify linked scripts/templates/examples exist at the named paths.
