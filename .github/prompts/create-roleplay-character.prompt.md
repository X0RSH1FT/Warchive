---
name: create-roleplay-character
description: Coordinate the design or normalization of a roleplay-ready character packet, scene context, and optional reusable character wrapper, then start in-character chat when requested.
argument-hint: "[Optional: character idea or notes, relationship to the user, setting, scenario, tone, secrets, goals, desired intensity, and whether to begin roleplay immediately.]"
agent: Artistic Director Agent
---

1. Read the attached context and identify whether the user wants to create a new character, substantially redesign an existing one, normalize mostly-supplied character details, build a reusable wrapper, or start roleplay immediately.
2. Use this workflow for both fresh design and mostly-specified normalization. If identity, relationship, and scene are already mostly supplied, preserve them and only fill or strengthen the genuinely missing packet fields.
3. If identity, relationship, current environment, or desired interaction style is unclear, use `#askQuestions` to summarize the roleplay-character brief first and gather only the decisions that materially change the packet or first scene.
4. Assemble a roleplay-ready character packet from the minimum stable fields: backstory and motives, traits and flaws, relationship to the user, current environment, voice examples, secrets or private knowledge, behavior rules, goals by scene, and mood guidance when relevant.
5. Use `Concept Architect Agent`, `Voice & Naming Agent`, and `Composition Agent` only for the slices they clearly own, then synthesize their outputs back into one packet through `Artistic Director Agent`.
6. When the user already supplied most of the character, preserve the supplied identity and relationship model unless they explicitly ask for redesign.
7. Treat few-shot dialogue examples, structured packet fields, late-turn steering, scene memory summaries, dual-layer knowledge, and reply boundaries as first-class prompting tools.
8. Treat continuation-style prompt construction as an experiment to support when the hosting workflow allows it, not as a guaranteed runtime behavior.
9. If the user wants a one-off reusable character wrapper or packet artifact, create or revise the narrowest appropriate file directly when it stays inside this subsystem. If the work broadens into prompt, agent, instruction, or workflow-customization refactoring, use `Meta Agent` as the next owner.
10. If the user wants to begin roleplay once the packet is ready, hand off to `Roleplay Character Agent` with the approved packet, relationship context, current scene, and any memory or mood guidance.
11. If the user only wants the packet or wrapper, stop after the approved character package is ready and summarize the remaining optional next step.
12. End with a concise summary of the route taken, the packet or edits produced, the validation run, any unresolved taste or scope question, and a concise imperative commit message when the changes are ready to keep.

## Output

- State whether the task is packet design, packet normalization, wrapper creation, or start-roleplay.
- Present the approved character packet or the route used to build it.
- Name the next owner when the work should move into in-character chat or broader customization work.