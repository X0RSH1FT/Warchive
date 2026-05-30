---
description: Rules for authoring custom agent files under .github/agents. Use when editing coordinator, planner, explore, implementation, reviewer, documentation, testing, or web-research agent files in this repository.
applyTo: ".github/agents/**/*.md"
---

# Agent File Guidance

Use this file together with [agent-customization.instructions.md](agent-customization.instructions.md) when editing custom agents under `.github/agents/`.

Reference anchors:

- Broad customization guidance: [agent-customization.instructions.md](agent-customization.instructions.md)
- Local research note: [docs/research/vscode-copilot-agent-customization-reference.md](../../docs/research/vscode-copilot-agent-customization-reference.md)
- VS Code custom agents docs: https://code.visualstudio.com/docs/copilot/customization/custom-agents

## Role Boundaries

- Keep each agent file focused on one durable role with a stable objective, not a one-off task variant.
- Preserve the repository's default workflow shape: `Coordinator Agent` routes work, `Implementation Agent` applies source changes, and `Reviewer Agent` evaluates non-trivial changes before closure.
- Treat `Planner Agent` and `Explorer Agent` as optional inserted stages for planning-heavy or read-heavy work, not as mandatory stops on every task.
- Treat `Documentation Agent`, `Testing Agent`, and `Web Research Agent` as specialists for documentation-heavy, validation-heavy, or external-doc-fact-gathering slices rather than general-purpose fallback agents.
- If a role can be handled by an existing agent plus a prompt file, prefer the prompt file over adding another agent.

## Frontmatter

- Keep agent frontmatter minimal and role-driven. Use only the fields the role actually needs, such as `name`, `description`, `tools`, `agents`, `handoffs`, `model`, `user-invocable`, and `disable-model-invocation`.
- Keep `name` stable once prompts, handoffs, or documentation reference it.
- Write `description` as routing text that says what the role owns and when to use it.
- Keep `tools` least-privilege. Read-heavy roles should not gain edit or terminal access unless their job truly requires it.
- Keep `agents` curated. Do not allow `*` unless broad delegation is a deliberate and defended design choice.
- Do not add deprecated metadata such as `infer`.

## Body Content

- State the role's primary responsibility first, then its delegation rules, direct-work limits, and validation expectations.
- Keep the instructions role-stable across many tasks. If the body starts describing a single workflow invocation in detail, move that task entry to a prompt file.
- Use explicit delegation rules when the agent should hand work to another repository agent instead of absorbing unrelated work.
- Prefer concise operational language over long narrative explanations.
- When an agent can work directly in a small slice, say so explicitly and define the boundary.

## Prompt-Technique Coverage

- Agent bodies should use the repository's prompting techniques intentionally: `task decomposition`, `few-shot prompting`, `reasoning scaffolds`, `tool use`, `retrieval`, `planner-executor workflow`, and `review loop`.
- Use `task decomposition` to bound the role's default slice and prevent one agent from absorbing the full workflow.
- Use `few-shot prompting` sparingly for agent-specific response shapes or handoff examples, not as filler.
- Use `reasoning scaffolds` for checklists, decision criteria, validation order, and completion contracts when they improve repeatability.
- Use `tool use` and `retrieval` to require nearby source checks before the agent changes routing, policy, or validation guidance.
- Use `planner-executor workflow` to keep delegation and handoffs explicit whenever another agent owns planning, implementation, testing, documentation, or review.
- Use a `review loop` whenever a non-trivial agent refactor could create routing drift or validation gaps.
- Leave a technique out when it does not help the role; explicit restraint is better than prompt bloat.

## Handoffs and Delegation

- Use handoffs for real stage transitions such as planning -> implementation or implementation -> review.
- Keep handoff labels short and action-oriented.
- Make sure every referenced handoff target matches the exact current agent name in `.github/agents/`.
- Do not duplicate the entire workflow in each handoff prompt. The handoff should name the next action, not restate the current agent body.
- Add a new agent only when the repository needs a distinct role, tool policy, or workflow boundary that existing agents cannot represent cleanly.

## Validation

- After editing an agent file, run diagnostics on the touched file.
- Verify that referenced agents, prompts, skills, and tool names still exist.
- If you change workflow shape or delegation rules, inspect the neighboring prompts or agents that route into that file so the graph still makes sense.
- If you introduce uncommon or preview metadata, confirm it is supported by the intended VS Code flow before concluding.