---
name: create-customization
description: Turn a described workflow into the right Copilot customization for this repository. Use when you want a prompt, skill, or instruction drafted to match VS Code requirements and the repo's .github layout.
argument-hint: "[Describe the workflow, audience, trigger, target files, desired outputs, validation expectations, and any supporting assets or examples.]"
agent: Coordinator Agent
---

Turn the described workflow into the right repository customization type and implement it in the correct `.github` location.

Classification rules:
- Prefer a prompt file for reusable user-invoked workflows or task entry points.
- Prefer an instructions file only when the behavior should apply automatically to a scoped file set through `applyTo`.
- Prefer a skill only when the workflow needs bundled assets such as templates, examples, scripts, or other supporting files.
- If the request is really asking for a persistent persona, tool policy, or handoff graph, treat it as an agent request and implement or route it under `.github/agents/` instead of forcing a poor fit into prompt, skill, or instruction.

What to do:
1. Identify the most concrete anchor in the described workflow.
2. Retrieve only enough repository context to choose the owning customization type and the first validation boundary.
3. If scope, audience, or output shape is materially ambiguous, use `#askQuestions` to clarify before editing.
4. Explain the recommended customization type in plain language, including why the other nearby options are a worse fit.
5. Name the target path under `.github/` before editing.
6. Implement the smallest coherent customization that satisfies the request.
7. Keep prompt files task-scoped and do not add prompt-level tool declarations in this repository.
8. If the workflow is agent-shaped, keep the implementation focused on the smallest coherent agent file or agent update needed for the request.
9. Validate the touched customization files and confirm that referenced agents, prompts, skills, and paths exist.

Output expectations:
1. Recommended customization type and rationale.
2. Target file path or paths.
3. Implemented customization content.
4. Validation result.
5. Any follow-up suggestion only if the workflow would materially benefit from a second file type or bundled resource.

If the request is derived from a broader process discussion, keep the implementation focused on the active customization slice instead of trying to solve the whole upstream process in one pass.