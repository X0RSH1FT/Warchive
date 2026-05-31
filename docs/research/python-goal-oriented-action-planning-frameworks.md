# Python Goal-Oriented Action Planning Frameworks

Scope: Durable shortlist and decision aid for selecting open-source Python-capable frameworks and toolkits for goal-oriented action planning across game AI, robotics/autonomy, and LLM-agent orchestration.

Date: 2026-05-31

## Ranked Shortlist

Ranking intent: prioritize practical goal-directed planning capability in Python, then ecosystem maturity, maintenance signals, and fit across the requested use cases.

1. **Unified Planning**  
   Category: **Planning-native framework**  
   Repo: https://github.com/aiplan4eu/unified-planning  
   License: Apache-2.0  
   Planning paradigm: Classical AI planning API with multiple engines (PDDL-centric, unified modeling abstraction).  
   Python support quality: **Excellent** (Python-first project, docs and packaged releases).  
   Maturity signals: Active repository, maintained docs, release history.  
   Strengths: Broad modeling surface, strong interoperability, good long-term maintainability signal.  
   Limitations/risks: Complexity can be higher than single-purpose planners; solver choice affects behavior/performance.  
   Best-fit scenarios: General-purpose symbolic planning in Python, research-to-production transitions, teams needing abstraction over planner backends.  
   Sources: https://github.com/aiplan4eu/unified-planning, https://github.com/aiplan4eu/unified-planning/releases

2. **scikit-decide**  
   Category: **Planning-native framework**  
   Repo: https://github.com/airbus/scikit-decide  
   License: MIT  
   Planning paradigm: Decision-making and planning toolkit spanning planning/scheduling/RL-style formulations.  
   Python support quality: **Excellent** (Python library with docs and releases).  
   Maturity signals: Active maintenance with documented releases.  
   Strengths: Flexible decision-centric abstractions; strong fit when planning must coexist with other decision methods.  
   Limitations/risks: Broader API can introduce learning curve; problem setup may be heavier than narrow planners.  
   Best-fit scenarios: Robotics/autonomy and industrial decision problems requiring mixed planning approaches.  
   Sources: https://github.com/airbus/scikit-decide, https://github.com/airbus/scikit-decide/releases

3. **Fast Downward (Python driver over C++ core)**  
   Category: **Planning-native framework**  
   Repo: https://github.com/aibasel/downward  
   License: GPL-3.0  
   Planning paradigm: High-performance classical planning (heuristic search over PDDL tasks).  
   Python support quality: **Good** (Python-facing workflow, core performance in C++).  
   Maturity signals: Widely used academic/benchmark planner lineage, active repository history.  
   Strengths: Strong performance and mature classical planning techniques.  
   Limitations/risks: GPL implications for distribution; C++ core reduces pure-Python extensibility.  
   Best-fit scenarios: Performance-focused classical planning pipelines where GPL is acceptable.  
   Sources: https://github.com/aibasel/downward, https://www.fast-downward.org/

4. **PDDLStream**  
   Category: **Planning-native framework**  
   Repo: https://github.com/caelan/pddlstream  
   License: GPL-3.0  
   Planning paradigm: PDDL planning integrated with sampling/continuous feasibility checks (TAMP-oriented).  
   Python support quality: **Good** (Python-oriented workflow for hybrid symbolic/sampling planning).  
   Maturity signals: Established in task-and-motion planning usage; slower maintenance cadence than top entries.  
   Strengths: Strong for symbolic + geometric/continuous coupling.  
   Limitations/risks: Maintenance cadence appears slower; integration complexity can be significant.  
   Best-fit scenarios: Robotics task-and-motion planning where symbolic plans must bind to sampled feasibility.  
   Sources: https://github.com/caelan/pddlstream, https://github.com/caelan/pddlstream/commits/main

5. **GTPyhop**  
   Category: **Planning-native framework**  
   Repo: https://github.com/dananau/GTPyhop  
   License: BSD-3-Clause-Clear  
   Planning paradigm: HTN/GTN decomposition planning.  
   Python support quality: **Good** (Python implementation, lightweight to adopt).  
   Maturity signals: Known approach lineage, but low recent maintenance activity.  
   Strengths: Human-readable hierarchical domain modeling; useful for controllable decomposition strategies.  
   Limitations/risks: Lower current maintenance signal; narrower ecosystem than mainstream classical planners.  
   Best-fit scenarios: Domain-crafted hierarchical planning and instructional/research HTN use in Python.  
   Sources: https://github.com/dananau/GTPyhop, https://github.com/dananau/GTPyhop/commits/main

6. **GOApy**  
   Category: **Planning-native framework (direct GOAP)**  
   Repo: https://github.com/leopepe/GOApy  
   License: BSD-2-Clause  
   Planning paradigm: Direct GOAP (Goal-Oriented Action Planning).  
   Python support quality: **Moderate** (Python GOAP implementation, but older cadence).  
   Maturity signals: Direct GOAP implementation exists; activity cadence appears older.  
   Strengths: Straight path to GOAP concepts in Python with minimal paradigm translation.  
   Limitations/risks: **Maintenance risk is elevated** (older update cadence, smaller maintainer surface).  
   Best-fit scenarios: Prototyping GOAP behavior quickly in Python, educational GOAP experiments, small internal tools where long-term support risk is acceptable.  
   Sources: https://github.com/leopepe/GOApy, https://github.com/leopepe/GOApy/commits/master

7. **pyperplan**  
   Category: **Planning-native framework**  
   Repo: https://github.com/aibasel/pyperplan  
   License: GPL-3.0  
   Planning paradigm: STRIPS/PDDL classical planning baseline.  
   Python support quality: **Good** (pure Python and easy to inspect/teach).  
   Maturity signals: Longstanding educational baseline in planning courses and examples.  
   Strengths: Simple, readable baseline; good for teaching and experimentation.  
   Limitations/risks: Not state-of-the-art performance; GPL constraints for some distributions.  
   Best-fit scenarios: Learning/teaching classical planning, quick prototypes where performance is not primary.  
   Sources: https://github.com/aibasel/pyperplan

8. **py_trees**  
   Category: **Adaptable toolkit (not a symbolic planner)**  
   Repo: https://github.com/splintered-reality/py_trees  
   License: BSD-3-Clause  
   Planning paradigm: Behavior-tree execution and coordination.  
   Python support quality: **Excellent** (Python-native, widely used in robotics stacks).  
   Maturity signals: Mature docs and ongoing ecosystem usage.  
   Strengths: Robust execution control, composable behavior design, operational transparency.  
   Limitations/risks: Not a goal-search planner by itself; must be paired with planning logic if symbolic planning is required.  
   Best-fit scenarios: Runtime behavior control layers, robotics behavior orchestration, execution management around another planner.  
   Sources: https://github.com/splintered-reality/py_trees

9. **LangGraph**  
   Category: **Adaptable toolkit (agent workflow orchestration)**  
   Repo: https://github.com/langchain-ai/langgraph  
   License: MIT  
   Planning paradigm: Stateful graph orchestration for LLM agents and tool calls.  
   Python support quality: **Excellent** (first-class Python package and ecosystem).  
   Maturity signals: High ecosystem velocity and active open-source development.  
   Strengths: Strong control-flow, memory/state handling, and recoverability for LLM-agent systems.  
   Limitations/risks: Not classical symbolic planning; fast-moving ecosystem can shift APIs/patterns.  
   Best-fit scenarios: LLM-agent planning/execution graphs, tool-augmented agents, production orchestration with checkpoints/state.  
   Sources: https://github.com/langchain-ai/langgraph, https://github.com/langchain-ai/langgraph/releases

10. **CrewAI**  
    Category: **Adaptable toolkit (multi-agent orchestration)**  
    Repo: https://github.com/crewAIInc/crewAI  
    License: MIT  
    Planning paradigm: Role/crew-based multi-agent flows and task orchestration.  
    Python support quality: **Excellent** (Python-focused framework).  
    Maturity signals: Active repository and growing user adoption.  
    Strengths: Rapid composition of agent teams and workflow-style plans.  
    Limitations/risks: Not symbolic planner semantics; agent behavior quality depends on LLM/tool reliability.  
    Best-fit scenarios: Multi-agent business workflows, prompt-driven planning delegation, rapid prototyping of collaborative agent flows.  
    Sources: https://github.com/crewAIInc/crewAI, https://github.com/crewAIInc/crewAI/releases

## Planning-Native vs Adaptable Toolkit Boundary

Planning-native frameworks in this shortlist:
- Unified Planning
- scikit-decide
- Fast Downward
- PDDLStream
- GTPyhop
- GOApy
- pyperplan

Adaptable toolkits in this shortlist:
- py_trees (execution control, not symbolic planning)
- LangGraph (LLM-agent orchestration)
- CrewAI (multi-agent orchestration)

## Top Picks by Use Case

### Game AI GOAP
- Primary pick: **GOApy** when direct GOAP semantics in Python matter most.  
- Practical caution: maintenance cadence appears older, so budget for self-maintenance or forking if adopted long-term.  
- Alternative: **GTPyhop** if hierarchical decomposition is acceptable instead of strict GOAP.

### Robotics/Autonomy Planning
- Primary pick: **scikit-decide** for decision/planning breadth in Python-heavy autonomy stacks.  
- When symbolic + geometric coupling is central: **PDDLStream**.  
- When classical planning speed is the bottleneck and GPL is acceptable: **Fast Downward**.

### LLM-Agent Orchestration
- Primary pick: **LangGraph** for stateful, graph-based orchestration with strong control-flow semantics.  
- Team/role workflow emphasis: **CrewAI**.  
- If symbolic planning is required, pair orchestration with a planning-native backend (for example, Unified Planning).

## Concise Decision Guide

- If you want the most balanced, actively maintained Python planning foundation, choose **Unified Planning**.
- If you want robotics/autonomy-oriented decision planning breadth, choose **scikit-decide**.
- If you want maximum classical planning performance, choose **Fast Downward** (and accept GPL/C++ core constraints).
- If you want symbolic planning tightly coupled with sampling/geometric feasibility, choose **PDDLStream**.
- If you want direct GOAP in Python, choose **GOApy** (and plan for maintenance risk).
- If you want lightweight instructional classical planning, choose **pyperplan**.
- If you want behavior execution control rather than symbolic search, choose **py_trees**.
- If you want LLM-agent workflow planning/orchestration, choose **LangGraph** (or **CrewAI** for crew/role-first flows).

## Notes and Assumptions

- Ranking is use-case weighted for goal-oriented planning in Python, not a universal benchmark score.
- “Maturity signals” are based on public repository indicators (release pages/commit history/docs presence), not private roadmap commitments.
- License suitability must be validated against your distribution model and legal policy.

## Claims-to-Sources (Compact)

| Claim area | Primary sources |
| --- | --- |
| GOAP as goal-driven search over state transitions | [Orkin 2006](https://ojs.aaai.org/index.php/AIIDE/article/view/18724), [Dill and Pap 2006](https://ojs.aaai.org/index.php/AIIDE/article/view/18712) |
| Preconditions/effects fact semantics (STRIPS-style modeling) | [Poole and Mackworth 2023, STRIPS section](https://artint.info/3e/html/ArtInt3e.Ch6.S1.html), [Fikes and Nilsson 1971](https://doi.org/10.1016/0004-3702(71)90010-5) |
| A* optimality with admissible heuristics; practical trade-offs with non-admissible heuristics | [Poole and Mackworth 2023, A* section](https://artint.info/3e/html/ArtInt3e.Ch3.S6.html), [Hart et al. 1968](https://doi.org/10.1109/TSSC.1968.300136) |
| Replanning/validation loops in dynamic environments | [Koenig and Likhachev 2002](https://idm-lab.org/bib/abstracts/Koen02e.html), [Unified Planning Operation Modes](https://unified-planning.readthedocs.io/en/latest/operation_modes.html), [ReGoap docs](https://github.com/luxkun/ReGoap) |
| Debuggability, observability, and planner benchmarking practice | [CrashKonijn GOAP](https://github.com/crashkonijn/GOAP), [CrashKonijn Theory](https://goap.crashkonijn.com/readme/theory), [VAL](https://github.com/KCL-Planning/VAL), [Lab docs](https://lab.readthedocs.io/en/stable/), [Downward benchmarks](https://github.com/aibasel/downward-benchmarks) |

## GOAP Fundamentals (Practical)

GOAP is commonly modeled as search over possible world evolutions, where each action transforms facts and the planner seeks a low-cost path to a goal-constrained state [Orkin 2006](https://ojs.aaai.org/index.php/AIIDE/article/view/18724), [Dill and Pap 2006](https://ojs.aaai.org/index.php/AIIDE/article/view/18712).

### World State as Facts

- Represent the world as atomic facts (for example: `has_weapon=True`, `enemy_visible=False`, `ammo=2`) in a STRIPS-like style [Poole and Mackworth 2023, STRIPS section](https://artint.info/3e/html/ArtInt3e.Ch6.S1.html), [Fikes and Nilsson 1971](https://doi.org/10.1016/0004-3702(71)90010-5).
- Facts are typically kept compact and comparable because planning repeatedly simulates successor states.
- Keeping state canonical (stable key names and value types) generally improves equality/hashing predictability in implementation.

### Goals as Desired Fact Constraints

- A goal is usually represented as desired conditions over facts, not a hardcoded sequence of steps [Orkin 2006](https://ojs.aaai.org/index.php/AIIDE/article/view/18724).
- Goal satisfaction often checks subset or predicate match (for example: `enemy_visible=False` and `is_safe=True`) [ReGoap docs](https://github.com/luxkun/ReGoap).
- Multiple goals can coexist; arbitration policy determines which one to optimize at a given decision point [ReGoap docs](https://github.com/luxkun/ReGoap), [CrashKonijn Theory](https://goap.crashkonijn.com/readme/theory).

### Actions as Preconditions, Effects, and Cost

- Preconditions: conditions that must hold for the action to be legal [Poole and Mackworth 2023, STRIPS section](https://artint.info/3e/html/ArtInt3e.Ch6.S1.html).
- Effects: state updates the action applies in planner simulation (typically deterministic in classical formulations) [Fikes and Nilsson 1971](https://doi.org/10.1016/0004-3702(71)90010-5).
- Cost: scalar value used by search (static or context-dependent dynamic cost), as in cost-based shortest-path planning [Poole and Mackworth 2023, A* section](https://artint.info/3e/html/ArtInt3e.Ch3.S6.html).
- If you need temporal/numeric action semantics beyond classical STRIPS, PDDL2.1-style modeling/validation is a common extension path [Fox and Long 2003](https://www.cs.cmu.edu/afs/cs/project/jair/pub/volume20/fox03a-html/JAIRpddl.html).

### Planning as Graph Search

- Nodes represent world states (or equivalent action-state tuples).
- Edges represent applying valid actions.
- A* is commonly used in GOAP-style planners because it balances path cost $g(n)$ and heuristic distance $h(n)$ [Poole and Mackworth 2023, A* section](https://artint.info/3e/html/ArtInt3e.Ch3.S6.html), [Hart et al. 1968](https://doi.org/10.1109/TSSC.1968.300136).
- Search objective: minimize $f(n) = g(n) + h(n)$ while reaching a goal-satisfying state [Hart et al. 1968](https://doi.org/10.1109/TSSC.1968.300136).

### Execution, Monitoring, and Replanning Loop

- Plan generation is often separated from execution, with step-wise validation against live world state before committing the next action [Unified Planning Operation Modes](https://unified-planning.readthedocs.io/en/latest/operation_modes.html), [VAL](https://github.com/KCL-Planning/VAL).
- If preconditions fail or context shifts materially, replanning is typically triggered [Koenig and Likhachev 2002](https://idm-lab.org/bib/abstracts/Koen02e.html), [ReGoap docs](https://github.com/luxkun/ReGoap).
- Keeping planning and execution decoupled is often useful in practice: planner proposes, executor commits, monitor decides when to invalidate [CrashKonijn Theory](https://goap.crashkonijn.com/readme/theory).

## Implementation Blueprint (Python)

The architecture below is a practical decomposition that can help keep planning logic testable while isolating runtime side effects [ReGoap docs](https://github.com/luxkun/ReGoap), [CrashKonijn Theory](https://goap.crashkonijn.com/readme/theory), [Unified Planning Operation Modes](https://unified-planning.readthedocs.io/en/latest/operation_modes.html).

### Recommended Modules and Responsibilities

- `state`: immutable/copy-on-write world representation and fact operations.
- `action`: action schema (preconditions, effects, cost, applicability checks).
- `goal`: goal constraints, utility model, and satisfaction checks.
- `planner`: search engine (often A* or related search), node expansion, heuristics, reconstruction [Poole and Mackworth 2023, A* section](https://artint.info/3e/html/ArtInt3e.Ch3.S6.html).
- `executor`: step execution, validation, and interruption handling [Unified Planning Operation Modes](https://unified-planning.readthedocs.io/en/latest/operation_modes.html).
- `sensors`: adapters that read external world and project into internal facts.
- `blackboard`: shared runtime context (observations, cooldowns, active plan metadata), a pattern commonly documented in practical GOAP implementations [ReGoap docs](https://github.com/luxkun/ReGoap), [CrashKonijn Theory](https://goap.crashkonijn.com/readme/theory).

### Suggested Package Layout

```text
goap/
   __init__.py
   models/
      state.py
      action.py
      goal.py
      plan.py
   planning/
      node.py
      heuristics.py
      astar.py
   runtime/
      executor.py
      monitor.py
      blackboard.py
      sensors.py
   policy/
      arbitration.py
      interruption.py
   tests/
      test_actions.py
      test_planner.py
      test_scenarios.py
```

### Interface Contracts

- `Action` contract:
   - `is_applicable(state, blackboard) -> bool`
   - `apply(state, blackboard) -> state`
   - `cost(state, blackboard) -> float`
- `Goal` contract:
   - `is_satisfied(state) -> bool`
   - `utility(state, blackboard) -> float`
   - `is_active(state, blackboard) -> bool`
- `Planner` contract:
   - `plan(initial_state, goal, actions, blackboard) -> Plan | None`

These contracts reflect common GOAP implementation seams (modeling, planning, execution, and arbitration), but exact method signatures usually depend on engine/runtime constraints [ReGoap docs](https://github.com/luxkun/ReGoap), [CrashKonijn GOAP](https://github.com/crashkonijn/GOAP).

## Data Model Design (Python)

### State Representation Choices

1. `dict[str, Any]`
- Pros: straightforward and expressive for mixed numeric/boolean facts.
- Cons: hashing requires conversion; copying can be expensive without care.

2. `frozenset[tuple[str, Any]]`
- Pros: hashable out-of-the-box, easy closed-set keys for A*.
- Cons: update ergonomics are worse; numeric updates require rebuild.

3. Bitset/enum-indexed arrays
- Pros: very fast comparisons and compact memory footprint.
- Cons: less readable and requires fixed schema/index management.

Practical rule: start with a frozen/canonical mapping wrapper over `dict`; move to bitset only after profiling shows planner bottlenecks.

### Action Schema Design

- Prefer callable predicates and effect functions for composability.
- Keep effects pure in the planner (no I/O, no randomness unless seeded).
- Support optional dynamic costs to encode context pressure (distance, risk, urgency).

```python
from dataclasses import dataclass
from typing import Callable, Mapping, Any

State = Mapping[str, Any]
Predicate = Callable[[State], bool]
Effect = Callable[[State], dict[str, Any]]
CostFn = Callable[[State], float]

@dataclass(frozen=True)
class ActionSpec:
      name: str
      preconditions: tuple[Predicate, ...]
      effects: tuple[Effect, ...]
      base_cost: float = 1.0
      dynamic_cost: CostFn | None = None

      def applicable(self, s: State) -> bool:
            return all(p(s) for p in self.preconditions)

      def cost(self, s: State) -> float:
            return self.dynamic_cost(s) if self.dynamic_cost else self.base_cost
```

### Goal Utility and Prioritization

- Separate feasibility from desirability:
   - Feasibility: can this goal be planned now?
   - Utility: should this goal be pursued now?
- Typical utility ingredients:
   - urgency (time sensitivity)
   - expected value or risk reduction
   - distance/effort estimate
   - cooldown penalties to avoid oscillation

### Planner Node Structure

```python
from dataclasses import dataclass

@dataclass(slots=True)
class Node:
      state_key: object
      g: float
      h: float
      f: float
      parent: "Node | None"
      action_name: str | None
```

Use `state_key` as an immutable hash key for closed/open bookkeeping.

## Planning Algorithm (A* GOAP)

Baseline pseudocode:

```text
function plan(initial_state, goal, actions):
   open = priority_queue ordered by (f, tie_break)
   closed = map state_key -> best_g

   start = node(state=initial_state, g=0, h=heuristic(initial_state, goal))
   push open(start)

   while open not empty:
      current = pop_best(open)
      if goal_satisfied(current.state):
         return reconstruct_plan(current)

      if current.g > closed.get(key(current.state), +inf):
         continue
      closed[key(current.state)] = current.g

      for action in actions:
         if not applicable(action, current.state):
            continue
         next_state = apply(action, current.state)
         step_cost = cost(action, current.state)
         tentative_g = current.g + step_cost

         if tentative_g >= closed.get(key(next_state), +inf):
            continue

         h = heuristic(next_state, goal)
         push open(node(next_state, g=tentative_g, h=h,
                               parent=current, action=action.name))

   return failure
```

### Heuristics in Practice

- Admissible heuristic (never overestimates true remaining cost): preserves optimality guarantees in A* under standard assumptions [Poole and Mackworth 2023, A* section](https://artint.info/3e/html/ArtInt3e.Ch3.S6.html), [Hart et al. 1968](https://doi.org/10.1109/TSSC.1968.300136).
- Non-admissible heuristic: can reduce compute and produce good-enough plans faster, but may be suboptimal [Poole and Mackworth 2023, A* section](https://artint.info/3e/html/ArtInt3e.Ch3.S6.html).
- Practical options:
   - unsatisfied-goal-count heuristic
   - weighted unsatisfied constraints
   - domain distance estimate (for example, map distance to resource)

### Open/Closed Sets, Tie-Breaking, Reconstruction

- Open set: binary heap keyed by `(f, -g, insertion_id)` is a common stable tie-break strategy.
- Closed set: store best known `g` per state key, not just visited flag.
- Reconstruction: follow `parent` pointers from terminal node and reverse action list.

### Complexity and Pruning

- Worst-case search is often exponential in branching factor and effective depth for uninformed or weakly informed state-space exploration [Poole and Mackworth 2023, A* section](https://artint.info/3e/html/ArtInt3e.Ch3.S6.html).
- Practical pruning techniques:
   - discard dominated states (same key, higher `g`)
   - cap depth or total expansions per planning tick
   - filter actions by relevance to currently unsatisfied goal facts
   - cache applicability checks for repeated state signatures

## Execution and Replanning Loop

### Step Validation

- Before each action execution, it is common to re-check preconditions against live sensed state [ReGoap docs](https://github.com/luxkun/ReGoap), [Unified Planning Operation Modes](https://unified-planning.readthedocs.io/en/latest/operation_modes.html).
- If invalid, the remaining plan is often invalidated and the planner called again [Koenig and Likhachev 2002](https://idm-lab.org/bib/abstracts/Koen02e.html).

### Replan Triggers

- Failed preconditions
- Significant world drift (facts changed that affect active goal path)
- A newly activated goal with materially higher utility

These trigger classes align with common dynamic replanning motivations in game and robotics planning literature [Koenig and Likhachev 2002](https://idm-lab.org/bib/abstracts/Koen02e.html), [Orkin 2006](https://ojs.aaai.org/index.php/AIIDE/article/view/18724).

### Thrash Control

- Partial-plan reuse: if prefix remains valid, keep it and replan suffix.
- Goal/action cooldowns: suppress immediate re-selection for a short horizon.
- Commitment window: avoid interruptions until a minimum number of steps complete unless safety-critical events occur.

In practice, cooldowns/commitment windows are often heuristic policy choices rather than formal guarantees [ReGoap docs](https://github.com/luxkun/ReGoap), [CrashKonijn Theory](https://goap.crashkonijn.com/readme/theory).

## Multi-Goal Arbitration

Use explicit policy instead of implicit first-match goal selection.

### Utility Scoring and Activation

- Compute per-goal score each decision cycle:

$$
U_g = w_1 \cdot urgency + w_2 \cdot value - w_3 \cdot effort - w_4 \cdot risk - w_5 \cdot cooldown_penalty
$$

- Activate goals above a threshold and pick best feasible candidate.

The concrete utility form and weights are domain-specific and usually tuned empirically [ReGoap docs](https://github.com/luxkun/ReGoap), [Dill and Pap 2006](https://ojs.aaai.org/index.php/AIIDE/article/view/18712).

### Interruption Policy

- Permit interruption only if challenger utility exceeds current goal utility by margin $\Delta$.
- Add commitment windows to avoid high-frequency goal flipping.

### Mutually Exclusive Goals

- Model exclusivity groups (for example: `combat` vs `stealth`).
- At arbitration time, allow at most one active goal per exclusivity group.
- Encode hard conflicts as preconditions or planner constraints to prevent invalid plan combinations.

## Debuggability and Observability

Instrument planning and execution with structured logs that can be replayed.

### Suggested Trace Fields

- `tick_id`, `agent_id`, `goal_id`, `goal_utility`
- `state_hash`, `expanded_nodes`, `open_size`, `closed_size`
- `selected_action`, `action_cost`, `g`, `h`, `f`
- `replan_reason`, `latency_ms`, `seed`

### Determinism Controls

- Seed all stochastic components in planning/execution policy.
- Keep deterministic tie-breaking in priority queues.
- Serialize state in canonical order before hashing/logging.

Deterministic execution and replay-friendly traces are common requirements for debugging planner behavior [CrashKonijn GOAP](https://github.com/crashkonijn/GOAP), [ReGoap docs](https://github.com/luxkun/ReGoap).

### Plan Explainability Output

- Produce a concise explanation object per plan:
   - selected goal and utility
   - ordered actions with local rationale (preconditions met, expected effect)
   - why competing goals were not selected

## Testing and Validation Strategy

### Unit Tests

- Preconditions/effects: verify applicability and exact state transitions.
- Heuristic behavior: monotonicity checks where expected; sanity bounds.
- Cost model: static and dynamic cost correctness.

### Property and Invariant Tests

- Applying pure planner effects should not mutate input state.
- Repeated application with same seed/state should be deterministic.
- Invariants hold after every transition (for example, resources never negative).

### Scenario Tests

- Define small world fixtures and assert expected action sequence or acceptable alternatives.
- Include failure scenarios where no plan exists and verify graceful fallback.

### Performance Regression Checks

- Track planning latency and expansion counts on fixed benchmark scenarios.
- Alert on regressions beyond agreed thresholds.

Planner benchmarking and regression tracking are standard in planning research tooling and shared corpora workflows [Lab docs](https://lab.readthedocs.io/en/stable/), [Downward benchmarks](https://github.com/aibasel/downward-benchmarks).

## Minimal End-to-End Skeleton (Python)

Concise interfaces and a planner loop signature:

```python
from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol, Iterable, Mapping, Any

State = Mapping[str, Any]


class Action(Protocol):
      name: str
      def is_applicable(self, state: State) -> bool: ...
      def apply(self, state: State) -> State: ...
      def cost(self, state: State) -> float: ...


class Goal(Protocol):
      name: str
      def is_satisfied(self, state: State) -> bool: ...
      def utility(self, state: State) -> float: ...


@dataclass(frozen=True)
class Plan:
      goal_name: str
      actions: tuple[str, ...]
      total_cost: float


def plan_astar(
      initial_state: State,
      goal: Goal,
      actions: Iterable[Action],
      heuristic,
) -> Plan | None:
      """Return the lowest-cost plan found for goal, or None if unreachable."""
      raise NotImplementedError


def tick_loop(state: State, goals: Iterable[Goal], actions: Iterable[Action]) -> State:
      """Arbitrate goal, plan, validate next step, execute, and return new state."""
      raise NotImplementedError
```

## Practical Adoption Notes

### When GOAP Fits Well

- Dynamic worlds where fixed scripts become brittle.
- Domains where explainable, cost-sensitive action sequencing is needed.
- Teams that can model preconditions/effects explicitly.

### When HTN or Behavior Trees May Be Simpler

- Highly structured routines with stable decomposition often favor HTN-style approaches [SHOP overview](https://www.cs.umd.edu/projects/shop/description.html).
- Reactive control and animation/state-machine style runtime logic often favor behavior trees [Iovino et al. 2017](https://arxiv.org/abs/1709.00084).
- If symbolic search depth is shallow and fixed, hand-authored trees can be cheaper to maintain in some production settings [Iovino et al. 2017](https://arxiv.org/abs/1709.00084).

### Integration Patterns

- GOAP + behavior tree: BT typically handles reactive execution; GOAP provides a higher-level action sequence as subtree/task queue [Orkin 2006](https://ojs.aaai.org/index.php/AIIDE/article/view/18724), [Iovino et al. 2017](https://arxiv.org/abs/1709.00084).
- GOAP + LLM orchestrator: LLM can suggest goal candidates or action parameters; deterministic GOAP policy can then validate feasibility and choose an executable plan [CrashKonijn Theory](https://goap.crashkonijn.com/readme/theory), [Unified Planning Operation Modes](https://unified-planning.readthedocs.io/en/latest/operation_modes.html).

### Prototype-to-Production Migration Path

1. Prototype with simple state model and minimal heuristic.
2. Add trace logging, deterministic seeds, and scenario tests.
3. Introduce utility arbitration and interruption policy.
4. Optimize hot spots (state keying, pruning, caching) based on profiling.
5. Harden runtime with monitoring, fallback behavior, and regression performance gates.

## References

- Orkin, J. Agent Architecture Considerations for Real-Time Planning in Games. AIIDE. 2006. https://ojs.aaai.org/index.php/AIIDE/article/view/18724. Accessed 2026-05-31.
- Dill, K., and Pap, C. Goal-Driven Agent Behavior in Real-Time Strategy Games. AIIDE. 2006. https://ojs.aaai.org/index.php/AIIDE/article/view/18712. Accessed 2026-05-31.
- Poole, D. L., and Mackworth, A. K. Artificial Intelligence: Foundations of Computational Agents, 3rd ed., Section 3.6 (Informed Search / A*). Open textbook. 2023. https://artint.info/3e/html/ArtInt3e.Ch3.S6.html. Accessed 2026-05-31.
- Poole, D. L., and Mackworth, A. K. Artificial Intelligence: Foundations of Computational Agents, 3rd ed., Section 6.1 (STRIPS). Open textbook. 2023. https://artint.info/3e/html/ArtInt3e.Ch6.S1.html. Accessed 2026-05-31.
- Hart, P. E., Nilsson, N. J., and Raphael, B. A Formal Basis for the Heuristic Determination of Minimum Cost Paths. IEEE Transactions on Systems Science and Cybernetics. 1968. https://doi.org/10.1109/TSSC.1968.300136. Accessed 2026-05-31.
- Fikes, R. E., and Nilsson, N. J. STRIPS: A New Approach to the Application of Theorem Proving to Problem Solving. Artificial Intelligence. 1971. https://doi.org/10.1016/0004-3702(71)90010-5. Accessed 2026-05-31.
- Fox, M., and Long, D. PDDL2.1: An Extension to PDDL for Expressing Temporal Planning Domains. JAIR. 2003. https://www.cs.cmu.edu/afs/cs/project/jair/pub/volume20/fox03a-html/JAIRpddl.html. Accessed 2026-05-31.
- Koenig, S., and Likhachev, M. D* Lite. AAAI. 2002. https://idm-lab.org/bib/abstracts/Koen02e.html. Accessed 2026-05-31.
- Unified Planning Team. Operation Modes. Unified Planning Documentation. n.d. https://unified-planning.readthedocs.io/en/latest/operation_modes.html. Accessed 2026-05-31.
- luxkun. ReGoap. GitHub repository. n.d. https://github.com/luxkun/ReGoap. Accessed 2026-05-31.
- crashkonijn. GOAP. GitHub repository. n.d. https://github.com/crashkonijn/GOAP. Accessed 2026-05-31.
- CrashKonijn. GOAP Theory. Project documentation. n.d. https://goap.crashkonijn.com/readme/theory. Accessed 2026-05-31.
- KCL Planning. VAL (Plan Validation System). GitHub repository. n.d. https://github.com/KCL-Planning/VAL. Accessed 2026-05-31.
- Helmert, M., et al. Lab (Planning Experiment Framework). Documentation. n.d. https://lab.readthedocs.io/en/stable/. Accessed 2026-05-31.
- aibasel. Downward Benchmarks. GitHub repository. n.d. https://github.com/aibasel/downward-benchmarks. Accessed 2026-05-31.
- Nau, D. S., et al. SHOP and SHOP2 Overview. University of Maryland project page. n.d. https://www.cs.umd.edu/projects/shop/description.html. Accessed 2026-05-31.
- Iovino, M., et al. A Survey of Behavior Trees in Robotics and AI. arXiv. 2017. https://arxiv.org/abs/1709.00084. Accessed 2026-05-31.
- GDC Vault. Three States and a Plan: The AI of F.E.A.R. (session metadata). n.d. https://www.gdcvault.com/play/1013282/Three-States-and-a-Plan. Accessed 2026-05-31.