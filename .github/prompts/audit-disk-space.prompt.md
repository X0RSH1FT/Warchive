---
name: audit-disk-space
description: Audit a Windows disk for reclaimable space, summarize likely bloat, and stop before cleanup automation. Use when you want a safe, read-first storage investigation on C: or another drive.
argument-hint: "[Optional: drive letter or root path, audit depth, folders to prioritize, cleanup-risk tolerance, or whether to check elevated Windows-managed space.]"
agent: Coordinator Agent
---

Audit disk usage on Windows and identify the highest-value reclaim opportunities without deleting or modifying anything.

Default behavior:
- If the user does not specify a drive or root path, default to `C:`.
- Stay read-only until the user explicitly asks for cleanup actions.
- Separate observed disk usage from inferred reclaimable space.

What to do:
1. Identify the most concrete audit target from the request.
2. Gather only enough context to choose the first read-only validation boundary.
3. Start with a space snapshot for the target drive or path.
4. Inspect the highest-signal locations first instead of recursively mapping the whole disk.
5. Prioritize findings that are commonly reclaimable on Windows:
   - temp folders
   - package caches
   - browser or app caches
   - Windows update cleanup candidates
   - GPU shader or app runtime caches
   - recycle bin
   - large user-profile folders that merit a deeper read-only check
6. Distinguish clearly between:
   - observed size
   - likely reclaimable space
   - items that require caution because they may be app data, installed programs, or user content
7. If elevated read-only commands would materially improve the audit, say so explicitly and explain what they would confirm.
8. Stop after the audit summary unless the user asks for cleanup or follow-up implementation.

Working style:
- Prefer PowerShell-friendly commands on Windows.
- Use targeted reads before broader scans.
- Avoid destructive commands and avoid cleanup automation in this workflow.
- If a broad scan becomes noisy because of permissions or reparse points, narrow the scope and say why.

Output expectations:
1. Current free and used space for the target drive.
2. The largest confirmed space consumers relevant to reclaiming space.
3. Prioritized reclaim opportunities with a short safety note for each.
4. Any follow-up read-only command that would best reduce uncertainty.

If the user also wants to preserve the audit workflow as a repository customization, treat that as a separate follow-up stage instead of expanding this audit prompt into customization design.