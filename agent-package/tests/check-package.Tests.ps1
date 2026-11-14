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

    It 'fails when a bundled resource has a broken backlink to an agent' {
        $failed = Test-PackageCheckerFailure {
            param($package, $root)
            $resource = Join-Path $package '.apm/skills/warchive-agent-knowledge/resources/roleplay-character-packet-template.md'
            $content = [IO.File]::ReadAllText($resource).Replace('../../../agents/character-generator.agent.md', '../../../agents/missing-agent.agent.md')
            [IO.File]::WriteAllText($resource, $content)
            & (Join-Path $package 'check-package.ps1')
        }
        $failed | Should Be $true
    }

    It 'checks angle-bracket local destinations with titles in skill resources' {
        $failed = Test-PackageCheckerFailure {
            param($package, $root)
            $resource = Join-Path $package '.apm/skills/warchive-agent-knowledge/resources/roleplay-character-packet-template.md'
            Add-Content -LiteralPath $resource -Value "`nSee [required reference](<../../../agents/missing-agent.agent.md> \"required title\")."
            & (Join-Path $package 'check-package.ps1')
        }
        $failed | Should Be $true
    }

    It 'does not let optional wording hide a missing packaged dependency' {
        $failed = Test-PackageCheckerFailure {
            param($package, $root)
            $resource = Join-Path $package '.apm/skills/warchive-agent-knowledge/resources/roleplay-character-packet-template.md'
            Add-Content -LiteralPath $resource -Value "`nSee [optional packaged agent](../../../agents/missing-agent.agent.md) when available."
            & (Join-Path $package 'check-package.ps1')
        }
        $failed | Should Be $true
    }

    It 'installs agents and skills together with required references resolving inside the isolated layout' {
        Invoke-WithTemporaryPackage {
            param($package, $root)
            $installRoot = Join-Path $root 'isolated/copilot'
            $agentsDestination = Join-Path $installRoot 'agents'
            $skillsDestination = Join-Path $installRoot 'skills'
            & (Join-Path $package 'install-user-agents.ps1') -Destination $agentsDestination
            & (Join-Path $package 'install-user-skills.ps1') -Destination $skillsDestination

            $skillRoot = Join-Path $skillsDestination 'warchive-agent-knowledge'
            $skillFile = Join-Path $skillRoot 'SKILL.md'
            $packetResource = Join-Path $skillRoot 'resources/roleplay-character-packet-template.md'
            $securityResource = Join-Path $skillRoot 'resources/codebase-security-and-malware-review.md'
            $ollamaResource = Join-Path $skillRoot 'resources/ollama-troubleshooting-windows.md'
            foreach ($path in @($skillFile, $packetResource, $securityResource, $ollamaResource)) {
                Test-Path -LiteralPath $path -PathType Leaf | Should Be $true
            }

            $characterAgent = [IO.Path]::GetFullPath((Join-Path (Split-Path -Parent $packetResource) '../../../agents/character-generator.agent.md'))
            $directorAgent = [IO.Path]::GetFullPath((Join-Path (Split-Path -Parent $packetResource) '../../../agents/artistic-director.agent.md'))
            Test-Path -LiteralPath $characterAgent -PathType Leaf | Should Be $true
            Test-Path -LiteralPath $directorAgent -PathType Leaf | Should Be $true
            [IO.File]::ReadAllText($packetResource) | Should Match 'portable field and handoff reference'
            [IO.File]::ReadAllText($characterAgent) | Should Match '# Character-Generator'
            [IO.File]::ReadAllText($directorAgent) | Should Match '# Artistic-Director'
            [IO.File]::ReadAllText($securityResource) | Should Match 'Codebase Security and Malware Review'
            [IO.File]::ReadAllText($ollamaResource) | Should Match 'Ollama Troubleshooting Reference For Windows Local Setups'
        }
    }
}