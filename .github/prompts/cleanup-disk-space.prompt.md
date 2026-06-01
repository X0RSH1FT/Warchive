---
name: cleanup-disk-space
description: Clean up reclaimable disk space on Windows with explicit approval gates, context-rich risk disclosure, and read-only confirmation before deletion. Use when you want a cautious follow-up after a disk audit.
argument-hint: "[Optional: drive letter or root path, cleanup targets, safety constraints, whether elevated cleanup is allowed, or whether to re-audit before deleting.]"
agent: System Administration Agent
---

Clean up reclaimable disk space on Windows, but only after confirming the target and getting explicit user approval through `#askQuestions` before each destructive stage.

Default behavior:
- If the user does not specify a drive or root path, default to `C:`.
- Do not delete or modify anything until a read-only confirmation step has identified a concrete target.
- Treat cleanup as a separate stage from auditing, even if the same conversation already discussed disk usage.

What to do:
1. Identify the most concrete cleanup target from the request.
2. If the target is not already confirmed by a recent read-only check, run a narrow read-only validation pass to confirm the path, approximate size, and category before any approval gate.
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
4. Use `#askQuestions` as an approval gate before each destructive stage. In each approval question, restate the concrete target context (path, approximate size, category, expected benefit, likely impact, regeneration or re-download cost, and any elevation scope), explain the decision in plain language, and offer clear options such as:
   - approve cleanup now
   - inspect deeper first
   - skip this target
   - cancel the cleanup session
5. Keep freeform input enabled so the user can impose constraints or ask for more explanation.
6. Use a conservative default recommendation when risk is non-trivial. Prefer deeper inspection over deletion for app data, installer caches, store packages, or user content.
7. Once a target is confirmed and approved, execute the destructive cleanup step with scope strictly limited to the approved target.
8. After an approved cleanup step, report what was attempted, what changed, and any residual risk or follow-up opportunity.
9. Stop immediately if the user declines, if the target classification is uncertain, or if the cleanup boundary expands beyond the approved target.

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
3. An explicit `#askQuestions` approval gate before deletion, following the approval-gate rule above.
4. A concise report of what was cleaned and the approximate space recovered.
5. Any remaining high-value targets that were not touched because they need separate approval or deeper inspection.

Example response shape:
- Read-only confirmation: `C:\Users\Joel\AppData\Local\Temp`, about 3.1 GB, mostly temp cache files.
- Risk summary: Low risk, usually regenerated automatically, no admin rights required.
- Approval gate: `#askQuestions` before deletion using the approval-gate rule above for `C:\Users\Joel\AppData\Local\Temp` (about 3.1 GB): Approve cleanup now / Inspect deeper first / Skip this target / Cancel cleanup.
- Approved execution: after approval, run the exact temp-folder cleanup with scope limited to `C:\Users\Joel\AppData\Local\Temp`.
- Implementation result: Removed about 2.8 GB from the approved temp-folder target; browser cache left untouched because it needs separate approval.

If the user has not already audited the disk or the target is still ambiguous, begin with a narrow audit step instead of guessing what should be deleted.

When cleanup is approved, keep the workflow scope constrained to the explicit target and avoid bundling additional destructive actions in the same step.