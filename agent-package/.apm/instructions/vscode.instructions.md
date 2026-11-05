---
name: "VS Code Workspace JSON Guidance"
description: "Authoring rules for workspace-level VS Code JSON files under .vscode, including settings, tasks, launch, and extensions recommendations."
applyTo: ".vscode/**/*.json"
---

# VS Code Workspace JSON Guidance

Use these rules when editing workspace-level JSON files in `.vscode/`.

## Known File Roles

- `settings.json`: workspace settings and feature toggles.
- `tasks.json`: repeatable command tasks and build/test automation entrypoints.
- `launch.json`: debug configurations and launch compounds.
- `extensions.json`: recommended or unwanted extensions for collaborators.

If only one of these files exists, do not assume the others should be created unless the task requires them.

## Authoring Rules

- Preserve unrelated settings and existing structure.
- Prefer workspace-local scope over user-scope assumptions.
- Keep configurations explicit and minimal.
- Avoid hardcoding machine-specific absolute paths unless unavoidable.
- Keep comments and trailing-comma behavior aligned with VS Code JSON-with-comments conventions.

## settings.json Guidance

- Group related settings to keep the file scannable.
- Update only the requested setting surface when possible.
- When changing color customizations or tool settings, avoid resetting unrelated preferences.

## tasks.json Guidance

- Use clear task labels and explicit commands.
- Prefer stable cross-shell command forms where practical.
- Avoid destructive defaults in automated tasks.

## launch.json Guidance

- Keep debug configs runnable with current repository structure.
- Set only necessary fields and avoid speculative variants.

## Validation

- Run diagnostics on touched .vscode JSON files.
- Verify referenced paths, scripts, and task names exist.
- If a setting references a repository command, confirm that command exists in the workspace.
