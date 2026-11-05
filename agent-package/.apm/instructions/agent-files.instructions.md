---
name: "Agent File Guidance"
description: Rules for authoring the agent files.
applyTo: "**/*.agent.md"
---

# Agent File Guidance

- VS Code custom agent file reference: `https://code.visualstudio.com/docs/agents/reference/custom-agent-file-reference`
- GitHub Copilot custom agents configuration: `https://docs.github.com/en/copilot/reference/custom-agents-configuration`

## Role Boundaries

- Keep each agent file focused on one durable role with a well defined objectives and behavior.
- If a role can be handled by an existing agent plus a prompt file, prefer the prompt file over adding another agent.

## Frontmatter

- Keep agent frontmatter minimal and role-driven. Use only the fields the role actually needs, such as `name`, `description`, `tools`.
- Keep `name` stable once prompts, handoffs, or documentation reference it.
- Write `description` as routing text that says what the role owns and when to use it.
- Keep `tools` least-privilege. Read-heavy roles should not gain edit or terminal access unless their job truly requires it.
- For agents that ask users for clarification or approval, instruct them to use only a question tool actually exposed **and permitted** by the active harness and their tool policy: `vscode/askQuestions` in VS Code, or `ask_user` if exposed in a Copilot runtime. These are distinct identifiers, not aliases; a frontmatter entry does not guarantee availability in another host, and subagents may have different access. If no permitted question tool is available, ask in chat and wait when user-facing chat is available; otherwise, a delegated agent must return the blocking question or approval request, its scope, and the decision needed to its caller, then stop the blocked work. The caller must relay it to the user and resume that work only after receiving the answer. Never perform an approval-gated action while awaiting approval. Do not delegate solely to get a question tool or add unverified tool IDs to frontmatter.
- For delegation, `agent` is a built-in tool alias in both VS Code and Copilot cloud. `todo` works in VS Code but is not supported in Copilot cloud; shared agents must not require it for progress tracking.
- For VS Code-only agents, keep the `agents` allowlist curated; do not allow `*` unless broad delegation is deliberate. For agents shared with the GitHub Copilot harness, omit `agents` (not documented there) and state permitted delegation targets in the body instead. Prose routing is not an enforced allowlist.
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
- Make sure every referenced handoff target matches the exact current agent name in `agent-package/.apm/agents/`.
- Do not duplicate the entire workflow in each handoff prompt. The handoff should name the next action, not restate the current agent body.
- Add a new agent only when the repository needs a distinct role, tool policy, or workflow boundary that existing agents cannot represent cleanly.
- Treat nested subagents as exceptional and avoid designing normal workflow paths that depend on them. Unless requirements explicitly state the need for an orchestrator agent and subagents, prefer workflows and roles that can be handled by a single agent.
- When delegation is required, grant the agent delegation tool in `tools` and name the specialist to invoke; an `agents` allowlist alone does not provide delegation.

## Validation

- After editing an agent file, run diagnostics on the touched file.
- From the repository root, run the read-only `./agent-package/check-package.ps1` to verify package agents, instructions, and the complete, sorted matching `agent-package/apm.yml` include list. When APM is available, pack from `agent-package/` with `apm pack --archive -o ./dist`.
- Verify that referenced agents, prompts, skills, and tool names still exist.
- If you change workflow shape or delegation rules, inspect the neighboring prompts or agents that route into that file so the graph still makes sense.
- If you introduce uncommon or preview metadata, confirm it is supported by the intended VS Code flow before concluding.