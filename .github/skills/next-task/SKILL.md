---
name: next-task
description: Warchive - Triage a repository task, route the next specialist-owned task from attached work docs when needed, or research a codebase or subsystem against a baseline, and hand work to planning, research, implementation, documentation, testing, and review specialists from a single entry point.
disable-model-invocation: true
argument-hint: "[Optional: explicit goal, files, constraints, work doc, implementation doc, comparison target, or attached context.]"
---
# Objective

- Resolve the requested task.
  - If no task was specified, check any included documents and identify the next logical task.
- Delegate all work to the relevant subagents.
  - Do not mix planning, implementation, documentation, testing, and review in a single subagent pass.
  - Dispatch `Web-Researcher` for questions regarding external content and `Text-Explorer` for local content.
- Only scan files as required.
- Ask `questions` when scope, approval, or success criteria are unclear.
  - When asking questions... Summarize the context, explain the decision in plain language, name affected files or behaviors, recommend a default answer when one exists, and keep freeform input enabled.

# Directions

1. Dispatch `Text-Explorer` to gather the required context for the task, including how it should be delegated and validated.
2. If external information is required, dispatch `Web-Researcher` to resolve any questions.
3. Dispatch `Code-Planner` when the task is ambiguous, complex, or cross-cutting.
  - Ask it for a bounded brief with target files, acceptance criteria, risks, scope exclusions, and a validation step.
4. Decide on the workflow steps and their assigned specialist subagents. Create a `todo` plan for each step.
  - For code changes...
    - Dispatch the appropriate coder to update the codebase.
    - Dispatch `Code-Reviewer` to review the changes and provide any corrections to the coder.
    - After implementation and review are complete, dispatch `Code-Tester` for relevant tests and code quality checks. Send any issues back to the coder.
    - Dispatch `Document-Author` to update any repository documents.
  - For research document creation...
    - Dispatch `Web-Researcher` to explore the topic and gather all of the relevant context.
    - Dispatch `Text-Explorer` to capture any local file context.
    - Dispatch `Document-Author` to create or update the documented findings.
    - Dispatch `Code-Reviewer` to identify any issues and provide any corrections for `Document-Author`.
  - For codebase document creation...
    - Dispatch `Text-Explorer` to capture relevant local file context.
    - Dispatch `Document-Author` to create or update the documented findings.
    - Dispatch `Code-Reviewer` to identify any issues and provide any corrections for `Document-Author`.
5. Once done, summarize the requested task, work results, and provide a concise commit message for any file changes.

# Output Example

```markdown
# Request summary
Fix coordination output example formatting

# Changes performed
- Reformatted the coordination output example to use markdown headers for clarity.

# Issues identified
- None identified.

# Commit message
Fix coordination output example formatting
```
