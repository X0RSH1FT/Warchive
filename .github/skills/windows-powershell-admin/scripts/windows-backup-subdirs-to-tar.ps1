param(
    [Parameter(Mandatory = $true)]
    [string]$SourcePath,
    [Parameter(Mandatory = $true)]
    [string]$TargetPath,
    [switch]$Overwrite,
    [switch]$WhatIf
)

if (-not (Test-Path -Path $SourcePath -PathType Container)) {
    throw "Source path not found or not a directory: $SourcePath"
}

if (-not (Get-Command tar -ErrorAction SilentlyContinue)) {
    throw "tar was not found in PATH. Install bsdtar/Windows tar support and retry."
}

if (-not (Test-Path -Path $TargetPath)) {
    New-Item -Path $TargetPath -ItemType Directory -Force | Out-Null
}

$resolvedSource = (Resolve-Path -Path $SourcePath).Path
$resolvedTarget = (Resolve-Path -Path $TargetPath).Path

$directories = Get-ChildItem -Path $resolvedSource -Directory -Force -ErrorAction Stop
$total = $directories.Count
$success = 0
$failed = 0

$results = @()

for ($index = 0; $index -lt $total; $index++) {
    $dir = $directories[$index]
    $archivePath = Join-Path -Path $resolvedTarget -ChildPath ("{0}.tar" -f $dir.Name)

    Write-Progress -Id 1 -Activity "Creating tar archives" -Status ("{0} ({1}/{2})" -f $dir.Name, ($index + 1), $total) -PercentComplete ((($index + 1) / [Math]::Max($total, 1)) * 100)

    if ((Test-Path -Path $archivePath) -and -not $Overwrite) {
        Write-Warning "Archive exists, skipping without -Overwrite: $archivePath"
        $failed++
        $results += [PSCustomObject]@{
            Name = $dir.Name
            SourceBytes = 0
            ArchiveBytes = 0
            Status = "SkippedExists"
            ArchivePath = $archivePath
        }
        continue
    }

    $sourceBytes = (Get-ChildItem -Path $dir.FullName -Recurse -Force -ErrorAction SilentlyContinue |
        Where-Object { -not $_.PSIsContainer } |
        Measure-Object -Property Length -Sum).Sum

    if ($WhatIf) {
        Write-Output "WhatIf: would archive $($dir.FullName) to $archivePath"
        $success++
        $results += [PSCustomObject]@{
            Name = $dir.Name
            SourceBytes = [int64]($sourceBytes ?? 0)
            ArchiveBytes = 0
            Status = "WhatIf"
            ArchivePath = $archivePath
        }
        continue
    }

    try {
        if (Test-Path -Path $archivePath) {
            Remove-Item -Path $archivePath -Force
        }

        Push-Location -Path $resolvedSource
        try {
            & tar -cf $archivePath -- $dir.Name
            if ($LASTEXITCODE -ne 0) {
                throw "tar exited with code $LASTEXITCODE"
            }
        } finally {
            Pop-Location
        }

        $archiveBytes = if (Test-Path -Path $archivePath) { (Get-Item -Path $archivePath).Length } else { 0 }
        $success++
        $results += [PSCustomObject]@{
            Name = $dir.Name
            SourceBytes = [int64]($sourceBytes ?? 0)
            ArchiveBytes = [int64]$archiveBytes
            Status = "Success"
            ArchivePath = $archivePath
        }
    } catch {
        $failed++
        Write-Warning ("Failed to archive '{0}': {1}" -f $dir.FullName, $_.Exception.Message)
        $results += [PSCustomObject]@{
            Name = $dir.Name
            SourceBytes = [int64]($sourceBytes ?? 0)
            ArchiveBytes = 0
            Status = "Failed"
            ArchivePath = $archivePath
        }
    }
}

Write-Progress -Id 1 -Activity "Creating tar archives" -Completed

$summary = [PSCustomObject]@{
    SourcePath = $resolvedSource
    TargetPath = $resolvedTarget
    TotalDirectories = $total
    SuccessCount = $success
    FailureCount = $failed
    WhatIf = [bool]$WhatIf
    TotalSourceBytes = (($results | Measure-Object -Property SourceBytes -Sum).Sum ?? 0)
    TotalArchiveBytes = (($results | Measure-Object -Property ArchiveBytes -Sum).Sum ?? 0)
}

$summary
$results | Format-Table -AutoSize
