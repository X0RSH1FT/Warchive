---
name: simplify-code-ralph
description: Simplify and reduce a codebase while preserving its existing functionality.
disable-model-invocation: true
argument-hint: "[Codebase or code snippet to simplify]"
---
Simplify and reduce this codebase while preserving its existing functionality.

Inspect the current code and worktree first. Previous iterations may already
have made changes; work from the current state and preserve uncommitted work.

Identify one high-value, coherent opportunity to reduce code surface or
cognitive complexity. Implement it end to end, including affected callers.
Consider removing unnecessary indirection, duplication, state, abstractions,
dependencies and obsolete code. Consolidate only when the result is clearer.

Preserve intended behavior, public contracts, error handling, security,
concurrency and lifecycle guarantees. Do not remove protections, features or
tests merely to reduce line count. Prefer the smallest clear solution over
introducing a new framework or generic abstraction.

Follow repository instructions and conventions. Update directly affected
documentation and tests, then run focused validation. Report any blockers.
Do not commit, create planning files or modify unrelated work.

Report:
- What changed and why it is simpler.
- Validation results and any remaining risk.
- The next worthwhile candidate, if known.

If you find no concrete, worthwhile simplification, make no changes and report
NO_ACTIONABLE_SIMPLIFICATION, briefly describing what you examined. Do not
invent changes to keep the loop going.