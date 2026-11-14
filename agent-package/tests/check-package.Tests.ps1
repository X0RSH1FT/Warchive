$script:sourcePackage = Split-Path -Parent $PSScriptRoot

function Invoke-WithTemporaryPackage {
    param([scriptblock]$Action)

    $temporaryRoot = Join-Path ([IO.Path]::GetTempPath()) ([Guid]::NewGuid().ToString('N'))
    $packageCopy = Join-Path $temporaryRoot 'agent-package'
    try {
        New-Item -ItemType Directory -Path $temporaryRoot -Force | Out-Null
        Copy-Item -LiteralPath $script:sourcePackage -Destination $packageCopy -Recurse
        & $Action $packageCopy $temporaryRoot
    }
    finally {
        if (Test-Path -LiteralPath $temporaryRoot) {
            Remove-Item -LiteralPath $temporaryRoot -Recurse -Force
        }
    }
}

function Test-PackageCheckerFailure {
    param([scriptblock]$Action)

    try {
        Invoke-WithTemporaryPackage -Action $Action
        return $false
    }
    catch {
        return $true
    }
}

Describe 'check-package.ps1 customization validation' {
    It 'fails when a required Markdown link is missing' {
        $failed = Test-PackageCheckerFailure {
            param($package, $root)
            $agent = Join-Path $package '.apm/agents/canvas-operator.agent.md'
            Add-Content -LiteralPath $agent -Value "`nSee [required reference](../skills/warchive-agent-knowledge/resources/missing.md)."
            & (Join-Path $package 'check-package.ps1')
        }
        $failed | Should Be $true
    }

    It 'allows a missing link explicitly marked optional' {
        $failed = Test-PackageCheckerFailure {
            param($package, $root)
            $agent = Join-Path $package '.apm/agents/canvas-operator.agent.md'
            Add-Content -LiteralPath $agent -Value "`nSee [optional reference](../../../docs/not-installed.md); use the fallback if that reference is unavailable."
            & (Join-Path $package 'check-package.ps1')
        }
        $failed | Should Be $false
    }

    It 'fails when a handoff names an unknown agent' {
        $failed = Test-PackageCheckerFailure {
            param($package, $root)
            $agent = Join-Path $package '.apm/agents/artistic-director.agent.md'
            $content = [IO.File]::ReadAllText($agent).Replace('agent: Roleplay-Character', 'agent: Missing-Agent')
            [IO.File]::WriteAllText($agent, $content)
            & (Join-Path $package 'check-package.ps1')
        }
        $failed | Should Be $true
    }

    It 'rejects a repo-valid link that is absent from the installed layout' {
        $failed = Test-PackageCheckerFailure {
            param($package, $root)
            $workspaceDoc = Join-Path $root 'docs/knowledge/installed-only.md'
            New-Item -ItemType Directory -Path (Split-Path -Parent $workspaceDoc) -Force | Out-Null
            Set-Content -LiteralPath $workspaceDoc -Value '# Workspace-only reference'
            $agent = Join-Path $package '.apm/agents/canvas-operator.agent.md'
            Add-Content -LiteralPath $agent -Value "`nSee [workspace reference](../../../docs/knowledge/installed-only.md)."
            & (Join-Path $package 'check-package.ps1')
        }
        $failed | Should Be $true
    }
}