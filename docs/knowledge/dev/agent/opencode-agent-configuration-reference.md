# OpenCode Agent Configuration Reference

**Research Date:** June 6, 2026  
**Author:** GitHub Copilot  
**Audience:** Maintainers and prompt or agent authors who need a durable reference for how OpenCode loads and applies agent-related configuration  
**Scope:** This document consolidates the OpenCode documentation pages that materially affect agent setup: config scopes, rules, agents, permissions, models, commands, formatters, skills, custom tools, and MCP-connected tool suites.

---

## Table of Contents

1. [Purpose and Scope](#1-purpose-and-scope)
2. [Mental Model: The OpenCode Customization Stack](#2-mental-model-the-opencode-customization-stack)
3. [Configuration Scopes and Precedence](#3-configuration-scopes-and-precedence)
4. [Rules and Instruction Loading](#4-rules-and-instruction-loading)
5. [Agents](#5-agents)
6. [Tools and Permissions](#6-tools-and-permissions)
7. [Models and Providers](#7-models-and-providers)
8. [Commands](#8-commands)
9. [Formatters](#9-formatters)
10. [Skills](#10-skills)
11. [Custom Tools and MCP Servers](#11-custom-tools-and-mcp-servers)
12. [Practical Authoring Guidance](#12-practical-authoring-guidance)
13. [Troubleshooting and Documented Ambiguities](#13-troubleshooting-and-documented-ambiguities)
14. [Sources](#14-sources)

---

## 1. Purpose and Scope

This page is a durable local reference for configuring OpenCode agents and the adjacent surfaces that shape agent behavior.

It is meant for authors who need to answer questions such as:

- where OpenCode loads rules from
- how config files merge and which scope wins
- when to use `AGENTS.md` versus `opencode.json` versus `.opencode/`
- how agent permissions, models, commands, skills, custom tools, and MCP servers interact

The goal is not to restate every external page verbatim. The goal is to preserve the operational facts that matter when designing or auditing an OpenCode customization stack.

---

## 2. Mental Model: The OpenCode Customization Stack

OpenCode customization is easier to reason about if you separate it into four layers.

| Layer | Primary surface | What it controls | Durable takeaway |
|---|---|---|---|
| Rules | `AGENTS.md`, optional `CLAUDE.md`, extra `instructions` entries | Always-on behavioral guidance | Project rules center on `AGENTS.md`, not a VS Code-style `.github/` tree. |
| Structured config | `opencode.json` or `opencode.jsonc` | Models, providers, permissions, agents, commands, formatters, MCP, policies | Config files merge across scopes rather than replacing each other wholesale. |
| File-based extensions | `.opencode/agents/`, `.opencode/commands/`, `.opencode/skills/`, `.opencode/tools/` | Reusable agents, commands, skills, and custom tools | The `.opencode/` directory is a first-class extension surface, not just a cache or support folder. |
| Runtime selection and enforcement | CLI model overrides, permissions, policies, slash commands, task delegation | What actually runs in a session | Permissions are the main tool-control mechanism; policies separately govern provider use. |

The practical distinction from VS Code Copilot is structural. OpenCode spreads agent behavior across configuration, Markdown rule files, and `.opencode/` capability directories, rather than centering everything under a repository customization tree.

---

## 3. Configuration Scopes and Precedence

The OpenCode docs describe a layered config system with merge behavior across scopes.

### 3.1 Load order

The following table captures the documented load order from lower to higher precedence.

| Order | Source | Notes |
|---|---|---|
| 1 | Remote organizational config at `.well-known/opencode` | Loads first when configured or available in the documented remote flow. |
| 2 | Global user config at `~/.config/opencode/opencode.json` | Baseline user defaults. |
| 3 | Config referenced by `OPENCODE_CONFIG` | Additional config file loaded after the default global config. |
| 4 | Project `opencode.json` or `opencode.jsonc` | Found by walking upward from the current directory to the nearest Git directory. |
| 5 | Project and user `.opencode/` directory content | Plural directory names are preferred; singular names remain supported for backward compatibility. |
| 6 | Inline config from `OPENCODE_CONFIG_CONTENT` | Late override channel for injected config content. |
| 7 | Managed config files | Higher-precedence administrative settings. |
| 8 | Managed platform preferences | Documented as highest precedence and not intended for user override. |

The durable point is that these sources merge. Later scopes override earlier values where the same key is defined, but they do not behave like an all-or-nothing replacement layer.

### 3.2 Discovery behavior

| Surface | Discovery behavior |
|---|---|
| Project config | OpenCode starts in the current working directory and traverses upward to the nearest Git directory. |
| `.opencode/` directories | Project-local capability directories are discovered in the active worktree; the docs also describe user-level directories under `~/.config/opencode/`. |
| Rule files | `AGENTS.md` and Claude-compatible fallbacks are found by upward traversal plus matching global locations. |

### 3.3 Variable interpolation and stored credentials

The config docs also matter operationally for two adjacent behaviors:

- variable interpolation supports `{env:VAR}` and `{file:path}`
- `/connect` stores provider credentials in `~/.local/share/opencode/auth.json`

That means provider configuration is split between declarative config and separately persisted authentication state.

---

## 4. Rules and Instruction Loading

### 4.1 Primary rules file

OpenCode’s project rules live in `AGENTS.md`. Global user rules live in `~/.config/opencode/AGENTS.md`.

This is the main durable rule surface. If a repository wants always-on guidance, `AGENTS.md` is the canonical place to start.

### 4.2 Claude compatibility fallbacks

The rules docs also describe Claude-compatible fallbacks:

- project `CLAUDE.md`
- global `~/.claude/CLAUDE.md`
- `.claude/skills/`

Related environment flags can disable those compatibility paths:

- `OPENCODE_DISABLE_CLAUDE_CODE=1`
- `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1`
- `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1`

Within a shared scope, `AGENTS.md` takes precedence over `CLAUDE.md`.

### 4.3 Additional instruction files

Structured config can extend rules through an `instructions` array. The docs describe support for:

- direct file paths
- glob patterns
- remote URLs

Remote fetches are documented with a five-second timeout.

This matters because OpenCode does not treat inline references inside `AGENTS.md` as a native modular include system. If you need composable instruction loading, use `instructions` rather than trying to chain Markdown files manually.

---

## 5. Agents

### 5.1 Where agents can be defined

OpenCode supports two durable agent-definition paths.

| Surface | Location | Notes |
|---|---|---|
| Structured config | `agent` object in `opencode.json` or `opencode.jsonc` | Useful when the agent belongs with other repository config. |
| File-based agent definitions | `.opencode/agents/` and `~/.config/opencode/agents/` | Useful when agent prompts or variants should live as separate Markdown assets. |

### 5.2 Built-in agent model

The linked agent docs distinguish between primary agents and subagents.

| Type | Built-in examples | Durable behavior |
|---|---|---|
| Primary | `build`, `plan` | Direct user-facing working modes. |
| Subagent | `general`, `explore`, `scout` | Delegated specialists for focused work. |

The documented defaults matter:

- `build` is the full-access default primary agent
- `plan` is a restricted primary agent with more conservative edit and shell behavior
- `general` is a full-access subagent except todo usage is restricted by default
- `explore` is read-only for repository exploration
- `scout` is read-only for external-document or dependency research

### 5.3 Agent options

The docs describe the following agent options across config and file-based definitions.

| Option | Purpose |
|---|---|
| `description` | Human-readable summary for selection or discovery |
| `mode` | `primary`, `subagent`, or `all` |
| `model` | Explicit model assignment |
| `prompt` | Inline prompt or prompt file reference depending on surface |
| `permission` | Per-agent tool and guard rules |
| `steps` | Step limit for agent execution |
| `temperature`, `top_p` | Sampling configuration |
| `disable` | Removes the agent from use |
| `hidden` | Hides a subagent from normal autocomplete visibility |
| `color` | Display metadata |
| provider-specific options | Provider-tuned model behavior |

Two details are worth preserving explicitly:

- `steps` is the modern field; `maxSteps` is deprecated
- `prompt` paths in config resolve relative to the config file that declares them

### 5.4 Default-agent and inheritance behavior

- `default_agent` must resolve to a primary agent, or OpenCode falls back to `build` and warns
- subagents inherit the invoking primary agent model when they do not set their own explicit model
- `hidden: true` affects autocomplete visibility, not whether a user can invoke that subagent directly

### 5.5 Practical implication

Use primary agents to represent top-level working modes and subagents to represent narrowly scoped delegation targets. Treat permissions as part of the agent contract, not as a later hardening pass.

---

## 6. Tools and Permissions

### 6.1 Built-in tool surface

The tools docs describe these built-in tools:

- `bash`
- `edit`
- `write`
- `read`
- `grep`
- `glob`
- `lsp` (experimental)
- `apply_patch`
- `skill`
- `todowrite`
- `webfetch`
- `websearch`
- `question`

Additional tool sources include:

- custom tools loaded from `.opencode/tools/` or `~/.config/opencode/tools/`
- MCP server tools whose names are prefixed by server name, such as `mymcp_*`

### 6.2 Tool availability notes

| Tool or behavior | Documented note |
|---|---|
| Default tool access | Tools are enabled by default unless permission rules say otherwise. |
| `write` and `apply_patch` | Controlled by the `edit` permission. |
| `lsp` | Available only when `OPENCODE_EXPERIMENTAL_LSP_TOOL=true` or `OPENCODE_EXPERIMENTAL=true`. |
| `websearch` | Available with the OpenCode provider or when `OPENCODE_ENABLE_EXA` is truthy. |
| `grep` and `glob` | Respect `.gitignore` by default; a project-root `.ignore` file can explicitly allow ignored paths back into search. |

### 6.3 Permission model

Permissions are the primary tool-control mechanism.

| Capability | Behavior |
|---|---|
| Effects | `allow`, `ask`, `deny` |
| Shape | Scalar such as `permission: "allow"` or object keyed by tool and guard name |
| Matching | Wildcards `*` and `?`; last matching rule wins |
| Agent overrides | Per-agent permissions merge with and override global rules |
| Custom or MCP tools | Controlled through the same wildcard matching system |

The permissions docs list keys including:

- `read`
- `edit`
- `glob`
- `grep`
- `bash`
- `task`
- `skill`
- `lsp`
- `question`
- `webfetch`
- `websearch`
- `external_directory`
- `doom_loop`

Notable defaults called out by the docs:

- most tools default to `allow`
- `doom_loop` and `external_directory` default to `ask`
- `read` defaults to `allow`, except `.env` is denied by default while `.env.example` is allowed

### 6.4 Delegation and path guards

- `permission.task` governs which subagents an agent may invoke through the task-delegation tool
- users can still invoke subagents directly with `@`, even if task delegation is restricted
- `external_directory` governs access outside the working directory
- bash permissions match parsed command strings including arguments

### 6.5 Policies are separate from permissions

Provider access is controlled through `experimental.policies`, not through the main permission map.

The documented statement fields are:

- `effect`
- `action`
- `resource`

The currently documented action surface is `provider.use`. Policy matching also supports wildcards, last-match-wins behavior, and an allow-by-default result when no policy matches. The docs recommend policies rather than older provider enabled or disabled toggles for provider access control.

---

## 7. Models and Providers

### 7.1 Default model selection

The default model is configured with the top-level `model` key, using IDs of the form `provider_id/model_id`.

The docs describe this model-selection order:

1. CLI `--model` or `-m`
2. config `model`
3. last used model
4. first internal-priority model

### 7.2 Provider configuration

Provider definitions live under `provider`.

| Config area | Purpose |
|---|---|
| `provider.<provider>.models.<model>.options` | Global per-model options |
| `provider.<provider>.models.<model>.variants` | Named variants for the same model |
| agent-level model settings | Override global per-model options for that agent |
| `small_model` | Separate lighter-weight model slot for cheaper or simpler tasks |

The durable operational point is that provider IDs, model IDs, and policy resources have to align. If the provider name in one place does not match the provider name in another, model selection and provider policies will drift apart.

---

## 8. Commands

Commands are prompt templates with optional routing metadata.

### 8.1 Where commands can be defined

| Surface | Location |
|---|---|
| Structured config | `command` object in `opencode.json` or `opencode.jsonc` |
| File-based commands | `.opencode/commands/` and `~/.config/opencode/commands/` |

Markdown filenames become slash-command names. JSON object keys become command names.

### 8.2 Documented command options

| Option | Purpose |
|---|---|
| `template` | Prompt template body |
| `description` | Human-readable summary |
| `agent` | Route the command to a specific agent |
| `subtask` | Control whether agent routing uses subagent-style delegation |
| `model` | Override the model for that command |

### 8.3 Template interpolation

The commands docs describe several interpolation and inclusion features:

- `$ARGUMENTS`
- positional `$1`, `$2`, `$3`
- shell output injection with `!command`
- file inclusion with `@path`

Shell injections run in the project root.

### 8.4 Routing behavior

- if the target agent is a subagent, the command invokes it as a subtask by default
- `subtask: false` disables that delegated behavior
- `subtask: true` can force subagent-style execution even when the selected agent is a primary agent
- custom commands can override built-in slash commands

---

## 9. Formatters

Formatters are a separate automation layer applied after edits or writes.

### 9.1 Default state and enabling modes

| Setting | Effect |
|---|---|
| `formatter: false` | Disable all formatters |
| `formatter: true` | Enable built-in formatters |
| `formatter: {}` | Keep built-ins enabled while allowing per-formatter overrides or additions |

The docs describe formatters as disabled by default.

### 9.2 Formatter options

Each formatter config can include:

- `disabled`
- `command`
- `environment`
- `extensions`

Custom formatter commands can use `$FILE`.

If a project contains `prettier` in `package.json`, the documented behavior is to prefer Prettier automatically for matching files.

---

## 10. Skills

Skills are a reusable instruction and capability surface built around `SKILL.md` files.

### 10.1 Discovery locations

The skills docs describe discovery in these locations:

- `.opencode/skills/<name>/SKILL.md`
- `~/.config/opencode/skills/<name>/SKILL.md`
- `.claude/skills/<name>/SKILL.md`
- `~/.claude/skills/<name>/SKILL.md`
- `.agents/skills/<name>/SKILL.md`
- `~/.agents/skills/<name>/SKILL.md`

Project-local skills are discovered by upward traversal from the current directory to the active Git worktree.

### 10.2 Required metadata

The docs describe strict frontmatter requirements.

| Field | Requirement |
|---|---|
| `name` | Required; 1-64 chars; lowercase alphanumeric plus single hyphens; must match the containing directory name |
| `description` | Required |
| `license` | Optional |
| `compatibility` | Optional |
| `metadata` | Optional |

Unknown frontmatter fields are ignored.

### 10.3 Loading model

Skills are not always injected into context. They are surfaced through the `skill` tool and loaded on demand, and their use is permission-gated through `permission.skill`.

That makes skills a better fit for reusable, invoked capabilities than for broad always-on project rules.

---

## 11. Custom Tools and MCP Servers

Custom tools and MCP servers both add tools, but they are different extension paths.

### 11.1 Custom tools

| Aspect | Documented behavior |
|---|---|
| Location | `.opencode/tools/` and `~/.config/opencode/tools/` |
| Authoring model | JS or TS definitions, commonly via `tool()` from `@opencode-ai/plugin` |
| Schema model | Zod-based |
| Naming | Default export uses the filename; named exports become `<filename>_<exportname>` |
| Context access | Custom tools can inspect `agent`, `sessionID`, `messageID`, `directory`, and `worktree` |
| Collision behavior | Custom tools override built-ins on name collision |

The docs also make it clear that custom tools may shell out to scripts in other languages, so the durable interface is the tool contract, not the implementation language.

### 11.2 MCP servers

MCP server configuration lives under `mcp` in structured config. Local and remote server shapes differ, but the durable integration model is consistent:

- an MCP server registers a suite of external tools
- tool names are prefixed by the server name
- the same permission system can target those tools with patterns like `server_*`

MCP is powerful but expensive in context and operational surface area. The docs imply it should be enabled selectively rather than treated as a zero-cost default extension point.

---

## 12. Practical Authoring Guidance

### 12.1 Choose the right surface

| Need | Prefer | Why |
|---|---|---|
| Stable project-wide behavioral guidance | `AGENTS.md` | This is the canonical OpenCode rules surface. |
| Structured repository defaults | `opencode.json` or `opencode.jsonc` | Keeps providers, permissions, models, agents, and commands in one mergeable config layer. |
| Reusable agent personas with separate prompts | `.opencode/agents/` | Better when the agent should be maintained as a standalone artifact. |
| Reusable slash commands | `.opencode/commands/` | Keeps prompt templates separate from the main config file. |
| On-demand capability packs | `.opencode/skills/<name>/SKILL.md` | Skills load through the `skill` tool instead of always inflating context. |
| Local code-defined tools | `.opencode/tools/` | Best for repository-specific automation that must appear as tools. |
| External tool suites | `mcp` config | Best when the capability already exists as an MCP server. |

### 12.2 Durable authoring rules

- put always-on guidance in `AGENTS.md`, not into ad hoc prompt references
- keep config authority clear: use permissions for tool control and policies for provider control
- define subagents deliberately and limit their task delegation with `permission.task` when needed
- prefer `.opencode/` directories when commands, skills, agents, or tools deserve separate ownership and review history
- treat provider IDs and model IDs as shared identifiers across config, commands, and policies
- document any intentional reliance on Claude compatibility surfaces, because those fallbacks can be disabled by environment flags

### 12.3 Authoring caution

The OpenCode docs spread key facts across multiple pages. In practice, a correct repository setup usually requires reading at least the config, agents, permissions, and models pages together, with commands, skills, or MCP pages added as needed.

---

## 13. Troubleshooting and Documented Ambiguities

Several useful facts are either split across pages or not perfectly aligned in the current docs. A durable reference should preserve those gaps instead of pretending they are settled.

### 13.1 Ambiguities to account for

| Topic | Ambiguity |
|---|---|
| `list` permission key | The agents docs mention `list`, while the tools docs do not include it in the built-in tool list. |
| Custom-tool definition wording | The tools page suggests custom tools are defined in config, while the custom-tools page documents file-based definitions. |
| Duplicate-name precedence | The docs do not clearly define tie-breaking across duplicate agent, command, tool, or skill names from multiple sources. |
| Skill duplication | The skills docs require uniqueness but do not specify what wins if duplicate names still exist. |
| `.opencode/*` subtree discovery | The docs do not state every subtree’s discovery rules with the same clarity. |
| MCP examples | Some MCP examples still rely on legacy `tools` booleans, while the current guidance centers on `permission`. |
| `patch` versus `apply_patch` naming | Tool naming is not perfectly consistent across all docs. |

### 13.2 Practical troubleshooting flow

When an OpenCode setup behaves unexpectedly, the cheapest high-value checks are usually:

1. confirm which config scope is actually winning for the affected key
2. confirm whether the behavior is governed by `permission`, `experimental.policies`, or agent-local overrides
3. confirm whether the relevant surface is config-based, file-based, or a compatibility fallback
4. confirm whether a name collision exists across `.opencode/`, global config, or built-in defaults
5. confirm whether an environment flag is disabling Claude compatibility, enabling experimental tools, or injecting late config overrides

---

## 14. Sources

This reference is based on the following OpenCode documentation pages.

- <https://opencode.ai/docs/tools/>
- <https://opencode.ai/docs/rules/>
- <https://opencode.ai/docs/models/>
- <https://opencode.ai/docs/commands/>
- <https://opencode.ai/docs/formatters/>
- <https://opencode.ai/docs/permissions/>
- <https://opencode.ai/docs/policies/>
- <https://opencode.ai/docs/skills/>
- <https://opencode.ai/docs/custom-tools/>