# Agentic Coding Patterns For Delivery Work

**Audience**: coworkers in a presentation about agentic coding.

**Scope**: a light overview of practical agent workflows.

Agentic coding is easiest to present as a delivery loop: get just enough context, bound the next step, do the work, validate it, and update durable knowledge when needed.

## The basic loop

```mermaid
flowchart LR
    Task[Task or question] --> Context[Read the smallest useful context]
    Context --> Plan[Bound the next step]
    Plan --> Act[Implement or answer]
    Act --> Validate[Run the narrowest check]
    Validate --> Record[Update docs if needed]
```

## Typical tools

| Area | Common tools |
|---|---|
| IDE | VS Code or another editor with agent support |
| Version control | Git |
| Python package management | `uv` or `pip` |
| TypeScript package management | `npm` |

The point of listing tools is not to prescribe one stack. It is to show that agentic coding usually sits on top of a normal engineering toolchain rather than replacing it.

## Quality gates

Quality gates matter because they are deterministic. They give the agent and the human reviewer the same guard rails and the same definition of a passing change.

| Gate | Typical checks |
|---|---|
| Automated tests | Unit tests and integration tests, often through `pytest` or an equivalent test runner |
| Type checking | `pyright`, `mypy`, or language-specific type analyzers |
| Static analysis | Linting and code quality checks |
| Import and dependency rules | Import boundary checks and dependency analysis |
| Secret scanning | Detection of committed credentials or tokens |
| Formatting | Deterministic formatting tools such as `ruff format` or equivalent |

For presentation purposes, the main idea is simple: the agent should work inside the same validation system the team already trusts.

## Optional roles

Not every setup needs named agents. One strong implementation agent plus review may be enough. Role splits help when scope is broad, handoffs matter, or permissions should stay narrow.

| Role | Purpose |
|---|---|
| Coordinator | Routes work to the next owner. |
| Planner | Turns an ambiguous request into a bounded slice. |
| Web Research | Confirms narrow external-product facts whenever planning, documentation, or implementation depend on them. |
| Implementation | Makes the code or config change. |
| Review | Looks for bugs, regressions, and scope drift. |
| Testing | Reproduces failures and runs validation. |
| Documentation | Updates durable reference material. |
| Explorer | Optional read-only discovery step for broad code surfaces. |

## Common workflows

| Workflow | Typical sequence | Output |
|---|---|---|
| Code implementation | Coordinator-owned spine with Planner, Web Research, or Explorer inserted only when needed -> Implementation -> Testing or Documentation if needed -> Review | A bounded change with optional fact-gathering, validation, and doc updates inserted only when they add value. |
| Technical decision | Frame question -> Compare options -> Recommend one | A short decision note, not necessarily code. |
| Debugging | Reproduce -> Inspect controlling path -> Fix -> Rerun | A focused fix tied to a concrete failure. |
| Inquiry | Find owner -> Read minimal context -> Answer with sources | A clear answer with uncertainty called out if needed. |

## Prompt patterns used here

| Technique family | What it means in practice | Why it is useful |
|---|---|---|
| Task decomposition | Break a broad request into smaller bounded steps. | Reduces scope drift and makes validation easier. |
| Few-shot prompting | Provide a small number of examples that show the expected shape of the answer or workflow. | Helps the model match tone, structure, and task format more reliably. |
| Reasoning scaffolds | Ask for explicit intermediate structure such as steps, checks, comparisons, or decision criteria. | Useful for multi-step tasks, debugging, and tradeoff analysis. |
| Tool use | Let the model call search, diagnostics, terminals, tests, or other external tools. | Grounds the work in real repository state instead of guesswork. |
| Retrieval | Pull in relevant code, docs, plans, or prior decisions before acting. | Improves accuracy when important context lives outside the current prompt. |
| Planner-executor workflow | Separate task shaping from task execution. | Helps when the work is ambiguous, cross-cutting, or risky. |
| Review loop | Evaluate the output in a distinct pass before closing the task. | Catches regressions, missing tests, and weak assumptions. |

These techniques improve reliability by adding structure, context, and verification to the prompt-response loop.

## Durable docs as guidance

Teams often separate durable reference, workflow knowledge, and active planning.

| Documentation type | Typical role |
|---|---|
| Overview docs | User-facing overview and command index. |
| Durable reference docs | Stable design guidance, architecture notes, and shipped behavior. |
| Workflow notes | Team process, quality gates, and tool usage guidance. |
| Planning docs | Active planning, drafts, and unshipped ideas. |

This is useful because both people and agents have a stable place to look for settled facts. The risk is drift: once durable docs stop matching the code, they become a source of confusion.

## Development process

### Legacy refactor or modernization

1. Build a reference set for the existing application.
2. Inventory the current system: database artifacts, modules, pages, integrations, workflows, and user-visible features.
3. Record design constraints, known pain points, and behaviors that must not regress.
4. Separate retained behavior from unwanted behavior, legacy debt, and features that should be removed.
5. Turn that inventory into a bounded migration backlog.

This gives the team a shared baseline before code generation or refactoring starts.

### New development or replacement build

1. Enumerate the existing features or expected capabilities.
2. Review that list with the project owner or domain owner.
3. Mark what must be retained, what can be dropped, and what can be deferred.
4. Use that decision set to define the initial scope of the new system.
5. Build the first thin end-to-end slice against that scope.

This is often a practical way to start a replacement system because it turns a vague rewrite into an explicit scope decision.

### Shared delivery pattern

1. Gather the minimum reliable context.
2. Convert the work into small, testable slices.
3. Validate each slice with deterministic quality gates.
4. Review changes independently when risk justifies it.
5. Update durable documentation when behavior, ownership, or operating procedures changed.

That is the main idea behind the presentation: the value is not just automation. It is a more explicit and inspectable software delivery process.

## Further reading

The references below are useful if the audience wants more than a workflow overview.

| Topic | Reference | Why it matters |
|---|---|---|
| Prompting basics | [Prompt Engineering Guide](https://www.promptingguide.ai/) | A practical survey of prompting patterns and terminology. |
| Chain-of-thought prompting | [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903) | Popularized the idea that structured intermediate reasoning can improve multi-step tasks. |
| Zero-shot reasoning | [Large Language Models are Zero-Shot Reasoners](https://arxiv.org/abs/2205.11916) | Shows that simple reasoning cues can improve performance even without examples. |
| ReAct | [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) | Important for agent workflows that alternate between reasoning steps and external actions. |
| Self-consistency | [Self-Consistency Improves Chain of Thought Reasoning in Language Models](https://arxiv.org/abs/2203.11171) | Relevant when comparing multiple candidate reasoning paths before selecting an answer. |
| Retrieval-augmented generation | [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) | Useful when prompts should pull from external documentation or internal knowledge sources. |
| Tool use | [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761) | Useful background for why tool-calling agents can outperform prompt-only approaches. |
| Multi-agent and role-based workflows | [AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation](https://arxiv.org/abs/2308.08155) | Relevant when discussing planner, implementer, reviewer, and other specialized roles. |
| Software engineering agents | [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770) | Grounds the discussion in a benchmark built around real maintenance tasks. |
| Agent benchmarking | [GAIA: a Benchmark for General AI Assistants](https://arxiv.org/abs/2311.12983) | Useful when discussing evaluation beyond toy prompt examples. |
| Mixture-of-experts models | [Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer](https://arxiv.org/abs/1701.06538) | Important background, but this is a model architecture topic rather than a prompting technique. |

For presentation purposes, the cleanest framing is usually:

1. Prompting techniques shape how work is described to the model.
2. Agent workflows shape how tasks are decomposed, validated, and handed off.
3. Model architecture topics such as mixture-of-experts affect capability, scale, and efficiency, but they are not the same thing as prompting.