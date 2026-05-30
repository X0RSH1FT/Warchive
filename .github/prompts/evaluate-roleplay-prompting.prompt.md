---
name: evaluate-roleplay-prompting
description: Compare, refine, and evaluate roleplay prompt structures, packet formats, steering techniques, and backend-facing workflows for subagents or local LLM services.
argument-hint: "[Optional: target prompt or agent files, packet format ideas, local backend such as Ollama, response samples, evaluation criteria, and whether to run prompt-only comparison, runtime evaluation, or both.]"
agent: Meta Agent
---

1. Read the attached context and identify whether the task is primarily prompt-structure design, technique comparison, runtime evaluation, or an end-to-end evaluation loop.
2. If the desired roleplay behavior or experience target is unclear, consult `Artistic Director Agent` first so the evaluation is tied to a concrete packet shape, immersion target, response mode, and failure definition.
3. Keep this workflow separate from direct character design and in-character enactment. This workflow owns prompt structure, technique comparison, and evaluation logic.
4. Compare prompt structures and techniques against explicit criteria: character consistency, immersion, boundary containment, format adherence, prompt steerability, latency or token cost, and backend portability.
5. Treat structured packets, few-shot dialogue examples, late-turn steering, reply boundaries, scene memory summaries, dual-layer knowledge, and continuation-style prompt construction as techniques to compare rather than assumptions that are always superior.
6. When the request includes a local service or interface such as Ollama, include runtime evaluation in the same workflow by comparing actual responses or by preparing the narrowest executable evaluation path the current project can support.
7. When runtime evidence is unavailable, still produce a prompt-only comparison and call out the missing runtime validation explicitly.
8. If the outcome broadens into shared prompt, agent, instruction, or workflow-customization refactoring, keep the work in `Meta Agent`. If it becomes documentation, hand off to `Documentation Agent`.
9. End with the tested or proposed prompt structures, the evaluation outcome, the strongest recommended structure, remaining uncertainty, and the next experiment or refactor step.

## Output

- State whether the pass covered prompt design, runtime evaluation, or both.
- Present the prompt structures or techniques compared.
- Recommend the strongest current structure and explain why.
- Call out any missing runtime evidence or next validation step.