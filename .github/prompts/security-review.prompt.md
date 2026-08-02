---
name: security-review
description: Warchive - Run an authorized, evidence-based read-only security review of a defined repository scope and coordinate remediation follow-up.
argument-hint: "[Optional: repository revision, file paths, components, suspected risk, or review constraints.]"
agent: Coordinator Agent
---

# Objective

Run a bounded defensive security review of the requested repository scope. Treat the prompt as the task entrypoint and use `Code Security Agent` as the read-only security specialist.

# Directions

1. Obtain the review scope and authorization before inspection. Confirm the repository and revision, target paths or components, owner or approver, permitted read-only access, reporting channel, time window, and out-of-scope systems. Use `#askQuestions` when a missing decision changes what may be reviewed.
2. Define the review target in one concise statement, including the trust boundary or risk question being examined and the first validation boundary. Do not broaden the target without authorization.
3. Route the scoped static review to `Code Security Agent`. The specialist must use `docs/research/codebase-security-and-malware-review.md`, keep its least-privilege read-only tools, and report evidence separately from inference.
4. Run the review in safe stages: confirm scope, inspect the target and nearby control paths, correlate only repository-local evidence, then produce a findings-first report. Do not run code, commands, builds, downloads, dynamic analysis, or suspected artifacts.
5. Require each finding to identify location, impact, severity, confidence, sanitized evidence, remediation, and limitations. Keep suspicious indicators distinct from proof of malware, and never treat no findings as proof of safety.
6. For confirmed findings, obtain human approval before routing source changes to `Implementation Agent`. Ask that agent to make the smallest source-owned fix, preserve evidence links, and request targeted validation from `Testing Agent` when validation is needed.
7. After remediation and validation, route the changed scope back to `Code Security Agent` for a focused re-review. Use `Reviewer Agent` when an independent findings-first signoff is needed for the resulting change set.
8. Offer `Documentation Agent` only when verified findings, remediation decisions, or durable workflow changes belong in source-owned documentation. Do not change documentation as part of the security review unless that follow-up is accepted.
9. Close with the reviewed target, authorization assumptions, findings and limits, remediation status, re-review result or pending step, validation gaps, and a concise imperative commit message when changes are ready to keep.
