---
name: increment-python-project-version
description: Increment the Python project version in `pyproject.toml` for this repository or another Python project that uses `[project].version` as the source of truth. Use when you explicitly want a version bump handled as a focused workflow.
argument-hint: "[Optional: exact version, bump type (patch/minor/major), target project path, related release note/doc updates, or version surfaces to keep in sync.]"
agent: Coordinator Agent
---

1. Treat this prompt as an explicit version-bump workflow. Do not bundle unrelated implementation work into the same pass unless the user asks for it.
2. Start by identifying the target project root and the authoritative `pyproject.toml` that owns `[project].version`. If the current repository is not clearly a Python project or no owning `pyproject.toml` is obvious, stop and ask for the target project path instead of guessing.
3. If the target path, authoritative `pyproject.toml`, or desired version change is unclear, use `#askQuestions` before dispatching. Ask whether the user wants an exact version or a semantic bump (`patch`, `minor`, or `major`), explain why the choice matters, recommend the smallest sensible bump by default, and keep freeform input enabled.
4. If the repository has multiple plausible version surfaces, confirm which `pyproject.toml` owns the package metadata before editing and treat that file as the source of truth unless the user explicitly says otherwise.
5. Route to `Implementation Agent` for the edit only after the target version and owning `pyproject.toml` are both confirmed.
6. During implementation:
   - read the current version from `pyproject.toml`
   - compute the requested increment or apply the exact requested version
   - update `[project].version` exactly once
   - only update mirrored version strings in docs, examples, release surfaces, or automation-owned files when the repository already keeps them aligned or the user explicitly asks for that follow-up
7. Reject invalid or non-monotonic version targets unless the user explicitly asks to set that exact value and understands the consequence.
8. After the edit, run the narrowest useful validation for the changed surface. Prefer a focused read or metadata check that confirms `pyproject.toml` parses and the new version is present.
9. If the version bump should also update release notes or packaging docs, ask whether a follow-up `Documentation Agent` pass should update those doc-owned surfaces too.
10. Summarize the old version, the new version, any additional synced surfaces, and the validation that was run.
11. Provide a concise, imperative commit message scoped to the version bump.

Example response shape:
- Target: `pyproject.toml` at the project root.
- Version change: `0.4.2` -> `0.4.3`.
- Additional synced surfaces: none.
- Validation: parsed `pyproject.toml` successfully, confirmed the new `[project].version` value is present, and checked clean file diagnostics.
- Commit message: Bump project version to 0.4.3.