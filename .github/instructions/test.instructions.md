---
name: "Test Conventions"
description: "Pytest conventions for test files. Use when editing files under tests/ in repositories that expose a pytest surface."
applyTo: "tests/**/*.py"
---

# Test Conventions

Use these rules when editing or creating tests in repositories that expose a pytest-backed `tests/` tree.

This file is the automatic, file-scoped policy for `tests/` when that directory exists. Command recipes, debugging flow, and broader pytest workflow guidance live in `.github/skills/pytest-testing/SKILL.md`.

## Test Structure

- Keep test files under `tests/`.
- Name test functions `test_<behavior>_<scenario>` when the extra context improves readability.
- Keep each test focused on one behavior or contract.
- Prefer `pytest.mark.parametrize` for simple input and output tables.

## Assertions

- Assert the most important behavior directly.
- Prefer specific assertions over broad truthiness checks.
- When checking CLI behavior, assert both exit behavior and captured output when practical.
- When testing subprocess entry points, assert return code, stdout, and stderr explicitly.

## Fixtures

- Use fixtures only when they reduce duplication or clarify setup.
- Keep fixture scope as small as practical.
- Prefer local fixtures over broad shared fixtures until reuse becomes clear.

## Validation Expectations

- Update or add tests whenever source behavior changes.
- Run the smallest relevant pytest slice first.
- Run the full suite when shared behavior or package entry points change.
- Use the pytest skill for broader command selection, troubleshooting, and repo-level validation flow.