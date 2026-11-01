---
name: creative-concept
description: Develop or revise the concept, framing, motifs, symbolism, or thematic territory of a creative task. Use when the main open question is what the idea should mean or how it should be framed.
disable-model-invocation: true
argument-hint: "[Optional: target files, draft text, audience, medium, intended meaning, motifs, symbols, constraints, or concept options already under consideration.]"
---
1. Read the concrete premise, draft, or file and fixed brief. Invoke `Concept-Architect` explicitly if the host supports it; loading the skill alone does not activate that agent. Otherwise do the scoped pass without claiming delegation.
2. Compare high-contrast framings when exploration helps; recommend an anchor with its tradeoff. Allow small adjacent wording or structure fixes for coherence; return major changes to approved direction to `Artistic-Director`.
3. If a decision-changing constraint is missing, use the permitted harness question tool (`vscode/askQuestions` in VS Code; `ask_user` only where available); otherwise ask in chat or return the question to the caller if delegated without a user channel.
4. For direct edits, validate after the first substantive edit. Stop when the framing fits the brief; report the artifact, rationale, and material dependency.

## Output

- Provide the conceptual result and any material unresolved dependency.