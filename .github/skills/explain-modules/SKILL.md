---
name: explain-modules
description: "Create a source-grounded developer Markdown walkthrough for an implemented module, feature, or process. Use when explaining architecture, contracts, relationships, runtime flow, lifecycle, errors, or tests with meaningful Mermaid diagrams."
argument-hint: "[Module, feature, process, or source path to document]"
---

# Explain Modules

Create a durable, developer-facing walkthrough of implemented behavior. The walkthrough must be grounded in the target repository's source and tests, not in assumptions or ticket language.

## Use When

- A maintainer needs an architecture or code walkthrough for an implemented module or feature.
- A repository needs developer documentation for a process, data flow, lifecycle, or integration.
- A change needs source-linked explanations of types, contracts, errors, and verification.

Do not use this skill to invent a design for unimplemented work. If the requested behavior is not present in source, state that it is unknown or not implemented and identify the evidence inspected.

## Workflow

1. **Establish scope.** Start with the named path, symbol, entry point, or user-visible behavior. Read the owning source, its callers, configuration, public interfaces, and the most relevant tests. Inspect only enough surrounding code to trace the feature end to end.
2. **Separate facts from gaps.** Record source-backed claims with repository-relative links such as `[Handler.Run](../src/Handler.cs#L42-L68)`. Verify each link target and line range before finalizing. Label absent, ambiguous, external, or unverified behavior as **Unknown**, **Not found**, or **Inferred** (with the reason); never present it as fact.
3. **Choose the document home.** Follow the target repository's existing documentation convention and the nearest owning README or documentation index. Put durable developer reference material in that convention's durable reference location, not in temporary notes, change logs, or an inbox. If no convention exists, propose a location and ask before creating a new documentation taxonomy.
4. **Write the walkthrough.** Use concise sections appropriate to the evidence:
   - purpose, scope, non-goals, and entry points;
   - architecture, responsibilities, properties, and relationships;
   - important types, data structures, APIs, configuration, and contracts;
   - a detailed end-to-end runtime flow, including inputs, transformations, side effects, and outputs;
   - errors, validation, recovery, resource ownership, startup/shutdown, or lifecycle when they apply;
   - usage examples and testing/verification, linked to real tests or commands.
5. **Add useful developer visuals.** Include multiple Mermaid diagrams when the source supports them. Select diagrams that explain different decisions or flows, for example:
   - an architecture/component diagram for ownership and dependencies;
   - a relationship diagram for key types, data, or interfaces;
   - a sequence diagram for the runtime path;
   - a state or lifecycle diagram when state transitions, initialization, cleanup, retries, or disposal matter.

   Every diagram must name real source concepts and add information the prose does not convey as clearly. Omit a diagram that would merely repeat a heading, show a trivial linear list, or require invented relationships. Explain any diagram notation that could be ambiguous.
6. **Review and validate.** Re-read source links, symbols, commands, and diagram labels against the repository. Confirm that the stated scope is covered, links resolve, Mermaid blocks are syntactically plausible, and unknowns remain explicitly labeled. Run the repository's focused documentation or Markdown checks when available.

## Documentation Shape

Use this outline unless the target repository already owns a better format:

```markdown
# <Module or Feature>

## Scope and Entry Points
## Architecture and Relationships
## Important Types and Contracts
## End-to-End Flow
## Errors and Lifecycle
## Use and Verification
## Known Unknowns
```

Keep the walkthrough proportional to the module. Cite source at the point of each substantive claim; avoid a detached dump of links. Include only sections and diagrams that the implementation makes meaningful.

## Stop Conditions

Stop and request clarification when the requested implementation cannot be located, source conflicts with the requested description, a durable documentation location is genuinely undecidable from repository conventions, or a required claim depends on unavailable external behavior.
