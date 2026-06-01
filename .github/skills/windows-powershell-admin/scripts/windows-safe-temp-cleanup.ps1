param(
    [Parameter(Mandatory = $true)]
    [string]$TargetPath,
    [switch]$WhatIf
)

if (-not (Test-Path -Path $TargetPath)) {
    throw "Target path not found: $TargetPath"
}

$resolved = (Resolve-Path -Path $TargetPath).Path

if ($resolved -notmatch '(?i)(^|\\)temp(\\|$)') {
    throw "Refusing cleanup: target does not look like a temp path. Target: $resolved"
}

$before = (Get-ChildItem -Path $resolved -Recurse -Force -ErrorAction SilentlyContinue |
    Where-Object { -not $_.PSIsContainer } |
    Measure-Object -Property Length -Sum).Sum

if ($WhatIf) {
    Write-Output "WhatIf enabled. No files deleted."
} else {
    Get-ChildItem -Path $resolved -Force -ErrorAction SilentlyContinue |
        Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
}

$after = (Get-ChildItem -Path $resolved -Recurse -Force -ErrorAction SilentlyContinue |
    Where-Object { -not $_.PSIsContainer } |
    Measure-Object -Property Length -Sum).Sum

[PSCustomObject]@{
    TargetPath = $resolved
    BeforeBytes = $before
    AfterBytes = $after
    FreedBytes = ($before - $after)
    WhatIf = [bool]$WhatIf
}
