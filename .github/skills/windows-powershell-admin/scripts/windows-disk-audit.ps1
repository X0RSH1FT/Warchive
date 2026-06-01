param(
    [Parameter(Mandatory = $true)]
    [string]$TargetPath,
    [int]$Top = 20
)

if (-not (Test-Path -Path $TargetPath)) {
    throw "Target path not found: $TargetPath"
}

$resolved = Resolve-Path -Path $TargetPath
$items = Get-ChildItem -Path $resolved -Recurse -Force -ErrorAction SilentlyContinue |
    Where-Object { -not $_.PSIsContainer } |
    Sort-Object Length -Descending |
    Select-Object -First $Top FullName, Length, LastWriteTime

$totalBytes = ($items | Measure-Object -Property Length -Sum).Sum

[PSCustomObject]@{
    TargetPath = $resolved.Path
    TopFiles = $Top
    ApproxTopFileBytes = $totalBytes
}

$items | Format-Table -AutoSize
