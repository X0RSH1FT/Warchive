# Building a C# Module Test Framework for Godot

Scope: A research-backed design note for testing reusable C# modules used by Godot projects and for converting Python libraries and their behavioral tests into C#; recommendations require validation against the chosen Godot, .NET, and test-framework versions.

Audience: Developers designing a maintainable Godot C# codebase, its automated tests, and a staged migration from Python libraries.

Last updated: 2026-07-25

Research fetch date: 2026-07-25

## Executive Recommendation

Keep domain and application logic in ordinary C# projects with no Godot dependency. Expose that logic to Godot through a thin adapter layer, and test the adapter and scene integration separately in a Godot project. Run the ordinary .NET tests quickly and frequently; run Godot integration tests in a separately configured job that exercises the actual engine runtime. This is a design recommendation, not a claim that every Godot version or test runner supports the same invocation details.

For a Python-to-C# migration, preserve observable behavior before translating syntax. Inventory the Python API and tests, write characterization tests where behavior is unclear, map dependencies, then implement explicit C# interfaces and types behind the same behavioral contract. Treat dynamic dispatch, decorators, duck typing, exceptions, iteration, equality, mutability, numeric behavior, and asynchronous code as semantic translation risks rather than mechanical conversion tasks.

## Evidence Boundary

Upstream verification is incomplete: the supplied Godot and Microsoft endpoints returned HTTP 404. This note is therefore an architectural decision guide, not a version-specific Godot setup guide. No Godot major or minor version, target platform, or NUnit version has been verified; verify those choices before implementation.

The supplied research retrieved the [Microsoft .NET download page](https://dotnet.microsoft.com/en-us/download/dotnet), which provides broad current-version and long-term-support guidance. It does not establish the exact SDK, target framework, or Godot compatibility required for a particular project.

The [NUnit homepage](https://nunit.org/) was reviewed at a high level. No deep NUnit API, adapter, or command-line behavior was verified for this document. The layout below therefore describes test-project responsibilities and boundaries, not a version-specific NUnit configuration.

The attempted Godot C# URL `https://godotengine.org/manual/getting-started/scripting/csharp` and the attempted Microsoft unit-test-project URL `https://docs.microsoft.com/en-us/dotnet/core/testing/unit-test-projects` returned HTTP 404 during the supplied research. They are recorded under [Verification Gaps](#verification-gaps), not used as confirmation.

## Recommended Layered Layout

Consider using project references to make dependencies point inward toward code that is easier to run without an engine. Names are illustrative; confirm the exact Godot project and solution arrangement for the selected Godot version.

```text
src/
  Game.Core/                 # Pure domain rules, value types, ports, algorithms
  Game.Application/          # Use cases and orchestration over Core abstractions
  Game.Godot/                # Node, Resource, scene, signal, input, and runtime adapters
tests/
  Game.Core.Tests/            # Standard .NET unit tests for deterministic core behavior
  Game.Application.Tests/     # Standard .NET tests with fakes or mocks at ports
  Game.Godot.Integration/     # Godot project/scenes and engine-backed integration tests
  TestFixtures/               # Shared test data only when ownership is unambiguous
```

Recommended dependency direction:

```text
Game.Core <- Game.Application <- Game.Godot
    ^              ^                 ^
Core.Tests   Application.Tests   Godot.Integration
```

It may be useful to keep `Game.Core` independent of `Godot` types. Define ports such as clock, filesystem, random source, message bus, or persistence gateway in the pure layers; implement them in `Game.Godot` or a test double. This can keep most behavior testable with a standard .NET test project and avoid requiring a scene tree for every assertion. The separation is a local architecture recommendation, not an upstream Godot requirement verified by the supplied sources.

  ## Minimal Pure C# Example

  This example exercises a small `Game.Core` domain object without Godot. It can be placed in a standard .NET solution before any Godot project or adapter is introduced.

  Create the solution and projects from PowerShell or another Windows command shell:

  ```powershell
  dotnet new sln -n Game --format sln
  dotnet new classlib -n Game.Core -o src/Game.Core
  dotnet new nunit -n Game.Core.Tests -o tests/Game.Core.Tests
  dotnet sln Game.sln add src/Game.Core/Game.Core.csproj
  dotnet sln Game.sln add tests/Game.Core.Tests/Game.Core.Tests.csproj
  dotnet add tests/Game.Core.Tests/Game.Core.Tests.csproj reference src/Game.Core/Game.Core.csproj
  dotnet add tests/Game.Core.Tests/Game.Core.Tests.csproj package NUnit
  dotnet add tests/Game.Core.Tests/Game.Core.Tests.csproj package NUnit3TestAdapter
  dotnet add tests/Game.Core.Tests/Game.Core.Tests.csproj package Microsoft.NET.Test.Sdk
  dotnet test Game.sln
  ```

  The `Game.Core` project can contain a deterministic domain object such as this inventory:

  ```csharp
  using System.Collections.Generic;

  namespace Game.Core;

  public sealed class Inventory
  {
    private readonly List<string> items = new();

    public int Count => items.Count;

    public void AddItem(string item)
    {
      items.Add(item);
    }
  }
  ```

  The `Game.Core.Tests` project can reference that assembly with a project reference and test it through an NUnit fixture:

  ```csharp
  using Game.Core;
  using NUnit.Framework;

  namespace Game.Core.Tests;

  public sealed class InventoryTests
  {
    [Test]
    public void AddItemIncreasesCount()
    {
      var inventory = new Inventory();

      inventory.AddItem("potion");

      Assert.That(inventory.Count, Is.EqualTo(1));
    }
  }
  ```

  In C#, tests reference project assemblies through `.csproj` project references and `using` namespace directives; this is not Python-style module importing. A test method can technically be called like an ordinary method, but invoking the test project through `dotnet test` and its test runner is the intended mechanism because it provides discovery, assertions, reporting, and process exit status.

## Unit and Godot Integration Boundaries

### Standard .NET unit tests

A reasonable unit-test boundary is deterministic rules and contracts that do not need an engine process, scene tree, imported resources, rendering, physics, input dispatch, node lifecycle, or Godot serialization. Small fakes may help with stable boundary behavior; mocks are most useful where interaction verification adds evidence. Test invalid inputs, state transitions, error outcomes, and edge cases at the owning pure-C# abstraction.

Typical unit-test subjects include:

- Parsers, planners, state machines, scoring, and data transformations.
- Application services with injected ports.
- Conversion and validation rules for data that will later be represented by Godot resources or nodes.
- Contract tests for adapters, using test doubles for clocks, storage, or external services.

### Godot integration tests

Integration tests are appropriate when behavior depends on the actual engine boundary: loading a project or scene, constructing a `Node` tree, entering the scene tree, signal delivery, resource loading, input routing, physics stepping, or interactions among C# scripts and Godot objects. Keep these tests few enough to diagnose and maintain, and assert observable runtime behavior rather than duplicating every pure-core assertion.

An integration test may load a minimal fixture scene, inject controlled inputs or test doubles where the engine permits it, wait for the relevant lifecycle boundary, and assert the resulting node state or emitted event. Keeping fixtures small and naming the Godot version, renderer assumptions, and required export/runtime assets can make results easier to maintain when those factors affect the result.

## Test Strategy and CI Caveats

1. **Fast feedback:** A project could run pure test projects with `dotnet test` using the repository's pinned SDK and target framework once selected. Treat this as a recommended shape, not a verified command for this repository, which currently contains documentation rather than a C# solution.
2. **Boundary coverage:** Running adapter tests separately from engine-backed tests may make it easier to identify whether a defect is in domain logic, an adapter, or runtime wiring.
3. **Godot job:** Choosing an executable Godot integration-test harness or runner is an open prerequisite. This document cannot identify a canonical runner from the verified sources. The decision should be based on the selected Godot version, supported C# tooling, CLI/headless behavior, and a minimal scene smoke test that demonstrates discovery, launch, assertions, and exit status.
4. **Reproducible toolchain:** A project could pin or otherwise record the Godot version, .NET SDK, target framework, test framework, test adapter, and any test harness. The Microsoft download page may provide broad SDK/LTS orientation, while version-specific primary documentation should confirm compatibility before implementation.
5. **CI diagnostics:** It is useful to preserve test logs, engine output, exit codes, and failed fixture names, and to separate environment failures such as missing export templates or display/runtime support from product-test failures.
6. **Parallelism caution:** Engine-backed tests may not be safe to run in parallel. Shared project state, ports, global engine state, filesystem fixtures, or scene-tree timing may make serial execution appropriate.

Headless execution is a caveat, not a universal solution: a headless process may still need the correct .NET-enabled Godot build, project import state, native libraries, writable directories, and valid command-line integration with the selected test harness. The project should validate this in a small smoke test before making it a required CI gate. The harness choice remains open until that evidence is available.

## Python-to-C# Migration Workflow

### 1. Capture the behavioral contract

Inventory public functions, classes, modules, configuration, side effects, exceptions, ordering guarantees, serialization formats, and supported input types. Port representative tests and expected outcomes before porting implementation details. Where the Python behavior is accidental or undocumented, add a characterization test and record the decision rather than silently choosing a new behavior.

### 2. Map tests to C# responsibilities

For every Python test, record its setup, input, expected output or exception, state changes, external calls, and time/randomness assumptions. Move pure examples to `Game.Core.Tests` or `Game.Application.Tests`; reserve Godot integration coverage for behavior that genuinely crosses the engine boundary. Keep a mapping from the original test name to the new test until parity is reviewed.

### 3. Map dependencies before implementation

Create a dependency table with the Python package, the capability used, the proposed .NET SDK or NuGet equivalent, the API translation, licensing status, maintenance status, and unresolved differences. A package name match is not proof of API or behavioral equivalence. Review each dependency's license and redistribution terms before adopting it, and prefer a smaller native .NET or framework capability when it meets the contract.

### 4. Translate behavior into explicit C# contracts

Replace duck-typed collaborators with interfaces or concrete contracts where the boundary is stable. Use explicit result types, exceptions, discriminated representations, or validation objects according to the existing error contract. Keep the first implementation boring and testable; optimize only after parity tests identify a need.

### 5. Address language-semantic risks deliberately

Review each port for:

| Python behavior | C# risk to examine |
|---|---|
| Duck typing and dynamic attributes | Compile-time member visibility, interface contracts, and runtime casts may change accepted inputs. |
| Decorators and metaclasses | Attributes do not automatically reproduce wrapping, registration, or execution-time transformation. |
| `None`, truthiness, and sentinel values | `null`, nullable value types, pattern matching, and explicit predicates may distinguish cases Python collapsed. |
| Mutable lists, dictionaries, and object identity | Copy/reference behavior, collection interfaces, equality, and hashing may differ. |
| Python integers and numeric coercion | C# integral overflow, floating-point conversions, decimal choices, and division rules need explicit tests. |
| Iterators and generators | `IEnumerable<T>`, deferred execution, disposal, and multiple enumeration can alter timing and side effects. |
| Exceptions and context managers | Exception types, cleanup, cancellation, and `using`/`await using` behavior need parity tests. |
| Async code and event loops | `Task`, cancellation tokens, synchronization contexts, and scheduling are not a direct syntax conversion. |
| Import-time registration and module globals | Static initialization and dependency injection can change ordering and test isolation. |

### 6. Integrate with Godot last

Once the pure C# behavior is covered, add the Godot adapter. Translate Python-facing concepts into Godot-native boundaries only where needed: nodes and scenes, resources, signals, input, lifecycle methods, or engine services. Add a small number of scene-based tests to prove the adapter contract, then run both pure and integration suites in CI.

## Implementation Checklist

Use the [Python-to-C# Migration Workflow](#python-to-c-migration-workflow) as the implementation checklist. Completion requires that the workflow's behavioral contract, dependency review, semantic-risk review, pure-layer tests, Godot adapter, and integration evidence are documented for the chosen versions. Before implementation, also record the selected Godot version, target platform, .NET/C# toolchain, test framework, adapter, and executable integration harness, and pass the minimal scene smoke test described in [Test Strategy and CI Caveats](#test-strategy-and-ci-caveats).

## Sources

- [Microsoft .NET download](https://dotnet.microsoft.com/en-us/download/dotnet) — retrieved during the supplied 2026-07-25 research; used only for broad current-version and LTS guidance.
- [NUnit](https://nunit.org/) — reviewed at a high level during the supplied research; no deep API or adapter details are asserted here.
- [Godot C# URL attempted during research](https://godotengine.org/manual/getting-started/scripting/csharp) — returned HTTP 404; listed for verification tracking only.
- [Microsoft unit-test-projects URL attempted during research](https://docs.microsoft.com/en-us/dotnet/core/testing/unit-test-projects) — returned HTTP 404; listed for verification tracking only.

## Verification Gaps

- Confirm the current official Godot C# documentation URL and the exact .NET SDK/target-framework requirements for the selected Godot release.
- Confirm the supported Godot C# integration-test harness, test discovery model, headless flags, renderer requirements, and CI exit-code behavior for that release.
- Confirm current NUnit package, adapter, lifecycle, assertion, and parallelization APIs before writing a concrete NUnit configuration.
- Confirm the current Microsoft documentation URL and version-specific guidance for creating and running .NET unit-test projects.
- Validate every Python dependency replacement against the package's current API, license, runtime support, and behavioral differences.