---
name: feature-idea-roundtable
description: Coordinate a structured discussion among specialist subagents to brainstorm, compare, and prioritize feature ideas for upcoming repository work or sprint planning.
argument-hint: "[Problem area, target surface, optional constraints, audience, time horizon, and whether you want broad ideation or a narrowed shortlist.]"
agent: Coordinator Agent
---

Use this prompt when you want a guided multi-specialist discussion to generate and rank practical feature ideas before committing to implementation.

Workflow:
1. Identify one concrete brainstorming anchor: a product surface, workflow pain point, subsystem, doc area, or question such as "what should this UI need next?"
2. Retrieve only enough repository context to scope the discussion and define the first validation boundary for any follow-up execution.
3. If scope, audience, or constraints are unclear, use `#askQuestions` first. Summarize the proposed roundtable pass in plain language, then ask only for missing decisions that change ideation direction.
4. Build a short `#todo` plan for the roundtable stages:
   - framing and constraints
   - specialist idea generation
   - cross-specialist challenge
   - shortlist and prioritization
   - next-sprint recommendation
5. Select 3 to 6 relevant specialists with distinct lenses. Keep the roster narrow and outcome-oriented.
6. Dispatch each selected specialist with a clear lens and bounded output contract:
   - idea proposals (2 to 4 each)
   - expected user or repository impact
   - implementation complexity estimate
   - main dependency or risk
7. Run one challenge pass where each specialist critiques at least one idea from another specialist and proposes a refinement.
8. Synthesize all candidate ideas into a reasoning scaffold:
   - clustered themes
   - duplicate merge decisions
   - ranking criteria (value, effort, risk, reversibility, strategic fit)
   - prioritized shortlist with confidence and unknowns
9. Recommend a next sprint slice using a planner-executor shape:
   - first planning task owner
   - first execution owner
   - first validation step
10. Keep `Coordinator Agent` in orchestration mode only. Do not perform specialist implementation, testing, documentation, or deep domain work inline.
11. Route to the next owner when requested: `Planner Agent` for scope slicing, `Implementation Agent` for coding, `Interface Design Agent` for UI direction, `Documentation Agent` for durable write-up, `Testing Agent` for validation planning, or `Reviewer Agent` for signoff.
12. Validate that all referenced agents and target paths exist before concluding.

Specialist selection guidance:
- Use `Interface Design Agent` when ideas depend on screen hierarchy, flows, or usability.
- Use `Planner Agent` when narrowing ideas into sprint-ready slices and acceptance criteria.
- Use `Systems Architect Agent` when ideas change boundaries, interfaces, or architecture.
- Use `Implementation Agent` when feasibility, migration effort, or technical debt are central.
- Use `Testing Agent` when validation cost, reliability, or regression exposure drive prioritization.
- Use `Documentation Agent` when discoverability, guidance quality, or knowledge ownership matter.
- Use `Creative Philosopher Agent` or `Artistic Director Agent` when ideation quality depends on stronger creative divergence.

Few-shot examples:
- Good anchor: What should our repository UI workflow support next for faster sprint triage?
- Good specialist spread: `Interface Design Agent`, `Planner Agent`, `Implementation Agent`, and `Testing Agent`.
- Good synthesized idea: Add a lightweight sprint-planning dashboard prompt plus checklist sync, ranked high value and medium effort with low migration risk.
- Bad anchor: Give me random ideas for everything.
- Bad orchestration: Coordinator generates ideas alone without delegating to specialists.

Close-out requirements:
- Summarize the brainstorming anchor and selected specialist roster.
- Provide the prioritized shortlist with scoring rationale.
- Identify the recommended next-sprint candidate and why it won.
- Name the immediate next owner and first validation step.
- State whether plan-derived work is exhausted.
- If work remains, name the next highest-priority planned slice.
- Label any extra idea as a suggestion outside the plan.
- Include a concise, imperative commit message when resulting changes are ready to keep.