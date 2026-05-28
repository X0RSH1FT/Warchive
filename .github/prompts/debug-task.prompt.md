---
name: debug-task
description: Debug a failing test, command, traceback, runtime symptom, or regression. Use when the goal is to reproduce a problem, isolate the owning code path, and route the work through testing or implementation.
argument-hint: "[Optional: failing test, command, traceback, symptom, expected behavior, recent change, or target files.]"
agent: Coordinator Agent
---

1. Start from the most concrete failure anchor available: a failing test, command, traceback, runtime symptom, or regression report.
2. Retrieve only enough context to choose the owning path and the first falsifying check. If the signal is broad or unclear, prefer a short `Explorer Agent` pass over broad inline searching.
3. If the failure signal is incomplete, use `#askQuestions` to gather the missing reproduction detail before dispatching. Explain the current symptom, the likely affected command, test, or module, and what detail is needed to narrow the owner.
4. Decide whether the fastest next move is a reproduce-first testing pass or an implementation pass from an already-clear controlling code path.
5. Route to `Testing Agent` when reproduction, pytest failure analysis, runtime inspection, or validation depth is the main work, and have it start with the narrowest useful check.
6. Route to `Implementation Agent` when the controlling source path is already clear and the likely fix is in production code.
7. Keep the debug loop tight: reproduce, isolate, fix, rerun the same narrowest falsifying check, then widen only if confidence requires it.
8. Use `#askQuestions` only when the missing symptom details, acceptance criteria, or scope boundaries block progress, and make the prompt self-contained enough that the user can answer without already knowing the code layout.
9. If the issue turns into a broader refactor, doc refresh, or cross-cutting change, switch back to the normal coordinator flow instead of forcing a debug-shaped workflow.
10. After the active debugging pass, summarize the root cause, what changed, and what was validated.
11. If the debug work ends in implementation, return to the same post-implementation coordinator path used by `next-task`, including any needed testing, documentation, and review follow-up.
12. Provide a concise, imperative commit message when the fix is ready to keep.

Example response shape:
- Failure anchor: `pytest tests/test_cli.py::test_empty_input` fails with a traceback in `src/app/cli.py`.
- Owning path: input normalization in `src/app/cli.py`.
- First check: rerun that one failing test before widening scope.
- Root cause: empty input bypasses the default branch and reaches an invalid parse path.
- What changed: add the missing empty-input fallback before parsing.
- Validation: the same focused test passes after the fix.
- Commit message: Fix CLI empty-input handling.