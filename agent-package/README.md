
## Personal environment guidance

Warchive is public, so its agents, skills, and package documentation must not
contain personal host inventory or private checkout paths. The user agent and
skill installers copy only the generic `.apm/agents/` and `.apm/skills/`
content; they do not install personal guidance or repository instructions.

Keep personal cross-host guidance in a separate VS Code user-scoped instruction,
managed under **Agent Customizations > Instructions > User** for the selected
harness. Have that instruction explicitly direct the agent to read the private
Bit-Control environment index from the workspace when present, or from the
private local checkout when Bit-Control is not open. If neither copy is
available, the agent should mark the details unknown and ask. Do not treat a
Markdown link as an instruction to load the target file. Verify that the user
instruction is listed for the intended harness and test it in a new chat.

# Local agent package

This opt-in APM package's `.apm/agents/`, `.apm/instructions/`, and `.apm/skills/` are the sources for Warchive's Copilot agent definitions, scoped instruction files, and skills, explicitly listed in `apm.yml`.

The manifest's `type: hybrid` is valid for mixed instruction/skill packages, but APM currently discovers deployable primitives from their content and target support; the type does not declare every included file type.

## Maintain and verify

Run the **Check APM package** VS Code task, or from the repository root in PowerShell run the read-only package check after changes and before packing:

```powershell
./agent-package/check-package.ps1
```

The check derives expected file counts and names from `apm.yml`, verifies the exact sorted manifest paths, checks agent frontmatter names and declared delegation targets, validates supported local Markdown links in agents, instructions, and all packaged skill Markdown (including resource documents), requires the bundled agent knowledge resources, and checks required agent/skill links against the supported installed layout. It recognizes single-line inline links such as `[label](path)` and `[label](<path> "title")`; labels cannot contain `]`, unbracketed destinations cannot contain whitespace or `)`, and optional title text cannot contain `)`. Fenced code, inline code, external URLs, and fragments are ignored. Explicitly optional wording allows workspace references to be absent, but cannot waive a dependency whose path is inside the packaged agents or skills. It also checks for workspace instruction duplicates anywhere under `.github/instructions/`. Update `apm.yml` when adding or removing package files. It accepts only the current simple manifest shape (plain metadata, explicit path list with optional blank lines, and `dependencies: {}`); unexpected or duplicate keys and list entries fail without a YAML dependency. It does not copy files or inspect the real user profile.

Run the isolated checker tests with Pester 3.4:

```powershell
Invoke-Pester -Script ./agent-package/tests/check-package.Tests.ps1
```

The [warchive-agent-knowledge skill](.apm/skills/warchive-agent-knowledge/SKILL.md) routes character-packet, defensive security-review, and Windows Ollama tasks to portable shared references under `resources/`. The [cross-service data operations skill](.apm/skills/cross-service-data-operations/SKILL.md) provides reusable discovery, transaction-safety, privilege-separation, and verification practices. It deliberately contains no host inventory; resolve environment-specific facts from the consumer's private instructions and owning service docs. Agents must read the relevant resource explicitly; a Markdown link does not load it. Essential role and approval rules remain in the agents. Skill-specific assets stay with their skill; general research stays in `docs/` and is not installed. Repository instructions and docs are not installed.

## Install user agents

The supported installed layout uses sibling directories under one `.copilot` root: `<root>\agents\<agent>.agent.md` and `<root>\skills\<skill-name>\...`. The defaults use `$HOME\.copilot\agents` and `$HOME\.copilot\skills`. If overriding destinations, pass `<same-root>\agents` to the agent installer and `<same-root>\skills` to the skill installer so relative links between packaged resources and agents remain valid. This verifies structural reference portability only; host-specific discovery, activation, and automatic loading depend on the consuming application and are not provided by these copy scripts.

Run the **Install Warchive user agents** VS Code task, or from the repository root in PowerShell run:

```powershell
./agent-package/install-user-agents.ps1
```

The script copies `.agent.md` files from `.apm/agents/` to `$HOME\.copilot\agents`, creating the destination if needed and overwriting files with matching names. It leaves other files alone and does not remove agents that are no longer in the package. Use `-WhatIf` to preview the operations, or pass `-Destination` as described above.

## Install user skills

Run the **Install Warchive user skills** VS Code task, or from the repository root in PowerShell run:

```powershell
./agent-package/install-user-skills.ps1
```

The script copies each skill directory from `.apm/skills/` to `$HOME\.copilot\skills`, including supporting files, and overwrites matching files without deleting unrelated or stale files. Use `-WhatIf` to preview the operations, or pass `-Destination` as described above. Both installers leave stale files behind; manually remove retired package files only when appropriate. Automatic cleanup is intentionally not performed.

## Pack locally

From this directory, create the archive:

```powershell
apm pack --archive -o ./dist
```