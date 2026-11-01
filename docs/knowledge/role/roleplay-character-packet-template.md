# Roleplay Character Packet Template

**Audience:** prompt authors and workflow designers creating, normalizing, exporting, or enacting roleplay characters.

**Scope:** repository field and handoff reference for the full character dossier and a separate, optional live runtime envelope. The [Character-Generator template](../../../.github/agents/character-generator.agent.md) retains the same rich, self-contained dossier schema so it also works when this document cannot be read. Maintain the two in sync; this reference is not a competing short-form output template. The actual user-approved dossier or supplied packet is the source for that character's canon, not defaults in this reference.

For new full dossiers, use all eight sections below, in order, and at least six varied `Player:` / `Character:` sample exchanges. Explicit requests for a subset, different detail level, or sample count override those defaults; six exchanges still apply when samples are requested without a count. Keep relevant supplied detail rather than flattening it into category names. In an included field, distinguish user-provided facts, proposed additions, genuinely unknown (`Not specified`), and inapplicable (`Not applicable`, with a reason). Omitted fields in an explicitly scoped output are not unknown. Do not invent measurements, credentials, trauma, player choices, or intimacy simply to fill a slot.

## Full dossier schema

Use these headings and field labels in this order for a full dossier. Adjust details to a nonhuman character or setting where appropriate without discarding the fields' purpose.

### 1. Identity and premise
- **Name, aliases, pronouns, age/life stage:** Establish identity and relevant life stage; when intimate characterization is relevant, adulthood must be explicitly established rather than inferred from appearance.
- **Species/ancestry, setting, era, home/base:** As applicable.
- **Role and one-line hook:** What makes the character playable rather than merely descriptive.
- **Canon status:** User-provided facts; proposed additions; unresolved or deliberately open details.

### 2. Physical presence
- **Stats:** Height, build, and any setting-relevant physical or game statistics; approximate where appropriate and identify the ruleset for game stats.
- **Physique and movement:** Posture, gait, strength/limitations, habitual gestures.
- **Appearance:** Face, hair, eyes, skin or equivalent, clothing, grooming, equipment.
- **Identifying traits:** Scars, marks, voice quality, scent, mannerisms, or nonhuman features; how others first read them.

### 3. Mind and temperament
- **Personality:** Core traits, contradictions, virtues, flaws, worldview, and moral lines.
- **Motives:** Long-term need, immediate want, fear, internal conflict, and what they will sacrifice.
- **Mental habits:** Stress response, coping, humor, anger, vulnerability, decision style.
- **Likes/dislikes:** Specific pleasures, irritants, interests, and aversions that can drive scenes.
- **Education and knowledge:** Formal learning, self-taught expertise, languages, beliefs, blind spots.

### 4. History and capabilities
- **Backstory:** Formative events in chronological order, with consequences visible today.
- **Profession and standing:** Work, resources, reputation, obligations, and daily routine.
- **Skills and limits:** Competencies, signature methods, costs, weaknesses, and what they cannot do.
- **Secrets and private knowledge:** What is true, who knows, what they conceal, and plausible reveal conditions; not casual dialogue.

### 5. Relationships and intimacy
- **Social web:** Important allies, rivals, family, loyalties, debts, and unresolved tensions.
- **Relationship to the player:** Player role/name if known; how they met; current trust, familiarity, attraction or tension if relevant; power dynamic; what each believes about the other; what could change the relationship. Keep the stable relationship model distinct from live trust and scene changes.
- **Intimacy (adult characters, if relevant):** Orientation or attractions, romantic/sexual preferences, approach to affection, boundaries, and relationship expectations. Preserve requested, permitted non-graphic characterization and sensual detail where relevant; do not assume player attraction or invent intimacy to fill a slot.
- **Interaction boundaries:** What the character welcomes, resists, negotiates, or will not do in the story; separate character preferences from player-provided out-of-character boundaries.

### 6. Voice and speech samples
- **Voice rules:** Register, cadence, vocabulary, accent only if grounded, syntax, favored phrases, nonverbal tells, and words or tones they avoid.
- **Texting/writing style:** Punctuation, length, formatting, emoji use if any, and differences from spoken voice.
- **Sample exchanges:** At least six short `Player: ...` / `Character: ...` pairs for a full dossier or a speech-sample request with no count: first contact, everyday warmth or humor, disagreement, pressure, vulnerability, and a relationship-specific or secret-adjacent moment. Vary wording without making habits catchphrases; show concise action/narration if part of the intended format. Honor an explicit count or detail request.

### 7. Roleplay operating guide
- **Scene defaults:** Starting situation, environment, current mood, immediate goal, and a hook for the player's first turn; these are replaceable inputs, not fixed player actions or live continuity.
- **Behavior rules:** How motives, beliefs, flaws, and relationships affect choices; what provokes trust, withdrawal, conflict, or change.
- **Agency and knowledge:** Stay within the character's perspective and knowledge; do not dictate the player's dialogue, feelings, or actions. Do not reveal private notes without a believable cause.
- **Reply style:** Point of view, tense, dialogue/action balance, length, pacing, and whether out-of-character clarification is allowed when requested.
- **Continuity:** Track promises, discoveries, injuries, relationship shifts, and unresolved threads between scenes; distinguish stable canon from changing scene memory.
- **Development:** Likely arc, credible turning points, and behaviors that would break characterization; development and trust may change in play without silently rerouting the character's core design.

### 8. Agent-file transfer
- **Stable instructions:** A concise, ready-to-adapt transfer list of identity, voice, perspective, relationship logic, secret handling, and player-agency rules for a future character agent. This list does not cap a requested full agent-file export.
- **Runtime inputs:** Explicit slots for player identity/relationship, current scene, mood, recent events, and applicable player boundaries; never imply unknown slots are established facts.
- **Open questions:** Only decisions materially changing portrayal; omit if none.

## Optional live runtime envelope

Pass separately when relevant/requested for enactment or handoff, rather than appending a mandatory large runtime section to every dossier. Label each live item as supplied/established, proposed default, unknown/open, or inapplicable; do not turn a proposed scene hook or absent player history into canon. Later user-supplied scene details and actual continuity supersede section 7 scene defaults, within applicable higher-level rules and user boundaries. A memory summary records what happened, not an authority to override the user's corrections or boundaries.

| Runtime item | Carry forward when available |
|---|---|
| Player identity and relationship state | Player name/role if supplied; distinguish the dossier's stable relationship model from current trust, distance, attraction, and actual changes. Leave unknown identity or shared history open. |
| Scene and environment | Current location, situation, participants, stakes, and immediate sensory context; replace scene defaults when live details exist. |
| Goals and pressures | Current character goal, obstacles, scene pressure, and any established stakes. |
| Emotional state and mood | Current feeling or conversational stance; user-provided mood/intensity guidance is not an identity rewrite. |
| Recent interaction state | Last exchange and what changed between speakers; never manufacture a player response. |
| Compact continuity memory | Established promises, discoveries, injuries, relationship shifts, and unresolved threads relevant to the next turn; omit if none established. |
| Reply boundaries and execution settings | Applicable user or higher-level constraints on output and consent, distinct from character-authored reply-style defaults; e.g., point of view, length, dialogue/narration balance, and one-turn containment. Never treat character preferences as player permission. |

**Compact handoff example:** “Approved source: full eight-section dossier above (or the approved supplied packet), including its voice exchanges and private-notes handling; optional source additions: [labeled proposals only]. Runtime known: player role [if supplied], live scene [if supplied], latest established interaction [if any], applicable boundaries [if supplied]. Runtime open: [only material unknowns]. Request: next in-character turn.” Pass the actual source and runtime context, not this shorthand alone. One-off delegation returns a single response to its caller; an ongoing session requires a user-approved, host-supported switch/handoff with the context furnished, and neither route guarantees durable memory or file persistence.

## Enactment and export checks

1. For design, compare the requested scope against the eight sections in order and the actual supplied canon. Mark proposals; do not force unknown facts into filled slots.
2. For enactment, use the approved dossier or sufficient supplied character context plus any available live context. Ask only for a critical missing field needed for the next turn; never require a new full dossier, six samples, or a formatted envelope before replying. Portray the rich source without reciting it or exposing private notes.
3. For an explicitly requested reusable character `.agent.md`, use the dossier or approved supplied packet as content authority. Retain full source detail by default, including samples, unless export scope is explicitly shortened independently of dossier scope; keep replaceable scene inputs separate. Author through the [Artistic-Director export branch](../../../.github/agents/artistic-director.agent.md) and `Meta-Agent`; return inline content when requested or save only to an authorized path.
