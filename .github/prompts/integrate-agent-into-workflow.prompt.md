---
name: integrate-agent-into-workflow
description: Integrate a new or existing specialist agent into another repository's workflow with the smallest meaningful coordinator or prompt changes. Use when adding an agent without flattening the target repository's local workflow shape.
argument-hint: "[Target repository path or name, agent name and role, current workflow files, whether the agent should be subagent-first or directly invocable, integration constraints to preserve, and validation expectations.]"
agent: Meta Agent
---

Integrate the named agent into the target repository's workflow with the smallest coherent customization changes.

Treat the target repository's existing `.github/` customization graph as the source of truth for local workflow shape, names, and domain specialists. Do not force the new agent into every workflow stage by default.

Workflow:
1. Identify the target repository, the agent to integrate, and the most concrete workflow anchor: usually the coordinator or another orchestration agent that owns routing.
2. Read only enough of the target repository's agents, prompts, and instructions to understand the current handoff graph, naming conventions, validation posture, and any local specialists that the new agent should complement rather than replace.
3. Classify the smallest meaningful integration point: coordinator handoff, specialist-to-specialist handoff, direct prompt entry, supporting documentation, or a combination of these.
4. If the desired mode is `subagent-first`, wire the new agent into at least one appropriate parent agent allowlist or handoff path so the role is actually reachable. Do not leave it discoverable only through documentation or a hidden file.
5. Default to additive integration. Preserve the target repository's local specialist roles, documentation paths, and domain-specific routing unless the request explicitly asks for consolidation.
6. If the new agent is subagent-first, consider whether the target repository should also get a dedicated prompt file for direct invocation. Add that prompt only when it materially improves discoverability or workflow entry.
7. If the right integration point, visibility, or preservation rules are ambiguous, use `#askQuestions` to summarize the requested integration pass first and confirm only the decisions that change the next edit.
8. Implement the smallest coherent workflow change set in the target repository after the integration point is clear.
9. After the first substantive edit, run Markdown diagnostics on the touched customization files before widening scope.
10. Validate that referenced agent names, prompt names, documentation paths, handoff targets, and the intended reachability path for the new agent exist in the target repository.
11. If the integration meaningfully changes durable workflow guidance outside `.github/`, update the owning documentation or route that slice explicitly.

Close-out requirements:
- Summarize what changed in the target repository and why those insertion points were chosen.
- Report the validation run.
- State whether the plan-derived integration work is exhausted.
- If more planned work remains, name the next highest-priority slice.
- Label any extra idea explicitly as a suggestion outside the plan.
- Include a concise, imperative commit message when the integrated change set is ready to keep.

Example response shape:
- Target: target repository coordinator workflow.
- Changes: added the new specialist as a coordinator handoff plus a dedicated direct-invocation prompt, while preserving the existing implementation and review spine.
- Validation: Markdown diagnostics clean on the touched customization files; referenced agent names and prompt names verified.
- Plan status: exhausted for the requested integration slice.
- Suggestion outside the plan: add a target-local doc update only if the team keeps a durable workflow reference outside `.github/`.
- Commit message: Integrate Interface Design Agent into target workflow