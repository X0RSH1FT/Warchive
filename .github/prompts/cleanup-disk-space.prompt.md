---
name: cleanup-disk-space
description: Clean up reclaimable disk space on Windows with explicit approval gates, context-rich risk disclosure, and read-only confirmation before deletion. Use when you want a cautious follow-up after a disk audit.
argument-hint: "[Optional: drive letter or root path, cleanup targets, safety constraints, whether elevated cleanup is allowed, or whether to re-audit before deleting.]"
agent: Coordinator Agent
---

Clean up reclaimable disk space on Windows, but only after confirming the target and getting explicit user approval through `#askQuestions` before each destructive stage.

Default behavior:
- If the user does not specify a drive or root path, default to `C:`.
- Do not delete or modify anything until a read-only confirmation step has identified a concrete target.
- Treat cleanup as a separate stage from auditing, even if the same conversation already discussed disk usage.

What to do:
1. Identify the most concrete cleanup target from the request.
2. If the target is not already confirmed by a recent read-only check, run the smallest read-only validation needed to confirm the path, approximate size, and category.
3. Before any deletion or cleanup command, summarize the target resource with as much practical context as possible, including:
   - path or resource name
   - approximate size or reclaim estimate
   - resource category such as temp data, package cache, browser cache, shader cache, installer cache, app data, or user content
   - why it appears reclaimable
   - how confident the classification is
   - likely impact of removal
   - whether the data is usually regenerated automatically or may require reinstall, repair, or re-download
   - whether admin rights are required
   - safer alternatives when they exist
4. Use `#askQuestions` as an approval gate before each destructive stage.
5. In each approval question, restate the concrete target context from the summary so the user sees the path, approximate size, category, expected benefit, likely impact, regeneration or re-download cost, and any elevation scope at the exact point of approval.
6. In each approval question, explain the decision in plain language and offer clear options such as:
   - approve cleanup now
   - inspect deeper first
   - skip this target
   - cancel the cleanup session
7. Keep freeform input enabled so the user can impose constraints or ask for more explanation.
8. Use a conservative default recommendation when risk is non-trivial. Prefer deeper inspection over deletion for app data, installer caches, store packages, or user content.
9. Once a target is confirmed and approved, route the destructive cleanup step through the implementation path for execution rather than keeping the coordinator in execution mode.
10. After an approved cleanup step, report what was attempted, what changed, and any residual risk or follow-up opportunity.
11. Stop immediately if the user declines, if the target classification is uncertain, or if the cleanup boundary expands beyond the approved target.

Safety rules:
- Prefer cache and temp cleanup before app data or user content.
- Do not remove installed programs, user documents, or ambiguous application data without a specific approval gate for that exact target.
- If elevation would change the scope or risk materially, explain that before asking for approval.
- Avoid bundling unrelated targets into one approval unless they share the same risk profile and the summary makes each target clear.

Working style:
- Prefer PowerShell-friendly commands on Windows.
- Use the smallest destructive change that satisfies the approved cleanup target.
- Keep observed facts separate from inferred risk.
- If a target looks reclaimable but could affect an app or workflow, say so directly and recommend the safer path first.

Output expectations:
1. Read-only confirmation of the cleanup target.
2. A context-rich explanation of what the target is and why it is or is not safe to remove.
3. An explicit `#askQuestions` approval gate before deletion that repeats the concrete target context and risk summary.
4. A concise report of what was cleaned and the approximate space recovered.
5. Any remaining high-value targets that were not touched because they need separate approval or deeper inspection.

If the user has not already audited the disk or the target is still ambiguous, begin with a narrow audit step instead of guessing what should be deleted.

When cleanup is approved, keep the workflow in the repository's normal coordinator to implementation path instead of treating destructive execution as a coordination-only task.