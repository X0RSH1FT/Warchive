[CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = 'Medium')]
param(
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [string]$Destination = (Join-Path $HOME '.copilot\skills')
)

$ErrorActionPreference = 'Stop'
$sourceDirectory = Join-Path $PSScriptRoot '.apm\skills'

if (-not (Test-Path -LiteralPath $sourceDirectory -PathType Container)) {
    throw "Skill source directory not found: $sourceDirectory"
}

$skillDirectories = @(Get-ChildItem -LiteralPath $sourceDirectory -Directory | Sort-Object Name)
if ($skillDirectories.Count -eq 0) {
    throw "No skill directories found in: $sourceDirectory"
}

$destinationPath = [System.IO.Path]::GetFullPath($Destination)
if (Test-Path -LiteralPath $destinationPath -PathType Leaf) {
    throw "Destination exists and is not a directory: $destinationPath"
}

foreach ($skillDirectory in $skillDirectories) {
    $skillFile = Join-Path $skillDirectory.FullName 'SKILL.md'
    if (-not (Test-Path -LiteralPath $skillFile -PathType Leaf)) {
        throw "Skill definition not found: $skillFile"
    }

    $skillDestination = Join-Path $destinationPath $skillDirectory.Name
    if ($PSCmdlet.ShouldProcess($skillDestination, "Install or overwrite skill '$($skillDirectory.Name)'")) {
        if (-not (Test-Path -LiteralPath $destinationPath -PathType Container)) {
            New-Item -ItemType Directory -Path $destinationPath -Force | Out-Null
        }
        if (-not (Test-Path -LiteralPath $skillDestination -PathType Container)) {
            New-Item -ItemType Directory -Path $skillDestination -Force | Out-Null
        }

        foreach ($item in Get-ChildItem -LiteralPath $skillDirectory.FullName -Force) {
            Copy-Item -LiteralPath $item.FullName -Destination $skillDestination -Recurse -Force
        }
        Write-Host "Installed skill $($skillDirectory.Name)"
    }
}

Write-Host "Processed $($skillDirectories.Count) skill(s) for $destinationPath."
