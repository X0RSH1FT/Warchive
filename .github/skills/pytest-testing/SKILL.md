---
name: pytest-testing
description: Run and debug pytest tests for Glyphmancer. Use when testing modules, debugging test failures, creating new tests, running focused test slices, or working with files under tests/.
argument-hint: "[test file path, node id, or pytest expression]"
---

# Pytest Testing for Glyphmancer

This skill provides the task-time workflow for running, debugging, and expanding Glyphmancer's pytest suite.

It complements the automatic file-scoped rules in `.github/instructions/test.instructions.md`, which own terse test authoring conventions for files under `tests/`.

## Running Tests

All test operations use `uv run pytest`.

### Basic Commands

- Full suite: `uv run pytest`
- Verbose output: `uv run pytest -v`
- Specific file: `uv run pytest tests/test_package.py`
- Specific test: `uv run pytest tests/test_package.py::test_cli_prints_named_greeting`
- Pattern matching: `uv run pytest -k "pattern"`

### Collection and Debug

- Collect only: `uv run pytest --collect-only`
- Stop on first failure: `uv run pytest -x`
- Show print output: `uv run pytest -s`
- Drop to debugger on failure: `uv run pytest --pdb`

## When To Use This Skill

Use this skill when the work is primarily about:

- choosing the right pytest command or slice
- reproducing or debugging a failing test
- deciding when to widen from a focused test to the full suite
- validating CLI or entry-point behavior through pytest or subprocess checks
- understanding the repository's testing and CI execution path

## Common Patterns

### CLI Tests

Use direct function calls for fast checks when possible, then fall back to subprocess calls for real entry-point coverage.

```python
from glyphmancer.cli import main


def test_cli_prints_named_greeting(capsys):
    exit_code = main(["Ada"])

    assert exit_code == 0
    assert capsys.readouterr().out == "Hello, Ada.\n"
```

### Subprocess Entry-Point Tests

Use subprocess tests when the module entry point or installed script behavior matters.

```python
import subprocess
import sys


def test_module_entry_point_exits_cleanly_for_version():
    result = subprocess.run(
        [sys.executable, "-m", "glyphmancer", "--version"],
        capture_output=True,
        check=False,
        text=True,
    )

    assert result.returncode == 0
    assert result.stderr == ""
```

### Parametrized Tests

Use `pytest.mark.parametrize` for small tables of inputs and expected behavior.

```python
import pytest


@pytest.mark.parametrize(
    ("name", "expected"),
    [
        ("Ada", "Hello, Ada."),
        ("   ", "Hello, world."),
    ],
)
def test_greet_variants(name: str, expected: str) -> None:
    assert greet(name) == expected
```

## Repository Anchors

Current repository examples:

- package-level behavior and CLI entry points in `tests/test_package.py`
- source modules under `src/glyphmancer/`

When editing actual test files, follow the conventions in `.github/instructions/test.instructions.md` for naming, assertions, and fixture scope.

## Validation Workflow

When source behavior changes:

1. run the smallest relevant pytest slice first
2. expand to `uv run pytest` if shared behavior or entry points changed
3. run `uv run mypy`
4. run `uv run ruff check .`
5. run `uv run ruff format --check .`

## Diagnostics

After editing tests, use editor diagnostics or `get_errors` to catch syntax and typing issues in the touched files.

## Troubleshooting

### Common Issues

1. Import errors: run `uv sync` and make sure the package environment is current.
2. Entry-point failures: compare direct `main()` behavior with `python -m glyphmancer` behavior.
3. Output mismatches: assert exact stdout and stderr where command-line behavior matters.
4. Over-broad tests: narrow the test slice before expanding to the full suite.

## CI Context

The current CI workflow runs:

1. `uv sync --all-groups --locked`
2. `uv run mypy`
3. `uv run ruff check .`
4. `uv run ruff format --check .`
5. `uv run pytest`

Keep local validation aligned with that default path unless the task needs a narrower or more specific test slice first.