# Warchive Copilot Instructions

Warchive is a documentation-first repository for agent prompts, customization assets, and knowledge documents. Treat the repository structure and existing Markdown files as the source of truth.

## Stable context

- `docs/` holds durable reference and research material.
- `inbox/` is temporary capture space and should not be treated as canonical.
- `scripts/` contains ingestion and validation tooling.
- `visuals/` contains diagrams, sketches, and image assets.
- `.github/` holds repository-scoped Copilot customizations.

## Guidance for work in this repo

- Prefer small, source-anchored documentation updates over broad rewrites.
- Keep README files practical and aligned with the current folder layout.
- Do not duplicate long procedural guidance in always-on instructions; link or defer to the owning doc.
- When documenting a folder, use that folder's README as the local entry point.
- Verify paths, commands, and referenced files before finalizing changes.

## Supporting references

- For agent workflow context, see `docs/research/agentic-coding.md`.
- For Copilot customization patterns and file roles, see `docs/research/vscode-copilot-agent-customization-reference.md`.