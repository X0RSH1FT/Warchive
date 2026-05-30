---
name: create-customization
description: Create or update one bounded Copilot customization slice in this repository. Use when you want a single prompt, instruction, skill, or agent drafted to match VS Code requirements and the repo's .github layout.
argument-hint: "[Describe the single workflow slice: audience, trigger, target files, desired outputs, validation expectations, and any supporting assets or examples.]"
agent: Coordinator Agent
---

Turn the described single workflow slice into the right repository customization type and implement it in the correct `.github` location.

Use this prompt for one bounded customization task at a time: drafting or revising one prompt, one instructions file, one skill, one agent, or one tightly scoped supporting asset set.

Classification rules:
- Prefer a prompt file for reusable user-invoked workflows or task entry points.
- Prefer an instructions file only when the behavior should apply automatically to a scoped file set through `applyTo`.
- Prefer a skill only when the workflow is a reusable capability that truly needs bundled assets such as templates, examples, scripts, checklists, or other supporting files.
- Do not force a skill if the request is only a thin slash-command entry point or has no durable supporting resource to package.
- If the request is really asking for a persistent persona, tool policy, or handoff graph, treat it as an agent request and implement or route it under `.github/agents/` instead of forcing a poor fit into prompt, skill, or instruction.

Skill-specific rules:
- Keep skill names lowercase with letters, numbers, and hyphens, and make sure the skill directory name matches the `name` in `SKILL.md` exactly.
- Treat skills as progressively loaded capabilities: the frontmatter should make discovery easy, the body should explain when to use the skill, and any supporting files should be referenced explicitly from `SKILL.md`.
- Prefer a minimal `SKILL.md` with `name`, `description`, and optional `argument-hint`; add visibility or experimental fields only when they are justified and locally understood.
- If a skill needs templates, scripts, or examples, keep them adjacent to `SKILL.md` and design the instructions so the agent can discover and use them without guessing.
- If the user asks for a skill but the workflow has no bundled asset, explain why a prompt file is the better fit unless you are also packaging a real supporting resource.

Reference anchor:
- When exact VS Code customization behavior matters, use [docs/research/vscode-copilot-agent-customization-reference.md](../../docs/research/vscode-copilot-agent-customization-reference.md) as the local fact source before inventing repo-local rules.

What to do:
1. Identify the most concrete anchor in the described workflow.
2. Retrieve only enough repository context to choose the owning customization type and the first validation boundary.
3. If scope, audience, or output shape is materially ambiguous, use `#askQuestions` to summarize the requested customization pass first, then clarify before editing.
4. Explain the recommended customization type in plain language, including why the other nearby options are a worse fit for this single customization slice.
5. Name the target path under `.github/` before editing.
6. If the result is a skill, define the smallest coherent capability boundary first: trigger, audience, prerequisites, supporting assets, and the validation path.
7. Implement the smallest coherent customization that satisfies the request.
8. When authoring a skill, keep `SKILL.md` focused on when to use the skill, how to execute the workflow safely, and which adjacent files to load.
9. When a skill includes supporting files, verify that the file links or paths named from `SKILL.md` actually exist.
10. Avoid experimental customization metadata unless the request explicitly needs it and the repository has validated it.
11. Keep prompt files task-scoped and do not add prompt-level tool declarations in this repository.
12. If the workflow is agent-shaped, keep the implementation focused on the smallest coherent agent file or agent update needed for the request rather than widening into workflow-system cleanup.
13. Validate the touched customization files and confirm that referenced agents, prompts, skills, and paths exist.

Output expectations:
1. Recommended customization type and rationale.
2. Target file path or paths.
3. Implemented customization content.
4. Supporting assets included, if any, and why they belong with this customization.
5. Validation result.
6. Whether the plan-derived customization work is exhausted, and the next planned slice if it is not.
7. Any follow-up suggestion only if the workflow would materially benefit from a second file type or bundled resource, labeled explicitly as a suggestion outside the plan.

Example response shape:
- Type: Prompt file, because the workflow is a reusable user-invoked entry point rather than always-on scoped guidance.
- Target path: `.github/prompts/example.prompt.md`
- Implemented customization content: frontmatter plus a short task-scoped prompt body for the requested workflow.
- Supporting assets: None.
- Validation: Markdown diagnostics clean on the touched customization files, and referenced agents, prompts, skills, and named repository paths verified to exist.
- Follow-up: Add a skill only if the workflow later needs bundled templates or scripts.

If the request is derived from a broader process discussion, keep the implementation focused on the active customization slice instead of trying to solve the whole upstream process in one pass.