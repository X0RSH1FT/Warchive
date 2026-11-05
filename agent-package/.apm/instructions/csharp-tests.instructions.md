---
name: "C# Test Conventions"
description: "Testing patterns and conventions for C# test files"
applyTo: "tests/**/*.cs"
---

# C# Test Conventions

Testing conventions for the C# test suite. Use the repository's established test framework and project layout when they differ from the examples below.

## Guidance

- When code changes, add or update relevant tests.
- Keep tests under `tests/` and keep test projects aligned with repository conventions.
- Keep unit tests isolated, deterministic, and fast.
- Test externally visible behavior, including returned values, state changes, and other expected effects.
- Keep integration and end-to-end tests clearly separated when the repository uses those categories.

## Naming

- File names: `<Feature>Tests.cs` (for example, `ParserTests.cs`)
- Class names: `<Feature>Tests`
- Test method names: `Should<ExpectedBehavior>When<Condition>` or another established repository convention.
- Name test data and fixtures after the behavior or scenario they represent.

## Layout

- Group related tests in descriptive test classes.
- Keep shared fixtures in the test project's established fixture location; keep one-use setup close to the test that needs it.
- Keep setup, test execution, and assertions easy to distinguish.
- Keep test projects, source files, and test-specific helpers under the repository's established `tests/` layout.

## Assertions

- Prefer assertions on externally visible behavior rather than implementation details.
- Use the assertion APIs provided by the repository's established test framework.
- Include useful expected and actual values when the framework supports them.
- For error paths, assert the expected exception type and verify important message or state details only when they are part of the contract.
- Use parameterized or data-driven tests when the same behavior must be checked across several inputs.

## Style

- Follow the repository's established C# formatting, nullable, analyzer, and language-version conventions.
- Keep test methods focused on one behavior and avoid unnecessary branching.
- Prefer clear local names over compressed test code.
- Use `async` and `await` for asynchronous APIs; do not block on tasks in tests.
- Keep test data minimal and make important scenario differences explicit.

## Comments

- Add a short comment or documentation string only when the test setup or scenario is not obvious from the name.
- Keep comments rare and explain deterministic ordering, regression context, or unusual fixtures rather than restating the test.

## Example

The example uses xUnit syntax. Use equivalent attributes and assertions from the repository's established test framework when it differs.

```csharp
using Xunit;

public sealed class ParserTests
{
    [Fact]
    public void ShouldReturnEmptyResultWhenInputIsBlank()
    {
        var result = Parser.Parse(string.Empty);

        Assert.Empty(result);
    }

    [Theory]
    [InlineData("one", 1)]
    [InlineData("one,two", 2)]
    public void ShouldCountItemsWhenInputContainsValues(string input, int expectedCount)
    {
        var result = Parser.Parse(input);

        Assert.Equal(expectedCount, result.Count);
    }

    [Fact]
    public void ShouldThrowWhenInputIsInvalid()
    {
        var exception = Assert.Throws<ArgumentException>(() => Parser.Parse("invalid"));

        Assert.Contains("invalid", exception.Message);
    }
}
```

## Running Tests

Use the repository's established SDK, solution, and test framework commands. The project name and framework packages come from repository conventions.

```bash
# Full suite
dotnet test

# Test project
dotnet test tests/<TestProject>.csproj

# Filter a test by its fully qualified name or another supported test property
dotnet test tests/<TestProject>.csproj --filter "FullyQualifiedName~<TestName>"

# List discovered tests
dotnet test tests/<TestProject>.csproj --list-tests
```

## Installation

- Use the repository's documented .NET SDK and restore workflow.
- Add test framework, adapter, assertion, or coverage packages only through the test project's established package management conventions.
- Do not assume a package manager, framework, adapter, or SDK version that the repository does not already specify.

## Configuration

- Keep test project settings in the repository's established project files and solution configuration.
- Configure test discovery, parallelization, traits, coverage, and test data through the established framework and repository conventions.
- Keep test-only dependencies and configuration scoped to test projects where practical.