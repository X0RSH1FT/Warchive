---
name: creative-composition
description: Develop or revise structure, pacing, sequencing, arrangement, reveal strategy, or flow. Use when the main open question is how creative material should unfold or be ordered.
disable-model-invocation: true
argument-hint: "[Optional: target files, outline, draft text, audience, delivery medium, length constraints, pacing goals, or reveal priorities.]"
---
1. Read the outline, sequence, or file and fixed brief. Invoke `Composition` explicitly if supported; loading the skill alone does not activate that agent. Otherwise do the scoped pass without claiming delegation.
2. Compare distinct arrangements when useful and recommend the strongest with its pacing tradeoff. Allow small adjacent fixes for coherence; return major changes to approved direction to `Artistic-Director`.
3. If a decision-changing constraint is missing, use the permitted harness question tool (`vscode/askQuestions` in VS Code; `ask_user` only where available); otherwise ask in chat or return the question to the caller if delegated without a user channel.
4. For direct edits, validate after the first substantive edit. Stop when the structure fits the brief; report the result, rationale, and material dependency.

## Output

- Provide the structural result and any material unresolved dependency.