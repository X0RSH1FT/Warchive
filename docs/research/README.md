# docs/research — Knowledge-Base Index

This directory holds durable research, reference, and knowledge-base documents for the repository — covering tools, workflows, configuration, and domain topics researched and consolidated for ongoing use.

## Creating New Research

Use the `/research` slash command (defined in `.opencode/commands/research.prompt.md`) to research a topic via the web. The command delegates to the Web Research Agent, which fetches and consolidates findings into a new document in this directory automatically.

## Directory Contents

| File | Description |
|------|-------------|
| `agentic-coding.md` | Overview of practical agentic coding workflows as a delivery loop of context, bounding, work, validation, and knowledge updates. |
| `completion-format-prompting.md` | Research note on chat, completion, and continuation-style prompt formatting for roleplay with small LLMs. |
| `creative-roleplay-prompt-surface-reference.md` | Durable reference for choosing between creative, roleplay, and prompt-evaluation entry points. |
| `git-commands-cheatsheet.md` | Practical reference for everyday Git operations — from setup through advanced recovery. |
| `node-and-npm-command-cheatsheets.md` | Practical reference for everyday Node.js and npm operations — runtime flags, module system, package management, scripts, publishing, diagnostics, and config. |
| `github-ssh-setup-ubuntu.md` | Step-by-step guide for setting up GitHub SSH access from an Ubuntu environment. |
| `kubectl-command-cheat-sheet.md` | Practical reference for everyday kubectl operations — from cluster management and resource CRUD through debugging, configuration, and advanced workflows. |
| `mysql-command-cheatsheet.md` | Practical reference for everyday MySQL 8.0+ operations — connection, database and table management, data manipulation, user administration, indexing, backup and restore, diagnostics, and admin commands. |
| `ollama-modelfile.md` | Quick-reference commands for working with Ollama Modelfiles (create, show, run, remove custom models). |
| `ollama-top-models.md` | Research reference listing top Ollama models by popularity with pull counts, sizes, and evaluation notes. |
| `ollama-troubleshooting-windows.md` | Practical troubleshooting for Ollama latency, throughput, memory pressure, and configuration issues on Windows. |
| `opencode-agent-configuration-reference.md` | Durable reference for how OpenCode loads and applies agent-related configuration (scopes, rules, agents, permissions, models, commands, skills, tools, MCP). |
| `powershell-command-cheatsheet.md` | Practical reference for everyday PowerShell 7+ commands — navigation, file operations, text processing, system administration, remoting, scripting, and POSIX-to-PowerShell alias mapping. |
| `python-and-pip-command-cheatsheet.md` | Practical reference for everyday CPython interpreter CLI and pip package manager operations — runtime flags, environment variables, venv, debugging, package management, config, caching, and diagnostics. |
| `python-goal-oriented-action-planning-frameworks.md` | Ranked shortlist and decision aid for selecting open-source Python frameworks for goal-oriented action planning across game AI, robotics, and LLM-agent orchestration. |
| `roleplay-character-packet-template.md` | Template and normalization guide for roleplay-ready character packets used by design and enactment workflows. |
| `roleplay-prompt-evaluation-rubric.md` | Lightweight rubric for evaluating roleplay prompting quality across prompt-only and runtime-backed comparisons. |
| `uv-command-cheatsheet.md` | Practical reference for everyday uv operations — from setup through project management, dependency, and publishing. |
| `vscode-copilot-agent-customization-reference.md` | Reference for VS Code Copilot agent file structure and related customizations. |
| `vscode-local-llm-options.md` | Research comparing local LLM options (Ollama, llama.cpp) for VS Code covering chat, agent mode, inline completion, and API-compatible workflows. |

## Maintenance

Keep documents in this directory current as tools, workflows, and configurations evolve. When content becomes stale or superseded, update the existing file rather than letting outdated information accumulate.