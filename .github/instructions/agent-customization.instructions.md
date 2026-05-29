---
name: "Agent Customization Patterns"
description: "Rules for authoring VS Code Copilot markdown customization files in .github. Use when editing agents, prompts, instructions, workflows, or skills in this repository."
applyTo: ".github/**/*.md"
---

# Customization File Patterns

Use these rules when editing Copilot customization files under `.github/`.

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

## Instructions File Design

- Use instructions files for durable scoped policy, not as a substitute for task prompts or persistent agents.
- Keep `applyTo` narrow enough that the file clearly owns the matched surface. Broad patterns are acceptable only when the whole matched tree genuinely shares the same rules.
- Write instructions as stable decision-making guidance for the target files: what the file type owns, what to avoid, and what validation is expected.
- Prefer one coherent concern per instructions file. If a file starts mixing authoring rules, workflow routing, and domain behavior for unrelated paths, split it.
- Put file-selection logic in frontmatter and implementation guidance in the Markdown body. Do not hide critical routing rules only in prose when the `applyTo` pattern should do that work.
- Use instructions to reinforce local repository conventions, not to restate large portions of upstream docs verbatim.
- When an instructions file names related prompts, agents, or skills, verify those names and paths exist in the repository before concluding.

## Prompt File Design

- Use prompt files for slash-command style entry points and reusable user-invoked workflows, not for long-lived personas.
- Keep prompt frontmatter concise: `name`, `description`, `argument-hint`, and `agent` are the default shape in this repository.
- In this repository, do not add prompt-level `tools`. If a workflow needs a different tool surface, change the owning agent instead of overriding tools in the prompt.
- Make the body operational: define the task trigger, required clarifications, the preferred execution shape, and the expected validation or output.
- Keep prompts task-scoped. If the body starts defining standing tool policy, multi-turn identity, or a handoff graph, that behavior belongs in an agent file.
- Use `${input:...}` variables sparingly and only when they make repeated invocation simpler and more obvious.
- Prefer explicit `agent` routing when the workflow should reliably enter a specific role rather than inheriting the active agent by accident.

## Agent File Design

- Use agent files for persistent roles that need their own instructions, tool policy, worker-agent allowlist, or handoffs.
- Agent bodies should describe the role's objective, boundaries, validation posture, and handoff expectations. Keep the body role-stable across many tasks.
- Keep `tools` least-privilege and `agents` curated. Do not give broad edit, terminal, or subagent access to roles that do not need them.
- Use `handoffs` for explicit workflow phase changes such as planning -> implementation or implementation -> review, not as a second copy of the current agent instructions.
- Use `user-invocable` and `disable-model-invocation` deliberately to control picker visibility and subagent eligibility.
- Add a new agent only when the repository needs a durable specialist role with distinct boundaries. Do not create a new agent for a one-off workflow variation that a prompt file or existing specialist can handle.
- Treat web-research or external-doc agents as optional specialists. Add one only if external documentation lookup, validation, and synthesis become recurring enough that the role needs its own tool policy and routing boundary.

## Workflow Shape

- Keep the shared workflow small: the default path centers on `Coordinator Agent`, `Implementation Agent`, and `Reviewer Agent`, with `Planner Agent` or `Explorer Agent` inserted only when ambiguity or reconnaissance needs justify them.
- Treat `Documentation Agent`, `Testing Agent`, and `Web Research Agent` as optional specialists for documentation-heavy, test-heavy, or external-doc-heavy work, not as mandatory stages on every task.
- Do not add a new default workflow agent unless it owns a distinct domain or workflow stage.
- Prefer coordinator -> implementation -> review handoffs over packing every behavior into one agent.

## Prompt-Technique Use

- Apply the repository's prompting techniques intentionally when authoring or refactoring customizations: `task decomposition`, `few-shot prompting`, `reasoning scaffolds`, `tool use`, `retrieval`, `planner-executor workflow`, and `review loop`.
- Use `task decomposition` to keep broad workflow changes bounded to one coherent slice at a time.
- Use `few-shot prompting` only when a short example materially improves output shape, handoff wording, or repeated file structure.
- Use `reasoning scaffolds` for explicit checklists, comparison criteria, and completion contracts when they make a workflow easier to execute or review.
- Use `tool use` and `retrieval` together: inspect the owning files, docs, and current graph before changing workflow rules instead of relying on memory.
- Use `planner-executor workflow` to keep planning, implementation, documentation, testing, and review responsibilities distinct instead of collapsing them into one overpowered file.
- Use a `review loop` after non-trivial workflow refactors so naming drift, missing validation, and routing regressions are checked independently.
- Do not force every technique into every file. Omit a technique when it adds noise without improving correctness or maintainability.

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
- If you find yourself trying to encode persistent role behavior, reusable tool policy, or multi-stage orchestration in a prompt, stop and move that logic into an agent.
- If an instructions file starts telling the model how to conduct a user-invoked workflow, that is a prompt or agent concern rather than a scoped instructions concern.

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
- For medium or large workflows, preserve a coordinator-owned implementation -> review spine and insert `Planner Agent`, `Web Research Agent`, `Documentation Agent`, or `Testing Agent` only when the task actually needs that specialist stage.
- If a customization relies on planning memory, note that plan state is session-scoped rather than durable and should not be treated as repository documentation.
- Start small and iterate. Fix recurring failures at the narrowest appropriate layer instead of expanding the always-on instructions file.
- Avoid context dumping, contradictory rules, and one-size-fits-all agent design.
- When a workflow change adds structure, make the technique choice legible in the file body so the added scaffold is clearly tied to a repository need.

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