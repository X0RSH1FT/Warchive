---
name: "Customization Hook Patterns"
description: "Rules for authoring VS Code Copilot hook files in .github/hooks. Use when editing hook JSON in this repository."
applyTo: ".github/hooks/**/*.json"
---

# Customization Hook Patterns

Use these rules when editing Copilot hook files under `.github/hooks/`.

## Hook Shape

- Keep hooks deterministic, lightweight, and safe to run repeatedly.
- Prefer commands that format or validate the changed surface rather than broad repo-wide automation.
- Keep hook configuration focused on a single lifecycle purpose.

## Workflow Fit

- Keep the shared workflow small: the default shared path is `Coordinator Agent`, `Implementation Agent`, and `Reviewer Agent`.
- Treat `Documentation Agent`, `Testing Agent`, and `Web Research Agent` as optional specialists for documentation-heavy, test-heavy, or external-doc-heavy work, not as mandatory stages on every task.
- Use hooks to reinforce that workflow with automation, not to replace routing or agent responsibilities.

## Validation

- Ensure the JSON remains valid and uses the expected schema keys for the selected hook type.
- After editing hook files, run diagnostics on the touched file before considering the change complete.