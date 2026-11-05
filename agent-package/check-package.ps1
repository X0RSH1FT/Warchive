# Read-only check of the canonical APM package; never generates workspace customizations.
$ErrorActionPreference = 'Stop'
$package = $PSScriptRoot
$manifest = Join-Path $package 'apm.yml'

$groups = @(
    @{ Path = '.apm/agents'; Filter = '*.agent.md'; ManifestPattern = '^\.apm/agents/[^/]+\.agent\.md$' },
    @{ Path = '.apm/instructions'; Filter = '*.instructions.md'; ManifestPattern = '^\.apm/instructions/[^/]+\.instructions\.md$' }
)

$text = [IO.File]::ReadAllText($manifest)
$block = [regex]::Match($text, '\Aname: [^\r\n]+\r?\nversion: [^\r\n]+\r?\ndescription: [^\r\n]+\r?\ntype: package\r?\nincludes:\r?\n(?<items>(?:  - [^\r\n]+\r?\n|[ \t]*\r?\n)+)dependencies: \{\}(?:\r?\n)?\z')
if (-not $block.Success) { throw 'Missing or malformed manifest includes list or unexpected manifest structure.' }
$actual = @([regex]::Matches($block.Groups['items'].Value, '(?m)^  - (?<path>[^\r\n]+)\r?$') |
    ForEach-Object { $_.Groups['path'].Value })

$expected = @()
foreach ($group in $groups) {
    $target = Join-Path $package $group.Path
    if (-not (Test-Path -LiteralPath $target -PathType Container)) {
        throw "Package directory not found: $target"
    }
    $all = @(Get-ChildItem -LiteralPath $target -File)
    $files = @($all | Where-Object { $_.Name -like $group.Filter })
    $manifestPaths = @($actual | Where-Object { $_ -like "$($group.Path)/*" })
    $validManifestPaths = @($manifestPaths | Where-Object { $_ -match $group.ManifestPattern })
    if ($validManifestPaths.Count -ne $manifestPaths.Count) {
        throw "Manifest includes contain invalid paths under $($group.Path)."
    }
    if ($all.Count -ne $manifestPaths.Count -or $files.Count -ne $manifestPaths.Count) {
        throw "Manifest lists $($manifestPaths.Count) $($group.Filter) files for $target; found $($all.Count) files ($($files.Count) matching). Update apm.yml to match the package files."
    }
    $groupPaths = [string[]]@($files | ForEach-Object { "$($group.Path)/$($_.Name)" })
    [Array]::Sort($groupPaths, [StringComparer]::Ordinal)
    $expected += $groupPaths
}
if (@(Get-ChildItem -LiteralPath (Join-Path $package '.apm') -Directory).Count -ne 2) {
    throw 'Expected only agents and instructions under .apm.'
}
if ($actual.Count -ne $expected.Count) {
    throw 'Manifest includes must contain only package agent and instruction files.'
}
if (Test-Path -LiteralPath (Join-Path $package '../.github/instructions') -PathType Container) {
    $duplicates = @(Get-ChildItem -LiteralPath (Join-Path $package '../.github/instructions') -Recurse -File -Filter '*.instructions.md')
    if ($duplicates.Count) { throw "Found $($duplicates.Count) active workspace instruction duplicates." }
}

# Accept only the package's simple manifest shape (plain metadata, explicit path list,
# empty dependencies). Match the whole file so extra/duplicate includes, including
# entries after blank lines, cannot be silently ignored. No YAML module required.
if (($actual -join "`n") -cne ($expected -join "`n")) {
    throw 'Manifest includes must match the complete, sorted package agent and instruction sets.'
}
$agentCount = @($actual | Where-Object { $_ -like '.apm/agents/*' }).Count
$instructionCount = @($actual | Where-Object { $_ -like '.apm/instructions/*' }).Count
Write-Host "Verified $agentCount package agents, $instructionCount package instructions, no workspace duplicates, and exhaustive manifest includes."
