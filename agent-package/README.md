# Local agent package

This opt-in APM package's `.apm/agents/`, `.apm/instructions/`, and `.apm/skills/` are the sources for Warchive's Copilot agent definitions, scoped instruction files, and skills, explicitly listed in `apm.yml`.

The manifest's `type: hybrid` is valid for mixed instruction/skill packages, but APM currently discovers deployable primitives from their content and target support; the type does not declare every included file type.

## Maintain and verify

Run the **Check APM package** VS Code task, or from the repository root in PowerShell run the read-only package check after changes and before packing:

```powershell
./agent-package/check-package.ps1
```

The check derives expected file counts and names from `apm.yml`, verifies that the agent, instruction, and skill package files match the manifest, checks for workspace instruction duplicates anywhere under `.github/instructions/`, and requires a complete, sorted include list. Update `apm.yml` when adding or removing package files. It accepts only the current simple manifest shape (plain metadata, explicit path list with optional blank lines, and `dependencies: {}`); unexpected or duplicate keys and list entries fail without a YAML dependency. It does not compare contents or copy files. Keep package assets in the recognized `.apm/agents/`, `.apm/instructions/`, and `.apm/skills/` layouts.

## Install user agents

Run the **Install Warchive user agents** VS Code task, or from the repository root in PowerShell run:

```powershell
./agent-package/install-user-agents.ps1
```

The script copies `.agent.md` files from `.apm/agents/` to `$HOME\.copilot\agents`, creating the destination if needed and overwriting files with matching names. It leaves other files alone and does not remove agents that are no longer in the package. Use `-WhatIf` to preview the operations, or pass `-Destination` to install to a different directory.

## Install user skills

Run the **Install Warchive user skills** VS Code task, or from the repository root in PowerShell run:

```powershell
./agent-package/install-user-skills.ps1
```

The script copies each skill directory from `.apm/skills/` to `$HOME\.copilot\skills`, including supporting files, and overwrites matching files without deleting unrelated or stale files. Use `-WhatIf` to preview the operations, or pass `-Destination` to install to a different directory.

## Pack locally

From this directory, create the archive:

```powershell
apm pack --archive -o ./dist
```