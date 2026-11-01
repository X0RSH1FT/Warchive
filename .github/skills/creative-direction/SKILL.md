---
name: creative-direction
description: Adversarially challenge an existing creative brief, draft, or approved direction with a high-contrast alternative and explicit tradeoffs.
disable-model-invocation: true
argument-hint: "[Optional: target files, draft text, desired medium, audience, tone, references, constraints, or the decision to challenge.]"
---
1. Read the existing brief, draft, or approved direction and its fixed constraints. Invoke `Creative-Philosopher` explicitly if supported; loading this skill alone does not select an agent. If unavailable, perform the bounded challenge without claiming delegation.
2. Identify the obvious assumption; propose one high-contrast alternative and compare gains, losses, and audience fit. Recommend retaining the original if stronger. Do not edit the approved artifact in this challenge pass.
3. If the anchor or a decision-changing constraint is missing, use the active harness's permitted question tool (`vscode/askQuestions` in VS Code; `ask_user` only where available); otherwise ask in chat or return the question to the caller if delegated without a user channel.
4. Return the challenge and tradeoff to the caller for a decision. For open-ended concept, voice, or composition work, use the corresponding specialist entry instead.

## Output

- Include the challenged assumption, concrete alternative, tradeoff, and recommendation.