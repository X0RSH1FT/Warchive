---
name: prompt-enhancements
description: Audit and improve this repository's prompt, instruction, and agent-customization system. Use when you want a focused prompt workflow refactor.
argument-hint: "[Optional: target customization files, workflow goals, known routing issues, validation expectations, or docs to keep in sync.]"
agent: Coordinator Agent
---

Refactor this repository’s prompt, instruction, and agent-customization system so it becomes a strong reference implementation for practical agentic software delivery.

Goal:
Make this repository a “golden” example of prompt design for engineering work. Improve the prompts and related customization files so they use established techniques where they add value, without turning the system into prompt bloat or cargo-cult patterns.

Primary techniques to apply where appropriate:
- task decomposition
- few-shot prompting
- reasoning scaffolds
- retrieval-first context gathering
- tool use
- planner-executor separation
- review loops
- validation-first execution
- documentation ownership guidance

Important constraint:
Do not force every technique into every prompt. Apply them where they improve reliability, clarity, or evaluation. Keep prompts lean and operational.

What to do:
1. Audit the current prompt, instruction, agent, and related documentation files in the repository.
2. Identify the current workflow patterns already present and map them to the technique families above.
3. Identify gaps, over-complexity, duplication, weak phrasing, and places where the prompts are not technically accurate about editor or tool behavior.
4. Propose a target prompt architecture for the repository:
   - what prompt types should exist
   - what each one should own
   - which techniques belong in each prompt type
   - which techniques should remain optional
5. Implement the refactor directly in the repository.
6. Keep the resulting system grounded in standard software engineering practice:
   - bounded tasks
   - reproducible validation
   - clear ownership
   - explicit review
   - durable documentation updates
7. Preserve or improve readability. Prefer short operational wording over long theoretical explanations.
8. Add or update durable documentation explaining the prompting strategy and why certain techniques are used.
9. Validate the changed files and summarize the final design.

Specific expectations:
- Distinguish clearly between prompting techniques, agent workflow design, and model architecture topics.
- Do not present repo-local conventions as universal product features.
- Use few-shot examples only where they materially improve prompt behavior.
- Use reasoning scaffolds to improve task quality, not to create verbose or rigid output.
- Ensure prompts encourage narrow context gathering before editing.
- Ensure prompts encourage the cheapest meaningful validation after changes.
- Ensure review-oriented prompts are findings-first.
- Ensure documentation prompts reinforce clear ownership of durable docs, workflow notes, and planning artifacts.
- Keep terminology defensible for experienced software engineers.

Deliverables:
1. Updated prompt and instruction files.
2. A short design summary of the new prompting system.
3. A mapping of each major prompt to the techniques it uses and why.
4. A brief note on techniques intentionally not used everywhere, and why.

Working style:
- Start by auditing the existing customization files.
- Form a short implementation plan before broad edits.
- Make the smallest coherent set of changes that improves the whole system.
- Validate touched files before concluding.
- If the work is non-trivial, include a review pass before closing.

Success criteria:
- The repository reads like a coherent, deliberate prompting system rather than a collection of ad hoc prompt files.
- The prompts are technically accurate, concise, and reusable.
- The workflow supports planning, implementation, debugging, review, testing, documentation, and inquiry tasks cleanly.
- The repository can credibly serve as a reference example for agent prompting in software delivery.