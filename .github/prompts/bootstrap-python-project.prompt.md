---
name: bootstrap-python-project
description: Bootstrap a new Python project using this repository as a reusable baseline for environment setup, quality gates, editor tasks, Copilot customizations, CI, and baseline docs.
argument-hint: "[Target folder, project name, package name, project type, audience, optional extras, or baseline constraints.]"
agent: Coordinator Agent
---

1. Treat this as full-project scaffolding work, not as a request for a single file.
2. Start by identifying the concrete bootstrap target: project folder, project name, package name, project type, and whether the destination is empty.
3. If any of that is missing, use `#askQuestions` before dispatching. Explain why each decision matters, describe the options in plain language, recommend a default when one exists, and keep freeform input enabled.
4. If the destination is empty and a full project scaffold is the fastest safe path, prefer an existing project-setup workflow or explicit setup instructions that are actually available in the current environment before creating files one by one.
5. Use this repository as a source of reusable patterns rather than as a fully mirrored Python baseline, and carry forward only the parts that are broadly applicable to the new Python project:
    - Python project metadata, environment setup, and package-management patterns that fit the new project
    - quality-gate patterns for tests, linting, formatting, typing, dependency hygiene, and builds when applicable
    - editor-task and workspace-setting patterns such as `.vscode/tasks.json` and `.vscode/settings.json` when they are present in the source repo and help the target workspace
    - repository-scoped Copilot instructions such as `.github/copilot-instructions.md` when they are present in the source repo
    - scoped `.github/instructions/` files when they are present in the source repo
    - reusable `.github/agents/`, `.github/prompts/`, and `.github/skills/` patterns when they are present in the source repo and fit the new project
    - CI patterns such as `.github/workflows/` and any other applicable automation setup when they are present in the source repo
    - `README.md`, `docs/`, `tests/`, and other project structure patterns when those surfaces add value
6. Adapt copied patterns to the new project's shape instead of blindly mirroring repo-specific names, commands, docs, or runtime assumptions.
7. Build a short plan with `#todo` when the bootstrap spans multiple stages such as planning, scaffolding, docs, testing, and review.
8. Route to `Planner Agent` first when the new project type or carried-forward surface is ambiguous enough that file targeting, acceptance criteria, or sequencing needs to be made explicit.
9. Route to `Implementation Agent` for the actual scaffolding pass once the target shape is clear.
10. During implementation, create the smallest complete repository that still includes a usable development environment:
    - base package or script layout
    - dependency groups and dev tooling
    - test configuration
    - lint, format, and type-check setup
    - build or packaging setup when the project is distributable
    - editor settings and tasks
    - Copilot customization files that match the project scope
    - CI workflow and smoke checks that match the exposed entry points
11. Prefer `src/` layout for distributable packages unless the user explicitly asks for a different structure.
12. Prefer `pytest`, `ruff`, and `mypy` as baseline quality gates for normal Python projects, and add `pyright`, `deptry`, import-linter contracts, or packaging smoke checks when they are justified by the project shape.
13. Add minimal but real starter coverage: at least one focused test, one smoke command for the main entry point when the project has one, and a README that explains setup and validation.
14. If the project needs documentation structure, default to:
    - `README.md` for overview and quickstart
    - `docs/research/` or another existing docs surface for durable reference, research, and customization notes
    - an existing planning-notes surface for active planning notes when the project needs one
    - `#askQuestions` before inventing extra docs buckets when the destination already has a docs layout
15. If optional additions would materially help, surface them with `#askQuestions` before implementation or before the last editing pass. Good candidates include pre-commit hooks, release workflows, dev containers, example env files, docs indexes, import-linter contracts, and review-focused prompt or agent files.
16. After scaffolding, validate the new project with the narrowest commands that prove the environment works, then widen to the intended quality-gate path.
17. Summarize what was created, what was adapted from the baseline repository, what was intentionally skipped, and any manual follow-up the user still needs to do.
18. Provide a concise, imperative commit message scoped to the created bootstrap surface.

Example response shape:
- Target: `I:\Work\sample-app`, package `sample_app`, CLI-oriented Python project.
- Created: `pyproject.toml`, `src/sample_app/`, `tests/`, `.vscode/`, and `.github/` baseline files.
- Adapted from baseline: `pytest`, `ruff`, `mypy`, editor tasks, and repository-scoped Copilot instructions.
- Validation: environment setup check plus one focused test and one lint pass.
- Skipped: release workflow and dev container until the project needs them.
- Manual follow-up: create the virtual environment and install the dev dependency group.
- Commit message: Bootstrap sample-app Python project baseline.