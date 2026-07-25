---
name: ask-code
description: Research and answer questions about the codebase, including architecture, behavior, ownership, data flow, conventions, and implementation details.
argument-hint: "[Required: the question. Optional: target files, symbols, feature area, known uncertainty, or desired depth.]"
agent: Knowledge Agent
---

1. Restate the codebase question in concrete terms before researching so the answer scope is explicit.
2. Identify the narrowest starting anchor available from the request, such as a file, symbol, subsystem, test, or feature area.
3. Retrieve only enough nearby context to answer the question accurately. Prefer the owning implementation, adjacent tests, package boundaries, and source-of-truth files over broad repository exploration.
4. Verify codebase claims against the local repository before answering. When relevant, treat `README.md`, `pyproject.toml`, and the core package under as source-of-truth anchors.
5. If the question is ambiguous, use `#askQuestions` to summarize the intended research pass first, confirm the specific question to answer, explain the most likely interpretation options, and keep freeform input enabled.
6. Name the first validation boundary before deeper research. Default to targeted file reads and symbol search; escalate to diagnostics, tests, or broader reads only when a concrete uncertainty requires it.
7. Prefer evidence from the code that directly computes, stores, routes, or validates the behavior in question. If the first anchor mostly forwards or registers behavior, step once to the code that actually controls it.
8. Cross-check the answer against at least one neighboring implementation surface when that would disconfirm a weak assumption, such as a test, interface contract, or call site.
9. Do not speculate about behavior that is not supported by repository evidence. If something is unclear, state what is confirmed, what remains uncertain, and what evidence is missing.
10. Distinguish clearly between observed behavior, inferred intent, and open questions.
11. When the question is about design or ownership, explain which package or abstraction owns the concern and why, using the repository’s package boundaries rather than generic architecture advice.
12. When the question is about runtime behavior, describe the controlling path in execution order, naming the key types, services, and handoff points that determine the outcome.
13. When the question is about tests or validation, summarize what existing tests cover, what they do not cover, and what the cheapest confirming check would be.
14. If the research shows the question is really a request for code changes, bug fixing, or documentation updates, say so explicitly and recommend the correct next pass instead of pretending the question is fully answered by analysis alone.
15. End with a direct answer, a short list of open questions or assumptions if any remain, and a sources section that names the files or symbols that support the conclusion.

Example response shape:

```markdown
- Question: how does the engine apply deferred structural changes during an update cycle?
- Starting anchor: `arcane_core/engine/command.py` plus the system update path in `arcane_core/engine/system.py`.
- First validation boundary: targeted file reads of the command queue, engine update loop, and adjacent tests.
- Answer: deferred writes are queued during system execution, then applied at the engine-owned flush boundary after ordered system updates complete.
- Open questions: whether any subsystem can force an early flush outside the main update loop.
- Sources: `arcane_core/engine/command.py`, `arcane_core/engine/system.py`, `test/engine/command_queue_test.py`.
```