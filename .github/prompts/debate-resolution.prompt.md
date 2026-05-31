---
name: debate-resolution
description: Resolve an issue or design decision through a structured multi-agent debate led by Coordinator Agent, then route the winning direction to the next execution owner.
argument-hint: "[Issue or design question, optional constraints, candidate options, decision deadline, and preferred confidence level.]"
agent: Coordinator Agent
---

Use this prompt to run a bounded debate or argument among specialist subagents when the best path is unclear and tradeoffs matter.

Workflow:
1. Identify the concrete decision anchor: one issue, one design question, one architecture fork, or one implementation strategy conflict.
2. Retrieve only enough local context to frame the debate scope, constraints, and the first validation boundary.
3. If the decision question, constraints, or success criteria are ambiguous, use `#askQuestions` first. Summarize the proposed debate pass in plain language, then ask only for the missing decision inputs.
4. Decompose the debate into explicit stages and track them with `#todo`:
   - setup
   - opening arguments
   - cross-examination
   - synthesis and scoring
   - decision and next owner
5. Select 2 to 4 specialist debaters with meaningfully different perspectives. Keep the roster narrow and relevant.
6. Assign each debater a clear stance or evaluation lens, including assumptions, constraints, and what evidence they must provide.
7. Delegate opening arguments to each selected subagent. Require each argument to include:
   - recommendation
   - strongest supporting evidence from repository context
   - key tradeoffs and risks
   - conditions under which their recommendation would fail
8. Run one bounded rebuttal or cross-examination round. Require each debater to challenge one concrete weakness in another position and propose a mitigation.
9. Synthesize results with a reasoning scaffold instead of intuition alone:
   - decision criteria list
   - weighted or ranked comparison table
   - risk and reversibility assessment
   - confidence level with known unknowns
10. If confidence is low or unresolved risk remains, run one focused tie-break pass with the most relevant specialist (for example `Web Research Agent` for external facts, `Testing Agent` for validation risk, or `Planner Agent` for sequencing risk).
11. Select a winner, explain why alternatives lost, and route the winning direction to the next execution owner.
12. Keep `Coordinator Agent` in orchestration mode only: routing, clarification, debate control, and synthesis. Do not perform specialist implementation, documentation, testing, or review work inline.
13. If the winning path requires source edits, route to `Implementation Agent` and then `Reviewer Agent` for non-trivial changes unless the user explicitly opts out.
14. If the winning path is prompt-workflow customization, route to `Meta Agent`.
15. Validate that all referenced agents and target paths exist before concluding.

Debate roster guidance:
- Use `Planner Agent` when the dispute is primarily sequencing, scope slicing, or acceptance criteria.
- Use `Domain Modeling Agent` when the dispute is primarily bounded context, aggregate boundaries, or ubiquitous language.
- Use `Systems Architect Agent` when the dispute is primarily subsystem boundaries, interfaces, or deployment tradeoffs.
- Use `Implementation Agent` when the dispute is primarily code-level feasibility, refactor complexity, or migration risk.
- Use `Interface Design Agent` when the dispute is primarily information hierarchy, interaction flow, or UI states.
- Use `Testing Agent` when the dispute is primarily testability, coverage risk, and validation strategy.
- Use `Documentation Agent` when the dispute is primarily durable knowledge ownership, docs clarity, or knowledge-surface fit.
- Use `Reviewer Agent` when the dispute is primarily regression risk, findings quality, and signoff readiness.
- Use `Web Research Agent` when the dispute depends on narrow external product facts not yet validated locally.
- Use `Creative Philosopher Agent` or `Artistic Director Agent` when the dispute is stylistic, narrative, or creative-directional.

Few-shot examples:
- Good debate question: Should we resolve data-import failures with strict schema rejection now, or introduce a staged compatibility layer first?
- Good contrasting stances: `Implementation Agent` favors staged compatibility for migration safety; `Testing Agent` favors strict rejection for simpler validation and lower long-term ambiguity.
- Good synthesis line: Winner is staged compatibility because rollback risk is lower under current release constraints, with strict mode scheduled after telemetry confirms input cleanup.
- Bad debate question: What should we do about the project overall?
- Bad orchestration: Coordinator writes implementation steps directly without delegating to specialist agents.

Close-out requirements:
- Summarize the decision question, chosen debaters, and each stance in one line.
- Provide the criteria-based comparison and the winning decision.
- State why the rejected options lost.
- Name the next owning agent and the first validation step.
- Report whether plan-derived work is exhausted.
- If work remains, name the next highest-priority planned slice.
- Label any extra idea as a suggestion outside the plan.
- Include a concise, imperative commit message when resulting changes are ready to keep.