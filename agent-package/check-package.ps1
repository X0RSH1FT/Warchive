# Read-only check of the canonical APM agent package; never generates workspace agents.
$ErrorActionPreference = 'Stop'
$package = $PSScriptRoot
$target = Join-Path $package '.apm/agents'
$manifest = Join-Path $package 'apm.yml'

if (-not (Test-Path -LiteralPath $target -PathType Container)) {
    throw "Package agents not found: $target"
}
$files = @(Get-ChildItem -LiteralPath $target -File -Filter '*.agent.md' | Sort-Object Name)
if ($files.Count -ne 35) { throw "Expected 35 package agents; found $($files.Count)." }
$names = @($files | ForEach-Object { $_.Name })
$expected = @($names | ForEach-Object { ".apm/agents/$_" })

# Restrict manifest parsing to the deliberately simple, explicit includes block.
# Reject unexpected structure instead of silently checking the wrong list.
$text = [IO.File]::ReadAllText($manifest)
$block = [regex]::Match($text, '(?m)^includes:\r?\n(?<items>(?:  - [^\r\n]+\r?\n)*)')
if (-not $block.Success) { throw 'Missing or malformed manifest includes block.' }
$actual = @([regex]::Matches($block.Groups['items'].Value, '(?m)^  - (?<path>[^\r\n]+)\r?$') |
    ForEach-Object { $_.Groups['path'].Value })
if (($actual -join "`n") -cne ($expected -join "`n")) {
    throw 'Manifest includes must match the complete, sorted package agent set.'
}
Write-Host "Verified $($files.Count) package agents and exhaustive manifest includes."
