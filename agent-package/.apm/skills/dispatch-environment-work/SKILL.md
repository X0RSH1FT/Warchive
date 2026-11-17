---
name: dispatch-environment-work
description: Route repository, cross-service, and host-administration tasks using the owning documentation and verified environment context.
argument-hint: Describe the task to dispatch
---

Treat the user's current request as the task. Identify the owning repository or service and classify the work as repository-local, cross-repository/service, or host administration.

Read the owning repository's Copilot instructions, README, and only the relevant guide and tests before acting. For cross-host or service work, read the private bit-control `docs/environment-index.md`; locate it in the open bit-control checkout, or read the user-scoped `personal-environment.instructions.md` for the private fallback. If neither source is available, mark environment details unknown and ask before commands that depend on them. Treat notes and inventories as evidence, not live verification.

For cross-service data work, request/load the `cross-service-data-operations` skill when the runtime supports it. Route database schema, migration, and reusable-query changes to the repository that owns the database schema; keep code and tests in the runtime repository, dashboard exports in the reporting repository, and host or role operations in the private operations guidance. For host administration, request/load `linux-bash-admin` or `windows-powershell-admin` as appropriate, and read the relevant bit-control guide. When delegation is supported and useful, delegate a bounded task to the appropriate agent and verify its results. If a skill or delegation is unsupported, state that limitation; do not imply that an agent was spawned or a skill loaded. Avoid broad skills for repository-local work.

Before running commands, state separately:
- Execution context: host, OS, account, and working directory.
- Target context: host or service, OS, account, and target path.

Mark unknown fields explicitly; do not infer them from checkout paths or documentation. Verify exact source and deployment paths, including case, when relevant.

Respect the user's explicit authorization. Do not expose or copy credentials or secret values. Do not connect to or change live systems, deploy, alter shared services, or perform consequential data operations unless explicitly requested. Keep source edits, deployment, and live verification as separate outcomes, and claim only what was actually performed and verified. Keep feed and report specifics in their owning documentation rather than duplicating environment inventory here.

Report the owner and scope, relevant evidence and unknowns, actions and focused checks, and separate deployment/live-verification status. Ask only for information or authorization that blocks safe progress.