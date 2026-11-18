# Warchive Copilot Instructions

Warchive is a documentation repository for agent prompts, customization assets, and knowledge documents.

It is also a control repository for dispatching and coordinating agentic work across systems

Treat the repository structure and existing Markdown files as the source of truth.

## Stable context

- `docs/knowledge/` holds general durable references; `docs/research/` holds research material. Portable shared agent references live in the package knowledge skill.
- `inbox/` is temporary capture space and should not be treated as canonical.
- `scripts/` contains task-specific tooling.
- `visuals/` contains diagrams, sketches, and image assets.
- `.github/` holds repository-scoped Copilot customizations.

## Guidance for work in this repo

- Prefer small, source-anchored documentation updates over broad rewrites.
- Keep README files practical and aligned with the current folder layout.
- Do not duplicate long procedural guidance in always-on instructions; link or defer to the owning doc.
- When documenting a folder, use that folder's README as the local entry point.
- Verify paths, commands, and referenced files before finalizing changes.
- When a credential or other secret must be created or read, explicitly load
  applicable user-scoped secret-handling instructions. Never run vault commands
  or read secrets or unlock factors; ask if the private policy is unavailable.
- For cross-service data work, keep the owner split generic: a database-schema
  repository owns DDL, migrations, and reusable SQL; runtime repositories keep
  code, tests, and dashboard exports; host/database administration stays in the
  user's private operations guidance. Do not copy personal host inventory here.

## Supporting references

- For agent workflow context, see `docs/knowledge/dev/agent/agentic-coding.md`.
- For Copilot customization patterns and file roles, see `docs/knowledge/dev/agent/vscode-copilot-agent-customization-reference.md`.