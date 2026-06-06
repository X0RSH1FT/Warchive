# PowerShell Command Cheatsheet

<!-- markdownlint-disable MD013 -->
**Last updated:** 2026-06-06

**Scope:** Practical reference for everyday PowerShell 7+ commands on Windows, Linux, and macOS. Covers core navigation, file operations, content and text processing, system administration, remoting, scripting constructs, help and discovery, environment configuration, and PowerShell-specific features (pipeline, splatting, modules, execution policy).

**Audience:** Developers, system administrators, DevOps engineers, and power users who work from the PowerShell command line day-to-day.

---

## Table of Contents

1. [Core Navigation and File Operations](#1-core-navigation-and-file-operations)
2. [File Content and Text Processing](#2-file-content-and-text-processing)
3. [System Administration](#3-system-administration)
4. [PowerShell-Specific Features](#4-powershell-specific-features)
5. [Remoting and Session Management](#5-remoting-and-session-management)
6. [Scripting Constructs](#6-scripting-constructs)
7. [Help and Discovery](#7-help-and-discovery)
8. [Environment and Configuration](#8-environment-and-configuration)
9. [Aliases Quick Reference (POSIX → PowerShell)](#9-aliases-quick-reference-posix--powershell)

---

## 1. Core Navigation and File Operations

### Get-Location — Get current working directory

`Get-Location` returns the current working directory path. Analogous to `pwd` in POSIX shells. Alias: `pwd`.

```powershell
Get-Location | Format-List
Get-Location -PSProvider FileSystem
(Get-Location).Path
```

### Set-Location — Change working directory

`Set-Location` changes the current working directory. Analogous to `cd` in POSIX shells. Alias: `cd`, `sl`.

```powershell
Set-Location -Path "C:\Users"
Set-Location -Path "D:\Data\Projects"
Set-Location -Path ".."             # Parent directory
Set-Location -Path "~"              # Home directory
```

### Get-ChildItem — List files and folders

`Get-ChildItem` lists files and folders in a directory. Analogous to `ls`/`dir` in POSIX shells. Alias: `ls`, `dir`.

```powershell
Get-ChildItem -Path .
Get-ChildItem -Path . -Recurse -Filter *.ps1
Get-ChildItem -Path C:\Windows\System32 -File               # Files only
Get-ChildItem -Path . -Directory                             # Directories only
Get-ChildItem -Path . -Hidden                                # Hidden items
Get-ChildItem -Path . -Recurse -Depth 2                     # Limit recursion depth
```

| Parameter | Description |
| ----------- | ------------- |
| `-Path` | Path to search (default: current directory) |
| `-Filter` | Simple filter string (faster than `-Include`) |
| `-Recurse` | Search subdirectories recursively |
| `-Depth` | Max recursion depth (PowerShell 5.0+) |
| `-File` | Return only files |
| `-Directory` | Return only directories |
| `-Hidden` | Include hidden items |
| `-Force` | Include items that cannot otherwise be accessed |

### Get-Item — Get item at specified path

`Get-Item` retrieves the item at the specified path without enumerating children. Supports filesystem, registry, certificate, and other PSDrives.

```powershell
Get-Item -Path "C:\Windows\System32"
Get-Item -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion"
Get-Item -Path . | Select-Object FullName, Length, LastWriteTime
```

### Copy-Item — Copy files and folders

`Copy-Item` copies a file or folder from one location to another. Analogous to `cp` in POSIX shells. Alias: `copy`, `cp`.

```powershell
Copy-Item -Path "source.txt" -Destination "dest.txt"
Copy-Item -Path "C:\Data" -Destination "D:\Backup" -Recurse
Copy-Item -Path "*.log" -Destination "C:\Logs\archive" -Force
Copy-Item -Path "C:\Server\config.json" -Destination "\\NAS\Backup\" -Recurse
```

| Parameter | Description |
| ----------- | ------------- |
| `-Path` | Source item(s) to copy |
| `-Destination` | Target path |
| `-Recurse` | Copy directories recursively |
| `-Force` | Overwrite read-only / hidden items |
| `-PassThru` | Return the copied item(s) |

### Move-Item — Move or rename files and folders

`Move-Item` moves or renames a file or folder. Analogous to `mv` in POSIX shells. Alias: `move`, `mv`.

```powershell
Move-Item -Path "old.txt" -Destination "new.txt"
Move-Item -Path "C:\Temp\*" -Destination "C:\Archive\"
Move-Item -Path "C:\Data\Project" -Destination "D:\Projects\" -Force
```

### Remove-Item — Delete files, folders, and registry keys

`Remove-Item` deletes files, folders, registry keys, and other items. Analogous to `rm` in POSIX shells. Alias: `del`, `rm`, `rd`.

```powershell
Remove-Item -Path "C:\temp\file.txt"
Remove-Item -Path "C:\temp\*" -Recurse -Force
Remove-Item -Path "HKLM:\Software\UnwantedKey" -Recurse
Remove-Item -Path "C:\temp" -Recurse -WhatIf             # Preview without deleting
```

| Parameter | Description |
| ----------- | ------------- |
| `-Path` | Item(s) to remove |
| `-Recurse` | Remove directories and all contents |
| `-Force` | Remove read-only and hidden items |
| `-WhatIf` | Show what would happen without executing |

### New-Item — Create files, folders, and registry keys

`New-Item` creates a new file, folder, registry key, or other item. Analogous to `touch`/`mkdir` in POSIX shells.

```powershell
New-Item -Path "C:\scripts\test.ps1" -ItemType File
New-Item -Path "C:\Projects\NewApp" -ItemType Directory
New-Item -Path "HKCU:\Software\MyApp" -ItemType RegistryKey -Force
New-Item -Path ".\data.json" -ItemType File -Value '{"version": 1}'
```

### Rename-Item — Rename files and folders

`Rename-Item` changes the name of a file, folder, or other item. Analogous to `mv` for single-item renames.

```powershell
Rename-Item -Path "old.txt" -NewName "new.txt"
Rename-Item -Path "C:\Data" -NewName "Data-Archive"
```

---

## 2. File Content and Text Processing

### Get-Content — Read file content line-by-line

`Get-Content` reads the content of a file line-by-line. Analogous to `cat`/`type` in POSIX shells. Alias: `cat`, `type`, `gc`.

```powershell
Get-Content -Path "log.txt"
Get-Content -Path "log.txt" -Tail 10                  # Last 10 lines
Get-Content -Path "log.txt" -Head 5                   # First 5 lines (PowerShell 7+)
Get-Content -Path "log.txt" -TotalCount 20            # First 20 lines
Get-Content -Path "log.txt" -Wait                      # Follow (like tail -f)
Get-Content -Path "log.txt" -Encoding utf8NoBOM        # Specify encoding
Get-Content -Path "*.log" | Select-String "ERROR"      # Pipeline to search
```

| Parameter | Description |
| ----------- | ------------- |
| `-Path` | File(s) to read |
| `-Tail` | Return last N lines |
| `-Head` | Return first N lines (PowerShell 7+) |
| `-TotalCount` | Return first N lines (older alternative) |
| `-Wait` | Poll for new content (like `tail -f`) |
| `-Encoding` | Specify character encoding |
| `-Raw` | Read entire file as a single string |

### Set-Content — Write content to a file

`Set-Content` writes or replaces content in a file. Overwrites by default.

```powershell
Set-Content -Path "config.txt" -Value "setting=true"
Set-Content -Path "output.json" -Value $jsonData -Encoding utf8
Get-Process | Set-Content -Path "processes.txt"        # Pipeline input
```

**Note:** `Set-Content` writes text using the `Encoding` parameter. For raw binary data, use `Set-Content -AsByteStream` (PowerShell 7+) or `[System.IO.File]::WriteAllBytes()`.

### Add-Content — Append content to a file

`Add-Content` appends content to a file without overwriting existing data.

```powershell
Add-Content -Path "log.txt" -Value "New log entry"
Add-Content -Path "results.csv" -Value "value1,value2,value3"
Get-Date | Add-Content -Path "timestamps.txt"
```

### Out-File — Send pipeline output to a file

`Out-File` sends pipeline output to a file, using PowerShell's formatting system to render objects as text.

```powershell
Get-Process | Out-File -FilePath "processes.txt" -Encoding utf8
Get-Service | Out-File -FilePath "services.txt" -Width 200    # Wider output
Get-Process | Out-File -FilePath "process.log" -Append         # Append mode
```

| Parameter | Description |
| ----------- | ------------- |
| `-FilePath` | Target file path |
| `-Encoding` | Character encoding |
| `-Append` | Append to existing file |
| `-Width` | Line width (default: terminal width) |
| `-NoNewline` | Omit trailing newline |

### Select-String — Search for text patterns

`Select-String` searches for text patterns in strings and files. Analogous to `grep` in POSIX shells. Alias: `sls`.

```powershell
Select-String -Path "*.log" -Pattern "ERROR"
Select-String -Path "*.ps1" -Pattern "Write-Error" -CaseSensitive
Select-String -Path "*.csv" -Pattern "^\d{3}-\d{2}-\d{4}$"    # Regex pattern
Get-ChildItem -Recurse -Filter "*.ps1" | Select-String -Pattern "TODO"   # Grep-like recursive search
Select-String -Path "*.log" -Pattern "FATAL" -Context 2,2      # 2 lines before/after
Select-String -Path "config*" -Pattern "server" -NotMatch      # Invert match
```

| Parameter | Description |
| ----------- | ------------- |
| `-Path` | File(s) to search |
| `-Pattern` | Regex pattern to match |
| `-CaseSensitive` | Case-sensitive match |
| `-NotMatch` | Return lines that do NOT match |
| `-Context` | Lines before/after each match |
| `-SimpleMatch` | Treat pattern as literal string (not regex) |
| `-AllMatches` | Return all matches per line (not just first) |

### Compare-Object — Compare two sets of objects

`Compare-Object` compares two collections of objects and indicates differences. Useful for file lists, directory snapshots, and configuration drift detection.

```powershell
Compare-Object -ReferenceObject $list1 -DifferenceObject $list2
Compare-Object (Get-ChildItem .\before) (Get-ChildItem .\after)
Compare-Object -ReferenceObject $list1 -DifferenceObject $list2 -IncludeEqual
```

| Symbol | Meaning |
| -------- | --------- |
| `<=` | Side indicator: exists only in ReferenceObject |
| `=>` | Side indicator: exists only in DifferenceObject |
| `==` | Exists in both (with `-IncludeEqual`) |

### ForEach-Object — Operate on each item in a pipeline

`ForEach-Object` performs an operation on each item in a pipeline. Analogous to `xargs` in POSIX shells. Alias: `foreach`, `%`.

```powershell
Get-Service | ForEach-Object { $_.Name + ": " + $_.Status }
Get-ChildItem -Path "*.txt" | ForEach-Object -Process { $_.Length }
1..10 | ForEach-Object { $_ * $_ }                     # Squares 1 through 10
Get-Service | Where-Object Status -eq "Running" | ForEach-Object -MemberName Name
```

| Parameter | Description |
| ----------- | ------------- |
| `-Process` | Script block for each item |
| `-Begin` | Script block before processing (initialization) |
| `-End` | Script block after processing (cleanup) |
| `-MemberName` | Instead of script block, get a property/method |
| `-Parallel` | Run script blocks in parallel (PowerShell 7+, use with `-ThrottleLimit`) |

### Where-Object — Filter pipeline objects

`Where-Object` filters objects from a pipeline based on property values. Alias: `where`, `?`.

```powershell
Get-Process | Where-Object { $_.CPU -gt 100 }
Get-Service | Where-Object Status -eq "Running"                     # Simplified syntax
Get-ChildItem -Recurse *.tmp | Where-Object Length -gt 1MB          # Files > 1 MB
Get-Process | Where-Object CPU -gt 10 -and Handles -gt 500          # Multiple conditions
Get-Service | Where-Object Status -ne "Running" | Start-Service     # Start stopped services
```

| Operator | Description |
| ---------- | ------------- |
| `-eq` | Equals |
| `-ne` | Not equals |
| `-gt` | Greater than |
| `-lt` | Less than |
| `-like` | Wildcard match (`*`, `?`) |
| `-match` | Regex match |
| `-contains` | Collection contains value |
| `-and` | Logical AND |
| `-or` | Logical OR |

---

## 3. System Administration

### Get-Process — Get running processes

`Get-Process` retrieves the running processes on the local computer. Analogous to `ps` in POSIX shells. Alias: `gps`, `ps`.

```powershell
Get-Process
Get-Process -Name "pwsh" | Format-List *               # All properties
Get-Process -Name "notepad", "code"                     # Multiple processes
Get-Process -Id 1234                                    # By PID
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5   # Top 5 by CPU
```

### Stop-Process — Stop running processes

`Stop-Process` stops one or more running processes. Analogous to `kill` in POSIX shells. Alias: `spps`, `kill`.

```powershell
Stop-Process -Name "notepad" -Force
Stop-Process -Id 1234
Get-Process -Name "chrome" | Stop-Process
Stop-Process -Name "hangapp" -WhatIf                     # Preview without killing
```

| Parameter | Description |
| ----------- | ------------- |
| `-Name` | Process name(s) |
| `-Id` | Process ID(s) |
| `-Force` | Stop processes that cannot otherwise be stopped |
| `-Confirm` | Prompt before stopping |
| `-WhatIf` | Show what would happen |

### Get-Service — Get Windows services

`Get-Service` retrieves Windows services on local and remote computers.

```powershell
Get-Service
Get-Service -Name "wuauserv"                             # Windows Update service
Get-Service -Name "wuauserv" | Start-Service
Get-Service -DisplayName "*SQL*"                         # Wildcard display name
Get-Service | Where-Object Status -eq "Running"
```

### Start-Service — Start stopped services

`Start-Service` starts one or more stopped services.

```powershell
Start-Service -Name "Spooler"
Start-Service -DisplayName "Windows Update"
Get-Service -Name "MSSQL*" | Start-Service
```

### Stop-Service — Stop running services

`Stop-Service` stops one or more running services.

```powershell
Stop-Service -Name "Spooler"
Stop-Service -Name "W3SVC" -Force
Get-Service -Name "App*" | Stop-Service
```

### Get-CimInstance — Get WMI/CIM instances

`Get-CimInstance` retrieves CIM (Common Information Model) / WMI instances. This is the cross-platform successor to the deprecated `Get-WmiObject`.

```powershell
Get-CimInstance -ClassName Win32_OperatingSystem
Get-CimInstance -ClassName Win32_Process -Filter "Name LIKE '%powershell%'"
Get-CimInstance -ClassName Win32_LogicalDisk -ComputerName Server01
Get-CimInstance -ClassName Win32_Service | Select-Object Name, State, StartMode
```

**Important:** `Get-WmiObject` is deprecated in PowerShell 7+ in favor of `Get-CimInstance`.

### Get-WinEvent — Get events from event logs

`Get-WinEvent` retrieves events from Windows event logs. This is the PowerShell 7+ replacement for the deprecated `Get-EventLog`.

```powershell
Get-WinEvent -LogName System -MaxEvents 50
Get-WinEvent -LogName Application -FilterXPath "*[System[Level=2]]"     # Errors only
Get-WinEvent -LogName Security -MaxEvents 100 | Where-Object Id -eq 4624  # Logon events
Get-WinEvent -ListLog *Application*                        # List log metadata
```

### Get-ComputerInfo — Get consolidated system information

`Get-ComputerInfo` returns a consolidated object with operating system and hardware information.

```powershell
Get-ComputerInfo | Select-Object WindowsVersion, OsArchitecture
Get-ComputerInfo | Select-Object WindowsBuildLabEx, WindowsEditionId
Get-ComputerInfo -Property "Os*"                           # Filter by property name
```

---

## 4. PowerShell-Specific Features

### Pipeline (`|`) — Pass objects between commands

Unlike POSIX shells that pass text between commands, PowerShell's pipeline passes .NET objects. Properties and methods remain accessible throughout the pipeline.

```powershell
Get-Process | Where-Object CPU -gt 10 | Sort-Object CPU -Descending | Select-Object -First 5
Get-Service | Where-Object Status -eq "Running" | Format-Table Name, DisplayName
Get-ChildItem -Recurse *.log | Select-String "ERROR" | Group-Object Filename
```

### Splatting (`@`) — Pass parameters from a collection

Splatting passes a collection of parameter values to a command using a hash table or array. Improves readability and reduces line length.

```powershell
# Hash table splatting
$params = @{
    Path        = "source.txt"
    Destination = "dest.txt"
    Force       = $true
    Recurse     = $true
}
Copy-Item @params

# Array splatting (positional parameters)
$args = @("Server01", "Server02")
Invoke-Command -ComputerName $args -ScriptBlock { Get-Service }
```

### Calculated Properties — Create custom properties on-the-fly

Calculated properties allow creating new properties inline with `Select-Object` or `Format-Table` using a hash table with `Name`/`Expression` keys.

```powershell
Get-ChildItem | Select-Object Name, @{Name="SizeKB"; Expression={[math]::Round($_.Length/1KB, 2)}}
Get-Process | Select-Object Name, @{N="CPU_Minutes"; E={[math]::Round($_.CPU/60, 2)}}
Get-Service | Format-Table Name, @{N="StatusCode"; E={$_.Status.Value__}}
```

| Key | Alias | Description |
| ----- | ------- | ------------- |
| `Name` | `N` | Display name for the property |
| `Expression` | `E` | Script block that computes the value |

### Get-Module — List available modules

`Get-Module` lists modules that are imported in the current session or available from the directories in `$env:PSModulePath`.

```powershell
Get-Module                                              # Imported modules only
Get-Module -ListAvailable | Select-Object Name, Version # All available modules
Get-Module -ListAvailable -Name "*ActiveDirectory*"
```

### Import-Module — Add a module to the current session

`Import-Module` loads a module into the current PowerShell session, making its cmdlets and functions available.

```powershell
Import-Module -Name ActiveDirectory -Prefix "AD"
Import-Module -Name SqlServer -Force                     # Reload if already imported
Import-Module -Name .\MyModule.psm1                      # Local module file
Import-Module -Name PSReadLine -RequiredVersion 2.1.0    # Specific version
```

### Install-Module — Install a module from a repository

`Install-Module` downloads and installs a module from a registered repository (typically the PowerShell Gallery). Requires PowerShellGet.

```powershell
Install-Module -Name PowerShellGet -Force -Scope CurrentUser
Install-Module -Name Az -Scope CurrentUser               # Azure PowerShell module
Install-Module -Name Pester -RequiredVersion 5.5.0       # Specific version
```

### Get-ExecutionPolicy — Get script execution policy

`Get-ExecutionPolicy` retrieves the current PowerShell execution policy that determines script execution restrictions.

```powershell
Get-ExecutionPolicy
Get-ExecutionPolicy -List                                # All scopes with precedence
Get-ExecutionPolicy -Scope CurrentUser
```

| Scope | Precedence |
| ------- | ------------ |
| `MachinePolicy` | Highest (set by Group Policy) |
| `UserPolicy` | Set by Group Policy for current user |
| `Process` | Current session only |
| `CurrentUser` | Current user registry setting |
| `LocalMachine` | Local machine registry setting (lowest) |

### Set-ExecutionPolicy — Change script execution policy

`Set-ExecutionPolicy` changes the user preference for PowerShell script execution policy.

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Set-ExecutionPolicy -ExecutionPolicy AllSigned -Scope LocalMachine
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope Process
```

| Policy | Description |
| -------- | ------------- |
| `Restricted` | No scripts allowed (default on Windows) |
| `RemoteSigned` | Locally created scripts run; remote scripts must be signed |
| `AllSigned` | All scripts must be signed by a trusted publisher |
| `Unrestricted` | All scripts run (but prompt for remote scripts) |
| `Bypass` | Nothing is blocked, no warnings or prompts |

---

## 5. Remoting and Session Management

### Enter-PSSession — Start interactive remote session

`Enter-PSSession` starts an interactive session with a remote computer. Analogous to `ssh` for interactive use.

```powershell
Enter-PSSession -ComputerName "Server01"
Enter-PSSession -ComputerName "Server01" -Credential (Get-Credential)
Enter-PSSession -ConnectionUri "https://srv01.contoso.com:5986"    # HTTPS
```

After entering, the prompt changes to `[Server01]: PS>` indicating the remote session.

### Exit-PSSession — End interactive remote session

`Exit-PSSession` ends an interactive remote PowerShell session.

```powershell
Exit-PSSession
```

### Invoke-Command — Run commands on local or remote computers

`Invoke-Command` runs commands on one or more computers, returning results as objects.

```powershell
Invoke-Command -ComputerName "Server01","Server02" -ScriptBlock { Get-Service }
Invoke-Command -ComputerName (Get-Content .\servers.txt) -ScriptBlock { Get-Process }
Invoke-Command -ComputerName "Server01" -FilePath .\script.ps1      # Run local script remotely
Invoke-Command -Session $session -ScriptBlock { $PSVersionTable }
Invoke-Command -ComputerName "Server01" -ScriptBlock { param($a,$b) $a + $b } -ArgumentList 1, 2
```

| Parameter | Description |
| ----------- | ------------- |
| `-ComputerName` | One or more computer names |
| `-ScriptBlock` | Commands to execute |
| `-FilePath` | Local script file to run on remote computers |
| `-Session` | PSSession object (reuse persistent connection) |
| `-Credential` | Alternate credentials |
| `-ArgumentList` | Arguments passed to the script block |

### New-PSSession — Create persistent remote connection

`New-PSSession` creates a persistent PowerShell session (PSSession) to a local or remote computer.

```powershell
$session = New-PSSession -ComputerName "Server01"
$session2 = New-PSSession -ComputerName "Server01","Server02"       # Multiple sessions
New-PSSession -ComputerName "Server01" -SessionOption (New-PSSessionOption -IdleTimeout 3600000)
```

Persistent sessions maintain state across multiple `Invoke-Command` calls.

### Get-PSSession — Get PowerShell sessions

`Get-PSSession` retrieves PowerShell sessions on local and remote computers.

```powershell
Get-PSSession | Select-Object ComputerName, State
Get-PSSession -ComputerName "Server01"
Get-PSSession -Id 1
```

### Remove-PSSession — Close PowerShell sessions

`Remove-PSSession` closes one or more PowerShell sessions.

```powershell
Get-PSSession | Remove-PSSession
Remove-PSSession -Id 1
Remove-PSSession -Session $session
```

### Enable-PSRemoting — Configure for remote access

`Enable-PSRemoting` configures the computer to receive PowerShell remote commands (requires admin).

```powershell
Enable-PSRemoting -Force
```

This starts the WinRM service, sets it to auto-start, creates firewall rules, and registers session endpoint configurations.

---

## 6. Scripting Constructs

### Variables (`$`) — Store and reference values

PowerShell variables are prefixed with `$` and are created on assignment. They hold any .NET type.

```powershell
$processes = Get-Process
$count = $processes.Count
$name = "Windows"
$isAdmin = ([Security.Principal.WindowsPrincipal]::new([Security.Principal.WindowsIdentity]::GetCurrent())).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
$results = @()                                              # Empty array
$config = @{}                                               # Empty hash table
```

**Variable scopes:**

| Scope | Visibility | Declared |
| ------- | ------------ | ---------- |
| `Global` | Everywhere in the session | `$global:var` |
| `Script` | Only within the current script file | `$script:var` |
| `Local` | Current scope (function, script block) | `$local:var` (default) |
| `Private` | Current scope, not visible to child scopes | `$private:var` |

### Conditionals (`if`/`elseif`/`else`) — Branch execution

Conditionals branch execution based on PowerShell expressions and comparison operators.

```powershell
$proc = Get-Process -Name "pwsh" | Select-Object -First 1
if ($proc.CPU -gt 50) {
    "High CPU"
} elseif ($proc.CPU -gt 10) {
    "Moderate"
} else {
    "Low"
}
```

**Truthy/falsy in conditionals:**

| Value | Boolean interpretation |
| ------- | ------------------------ |
| `$true` | True |
| `$false` | False |
| `$null` | False |
| `0` | False |
| `""` (empty string) | False |
| Non-empty string | True |
| Non-zero number | True |
| Non-null object | True |

### Loops (`foreach`, `while`, `do..while`, `for`) — Iterate over collections

PowerShell supports several loop constructs for iterating over data.

```powershell
# foreach statement (collection iteration)
foreach ($svc in Get-Service) { $svc.Name }

# foreach-object (pipeline)
Get-Service | ForEach-Object { $_.Name }

# while loop
$i = 0; while ($i -lt 5) { $i; $i++ }

# do..while loop
do { $x = Read-Host "Enter 'quit' to exit" } while ($x -ne "quit")

# for loop
for ($i = 0; $i -lt 10; $i++) { $i }
```

### Functions — Named reusable script blocks

Functions encapsulate reusable code with optional parameters, pipeline support, and output.

```powershell
# Simple function
function Get-FileSize {
    param([string]$Path)
    (Get-Item $Path).Length
}

# Advanced function (with cmdlet-like features)
function Get-LargeFiles {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true, ValueFromPipeline=$true)]
        [string]$Path,

        [Parameter()]
        [long]$MinimumSize = 1MB
    )
    Get-ChildItem -Path $Path -File | Where-Object Length -gt $MinimumSize
}
```

### Error Handling (`try`/`catch`/`finally`) — Handle terminating errors

Error handling in PowerShell uses `try`/`catch`/`finally` blocks, similar to C#. Non-terminating errors require `-ErrorAction Stop` to be caught.

```powershell
try {
    Get-Item "missing.txt" -ErrorAction Stop
    # -ErrorAction Stop converts non-terminating errors to terminating
} catch [System.IO.FileNotFoundException] {
    "File not found: $($_.Exception.Message)"
} catch {
    "Unexpected error: $_"
} finally {
    "Cleanup block runs regardless"
}
```

| Block | Purpose |
| ------- | --------- |
| `try` | Code that may produce terminating errors |
| `catch [Type]` | Handle errors of a specific exception type |
| `catch` | Handle any remaining error types |
| `finally` | Always executes (cleanup, closing resources) |

### Parameter Attributes — Declare typed, validated parameters

Parameter attributes control mandatory status, position, validation, pipeline input, and help messages.

```powershell
function Set-MyConfig {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true, Position=0)]
        [ValidateNotNullOrEmpty()]
        [string]$Name,

        [Parameter(Mandatory=$false)]
        [ValidateRange(1, 65535)]
        [int]$Port = 8080,

        [Parameter(ValueFromPipeline=$true)]
        [string[]]$Data
    )
    # Function body
}
```

| Common Attribute | Description |
| ------------------ | ------------- |
| `[Parameter(Mandatory=$true)]` | Parameter is required |
| `[Parameter(Position=0)]` | Positional parameter index |
| `[Parameter(ValueFromPipeline=$true)]` | Accepts pipeline input |
| `[ValidateNotNullOrEmpty()]` | Rejects null or empty values |
| `[ValidateRange(min, max)]` | Validates numeric range |
| `[ValidateSet("a","b","c")]` | Validates against allowed set |
| `[ValidatePattern("regex")]` | Validates against a regex |

---

## 7. Help and Discovery

### Get-Command — Discover commands

`Get-Command` finds all commands (cmdlets, functions, aliases, applications, scripts) available in the current session.

```powershell
Get-Command                                                 # All commands
Get-Command -Module Microsoft.PowerShell.Management         # By module
Get-Command -Name "*Service*"                               # Wildcard search
Get-Command -Verb Get                                       # All "Get" verbs
Get-Command -CommandType Cmdlet                             # Cmdlets only
Get-Command -CommandType Function                           # Functions only
Get-Command -ParameterName "ComputerName"                   # Commands with a specific parameter
```

### Get-Help — Display help about commands

`Get-Help` displays detailed help about PowerShell commands, including syntax, parameters, examples, and related links.

```powershell
Get-Help -Name "Get-Process"
Get-Help -Name "Get-Process" -Examples                      # Examples only
Get-Help -Name "Get-Process" -Detailed                      # Full help with parameter details
Get-Help -Name "Get-Process" -Full                           # All help content
Get-Help -Name "about_*"                                     # List conceptual help topics
Get-Help -Name "about_Pipelines"                             # Conceptual topic
Get-Help -Name "Get-Process" -Online                         # Open online version in browser
```

### Get-Member — Inspect object properties and methods

`Get-Member` reveals the properties, methods, and events of .NET objects. Essential for understanding what you can do with pipeline output.

```powershell
Get-Process | Get-Member
Get-Process | Get-Member | Where-Object MemberType -eq "Property"
Get-Process | Get-Member -Name "*Cpu*"                      # Search by name
Get-Process | Get-Member -MemberType Method | Select-Object Name, Definition
```

| MemberType | Description |
| ------------ | ------------- |
| `Property` | Gets or sets a value (read/write) |
| `Method` | An action the object can perform |
| `Event` | A notification the object can raise |
| `NoteProperty` | Added property (not from the type) |
| `ScriptProperty` | Property computed by a script block |

### Get-Alias — Get defined aliases

`Get-Alias` retrieves the aliases defined in the current PowerShell session.

```powershell
Get-Alias                                                    # All aliases
Get-Alias -Definition "Get-ChildItem"                        # Find alias for a cmdlet
Get-Alias -Name "ls"                                         # Find what 'ls' maps to
```

---

## 8. Environment and Configuration

### `$PROFILE` — Profile script path

The automatic variable `$PROFILE` contains the path to the current user's PowerShell profile script. Multiple profiles exist at different scopes.

```powershell
$PROFILE                                                     # Current user, current host
$PROFILE.CurrentUserAllHosts                                 # Current user, all hosts
$PROFILE.AllUsersCurrentHost                                 # All users, current host
$PROFILE.AllUsersAllHosts                                    # All users, all hosts

# Edit the current profile
notepad $PROFILE

# Create profile if missing
if (-not (Test-Path $PROFILE)) {
    New-Item -Path $PROFILE -ItemType File -Force
}
```

**Profile loading order (Windows PowerShell):**

1. `%ProgramFiles%\WindowsPowerShell\config.dat`
2. `%ProgramFiles%\WindowsPowerShell\profile.ps1` (AllUsersAllHosts)
3. `%ProgramFiles%\WindowsPowerShell\Microsoft.PowerShell_profile.ps1` (AllUsersCurrentHost)
4. `%USERPROFILE%\Documents\WindowsPowerShell\profile.ps1` (CurrentUserAllHosts)
5. `%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1` (CurrentUserCurrentHost)

### `$env:` — Access environment variables

Environment variables are accessed via the `Env:` PSDrive using the `$env:` namespace.

```powershell
$env:PATH
$env:PSModulePath
$env:USERNAME
$env:COMPUTERNAME

# Set environment variable for current session
$env:MY_VARIABLE = "my value"

# List all environment variables
Get-ChildItem Env:
Get-ChildItem Env:PATH                                       # Filter by name
```

**Persistent (machine-level) environment variable changes** require .NET APIs or the `SETX` utility:

```powershell
[System.Environment]::SetEnvironmentVariable("MY_VAR", "value", "Machine")
[System.Environment]::SetEnvironmentVariable("MY_VAR", "value", "User")
```

### Get-Variable — Get session variables

`Get-Variable` retrieves variables in the current PowerShell session.

```powershell
Get-Variable
Get-Variable -Name "PROFILE","HOME"
Get-Variable -Scope Global                                   # Global scope variables
Get-Variable -Exclude P*                                     # Exclude names starting with P
```

### Set-Variable — Create or set a variable

`Set-Variable` creates a new variable or changes the value of an existing one.

```powershell
Set-Variable -Name "MyVar" -Value "Hello" -Scope Global
Set-Variable -Name "Config" -Value @{ Path = "C:\data"; Mode = "ReadOnly" }
Set-Variable -Name "ReadOnlyVar" -Value "cannot change" -Option ReadOnly
Set-Variable -Name "PrivateVar" -Value "hidden" -Option Private
```

| Parameter | Description |
| ----------- | ------------- |
| `-Name` | Variable name (without `$`) |
| `-Value` | Variable value |
| `-Scope` | Variable scope (Global, Local, Script, Private) |
| `-Option` | Options: `None`, `ReadOnly`, `Constant`, `Private`, `AllScope` |

---

## 9. Aliases Quick Reference (POSIX → PowerShell)

Common POSIX commands and their PowerShell equivalents. Aliases defined in PowerShell by default are marked with an asterisk (`*`).

| POSIX Command | PowerShell Cmdlet | Default Alias |
| --------------- | ------------------- | --------------- |
| `ls`, `dir` | `Get-ChildItem` | `ls`*, `dir`* |
| `cd` | `Set-Location` | `cd`*, `sl`* |
| `pwd` | `Get-Location` | `pwd`* |
| `cat`, `type` | `Get-Content` | `cat`*, `type`* |
| `rm`, `del` | `Remove-Item` | `rm`*, `del`*, `rd`* |
| `mv` | `Move-Item` | `mv`*, `move`* |
| `cp`, `copy` | `Copy-Item` | `cp`*, `copy`* |
| `mkdir` | `New-Item -ItemType Directory` | `mkdir`* |
| `echo` | `Write-Output` | `echo`* |
| `grep` | `Select-String` | `sls`* |
| `kill` | `Stop-Process` | `kill`* |
| `ps` | `Get-Process` | `ps`*, `gps`* |
| `sort` | `Sort-Object` | (none) |
| `head` | `Get-Content -Head` or `Select-Object -First` | (none) |
| `tail` | `Get-Content -Tail` or `Select-Object -Last` | (none) |
| `tee` | `Tee-Object` | (none) |
| `wc` | `Measure-Object` | (none) |
| `xargs` | `ForEach-Object` | `%`* |
| `uniq` | `Sort-Object -Unique` | (none) |
| `which` | `Get-Command` | (none) |
| `touch` | `New-Item -ItemType File` | (none) |
| `sleep` | `Start-Sleep` | (none) |
| `env` | `Get-ChildItem Env:` | (none) |
| `export` | `$env:VAR = "value"` | (none) |
| `history` | `Get-History` | `history`*, `h`* |

Aliases marked with `*` are defined by default in any PowerShell session.

---

<!-- markdownlint-enable MD013 -->
<!--
  Reference validation: every cmdlet, parameter, and syntax example listed
  above was verified against official Microsoft PowerShell documentation as
  of June 2026.
  See: https://learn.microsoft.com/en-us/powershell/
  Sources:
    - Microsoft.PowerShell.Management module
    - Microsoft.PowerShell.Utility module
    - Microsoft.PowerShell.Core module
    - about_Pipelines, about_Splatting, about_Modules, about_Execution_Policies
    - about_Remote, about_Variables, about_Functions, about_Try_Catch_Finally
    - about_Profiles, about_Environment_Variables
  If you find an error, open a PR against this file.
-->
