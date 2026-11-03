# Read-only check of the canonical APM package; never generates workspace customizations.
$ErrorActionPreference = 'Stop'
$package = $PSScriptRoot
$manifest = Join-Path $package 'apm.yml'

$expected = @()
foreach ($group in @(
    @{ Path = '.apm/agents'; Filter = '*.agent.md'; Count = 35 },
    @{ Path = '.apm/instructions'; Filter = '*.instructions.md'; Count = 15 }
)) {
    $target = Join-Path $package $group.Path
    if (-not (Test-Path -LiteralPath $target -PathType Container)) {
        throw "Package directory not found: $target"
    }
    $all = @(Get-ChildItem -LiteralPath $target -File)
    $files = @($all | Where-Object { $_.Name -like $group.Filter } | Sort-Object Name)
    if ($all.Count -ne $group.Count -or $files.Count -ne $group.Count) {
        throw "Expected exactly $($group.Count) $($group.Filter) files in $target; found $($all.Count) files ($($files.Count) matching)."
    }
    $expected += @($files | ForEach-Object { "$($group.Path)/$($_.Name)" })
}
if (@(Get-ChildItem -LiteralPath (Join-Path $package '.apm') -Directory).Count -ne 2) {
    throw 'Expected only agents and instructions under .apm.'
}
if (Test-Path -LiteralPath (Join-Path $package '../.github/instructions') -PathType Container) {
    $duplicates = @(Get-ChildItem -LiteralPath (Join-Path $package '../.github/instructions') -Recurse -File -Filter '*.instructions.md')
    if ($duplicates.Count) { throw "Found $($duplicates.Count) active workspace instruction duplicates." }
}

# Accept only the package's simple manifest shape (plain metadata, explicit path list,
# empty dependencies). Match the whole file so extra/duplicate includes, including
# entries after blank lines, cannot be silently ignored. No YAML module required.
$text = [IO.File]::ReadAllText($manifest)
$block = [regex]::Match($text, '\Aname: [^\r\n]+\r?\nversion: [^\r\n]+\r?\ndescription: [^\r\n]+\r?\ntype: package\r?\nincludes:\r?\n(?<items>(?:  - [^\r\n]+\r?\n|[ \t]*\r?\n)+)dependencies: \{\}(?:\r?\n)?\z')
if (-not $block.Success) { throw 'Missing or malformed manifest includes list or unexpected manifest structure.' }
$actual = @([regex]::Matches($block.Groups['items'].Value, '(?m)^  - (?<path>[^\r\n]+)\r?$') |
    ForEach-Object { $_.Groups['path'].Value })
if (($actual -join "`n") -cne ($expected -join "`n")) {
    throw 'Manifest includes must match the complete, sorted package agent and instruction sets.'
}
Write-Host 'Verified 35 package agents, 15 package instructions, no workspace duplicates, and exhaustive manifest includes.'
