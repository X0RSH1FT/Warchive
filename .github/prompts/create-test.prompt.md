---
name: create-test
description: Warchive - Orchestrate comprehensive testing cycles for code changes or new features by generating test cases, running validation, and documenting coverage.
argument-hint: "[Optional: target files, functions, feature description, or specific test type (e.g., unit, integration).]"
agent: Coordinator Agent
---

# Objective

- Ensure the quality and correctness of code changes or new features by executing a structured testing workflow.
  - If no targets are specified, analyze included documents to identify areas requiring validation.
- Delegate all work through specialized agents to cover test generation, execution, failure analysis, and documentation update.
  - Do not mix planning, implementation, documentation, testing, and review in a single subagent pass.
  - Dispatch `Explorer Agent` for local context gathering and `Testing Agent` for core validation logic.
- Only run tests on the minimum necessary scope to validate the claim or change.
- Ask `questions` when test coverage gaps, required dependencies, or success criteria are unclear.
  - When asking questions... Summarize the code/feature under review, explain the testing gap, name affected files or behaviors, recommend a default test type (e.g., unit), and keep freeform input enabled.

# Directions

1. **Context Gathering:** Dispatch `Explorer Agent` to gather all necessary context for the target code or feature. This includes reading relevant source files and understanding existing tests/documentation.
2. **Test Generation & Planning:**
    - If the task is ambiguous, dispatch `Planner Agent` to define a bounded testing scope: specific functions, required test types (unit, integration), acceptance criteria, and validation steps.
    - Dispatch `Testing Agent` to generate initial test cases based on the gathered context and plan.
3. **Execution & Validation Loop:**
    - Execute tests using the appropriate environment/tooling (e.g., running `pytest`).
    - If tests pass: Proceed to Step 4.
    - If tests fail: Dispatch `Implementation Agent` with the failure report, asking it to fix the code based on test failures. After implementation, loop back to re-run tests until all critical tests pass or a blocker is identified.
4. **Documentation & Review:**
    - Once testing passes and the code is stable, dispatch `Documentation Agent` to update relevant documentation (e.g., READMEs, API docs) to reflect the new functionality and its validated behavior.
    - Dispatch `Reviewer Agent` to review both the implemented fix/feature *and* the updated test coverage documentation for completeness and accuracy.
5. **Finalization:** Once all steps are complete, summarize the original task, the testing results (pass/fail), the fixes applied, and provide a concise commit message detailing the scope of changes and validation performed.

# Example

```markdown
- Task: Implement OAuth flow using Google credentials in `auth_service.py`.
- Results: Generated unit tests for token exchange; fixed two edge cases identified by testing agent; updated `docs/knowledge/dev/api-specs.md` with the new endpoint structure. All critical tests passed.
- Commit message: Feat(auth): Implement Google OAuth flow and add comprehensive test coverage.