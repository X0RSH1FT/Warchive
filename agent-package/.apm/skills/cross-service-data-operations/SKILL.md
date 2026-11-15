---
name: cross-service-data-operations
description: Coordinate safe changes across workflow, database, dashboard, and automation services using owner discovery, transaction safety, least privilege, and explicit verification.
---

# Cross-Service Data Operations

Use this workflow when a change crosses repositories or services, such as a
workflow that writes to a database and feeds a dashboard or automation
interface. This is a discovery and delivery method, not permission to access
or change a live system. Resolve environment-specific details from the
consumer's private instructions and service documentation; do not add personal
host inventory to this reusable skill.

## 1. Establish owners and boundaries

1. Read each owning repository's local instructions, README, and relevant
   deployment or workload guide. A Markdown link is a reference, not proof
   that its target was read.
2. Identify the execution context and target context separately: host, OS,
   account, working directory, target service, and target path. Distinguish
   development checkouts from deployed files and runtime identities. If the
   private environment guide is unavailable, mark these details unknown and
   ask rather than infer them.
3. Treat repository notes and captured inventories as dated evidence. Verify
   current versions, configuration, service state, client location, and
   deployment path through authorized, read-only checks before planning an
   operational change.
4. Keep credentials and private keys out of source, logs, screenshots, and
   reports. Do not display secret values while reviewing configuration; report
   only whether a sensitive value is present or needs attention.

## 2. Bound changes and protect data

1. Prefer the smallest owner-scoped change. Get explicit approval before
   changing shared services, network or TLS policy, database grants, retention,
   or deployed state, or before deleting data, restarting services, or
   performing backup or restore operations.
2. Separate identities by purpose. Interactive development access may need
   write permission; unattended service access should use a service-scoped
   identity with only the required permissions. Do not reuse a personal
   push-capable credential for an unattended pull. Give applications,
   migrations, and reporting clients distinct database roles where practical,
   each limited to the required objects and operations.
3. Define transaction boundaries before changing ingestion or persistence.
   Make retries safe, avoid marking work successful before its data commit,
   and keep external side effects outside database transactions when they
   cannot be rolled back. Test failure and rollback behavior against an
   isolated database, never a production target.
4. Estimate workload and storage impact. Confirm the relevant backup coverage
   before a consequential data change, but treat backup creation and restore
   testing as separate, explicitly authorized work.

## 3. Verify each layer

1. Run focused tests and configuration or parse checks from the owning
   repository. For database integration tests, verify the isolated target,
   schema compatibility, permissions, transaction commit, and rollback.
2. Verify workflow execution and persisted results separately. A successful
   task is not proof that its database transaction committed; check the
   resulting run marker and expected persisted records using an authorized,
   non-secret query.
3. Verify reporting from the actual consuming service. A valid dashboard
   export or a successful query from another host does not prove datasource
   connectivity, TLS trust, import, or rendered panels.
4. For automation interfaces, validate the configuration and the affected
   entities or actions. Preserve existing device control, automations, and
   recorder behavior unless the request explicitly includes them.
5. Report source edits, deployment, and live verification as separate states.
   State what was tested, what was actually changed live, and what remains
   unknown. Commit or publish only when requested; do not claim a live result
   from repository evidence alone.