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
- Ask for explicit approval before destructive operations.
- Keep scope to the user-approved target path, service, process, or subsystem.
- Do not disable security controls, bypass access controls, or perform persistence-oriented changes.

Archive and encryption safety notes:

- Validate required tooling (`tar`, `openssl`) before attempting archive actions.
- Keep source and target paths explicit; refuse broad wildcard path behavior.
- Do not hardcode passphrases in scripts or command history; prefer `OPENSSL_PASSPHRASE` or explicit secure input.
- Use dry-run behavior (`-WhatIf`) before apply actions when changing many files.
- On decrypt failure, remove partial output files before continuing.

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
- `Restart-Service -Name <service>` after state and dependency checks

Archive workflows:

- `tar -cf <target.tar> -- <subdir>` for per-subdirectory archive creation
- `tar -xf <archive.tar> -C <target>` for bounded archive extraction
- `openssl enc -aes-256-cbc -pbkdf2 -salt -in <source.tar> -out <target.tar.enc> -pass pass:<value>` for encryption
- `openssl enc -d -aes-256-cbc -pbkdf2 -in <source.tar.enc> -out <target.tar> -pass pass:<value>` for decryption

## Supporting Utilities

- Use [scripts/windows-disk-audit.ps1](scripts/windows-disk-audit.ps1) for bounded read-only disk inventory.
- Use [scripts/windows-safe-temp-cleanup.ps1](scripts/windows-safe-temp-cleanup.ps1) for explicit-scope temp cleanup with WhatIf support.
- Use [scripts/windows-backup-subdirs-to-tar.ps1](scripts/windows-backup-subdirs-to-tar.ps1) to archive each immediate subdirectory into `.tar` files with progress and summary output.
- Use [scripts/windows-encrypt-tar-files.ps1](scripts/windows-encrypt-tar-files.ps1) to encrypt `.tar` files to `.enc` using OpenSSL with per-file result reporting.
- Use [scripts/windows-decrypt-tar-files.ps1](scripts/windows-decrypt-tar-files.ps1) to decrypt `.enc` files back to original names with partial-file cleanup on failures.

## Few-Shot Examples

- Good: Measure one temp path, show top files, confirm approval, then run scoped cleanup with post-cleanup size check.
- Good: Investigate one failing service with status, dependent services, last events, and one approved restart.
- Bad: Use wildcard delete across multiple profile roots without per-target approval.
- Bad: Modify registry startup entries during initial diagnosis when service status is still unknown.

## Validation

1. Capture pre-action baseline.
2. Run action only after approval.
3. Capture post-action check with the same or tighter command scope.
4. Report commands run, outcome, file counts, size deltas, and residual risk.