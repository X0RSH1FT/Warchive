---
name: remove-deprecated-artifacts
description: Remove a deprecated feature, module, API, or related code artifacts by scanning the codebase thoroughly, choosing a compatibility posture, and resolving all confirmed references. Use when deprecation cleanup should be completed end-to-end.
argument-hint: "[Deprecated artifact(s), scope boundaries, expected replacement behavior, compatibility preference if known, and validation requirements.]"
agent: Coordinator Agent
---

Coordinate a complete deprecated-artifact removal pass, from discovery through validation, without leaving known references unresolved.

Workflow:
1. Identify the most concrete removal anchor first: a symbol, module path, feature flag, config key, CLI/API surface, or user-facing behavior marked deprecated.
2. Retrieve only enough context to define the owning code paths, candidate blast radius, and first validation boundary before editing.
3. Start with a thorough repository scan for all potential occurrences: imports, usages, references, docs, tests, configs, scripts, generated outputs, and migration notes that mention the deprecated artifact.
4. If the compatibility strategy is not explicit, use `#askQuestions` to summarize the requested removal pass first and ask whether this change should preserve backward compatibility or make a clean break.
5. If compatibility is required, define the smallest temporary compatibility layer needed (alias, adapter, forwarding path, migration warning, or fallback), plus a clear removal horizon.
6. If a clean break is approved, remove deprecated surfaces directly and update dependent code to the replacement behavior in the same pass.
7. After scan findings are concrete and before broad edits, use `vscode_askQuestions` to request approval for how issue resolution should proceed when breakages are found (for example: auto-fix all resolvable call sites, stop on ambiguous references, or escalate specific classes of risk).
8. Use `#askQuestions` to confirm whether this deprecation/removal should be registered in the local app deprecations markdown document, and if yes, confirm the target path when it is not already explicit.
9. Build and maintain a short `#todo` list for the removal pass: discovery, source changes, tests, docs, and review.
10. Route to `Implementation Agent` for source-owned removals and dependent code updates once strategy and approval are clear.
11. Route to `Testing Agent` when the dominant next step is targeted reproduction, test updates, failure triage, or confidence expansion after edits.
12. Route to `Documentation Agent` when removal changes user-facing behavior, migration guidance, command/config references, or durable docs.
13. Keep the execution loop tight: scan, remove, update dependents, rerun the narrowest falsifying checks, widen validation only as needed.
14. Ensure removal completeness by resolving all confirmed occurrences from the scan or explicitly documenting why any retained occurrence is intentional.
15. If unresolved references remain due to ambiguity or risk, use `#askQuestions` to summarize the blocking cases, recommend a default handling path, and request a decision before continuing.
16. Do not silently defer cleanup work that is in scope for the approved pass.
17. Validate touched files with diagnostics and run targeted commands/tests that prove removed artifacts no longer control active behavior.
18. Verify that any referenced agents, prompts, docs paths, and migration paths named in the response still exist.
19. Summarize outcome: what was removed, compatibility posture chosen, what was validated, what risks remain, and whether plan-derived removal work is exhausted.
20. Include a concise, imperative commit message when the removal pass is ready to keep.

Example response shape:
- Removal anchor: deprecated module `legacy_auth` and feature flag `ENABLE_LEGACY_AUTH`.
- Compatibility decision: clean break approved.
- Scan result: confirmed references in source, tests, docs, and one deployment config.
- Approval decision: proceed with auto-fix for deterministic call sites; escalate ambiguous integration points.
- Deprecation registration: yes, record the removal in the local app deprecations markdown document.
- What changed: removed deprecated module and flag, migrated dependents to `auth_v2`, updated tests and docs.
- Validation: diagnostics clean on touched files; targeted tests and startup command pass without legacy references.
- Residual risk: one external integration owner notified for follow-up rollout timing.
- Commit message: Remove legacy auth artifacts and migrate dependents to auth_v2