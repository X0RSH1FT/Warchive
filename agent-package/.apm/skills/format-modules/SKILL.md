---
name: format-modules
description: "Improve source-module readability without behavior changes: add language-appropriate documentation comments, organize supported code with regions, and expand dense expressions while preserving contracts, order, directives, and initialization."
argument-hint: "[Source paths, symbols, language, and desired scope]"
---

# Format Modules

Improve the readability and developer documentation of an implemented source-module scope without changing behavior, public API, or language semantics.

## Use When

- A module needs docstrings, XML documentation, API comments, or annotations following its language and local conventions.
- Types or members need clearer logical grouping using regions or equivalent supported organization.
- Dense one-line expressions obscure control flow, data transformations, or error handling and should become readable multiline code.

Do not use this skill for feature work, refactoring that changes behavior, API redesign, or blanket language-specific formatting across files written in another language.

## Guardrails

- Read applicable repository, directory, language, formatter, and analyzer instructions before editing.
- Use the conventions of the file's language. For example, use XML documentation only where that language and project convention support it; do not apply C# syntax to another language.
- Preserve behavior and public/private API surface exactly unless the user explicitly authorizes a separate semantic change.
- Preserve evaluation order, short-circuiting, laziness, exception timing, disposal/resource lifetime, directives, attributes/decorators, comments with contractual meaning, initialization order, and conditional-compilation behavior.
- Do not add regions where the language or local convention does not support them. Where supported and useful, group by purpose (for example imports, properties, construction, queries, mutation, validation, or lifecycle), not by arbitrary member count.

## Workflow

1. **Bound and inspect the scope.** Identify the requested files and symbols. Read each complete target file plus local instructions and nearby examples. Check existing documentation coverage, organization, generated-code markers, formatter rules, and tests before editing.
2. **Plan documentation coverage.** Inventory scoped modules/types/classes/structs/interfaces and their fields, properties, constructors, methods, events, parameters, returns, exceptions, and other members where the language convention calls for documentation. Document intent, contracts, units, nullability, invariants, side effects, and failure behavior when non-obvious. Avoid restating an obvious identifier solely to satisfy a count.
3. **Apply minimal structural formatting.** Add language-appropriate docstrings or documentation comments. Add purpose-based regions only where supported and consistent with local style. Expand dense one-liners—especially nested conditionals, chained transformations, compound expressions, or control flow—into readable multiline equivalents.
4. **Protect semantics while expanding expressions.** Introduce temporaries only when they preserve the original ordering and evaluation count. Do not reorder predicates, split expressions that rely on short-circuiting, eagerly enumerate lazy sequences, move attributes/directives, or relocate initializers. Keep genuinely short, readable expressions concise; expand expressions that are dense enough to obscure intent, as requested.
5. **Run coverage checks.** Before completion, compare the edited scope with the inventory. Confirm every scoped module/type and relevant member has the required documentation for its language and project conventions, and that each intended dense expression was reviewed as expanded or deliberately retained because it is already readable.
6. **Validate.** Run the narrowest existing formatter, lint/analyzer, compile/build, and focused test checks that cover the changed files. Report unavailable or inapplicable checks explicitly. Inspect the diff for unintended API, behavioral, directive, attribute, or initialization changes.

## Completion Checklist

- [ ] Local and language-specific rules were read and followed.
- [ ] Documentation coverage was checked against the complete requested scope.
- [ ] Comments describe useful contracts rather than duplicate trivial names.
- [ ] Regions are supported, purposeful, and locally consistent.
- [ ] Dense expressions were expanded without changing evaluation or initialization behavior.
- [ ] Existing focused format/lint/build/test checks were run where available.
- [ ] The final diff contains no unrelated edits or semantic changes.

## Stop Conditions

Stop and ask before proceeding when generated files should not be edited, local conventions conflict, required documentation would expose unavailable design intent, an expression cannot be expanded without changing semantics, or no safe focused validation path can be identified.
