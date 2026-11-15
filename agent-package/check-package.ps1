# Read-only check of the canonical APM package; never generates workspace customizations.
$ErrorActionPreference = 'Stop'
$package = $PSScriptRoot
$manifest = Join-Path $package 'apm.yml'

$groups = @(
    @{ Path = '.apm/agents'; Filter = '*.agent.md'; ManifestPattern = '^\.apm/agents/[^/]+\.agent\.md$'; Recurse = $false },
    @{ Path = '.apm/instructions'; Filter = '*.instructions.md'; ManifestPattern = '^\.apm/instructions/[^/]+\.instructions\.md$'; Recurse = $false },
    @{ Path = '.apm/skills'; Filter = '*'; ManifestPattern = '^\.apm/skills/[^/]+/.+$'; Recurse = $true }
)

function Get-FrontMatter {
    param([string]$Content)

    $match = [regex]::Match($Content, '\A---\r?\n(?<frontmatter>.*?)\r?\n---(?:\r?\n|$)', [Text.RegularExpressions.RegexOptions]::Singleline)
    if (-not $match.Success) { return $null }
    return $match.Groups['frontmatter'].Value
}

function Get-MarkdownBodyLines {
    param([string]$Path)

    $insideFence = $false
    $fenceMarker = ''
    $lineNumber = 0
    foreach ($line in [IO.File]::ReadAllLines($Path)) {
        $lineNumber++
        if ($line -match '^\s*(`{3,}|~{3,})') {
            $marker = $Matches[1].Substring(0, 3)
            if (-not $insideFence) {
                $insideFence = $true
                $fenceMarker = $marker
            }
            elseif ($marker[0] -eq $fenceMarker[0]) {
                $insideFence = $false
                $fenceMarker = ''
            }
            continue
        }
        if (-not $insideFence) {
            [pscustomobject]@{ Number = $lineNumber; Text = $line }
        }
    }
}

function Get-MarkdownLinks {
    param([string]$Path)

    foreach ($line in Get-MarkdownBodyLines -Path $Path) {
        $inlineCodeSpans = [regex]::Matches($line.Text, '(?<!`)(?<!\\)(?:\\\\)*(?<delimiter>`+).*?(?<!`)(?<!\\)(?:\\\\)*\k<delimiter>(?!`)', [Text.RegularExpressions.RegexOptions]::Singleline)
        foreach ($match in [regex]::Matches($line.Text, '\[[^\]]+\]\(\s*(?<target><[^>]+>|[^)\s]+)(?:\s+[^)]*)?\)')) {
            $insideInlineCode = $false
            foreach ($span in $inlineCodeSpans) {
                if ($span.Index -le $match.Index -and $match.Index -lt ($span.Index + $span.Length)) {
                    $insideInlineCode = $true
                    break
                }
            }
            if ($insideInlineCode) { continue }

            [pscustomobject]@{
                Target = $match.Groups['target'].Value.Trim('<', '>')
                Line = $line.Number
                Optional = ($line.Text -match '(?i)\b(?:when present|if unavailable|if (?:that reference )?is unavailable|when available|if present|optional)\b')
            }
        }
    }
}

function Get-LocalLinkPath {
    param(
        [string]$SourcePath,
        [string]$Target
    )

    $localTarget = ($Target -split '[?#]', 2)[0]
    if ([string]::IsNullOrWhiteSpace($localTarget)) { return $null }
    $localTarget = [Uri]::UnescapeDataString($localTarget)
    return [IO.Path]::GetFullPath((Join-Path (Split-Path -Parent $SourcePath) $localTarget))
}

function ConvertTo-PackagedInstallPath {
    param(
        [string]$VirtualPath,
        [string]$InstalledAgentsRoot,
        [string]$InstalledSkillsRoot,
        [string]$Package
    )

    foreach ($root in @(
        @{ Installed = $InstalledAgentsRoot; Packaged = (Join-Path $Package '.apm/agents') },
        @{ Installed = $InstalledSkillsRoot; Packaged = (Join-Path $Package '.apm/skills') }
    )) {
        $prefix = $root.Installed.TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
        if ($VirtualPath.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)) {
            $relativePath = $VirtualPath.Substring($prefix.Length)
            return Join-Path $root.Packaged $relativePath
        }
    }
    return $null
}

function Test-IsUnderDirectory {
    param(
        [string]$Path,
        [string]$Directory
    )

    $prefix = [IO.Path]::GetFullPath($Directory).TrimEnd([char[]]@('\', '/')) + [IO.Path]::DirectorySeparatorChar
    return [IO.Path]::GetFullPath($Path).StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)
}

$text = [IO.File]::ReadAllText($manifest)
$block = [regex]::Match($text, '\Aname: [^\r\n]+\r?\nversion: [^\r\n]+\r?\ndescription: [^\r\n]+\r?\ntype: (?:instructions|skill|hybrid|prompts)\r?\nincludes:\r?\n(?<items>(?:  - [^\r\n]+\r?\n|[ \t]*\r?\n)+)dependencies: \{\}(?:\r?\n)?\z')
if (-not $block.Success) { throw 'Missing or malformed manifest includes list or unexpected manifest structure.' }
$actual = @([regex]::Matches($block.Groups['items'].Value, '(?m)^  - (?<path>[^\r\n]+)\r?$') |
    ForEach-Object { $_.Groups['path'].Value })

$expected = @()
foreach ($group in $groups) {
    $target = Join-Path $package $group.Path
    if (-not (Test-Path -LiteralPath $target -PathType Container)) {
        throw "Package directory not found: $target"
    }
    $all = @(Get-ChildItem -LiteralPath $target -File -Recurse:$group.Recurse)
    $files = @($all | Where-Object { $_.Name -like $group.Filter })
    $manifestPaths = @($actual | Where-Object { $_ -like "$($group.Path)/*" })
    $validManifestPaths = @($manifestPaths | Where-Object { $_ -match $group.ManifestPattern })
    if ($validManifestPaths.Count -ne $manifestPaths.Count) {
        throw "Manifest includes contain invalid paths under $($group.Path)."
    }
    if ($all.Count -ne $manifestPaths.Count -or $files.Count -ne $manifestPaths.Count) {
        throw "Manifest lists $($manifestPaths.Count) $($group.Filter) files for $target; found $($all.Count) files ($($files.Count) matching). Update apm.yml to match the package files."
    }
    $groupPaths = [string[]]@($files | ForEach-Object {
        $relativePath = $_.FullName.Substring($package.Length).TrimStart([char[]]@('\', '/'))
        $relativePath -replace '\\', '/'
    })
    [Array]::Sort($groupPaths, [StringComparer]::Ordinal)
    $expected += $groupPaths
}
if (@(Get-ChildItem -LiteralPath (Join-Path $package '.apm') -Directory).Count -ne $groups.Count) {
    throw 'Expected only agents, instructions, and skills under .apm.'
}
foreach ($skillDirectory in Get-ChildItem -LiteralPath (Join-Path $package '.apm/skills') -Directory) {
    if (-not (Test-Path -LiteralPath (Join-Path $skillDirectory.FullName 'SKILL.md') -PathType Leaf)) {
        throw "Skill definition not found: $($skillDirectory.FullName)\SKILL.md"
    }
}
if ($actual.Count -ne $expected.Count) {
    throw 'Manifest includes must contain only package agent, instruction, and skill files.'
}
if (Test-Path -LiteralPath (Join-Path $package '../.github/instructions') -PathType Container) {
    $duplicates = @(Get-ChildItem -LiteralPath (Join-Path $package '../.github/instructions') -Recurse -File -Filter '*.instructions.md')
    if ($duplicates.Count) { throw "Found $($duplicates.Count) active workspace instruction duplicates." }
}

# Accept only the package's simple manifest shape (plain metadata, explicit path list,
# empty dependencies). Match the whole file so extra/duplicate includes, including
# entries after blank lines, cannot be silently ignored. No YAML module required.
if (($actual -join "`n") -cne ($expected -join "`n")) {
    throw 'Manifest includes must match the complete, sorted package agent, instruction, and skill file sets.'
}

$requiredResources = @(
    '.apm/skills/warchive-agent-knowledge/resources/codebase-security-and-malware-review.md',
    '.apm/skills/warchive-agent-knowledge/resources/ollama-troubleshooting-windows.md',
    '.apm/skills/warchive-agent-knowledge/resources/roleplay-character-packet-template.md'
)
foreach ($resource in $requiredResources) {
    if (-not (Test-Path -LiteralPath (Join-Path $package $resource) -PathType Leaf)) {
        throw "Required bundled knowledge resource not found: $resource"
    }
}

$agentFiles = @(Get-ChildItem -LiteralPath (Join-Path $package '.apm/agents') -File -Filter '*.agent.md' | Sort-Object Name)
$agentNames = @{}
$agentTargets = @()
foreach ($agentFile in $agentFiles) {
    $content = [IO.File]::ReadAllText($agentFile.FullName)
    $frontMatter = Get-FrontMatter -Content $content
    if ($null -eq $frontMatter) { throw "Agent frontmatter not found: $($agentFile.Name)" }

    $nameMatch = [regex]::Match($frontMatter, '(?m)^name:\s*(?<value>.+?)\s*$')
    if (-not $nameMatch.Success) { throw "Agent name not found in frontmatter: $($agentFile.Name)" }
    $agentName = $nameMatch.Groups['value'].Value.Trim().Trim('"', "'")
    if ([string]::IsNullOrWhiteSpace($agentName)) { throw "Agent name is empty: $($agentFile.Name)" }
    if ($agentNames.ContainsKey($agentName)) { throw "Duplicate agent frontmatter name '$agentName' in $($agentFile.Name) and $($agentNames[$agentName])." }
    $agentNames[$agentName] = $agentFile.Name

    $agentsList = [regex]::Match($frontMatter, '(?m)^agents:\s*\[(?<items>[^\]]*)\]')
    if ($agentsList.Success) {
        foreach ($target in ($agentsList.Groups['items'].Value -split ',')) {
            $target = $target.Trim().Trim('"', "'")
            if ($target) { $agentTargets += [pscustomobject]@{ File = $agentFile.Name; Name = $target } }
        }
    }
    foreach ($targetMatch in [regex]::Matches($frontMatter, '(?m)^\s+agent:\s*(?<value>[^\r\n#]+)')) {
        $target = $targetMatch.Groups['value'].Value.Trim().Trim('"', "'")
        if ($target) { $agentTargets += [pscustomobject]@{ File = $agentFile.Name; Name = $target } }
    }
    foreach ($line in Get-MarkdownBodyLines -Path $agentFile.FullName) {
        $targetMatch = [regex]::Match($line.Text, '(?im)^#{1,6}\s+(?:Optionally\s+)?Delegate to `(?<value>[^`]+)`')
        if ($targetMatch.Success) {
            $agentTargets += [pscustomobject]@{ File = $agentFile.Name; Name = $targetMatch.Groups['value'].Value.Trim() }
        }
    }
}
foreach ($target in $agentTargets) {
    if (-not $agentNames.ContainsKey($target.Name)) {
        throw "Unknown agent target '$($target.Name)' in $($target.File)."
    }
}

$supportedMarkdownFiles = @()
$supportedMarkdownFiles += @(Get-ChildItem -LiteralPath (Join-Path $package '.apm/agents') -File -Filter '*.agent.md')
$supportedMarkdownFiles += @(Get-ChildItem -LiteralPath (Join-Path $package '.apm/instructions') -File -Filter '*.instructions.md')
$supportedMarkdownFiles += @(Get-ChildItem -LiteralPath (Join-Path $package '.apm/skills') -File -Filter '*.md' -Recurse)

$installLayoutRoot = Join-Path $package '.copilot-install-layout'
$installedAgentsRoot = Join-Path $installLayoutRoot 'agents'
$installedSkillsRoot = Join-Path $installLayoutRoot 'skills'
$agentsSourceRoot = Join-Path $package '.apm/agents'
$skillsSourceRoot = Join-Path $package '.apm/skills'
foreach ($file in $supportedMarkdownFiles) {
    $isAgentFile = $file.FullName.StartsWith($agentsSourceRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)
    $isSkillFile = $file.FullName.StartsWith($skillsSourceRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)
    if ($isAgentFile) {
        $virtualSource = Join-Path $installedAgentsRoot $file.Name
    }
    elseif ($isSkillFile) {
        $relativeSkillPath = $file.FullName.Substring($skillsSourceRoot.Length).TrimStart([char[]]@('\', '/'))
        $virtualSource = Join-Path $installedSkillsRoot $relativeSkillPath
    }

    foreach ($link in Get-MarkdownLinks -Path $file.FullName) {
        if ($link.Target -match '^(?i:[a-z][a-z0-9+.-]*:|//)' -or $link.Target.StartsWith('#')) { continue }
        $sourceTarget = Get-LocalLinkPath -SourcePath $file.FullName -Target $link.Target
        if ($null -eq $sourceTarget) { continue }
        $sourceIsPackaged = (Test-IsUnderDirectory -Path $sourceTarget -Directory $agentsSourceRoot) -or
            (Test-IsUnderDirectory -Path $sourceTarget -Directory $skillsSourceRoot)
        if (-not (Test-Path -LiteralPath $sourceTarget -PathType Leaf)) {
            if ($link.Optional -and -not $sourceIsPackaged) { continue }
            throw "Required Markdown link does not resolve in the package workspace: $($file.FullName):$($link.Line) -> $($link.Target)"
        }
        if (-not ($isAgentFile -or $isSkillFile)) { continue }

        $virtualTarget = Get-LocalLinkPath -SourcePath $virtualSource -Target $link.Target
        $packagedTarget = ConvertTo-PackagedInstallPath -VirtualPath $virtualTarget -InstalledAgentsRoot $installedAgentsRoot -InstalledSkillsRoot $installedSkillsRoot -Package $package
        if ($null -eq $packagedTarget -or -not (Test-Path -LiteralPath $packagedTarget -PathType Leaf)) {
            if ($link.Optional -and -not $sourceIsPackaged) { continue }
            throw "Required Markdown link does not resolve in the installed agents/skills layout: $($file.FullName):$($link.Line) -> $($link.Target)"
        }
    }
}

$agentCount = @($actual | Where-Object { $_ -like '.apm/agents/*' }).Count
$instructionCount = @($actual | Where-Object { $_ -like '.apm/instructions/*' }).Count
$skillFileCount = @($actual | Where-Object { $_ -like '.apm/skills/*' }).Count
Write-Host "Verified $agentCount package agents, $instructionCount package instructions, $skillFileCount skill files, agent names and targets, required knowledge resources, supported Markdown links, installed-layout links, no workspace duplicates, and exhaustive manifest includes."
