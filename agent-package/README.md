# Local agent package

This opt-in APM package's `.apm/agents/` and `.apm/instructions/` are the sole sources for Warchive's Copilot agent definitions and scoped instruction files, explicitly listed in `apm.yml`.

## Maintain and verify

Run the **Check APM package** VS Code task, or from the repository root in PowerShell run the read-only package check after changes and before packing:

```powershell
./agent-package/check-package.ps1
```

The check derives expected file counts and names from `apm.yml`, verifies that the package directories match the manifest, checks for workspace instruction duplicates anywhere under `.github/instructions/`, and requires a complete, sorted include list. Update `apm.yml` when adding or removing package files. It accepts only the current simple manifest shape (plain metadata, explicit path list with optional blank lines, and `dependencies: {}`); unexpected or duplicate keys and list entries fail without a YAML dependency. It does not compare contents or copy files. Do not add prompts, skills, extensions, repository files, or OpenCode configuration to `includes`.

## Pack locally

From this directory, create the archive:

```powershell
apm pack --archive -o ./dist
```