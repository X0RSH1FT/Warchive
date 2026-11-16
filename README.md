# warchive

Warchive is a repository for agent prompts, working guidance, and knowledge documents. It is a practical archive first: a place to keep reusable instructions, research references, and support material organized enough for both humans and coding agents to navigate.

It is also a control repository for dispatching and coordinating agentic work across systems.

The tone can stay playful and a little cyberpunk, but the content is meant to be durable, readable, and useful during real work.

## What this repository is for

- Keeping stable documentation about agent workflows and Copilot customization patterns.
- Organizing prompt and instruction assets alongside supporting docs.
- Holding task-specific tooling and visual assets that support documentation and presentation work.
- Providing a temporary inbox for material that has not been classified yet.

## Where to start

If you are new to the repo, start here:

1. Read this file for the high-level map.
2. Open the README inside the area you plan to work in, or start with `.github/copilot-instructions.md` if you are working on repository customizations.
3. Use `docs/knowledge/dev/agent/` when you need background on agentic coding or VS Code Copilot customization behavior.

## Repository layout

| Path | Purpose | Start here |
|---|---|---|
| `.github/` | Repository-wide Copilot instructions, prompts, skills, and related workspace customizations. | [.github/copilot-instructions.md](.github/copilot-instructions.md) |
| `agent-package/` | Local APM package for agents, scoped instructions, and portable skills. | [agent-package/README.md](agent-package/README.md) |
| `docs/` | General reference and research material. | [docs/knowledge/dev/agent/](docs/knowledge/dev/agent/) |
| `inbox/` | Fast capture area for temporarily unclassified material. | [inbox/README.md](inbox/README.md) |
| `scripts/` | Task-specific tooling. | [scripts/powershell/](scripts/powershell/) |
| `visuals/` | Diagrams, sketches, and image assets. | [visuals/README.md](visuals/README.md) |

## Key reference docs

- [docs/knowledge/dev/agent/agentic-coding.md](docs/knowledge/dev/agent/agentic-coding.md): practical notes on agentic delivery loops, validation, and role splits.
- [agent-package/.apm/skills/warchive-agent-knowledge/SKILL.md](agent-package/.apm/skills/warchive-agent-knowledge/SKILL.md): task index for portable character, security, and Ollama references used by installed agents.
- [agent-package/.apm/skills/cross-service-data-operations/SKILL.md](agent-package/.apm/skills/cross-service-data-operations/SKILL.md): portable owner discovery, transaction safety, privilege separation, and verification across dependent services.
- [docs/knowledge/dev/agent/vscode-copilot-agent-customization-reference.md](docs/knowledge/dev/agent/vscode-copilot-agent-customization-reference.md): local reference for always-on instructions, scoped instructions, prompts, agents, skills, and related VS Code Copilot behavior.
- [docs/knowledge/dev/agent/opencode-agent-configuration-reference.md](docs/knowledge/dev/agent/opencode-agent-configuration-reference.md): local reference for OpenCode rules, config precedence, agents, permissions, commands, skills, custom tools, and MCP-related tool behavior.
- [docs/knowledge/dev/agent/apm-reference.md](docs/knowledge/dev/agent/apm-reference.md): reference guide to the Agent Package Manager (APM): manifest, lockfile, workflow, and agent usage.
- [docs/knowledge/games/crimson_desert/README.md](docs/knowledge/games/crimson_desert/README.md): source-backed Crimson Desert knowledge base (weapons, armor, quests, bosses, mounts, systems) with evidence status and patch caveats.
- [docs/research/ollama-troubleshooting-windows.md](docs/research/ollama-troubleshooting-windows.md): Windows-local troubleshooting reference for Ollama performance, configuration pressure, and diagnostic flow.

## Working model

See the [Internet Outage Atlas owner map](docs/knowledge/dev/data/internet-outage-atlas.md)
for source semantics and repository boundaries.

Warchive is easier to maintain when each area keeps a clear job:

- Put general reference material under `docs/`; keep shared portable agent references in the package knowledge skill and skill-specific assets with their skill.
- Use `inbox/` for short-lived capture, then move content into a durable home.
- Keep tooling under `scripts/` and supporting visual material under `visuals/`.
- Keep repository-wide Copilot context under `.github/copilot-instructions.md`; packaged agents and scoped instructions under `agent-package/.apm/`.

When a directory already has its own README, treat that file as the local entry point for the area.

## Current shape

At the moment, the repository is organized around documentation and agent support material rather than a traditional application codebase. The important orientation rule is simple: start with the nearest README, then step into the relevant research document only when you need deeper context.