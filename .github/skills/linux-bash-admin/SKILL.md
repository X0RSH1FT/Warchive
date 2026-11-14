---
name: linux-bash-admin
description: Execute safe, bounded Linux system-administration tasks with Bash using read-first diagnostics, explicit approval gates for destructive actions, and focused post-action verification.
argument-hint: "[Target host or path, task type, distro context, optional scope limits, and approval preferences]"
---

# Linux Bash Admin

Use this skill for Linux operational work that needs careful Bash command execution.

Use when tasks involve disk and filesystem checks, bounded cleanup, process and service triage, log review, package-health checks, archive workflows, and lightweight admin scripting.

If the task needs broad host-wide changes, unclear sudo actions, or risky data deletion, stop and clarify before execution.

## Safety Contract

- Default to read-only inspection first.
- Require explicit approval before destructive actions, including deletion, and before registry changes, permission or ownership changes, package installation or removal, service restarts, process termination, or configuration changes with material impact. Requested low-impact changes may proceed within scope; previews do not replace approval.
- Present the exact action, target, impact, and rollback before approval. Use a question tool only if exposed and permitted; otherwise ask in chat and wait, or return the approval request to the caller and stop if delegated without user-facing chat. Resume only after approval is relayed.
- Keep scope constrained to approved paths, services, or packages.
- Do not disable security controls, alter auth policy, or make persistence changes without explicit instruction and risk confirmation.

Archive and encryption safety notes:

- Validate required tooling (`tar`, `openssl`) before archive and crypto actions.
- Keep source and target paths explicit; avoid broad wildcard operations.
- Never put passphrases in command arguments, scripts, history, logs, or reports. Use a suitable secret-management flow and assess its exposure; reading from an environment variable does not protect a secret later expanded into an argument.
- Use dry-run mode before apply mode for multi-file operations.
- On decrypt failure, remove only known newly created partial output within the approved scope; report cleanup failures and never remove pre-existing output without approval.

## Workflow

1. Confirm distro, shell context, and target scope.
2. Run narrow read-only baseline commands.
3. Classify risk and blast radius.
4. If action is needed, present command plan plus rollback or fallback.
5. Execute only approved bounded commands.
6. Re-validate with focused checks and summarize deltas.

## Common Linux Commands

Read-only diagnostics:

- `df -h`
- `du -xh <path> | sort -h | tail -n 20`
- `ps aux --sort=-%cpu | head -n 20`
- `systemctl --failed`
- `journalctl -p err -n 100 --no-pager`
- `ss -tulpn`

Bounded maintenance:

- `rm -rf <path>` only after explicit approval and scoped confirmation
- `systemctl restart <service>` after status and dependency checks and explicit approval
- distro package cache cleanup commands only when requested and approved

Archive workflows:

- `tar -cf <target.tar> -C <source-parent> <subdir>` for per-subdirectory archive creation
- `tar -xf <archive.tar> -C <target>` for bounded archive extraction
- For encryption or decryption, select a tool and secret-input method appropriate to the user's security requirements; verify its version-specific behavior and do not pass secret values in process arguments.

## Supporting Utilities

- Use [scripts/linux-disk-audit.sh](scripts/linux-disk-audit.sh) for bounded read-only disk inventory.
- Use [scripts/linux-safe-temp-cleanup.sh](scripts/linux-safe-temp-cleanup.sh) for scoped temp cleanup with dry-run mode.
- Use [scripts/linux-backup-subdirs-to-tar.sh](scripts/linux-backup-subdirs-to-tar.sh) to archive immediate subdirectories into `.tar` files with progress and summary output.
- Do not use [scripts/linux-encrypt-tar-files.sh](scripts/linux-encrypt-tar-files.sh) or [scripts/linux-decrypt-tar-files.sh](scripts/linux-decrypt-tar-files.sh) until remediated: they expand passphrases into process arguments.

## Few-Shot Examples

- Good: Check one mount for usage growth, inspect top directories, approve one cache cleanup, then re-check utilization.
- Good: Diagnose one failed service with `systemctl status`, recent journal logs, one approved restart, then health check.
- Bad: Run `rm -rf` on broad globs like `/var/*` without explicit scope and fallback.
- Bad: Apply package upgrades as part of an unrelated disk triage task without approval.

## Validation

1. Capture pre-action baseline.
2. Run a requested low-impact action or an explicitly approved gated action only within scope.
3. Capture post-action check with same scoped lens.
4. Report commands run, outcomes, file counts, size deltas, and residual risk.