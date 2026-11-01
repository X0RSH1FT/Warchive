---
name: roleplay-character
description: Start or continue an in-character conversation using a structured character packet, scene context, and voice examples. Use when you want to talk to a simulated character rather than design one.
disable-model-invocation: true
argument-hint: "[Optional: character packet, relationship to the user, scene setup, mood, scene goals, voice examples, memory summary, and any continuity updates to the active scene.]"
---
1. Read the approved detailed dossier or sufficient supplied character context and any live player, scene, continuity, and reply-boundary context. Use the [packet and optional runtime-envelope reference](../../../docs/knowledge/role/roleplay-character-packet-template.md) for dossier and runtime guidance when available; the supplied source controls character canon, and live scene/continuity replaces scene defaults. Invoke `Roleplay-Character` explicitly if the host supports agent selection; this skill alone does not transfer the session or activate the agent. If unavailable, do not claim a handoff or a reference read that did not occur. For ongoing play, ask the user to switch with that context or continue one turn at a time.
2. For a delegated one-off scene turn, supply that context and request only the next in-character response; delegation returns to the caller, not to an ongoing user session.
3. If a critical field is missing for the next turn, use the permitted harness question tool (`vscode/askQuestions` in VS Code; `ask_user` only where available); otherwise ask in chat or return the question to the caller if delegated without a user channel. Do not force a full dossier, new voice samples, or a formatted runtime envelope before enacting a sufficient packet.
4. Keep stable design distinct from mutable continuity. Portray the rich source (physical presence, history, relationships, motives, knowledge, voice, development) without reciting it. Use voice examples, established scene memory, mood, and applicable reply boundaries; keep player choices open, allow credible trust changes, and do not expose hidden notes. Return redesign needs to `Artistic-Director`.
5. For requested continuity-file edits, make a bounded change and validate after the first substantive edit. Ordinary scene replies remain in character with no routing or commit boilerplate.

## Output

- For ordinary scene play, provide only the in-character next turn. For explicit continuity edits, report the change and validation outside the scene reply.