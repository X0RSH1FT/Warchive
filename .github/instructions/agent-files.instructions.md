---
description: Rules for authoring custom agent files under .github/agents. Use when editing coordinator, planner, explore, implementation, reviewer, documentation, testing, or web-research agent files in this repository.
applyTo: ".github/agents/**/*.md"
---

# Agent File Guidance

- VS Code custom agents docs: `https://code.visualstudio.com/docs/copilot/customization/custom-agents`

## Role Boundaries

- Keep each agent file focused on one durable role with a well defined objectives and behavior.
- If a role can be handled by an existing agent plus a prompt file, prefer the prompt file over adding another agent.

## Frontmatter

- Keep agent frontmatter minimal and role-driven. Use only the fields the role actually needs, such as `name`, `description`, `tools`.
- Keep `name` stable once prompts, handoffs, or documentation reference it.
- Write `description` as routing text that says what the role owns and when to use it.
- Keep `tools` least-privilege. Read-heavy roles should not gain edit or terminal access unless their job truly requires it.
- Keep `agents` curated. Do not allow `*` unless broad delegation is a deliberate and defended design choice.
- Use `model` only when the role has a clear, justified need for a distinct model profile; otherwise inherit the session model.

## Body Content

- State the role's primary responsibility first, work constraints, and validation expectations.
- Keep the instructions role-stable across many tasks. If the body starts describing a single workflow invocation in detail, move that task entry to a prompt file.
- Prefer concise operational language over long narrative explanations.

## Prompt-Technique Coverage

- Agent bodies should use the repository's prompting techniques intentionally: `task decomposition`, `few-shot prompting`, `reasoning scaffolds`, `tool use`, `retrieval`, `planner-executor workflow`, and `review loop`.
- Use `task decomposition` to define the agent's work processes.
- Use `few-shot prompting` sparingly for agent-specific response shapes or handoff examples.
- Use `reasoning scaffolds` for checklists, decision criteria, validation order, and completion contracts when they improve repeatability.
- Use `tool use` and `retrieval` to require nearby source checks before the agent changes routing, policy, or validation guidance.
- Leave a technique out when it does not help the role; explicit restraint is better than prompt bloat.

## Handoffs and Delegation

- Keep handoff labels short and action-oriented.
- Keep handoff metadata disciplined: use `label`, `agent`, `prompt`, and `send` to move to the next stage; add `model` only when that handoff needs a different model.
- Make sure every referenced handoff target matches the exact current agent name in `.github/agents/`.
- Do not duplicate the entire workflow in each handoff prompt. The handoff should name the next action, not restate the current agent body.
- Add a new agent only when the repository needs a distinct role, tool policy, or workflow boundary that existing agents cannot represent cleanly.
- Treat nested subagents as exceptional and avoid designing normal workflow paths that depend on them. Unless requirements explicitly state the need for an orchestrator agent and subagents, prefer workflows and roles that can be handled by a single agent.

## Validation

- After editing an agent file, run diagnostics on the touched file.
- Verify that referenced agents, prompts, skills, and tool names still exist.
- If you change workflow shape or delegation rules, inspect the neighboring prompts or agents that route into that file so the graph still makes sense.
- If you introduce uncommon or preview metadata, confirm it is supported by the intended VS Code flow before concluding.