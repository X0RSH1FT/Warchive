---
name: windows-powershell-admin
description: Execute safe, bounded Windows system-administration tasks using PowerShell, with read-first diagnostics, explicit approval gates for destructive actions, and focused post-action validation.
argument-hint: "[Target host or path, task type, optional scope limits, and approval preferences for destructive actions]"
---

# Windows PowerShell Admin

Use this skill for Windows operational work that needs disciplined PowerShell execution.

Use when tasks involve disk auditing, bounded cleanup, service/process triage, event-log checks, startup impact checks, archive workflows, and lightweight operational scripting.

If the request requires destructive actions, broad system reconfiguration, or unclear scope, stop and clarify before running commands.

## Safety Contract

- Start read-only by default.
- Require explicit approval before destructive actions, including deletion, and before registry changes, permission or ownership changes, package installation or removal, service restarts, process termination, or configuration changes with material impact. Requested low-impact changes may proceed within scope; previews do not replace approval.
- Present the exact action, target, impact, and rollback before approval. Use a question tool only if exposed and permitted; otherwise ask in chat and wait, or return the approval request to the caller and stop if delegated without user-facing chat. Resume only after approval is relayed.
- Keep scope to the user-approved target path, service, process, or subsystem.
- Do not disable security controls, bypass access controls, or perform persistence-oriented changes.

Archive and encryption safety notes:

- Validate required tooling (`tar`, `openssl`) before attempting archive actions.
- Keep source and target paths explicit; refuse broad wildcard path behavior.
- Never put passphrases in command arguments, scripts, history, logs, or reports. Use a suitable secret-management flow and assess its exposure; reading from an environment variable does not protect a secret later expanded into an argument.
- Use dry-run behavior (`-WhatIf`) before apply actions when changing many files.
- On decrypt failure, remove only known newly created partial output within the approved scope; report cleanup failures and never remove pre-existing output without approval.

## Workflow

1. Confirm target and scope boundaries.
2. Run the smallest read-only command to establish baseline facts.
3. Classify risk and potential blast radius.
4. If action is needed, present command plan plus rollback or fallback.
5. Run approved commands only.
6. Re-check with focused validation and report deltas.

## Common Windows Commands

Read-only diagnostics:

- `Get-PSDrive -PSProvider FileSystem`
- `Get-Volume | Select-Object DriveLetter, FileSystemLabel, SizeRemaining, Size`
- `Get-ChildItem <path> -Force | Sort-Object Length -Descending | Select-Object -First 20 FullName, Length`
- `Get-Process | Sort-Object CPU -Descending | Select-Object -First 15 Name, Id, CPU, WS`
- `Get-Service | Where-Object { $_.Status -ne 'Running' }`
- `Get-WinEvent -LogName System -MaxEvents 100`

Bounded maintenance:

- `Remove-Item <path> -Recurse -Force` only after explicit approval and scoped confirmation
- `Restart-Service -Name <service>` after state and dependency checks and explicit approval

Archive workflows:

- `tar -cf <target.tar> -- <subdir>` for per-subdirectory archive creation
- `tar -xf <archive.tar> -C <target>` for bounded archive extraction
- For encryption or decryption, select a tool and secret-input method appropriate to the user's security requirements; verify its version-specific behavior and do not pass secret values in process arguments.

## Supporting Utilities

- [scripts/windows-disk-audit.ps1](scripts/windows-disk-audit.ps1) suppresses enumeration errors; do not treat its results as complete without independent verification.
- Do not use [scripts/windows-safe-temp-cleanup.ps1](scripts/windows-safe-temp-cleanup.ps1) until remediated: it suppresses enumeration and deletion errors while reporting reclaimed space.
- Use [scripts/windows-backup-subdirs-to-tar.ps1](scripts/windows-backup-subdirs-to-tar.ps1) to archive each immediate subdirectory into `.tar` files with progress and summary output.
- Do not use [scripts/windows-encrypt-tar-files.ps1](scripts/windows-encrypt-tar-files.ps1) or [scripts/windows-decrypt-tar-files.ps1](scripts/windows-decrypt-tar-files.ps1) until remediated: they expand passphrases into process arguments.

## Few-Shot Examples

- Good: Measure one temp path, show top files, confirm approval, then run scoped cleanup with post-cleanup size check.
- Good: Investigate one failing service with status, dependent services, last events, and one approved restart.
- Bad: Use wildcard delete across multiple profile roots without per-target approval.
- Bad: Modify registry startup entries during initial diagnosis when service status is still unknown.

## Validation

1. Capture pre-action baseline.
2. Run a requested low-impact action or an explicitly approved gated action only within scope.
3. Capture post-action check with the same or tighter command scope.
4. Report commands run, failures, outcome, file counts, size deltas, and residual risk. Label measurements incomplete when enumeration fails.