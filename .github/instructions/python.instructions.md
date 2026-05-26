---
name: "Python Code Style"
description: "Python coding guidance for source files. Use when editing Python modules in this repository or in copied template repositories."
applyTo: "src/**/*.py"
---

# Python Code Style

Use these rules when editing Python source files in this repository or in a repository that copied these templates.

## Project Context

- Preserve the existing source layout unless the task explicitly changes it.
- Keep dependencies minimal and mainstream.
- Prefer the standard library unless a third-party dependency clearly simplifies the design.
- Use Python 3.12 features and modern type syntax when they improve clarity.

## General Style

- Keep modules focused on one responsibility.
- Keep functions and methods small and explicit about side effects.
- Use descriptive names over abbreviations.
- Favor straightforward control flow over clever abstractions.
- Preserve existing public APIs unless the task explicitly calls for a change.

## Typing and Documentation

- Add type hints to public functions and methods.
- Use `collections.abc` imports for container protocols such as `Sequence` and `Mapping`.
- Prefer `X | Y` unions over `Optional[X]` or `Union[X, Y]` when practical.
- Use `from __future__ import annotations` only when it improves forward references or keeps annotations clean.
- Keep public docstrings concise and behavior-focused.

## Imports and Dependencies

- Group standard library, third-party, and local imports.
- Prefer explicit imports over wildcard imports.
- Avoid lazy imports unless they are required to break an import cycle or defer an expensive optional dependency.

## Validation Expectations

When behavior changes, add or update tests under `tests/`.

Prefer this validation order when applicable:

1. focused `uv run pytest` slice
2. `uv run pytest`
3. `uv run mypy`
4. `uv run ruff check .`
5. `uv run ruff format --check .`