# Local agent package

This opt-in APM package's `.apm/agents/`, `.apm/instructions/`, and `.apm/skills/` are the sources for Warchive's Copilot agent definitions, scoped instruction files, and skills, explicitly listed in `apm.yml`.

The manifest's `type: hybrid` is valid for mixed instruction/skill packages, but APM currently discovers deployable primitives from their content and target support; the type does not declare every included file type.

## Maintain and verify

Run the **Check APM package** VS Code task, or from the repository root in PowerShell run the read-only package check after changes and before packing:

```powershell
./agent-package/check-package.ps1
```

The check derives expected file counts and names from `apm.yml`, verifies the exact sorted manifest paths, checks agent frontmatter names and declared delegation targets, validates local Markdown links in supported customization files, requires the bundled agent knowledge resources, and checks required agent/skill links against the supported installed layout. It ignores code examples, external URLs, fragments, and explicitly optional references. It also checks for workspace instruction duplicates anywhere under `.github/instructions/`. Update `apm.yml` when adding or removing package files. It accepts only the current simple manifest shape (plain metadata, explicit path list with optional blank lines, and `dependencies: {}`); unexpected or duplicate keys and list entries fail without a YAML dependency. It does not copy files or inspect the real user profile.

Run the isolated checker tests with Pester 3.4:

```powershell
Invoke-Pester -Script ./agent-package/tests/check-package.Tests.ps1
```

The `warchive-agent-knowledge` skill bundles reference docs needed by installed agents as `resources/`; repository instructions and docs are not installed.

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