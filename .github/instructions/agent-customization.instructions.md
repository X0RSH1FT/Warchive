---
name: "Agent Customization Patterns"
description: "Rules for authoring VS Code Copilot markdown customization files in .github. Use when editing agents, prompts, instructions, workflows, or skills in this repository."
applyTo: ".github/**/*.md"
---

# Customization File Patterns

Use these rules when editing Copilot customization files under `.github/`.

Hook JSON files under `.github/hooks/` are covered by `hooks.instructions.md`, not by this markdown-only instruction file.

## Discovery and File Locations

- Keep repository customizations in the standard `.github/` layout unless there is a deliberate reason to rely on settings-based discovery.
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

## Frontmatter Discipline

- Keep YAML frontmatter valid and minimal: spaces only, valid arrays, and a closing `---`.
- For instructions files, keep `description` and `applyTo` accurate and specific.
- For prompt files, prefer `name`, `description`, `argument-hint`, and `agent`. Add `model` only when the workflow genuinely needs a different model choice.
- For agent files, use only the fields the role needs, such as `name`, `description`, `tools`, `agents`, `handoffs`, `model`, `user-invocable`, `disable-model-invocation`, `target`, `mcp-servers`, and `hooks`.
- Do not introduce deprecated metadata such as `infer` in new or revised agent files.
- For skills, make sure the parent directory name matches the skill `name` exactly and keep skill names lowercase with letters, numbers, and hyphens.
- For skills, use visibility and invocation fields such as `argument-hint`, `user-invocable`, and `disable-model-invocation` only when they materially improve discovery or orchestration.
- Use optional fields such as skill `context` only when the behavior is understood and verified locally; treat experimental metadata as opt-in rather than default.

## Workflow Shape

- Keep the shared workflow small: the default shared path is `Coordinator Agent`, `Implementation Agent`, and `Reviewer Agent`.
- Treat `Documentation Agent` and `Testing Agent` as optional specialists for documentation-heavy or test-heavy work, not as mandatory stages on every task.
- Do not add a new default workflow agent unless it owns a distinct domain or workflow stage.
- Prefer coordinator -> implementation -> review handoffs over packing every behavior into one agent.

## Discovery and Routing

- Write `description` fields as discovery text, not labels.
- Include concrete trigger phrases and a `Use when ...` clause when possible.
- Keep `name` stable once prompts or handoffs reference it.
- Keep prompt and agent names action-oriented and easy to discover from the picker or slash-command surface.
- Prefer concise metadata that helps routing and discovery over narrative summaries inside frontmatter fields.

## Prompt and Agent Boundaries

- In this repository, prompt files should not declare `tools`; the referenced agent owns the tool surface.
- If a workflow needs a different tool policy, change the agent rather than adding a prompt-level override.
- Treat prompt metadata as task routing and prompt text only, not as a second tool-policy layer.
- Prompt files should stay task-scoped: use them to collect intent, clarify scope, and route to the right agent rather than to replicate a full agent policy.
- If a prompt omits `agent`, the current agent is used; set `agent` explicitly when the workflow should consistently route through a specific role.
- VS Code supports prompt-level `tools` and prompt-over-agent tool priority, but this repository avoids that override path for predictability. If you must diverge, document why in the file body.
- Prompt and agent bodies can link workspace files and reference tools with `#tool:<tool-name>`; use that only when the workflow materially benefits from an explicit tool cue.
- Prompt bodies may also use `${input:...}` variables for reusable, parameterized entry points; keep those variables minimal and obvious.

## Agent Design

- Use custom agents for persistent personas, tool restrictions, and handoffs.
- Use prompt files for single-task entry points.
- Use skills only for durable workflows that truly need bundled assets.
- Keep handoffs short, action-oriented, and scoped to the next stage.
- Design agents with least privilege. Planner and reviewer roles should usually be read-heavy, while implementation roles may need edit and execution tools.
- Do not broaden an agent's tool list or subagent list casually; every added capability should support a concrete workflow need.
- Prefer whitelisting specific worker agents in `agents` rather than allowing every agent by default.
- Use `user-invocable` and `disable-model-invocation` deliberately to control whether an agent should appear in the picker, be callable as a subagent, or both.
- Treat handoffs as explicit phase transitions such as planning -> implementation or implementation -> review, not as a place to restate the entire workflow.
- Use explicit `model` settings only when the role benefits from a distinct model profile; otherwise inherit the session model.
- Remember the visibility matrix when designing agents: visible and subagent-eligible, hidden but subagent-eligible, visible but not subagent-eligible, or disabled from both paths.
- Use handoff metadata intentionally. `label`, `agent`, `prompt`, `send`, and optional `model` should move the workflow to the next stage, not duplicate the current stage.
- If an agent is meant to orchestrate other agents, keep its worker set curated and narrow rather than relying on `*`.
- Treat nested subagents as exceptional. They are off by default and should not shape the normal workflow design in this repository.

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

## Planning and Context Design

- Keep planning, implementation, testing, and review as separate concerns. Prefer explicit handoffs over one overloaded super-agent.
- For medium or large workflows, preserve a planner -> implementation -> review shape unless the task clearly does not need all three stages.
- If a customization relies on planning memory, note that plan state is session-scoped rather than durable and should not be treated as repository documentation.
- Start small and iterate. Fix recurring failures at the narrowest appropriate layer instead of expanding the always-on instructions file.
- Avoid context dumping, contradictory rules, and one-size-fits-all agent design.

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