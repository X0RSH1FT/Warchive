[CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = 'Medium')]
param(
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [string]$Destination = (Join-Path $HOME '.copilot\agents')
)

$ErrorActionPreference = 'Stop'
$sourceDirectory = Join-Path $PSScriptRoot '.apm\agents'

if (-not (Test-Path -LiteralPath $sourceDirectory -PathType Container)) {
    throw "Agent source directory not found: $sourceDirectory"
}

$agentFiles = @(Get-ChildItem -LiteralPath $sourceDirectory -File -Filter '*.agent.md' | Sort-Object Name)
if ($agentFiles.Count -eq 0) {
    throw "No .agent.md files found in: $sourceDirectory"
}

$destinationPath = [System.IO.Path]::GetFullPath($Destination)
if (Test-Path -LiteralPath $destinationPath) {
    if (-not (Test-Path -LiteralPath $destinationPath -PathType Container)) {
        throw "Destination exists and is not a directory: $destinationPath"
    }
}
elseif ($PSCmdlet.ShouldProcess($destinationPath, 'Create user agents directory')) {
    New-Item -ItemType Directory -Path $destinationPath -Force | Out-Null
}

foreach ($agentFile in $agentFiles) {
    $targetPath = Join-Path $destinationPath $agentFile.Name
    if ($PSCmdlet.ShouldProcess($targetPath, "Install or overwrite $($agentFile.Name)")) {
        Copy-Item -LiteralPath $agentFile.FullName -Destination $targetPath -Force
        Write-Host "Installed $($agentFile.Name)"
    }
}

Write-Host "Processed $($agentFiles.Count) agent file(s) for $destinationPath."
