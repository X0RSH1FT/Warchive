---
name: initialize-docs
description: Warchive - Coordinate the comprehensive initialization or full refresh of core durable documentation for a codebase project, ensuring all key architectural and functional areas are covered.
argument-hint: "[Target codebase/project name, initial scope (e.g., 'API layer', 'Core data model'), or specific components to document.]"
agent: Coordinator Agent
---

# Objective

The goal of this pass is to establish a complete, durable documentation surface for a new or significantly refreshed codebase project. This process must be systematic, ensuring that all core architectural concerns are documented before proceeding to usage guides or feature-specific details.

1. **Scope Definition:** If no scope is provided, use `Explorer Agent` and `#askQuestions` to define the boundaries of the documentation effort (e.g., which modules, APIs, or features must be covered).
2. **Architectural Deep Dive:** Dispatch `Explorer Agent` first to gather context on the codebase structure (`src/`, package seams, etc.). This forms the basis for the durable reference material.
3. **Core Documentation Pass:** Coordinate the documentation process using a structured workflow:
    a. **Architecture & Design:** Document high-level concepts, data flow, and major components (Targeting `docs/app/architecture.md` or similar).
    b. **API/Interface Definition:** Detail all public interfaces (CLI commands, API endpoints, function signatures) (Targeting `docs/app/interfaces.md`).
    c. **Data Model & Persistence:** Document the core data structures and persistence contracts (Targeting `docs/app/data-model.md`).
    d. **Usage & Workflow:** Create guides on how to use the system, including setup and basic examples (Targeting `README.md` or a dedicated usage guide).
4. **Review and Validation:** After drafting each major section (Architecture, API, Data Model), dispatch the `Reviewer Agent` to identify gaps, inconsistencies, or missing cross-references against the codebase structure gathered in Step 2.
5. **Finalization:** Once all core areas are documented, update the relevant index files (`README.md`, `docs/app/index.md`) and provide a summary of the completed documentation surface.

# Directions

1. **Initial Context Gathering:** Always start by running an initial context pass using `Explorer Agent` to map out the codebase structure and identify key source files, ensuring all subsequent documentation is source-anchored.
2. **Structured Documentation Flow:** Treat the process as a multi-stage handoff:
    *   **Architecture $\rightarrow$ Data Model $\rightarrow$ Interfaces $\rightarrow$ Usage.** Do not attempt to document usage before defining the underlying architecture and data contracts.
3. **Handling Gaps:** If the documentation pass discovers that a critical fact (e.g., an API endpoint, a core concept) is missing from the source code or existing docs, *do not assume*. Instead, use `#askQuestions` to confirm if this gap should be documented, and route the follow-up work to `Implementation Agent` if it requires code changes.
4. **Cross-Referencing:** When updating documentation, explicitly check and update all relevant index files (`README.md`, `docs/app/*`) to ensure they point to the newly created or updated sections.
5. **Output Contract:** The final output must be a cohesive set of durable documents that can serve as the single source of truth for new contributors.

# Example

```markdown
- Task: Initialize documentation for the 'Social Dynamics' module, covering data models, API endpoints, and usage examples.
- Results: Created/updated `docs/app/social_dynamics.md`, updated README.md with a link to the new section, and confirmed all Pydantic models are documented in social.
- Commit message: Initialize documentation for Social Dynamics module.
```