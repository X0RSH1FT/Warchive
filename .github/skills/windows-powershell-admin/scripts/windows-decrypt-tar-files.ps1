param(
    [Parameter(Mandatory = $true)]
    [string]$SourcePath,
    [Parameter(Mandatory = $true)]
    [string]$TargetPath,
    [string]$Passphrase,
    [switch]$Overwrite,
    [switch]$WhatIf
)

if (-not (Test-Path -Path $SourcePath -PathType Container)) {
    throw "Source path not found or not a directory: $SourcePath"
}

$openssl = Get-Command openssl -ErrorAction SilentlyContinue
if (-not $openssl) {
    throw "OpenSSL is not available in PATH. Install OpenSSL and retry."
}

if (-not (Test-Path -Path $TargetPath)) {
    New-Item -Path $TargetPath -ItemType Directory -Force | Out-Null
}

if (-not $Passphrase) {
    $Passphrase = $env:OPENSSL_PASSPHRASE
}

if (-not $Passphrase) {
    throw "Provide -Passphrase or set OPENSSL_PASSPHRASE environment variable."
}

$resolvedSource = (Resolve-Path -Path $SourcePath).Path
$resolvedTarget = (Resolve-Path -Path $TargetPath).Path

$encFiles = Get-ChildItem -Path $resolvedSource -File -Filter *.enc -ErrorAction Stop
$total = $encFiles.Count
$success = 0
$failed = 0

$results = @()

for ($index = 0; $index -lt $total; $index++) {
    $file = $encFiles[$index]
    $targetName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $targetFile = Join-Path -Path $resolvedTarget -ChildPath $targetName

    Write-Progress -Id 3 -Activity "Decrypting encrypted archives" -Status ("{0} ({1}/{2})" -f $file.Name, ($index + 1), $total) -PercentComplete ((($index + 1) / [Math]::Max($total, 1)) * 100)

    if ((Test-Path -Path $targetFile) -and -not $Overwrite) {
        Write-Warning "Decrypted output exists, skipping without -Overwrite: $targetFile"
        $failed++
        $results += [PSCustomObject]@{
            Source = $file.FullName
            Output = $targetFile
            SourceBytes = $file.Length
            OutputBytes = 0
            Status = "SkippedExists"
        }
        continue
    }

    if ($WhatIf) {
        Write-Output "WhatIf: would decrypt $($file.FullName) to $targetFile"
        $success++
        $results += [PSCustomObject]@{
            Source = $file.FullName
            Output = $targetFile
            SourceBytes = $file.Length
            OutputBytes = 0
            Status = "WhatIf"
        }
        continue
    }

    try {
        if (Test-Path -Path $targetFile) {
            Remove-Item -Path $targetFile -Force
        }

        & $openssl.Source enc -d -aes-256-cbc -pbkdf2 -in $file.FullName -out $targetFile -pass ("pass:{0}" -f $Passphrase)
        if ($LASTEXITCODE -ne 0) {
            throw "OpenSSL exited with code $LASTEXITCODE"
        }

        $outputBytes = if (Test-Path -Path $targetFile) { (Get-Item -Path $targetFile).Length } else { 0 }
        $success++
        $results += [PSCustomObject]@{
            Source = $file.FullName
            Output = $targetFile
            SourceBytes = $file.Length
            OutputBytes = [int64]$outputBytes
            Status = "Success"
        }
    } catch {
        if (Test-Path -Path $targetFile) {
            Remove-Item -Path $targetFile -Force -ErrorAction SilentlyContinue
        }

        $failed++
        Write-Warning ("Failed to decrypt '{0}': {1}" -f $file.FullName, $_.Exception.Message)
        $results += [PSCustomObject]@{
            Source = $file.FullName
            Output = $targetFile
            SourceBytes = $file.Length
            OutputBytes = 0
            Status = "Failed"
        }
    }
}

Write-Progress -Id 3 -Activity "Decrypting encrypted archives" -Completed

$summary = [PSCustomObject]@{
    SourcePath = $resolvedSource
    TargetPath = $resolvedTarget
    TotalEncryptedFiles = $total
    SuccessCount = $success
    FailureCount = $failed
    WhatIf = [bool]$WhatIf
    TotalSourceBytes = (($results | Measure-Object -Property SourceBytes -Sum).Sum ?? 0)
    TotalOutputBytes = (($results | Measure-Object -Property OutputBytes -Sum).Sum ?? 0)
}

$summary
$results | Format-Table -AutoSize
