# warchive

Warchive is a repository for agent prompts, working guidance, and knowledge documents. It is a practical archive first: a place to keep reusable instructions, research references, and support material organized enough for both humans and coding agents to navigate.

The tone can stay playful and a little cyberpunk, but the content is meant to be durable, readable, and useful during real work.

## What this repository is for

- Keeping stable documentation about agent workflows and Copilot customization patterns.
- Organizing prompt and instruction assets alongside supporting docs.
- Holding tooling and visual assets that support ingestion, validation, and presentation work.
- Providing a temporary inbox for material that has not been classified yet.

## Where to start

If you are new to the repo, start here:

1. Read this file for the high-level map.
2. Open the README inside the area you plan to work in, or start with `.github/copilot-instructions.md` if you are working on repository customizations.
3. Use the research docs in `docs/research/` when you need background on agentic coding or VS Code Copilot customization behavior.

## Repository layout

| Path | Purpose | Start here |
|---|---|---|
| `.github/` | Repository-scoped Copilot customizations such as agents, prompts, instructions, and related workflow files. | [.github/copilot-instructions.md](.github/copilot-instructions.md) |
| `docs/` | Durable documentation, research material, and sprint planning notes. | `docs/research/` |
| `inbox/` | Fast capture area for temporarily unclassified material. | [inbox/README.md](inbox/README.md) |
| `scripts/` | Ingestion and validation tooling. | [scripts/README.md](scripts/README.md) |
| `visuals/` | Diagrams, sketches, and image assets. | [visuals/README.md](visuals/README.md) |

## Key reference docs

- [docs/research/agentic-coding.md](docs/research/agentic-coding.md): practical notes on agentic delivery loops, validation, and role splits.
- [docs/research/vscode-copilot-agent-customization-reference.md](docs/research/vscode-copilot-agent-customization-reference.md): local reference for always-on instructions, scoped instructions, prompts, agents, skills, and related VS Code Copilot behavior.
- [docs/research/ollama-troubleshooting-windows.md](docs/research/ollama-troubleshooting-windows.md): Windows-local troubleshooting reference for Ollama performance, configuration pressure, and diagnostic flow.

## Working model

Warchive is easier to maintain when each area keeps a clear job:

- Put stable reference material under `docs/`.
- Use `inbox/` for short-lived capture, then move content into a durable home.
- Keep tooling under `scripts/` and supporting visual material under `visuals/`.
- Keep repository-wide Copilot context and customization assets under `.github/`.

When a directory already has its own README, treat that file as the local entry point for the area.

## Current shape

At the moment, the repository is organized around documentation and agent support material rather than a traditional application codebase. The important orientation rule is simple: start with the nearest README, then step into the relevant research document only when you need deeper context.