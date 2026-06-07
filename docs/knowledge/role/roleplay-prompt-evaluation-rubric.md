# Roleplay Prompt Evaluation Rubric

**Audience:** prompt authors and workflow designers comparing roleplay prompt structures, packet formats, prompting techniques, or backend-facing evaluation paths.

**Scope:** a lightweight durable rubric for evaluating roleplay prompting quality across prompt-only and runtime-backed comparisons.

This rubric is meant to support comparisons such as:

- one packet format versus another
- few-shot examples versus no examples
- late-turn steering variants
- reply boundary variants
- continuation-style prompt experiments
- prompt behavior across local backends such as Ollama

## Evaluation modes

Use one or both modes depending on what evidence is available.

| Mode | What it answers | When to use it |
|---|---|---|
| Prompt-only comparison | Which structure looks more likely to work based on constraints and expected behavior | Early design, no runtime access, or fast iteration |
| Runtime evaluation | How the model actually behaves with the tested structure | When response evidence from a backend or subagent is available |

Prefer prompt-only comparison first when the structure is still unstable. Add runtime evidence once the candidate prompts are coherent enough to compare fairly.

## Scoring scale

Use a simple five-point scale:

| Score | Meaning |
|---|---|
| 1 | Fails badly or regularly contradicts the target behavior |
| 2 | Weak and unreliable |
| 3 | Acceptable but inconsistent |
| 4 | Strong and reliable |
| 5 | Excellent and hard to improve without clear tradeoffs |

## Core criteria

| Criterion | What to look for |
|---|---|
| Character consistency | Stable voice, motives, relationship logic, and persona across turns |
| Immersion | Low assistant leakage, strong in-character behavior, and believable scene presence |
| Boundary containment | Avoids writing the user's next turn, spilling into other speakers, or escaping the scene format |
| Format adherence | Follows the intended dialogue-plus-narration balance and other output-shape rules |
| Prompt steerability | Responds predictably to mood guidance, scene goals, and late-turn cues |
| Latency or token cost | Achieves the target quality without unnecessary prompt bloat or avoidable runtime cost |
| Backend portability | Behaves acceptably across subagents or local backend variations when that matters |

## Recommended comparison sequence

1. define the target behavior clearly
2. choose one or two structures to compare
3. score them against the core criteria
4. note the strongest structure and its tradeoffs
5. decide whether runtime evidence is still needed

## Sample score sheet

| Candidate | Character consistency | Immersion | Boundary containment | Format adherence | Prompt steerability | Latency / cost | Backend portability | Notes |
|---|---|---|---|---|---|---|---|---|
| A |  |  |  |  |  |  |  |  |
| B |  |  |  |  |  |  |  |  |

## Failure patterns to track

Watch for these repeated failure modes during runtime checks:

- generic assistant voice returning under pressure
- packet fields being ignored after a few turns
- boundary spill into the user's next line
- secrets being revealed too easily
- scene goals being forgotten
- late-turn steering overpowering the character identity
- prompt structure that works on one backend but collapses on another

## Decision rule

Prefer the structure that:

1. scores strongest on character consistency, immersion, and boundary containment
2. remains steerable without feeling unstable
3. preserves acceptable latency or prompt size for the intended use
4. has the fewest severe failure patterns

If no candidate is clearly good enough, revise the structure before widening evaluation scope.