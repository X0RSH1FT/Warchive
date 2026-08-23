# .NET Installation and Setup

Scope: A Windows-focused .NET and C# crash course for a developer returning after several years away. This document covers general .NET setup, project workflows, and modern C# orientation.

Audience: Developers who need a practical, low-friction path from a clean Windows machine to building and understanding a small .NET/C# project.

Last updated: 2026-07-25

Research date: 2026-07-25

## Evidence Boundary

The supplied research packet confirms that the official [.NET download page](https://dotnet.microsoft.com/download/dotnet) listed .NET 10.0 version 10.0.10 as LTS on July 14, 2026, with support through November 14, 2028. That is the only version-specific .NET fact used here.

The detailed Microsoft documentation pages were not accessible during the research pass. Commands and concepts below are practical general orientation, not a claim that every command or default is unchanged in every SDK release. Check the installed SDK and the current official documentation when a project depends on a specific version or platform.

## What .NET Is

.NET is a development platform for building and running applications. The platform includes:

- The **runtime**, which executes compiled .NET applications.
- The **SDK**, which includes the runtime plus compilers, project tooling, templates, and commands such as `dotnet new`, `dotnet build`, and `dotnet run`.
- The **base class libraries**, which provide common APIs for files, collections, networking, dates, tasks, and other application work.
- **C#**, one language used to write .NET applications. C# source is compiled into an intermediate representation that the .NET runtime executes.

For development, install the SDK. Installing only a runtime is appropriate for running an application when its SDK is not needed.

## Windows Installation Choices

### Recommended starting point: the SDK installer

Install the latest recommended LTS SDK from the official [.NET download page](https://dotnet.microsoft.com/download/dotnet), using the Windows SDK installer for the architecture of the machine. The page is the source of truth for currently supported releases, installers, and support dates. As dated research evidence, the packet recorded .NET 10.0.10 as the LTS listing on 2026-07-14, with support through 2028-11-14; that observation is not a permanent version requirement.

During installation, accept the standard command-line tooling and PATH integration unless local machine policy requires another arrangement. Close and reopen PowerShell after installation so a new shell can see the updated PATH.

### Other installation methods

General orientation: Windows developers may also use a package manager or an enterprise-managed installer. These methods can be useful for repeatable machine setup, but they add another layer of version and PATH management. For a first return to .NET, the official installer is the easiest state to explain and troubleshoot.

Do not install only the runtime when you intend to create, restore, build, or edit C# projects. Do not assume that having a runtime installed means the SDK is installed.

## Verify the Installation

Open a new PowerShell window and run:

```powershell
dotnet --version
dotnet --info
dotnet --list-sdks
dotnet --list-runtimes
```

Interpret the results as follows:

- `dotnet --version` should print an SDK version. If it does not, PowerShell cannot find the SDK command or the SDK is not installed.
- `dotnet --info` shows the selected SDK, runtimes, operating system, and installation locations.
- `dotnet --list-sdks` confirms which SDKs are installed for development.
- `dotnet --list-runtimes` confirms which runtimes are installed for execution.

If several SDKs are installed, a repository may use a `global.json` file to select one. Treat that file as a project-level version constraint and verify the selected SDK with `dotnet --info` from the project directory.

## First Project Lifecycle

The normal small-project loop is:

1. Create or enter a project directory.
2. Restore dependencies.
3. Build source into an output.
4. Run the application.
5. Test, change code, and repeat.

The following is a minimal PowerShell session using the standard console template:

```powershell
New-Item -ItemType Directory -Path $HOME\source\repos\DotnetCrashCourse -Force
Set-Location $HOME\source\repos\DotnetCrashCourse
dotnet new console -n HelloDotnet
Set-Location .\HelloDotnet
dotnet restore
dotnet build
dotnet run
```

`dotnet new` creates a project from a template. `dotnet restore` resolves the packages named by the project. `dotnet build` compiles the project and reports compiler errors. `dotnet run` builds as needed and launches the result. The [Microsoft .NET CLI overview](https://learn.microsoft.com/en-us/dotnet/core/tools/) is the current documentation destination for command behavior.

Useful follow-up commands are:

```powershell
dotnet clean
dotnet test
dotnet publish -c Release
dotnet add package PackageName
```

Use `dotnet publish` when you need deployable output rather than only a local build. Replace `PackageName` with the package identifier you have deliberately selected.

## Project Files and Target Frameworks

A .NET project is commonly described by a `.csproj` XML file. It records the project SDK, target framework, output type, nullable settings, language settings, and package references. The following is a generic illustrative .NET project example:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netX.Y</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>
```

`netX.Y` is a placeholder, not a version recommendation. Use the target framework required by the application, the installed SDK, and the libraries the project uses. Do not manually change a project's `TargetFramework` without checking the SDK and dependency requirements.

Important project concepts:

- **Target framework** describes the .NET API/runtime family the project targets.
- **Configuration** commonly distinguishes `Debug` from `Release` builds.
- **Package references** declare external NuGet dependencies in the project file.
- **Output** contains generated build or publish artifacts and should be treated as generated data.
- **Solution files** group related projects; a project can be built directly without a solution.

## NuGet in Practice

NuGet is the package system used by .NET projects. A package normally contributes compiled libraries, build assets, analyzers, or content. The project file records the dependency; restore obtains the package and its transitive dependencies into local caches and project assets.

Typical commands are:

```powershell
dotnet add package PackageName
dotnet restore
dotnet list package
dotnet remove package PackageName
```

Prefer explicit, maintained packages and review their target framework support before adding them. Commit the project and solution files that define dependencies. Do not commit machine-specific package caches or build output.

## Compact Modern C# Refresher

This is a syntax and mental-model refresher, not a complete language reference.

### Types, nullability, and control flow

```csharp
string name = "Ada";
int count = 3;
string? optionalName = null;

if (optionalName is string value)
{
    Console.WriteLine(value);
}

for (int index = 0; index < count; index++)
{
    Console.WriteLine(index);
}
```

With nullable reference types enabled, `string` means a non-null reference is expected and `string?` means `null` is allowed. Treat compiler warnings as useful design feedback rather than automatically suppressing them.

### Classes, records, properties, and methods

```csharp
public sealed class Player
{
    public string Name { get; }
    public int Score { get; private set; }

    public Player(string name) => Name = name;

    public void AddScore(int points) => Score += points;
}

public record ScoreEntry(string Name, int Score);
```

Classes model behavior and identity. Records are convenient for value-like data. Access modifiers control who can use a type or member. `private set` allows the class to change a property while preventing outside code from assigning it directly.

### Collections, LINQ, exceptions, and async

```csharp
List<int> scores = [10, 20, 30];
IEnumerable<int> highScores = scores.Where(score => score >= 20);

try
{
    await File.WriteAllTextAsync("score.txt", "30");
}
catch (IOException error)
{
    Console.Error.WriteLine(error.Message);
}
```

General orientation: prefer clear loops when debugging or performance matters, and use LINQ when its transformation expresses the intent cleanly. `async` and `await` represent asynchronous work; they do not automatically make CPU-heavy work faster. Catch exceptions at a boundary where the program can handle or report them meaningfully.

## Returner Checklist

- Install the .NET SDK, not just a runtime.
- Open a new PowerShell session and verify `dotnet --version` and `dotnet --info`.
- Create a throwaway console project and complete restore, build, and run.
- Read the `.csproj` before changing its target framework or package references.
- Use `dotnet add package` and inspect package compatibility before adopting a dependency.
- Enable nullable-aware coding and treat warnings as information about contracts.

## Sources

- [.NET download page](https://dotnet.microsoft.com/download/dotnet)
- [Microsoft .NET CLI overview](https://learn.microsoft.com/en-us/.NET/core/tools/command-line-interface/overview)
- [Microsoft runtime and SDK distinction](https://docs.microsoft.com/en-us/.NET/core/runtime-and-sdk-distinction)