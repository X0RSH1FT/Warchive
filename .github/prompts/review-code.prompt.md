---
name: review-code
description: Warchive - Analyze provided code, identify bugs, suggest improvements, ensure adherence to architectural standards, and propose concrete fixes or refactoring steps.
argument-hint: "[Optional: specific file paths, function names, required standards (e.g., performance, security), or a bug report.]"
agent: Reviewer Agent
---

# Objective

- Thoroughly analyze the provided code context against best practices, architectural guidelines, and functional requirements.
- Identify all potential issues, including bugs, performance bottlenecks, security vulnerabilities, and deviations from established patterns (e.g., ArcaneCore's principles).
- Propose actionable, concrete improvements or fixes for every identified issue.
- Structure the review findings into a clear, prioritized report suitable for immediate implementation by an engineer.

# Directions

1. **Context Gathering:**
    *   If files are provided, use `read` and `grep` to understand the scope of the code being reviewed.
    *   If the task involves testing, dispatch the `Testing Agent` first to run relevant unit or integration tests against the current codebase state.
    *   If external standards (e.g., OWASP Top 10) are required, dispatch the `Web Research Agent`.

2. **Issue Identification & Analysis:**
    *   **Bugs/Correctness:** Check for logical errors, incorrect assumptions, or failure to meet stated requirements.
    *   **Maintainability:** Assess code clarity, adherence to Python standards (PEP 8), and modularity.
    *   **Architecture:** Verify that the code respects package seams and architectural boundaries defined in `src/arcane_core/`.
    *   **Security:** Look for common vulnerabilities (e.g., injection risks, improper input validation).

3. **Structuring the Review Report:**
    *   The output MUST be a structured markdown report containing three distinct sections: **Summary**, **Findings**, and **Proposed Changes**.
    *   **Summary:** A high-level, non-technical summary of the code's overall quality (e.g., "Good structure, but requires attention to error handling in X module").
    *   **Findings:** A detailed checklist of every issue found. Each finding must include:
        *   `[Severity]` (Critical, High, Medium, Low)
        *   `Issue Description`: What is wrong and why?
        *   `Location`: File path and line number range.
    *   **Proposed Changes:** For each finding, provide a concrete code snippet showing the *fix*, along with a brief explanation of *why* this change resolves the issue.

4. **Workflow Handoff:**
    *   After generating the report, if fixes are required, recommend dispatching the `Implementation Agent` to apply the proposed changes and then running the `Testing Agent` for validation.
    *   If documentation updates are needed due to architectural shifts revealed by the review, recommend dispatching the `Documentation Agent`.

# Example

```markdown
- Task: Review the new implementation of the combat kernel in src/arcane_core/world_systems/.
- Results: Identified a critical race condition when calculating damage and suggested using atomic operations. Updated the relevant function signature and provided unit tests for validation.
- Commit message: Fix race condition in world_system combat calculation.