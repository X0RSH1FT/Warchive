<#
.SYNOPSIS
Copy selected files under repository .opencode trees preserving relative paths.

.DESCRIPTION
Copies and overwrites all files under the given source path for the
following repo-relative directories when enabled: .opencode/agents, .opencode/commands.
Relative paths are preserved under the target path. Target directories are created as needed.

.PARAMETER SourcePath
Path to the source repository root (positional 0).

.PARAMETER TargetPath
Path to the target repository root where files will be copied (positional 1).

.PARAMETER CopyAgents
Boolean. When true copy files under .opencode/agents. Defaults to $true.

.PARAMETER CopyCommands
Boolean. When true copy files under .opencode/commands. Defaults to $true.

.EXAMPLE
  .\scripts\Copy-OpencodeTrees.ps1 . .\dest
  Copies all files from the two .opencode trees to ./dest preserving paths.

.NOTES
Author: GitHub Copilot (implementation agent)
#>
[CmdletBinding(SupportsShouldProcess=$true, ConfirmImpact='Low')]
param(
    [Parameter(Position=0, Mandatory=$true, ValueFromPipeline=$false)]
    [string]$SourcePath,

    [Parameter(Position=1, Mandatory=$true, ValueFromPipeline=$false)]
    [string]$TargetPath,

    [Parameter()]
    [bool]$CopyAgents = $true,

    [Parameter()]
    [bool]$CopyCommands = $true
)

$ErrorActionPreference = 'Stop'

function Resolve-AbsolutePath {
    param([string]$Path)
    try {
        return (Resolve-Path -LiteralPath $Path -ErrorAction Stop).ProviderPath
    } catch {
        return (Join-Path (Get-Location).ProviderPath $Path)
    }
}

function Copy-Tree {
    param(
        [string]$SubRelativePath,
        [bool]$Enabled
    )

    if (-not $Enabled) {
        Write-Verbose "Skipping $SubRelativePath (disabled)"
        return
    }

    $sourceRoot = Resolve-AbsolutePath -Path $SourcePath
    $targetRoot = Resolve-AbsolutePath -Path $TargetPath

    $sourceDir = Join-Path $sourceRoot $SubRelativePath
    if (-not (Test-Path -LiteralPath $sourceDir)) {
        Write-Verbose "Source directory not found: $sourceDir"
        return
    }

    $sourceDirFull = (Get-Item -LiteralPath $sourceDir -ErrorAction Stop).FullName.TrimEnd('\','/')
    $files = Get-ChildItem -LiteralPath $sourceDirFull -Recurse -File -Filter '*.md' -ErrorAction SilentlyContinue

    if (-not $files) {
        Write-Verbose "No files found under $sourceDirFull"
        return
    }

    foreach ($file in $files) {
        $fileFull = $file.FullName
        # Compute relative path robustly without requiring GetRelativePath (older PowerShell/.NET)
        if ($fileFull.StartsWith($sourceDirFull, [System.StringComparison]::OrdinalIgnoreCase)) {
            $relative = $fileFull.Substring($sourceDirFull.Length).TrimStart('\','/')
        } else {
            try {
                $relative = [System.IO.Path]::GetRelativePath($sourceDirFull, $fileFull).TrimStart('\','/')
            } catch {
                # Fallback to filename only if relative path cannot be determined
                $relative = $file.Name
            }
        }
        $dest = Join-Path $targetRoot (Join-Path $SubRelativePath $relative)
        $destDir = Split-Path -Path $dest -Parent

        if ($PSCmdlet.ShouldProcess($file.FullName, "Copy to $dest")) {
            try {
                if (-not (Test-Path -LiteralPath $destDir)) {
                    if ($PSCmdlet.ShouldProcess($destDir, 'Create directory')) {
                        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
                    }
                }

                Copy-Item -LiteralPath $file.FullName -Destination $dest -Force -ErrorAction Stop
                Write-Verbose "Copied: $($file.FullName) -> $dest"
            } catch {
                Write-Warning "Failed to copy $($file.FullName): $($_.Exception.Message)"
            }
        }
    }
}

try {
    if (-not (Test-Path -LiteralPath $SourcePath)) {
        throw "Source path does not exist: $SourcePath"
    }

    if (-not (Test-Path -LiteralPath $TargetPath)) {
        if ($PSCmdlet.ShouldProcess($TargetPath, 'Create target root directory')) {
            New-Item -ItemType Directory -Path $TargetPath -Force | Out-Null
        }
    }

    Copy-Tree ".opencode/agents" $CopyAgents
    Copy-Tree ".opencode/commands" $CopyCommands

    Write-Output 'Operation completed.'
} catch {
    Write-Error "Error: $($_.Exception.Message)"
    exit 1
}
