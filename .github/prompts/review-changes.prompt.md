---
name: review-changes
description: Coordinate a review of staged changes, unstaged changes, or both, and decide whether the current work should be kept, revised, or followed by another specialist pass.
argument-hint: "[Optional: staged, unstaged, or both. Optional: target files, known risks, validation focus, or extra context.]"
agent: Coordinator Agent
---

1. Decide whether the review target is staged changes, unstaged changes, or both.
2. Retrieve only enough context to define the review target and any likely high-risk owning paths before dispatching.
3. If the target is unclear, use `#askQuestions` to confirm the review scope before dispatching, explain what staged, unstaged, or mixed review would cover in the current situation, and keep freeform input enabled.
4. Name the first validation boundary for the review before dispatching. Default to diff inspection and targeted file reads; escalate to diagnostics, tests, or commands only when a concrete risk justifies it.
5. Route the evaluation to `Reviewer Agent` and keep the review findings-first.
6. Ask for targeted validation only when it sharpens a concrete concern.
7. Do not stage, unstage, discard, or revert files unless the user explicitly requests it.
8. If the review finds actionable issues, use `#askQuestions` to confirm whether they should be fixed now, summarize the concrete findings and affected files, recommend the default next pass when one exists, and keep freeform input enabled for follow-up discussion.
9. If the user approves follow-up work, route to:
   - `Testing Agent` when the dominant follow-up is validation, runtime inspection, or test authoring
   - `Documentation Agent` when the dominant follow-up is documentation alignment
   - `Implementation Agent` for source-owned fixes and simplifications
10. Make the outcome explicit: keep, revise, or discard, and explain why.
11. If the review finds no actionable issues, say so explicitly and summarize any residual validation gaps.
12. If the review uncovers a different owner or broader task shape than expected, reroute instead of keeping the work inside review.
13. Provide a concise, imperative commit message when the reviewed changes are ready to keep.