---
name: system-admin-task
description: Execute or troubleshoot a bounded Windows or Linux system-administration task with read-first diagnostics, explicit safety gates, and post-action verification.
disable-model-invocation: true
argument-hint: "[Task, target host/path/service/process, platform, scope limits, and whether destructive actions are allowed]"
---
Use this prompt for operational tasks such as disk audits, scoped cleanup, service triage, process diagnostics, or platform-level environment checks.

Workflow:
1. Identify one concrete operational anchor: host, path, service, process, mount, command failure, or capacity issue.
2. Determine platform context first: Windows/PowerShell or Linux/Bash.
3. If platform, scope, or risk tolerance is ambiguous, ask for the missing decision using a question tool only if exposed and permitted, or chat if available. If delegated without a user-facing channel, return the blocking question and scope to the caller and stop.
4. Start read-only and gather only enough evidence to define the first validation boundary.
5. Classify risk and blast radius before any change.
6. Before destructive actions, including deletion, and before registry changes, permission or ownership changes, package installation or removal, service restarts, process termination, or configuration changes with material impact, present the exact action, target, impact, and rollback and obtain explicit approval. If delegated without a user-facing channel, return the request to the caller and stop until approval is relayed. Requested low-impact changes may proceed within scope.
7. Keep command scope tightly bounded to the approved target; do not widen silently.
8. Execute the smallest requested low-impact action or explicitly approved gated action, then run focused post-action verification immediately.
9. If the task depends on external product behavior, route a narrow fact check to `Web-Researcher`.
10. If the task changes durable runbook guidance, route follow-up updates to `Document-Author`.
11. If the pass is non-trivial, route to `Code-Reviewer` for a findings-first safety review.
12. Conclude with what was observed, what changed, validation result, residual risk, and next owner if needed.

Platform guidance:
- Use `windows-powershell-admin` for Windows operational tasks.
- Use `linux-bash-admin` for Linux operational tasks.
- If the platform skill is unavailable, report it and apply this skill's safety and validation boundaries without assuming its bundled utilities exist.

Few-shot examples:
- Good: Audit one drive, identify top reclaim candidates, ask approval, clean one temp target, then verify freed space.
- Good: Diagnose one failed service with status + logs, run one approved restart, then verify health.
- Bad: Run broad delete commands across multiple roots without per-target approval.
- Bad: Mix disk cleanup, firewall edits, and package upgrades in one uncontrolled pass.

Output requirements:
- Anchor and scope.
- Platform and command plan.
- Approval gates used (if any).
- Validation evidence.
- Residual risk and recommended next step.
- Concise imperative commit message when resulting changes are ready to keep.
