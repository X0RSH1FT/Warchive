---
name: "Agent Customization Patterns"
description: "Shared high-level customization guidance for repository-wide Copilot behavior and root customization context."
applyTo: ".github/{copilot-instructions.md,agents/**,prompts/**,instructions/**,skills/**,hooks/**}"
---

# Customization File Patterns

Use these rules when editing Copilot customization files under `.github/`.

For file-type specific authoring guidance, use the scoped instruction files:

- `prompt-files.instructions.md` for `.github/prompts/`
- `agent-files.instructions.md` for `.github/agents/`
- `skill-files.instructions.md` for `.github/skills/`
- `instruction-files.instructions.md` for `.github/instructions/`

Hook JSON files under `.github/hooks/` are covered by `hooks.instructions.md`, not by this markdown-only instruction file.

## Reference Links

Use the local research note as the repository fact base, and use the upstream VS Code docs when exact product behavior matters or when the local note needs to be refreshed.

- Local reference: [docs/research/vscode-copilot-agent-customization-reference.md](../../docs/research/vscode-copilot-agent-customization-reference.md)
- Customizations overview: https://code.visualstudio.com/docs/copilot/customization/overview
- Custom instructions: https://code.visualstudio.com/docs/copilot/customization/custom-instructions
- Prompt files: https://code.visualstudio.com/docs/copilot/customization/prompt-files
- Custom agents: https://code.visualstudio.com/docs/copilot/customization/custom-agents
- Agent skills: https://code.visualstudio.com/docs/copilot/customization/agent-skills

When you rely on an upstream web doc for a rule in this repository, prefer to also anchor the change in the local research note or update that note if the upstream behavior has materially changed.

## Discovery and File Locations

- Keep repository customizations in the standard `.github/` layout.
- Use the conventional paths for committed files: `.github/copilot-instructions.md`, `.github/instructions/`, `.github/prompts/`, `.github/agents/`, and `.github/skills/`.
- Do not assume user-level customizations, parent-repository discovery, or settings such as `chat.agentFilesLocations`, `chat.promptFilesLocations`, or `chat.agentSkillsLocations` will carry repository behavior. Commit the workflow the repo depends on.
- If authoring notes mention parent-repository discovery, treat it as an operational detail, not as the primary loading strategy for this repository.
- Remember that the Agent Customizations editor is useful for diagnostics and authoring support, but the committed files remain the source of truth.

## File Type Selection

- Use `.github/copilot-instructions.md` for concise, always-on project context. Keep it architectural and durable; link to longer docs instead of duplicating them.
- Use `*.instructions.md` for scoped guidance that should apply only to specific files, folders, or technologies via `applyTo`.
- Use `.prompt.md` files for reusable user-invoked workflows or task entry points. Prompt files should define how to start a task, not a long-lived persona.
- Use `.agent.md` files for persistent roles with their own instructions, tool restrictions, allowed subagents, and handoffs.
- Use `.github/skills/<skill-name>/SKILL.md` for portable, reusable capabilities, especially when the workflow benefits from bundled resources such as templates, examples, or scripts.
- Keep customization files in the standard `.github/` locations unless there is a deliberate repo-level reason to do otherwise.

## Workflow Shape

- Keep the shared workflow small: the default path centers on `Coordinator Agent`, `Implementation Agent`, and `Reviewer Agent`, with `Planner Agent` or `Explorer Agent` inserted only when ambiguity or reconnaissance needs justify them.
- Treat `Documentation Agent`, `Testing Agent`, and `Web Research Agent` as optional specialists for documentation-heavy, test-heavy, or external-doc-heavy work, not as mandatory stages on every task.
- Do not add a new default workflow agent unless it owns a distinct domain or workflow stage.
- Prefer coordinator -> implementation -> review handoffs over packing every behavior into one agent.

## Skills and Supporting Resources

- Keep `SKILL.md` focused on when to use the capability and how to load any supporting resources in the skill directory.
- Reference templates, examples, or scripts from the skill instructions when they matter; do not assume they will be discovered implicitly.
- Avoid experimental skill-only features unless the repository has a clear need and the behavior has been verified locally.
- Author skills for progressive loading: discovery should come from `name` and `description`, while deeper resources should be explicitly linked from `SKILL.md`.
- Prefer skills when portability or bundled assets matter; prefer agents when the main need is a persistent role, tool policy, or handoff graph.

## Tools and Approval Posture

- Keep tool access least-privilege. Only enable tools, tool sets, MCP tools, or extension-contributed tools that a role concretely needs.
- If you mention approval modes or operational posture, prefer the safest default. Treat `Bypass Approvals` and especially preview `Autopilot` as exceptional because they reduce review and safety checks.
- Be explicit about external-data risk. Trusted domains can reduce request friction, but they do not remove the need to review fetched content.
- When describing terminal-heavy workflows, remember the repo runs on Windows too; avoid guidance that assumes non-PowerShell shells or shell behavior.

## Stability and Troubleshooting

- Prefer stable customization mechanisms first. Treat preview or experimental features such as nested subagents, skill `context: fork`, or unusual tool-policy overrides as opt-in and justify them in the file body when used.
- Unavailable or misspelled tools can be ignored silently by VS Code, so validate tool names, agent names, and handoff targets carefully.
- When a customization is not behaving as expected, first verify the file path, file extension, frontmatter fields, and any name matching requirements before changing the workflow design.
- If a workflow depends on a skill, verify both the directory name and the skill `name`; mismatches can fail quietly.
- If diagnostics disagree with your expectations, check the committed file first, then the Agent Customizations editor or chat diagnostics, before assuming the model ignored the instructions.

## Validation

- Prefer concise body instructions over long narrative prose.
- After editing customization files, run diagnostics on the touched files before considering the change complete.
- After changing workflow shape, tool lists, or handoff targets, verify that referenced agents, prompts, skills, and tools still exist at the expected paths.
- After introducing uncommon frontmatter fields or preview features, confirm that the file still parses cleanly and that the extra metadata is actually supported in the intended VS Code flow.