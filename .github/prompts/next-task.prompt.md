---
name: next-task
description: Triage a repository task, derive the next task from attached work docs when needed, or research a codebase or subsystem against a baseline, and coordinate planning, research, implementation, documentation, testing, and review from a single entry point.
argument-hint: "[Optional: explicit goal, files, constraints, work doc, implementation doc, comparison target, or attached context.]"
agent: Coordinator Agent
---

1. Read the attached context and identify the most concrete anchor for the task.
2. Retrieve only enough context to choose the owning workflow and the first validation boundary. If the surface is broad or the owner is unclear, prefer a dedicated `Explorer Agent` pass before broad inline reading.
3. If the user did not provide an explicit task but attached planning or implementation documents:
   - derive the best next planning, research, implementation, documentation, testing, or review candidates from those documents
   - rank them by dependency order, expected value, and clarity
   - when using `#askQuestions`, explain each candidate in plain language, identify the affected files, modules, or behaviors, recommend a default when one exists, and keep freeform input enabled so the user can ask follow-up questions or steer the choice
   - if the documents show that every actionable task is already implemented, stop and say so directly
   - label any extra ideas after that point as suggestions rather than derived required work
4. If scope or success criteria are ambiguous, use `#askQuestions` before dispatching and include enough context for a non-expert reader to understand what decision is being made and why it matters.
5. Decide whether the selected task is primarily planning, implementation, documentation, testing, review, or research.
6. Prefer `Planner Agent` when the task is ambiguous, cross-cutting, or driven by planning docs with multiple plausible next slices. Ask it for a bounded brief with target files, acceptance criteria, risks, scope exclusions, and the first validation step.
7. Build a short execution plan with `#todo` when the task spans multiple stages.
8. Use the most appropriate specialist:
   - `Planner Agent` for task slicing, acceptance criteria, file targeting, or validation sequencing before implementation
   - `Explorer Agent` for broad read-only reconnaissance, source-anchored research, or fast comparison of candidate owning paths before another specialist takes over
   - `Implementation Agent` for production-code changes and small adjacent test edits
   - `Documentation Agent` for documentation authoring, doc moves, cross-link reconciliation, research write-ups, or code changes that should update `README.md`, the existing durable docs surface, research or knowledge notes, planning notes, or another user-named documentation path
   - `Web Research Agent` for narrow upstream-doc validation when planning, implementation, or documentation work depends on trusted external product facts before editing should continue
   - `Testing Agent` for writing or expanding tests, debugging pytest failures, choosing the narrowest useful validation slice, or reporting residual testing gaps
   - `Reviewer Agent` for findings-first review and signoff
9. For planning, research, implementation, documentation, testing, exploration, or review work, use `#askQuestions` to clarify any design decisions, comparison baselines, audience, output paths, acceptance criteria, validation targets, or scope boundaries before work begins when user confirmation or clarification is still needed. Rank options by your preference, mark the recommended default, include the current working context, and keep freeform input enabled.
10. Before dispatching, provide a short brief that names the task, the anchor, the expected output, and the first validation step.
11. When work is driven from a planning document, update that same document before coding to record:
   - the selected task
   - any clarification answers
   - any agreed scope adjustments
12. Keep the conversation focused on the active stage. Do not interleave planning, implementation, documentation, testing, and review inside the same specialist pass. For non-trivial work, use a separate testing pass when validation depth is the main remaining risk, and automatically hand off to `Reviewer Agent` before closure unless the user explicitly opts out.
13. After each delegated stage, synthesize what changed, what was validated, and what the next recommended handoff is.
14. If the active stage uncovers scope drift, a new owner, or a missing prerequisite, reroute instead of forcing the current specialist to keep going out of lane.
15. If the task ends in planning:
   - confirm whether the planned slice should proceed now
   - dispatch `Web Research Agent` first when the plan shows that a narrow upstream-doc check is the cheapest missing prerequisite
   - dispatch `Implementation Agent` when code changes are the next step
   - dispatch `Documentation Agent` or `Testing Agent` first only when the plan shows that code is not the immediate next owner
16. If the task ends in research:
   - clarify the target surface, comparison baseline, intended audience, and output path when any of those are unclear
   - use `Web Research Agent` first when the target question depends on trusted upstream product or external documentation; use `Explorer Agent` first when the question is about the local repository surface or owning path
   - honor an explicit output path; otherwise default durable research notes to `docs/research/<slug>.md` when that surface exists and ask before creating a separate planning-notes bucket or another new documentation directory
   - dispatch `Documentation Agent` when the deliverable should be authored or updated as a repo document
   - stay in research mode unless the user explicitly expands scope into implementation work
   - summarize the best next implementation or experiment path when one naturally follows
17. If the task ends in implementation:
   - dispatch `Web Research Agent` before further edits when the implementation is blocked on an external product fact that the repository has not already validated locally
   - dispatch `Documentation Agent` before review when code changes alter user-facing behavior, file layout, commands, config, or durable docs
   - dispatch `Testing Agent` before review when the remaining work is primarily test authoring, pytest debugging, or focused validation coverage
   - if the user explicitly wants a package or app version bump, use the `increment-python-project-version` prompt as a separate focused workflow instead of changing `[project].version` implicitly inside `next-task`
   - update the planning document that guided the work with completed work, validation run, and remaining follow-up items
   - automatically dispatch `Reviewer Agent` before closure when the scope is non-trivial, unless the user explicitly opts out
   - provide a concise, imperative commit message scoped to the changed files
18. If the task ends in review and there are actionable findings:
   - use `#askQuestions` to explain the issues concisely, summarize the affected files or behaviors, recommend the default fix path when one exists, and verify whether they should be fixed now while leaving room for freeform follow-up
   - if the user approves, immediately hand off to `Testing Agent` when the dominant follow-up is test authoring, pytest debugging, or validation coverage; otherwise hand off to `Implementation Agent`
   - if the user declines, stop after the review summary and record that the fix pass was waived
19. If the task ends in review with no actionable findings, say so explicitly and then summarize residual risk or validation gaps if any remain.

Example response shape:
- Task: update the import workflow described in an attached planning note.
- Anchor: the unchecked implementation item in that note plus the owning prompt file.
- Workflow: `Implementation Agent`, then `Reviewer Agent` because the change is non-trivial.
- First validation: Markdown diagnostics on the touched customization files.
- Summary: implemented the selected slice, recorded validation, and updated the planning note if it drove the work.
- Commit message: Refine import workflow prompt guidance.

If no actionable task can be derived from attached documents because the remaining work is ambiguous, use `#askQuestions` to explain the ambiguity, summarize the most plausible areas to work on next, and ask the user which area should be handled next while keeping freeform input enabled.

If no actionable task can be derived because the attached documents are already exhausted or fully implemented, stop and say so directly. You may mention optional future ideas only with an explicit disclaimer that they are suggestions, not derived required work.