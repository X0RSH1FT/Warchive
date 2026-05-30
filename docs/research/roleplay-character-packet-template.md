# Roleplay Character Packet Template

**Audience:** prompt authors and workflow designers building or normalizing roleplay-ready character packets.

**Scope:** a durable reference shape for the packet used by roleplay design and enactment workflows.

This template is meant to support three adjacent jobs:

1. design a new roleplay-ready character
2. normalize mostly-specified character notes into a stable packet
3. hand a stable packet into in-character enactment without mixing design work into live scene play

## Design vs continuity fields

Not every field should be editable during enactment.

Design-layer fields define who the character is and should normally be created or revised through the design workflow:

- backstory and motives
- traits and flaws
- relationship model with the user
- voice identity
- secrets and private knowledge
- behavior rules

Continuity-layer fields track what is true in the current scene and can change during roleplay:

- current environment
- goals by scene
- scene memory summary
- current emotional state
- recent interaction state
- mood guidance

That split helps keep enactment from quietly turning into redesign.

## Packet fields

| Field | Purpose | Layer | Notes |
|---|---|---|---|
| Identity | Core name, role, and self-concept | Design | The minimum statement of who this character is. |
| Backstory and motives | What shaped them and what they want | Design | Focus on the parts that drive behavior. |
| Traits and flaws | Temperament, habits, contradictions, vulnerabilities | Design | Keep traits actionable, not decorative. |
| Relationship to user | Who the user is to them and how that bond works | Design | This is the relationship model, not just the latest mood. |
| Current environment | Where the scene is happening and what surrounds them | Continuity | Prefer concrete situational details over world summary. |
| Voice examples | Few-shot dialogue examples and style cues | Design | Best used as short, high-signal examples. |
| Secrets and private knowledge | What they know, hide, fear, or will not say freely | Design | Shapes subtext and restraint. |
| Behavior rules | Boundaries, obligations, taboos, and consistent response rules | Design | Useful for preventing drift. |
| Goals by scene | What they want right now in this interaction | Continuity | Should be scene-local and revisable. |
| Scene memory summary | Compact memory of recent events and promises | Continuity | Summarize only what matters to the next turn. |
| Current emotional state | Their present emotional baseline | Continuity | Keeps reactions consistent across turns. |
| Recent interaction state | What just changed between the speakers | Continuity | Useful for tension, trust, and momentum. |
| Mood guidance | Optional runtime control for warmth, intensity, restraint, drama, or pace | Continuity | Guidance, not identity override. |
| Reply boundaries | Output-shape constraints for turn containment | Execution | Better treated as response rules than story content. |

## Recommended packet order

Use a stable ordering so packet comparison and normalization stay readable:

1. identity
2. backstory and motives
3. traits and flaws
4. relationship to user
5. current environment
6. voice examples
7. secrets and private knowledge
8. behavior rules
9. goals by scene
10. scene memory summary
11. current emotional state
12. recent interaction state
13. mood guidance
14. reply boundaries

## Example template

```md
# Character Packet

## Identity
- Name:
- Role or archetype:
- Core self-concept:

## Backstory and motives
- Key history:
- Long-term desire:
- Current pressure:

## Traits and flaws
- Traits:
- Flaws:
- Contradictions:

## Relationship to user
- Who the user is to this character:
- What they feel toward the user:
- What they want from the user:

## Current environment
- Location:
- Situation:
- Immediate stakes:

## Voice examples
- Example 1:
- Example 2:
- Example 3:

## Secrets and private knowledge
- Hidden fact:
- Sensitive motive:
- What they will avoid saying openly:

## Behavior rules
- Must do:
- Must not do:
- Likely response pattern under stress:

## Goals by scene
- Immediate goal:
- Secondary goal:

## Scene memory summary
- Recent events that matter now:

## Current emotional state
- Baseline emotion:
- Underlying tension:

## Recent interaction state
- What just changed between us:

## Mood guidance
- Desired intensity or restraint:

## Reply boundaries
- Dialogue vs narration balance:
- Turn-boundary rule:
```

## Normalization rules

When turning loose character notes into a stable packet:

1. preserve supplied identity unless the user asks for redesign
2. preserve the supplied relationship model unless the user asks for redesign
3. only synthesize missing fields that are necessary for enactment
4. keep few-shot examples short and distinctive
5. prefer scene-local goals over abstract motivational filler
6. keep continuity notes compact enough to survive repeated updates

## Enactment handoff checklist

Before starting in-character chat, confirm that the packet has:

- a stable identity
- a defined relationship to the user
- a current scene or environment
- enough voice guidance to avoid generic responses
- at least one current scene goal
- at least one boundary rule if the character needs strong containment

If those are present, the packet is usually ready for enactment.