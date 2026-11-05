<#
.SYNOPSIS
Copy selected customization Markdown trees into a target repository.

.DESCRIPTION
Copies and overwrites all Markdown (.md) files under the given source path for the
following repo-relative directories when enabled: .github/agents, .github/prompts,
and agent-package/.apm/instructions. Instructions are copied into
.github/instructions in the target; other relative paths are preserved. Target
directories are created as needed.

.PARAMETER SourcePath
Path to the source repository root (positional 0).

.PARAMETER TargetPath
Path to the target repository root where files will be copied (positional 1).

.PARAMETER CopyAgents
Boolean. When true copy files under .github/agents. Defaults to $true.

.PARAMETER CopyPrompts
Boolean. When true copy files under .github/prompts. Defaults to $true.

.PARAMETER CopyInstructions
Boolean. When true copy canonical files under agent-package/.apm/instructions
into the target .github/instructions. Defaults to $true.

.EXAMPLE
  .\scripts\powershell\Copy-GithubMdTrees.ps1 . .\dest
  Copies selected Markdown trees into ./dest (instructions from the APM package).

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
    [bool]$CopyPrompts = $true,

    [Parameter()]
    [bool]$CopyInstructions = $true
)

$ErrorActionPreference = 'Stop'

function Resolve-AbsolutePath {
    param([string]$Path)
    try {
        return (Resolve-Path -LiteralPath $Path -ErrorAction Stop).ProviderPath
    } catch {
        # If path doesn't exist, return the expanded path (does not validate existence)
        return (Join-Path (Get-Location).ProviderPath $Path)
    }
}

function Copy-MdTree {
    param(
        [string]$SubRelativePath,
        [bool]$Enabled,
        [string]$DestinationRelativePath = $SubRelativePath
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
    $filter = if ($SubRelativePath -eq 'agent-package/.apm/instructions') { '*.instructions.md' } else { '*.md' }
    $files = Get-ChildItem -LiteralPath $sourceDirFull -Recurse -File -Filter $filter -ErrorAction SilentlyContinue

    if (-not $files) {
        Write-Verbose "No .md files found under $sourceDirFull"
        return
    }

    foreach ($file in $files) {
        # Use .NET Path.GetRelativePath to compute a robust relative path
        $fileFull = $file.FullName
        $relative = [System.IO.Path]::GetRelativePath($sourceDirFull, $fileFull).TrimStart('\','/')
        $dest = Join-Path $targetRoot (Join-Path $DestinationRelativePath $relative)
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
    # validate source exists
    if (-not (Test-Path -LiteralPath $SourcePath)) {
        throw "Source path does not exist: $SourcePath"
    }
    if ($CopyInstructions -and
        [IO.Path]::GetFullPath((Resolve-AbsolutePath -Path $SourcePath)).TrimEnd('\','/') -eq
        [IO.Path]::GetFullPath((Resolve-AbsolutePath -Path $TargetPath)).TrimEnd('\','/')) {
        throw 'Source and target must differ when copying package instructions; do not generate workspace duplicates.'
    }

    # Ensure target root exists (create if needed)
    if (-not (Test-Path -LiteralPath $TargetPath)) {
        if ($PSCmdlet.ShouldProcess($TargetPath, 'Create target root directory')) {
            New-Item -ItemType Directory -Path $TargetPath -Force | Out-Null
        }
    }

    Copy-MdTree ".github/agents" $CopyAgents
    Copy-MdTree ".github/prompts" $CopyPrompts
    Copy-MdTree "agent-package/.apm/instructions" $CopyInstructions ".github/instructions"

    Write-Output 'Operation completed.'
} catch {
    Write-Error "Error: $($_.Exception.Message)"
    exit 1
}
