---
name: interface-design
description: Review, design, or directly refine a UI with platform-aware guidance through Interface Design Agent. Use when the main problem is screen layout, navigation, hierarchy, interaction flow, states, or visual coherence rather than general implementation.
argument-hint: "[Optional: target files, screen or route, platform, audience, primary task, constraints, references, and whether you want critique, concepts, or direct edits.]"
agent: Interface Design Agent
---

1. Read the current context and identify the most concrete interface anchor: a screen, route, component, screenshot, wireframe, named file, or user flow.
2. Decide whether the requested pass is primarily critique, redesign, layout and navigation planning, platform adaptation, or direct file editing.
3. If the platform, user task, constraints, or tolerance for experimentation is unclear, use `#askQuestions` to summarize the requested design pass first and gather only the missing decision that changes the next recommendation.
4. Retrieve only enough project context to understand the target surface, adjacent implementation constraints, and the current interface shape.
5. Adapt the pass to the named surface instead of assuming a generic web app. Check for platform-specific constraints such as Streamlit layout limits, responsive web behavior, windowed desktop density, mobile touch ergonomics, terminal interaction limits, or dashboard data density.
6. Prioritize the highest-leverage issue first: hierarchy, navigation, task flow, state clarity, density, accessibility, or visual coherence.
7. Separate structural guidance, interaction guidance, and visual guidance when that separation makes the recommendation easier to implement.
8. If the user names files or asks for the design pass to land directly in the project, edit the smallest coherent set of UI-facing files and run the narrowest relevant validation immediately after the first substantive edit.
9. Hand off to `Implementation Agent` when the work becomes primarily source implementation, to `Testing Agent` when runtime inspection becomes dominant, to `Documentation Agent` when the result should become maintained guidance, and to `Reviewer Agent` when a UI-facing change needs independent signoff.
10. End with a concise summary of the chosen direction or edits made, the key constraints that shaped the result, the validation run, any remaining design risk, and a concise imperative commit message when the changes are ready to keep.

## Output

- For critique or review, lead with the highest-leverage interface issue before smaller notes.
- For concept work, provide a small number of meaningfully distinct directions and recommend the strongest one when appropriate.
- For direct edits, report the validation result and the next owner if the workflow should continue.
