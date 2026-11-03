---
name: creative-voice
description: Develop or revise names, titles, diction, tone, persona voice, or short-to-medium copy. Use when the main open question is how the work should sound or what it should be called.
disable-model-invocation: true
argument-hint: "[Optional: target files, draft text, audience, naming constraints, tone targets, persona cues, taboo phrases, or copy sections to rewrite.]"
---
1. Read the name, passage, or file and fixed brief. Invoke `Voice-and-Naming` explicitly if supported; loading the skill alone does not activate that agent. Otherwise do the scoped pass without claiming delegation.
2. Compare meaningfully different verbal directions when useful and recommend the strongest with its tonal tradeoff. Allow small adjacent fixes for coherence; return major changes to approved direction to `Artistic-Director`.
3. If a decision-changing constraint is missing, use the permitted harness question tool (`vscode/askQuestions` in VS Code; `ask_user` only where available); otherwise ask in chat or return the question to the caller if delegated without a user channel.
4. For direct edits, validate after the first substantive edit. Stop when the wording fits the brief; report the result, rationale, and material dependency.

## Output

- Provide the wording result and any material unresolved dependency.