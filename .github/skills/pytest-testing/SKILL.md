---
name: pytest-testing
description: Run and debug pytest tests when the current repository already has a Python and pytest surface. Use when testing modules, debugging test failures, creating new tests, running focused test slices, or working in an existing pytest-backed test tree.
argument-hint: "[test file path, node id, or pytest expression]"
---

# Pytest Testing

This skill provides the task-time workflow for running, debugging, and expanding a repository's pytest suite when that suite already exists.

Use it only after confirming that the repository already has a Python environment, pytest in the toolchain, and an actual test surface to run.

If the current repository does not already expose that surface, stop and confirm the intended validation path instead of assuming `tests/`, `pyproject.toml`, `src/`, or `uv`.

When present, it complements any file-scoped test instructions that already apply to the touched test files.

## Running Tests

Prefer the repository's documented pytest entrypoint. If the repo standard is unclear, confirm it before running commands.

### Basic Commands

- Full suite: `pytest`
- Verbose output: `pytest -v`
- Specific file: `pytest path/to/test_file.py`
- Specific test: `pytest path/to/test_file.py::test_name`
- Pattern matching: `pytest -k "pattern"`

### Collection and Debug

- Collect only: `pytest --collect-only`
- Stop on first failure: `pytest -x`
- Show print output: `pytest -s`
- Drop to debugger on failure: `pytest --pdb`

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
from package_name.cli import main


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
        [sys.executable, "-m", "package_name", "--version"],
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

Repository-specific anchors vary. Use the actual test files, package paths, and any applicable test instructions that exist in the current workspace.

## Validation Workflow

When source behavior changes:

1. run the smallest relevant pytest slice first
2. expand to the repository's broader pytest path if shared behavior or entry points changed
3. run adjacent typing, lint, or format checks only when the repository actually defines them

## Diagnostics

After editing tests, use editor diagnostics or `get_errors` to catch syntax and typing issues in the touched files.

## Troubleshooting

### Common Issues

1. Import errors: make sure the repository environment is current and the chosen pytest entrypoint matches local setup.
2. Entry-point failures: compare direct `main()` behavior with `python -m package_name` behavior.
3. Output mismatches: assert exact stdout and stderr where command-line behavior matters.
4. Over-broad tests: narrow the test slice before expanding to the full suite.

## CI Context

Keep local validation aligned with the repository's actual CI or documented validation path when one exists, unless the task needs a narrower or more specific test slice first.