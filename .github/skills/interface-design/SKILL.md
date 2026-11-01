---
name: interface-design
description: Review, design, or directly refine a UI with platform-aware guidance through Interface-Design. Use when the main problem is screen layout, navigation, hierarchy, interaction flow, states, or visual coherence rather than general implementation.
disable-model-invocation: true
argument-hint: "[Optional: target files, screen or route, platform, audience, primary task, constraints, references, and whether you want critique, concepts, or direct edits.]"
---
1. Read the current context and identify the most concrete interface anchor: a screen, route, component, screenshot, wireframe, named file, or user flow. Invoke `Interface-Design` explicitly if supported; loading the skill alone does not activate that agent. Otherwise do the scoped pass without claiming delegation.
2. Decide whether the requested pass is primarily critique, redesign, layout and navigation planning, platform adaptation, or direct file editing.
3. If a decision-changing platform or task constraint is missing, use the permitted harness question tool (`vscode/askQuestions` in VS Code; `ask_user` only where available); otherwise ask in chat or return the question to the caller if delegated without a user channel.
4. Retrieve only enough project context to understand the target surface, adjacent implementation constraints, and the current interface shape.
5. Adapt the pass to the named surface instead of assuming a generic web app. Check for platform-specific constraints such as Streamlit layout limits, responsive web behavior, windowed desktop density, mobile touch ergonomics, terminal interaction limits, or dashboard data density.
6. Prioritize the highest-leverage issue first: hierarchy, navigation, task flow, state clarity, density, accessibility, or visual coherence.
7. Separate structural guidance, interaction guidance, and visual guidance when that separation makes the recommendation easier to implement.
8. If the user names files or asks for the design pass to land directly in the project, edit the smallest coherent set of UI-facing files and run the narrowest relevant validation immediately after the first substantive edit.
9. When this pass was requested by `Artistic-Director`, return the UI recommendation and any implementation or validation dependency to the director for coordination; do not silently expand into source implementation or imply a direct code or review route from that workflow.
10. End with a concise summary of the chosen direction or edits made, the key constraints that shaped the result, the validation run, any remaining design risk, and a concise imperative commit message when the changes are ready to keep.

## Output

- For critique or review, lead with the highest-leverage interface issue before smaller notes.
- For concept work, provide a small number of meaningfully distinct directions and recommend the strongest one when appropriate.
- For direct edits, report the validation result and the next owner if the workflow should continue.
