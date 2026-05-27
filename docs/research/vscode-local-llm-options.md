# VS Code Local LLM Options: Ollama, llama.cpp, and Cost-Aware Workflows

**Research Date:** May 25, 2026  
**Author:** GitHub Copilot  
**Audience:** VS Code users comparing local-model options as OpenAI and Claude usage costs rise  
**Scope:** chat, agent mode, prompt files, custom agents, inline completion, and API-compatible app development on Windows

---

## Summary

VS Code and GitHub Copilot now document ways to use locally hosted models for chat, but the integration story splits into distinct buckets that should not be treated as interchangeable.

- **Stable native documented paths** cover built-in providers and extension-provided model providers in the Language Models editor.
- **Insiders-only native documented paths** cover the Custom Endpoint provider for arbitrary compatible endpoints.
- **Third-party AI extensions** such as Continue, Cline, and Twinny are separate from native Copilot model plumbing and often own their own chat, completion, and agent UX.
- **Raw local endpoints** such as Ollama and llama.cpp server are excellent for app development and for extensions that can talk to local APIs, but that does not by itself prove native Copilot on stable VS Code can talk to them directly.

The key hard limit is unchanged in the current VS Code docs: **locally hosted models can be used for chat, but cannot currently be connected to Copilot inline suggestions**. If local ghost-text completion is a requirement, the documented route is still an extension that implements its own inline completion provider.

For Windows users deciding between Ollama and llama.cpp server, the practical split is straightforward:

- **Ollama** is the easier local runtime to install and operate.
- **llama.cpp server** has the stronger documented protocol surface, especially when Responses or Anthropic Messages compatibility matters.

That last point is a pragmatic judgment from the sources below, not a first-party VS Code guarantee.

---

## Path Types, Kept Separate

| Bucket | Documented status | What the docs actually establish | What the docs do not establish |
|---|---|---|---|
| Stable native built-in providers | First-party stable VS Code docs | The Language Models editor can add models from built-in providers. Some providers require an API key and endpoint URL. | The sources checked do **not** name Ollama or llama.cpp as built-in stable providers, and do not show stable Copilot as a general "point it at any local endpoint" feature. |
| Stable native extension-provided model providers | First-party stable VS Code docs | Marketplace extensions can add model providers to the Language Models editor, including access to cloud-hosted or locally running models. | This is not the same as native support for arbitrary Ollama or llama.cpp endpoints. It depends on a specific extension exposing that provider. |
| Insiders-only Custom Endpoint provider | First-party VS Code docs, but **Insiders only** | VS Code Insiders can connect chat to any compatible endpoint through the Custom Endpoint provider, with Chat Completions, Responses, and Messages API types. | This is not the current stable/native path. Saying "VS Code supports arbitrary local endpoints" without the Insiders qualifier is too broad. |
| Third-party AI extensions | Extension docs, not first-party Copilot truth | Extensions like Continue, Cline, and Twinny can target Ollama, llama.cpp, or OpenAI-compatible local APIs and often provide their own chat, completion, or agent experiences. | These extensions should not be described as native Copilot support. Their capabilities do not automatically transfer to prompt files, custom agents, or Copilot inline suggestions. |

---

## What Is Actually Possible Today

### Stable native documented paths

The stable VS Code docs support these claims:

- The Language Models editor can add models from **built-in providers**.
- The Language Models editor can also add models from **extension-provided model providers**.
- Prompt files and custom agents sit above the model layer, so they remain useful wherever a chat-capable model is actually available.
- For a model to appear for **agents in chat**, it must support **tool calling**.
- BYOK applies to the **chat experience**, not to Copilot inline suggestions or every AI surface in VS Code.

What the stable docs do **not** prove from the sources checked here:

- that stable/native Copilot generally supports arbitrary Ollama endpoints directly
- that stable/native Copilot generally supports arbitrary llama.cpp server endpoints directly
- that Ollama or llama.cpp are named stable built-in providers in the first-party docs

### Insiders-only native documented path

The first-party docs explicitly document a broader path in **VS Code Insiders**:

- the **Custom Endpoint** provider is Insiders-only
- it replaces the deprecated OpenAI Compatible provider
- it supports **Chat Completions**, **Responses**, and **Messages** API types per model
- it is the native documented route for connecting chat in VS Code to an arbitrary compatible endpoint

This is the strongest first-party path for llama.cpp server in the sources I checked, because llama.cpp server explicitly documents all three of those API families. Ollama is still a practical local candidate, but the source-backed fit is narrower in this note because the verified Ollama material here clearly covers native API usage, tool calling, and OpenAI Chat Completions compatibility rather than the full Responses and Messages spread.

### Stable native via extension-provided model providers

This is easy to overlook, but it is its own bucket.

- VS Code stable docs say extensions can add model providers to the Language Models editor.
- Those extension providers can expose **cloud-hosted or locally running models**.
- The example in the first-party docs is an extension for Foundry local and cloud-hosted models, not Ollama or llama.cpp specifically.

So the stable first-party statement is: **extensions can surface local models inside the native model picker**. That is different from saying stable Copilot natively supports arbitrary local Ollama or llama.cpp endpoints by itself.

### Third-party extensions using local endpoints

Continue, Cline, Twinny, and Tabby live outside the native Copilot integration story.

- They often provide their own chat, agent, and completion surfaces.
- They may talk directly to Ollama, llama.cpp server, or any OpenAI-compatible localhost endpoint.
- They are often the more realistic choice when the goal is **fully local chat plus local completion**, because first-party Copilot still does not connect local models to inline suggestions.

---

## Workflow Fit By Path

| Workflow | Stable native built-in providers | Stable native extension-provided providers | Insiders Custom Endpoint | Third-party extensions / raw local endpoint |
|---|---|---|---|---|
| Chat in VS Code | Yes, for providers VS Code already supports | Yes, if an extension exposes the provider | Yes, for compatible endpoints | Yes |
| Agent mode in VS Code chat | Yes, if the model supports tool calling | Yes, if the extension exposes a tool-capable model | Yes, if the endpoint model supports tool calling | Yes, if the extension supports agent workflows |
| Prompt files | Yes, over whichever chat model is available | Yes | Yes | No native Copilot prompt-file reuse; third-party tools have their own prompt systems |
| Custom agents | Yes, over whichever chat model is available | Yes | Yes | No native Copilot custom-agent reuse; third-party tools have their own agent systems |
| Inline chat | Yes | Yes | Yes, through the chat model path | Often an extension-specific equivalent, not native Copilot inline chat |
| Copilot inline suggestions / ghost text | No local model path documented | No local model path documented | No local model path documented | Yes, if the extension implements completion itself |
| Local inline completion outside Copilot | Not the documented path | Not the documented path | Not the documented path | Yes |
| API-compatible app development | Indirect only | Indirect only | Useful for native chat experiments, not primary app tooling | Yes; raw local endpoint is usually the main abstraction |

---

## Prompt Files And Custom Agents

Prompt files and custom agents still matter in this comparison, but only after the model path is separated correctly.

- In native Copilot, prompt files and custom agents are **workflow layers**, not model providers.
- They can be used with any chat model that is actually available through the native model system.
- They do **not** change the inline suggestions limitation.
- They do **not** by themselves prove that Ollama or llama.cpp are first-party supported native providers on stable VS Code.

This matters because it is easy to read "custom agents can prefer a model" as if that proves native direct support for a specific local runtime. It does not. It only proves that an already-available model can be preferred.

---

## Ollama vs llama.cpp Server

### Ollama

Ollama remains the easiest Windows starting point in this comparison.

- Ollama documents a native local API.
- Ollama documents native tool-calling support in its chat API.
- Ollama documents OpenAI Chat Completions compatibility and a default local endpoint at `http://localhost:11434`.

Practical reading from the verified sources:

- best first local runtime for Windows users who want a fast install and simple model management
- strong fit for extensions that can target Ollama directly
- strong fit for app development that only needs Chat Completions-style compatibility

Evidence limit in this note:

- the sources I checked clearly support Ollama's native API, tool calling, and OpenAI Chat Completions compatibility
- they do **not** give me equally direct first-party support for full Responses and Anthropic Messages parity, so I am not treating Ollama as source-backed equivalent to llama.cpp on that axis here

### llama.cpp server

llama.cpp server is the more protocol-flexible local endpoint in the sources checked for this note.

- It documents OpenAI-compatible **Chat Completions**, **Responses**, and **embeddings** routes.
- It documents an Anthropic-compatible **Messages** route.
- It documents function calling and related tool-call handling details.
- Continue documents a direct `provider: llama.cpp` configuration with `apiBase: http://localhost:8080`.

Practical reading from the verified sources:

- best when endpoint compatibility matters more than setup simplicity
- strongest source-backed fit for the **Insiders Custom Endpoint** path, because the API-type overlap is explicit
- better than Ollama when you want one local server family to cover Chat Completions, Responses, and Messages-style integrations

Tradeoff:

- more operational tuning than Ollama
- behavior can depend on templates, flags, and model-specific setup

### Bottom line

- **Ollama** is the easier Windows runtime.
- **llama.cpp server** is the more source-backed choice when protocol coverage is the deciding factor.

---

## Extension Notes

### Continue

Continue is the most complete local-first extension I verified for the workflows in scope.

- Its docs expose Agent, Chat, Autocomplete, and Edit features.
- Its provider docs explicitly include both **Ollama** and **llama.cpp**.
- Its docs also discuss local privacy-first autocomplete models and offline operation.

Pragmatic reading:

- if the goal is the broadest realistic local replacement for hosted chat plus completion in VS Code, Continue is the strongest documented fit in the sources checked here

That is a judgment call based on extension docs, not a first-party VS Code statement.

### Cline

Cline is the strongest documented fit here for agent-heavy local workflows.

- Its README explicitly lists **Ollama / LM Studio** and **Any OpenAI-compatible API**.
- It also documents MCP server support.

Pragmatic reading:

- strong for local agent workflows
- not the first choice if the main requirement is Copilot-style ghost-text completion

### Twinny

Twinny is a lighter local-first option.

- Its README lists **localhost OpenAI/Ollama Compatible API** as the default supported provider.
- It explicitly offers fill-in-the-middle completion and sidebar chat.
- It explicitly claims online and offline operation.

Pragmatic reading:

- reasonable when the target is local chat plus local completion with less complexity than a larger agent platform

### OpenCode

OpenCode is better understood as a **terminal-first coding agent** with a VS Code extension, not as a native Copilot model provider.

- Its docs describe it as an open source AI coding agent available as a **terminal interface**, **desktop app**, and **IDE extension**.
- Its VS Code integration centers on running `opencode` in the integrated terminal, then using the extension for quick launch, context sharing, and file-reference shortcuts.
- Its docs explicitly support local providers including **Ollama**, **llama.cpp**, **LM Studio**, and generic **OpenAI-compatible** custom providers.
- Its workflow is agent-oriented: `/init` creates an `AGENTS.md` file for project guidance, and the built-in `build` and `plan` agents separate edit-capable and read-only work.
- On Windows, OpenCode's docs recommend **WSL** for the best compatibility and performance.

Pragmatic reading:

- strong alternative when the goal is a **local agent workflow** more than native VS Code chat integration
- stronger fit for users comfortable with a terminal-first loop than for users primarily seeking Copilot-style inline suggestions
- notable advantage over some extension-only tools: its local provider story is directly documented by OpenCode itself, including explicit examples for Ollama and llama.cpp

### Tabby

Tabby is better understood as a self-hosted coding-assistant stack than as an Ollama or llama.cpp adapter.

- Its README positions it as a self-hosted alternative to GitHub Copilot.
- It documents an OpenAPI interface.
- It is relevant when the priority is self-hosted team infrastructure.

Pragmatic reading:

- compelling when the main requirement is a self-hosted coding-assistant platform
- less direct if the starting requirement is specifically "use Ollama" or "use llama.cpp server"

---

## Pragmatic Guidance For A Windows User Interested In Ollama And llama.cpp

These are recommendations, not first-party truths.

### If you want to stay closest to native stable VS Code

Use a **hybrid approach**:

- keep Copilot for inline suggestions
- use native chat with whichever stable provider path is actually available to you
- treat extension-provided model providers as a distinct stable option if one exposes the local model you want

Why this is pragmatic:

- it preserves the strongest native inline-suggestion UX
- it avoids overstating stable native support for arbitrary local endpoints

### If you are willing to use VS Code Insiders for native chat plumbing

Use the **Custom Endpoint** path.

- prefer **llama.cpp server** when you want the strongest documented alignment with Chat Completions, Responses, and Messages
- treat **Ollama** as a practical candidate when Chat Completions-style compatibility is enough

Why this is pragmatic:

- this is the clearest first-party documented route for arbitrary compatible local endpoints
- llama.cpp maps most directly to the documented API-type surface

### If you want local chat plus local completion today

Use a third-party extension.

- **Ollama + Continue** is the clearest documented default from the sources checked here
- **llama.cpp server + Continue** is a strong choice when protocol control matters more than runtime simplicity
- **Twinny** is a lighter alternative if you mainly want local chat plus local completion

Why this is pragmatic:

- Copilot still does not connect local models to inline suggestions
- third-party extensions are the documented place where local completion actually exists today

### If you want a terminal-first local agent instead of a chat sidebar

Use **OpenCode**.

- pair it with **Ollama** when you want the simpler Windows local runtime
- pair it with **llama.cpp server** when you want a more configurable local endpoint surface
- expect a workflow centered on the integrated terminal and OpenCode's own agents, not native Copilot prompt files or Copilot inline suggestions

Why this is pragmatic:

- OpenCode directly documents local-provider support for Ollama, llama.cpp, LM Studio, and generic OpenAI-compatible endpoints
- its VS Code extension is designed to support the terminal agent rather than replace the editor with a separate hosted-only model path

### If your real goal is local app development rather than IDE parity

Pick the runtime first, then choose the editor workflow separately.

- use **Ollama** when easy Windows setup and Chat Completions compatibility are enough
- use **llama.cpp server** when you want broader protocol coverage from one local server family

---

## Important Limits And Evidence Gaps

- Stable first-party VS Code docs support local-model chat, but they do **not** generally prove native stable direct support for arbitrary Ollama or llama.cpp endpoints.
- The first-party arbitrary compatible-endpoint story is currently documented under **VS Code Insiders** through the **Custom Endpoint** provider.
- Stable first-party docs do support **extension-provided model providers**, but that is still separate from claiming built-in native support for Ollama or llama.cpp.
- The first-party docs explicitly say local models **cannot currently be connected to Copilot inline suggestions**.
- The first-party docs also say local-model use still requires the **Copilot service**, a **Copilot plan**, and being **online**.
- In agent mode, **tool calling** remains the gating capability for whether a model appears in the picker.
- In the agents docs, `local` refers to where the **agent session** runs, not automatically to where the **model** runs.
- In the source set used here, Ollama is strongly documented for native API use, tool calling, and Chat Completions compatibility. I did not verify equally explicit first-party documentation for full Responses and Messages parity from Ollama.

---

## Sources

### VS Code and GitHub Copilot

- Visual Studio Code: `AI language models in VS Code`  
  https://code.visualstudio.com/docs/copilot/customization/language-models
- Visual Studio Code: `Language models`  
  https://code.visualstudio.com/docs/copilot/concepts/language-models
- Visual Studio Code: `Customize AI in VS Code`  
  https://code.visualstudio.com/docs/copilot/customization/overview
- Visual Studio Code: `GitHub Copilot agents overview`  
  https://code.visualstudio.com/docs/copilot/agents/overview
- Visual Studio Code: `Inline suggestions from GitHub Copilot in VS Code`  
  https://code.visualstudio.com/docs/copilot/ai-powered-suggestions

### Ollama

- Ollama: `OpenAI compatibility`  
  https://ollama.com/blog/openai-compatibility
- Ollama: `API`  
  https://github.com/ollama/ollama/blob/main/docs/api.md

### llama.cpp

- llama.cpp: `tools/server/README.md`  
  https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md

### Marketplace extensions and self-hosted alternatives

- Continue Docs: `How to Configure Ollama with Continue`  
  https://docs.continue.dev/customize/model-providers/top-level/ollama
- Continue Docs: `Llama.cpp`  
  https://docs.continue.dev/customize/model-providers/more/llamacpp
- Continue Docs: `Recommended Models for Autocomplete in Continue`  
  https://docs.continue.dev/ide-extensions/autocomplete/model-setup
- Cline README  
  https://github.com/cline/cline
- Twinny README  
  https://github.com/rjmacarthy/twinny
- OpenCode: `Intro`  
  https://opencode.ai/docs/
- OpenCode: `IDE`  
  https://opencode.ai/docs/ide/
- OpenCode: `Providers`  
  https://opencode.ai/docs/providers/
- OpenCode README  
  https://github.com/anomalyco/opencode
- Tabby README  
  https://github.com/TabbyML/tabby
