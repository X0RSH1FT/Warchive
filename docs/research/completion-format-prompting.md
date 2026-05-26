# Completion-Format Prompting for Roleplay with Small LLMs

**Research Date:** May 10, 2026  
**Author:** GitHub Copilot  
**Context:** Research note on chat, completion, and continuation-style prompt formatting in current roleplay tooling

---

## Table of Contents

1. [Scope and Terminology](#1-scope-and-terminology)
2. [The Documented Distinction: Chat vs. Text Completion](#2-the-documented-distinction-chat-vs-text-completion)
3. [What Current Sources Actually Support About Roleplay Prompting](#3-what-current-sources-actually-support-about-roleplay-prompting)
4. [Techniques Worth Testing](#4-techniques-worth-testing)
5. [Assistant Prefilling: Current Support Status](#5-assistant-prefilling-current-support-status)
6. [Prior Art in Current Tooling](#6-prior-art-in-current-tooling)
7. [Implementation Implications From Current Sources](#7-implementation-implications-from-current-sources)
8. [Recommended Evaluation Sequence](#8-recommended-evaluation-sequence)
9. [Sources](#9-sources)

---

## 1. Scope and Terminology

"Completion format prompting" is best treated as **practitioner shorthand**, not a formal technical term. The current documentation landscape is much more precise about the underlying distinction: **chat completion APIs** build prompts from role-labeled messages, while **text completion APIs** build prompts from a flat prompt string.[^1][^6][^7]

For this note, **completion format prompting** means designing the prompt so the model behaves like it is **continuing text already in progress** rather than answering an explicit instruction. In current roleplay tooling, the concrete documented mechanisms for this are:

- using a **text completion** endpoint with a flat prompt string[^1][^7]
- formatting that prompt as a **Story String** or similar narrative preamble[^6]
- ending the prompt with a character name or response prefix so the model continues from that point[^4][^6]

That framing is useful, but it is important not to overclaim. The current sources support the mechanics of these prompt formats. They do **not** prove that text completion is universally better than chat completion for every small model or provider.

---

## 2. The Documented Distinction: Chat vs. Text Completion

### Chat completion

In current tooling and API docs, chat completion means sending a sequence of messages with roles such as `system`, `user`, and `assistant`.[^1][^7]

Example shape:

```
[system]:    You are Grimbold Ironforge, a gruff dwarf blacksmith...
[user]:      A stranger enters the forge.
[assistant]: (model generates here)
```

Ollama's current `/api/chat` endpoint is documented this way: the request body takes a `messages` array, and each message has a role and content.[^7]

### Text completion

Text completion means sending a flat prompt string and asking the model to continue it.[^1][^6]

Example shape:

```
The forge smelled of smoke and iron. Grimbold set down his hammer as the stranger entered.

"I hear you're the best smith in the city," the stranger said.

Grimbold:
```

Ollama's current `/api/generate` endpoint is documented this way: the request body takes a `prompt` string rather than a `messages` array.[^7]

SillyTavern documents the same distinction in user-facing terms:

- **Chat Completion** builds a structured exchange between user, assistant, and system.[^1]
- **Text Completion** turns the prompt into "one long string" that the model continues.[^1]

### Practical consequence

The important documented difference is not "assistant model versus roleplay model." It is **prompt construction**:

- chat completion emphasizes role-labeled turns[^1][^7]
- text completion emphasizes prompt continuation from a single serialized context string[^1][^6][^7]

That difference matters because message history, recency, examples, stop strings, and final prompt position all affect generation behavior.[^4][^5][^6]

---

## 3. What Current Sources Actually Support About Roleplay Prompting

The current sources do not provide a rigorous, model-agnostic proof that small instruct models "break character" for one single reason. What they **do** support is a set of practical prompt-engineering observations that are directly relevant to roleplay systems.

### 3.1 Message history strongly conditions behavior

SillyTavern's current prompting guide explicitly states that message history influences:

- the model's memory of events and relationships[^5]
- its word choice and writing style[^5]
- how strongly later prompt edits can affect ongoing behavior[^5]

### 3.2 Instructions close to generation have extra weight

SillyTavern's current Post-History Instructions guidance states that instructions injected after message history are usually given higher priority than the main prompt because they are the final instructions the model receives before generating a reply.[^5]

This supports a concrete design principle: if you need a turn-local steer, **placing it close to generation is usually stronger than burying it earlier in the system prompt**.

### 3.3 Examples are one of the strongest steering tools

Anthropic's current prompting guidance says examples are one of the most reliable ways to steer output format, tone, and structure, and that a few good examples can materially improve consistency.[^2]

SillyTavern's prompting guide makes the same point from a roleplay-tool perspective: showing example messages is often easier and more effective than trying to explain the desired style abstractly.[^5]

### 3.4 Prompt style can influence output style

Anthropic's current docs explicitly note that the formatting style used in the prompt can influence the formatting style of the response, and suggest matching prompt style to desired output style more closely when steerability is weak.[^2]

This does not prove that prose-first character descriptions are always better, but it does support testing prompts that look more like the output style you want.

### 3.5 Template mismatch matters for text-completion workflows

SillyTavern's current Instruct Mode docs state that instruct formatting must match what a text-completion model actually expects, and that a chosen instruct template must match the model's training format.[^3]

This supports a narrower, source-backed version of the common community claim: **prompt format mismatch can hurt output quality**, especially in text-completion and instruct-style workflows.[^3]

### 3.6 What the sources do not prove

The current source set does **not** establish the following as universal facts:

- that text completion is always better than chat completion for 7B-13B models
- that assistant-mode leakage has a single causal explanation such as RLHF alone
- that assistant prefilling is broadly supported across providers and backends
- that any one tactic is the "single highest-leverage" fix without eval results

Those remain **implementation hypotheses** that should be tested empirically.

---

## 4. Techniques Worth Testing

This section separates **documented mechanics** from **testable hypotheses**.

### 4.1 Story-string / continuation formatting

**Documented mechanism:** SillyTavern's Context Template docs define the Story String as a prompt preamble for text-completion APIs, and its API docs describe text completion as continuation of a single serialized string.[^1][^6]

**Practical takeaway:** If a system adds a text-completion mode, serializing context as a story string is the natural implementation model.

### 4.2 Stop sequences and reply boundaries

**Documented mechanism:** SillyTavern exposes stop strings, name stop strings, and separator stop strings specifically to prevent spillover into the next segment or character turn.[^4][^6]

**Practical takeaway:** Stopping on `CharacterName:`-style boundaries is aligned with current tool practice for turn control.

### 4.3 Few-shot voice examples

**Documented mechanism:** Anthropic recommends examples for steering tone and structure; SillyTavern recommends example messages to show the model how to respond.[^2][^5]

**Practical takeaway:** Optional in-character example turns are one of the strongest source-backed prompt interventions available.

### 4.4 Post-history or final-turn steering

**Documented mechanism:** SillyTavern documents that Post-History Instructions are often higher priority because they arrive after history and before generation.[^5]

**Practical takeaway:** Small, turn-local cues placed at the end of the assembled context are likely worth testing before larger architecture changes.

### 4.5 Prose-first character framing

**Status:** Hypothesis, not settled fact.

The current sources do not explicitly say "write character cards as prose instead of instructions." What they do support is:

- examples are strong steering tools[^2][^5]
- prompt style can influence output style[^2]
- close-to-generation instructions matter[^5]

Taken together, that makes prose-first framing a reasonable experiment, but it should be described as a **testable prompting hypothesis**, not as a verified rule.

### 4.6 Assistant prefilling

**Status:** Documented for some text-completion workflows, backend-dependent for chat workflows, deprecated for latest Claude last-assistant-turn usage.[^2][^4]

This technique remains worth testing selectively, but it is not safe to present as universal provider behavior.

---

## 5. Assistant Prefilling: Current Support Status

Assistant prefilling needs careful treatment because support is **provider-specific** and **time-sensitive**.

### 5.1 Text completion workflows

SillyTavern's current Advanced Formatting docs say that **Start Reply With** for **Text Completion APIs** prefills the last line of the prompt and forces the model to continue from that point.[^4]

This is straightforward and fully consistent with text-completion mechanics.

### 5.2 Chat completion workflows

SillyTavern's current docs say that **Start Reply With** for **Chat Completion APIs** adds an assistant-role message to the end of the prompt. They also explicitly warn that:

- for some backends this is equivalent to prefilling the response[^4]
- some backends may not support it at all and may return a validation error[^4]

That means chat-side prefilling should be treated as an **empirical backend/model experiment**, not a baseline assumption.

### 5.3 Anthropic Claude

Anthropic's current Prompting best practices docs say that **prefilled responses on the last assistant turn are deprecated starting with Claude 4.6 models**. They also state that Mythos Preview rejects such requests with a 400 error, while older models continue to support prefills.[^2]

So the current accurate statement is:

- **older Claude models may still support prefills**[^2]
- **latest Claude guidance is to migrate away from last-assistant-turn prefills**[^2]

### 5.4 Ollama chat

Ollama's current `/api/chat` docs document a `messages` array with role-labeled messages, but they do **not** document partial-assistant continuation semantics or a dedicated prefilling feature.[^7]

So the current accurate statement is:

- Ollama chat definitely supports role-labeled chat history[^7]
- whether a trailing assistant message acts like a usable prefill is **not documented in the current API docs**[^7]

### 5.5 Practical takeaway

Assistant prefilling is still worth testing, but it should be framed as:

- **safe for text-completion style prompt construction**[^4]
- **model- and backend-specific for chat backends**[^4][^7]
- **not a current default recommendation for latest Claude models**[^2]

---

## 6. Prior Art in Current Tooling

The current tool ecosystem supports the following conclusions.

### SillyTavern

SillyTavern explicitly distinguishes:

- Chat Completion APIs[^1]
- Text Completion APIs[^1]
- Story String formatting for text completion[^6]
- Instruct template selection for text-completion workflows[^3]
- Start Reply With for both text and chat modes, with chat-mode caveats[^4]
- Post-History Instructions as a high-priority late injection[^5]

This makes SillyTavern a strong source for how modern roleplay tooling operationalizes these prompt-building concepts.

### Ollama

Ollama explicitly exposes both:

- `/api/chat` for role-labeled chat messages[^7]
- `/api/generate` for raw prompt-string generation[^7]

This makes Ollama a viable backend for either prompt strategy, but moving from one to the other still requires a different prompt-construction path.

### What this note does not rely on

This note does **not** rely on unverified claims about:

- how NovelAI internally trains its models
- whether KoboldCpp is architecturally "completion-first" in every configuration
- any provider-specific behavior that is not documented in the current source set

Those topics may still be true in practice, but they are outside what was verified here.

---

## 7. Implementation Implications From Current Sources

The current source set supports several practical conclusions about prompt formatting, but not a universal ranking of one mode over another.

### 7.1 Prompt assembly style is the main architectural distinction

The documented difference between chat completion and text completion is primarily about **how context is assembled**:

- chat completion serializes role-labeled turns[^1][^7]
- text completion serializes a flat continuation prompt[^1][^6][^7]

That means any comparison between the two is really a comparison between different prompt-construction strategies, not just different endpoint names.

### 7.2 Examples and late-turn instructions are the strongest documented steering levers

Across the cited sources, the most consistently supported steering tools are:

- example turns or few-shot demonstrations[^2][^5]
- instructions placed close to generation[^5]
- prompt formatting that resembles the desired output style[^2]

These are lower-cost experiments than introducing a new backend mode, and they are better supported by the current documentation set.

### 7.3 Boundary control and template matching remain important

Current tooling docs give direct support to two operational concerns:

- stop strings help contain turn boundaries and reduce spillover[^4][^6]
- instruct or serialization templates should match the model's expected training format when using text-completion-style prompting[^3]

These are implementation details, but they materially affect whether a prompt format works as intended.

### 7.4 Assistant prefilling is conditional, not baseline

The sources support prefilling as a real technique, but not as a universal one:

- it is straightforward in some text-completion flows[^4]
- it is backend-dependent in chat workflows[^4]
- it is no longer a default recommendation for the latest Claude models[^2]

That makes prefilling a capability-specific experiment rather than a general assumption.

### 7.5 The current evidence supports experimentation, not absolute claims

The sources justify testing continuation-style prompt construction, examples, and late-turn steering. They do not justify blanket claims that one prompting mode is always better for small models, roleplay, or local inference.

---

## 8. Recommended Evaluation Sequence

The safest evaluation order is to move from the most source-backed, lowest-cost experiments toward the more invasive ones.

### 8.1 Start with prompt-only changes

These are the most defensible first tests because they are directly supported by the cited prompting guidance and do not require a transport or backend change.

1. Add or refine few-shot examples for tone, structure, and voice.[^2][^5]
2. Experiment with stronger late-turn or post-history steering.[^5]
3. Test whether prose-first framing improves continuation quality compared with imperative instructions.[^2][^5]

This order keeps early experiments close to the strongest current evidence.

### 8.2 Treat assistant prefilling as a conditional experiment

Prefilling is still worth testing, but only with provider- and model-specific expectations:

- do not assume support on latest Claude 4.6+ paths[^2]
- do not assume support on chat backends unless the backend documents or demonstrates it[^4][^7]
- evaluate it as an opt-in capability rather than a default design choice

### 8.3 Add a true text-completion path only if simpler changes plateau

If prompt-only experiments still leave quality on the table, then a dedicated text-completion path becomes a justified next step.

That path would likely require:

- a serializer that converts context into a flat story string[^6]
- stop-string handling at serialized turn boundaries[^4][^6]
- separate evaluation, because chat-mode and completion-mode prompts are not directly comparable by default

This is the most invasive option, but it is also the most faithful implementation of continuation-style prompting as documented in the current sources.

### 8.4 Evaluate changes against explicit criteria

Useful evaluation criteria include:

- character or persona consistency
- format adherence
- turn-boundary containment
- resistance to assistant-style leakage
- overall response quality across repeated turns

The key point is that current documentation supports experimentation, but the final decision still depends on local evaluation results.

---

## 9. Sources

[^1]: SillyTavern Project. "API Connections - ELI5: Chat Completions vs Text Completions." SillyTavern Documentation. https://docs.sillytavern.app/usage/api-connections/ - Current user-facing documentation for how SillyTavern distinguishes role-labeled chat prompting from flat-string text completion prompting.

[^2]: Anthropic. "Prompting best practices." Claude API Documentation. https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices - Current Anthropic guidance on examples, prompt style matching, and migration away from last-assistant-turn prefills in Claude 4.6+.

[^3]: SillyTavern Project. "Instruct Mode." SillyTavern Documentation. https://docs.sillytavern.app/usage/core-concepts/instructmode/ - Current documentation for instruct-template matching and story-string wrapping in text-completion workflows.

[^4]: SillyTavern Project. "Advanced Formatting." SillyTavern Documentation. https://docs.sillytavern.app/usage/core-concepts/advancedformatting/ - Current documentation for stop strings and Start Reply With behavior in both text-completion and chat-completion modes.

[^5]: SillyTavern Project. "Prompts." SillyTavern Documentation. https://docs.sillytavern.app/usage/prompts/ - Current guidance on message-history effects, example messages, and Post-History Instructions.

[^6]: SillyTavern Project. "Context Template." SillyTavern Documentation. https://docs.sillytavern.app/usage/prompts/context-template/ - Current documentation for Story String construction and text-completion prompt serialization.

[^7]: Ollama. "API Reference" and "Generate a chat message." Ollama Documentation. https://docs.ollama.com/api and https://docs.ollama.com/api/chat - Current Ollama documentation for `/api/generate` prompt-string generation and `/api/chat` role-labeled message generation.

---

## Summary

The current source set supports the following conclusions:

- text completion and story-string prompting are real, documented prompt-building patterns[^1][^6][^7]
- examples and late-turn instructions are among the strongest supported steering tools in current guidance[^2][^5]
- stop strings and template matching matter for keeping the model within the intended turn and format[^3][^4][^6]
- assistant prefilling is not universally supported and is no longer a safe default assumption for the latest Claude models[^2][^4][^7]
- completion-format prompting is a credible strategy to evaluate, but not a universally proven default

That is a source-backed foundation for evaluating prompt formatting choices.
