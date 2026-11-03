# Local agent package

This opt-in APM package's `.apm/agents/` and `.apm/instructions/` are the sole sources for Warchive's Copilot agent definitions and scoped instruction files, explicitly listed in `apm.yml`. All 35 agents were verified byte-identical to their former workspace copies before removal. The instructions were moved from `.github/instructions/`; edit them here rather than regenerating workspace copies. `.github/agents/` and `.github/instructions/` have no active definitions in this repository. `.github/copilot-instructions.md` remains the repository's always-on instructions and is not included in the package. `.opencode/agents/` is excluded.

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

The user-space installation process remains deferred and unverified. Any user's manual user-space copies are independent of these package files; editing the package does not update them. The package is strictly local: do not publish or use a registry or remote source. APM pack, consumer test, and user-scope APM install have not been verified for this migration. See the [pack guide](https://microsoft.github.io/apm/producer/pack-a-bundle/) for upstream packaging guidance. For compatibility with a different target repository, the legacy `scripts/powershell/Copy-GithubMdTrees.ps1` copies package instructions to that target's `.github/instructions/` when `CopyInstructions` is enabled; this is a separate manual copy workflow, not an APM installation or a regeneration of this repository's `.github/instructions/`.

## Portability limits

The package does not include linked Warchive documentation, prompts, the source repository, or other repository-specific files. Examples referenced by agents include `../../docs/knowledge/role/roleplay-character-packet-template.md`, `../../docs/research/codebase-security-and-malware-review.md`, `../../docs/research/ollama-troubleshooting-windows.md`, `.github/prompts/debug-task.prompt.md`, `.github/prompts/review-changes.prompt.md`, and `docs/research/agentic-coding.md`; some referenced targets are absent from this checkout. The instruction authoring reference `../../../docs/knowledge/dev/agent/vscode-copilot-agent-customization-reference.md` also points outside the package and may not resolve in a consumer. Host-specific tool IDs, pinned model IDs, platforms, and extensions need equivalents in the consuming host; none are bundled.

Known portability dependency: roleplay agents retain relative links such as `../../docs/knowledge/role/roleplay-character-packet-template.md`, authored for the deployed `.github/agents/` location. From the source `.apm/agents/` location, those links do not resolve in this workspace. Consumer projects need the referenced docs at the expected relative location for deployed links to work; packaging does not silently fix these links or supply the docs.

Some unchanged agent examples mention `.github/agents/workflow-coordinator.agent.md` and case-different `.github/agents/Code-Reviewer.agent.md`; the package has no workflow-coordinator and its reviewer file is lowercase, `code-reviewer.agent.md`. These examples are not deployment instructions. For details, see the [APM reference guide](../docs/knowledge/dev/agent/apm-reference.md).
