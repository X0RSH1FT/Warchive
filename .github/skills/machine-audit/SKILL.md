---
name: machine-audit
description: Audit a machine to safely reclaim disk space and retire unused software, services, and accounts.
argument-hint: "[Target host or path, task type, optional scope limits, and approval preferences]"
---

# Machine Audit

Audit this machine and help me safely reclaim disk space and retire unused software, services, and accounts.

IMPORTANT: Start with a read-only audit. Do not delete, stop, disable, uninstall, prune, or reconfigure anything until I explicitly approve a specific cleanup plan.

## 1. Establish scope and access
- Identify the OS, machine role, current user, administrator privileges, and whether this is a shared or production machine.
- Identify anything supporting this agent session or remote access.
- Inventory physical disks, partitions, mounted filesystems, capacity, free space, and inode usage.
- Distinguish local disks from network mounts, removable storage, containers, and virtual filesystems. Do not scan external/shared storage without approval.
- Report permission gaps explicitly. Do not request passwords or secrets in chat.

## 2. Audit files and disk usage
Start with filesystem-level totals and drill into the largest directories. Include hidden directories.

Look for:
- Large files, downloads, archives, backups, disk images, media, model weights, and obsolete datasets.
- Application installations, virtual environments, build outputs, dependency caches, and abandoned working directories.
- Package caches, obsolete package versions, logs, journals, crash dumps, temporary files, and trash.
- Containers, images, stopped containers, volumes, build caches, virtual machines, and snapshots where applicable.
- User home directories, application data, databases, and service-account data.

Distinguish allocated space from apparent file size. Account for hard links, sparse files, copy-on-write storage, Git LFS copies, and snapshots when relevant. Treat duplicates as suspected until verified; avoid expensive full-disk hashing unnecessarily.

Compare filesystem usage with visible directory totals. Investigate significant gaps, including permission restrictions, deleted-but-open files, hidden data beneath mounts, and filesystem accounting. Do not claim a complete audit if access is incomplete.

Do not expose file contents containing credentials, private keys, tokens, personal information, or other sensitive material.

## 3. Audit services and scheduled work
Inventory:
- Running, enabled, failed, and installed services.
- System and user service managers, startup applications, containers, and other process supervisors.
- Scheduled tasks, cron jobs, timers, sockets, and other activation mechanisms.
- Listening TCP/UDP ports, bind addresses, owning processes, and associated services.
- Significant CPU, memory, or log usage where useful.

For each relevant application, map:
- Purpose, state, startup policy, service definition, and installation method.
- Runtime account, executable, working directory, configuration, logs, data, caches, and home directory.
- Dependencies, reverse dependencies, proxy routes, certificate renewal, scheduled jobs, and external consumers.

Clearly separate verified relationships from assumptions. A service being stopped does not prove its files are unused; an empty declared dependency list does not prove nothing depends on it.

## 4. Audit users and groups
Inventory local interactive and service accounts, their home directories, shells, ownership, active sessions, and administrator-group membership.

Identify potentially obsolete service accounts and files they own outside their homes. Protect:
- Current and other active users.
- Shared accounts, groups, directories, and credentials.
- Remote-access accounts and anything supporting this session.

Never infer that a service owns an entire interactive user profile merely because it runs as that user. Never recommend removing an account based solely on its name or last-login timestamp.

## 5. Present a cleanup proposal and wait
Provide a prioritized table containing:
- Exact path, package, service, account, or other target.
- Purpose and evidence.
- Observed size and estimated recoverable space.
- Dependencies, risks, backup requirements, and uncertainty.
- Proposed action and required privileges.

Separate:
1. Low-risk regenerable caches and retained logs.
2. Optional applications and reproducible data.
3. Personal, unique, shared, or operationally sensitive data requiring careful review.
4. Unknown or inaccessible items requiring further investigation.

Avoid overlapping/double-counted savings. Distinguish stopping a service from uninstalling software and deleting persistent data.

Ask me to approve specific targets and actions. Deleting a service must not implicitly authorize deleting databases, backups, accounts, or entire home directories. Offer a reasonable retention choice for logs and backups rather than assuming everything should go.

## 6. Perform only the explicitly approved cleanup
After approval:
- Revalidate each target’s resolved path, ownership, mount status, dependencies, and current usage.
- Stop and disable approved services and their activation mechanisms before removing their files.
- Use package managers and application-native cleanup tools when appropriate. Preview dependency removals first.
- Remove only exact, approved directories and verified application-specific files.
- Preserve shared dependencies, infrastructure, configuration, certificates, and user profiles unless separately approved.
- Remove dedicated service accounts/groups only after checking remaining processes, scheduled work, memberships, and owned files.
- Use supported log rotation/vacuum mechanisms; do not directly delete active logs or journals.
- Do not broadly prune container volumes, snapshots, backups, packages, or user profiles.
- Do not recursively delete filesystem roots, mount roots, home-directory roots, or workspace/session roots.
- Do not follow unexpected symlinks, cross filesystem boundaries, or expand deletion scope through wildcards.
- Do not change filesystem reserved-space settings, reboot, interrupt networking, or stop remote access without separate approval.
- If anything differs materially from the approved plan, pause that portion and ask.
- If permissions block an action, report it honestly and continue only with independent, authorized work. Never bypass access controls.

## 7. Verify and report
Verify:
- Approved services/processes and activation mechanisms are gone or disabled as intended.
- Approved files, packages, and accounts were removed.
- Retained services and remote access still work.
- No unexpected broken references remain.
- Before/after free space and inode usage, including any delayed reclamation.

Provide a concise final report with:
- Completed actions.
- Measured space recovered.
- Items intentionally preserved.
- Blocked or incomplete actions and reasons.
- Any follow-up needed.

Never report success without verification. Do not upload machine data to external services. Keep the audit proportionate and avoid unnecessary tools or dependencies.