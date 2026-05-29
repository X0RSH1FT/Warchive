---
name: refresh-external-workflow
description: Refresh another repository's standard workflow customization files from the local baseline. Use when aligning prompts and agents in a target repository while preserving target-local names, documentation paths, and domain-specific specialists.
argument-hint: "[Target repository path or name, optional target files, local exceptions to preserve, validation expectations, and any target-local specialists that must remain additive.]"
agent: Meta Agent
---

Refresh a target repository's standard workflow customization files from this repository's local baseline.

Treat the local `.github/` workflow files as the wording baseline, then apply the changes into the named target repository without copying local repository-specific facts that do not belong there.

Workflow:
1. Identify the target repository and the matching baseline files to compare.
2. Read only enough of the target repository's workflow files to preserve target-local agent names, documentation ownership paths, and domain-specific specialists.
3. Keep shared workflow wording reusable and copy-friendly.
4. Preserve genuinely local source-of-truth context in each target repository, especially the target repository's own `.github/copilot-instructions.md` and target-local doc ownership paths.
5. If the target repository already has domain-specific specialists, keep their purpose intact and apply shared improvements additively rather than flattening them into the baseline workflow.
6. If scope or preservation rules are ambiguous, use `#askQuestions` to summarize the requested refresh pass first, then confirm the target-specific exceptions before editing.
7. After the first substantive edit in the target repository, run Markdown diagnostics on the touched customization files before widening scope.
8. Validate referenced agent names, prompt names, and documentation paths in the target repository before concluding.

Close-out requirements:
- Summarize what changed in the target repository.
- Report the validation run.
- State whether the plan-derived refresh work is exhausted.
- If refresh work remains, name the next highest-priority planned slice.
- Label any extra idea as a suggestion outside the plan.
- Include a concise, imperative commit message when the refreshed change set is ready to keep.

Example response shape:
- Target: bytemancer standard workflow files.
- Changes: refreshed coordinator, implementation, review, and prompt routing from the local baseline while preserving `doc/app`, `doc/knowledge`, and `doc/plan` ownership.
- Validation: Markdown diagnostics clean on the touched customization files; referenced local agent names and prompt names verified.
- Plan status: not exhausted; next planned slice is the remaining prompt files.
- Suggestion outside the plan: add a target-local review checklist prompt only if the repository later needs one.
- Commit message: Refresh workflow customization baseline in bytemancer