---
name: creative-direction
description: Brainstorm, review, or directly revise a stylistic, artistic, literary, visual, or abstract decision with an unorthodox but coherent creative perspective. Use when you want broad ideation rather than the roleplay-character workflow.
argument-hint: "[Optional: target files, draft text, desired medium, audience, tone, references, constraints, or the decision to challenge.]"
agent: Creative Philosopher Agent
---

1. Read the attached context and identify the most concrete creative anchor: a draft, decision, prompt, visual direction, title, name, theme, tone target, or file.
2. Decide whether the requested pass is primarily brainstorming, comparison, critique, rewrite, or direct file editing.
3. If the medium, audience, constraints, or tolerance for experimentation is unclear, use `#askQuestions` to summarize the requested creative pass first and gather the missing decision before expanding the idea space.
4. If the request is primarily about building a roleplay-ready character, preparing a character packet, or starting an in-character scene, route to `create-roleplay-character` or `roleplay-character` instead of keeping the work here.
5. Retrieve only enough project context to ground the creative work in the actual artifact or target file.
6. For brainstorming or comparison, produce several meaningfully distinct directions, explain why each works, and recommend the strongest option when one clearly stands out.
7. For critique or review, lead with the largest missed opportunity, stylistic weakness, tonal mismatch, or conceptual gap before proposing stronger alternatives.
8. If the user names a file or asks for the creative pass to land directly in the project, edit the file with the smallest coherent revision and run the narrowest relevant validation immediately after the first substantive edit.
9. Prefer surprising but defensible synthesis over generic variation. Use contrast, inversion, metaphor, symbolism, and reframing intentionally.
10. Hand off to `Documentation Agent` when the result should become maintained documentation, to `Meta Agent` when it should become a customization change, and to `Reviewer Agent` when a creative edit needs signoff.
11. End with a concise summary of the direction chosen or the edits made, the validation run, any remaining taste or scope question, and a concise imperative commit message when the changes are ready to keep.

## Output

- For ideation, include the challenged assumption, the candidate directions, and the recommended option.
- For review, keep the strongest finding or opportunity first.
- For direct edits, include the validation result and any next owner.