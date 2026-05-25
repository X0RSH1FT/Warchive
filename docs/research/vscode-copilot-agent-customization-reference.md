# VS Code Copilot Agent Customization Reference

**Research Date:** May 20, 2026  
**Author:** GitHub Copilot  
**Context:** EverTome local knowledge base for working with VS Code Copilot agent files and related customizations

---

## Table of Contents

1. [Purpose and Scope](#1-purpose-and-scope)
2. [Mental Model: The Customization Stack](#2-mental-model-the-customization-stack)
3. [Where VS Code Looks for Customization Files](#3-where-vs-code-looks-for-customization-files)
4. [Always-On Instructions and Scoped Instructions](#4-always-on-instructions-and-scoped-instructions)
5. [Prompt Files](#5-prompt-files)
6. [Custom Agents](#6-custom-agents)
7. [Skills](#7-skills)
8. [Subagents and Agent Orchestration](#8-subagents-and-agent-orchestration)
9. [Tools, Permissions, and Tool Sets](#9-tools-permissions-and-tool-sets)
10. [Planning Workflows](#10-planning-workflows)
11. [Context Engineering Guidance](#11-context-engineering-guidance)
12. [TDD Workflow Guidance](#12-tdd-workflow-guidance)
13. [Troubleshooting and Operational Notes](#13-troubleshooting-and-operational-notes)
14. [Recommended Authoring Patterns for EverTome](#14-recommended-authoring-patterns-for-evertome)
15. [Quick Reference Templates](#15-quick-reference-templates)
16. [Sources](#16-sources)

---

## 1. Purpose and Scope

This document is a local reference for authoring and maintaining VS Code Copilot customization files, especially agent files used in `.github/agents/`.

It consolidates the relevant parts of the current Visual Studio Code Copilot documentation for:

- always-on instructions
- scoped instructions files
- reusable prompt files
- custom agent files
- skills
- subagents
- tools and approvals
- planning and TDD workflows
- practical context-engineering guidance

The goal is not to restate every page verbatim. The goal is to keep the parts that matter when designing or editing agent files in this repository.

---

## 2. Mental Model: The Customization Stack

VS Code Copilot customizations are best understood as a layered system.

### 2.1 Always-on project context

Use `.github/copilot-instructions.md` when the AI should always know the same high-level project rules, architecture, conventions, or documentation references.

This is the broadest layer and should stay concise. It is for stable project context, not for one-off workflows.

### 2.2 Scoped instructions

Use `*.instructions.md` files when rules should apply only to certain files, folders, or technologies. These are targeted with `applyTo` patterns.

Examples:

- Python-specific rules for `**/*.py`
- UI rules for `evertome/interface/ui/**/*.py`
- test conventions for `test/**/*.py`

### 2.3 Prompt files

Use `.prompt.md` files for repeatable, user-invoked tasks. These are slash-command style prompts that encode a single workflow or prompt variant.

Use prompt files when you want:

- a reusable task entry point
- optional agent/model/tool overrides
- multiple variants of the same workflow without creating a new persona

### 2.4 Custom agents

Use `.agent.md` files when you need a persistent persona with its own:

- instructions
- tool restrictions
- model preference
- subagent whitelist
- handoffs to other agents

This is the right mechanism for planners, reviewers, implementers, TDD phases, or other role-specific modes.

### 2.5 Skills

Use `SKILL.md` plus adjacent resources when you need a portable capability that may include instructions, scripts, examples, or templates.

Skills are not just instructions. They are reusable task capabilities with optional supporting files.

### 2.6 Supporting systems

The rest of the system is what makes the above usable in practice:

- tools and tool approvals
- subagents
- handoffs
- MCP servers
- hooks
- the Agent Customizations editor

The practical rule is:

- put enduring project rules in instructions
- put repeated user-invoked tasks in prompt files
- put role-based workflows in agents
- put portable capabilities with resources in skills

---

## 3. Where VS Code Looks for Customization Files

### 3.1 Workspace locations

The standard workspace locations are:

```text
.github/
  copilot-instructions.md
  instructions/
  prompts/
  agents/
  skills/
```

Relevant defaults:

- always-on instructions: `.github/copilot-instructions.md`
- scoped instructions: `.github/instructions/*.instructions.md`
- prompt files: `.github/prompts/*.prompt.md`
- custom agents: `.github/agents/*.agent.md`
- skills: `.github/skills/<skill-name>/SKILL.md`

### 3.2 User-level locations

VS Code also supports user-level customizations that apply across workspaces. The documentation describes user/profile storage for prompts and agents, and Copilot profile paths such as:

- `~/.copilot/agents`
- `~/.copilot/skills`

User-level variants are useful for personal workflows that should not be committed to the repository.

### 3.3 Additional locations via settings

VS Code supports extra customization locations through settings such as:

- `chat.agentFilesLocations`
- `chat.promptFilesLocations`
- `chat.agentSkillsLocations`

These are useful when a team wants shared customizations outside the default `.github/` layout.

### 3.4 Parent repository discovery

In monorepos, VS Code normally discovers customizations only within the opened workspace folder. If `chat.useCustomizationsInParentRepositories` is enabled, VS Code walks upward until it finds the repository root and loads customizations found between the workspace folder and that root.

This discovery applies to:

- `copilot-instructions.md`
- `AGENTS.md`
- `CLAUDE.md`
- `*.instructions.md`
- `.prompt.md`
- `.agent.md`
- `SKILL.md`
- hooks

Conditions noted in the docs:

- the opened folder is not itself a repo root
- a parent folder contains `.git`
- the parent repository is trusted

This matters if EverTome is ever opened from a subfolder instead of the repo root.

### 3.5 Agent Customizations editor

VS Code provides a preview Agent Customizations editor that centralizes the management of instructions, prompts, agents, skills, hooks, MCP servers, and plugins. It includes tabs, validation, and generation flows for these file types.

It is useful operationally, but the source of truth is still the files in the repository.

---

## 4. Always-On Instructions and Scoped Instructions

### 4.1 `.github/copilot-instructions.md`

This file is intended for always-on project context. The documentation consistently positions it as the default place to record:

- project architecture
- coding standards
- important repository constraints
- references to supporting project docs

The docs repeatedly recommend keeping it concise and linking to supporting documents instead of duplicating large bodies of text.

### 4.2 `*.instructions.md`

Instructions files are used for targeted guidance. Their main value is selective applicability through `applyTo` patterns.

This allows the AI to load only the instructions that are relevant to the current file or work area.

### 4.3 Typical frontmatter pattern

The docs and guides consistently use frontmatter like:

```md
---
description: Use these guidelines when generating or updating tests.
applyTo: test/**
---
```

The important fields are:

- `description`: why the file exists and when it applies
- `applyTo`: glob-style targeting

### 4.4 What instructions are good for

Use instructions files for:

- language-specific rules
- framework conventions
- test patterns
- directory-specific constraints
- file-type-specific review and implementation guidance

Do not use instructions files as the primary mechanism for user-invoked workflows or role-based personas. That is what prompt files and agents are for.

### 4.5 Practical guidance from the docs

The strongest recurring guidance is:

- start small
- keep instructions focused on decision-making context
- prefer links to canonical docs over duplicated prose
- update instructions when the codebase evolves
- use file-scoped instructions instead of bloating the always-on file

---

## 5. Prompt Files

### 5.1 What prompt files are for

Prompt files are reusable slash-command prompts stored as `.prompt.md` files. They are the right tool for lightweight, single-task workflows.

Examples from the docs include:

- scaffolding a component
- running a security review workflow
- generating tests
- creating a plan with a specific interaction pattern

### 5.2 Default location

Workspace prompt files live in:

```text
.github/prompts/
```

### 5.3 Prompt file frontmatter

Prompt files can define:

- `description`
- `name`
- `argument-hint`
- `agent`
- `model`
- `tools`

Key behavior:

- if `agent` is omitted, the current agent is used
- if tools are specified, the default agent becomes `agent`
- unavailable tools are ignored rather than failing the prompt definition

### 5.4 Prompt body behavior

The body is plain Markdown instructions. It can:

- reference workspace files using Markdown links
- reference tools using `#tool:<tool-name>`
- use input variables like `${input:variableName}`

This makes prompt files a good way to encode small workflow variants without creating a dedicated persona.

### 5.5 Tool priority order

This is important when prompts and agents interact.

The docs specify the tool priority order as:

1. tools listed in the prompt file
2. tools from the custom agent referenced by the prompt
3. default tools for the selected agent

This means a prompt file can narrow or override a broader tool set from an agent.

### 5.6 When to choose a prompt file instead of an agent

Choose a prompt file when:

- the behavior is task-specific rather than persona-specific
- you do not need persistent tool restrictions across many interactions
- you want multiple variants of the same workflow
- you want a user-invoked slash command

---

## 6. Custom Agents

### 6.1 What a custom agent is

A custom agent is a persona with its own instructions and operational boundaries. It is defined in a `.agent.md` file.

The built-in agents are general-purpose. Custom agents exist to constrain or specialize the AI for a particular role.

Examples from the docs:

- planner
- reviewer
- implementer
- TDD red phase
- TDD green phase
- refactor phase

### 6.2 Default location

Workspace custom agents live in:

```text
.github/agents/
```

The docs note that VS Code detects `.md` files in this folder as custom agents, though the standard format is `.agent.md`.

### 6.3 Agent frontmatter fields

The documented frontmatter fields include:

- `name`
- `description`
- `argument-hint`
- `tools`
- `agents`
- `model`
- `user-invocable`
- `disable-model-invocation`
- `target`
- `mcp-servers`
- `handoffs`
- `hooks`

Important behavior details:

- `tools` may include built-in tools, tool sets, MCP tools, or extension-contributed tools
- `agents` controls which custom agents may be used as subagents
- `model` may be a single model or a prioritized list
- `user-invocable: false` hides the agent from the picker but still allows subagent use
- `disable-model-invocation: true` blocks use as a subagent
- `infer` is deprecated and should not be used in new authoring

### 6.4 Agent body behavior

The body contains Markdown instructions that are prepended to the user prompt when the agent is active.

The body can:

- link to other files
- reference tools explicitly using `#tool:<tool-name>`
- define workflow steps and review criteria

### 6.5 Handoffs

Handoffs are one of the most useful custom-agent capabilities.

Each handoff can define:

- `label`
- `agent`
- `prompt`
- `send`
- `model`

These appear as suggested next actions after a response completes. They are well suited to:

- planning -> implementation
- implementation -> review
- red -> green -> refactor TDD cycles

### 6.6 Least-privilege design

The docs consistently support a least-privilege model:

- planners should often be read-only
- reviewers should often be read-only
- implementers need edit and execution tools
- coordinator agents should have `agent` access and delegate to narrower workers

This is one of the strongest practical design rules to keep.

### 6.7 Claude agent format

VS Code also recognizes `.md` files in `.claude/agents/` using Claude-specific frontmatter such as:

- `name`
- `description`
- `tools`
- `disallowedTools`

VS Code maps Claude-style tool names to the corresponding VS Code tools. This matters mainly if cross-tool compatibility is a goal.

---

## 7. Skills

### 7.1 What skills are for

Skills are reusable capabilities packaged as directories containing a `SKILL.md` file and optional resources.

They are intended for workflows that may need:

- detailed instructions
- scripts
- templates
- examples
- additional files loaded on demand

The documentation positions skills as a better fit than instructions when the need is workflow capability rather than coding policy.

### 7.2 Default locations

Workspace skill locations include:

- `.github/skills/`
- `.claude/skills/`
- `.agents/skills/`

User-level skill locations also exist.

### 7.3 Skill directory rules

The parent directory name must match the `name` in `SKILL.md`. Invalid names can cause the skill to silently fail to load.

Allowed skill names are limited to lowercase letters, numbers, and hyphens.

### 7.4 `SKILL.md` frontmatter

Required:

- `name`
- `description`

Optional:

- `argument-hint`
- `user-invocable`
- `disable-model-invocation`
- `context`

`context: fork` is an experimental option that runs the skill in a dedicated subagent context and returns only the final result.

### 7.5 How skills load

The docs describe a progressive loading model:

1. discover by `name` and `description`
2. load the `SKILL.md` body when relevant or explicitly invoked
3. load referenced resources only when the instructions refer to them

That means supporting files should be linked from `SKILL.md` if they matter.

### 7.6 When to choose a skill instead of an agent

Choose a skill when:

- the capability should work across VS Code, Copilot CLI, and cloud agents
- the workflow needs scripts, examples, or templates
- you want on-demand loading rather than always-on persona behavior

Skills and agents are complementary. An agent can rely on skills, but the concepts are distinct.

---

## 8. Subagents and Agent Orchestration

### 8.1 What subagents do

Subagents let the main agent delegate a focused task into an isolated context and receive a summarized result back.

This is useful for:

- research before implementation
- parallel code analysis
- multi-perspective review
- coordinator/worker workflows

### 8.2 Invocation requirements

The main agent needs the `runSubagent` or `agent` tool enabled to invoke subagents.

The docs emphasize that users do not usually need to manually command subagent invocation every time. The main agent can decide when to delegate.

### 8.3 Controlling agent visibility and invocation

Two fields govern how custom agents participate:

- `user-invocable`
- `disable-model-invocation`

This gives four useful patterns:

- visible and subagent-eligible
- hidden but subagent-eligible
- visible but not subagent-eligible
- fully disabled from both paths

### 8.4 Restricting available subagents

The `agents` field in an agent file can:

- allow all agents with `*`
- block all with `[]`
- whitelist specific agent names

This is especially important for orchestrators that should use only a curated set of worker agents.

### 8.5 Model selection for subagents

The model resolution order is:

1. explicit model in the subagent invocation
2. `model` on the custom agent used as the subagent
3. the parent session model

The docs also note that the requested model cannot exceed the cost tier of the main model.

### 8.6 Nested subagents

Nested subagents are disabled by default. To allow them, `chat.subagents.allowInvocationsFromSubagents` must be enabled.

Even then, nesting is capped at a maximum depth of 5.

### 8.7 Orchestration patterns from the docs

The documentation highlights two useful patterns:

#### Coordinator and worker

One high-level agent delegates to specialized planners, architects, implementers, or reviewers.

This is well suited to complex implementation workflows.

#### Multi-perspective review

One reviewer agent launches multiple parallel review perspectives such as:

- correctness
- code quality
- security
- architecture

Then it synthesizes the findings.

This is a strong pattern when review depth matters more than speed.

---

## 9. Tools, Permissions, and Tool Sets

### 9.1 Tool selection

Agents can use built-in tools, MCP tools, and extension-contributed tools. The docs recommend enabling only the tools relevant to the task.

This matters because overly broad tool access:

- adds noise
- increases risk
- can reduce agent focus

### 9.2 Explicit tool references

In prompts and agent bodies, tools can be referenced using:

```text
#tool:<tool-name>
```

This is useful when a workflow needs a specific tool path to be obvious.

### 9.3 Permission levels

The documented permission levels are:

- `Default Approvals`
- `Bypass Approvals`
- `Autopilot` (preview)

Summary:

- Default uses standard confirmation behavior
- Bypass auto-approves tools and retries errors but can still ask clarifying questions
- Autopilot auto-approves tools, auto-responds to questions, and keeps working until complete

The docs explicitly warn that Bypass and Autopilot reduce safety protections and should be used only with care.

### 9.4 Tool approvals

Approvals can be configured centrally, including:

- pre-approval to skip the confirmation dialog
- post-approval to skip reviewing returned content before it enters context

This is especially relevant for web or external-data tools because of prompt-injection risk.

### 9.5 URL approval

Web fetches use a two-step approval model:

- approve the request to the URL
- approve the fetched response content before it is added to context

Trusted domains help with request approval, but not with response review.

### 9.6 Terminal behavior

Agents can run terminal commands, continue long-running commands in the background, and in some cases auto-approve terminal commands according to configured rules.

The docs also note:

- PowerShell is preferred on Windows
- shell integration matters for the agent to observe terminal state reliably
- terminal commands can be sandboxed in preview environments

### 9.7 Tool sets

Tool sets are named groups of tools defined in JSONC so they can be enabled or referenced together.

This is useful when several related tools are commonly used together, such as a read-only investigation set.

---

## 10. Planning Workflows

### 10.1 Built-in Plan agent

VS Code includes a built-in Plan agent for generating implementation plans before coding.

The documented flow is:

1. enter a planning task
2. answer clarifying questions
3. review the summary, implementation steps, and verification steps
4. iterate
5. hand off to implementation

### 10.2 Session memory

The Plan agent stores its plan in session memory as:

```text
/memories/session/plan.md
```

That memory is session-scoped rather than persistent across conversations.

### 10.3 Planning customization

The docs describe three planning customization levers:

- custom planning agents
- default model selection for planning
- additional tools for the plan agent

### 10.4 Practical planning guidance

The guides consistently suggest:

- use planning for medium and large tasks
- keep planning and implementation as separate concerns
- use handoffs to transition into implementation
- use a plan template if consistency matters

---

## 11. Context Engineering Guidance

The context engineering guide provides the clearest high-level workflow for turning these customization mechanisms into a durable system.

### 11.1 Three-step model

The guide frames context engineering as:

1. curate project-wide context
2. generate an implementation plan
3. generate implementation code from the plan

### 11.2 Recommended documentation approach

The docs recommend collecting key project knowledge into concise documentation such as:

- product overview
- architecture overview
- contributing guidance

Then link those files from `.github/copilot-instructions.md`.

### 11.3 Best-practice themes

The strongest recurring themes are:

- start small and iterate
- keep always-on context concise
- keep context fresh
- separate planning, coding, testing, and debugging workflows
- version the customization setup in git
- update customizations based on observed agent mistakes

### 11.4 Anti-patterns to avoid

The guide explicitly warns against:

- context dumping
- inconsistent guidance across docs
- neglecting validation
- one-size-fits-all customization design

This maps directly to authoring decisions in `.github/`.

---

## 12. TDD Workflow Guidance

The TDD guide is mainly about custom agents and handoffs, but it is also useful as a model for role-based agent design.

### 12.1 Phase-specific agents

The guide proposes separate agents for:

- red: write failing tests only
- green: implement the minimum code to pass tests
- refactor: improve code while preserving behavior

This is a canonical example of why custom agents exist at all: each phase has different objectives, allowed actions, and validation rules.

### 12.2 Handoff cycle

The TDD guide uses handoffs to create a controlled cycle:

- Red -> Green
- Green -> Refactor
- Refactor -> Red

This keeps the human in the loop between phases.

### 12.3 Targeted instructions for tests

The guide also recommends storing testing guidance in a dedicated instructions file with `applyTo` patterns, rather than stuffing testing rules into the always-on project instructions.

### 12.4 Transferable lesson

Even if a team does not use strict TDD, the pattern generalizes well:

- split incompatible goals into separate agents
- constrain each agent's tools
- use handoffs for structured transitions
- validate within each phase before moving forward

---

## 13. Troubleshooting and Operational Notes

### 13.1 Diagnostics and logs

The docs point to several ways to troubleshoot customization issues:

- the Agent Customizations editor
- customization diagnostics in chat
- Show Agent Debug Logs

When a customization is not behaving as expected, first verify that:

- the file is in a discovered location
- the name and extension are correct
- the frontmatter fields are valid
- referenced tools actually exist
- relevant settings are enabled

### 13.2 Silent failure risks

The most important silent-failure risk called out by the docs is with skills:

- invalid skill names
- mismatch between the directory name and `name`

These can cause the skill not to load without a loud failure signal.

### 13.3 Unavailable tools are ignored

For agents and prompts, the docs note that if a configured tool is unavailable, it is ignored. That means a typo or missing extension can degrade behavior without immediately crashing the customization.

### 13.4 Some features are preview or experimental

Several advanced capabilities are not baseline-stable in the docs:

- Autopilot
- nested subagents
- `context: fork` for skills
- agent hooks in some contexts
- sandboxing
- parts of the Agent Customizations editor and plugin story

When building repository workflows, prefer stable mechanisms first.

---

## 14. Recommended Authoring Patterns for EverTome

These recommendations are specific to how this repository already uses `.github/` customization files.

### 14.1 Keep `.github/copilot-instructions.md` architectural, not procedural

That file should keep stable repository facts, architecture, validation commands, and high-level collaboration rules.

Do not turn it into a dump of every specialized workflow.

### 14.2 Keep file-specific behavior in `*.instructions.md`

EverTome already benefits from scoped rules for:

- Python files
- Streamlit UI files
- tests

Continue using scoped instructions whenever a rule applies only to a layer, technology, or path.

### 14.3 Use custom agents for real roles

Create or refine custom agents only when the role truly changes behavior.

Good candidates:

- planner
- implementation agent
- code reviewer
- prompt evaluator
- TDD phases
- docs or research agent

Bad candidates:

- tiny prompt variations that would be simpler as prompt files

### 14.4 Design agents with least privilege

For each agent, start by asking:

- does it need edit access?
- does it need terminal access?
- does it need subagents?
- does it need the web?

Then include only the minimum tool set that supports the role.

### 14.5 Use prompt files for entry points, not for identity

If the need is "run this workflow variant," use a prompt file.

If the need is "adopt this role and keep acting that way," use an agent.

### 14.6 Use skills only when extra resources matter

If a workflow requires:

- a template
- examples
- scripts
- auxiliary files

then a skill is a better container than a giant agent file.

### 14.7 Prefer explicit handoff graphs over overloaded super-agents

If a workflow has distinct phases, model them explicitly. It is usually better to have:

- a planner
- an implementer
- a reviewer

than one agent with a long, contradictory instruction body.

### 14.8 Treat customizations as living code

The guides repeatedly encourage iteration based on observed mistakes. In practice:

- fix recurring bad behavior at the right layer
- update narrow scoped files instead of bloating global files
- keep examples and templates current
- commit the `.github/` tree like application code

---

## 15. Quick Reference Templates

### 15.1 Minimal scoped instructions file

```md
---
description: Use these guidelines when editing pytest files.
applyTo: test/**/*.py
---

# Testing Guidelines

- Follow the project's existing pytest patterns.
- Prefer focused tests over large integration-style tests.
- Keep mocks aligned with existing fixtures.
```

### 15.2 Minimal prompt file

```md
---
name: plan-qna
description: Create a plan after asking clarifying questions.
agent: plan
tools: ['search/codebase', 'search/usages', 'read/problems']
---

Analyze the request briefly, ask 3 clarifying questions, then produce an implementation plan.
```

### 15.3 Minimal custom agent

```md
---
name: Reviewer
description: Review code for correctness, security, and maintainability.
tools: ['read', 'search']
user-invocable: true
disable-model-invocation: false
---

# Reviewer Agent

You review code changes and identify bugs, risks, regressions, and missing validation.
Do not edit files.
Prioritize findings by severity and explain why each issue matters.
```

### 15.4 Custom agent with handoff

```md
---
name: Planner
description: Create a structured implementation plan.
tools: ['read', 'search', 'agent']
handoffs:
  - label: Start Implementation
    agent: Implementation Agent
    prompt: Implement the approved plan.
    send: false
---

# Planner

Research the task, clarify uncertainties, and produce an actionable implementation plan.
Do not implement code in this mode.
```

### 15.5 Minimal skill

```md
---
name: update-readme
description: Update README content to match recent code changes.
---

# Update README

Review recent changes, identify newly exposed functionality, and update the README.
Reference any supporting templates or examples from this skill directory.
```

---

## 16. Sources

Primary documentation reviewed:

- https://code.visualstudio.com/docs/copilot/overview
- https://code.visualstudio.com/docs/copilot/getting-started
- https://code.visualstudio.com/docs/copilot/agents/overview
- https://code.visualstudio.com/docs/copilot/agents/agents-tutorial
- https://code.visualstudio.com/docs/copilot/agents/planning
- https://code.visualstudio.com/docs/copilot/agents/agent-tools
- https://code.visualstudio.com/docs/copilot/agents/subagents
- https://code.visualstudio.com/docs/copilot/customization/overview
- https://code.visualstudio.com/docs/copilot/customization/custom-instructions
- https://code.visualstudio.com/docs/copilot/customization/prompt-files
- https://code.visualstudio.com/docs/copilot/customization/custom-agents
- https://code.visualstudio.com/docs/copilot/customization/agent-skills
- https://code.visualstudio.com/docs/copilot/guides/context-engineering-guide
- https://code.visualstudio.com/docs/copilot/guides/customize-copilot-guide
- https://code.visualstudio.com/docs/copilot/guides/test-driven-development-guide
- https://code.visualstudio.com/docs/copilot/guides/debug-with-copilot

Useful associated references incorporated during research:

- https://code.visualstudio.com/docs/copilot/customization/overview#_agent-customizations-editor
- https://code.visualstudio.com/docs/copilot/customization/overview#_parent-repository-discovery

Research note:

Some pages did not extract cleanly during the fetch pass, but the relevant agent-file and customization guidance was recoverable from overlapping pages, linked reference sections, and workflow guides.