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
- Require explicit approval before destructive commands.
- Keep scope constrained to approved paths, services, or packages.
- Do not disable security controls, alter auth policy, or make persistence changes without explicit instruction and risk confirmation.

Archive and encryption safety notes:

- Validate required tooling (`tar`, `openssl`) before archive and crypto actions.
- Keep source and target paths explicit; avoid broad wildcard operations.
- Do not hardcode passphrases in scripts; prefer environment-based input such as `OPENSSL_PASSPHRASE`.
- Use dry-run mode before apply mode for multi-file operations.
- On decrypt failure, remove partial output files before continuing.

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
- `systemctl restart <service>` after status and dependency checks
- distro package cache cleanup commands only when requested and approved

Archive workflows:

- `tar -cf <target.tar> -C <source-parent> <subdir>` for per-subdirectory archive creation
- `tar -xf <archive.tar> -C <target>` for bounded archive extraction
- `openssl enc -aes-256-cbc -pbkdf2 -salt -in <source.tar> -out <target.tar.enc> -pass pass:<value>` for encryption
- `openssl enc -d -aes-256-cbc -pbkdf2 -in <source.tar.enc> -out <target.tar> -pass pass:<value>` for decryption

## Supporting Utilities

- Use [scripts/linux-disk-audit.sh](scripts/linux-disk-audit.sh) for bounded read-only disk inventory.
- Use [scripts/linux-safe-temp-cleanup.sh](scripts/linux-safe-temp-cleanup.sh) for scoped temp cleanup with dry-run mode.
- Use [scripts/linux-backup-subdirs-to-tar.sh](scripts/linux-backup-subdirs-to-tar.sh) to archive immediate subdirectories into `.tar` files with progress and summary output.
- Use [scripts/linux-encrypt-tar-files.sh](scripts/linux-encrypt-tar-files.sh) to encrypt `.tar` files to `.enc` using OpenSSL with per-file result reporting.
- Use [scripts/linux-decrypt-tar-files.sh](scripts/linux-decrypt-tar-files.sh) to decrypt `.enc` files back to original names with partial-file cleanup on failures.

## Few-Shot Examples

- Good: Check one mount for usage growth, inspect top directories, approve one cache cleanup, then re-check utilization.
- Good: Diagnose one failed service with `systemctl status`, recent journal logs, one approved restart, then health check.
- Bad: Run `rm -rf` on broad globs like `/var/*` without explicit scope and fallback.
- Bad: Apply package upgrades as part of an unrelated disk triage task without approval.

## Validation

1. Capture pre-action baseline.
2. Run action only after approval.
3. Capture post-action check with same scoped lens.
4. Report commands run, outcomes, file counts, size deltas, and residual risk.