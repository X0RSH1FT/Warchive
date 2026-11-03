# Local agent package

This opt-in APM package's `.apm/agents/` is the sole source of truth for Warchive's 35 Copilot agent definitions, explicitly listed in `apm.yml`. All 35 were verified byte-identical to their former workspace copies before removal and are preserved here. `.github/agents/` is empty and retired; Warchive no longer provides project-scoped agents there. `.opencode/agents/` agents are excluded. Edit only the package definitions; do not sync from or regenerate workspace copies.

## Maintain and verify

From the repository root in PowerShell, run the read-only package check after changes and before packing:

```powershell
./agent-package/check-package.ps1
```

The check requires exactly 35 package agents and a complete, sorted, matching manifest include list. It does not compare agent contents or copy files or create `.github/agents/`. Do not add prompts, skills, extensions, repository files, or OpenCode configuration to `includes`.

## Pack locally

From this directory, create the archive:

```powershell
apm pack --archive -o ./dist
```

The user-space installation process remains deferred and unverified. Any user's manual user-space copies are independent of these package files; editing the package does not update them. The package is strictly local: do not publish or use a registry or remote source. APM was unavailable for this transition: no APM pack, consumer test, or user-scope APM install was performed. See the [pack guide](https://microsoft.github.io/apm/producer/pack-a-bundle/) for upstream packaging guidance.

## Portability limits

The package does not include linked Warchive documentation, prompts, the source repository, or other repository-specific files. Examples referenced by agents include `../../docs/knowledge/role/roleplay-character-packet-template.md`, `../../docs/research/codebase-security-and-malware-review.md`, `../../docs/research/ollama-troubleshooting-windows.md`, `.github/prompts/debug-task.prompt.md`, `.github/prompts/review-changes.prompt.md`, and `docs/research/agentic-coding.md`; some referenced targets are absent from this checkout. Host-specific tool IDs, pinned model IDs, platforms, and extensions need equivalents in the consuming host; none are bundled.

Known portability dependency: roleplay agents retain relative links such as `../../docs/knowledge/role/roleplay-character-packet-template.md`, authored for the deployed `.github/agents/` location. From the source `.apm/agents/` location, those links do not resolve in this workspace. Consumer projects need the referenced docs at the expected relative location for deployed links to work; packaging does not silently fix these links or supply the docs.

Some unchanged agent examples mention `.github/agents/workflow-coordinator.agent.md` and case-different `.github/agents/Code-Reviewer.agent.md`; the package has no workflow-coordinator and its reviewer file is lowercase, `code-reviewer.agent.md`. These examples are not deployment instructions. For details, see the [APM reference guide](../docs/knowledge/dev/agent/apm-reference.md).
