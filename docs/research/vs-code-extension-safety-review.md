# VS Code Extension Safety Review

Scope: A practical, source-aware review for Windows and Linux/macOS users who want to assess a Visual Studio Code extension before installing or updating it. This document covers Marketplace and repository investigation, static inspection of `.vsix` packages or installed files, dependency review, and limited runtime observation. It is risk reduction, not a security certification.

Audience: Developers, maintainers, and security-conscious users evaluating an unfamiliar VS Code extension.

Last updated: 2026-07-31

## Evidence boundary and security caveat

No checklist can guarantee that an extension is safe. An extension may change after review, contain a compromised dependency or release artifact, behave differently on a later activation path, or conceal behavior in generated/minified code. Static inspection can miss runtime-decrypted or downloaded code, and network/process observations can be incomplete. Use a disposable profile or isolated machine for high-risk testing, keep backups, and do not grant an extension access to sensitive workspaces merely to evaluate it.

The reviewed article, [How to Actually Check if a VS Code Extension is Safe Before You Install It](https://dev.to/ishaan_agrawal/how-to-actually-check-if-a-vs-code-extension-is-safe-before-you-install-it-3pal), is a useful secondary checklist: investigate publisher identity and maintenance, inspect the manifest and source, and review dependencies. The article's broad privilege warning should be read with the official [Extension Host documentation](https://code.visualstudio.com/api/advanced-topics/extension-host): extension code runs in a VS Code extension host, and the host's process and operating-system boundary are not a security permission model. Treat the extension as code you are choosing to run with the user's account and environment access available to its host process.

## Consolidated findings

### 1. Establish identity and provenance

Before installing, record the exact extension identifier, version, publisher, Marketplace URL, repository URL, and publisher contact or organization. Compare the identifier and repository links across the Marketplace listing, the repository, release tags, and package metadata. Look for a history that is coherent with the extension's claimed purpose: meaningful releases, responsive issue handling, understandable ownership, and a repository that actually contains the implementation.

Marketplace metadata such as publisher, install information, version, last update, and declared contributions is useful context, not proof of trust. A familiar name, high install count, or badge does not eliminate typosquatting, account takeover, malicious updates, or a compromised build pipeline. Do not state that a publisher is "verified" unless the current Marketplace page and an authoritative Microsoft source explicitly support that claim; a listing's presence on the Marketplace is not itself a complete security verdict. The official [Visual Studio Marketplace documentation](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace) explains the listing and installation workflow.

### 2. Read the manifest, but do not mistake it for a permission file

Inspect `package.json`, especially:

- `publisher`, `name`, `version`, `engines.vscode`, and repository/homepage URLs.
- `main`, `browser`, or `extensionKind`, which help identify the extension host/runtime entry point.
- `activationEvents`, which describe events that can cause activation. They are not a complete inventory of behavior and are not a permissions system.
- `contributes.commands`, menus, configuration, languages, tasks, debuggers, authentication providers, and other contribution points. These describe UI or VS Code integration surfaces; they are not operating-system permission declarations.
- `dependencies`, `devDependencies`, scripts, and lockfiles. A dependency list is an investigation map, not a proof that the dependency is safe.

Use the official [Extension Manifest reference](https://code.visualstudio.com/api/references/extension-manifest), [Activation Events reference](https://code.visualstudio.com/api/references/activation-events), and [Contribution Points reference](https://code.visualstudio.com/api/references/contribution-points) to interpret these fields. In particular, do not infer "safe" from few activation events or infer "dangerous" from a command contribution alone. The implementation can perform sensitive work from an activation path that is not obvious from the name, and a command can be benign or sensitive depending on its handler.

### 3. Inspect implementation and dependency risk

Prefer a source repository with readable source, build instructions, release history, and a lockfile. Search both source and the packaged output. Pay particular attention to code that:

- makes HTTP or WebSocket connections, uploads workspace data, or contacts unfamiliar domains;
- reads environment variables, credentials, SSH files, cloud configuration, or arbitrary workspace files;
- starts child processes, shells, scripts, or downloaded executables;
- downloads and executes code, writes outside the workspace, modifies settings, or changes the PATH;
- uses obfuscated strings, large minified bundles, dynamic evaluation, native modules, or install/postinstall scripts without a clear reason.

A match is a lead for review, not proof of maliciousness. Extensions legitimately need file, process, network, or workspace APIs. Inspect the surrounding code, destination, data flow, user-facing explanation, and whether the behavior is proportionate to the advertised feature. Search dependencies and their release history as well as first-party source. Run `npm audit` only when an extracted package includes a usable lockfile and Node/npm are installed; audit advisories are incomplete, may include false positives or unexploitable paths, and do not detect bespoke malicious logic.

### 4. Observe runtime cautiously

Runtime checks can reveal unexpected domains, child processes, file writes, or repeated activity, but they are snapshots and usually observe the entire VS Code process tree rather than attributing an action to one extension. `Get-NetTCPConnection` on Windows and `lsof`/`ss` on Unix-like systems show process-level connections; they do not prove which extension initiated them. Use a disposable VS Code profile, a minimal test workspace, an OS firewall or proxy you control, and file/process monitoring when the risk justifies it. Do not open real secrets or authenticate to production services during a test.

## Practical workflow

1. Copy the exact extension identifier and version from the Marketplace or an existing installation.
2. Check the publisher, repository, release history, issue activity, package contents, and dependency provenance.
3. Download the `.vsix` without opening or installing it, verify its hash if the publisher provides a trusted release hash, and inspect it as an archive.
4. Read `package.json`, then search source and bundled output for network, process, environment, filesystem, download, and dynamic-code indicators.
5. If the evidence is unclear, do not install it into a profile containing secrets. Test a pinned version in an isolated environment or choose an alternative with clearer provenance.
6. Recheck the package after updates. An earlier review does not transfer automatically to a new version.

## PowerShell: Windows checks

### Prerequisites

These commands assume Windows PowerShell 5.1 or PowerShell 7, the VS Code CLI available as `code`, and optionally `Expand-Archive`, `Get-FileHash`, `rg` (ripgrep), and Node/npm. Replace every placeholder such as `publisher.extension`, `1.2.3`, and `C:\path\to\...`. Do not execute scripts or binaries while inspecting an archive.

### Identify installed extensions

```powershell
code --list-extensions --show-versions
$extensionId = 'publisher.extension'
$extensionRoots = @(
    (Join-Path $env:USERPROFILE '.vscode\extensions'),
    (Join-Path $env:USERPROFILE '.vscode-insiders\extensions')
)
$extensionRoots | Where-Object { Test-Path $_ } | ForEach-Object {
    Get-ChildItem -LiteralPath $_ -Directory -Filter "$extensionId-*"
}
```

`code --list-extensions --show-versions` reports what the selected VS Code CLI can see. The directory search covers common Windows locations only; a custom `--extensions-dir`, portable installation, remote host, or managed deployment may use another root. Treat the directory name as a hint and confirm its `package.json` identifier and version.

### Extract a VSIX without installing it

A `.vsix` is a ZIP-compatible package, but copying it to a `.zip` filename avoids archive-tool extension restrictions in some PowerShell versions.

```powershell
$vsixPath = (Resolve-Path 'C:\path\to\publisher.extension-1.2.3.vsix').Path
$inspectionDir = Join-Path $PWD 'extension-inspection'
$zipPath = Join-Path $PWD 'extension-inspection.zip'
Remove-Item -LiteralPath $inspectionDir -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $zipPath -Force -ErrorAction SilentlyContinue
Copy-Item -LiteralPath $vsixPath -Destination $zipPath
Expand-Archive -LiteralPath $zipPath -DestinationPath $inspectionDir -Force
Get-ChildItem -LiteralPath $inspectionDir -Force
Get-Content -LiteralPath (Join-Path $inspectionDir 'extension\package.json') -Raw
```

The package normally contains an `extension` directory. Confirm the actual layout before using a path below. `Expand-Archive` extracts files but does not make the extension available to VS Code. Delete the copy and extracted directory when finished if they contain sensitive material.

### Search source and packaged output with ripgrep

```powershell
$extensionDir = 'C:\path\to\extension-inspection\extension'
rg -n --hidden --glob '!node_modules/**' --glob '!*.map' -e 'fetch\(|axios\.|https?\.request\(|WebSocket|child_process|exec\(|spawn\(|fork\(|process\.env|workspace\.fs|fs\.(read|write|readdir)|https?://|eval\(|new Function|postinstall|preinstall' $extensionDir
rg -n --hidden --glob '!node_modules/**' 'publisher|name|version|activationEvents|contributes|main|browser|dependencies|scripts' (Join-Path $extensionDir 'package.json')
```

`-n` prints line numbers, `--hidden` includes hidden files, and the globs reduce noise from dependency trees and source maps. Search `node_modules` separately when dependency review is intentional. The patterns are indicators, not a malware detector: APIs may be wrapped, renamed, bundled, generated, or absent from a package that downloads code at runtime.

### Review dependencies without installing them

```powershell
Set-Location -LiteralPath $extensionDir
if (Test-Path -LiteralPath 'package-lock.json') {
    npm audit --package-lock-only
} else {
    Write-Warning 'No package-lock.json found; npm audit cannot provide a lockfile-grounded review here.'
}
Get-Content -LiteralPath 'package.json' -Raw
if (Test-Path -LiteralPath 'package-lock.json') {
    Get-Content -LiteralPath 'package-lock.json' -Raw
}
```

`npm audit --package-lock-only` is a network-backed advisory lookup against the lockfile; it does not prove that custom code is safe and should not be treated as a reason to run `npm install`. If the package has no lockfile, record that reproducibility and transitive-dependency provenance are weaker rather than inventing an audit result.

### Observe process-wide network activity

```powershell
$codeProcesses = Get-Process -Name Code,CodeSetup -ErrorAction SilentlyContinue
$codeProcesses | Select-Object Id, ProcessName, Path
$codeProcesses | ForEach-Object {
    Get-NetTCPConnection -OwningProcess $_.Id -ErrorAction SilentlyContinue |
        Select-Object OwningProcess, State, LocalAddress, LocalPort, RemoteAddress, RemotePort
}
```

This requires Windows networking cmdlets and may require elevation for some process details. It reports connections for matching VS Code processes, including VS Code itself and other extensions. It cannot attribute a connection to one extension. Capture a baseline, trigger one test action, and compare results; absence of a connection is not evidence that no network access exists.

## Bash: Linux and macOS checks

### Prerequisites

These examples assume Bash, `code` on `PATH`, and optionally `unzip`, `sha256sum` (or `shasum` on macOS), `rg`, `grep`, `npm`, and either `lsof` or `ss`. Quote paths because extension directories can contain spaces. Use a disposable copy of a package for extraction.

### Identify installed extensions

```bash
code --list-extensions --show-versions
EXTENSION_ID='publisher.extension'
for root in "$HOME/.vscode/extensions" "$HOME/.vscode-insiders/extensions"; do
  [ -d "$root" ] || continue
  find "$root" -maxdepth 1 -mindepth 1 -type d -name "${EXTENSION_ID}-*" -print
 done
```

The common per-user paths above do not cover custom extension directories, remote hosts, containers, or system-managed installations. Confirm the selected VS Code instance and inspect the matching manifest before drawing conclusions.

### Extract and hash a VSIX without installing it

```bash
VSIX_PATH='/path/to/publisher.extension-1.2.3.vsix'
INSPECTION_DIR="$PWD/extension-inspection"
rm -rf -- "$INSPECTION_DIR"
mkdir -p -- "$INSPECTION_DIR"
unzip -q "$VSIX_PATH" -d "$INSPECTION_DIR"
find "$INSPECTION_DIR" -maxdepth 3 -type f -print | sort
sha256sum -- "$VSIX_PATH" 2>/dev/null || shasum -a 256 -- "$VSIX_PATH"
sed -n '1,240p' "$INSPECTION_DIR/extension/package.json"
```

`unzip` reads the archive and writes only to the chosen inspection directory. Verify that the package actually has `extension/package.json`; some tools or packages may present a different layout. A hash is useful only when compared with a hash from a trusted, independent release channel.

### Search source and packaged output

```bash
EXTENSION_DIR='/path/to/extension-inspection/extension'
rg -n --hidden --glob '!node_modules/**' --glob '!*.map' \
  -e 'fetch\(' -e 'axios\.' -e 'https?\.request\(' -e 'WebSocket' \
  -e 'child_process' -e 'exec\(' -e 'spawn\(' -e 'fork\(' \
  -e 'process\.env' -e 'workspace\.fs' -e 'fs\.(read|write|readdir)' \
  -e 'https?://' -e 'eval\(' -e 'new Function' \
  -e 'postinstall' -e 'preinstall' -- "$EXTENSION_DIR"
rg -n 'publisher|name|version|activationEvents|contributes|main|browser|dependencies|scripts' \
  -- "$EXTENSION_DIR/package.json"
```

The first command searches common source and bundle indicators while excluding dependency directories and source maps. Run a second, deliberate search inside `node_modules` if dependencies are part of the review. `rg` is preferred for recursive, line-numbered searches; standard `grep` can be used for a single manifest:

```bash
grep -nE '"(publisher|name|version|activationEvents|contributes|main|browser|dependencies|scripts)"' \
  "$EXTENSION_DIR/package.json"
```

Neither search proves safety or detects behavior assembled dynamically. Read matching functions and trace inputs, destinations, and error handling.

### Review a lockfile and observe connections

```bash
cd -- "$EXTENSION_DIR"
if [ -f package-lock.json ]; then
  npm audit --package-lock-only
else
  printf '%s\n' 'No package-lock.json: no lockfile-grounded npm audit was run.' >&2
fi

VS_CODE_PIDS="$(pgrep -x code 2>/dev/null || true)"
for pid in $VS_CODE_PIDS; do
  lsof -nP -a -p "$pid" -i 2>/dev/null || true
 done
```

On systems without `lsof`, `ss -tpn` can show system-wide socket ownership when permitted, but attribution remains process-wide. `npm audit --package-lock-only` may contact the npm registry and reports known advisories, not bespoke malicious behavior. Do not run lifecycle scripts or install dependencies merely to inspect an extension.

## Safe handling of installed directories and packages

- Prefer downloading the exact `.vsix` for review and working on a copy. Do not double-click it, run files from it, or install it into your normal profile before inspection.
- Treat extracted files as untrusted input. Archive extraction can write files; use a new directory and inspect for unexpected paths. Keep the archive and extracted copy away from automatic build or watch directories.
- An installed extension directory is not automatically a source checkout. It commonly contains compiled JavaScript, assets, `package.json`, and dependencies, while source maps may point to source that is not included. Review both the installed directory and the linked public repository when available.
- Common per-user roots are `%USERPROFILE%\\.vscode\\extensions` and `%USERPROFILE%\\.vscode-insiders\\extensions` on Windows, and `$HOME/.vscode/extensions` and `$HOME/.vscode-insiders/extensions` on Linux/macOS. Custom extension roots, portable VS Code, remote extension hosts, and managed deployments change these locations.
- Record the package hash, identifier, version, and inspection date. A later update is a new artifact and needs a new review.
- Do not modify an installed directory in place. Copy it for analysis so VS Code's extension state is not changed accidentally.

## What these signals mean, and do not mean

| Signal | What it can tell you | What it cannot tell you |
| --- | --- | --- |
| Publisher/name/version | Helps identify the artifact and compare listing, repository, and package metadata | That the publisher or artifact is trustworthy |
| Last updated and release history | Maintenance and change context | That every release was reviewed or uncompromised |
| `activationEvents` | Which documented events can activate the extension | A permissions declaration, a complete behavior inventory, or proof that code is harmless |
| `contributes.commands` and other contribution points | VS Code UI/integration surfaces declared by the extension | Operating-system permissions or the behavior of every handler |
| `main`/`browser` | Likely runtime entry point | What all imported code will do at runtime |
| Source matches for network/process/filesystem APIs | Review leads and possible data-flow boundaries | Malicious intent; legitimate extensions may need these APIs |
| `npm audit` output | Known advisories for dependency versions represented by the lockfile | Safety of custom code, unpublished vulnerabilities, or clean provenance |
| Open repository and readable source | Makes independent review more feasible | That the packaged artifact exactly matches the reviewed source |
| Quiet network observation | No observed connection during one test | That the extension never connects or can attribute another process's traffic |

## Residual gaps

This review does not establish publisher identity, package-to-source reproducibility, build-pipeline integrity, absence of obfuscation, absence of zero-day vulnerabilities, or complete runtime behavior. Marketplace metadata can change, official documentation can evolve, and command availability varies with OS, shell, VS Code channel, remote development mode, and installed tool versions. Re-run the checks for the exact version under consideration and consult the current official VS Code documentation before adopting a high-impact extension.

## Sources

- [Reviewed article: How to Actually Check if a VS Code Extension is Safe Before You Install It](https://dev.to/ishaan_agrawal/how-to-actually-check-if-a-vs-code-extension-is-safe-before-you-install-it-3pal)
- [VS Code Extension Host](https://code.visualstudio.com/api/advanced-topics/extension-host)
- [VS Code Extension Manifest reference](https://code.visualstudio.com/api/references/extension-manifest)
- [VS Code Activation Events reference](https://code.visualstudio.com/api/references/activation-events)
- [VS Code Contribution Points reference](https://code.visualstudio.com/api/references/contribution-points)
- [VS Code Extension Marketplace documentation](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace)
- [VS Code Extension Runtime Security](https://code.visualstudio.com/api/advanced-topics/extension-host#security)
- [VS Code Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [npm audit documentation](https://docs.npmjs.com/cli/commands/npm-audit)
- [PowerShell `Expand-Archive` documentation](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.archive/expand-archive)
- [PowerShell `Get-NetTCPConnection` documentation](https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection)
- [ripgrep user guide](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md)
