---
name: address-test-issues
description: Run the repository's full test suite, relevant CI/CD-style quality gates, and adjacent validation checks for a change, inspect failures, route fixes to the right owner, and summarize residual gaps.
argument-hint: "[Optional: changed files, changed modules, known commands, failing gates, expected coverage changes, or extra validation constraints.]"
agent: Testing Agent
---

1. Start from the most concrete validation anchor available: changed files, changed modules, a recent implementation pass, a failing gate, or a named command.
2. Confirm the repository's executable validation surface before running commands. Include the full test suite plus the relevant CI/CD-style quality gates that apply to the touched code, such as lint, type-check, static analysis, build, packaging, runtime smoke checks, or editor diagnostics.
3. If a focused smoke check for the touched module will sharpen failure isolation, run it first, but do not stop there when the request is for a full validation sweep.
4. Run the expected validation path for the current change and keep a concrete record of each command, result, and any skipped gate with the reason.
5. When behavior or contracts changed, confirm whether test coverage should be added, updated, or removed for the touched modules. Apply small test-surface fixes directly; hand production-code fixes back to `Implementation Agent`.
6. Inspect every failing test or quality gate and classify the likely owner:
   - `Testing Agent` when the fix stays mainly in tests, fixtures, assertions, or validation wiring
   - `Implementation Agent` when the failure points to production code, configuration, or a source-owned regression
   - `Documentation Agent` when the repository docs or validation commands are stale
7. Do not mask failures by narrowing the validation path without explaining why the broader gate is no longer expected.
8. After fixes or routing, rerun the narrowest failed check first, then rerun the remaining expected suites and quality gates needed to restore confidence.
9. Summarize the commands run, outcomes, failures addressed, any test coverage changes, residual gaps, any waived checks, and whether plan-derived validation work is exhausted.
10. Hand off to `Reviewer Agent` when the validation pass was non-trivial and the next step is signoff.
11. Provide a concise, imperative commit message when the changes are ready to keep.