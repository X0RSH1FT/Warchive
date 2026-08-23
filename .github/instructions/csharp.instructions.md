---
name: "C# Code Style"
description: "C# coding standards"
applyTo: "**/*.cs"
---

# C# Coding Guidance

Write clear, maintainable C# that follows the conventions already established by the surrounding code. Keep changes focused on the requested behavior and avoid introducing unnecessary dependencies, abstractions, or language features.

## Organization and Usings

- Keep one primary type per file when that improves discoverability and matches local conventions.
- Place using directives consistently with the surrounding project. Remove unused directives and avoid broad or unnecessary imports.
- Use file-scoped namespaces when they match local conventions. Keep namespace and folder organization coherent.
- Prefer existing project APIs and dependencies. Add a dependency only when it is necessary and consistent with the project's established approach.

## Compatibility

- Before introducing newer language or BCL features, verify the target project's target framework, C# language version, enabled nullable context, and package availability. This includes features such as records, `init`, file-scoped namespaces, `IAsyncDisposable`, and `await using`.
- Prefer the oldest supported syntax and API that satisfies the requirement when compatibility is uncertain. Do not assume that a compiler feature or framework API is available merely because it is available in the current development environment.

## Types and State

- Choose classes, structs, records, interfaces, and enums according to semantics rather than convenience. Use sealed types when inheritance is not part of the design.
- Prefer immutable state where practical. Use constructors or `init` accessors to establish required invariants, and expose mutation only where it is part of the contract.
- Use `readonly record struct` only for small, genuinely value-like data. It performs shallow copies: reference-type fields and collections are still shared. Use immutable members or explicit copying when independent snapshots are required.
- Keep constructors and methods responsible for preserving invariants. Validate inputs at boundaries and make invalid states difficult to represent.

## Nullability and Errors

- Treat nullable reference type warnings as design feedback. Do not silence them with null-forgiving operators unless the invariant is established and documented by the surrounding code.
- Prefer clear contracts using non-nullable types, nullable annotations, guards, and meaningful result types where appropriate.
- Throw specific exceptions for programmer errors or violated preconditions. Include useful context without exposing secrets. Use exceptions for exceptional conditions, not routine control flow.
- Preserve existing exception behavior and public contracts unless the change explicitly requires otherwise.

## Async, Disposal, and Collections

- Use `async` and `await` for asynchronous I/O and other naturally asynchronous work. Propagate cancellation with `CancellationToken` when the surrounding API supports it, and avoid blocking on tasks.
- Do not use `async void` except for framework-required event handlers. Observe tasks and handle failures at an intentional boundary.
- Dispose owned `IDisposable` and `IAsyncDisposable` resources deterministically. Use `using` or `await using` where appropriate, and make ownership explicit.
- Choose collections by required semantics and access patterns. Prefer interfaces such as `IReadOnlyList<T>` or `IReadOnlyCollection<T>` for read-only contracts, and avoid exposing mutable collections unnecessarily.
- Avoid needless allocations, repeated enumeration, and conversions in hot or frequently called paths, but prefer clarity unless profiling or a concrete constraint justifies more complexity.

## Security

- Validate and authorize untrusted inputs at system boundaries before processing them or using them to select resources or actions.
- Use parameterized or bound APIs instead of concatenating commands, queries, or paths from input.
- Avoid unsafe deserialization; use safe, constrained formats and types when deserialization is required.
- Never log secrets or sensitive data. Redact or minimize diagnostic context where necessary.
- Apply least privilege when accessing files, networks, or other external resources, and request only the permissions the operation requires.

## Naming and Documentation

- Use descriptive PascalCase names for types, methods, properties, events, and constants; camelCase for locals and parameters; and an established convention for private fields.
- Name booleans as clear predicates, and use terminology consistently with the domain and existing APIs.
- Add concise XML documentation to public types and members when their purpose, contract, side effects, or invariants are not obvious. Keep comments focused on why, constraints, or non-obvious behavior rather than restating code.

## Organization and Formatting

- Follow the repository's established formatting, brace, modifier, ordering, and line-length conventions. Do not impose a new style in a focused change.
- Keep formatting changes separate from behavioral changes when practical, and avoid unrelated reformatting.
- Prefer small methods with one clear responsibility. Use explicit control flow when it makes behavior easier to verify; do not compress code merely to reduce line count.
- Preserve public APIs and compatibility unless the task requires a breaking change. Update callers and documentation when a contract changes.

### Region Comments

Use `# region <Name>` and `# endregion` to organize code into logical sections.

Common regions: `Imports`, `Enum`, `Static`, `Properties`, `Constructor`, `Functions`, `Operations`, `Accessors`, `Tests`, `Fixtures`

## Validation

- Discover the repository's established format, analyzer, build, and test commands from its configuration, scripts, documentation, and neighboring instructions.
- Run the narrowest relevant validation first, then the broader checks required by the repository or the change's risk. Do not invent commands or claim a tool is available without evidence.
- Review the diff for unintended formatting, API, dependency, and behavior changes. Report unavailable or skipped validation clearly.
